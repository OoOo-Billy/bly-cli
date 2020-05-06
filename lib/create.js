"use strict"

const path = require("path");
const fs = require("fs");
const semver = require("semver");
const validateProjectName = require("validate-npm-package-name");
const inquirer = require("inquirer");
const { clearConsole } = require("./utils/log");
const { logWithSpinner, stopSpinner } = require("./utils/spinner");
const { hasYarn } = require("./utils/env");
const optionConfig = require("../config/command/command.json").commands.create.option.split(",");

async function create(options) {
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
    echo(chalk.yellow("\n Info: You provided more than one argument. The first one will be used as the app\"s name, the rest are ignored."));
    projectName = projectName.slice(0, 1);
  }

  const cwd = process.cwd();
  const inCurrent = projectName[0] === ".";
  const name = inCurrent ? path.relative("../", cwd) : projectName[0];
  const targetDir = path.resolve(cwd, projectName[0] || ".");

  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    echo(chalk.red(`Invalid project name: "${name}"`));
    result.errors && result.errors.forEach(err => {
      echo(chalk.red("Error: " + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      echo(chalk.yellowBright("Warning: " + warn))
    })
    process.exit(1);
  }

  ops.forEach(o => {
    if (!optionConfig.includes(o)) {
      echo(chalk.red(`\n Unknown option ${chalk.yellow(o)}.\n`));
      process.exit(1);
    }
  });

  // check template type
  let useVue = ops.includes("-vue");
  let useReact = ops.includes("-react");
  if (useVue && useReact) {
    echo(chalk.red("\n Only one template type is allowed.\n"));
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    await clearConsole();
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: "ok",
          type: "confirm",
          message: `Generate project in current directory?`
        }
      ]);
      if (!ok) {
        return
      }
    } else {
      const { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
          choices: [
            { name: "Overwrite", value: "overwrite" },
            { name: "Cancel", value: false }
          ]
        }
      ]);
      if (!action) {
        return
      } else if (action === "overwrite") {
        echo(`\nRemoving ${chalk.cyan(targetDir)}...`);
        fs.rmdirSync(targetDir);
      }
    }
  }

  // check typescript support.
  const useTypeScript = ops.includes("-typescript");
  const unsupportedNodeVersion = !semver.satisfies(process.version, ">=8.10.0");
  if (unsupportedNodeVersion && useTypeScript) {
    echo(
      chalk.red(
        `\nYou are using Node ${process.version} with the TypeScript template. Node 8.10 or higher is required to use TypeScript.\n`
      )
    );

    process.exit(1);
  }

  // choose framework options
  prompt();
  async function prompt() {
    await clearConsole();
    if (!useVue && !useReact) {
      const { template } = await inquirer.prompt([
        {
          name: "template",
          type: "list",
          message: "Pick the framework you want:",
          choices: [
            { name: "React", value: "react" },
            { name: "Vue", value: "vue" }
          ]
        }
      ]);
      if (template === "react") {
        useReact = true;
      } else if (template === "vue") {
        useVue = true;
      }
    } else {
      echo(chalk.bold("🛠", " Selected project framework:"), chalk.cyan(useReact && "React" || useVue && "Vue"));
    }
  }

  const packageManager = hasYarn() ? "yarn" : null;

  // Beginning create.
  begin();
  async function begin() {
    await clearConsole()
    logWithSpinner("✨", `Creating project in ${chalk.yellow(targetDir)}.`);
    setTimeout(() => {
      logWithSpinner("🗃", "Initializing git repository...");
    }, 3000)
    setTimeout(() => {
      stopSpinner()
      echo(`⚙\u{fe0f}  Installing CLI plugins. This might take a while...`)
      echo()
      echo(`🚀  Invoking generators...`)
      echo(`📦  Installing additional dependencies...`)
      echo()
      logWithSpinner("⚓", "Running completion hooks...")
    }, 6000)
    setTimeout(() => {
      stopSpinner()
      echo()
      logWithSpinner("📄", "Generating README.md...")
    }, 9000)
    setTimeout(() => {
      stopSpinner()
      echo()
      echo(`🎉  Successfully created project ${chalk.yellow(name)}.`)
      if (true) {
        echo(
          `\n👉  Get started with the following commands:\n\n` +
          (targetDir === process.cwd() ? "" : chalk.cyan(` ${chalk.gray("$")} cd ${name}\n`)) +
          chalk.cyan(` ${chalk.gray("$")} ${packageManager === "yarn" ? "yarn serve" : "npm run serve"}`)
          // TODO: 兼容 react 的启动方式 “start”
        )
      }
      echo()
      // this.emit("creation", { event: "done" })
    }, 12000)
  }
}

module.exports = create
