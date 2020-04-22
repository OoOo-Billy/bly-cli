"use strict"

function CommandRunner() {
  this.map = {};

  this.run = (commandName) => {
    if(this.check(commandName)) {
      this.map[commandName[0]](commandName.slice(1));
    }
  }

  this.check = (commandName) => {
    if(!this.map[commandName[0]]) {
      console.log("no command: " + commandName[0]);
      return false;
    }
    return true;
  }

  this.register = (commandName, fn) => {
    // TODO: 寻找更好的方式注册 actions
    this.map[commandName] = fn
  }
}

const runner = new CommandRunner();

module.exports = {
  run: runner.run,
  register: runner.register
}