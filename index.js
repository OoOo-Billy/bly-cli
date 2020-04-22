#!/usr/bin/env node

"use strict"

const CONFIG = require("./config");

const commands = process.argv.slice(2);

const runner = new CommandRunner(registerCommands(CONFIG));

start();

function start() {
  if(!commands.length) return;
  runner.run(commands);
}

function registerCommands(config) {
  const mapCommand = {};
  for(let key in config) {
    if(key.includes("COMMANDS")) {
      const pre = key.split("_")[0];
      config[key].forEach(i => {
        const c = i.split(":");
        mapCommand[config[pre + "_TEMPLATE"].replace("$", c[0])] = c[1];
      });
    }
  }

  return mapCommand;
}

function CommandRunner(map) {

  this.run = function(commandName) {
    if(this.check(commandName)) {
      this[map[commandName[0]]](commandName.slice(1));
    }
  }

  this.getVersion = function() {
    console.log("v" + CONFIG.VERSION);
    return CONFIG.VERSION;
  };
  this.getHelp = function(c) {
    console.log("no help", c);
  };
  this.runScript = function(c) {
    console.log("running...", c);
  };
  this.check = function(commandName) {
    if(!map[commandName[0]]) {
      console.log("no command: " + commandName[0]);
      return false;
    }
    return true;
  }
}
