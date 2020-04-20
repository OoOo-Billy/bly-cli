#!/usr/bin/env node

"use strict"

const CONFIG = require("./config");

console.log("config", CONFIG);

// const commands = process.argv.slice(2);

// console.log("commands", commands);

// function registerCommands(commands) {

// }

function runCommand(command) {
  // TODO
}

const METHODS = {
  getVersion() {
    console.log("v" + CONFIG.VERSION);
    return CONFIG.VERSION;
  }
}


// function registerComFnGenerator(type) {
//   function registerCommandsFn() {}
//   return function() {}
// }