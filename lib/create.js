"use strict"

// const chalk = require('chalk');
// const fs = require('fs');
// const path = require('path');
// require('shelljs/global');
const semver = require('semver');

// const log = function(...txt) {
//   echo(chalk.magenta(...txt))
// }

function create(options) {
  const projectName = options[0];
  options = [...options].slice(1);
  echo('createProject beginning...\n');
  echo('projectName:', '😃', projectName);
  echo('options:', options);
  // log('createProject beginning...');
  // log('projectName:', projectName);
  // log('templateType:', templateType);
  // var p = process.cwd(); /** 命令行运行页面路径 */
  // cd(p)
  const useTypeScript = options.includes("-typescript");
  console.log("useTypeScript", useTypeScript)
  // check typescript support.
  const unsupportedNodeVersion = !semver.satisfies(process.version, '>=8.10.0');
  if (unsupportedNodeVersion && useTypeScript) {
    console.error(
      chalk.red(
        `You are using Node ${process.version} with the TypeScript template. Node 8.10 or higher is required to use TypeScript.\n`
      )
    );

    process.exit(1);
  } else if (unsupportedNodeVersion) {
    console.log(
      chalk.yellow(
        `You are using Node ${process.version} so the project will be bootstrapped with an old unsupported version of tools.\n\n` +
        `Please update to Node 8.10 or higher for a better, fully supported experience.\n`
      )
    );
    // Fall back to latest supported react-scripts on Node 4
    version = 'react-scripts@0.9.x';
  }
}

module.exports = create
