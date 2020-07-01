const fs = require('fs-extra')
const path = require('path')
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
      writeFileObj[filePath] = fs.readFileSync(fixedDir + '/' + filePath)
    }
    // write template files
    await writeFileTree(targetDir, writeFileObj)
  }
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
      } else if (typeof fileTree[key] === 'object') {
        path.push(key)
        fileTree[key].forEach(file => {
          resolve[file] = [...path]
        })
        cb()
      } else {
        path.push(key)
        resolve[fileTree[key]] = [...path]
        cb()
      }
    }
  }
}

module.exports = GeneratorAPI
