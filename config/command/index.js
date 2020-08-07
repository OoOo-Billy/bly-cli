'use strict'

const fs = require('fs')
const Path = require('path')

function readCommandsSetting() {
  const commandsConfigs = []

  const files = fs.readdirSync(__dirname).filter(file => {
    return Path.extname(file).toLowerCase() === '.json'
  })

  files.forEach(fileName => {
    commandsConfigs.push(
      JSON.parse(fs.readFileSync(Path.normalize(__dirname + '/' + fileName), 'utf-8'))
    )
  })

  return commandsConfigs
}

const setting = readCommandsSetting()

module.exports = setting
