"use strict"

const commandConfigs = require("../config/command");
const create = require("./create");

function getVersion() {
  const CONFIG = require("../config");
  echo("v" + CONFIG.VERSION);
  return CONFIG.VERSION;
}

function getHelp() {
  const helpSpaceBetween = 15;
  const help = [];
  for (let config of commandConfigs) {
    const t = config.template;
    for (let name in config.commands) {
      const cStr = name.split(",").map(n => t.replace("$", n)).join(",");
      help.push(`${createSpace(6)}${cStr}${createSpace(helpSpaceBetween - cStr.length)}im a long long text.\n`);
    }
  }
  echo(
    `
    Usage:
      bly <command> [options]

    Commands
${help.join("")}

    Examples
      $ foo unicorns --rainbow
      🌈 unicorns 🌈
    `);

  function createSpace(num) {
    const str = Array.from({length: num}, () => " ");
    return str.join("");
  }
}

function runScript(c) {
  echo("running...", c);
}

module.exports = {
  getVersion,
  getHelp,
  runScript,
  create
}