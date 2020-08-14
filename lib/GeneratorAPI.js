const fs = require('fs-extra')
const path = require('path')
const ejs = require('ejs')
const writeFileTree = require('./utils/writeFileTree')

const GeneratorAPI = function (config) {
  this.readPath = []
  this.renderQueue = {}
  this.context = config.targetDir
  this.useTs = false
  this.excludeFiles = []

  this.push = function (map) {
    Object.assign(this.renderQueue, map)
  }

  this.parseFileTree = function (fileTree) {
    const parsed = {},
      readPath = []
    this.parse(fileTree, readPath, parsed, () => {
      readPath.length = 0
    })

    for (const key in parsed) {
      parsed[key] = parsed[key].join('/')
    }
    return parsed
  }

  this.render = function (parsed, fixedDir) {
    const exclude = ['.ico', '.png']
    const writeFileObj = {}
    for (const fileName in parsed) {
      const filePath = path.join(parsed[fileName], fileName)
      const restoreFilePath = this.restore(filePath)
      if (exclude.includes(path.extname(restoreFilePath))) {
        writeFileObj[restoreFilePath] = fs.readFileSync(fixedDir + '/' + filePath)
        continue
      }
      writeFileObj[restoreFilePath] = ejs.render(
        fs.readFileSync(fixedDir + '/' + filePath, 'utf8'),
        { renderOptions: config },
        {}
      )
    }
    // Push into queue
    this.push(writeFileObj)
  }

  this.invokeRender = async function () {
    for (const path in this.renderQueue) {
      if (this.useTs && /\.jsx?$/.test(path) && !this.excludeFiles.includes(path)) {
        const p = path.replace(/\.js/, '.ts')
        this.renderQueue[p] = this.renderQueue[path]
        delete this.renderQueue[path]
      }
    }
    // write template files
    await writeFileTree(this.context, this.renderQueue)
  }

  this.transformTs = function () {
    this.useTs = true
  }

  this.excludeTs = function (excludeFiles) {
    this.excludeFiles.push(...excludeFiles)
  }
}

GeneratorAPI.prototype.restore = function (filePath) {
  return filePath.replace(/\_\_/g, '.')
}

GeneratorAPI.prototype.parse = function (fileTree, path, resolve, cb, parentKey) {
  if (typeof fileTree === 'object') {
    for (const key in fileTree) {
      if (parentKey) {
        path.splice(0, path.length, ...parentKey)
      }
      if (Object.prototype.toString.call(fileTree[key]) === '[object Object]') {
        this.parse(fileTree[key], path, resolve, cb, parentKey ? [...parentKey, key] : [key])
      } else if (Array.isArray(fileTree[key])) {
        path.push(key)
        fileTree[key].forEach(file => {
          resolve[file] = [...path]
        })
        cb()
      } else if (typeof fileTree[key] === 'object') {
        continue
      } else {
        path.push(key)
        resolve[fileTree[key]] = [...path]
        cb()
      }
    }
  }
}

module.exports = GeneratorAPI
