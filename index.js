#!/usr/bin/env node

"use strict"

const config = require("./config");

console.log("config", config);

// const MST_COMMANDS = config.MST_COMMANDS; // 辅助指令
// const DEV_COMMANDS = config.DEV_COMMANDS; // 开发指令

// const version = require("./package.json").version;

// const commands = process.argv.slice(2);

// console.log("commands", commands);

// function registerCommands(commands) {

// }

// function registerComFnGenerator(type) {
//   function registerCommandsFn() {}
//   return function() {}
// }