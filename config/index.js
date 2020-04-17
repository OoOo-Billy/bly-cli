"use strict"

const { commandsConfigs } = require("./commands");

const config = {};

const MST_COMMANDS = [];
const DEV_COMMANDS = [];
// const MST_COMMANDS = getCommandsName(mst.commands);
// const DEV_COMMANDS = getCommandsName(dev.commands);

// 从指令json文件获取指令的名称集合
function getCommandsName(commands) {
  return Object.keys(commands);
}

// TODO 分离函数
function wait() {}

module.exports = {
  MST_COMMANDS,
  DEV_COMMANDS
}