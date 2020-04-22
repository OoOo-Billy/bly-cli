#!/usr/bin/env node

"use strict"

const CONFIG = require("./config");
const commander = require("./lib/commander");
const actions = require("./lib");

const commands = process.argv.slice(2);

registerCommands(CONFIG);

start();

function start() {
  if(!commands.length) return;
  commander.run(commands);
}

function registerCommands(config) {
  // const mapCommand = {};
  for(let key in config) {
    if(key.includes("COMMANDS")) {
      const pre = key.split("_")[0];
      config[key].forEach(i => {
        const c = i.split(":");
        // mapCommand[config[pre + "_TEMPLATE"].replace("$", c[0])] = c[1];
        commander.register(config[pre + "_TEMPLATE"].replace("$", c[0]), actions[c[1]]);
      });
    }
  }

  // return mapCommand;
}



