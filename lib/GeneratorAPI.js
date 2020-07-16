const fs = require('fs-extra')
const path = require('path')
const ejs = require('ejs')
const writeFileTree = require('./utils/writeFileTree')

const GeneratorAPI = function (config) {
  this.readPath = []

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

  this.render = async function (parsed, fixedDir, targetDir) {
    const writeFileObj = {}
    for (const fileName in parsed) {
      const filePath = path.join(parsed[fileName], fileName)
      const restoreFilePath = this.restore(filePath)
      writeFileObj[restoreFilePath] = ejs.render(
        fs.readFileSync(fixedDir + '/' + filePath, 'utf8'),
        { renderOptions: config },
        {}
      )
    }
    // write template files
    await writeFileTree(targetDir, writeFileObj)
  }
}

GeneratorAPI.prototype.restore = function (filePath) {
  return filePath.replace(/\_\_/g, '.')
}

GeneratorAPI.prototype.parse = function (
  fileTree,
  path,
  resolve,
  cb,
  parentKey
) {
  if (typeof fileTree === 'object') {
    for (const key in fileTree) {
      if (parentKey) {
        path.splice(0, path.length, ...parentKey)
      }
      if (Object.prototype.toString.call(fileTree[key]) === '[object Object]') {
        this.parse(
          fileTree[key],
          path,
          resolve,
          cb,
          parentKey ? [...parentKey, key] : [key]
        )
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
