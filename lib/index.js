"use strict"

const exec = require("child_process").exec;

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
      help.push(`${createSpace(6)}${cStr}${createSpace(helpSpaceBetween - cStr.length)}${config.commands[name].description}\n`);
    }
  }
  echo(
    `
    Usage:
      bly <command> [options]

    Commands
${help.join("")}
    🌈 Happy hacking! 🌈
    `);

  function createSpace(num) {
    const str = Array.from({length: num}, () => " ");
    return str.join("");
  }
}

function runScript(c) {
  echo("running...", c);
  exec("npm run" + c[0], function(err, stdout, stderr) {
    if(err) {
      console.log(err);
      console.log(stderr);
    } else {
      console.log(stdout);
    }
  });
}

module.exports = {
  getVersion,
  getHelp,
  runScript,
  create
}