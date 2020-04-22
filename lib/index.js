"use strict"

const create = require("./create");

function getVersion() {
  const CONFIG = require("../config");
  console.log("v" + CONFIG.VERSION);
  return CONFIG.VERSION;
}

function getHelp(c) {
  console.log("no help", c);
}

function runScript(c) {
  console.log("running...", c);
}

module.exports = {
  getVersion,
  getHelp,
  runScript,
  create
}