"use strict"

// const chalk = require('chalk');
// const fs = require('fs');
const path = require('path');
// require('shelljs/global');
const validateProjectName = require('validate-npm-package-name');
const semver = require('semver');

function create(options) {
  if (!options.length) return echo(chalk.red(`\n  Missing required argument ${chalk.yellow("<app-name>")}.\n`));

  // TODO: 处理 参数
  let projectName = [], ops = []
  for (let op of options) {
    if (op.startsWith("-")) {
      ops.push(op);
    } else {
      projectName.push(op);
    }
  }
  console.log(projectName);
  console.log(ops);
  // options = [...options].slice(1);

  const cwd = process.cwd();
  const inCurrent = projectName === '.';
  const name = inCurrent ? path.relative('../', cwd) : projectName;

  echo('\ncreateProject beginning...\n');
  echo('projectName:', '😃', name);
  echo('options:', options);

  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    echo(chalk.red(`Invalid project name: "${name}"`));
    result.errors && result.errors.forEach(err => {
      echo(chalk.red('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      echo(chalk.yellowBright.dim('Warning: ' + warn))
    })
    process.exit(1);
  }

  const useTypeScript = options.includes("-typescript");
  console.log("useTypeScript", useTypeScript);
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

  // Unknown option -t.
}

module.exports = create
