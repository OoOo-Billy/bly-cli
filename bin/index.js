#!/usr/bin/env node

'use strict'

const CONFIG = require('../config')
const CommandRunner = require('../lib/CommandRunner')
const actions = require('../lib')

global.chalk = require('chalk')
global.echo = function (...log) {
  console.log(...log)
}

/**
 * Assigning a property on process.env will implicitly convert the value to a string. This behavior
 * is deprecated. Future versions of Node.js may throw an error when the value is not
 * a string, number, or boolean.
 * http://nodejs.cn/api/process.html#process_process_env
 */
if (CONFIG.isTestOrDebug) {
  process.env.BLY_CLI_DEBUG = true
}

const commander = new CommandRunner()

;(function registerCommands(config) {
  for (let key in config) {
    if (key.includes('COMMANDS')) {
      const pre = key.split('_')[0]
      config[key].forEach(i => {
        const c = i.split(':')
        commander.register(
          config[pre + '_TEMPLATE'].replace('$', c[0]),
          actions[c[1]]
        )
      })
    }
  }
})(CONFIG)

// Run command.
commander.run(process.argv)
