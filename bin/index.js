#!/usr/bin/env node

'use strict'

const CONFIG = require('../config')
const commander = require('../lib/commander')
const actions = require('../lib')

global.chalk = require('chalk')
global.echo = function (...log) {
  console.log(...log)
}
process.env.BLY_CLI_DEBUG = CONFIG.isTestOrDebug
registerCommands(CONFIG)

commander.run(process.argv) // run command.

function registerCommands(config) {
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
}
