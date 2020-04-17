"use strict"

// const { commands } = require("./commands");
require("./commands");

// console.log("11111111111111", commands)

const MST_COMMANDS = [];
const DEV_COMMANDS = [];
// const MST_COMMANDS = getCommandsName(mst.commands);
// const DEV_COMMANDS = getCommandsName(dev.commands);

// 从指令json文件获取指令的名称集合
function getCommandsName(commands) {
  return Object.keys(commands);
}

module.exports = {
  MST_COMMANDS,
  DEV_COMMANDS
}