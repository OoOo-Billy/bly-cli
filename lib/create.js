"use strict"

const path = require('path');
const semver = require('semver');
const validateProjectName = require('validate-npm-package-name');
const optionConfig = require("../config/command/command.json").commands.create.option.split(",");

function create(options) {
  let projectName = [], ops = [];
  for (let op of options) {
    if (op.startsWith("-")) {
      ops.push(op);
    } else {
      projectName.push(op);
    }
  }

  if (!projectName.length) return echo(chalk.red(`\n  Missing required argument ${chalk.yellow("<app-name>")}.\n`));
  if (projectName.length > 1) {
    echo(chalk.yellow("\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored."));
    projectName = projectName.slice(0, 1);
  }

  const cwd = process.cwd();
  const inCurrent = projectName[0] === '.';
  const name = inCurrent ? path.relative('../', cwd) : projectName[0];

  echo('\ncreateProject beginning...\n');
  echo('projectName:', '😃', name);
  echo('options:', ops);
  echo('optionConfig', optionConfig);

  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    echo(chalk.red(`Invalid project name: "${name}"`));
    result.errors && result.errors.forEach(err => {
      echo(chalk.red('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      echo(chalk.yellowBright('Warning: ' + warn))
    })
    process.exit(1);
  }

  ops.forEach(o => {
    if (!optionConfig.includes(o)) {
      echo(chalk.red(`Unknown option ${chalk.yellow(o)}.\n`));
      process.exit(1);
    }
  });

  const useTypeScript = ops.includes("-typescript");

  // check typescript support.
  const unsupportedNodeVersion = !semver.satisfies(process.version, '>=8.10.0');
  if (unsupportedNodeVersion && useTypeScript) {
    echo(
      chalk.red(
        `You are using Node ${process.version} with the TypeScript template. Node 8.10 or higher is required to use TypeScript.\n`
      )
    );

    process.exit(1);
  }

  // TODO: beginning create.
}

module.exports = create
