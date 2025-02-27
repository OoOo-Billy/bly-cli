'use strict'

const commandConfigs = require('./command')
const fs = require('fs')
const path = require('path')

const config = {}

function configVersion() {
  const VERSION = require('../package.json').version
  return { VERSION }
}

function commandConfigsGenerator() {
  const configs = {}

  for (let val of commandConfigs) {
    const type = val.type.toUpperCase()
    configs[type + '_TEMPLATE'] = val.template
    configs[type + '_COMMANDS'] = mapCommands(val.commands)
  }

  // 从指令json文件获取指令的名称集合
  function mapCommands(commands) {
    const commandMap = []

    for (let key in commands) {
      key.split(',').forEach(k => {
        commandMap.push(`${k}:${commands[key].method}`)
      })
    }

    return commandMap
  }

  return configs
}

function debugMode() {
  return {
    isTestOrDebug: !!fs.existsSync(path.resolve(__dirname, './TEST'))
  }
}

Object.assign(config, commandConfigsGenerator(), configVersion(), debugMode())

module.exports = config
