"use strict"

const path = require("path");
const fs = require("fs");
const semver = require("semver");
const validateProjectName = require("validate-npm-package-name");
const inquirer = require("inquirer");
const { clearConsole } = require("./utils/log");
const { logWithSpinner, stopSpinner } = require("./utils/spinner");
const { hasYarn } = require("./utils/env");
const { getPromptModules } = require('./utils/createTools');
const PromptModuleAPI = require('./PromptModuleAPI');
const optionConfig = require("../config/command/command.json").commands.create.option.split(",");
const getVersion = require("./utils/getVersion");

async function create(options) {
  const promptCompleteCbs = [];

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
            { name: 'Merge', value: 'merge' },
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

  // choose features
  await promptAndResolvePreset();
  async function promptAndResolvePreset(answers = null) {
    await clearConsole();
    // prompt
    if (useVue || useReact) {
      echo(
        chalk.green("?"),
        chalk.bold("Selected project framework:"),
        chalk.cyan(useReact && "React" || useVue && "Vue")
      );
    }
    answers = await inquirer.prompt(resolvePrompts());

    switch (answers.template) {
      case "react":
        useReact = true;
        break;
      case "vue":
        useVue = true;
        break;
      default:
        answers.template = useReact && "react" || useVue && "vue"
    }

    answers.features = answers.features || [];

    // 创建项目的所有配置最终都会解析在 preset 里.
    let preset = {
      plugins: {}
    };

    // console.log("debug: answers - ", answers);

    // 通过 prompt modules 里注册的回调函数，把选择的 answers 解析到 preset 里
    promptCompleteCbs.forEach(cb => cb(answers, preset));

    // console.log("debug: preset - ", preset);
    return preset;
  }

  // getVersion();

  const packageManager = hasYarn() ? "yarn" : null;

  // Beginning create.
  begin();
  async function begin() {
    await clearConsole()
    logWithSpinner("✨", `Creating project in ${chalk.yellow(targetDir)}.`);
    setTimeout(() => {
      logWithSpinner("🗃 ", "Initializing git repository...");
    }, 3000)
    setTimeout(() => {
      stopSpinner()
      echo("⚙\u{fe0f}   Installing CLI plugins. This might take a while...")
      echo()
      echo("🚀  Invoking generators...")
      echo("📦  Installing additional dependencies...")
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

  function resolveIntroPrompts() {
    const featurePrompt = {
      name: 'features',
      when: true,
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [],
      default: [...resolveDefaultCheckedFeatures()],
      pageSize: 10
    }
    return {
      // presetPrompt,
      featurePrompt
    }
  }

  function resolvePrompts() {
    const frameworkPrompt = {
      name: "template",
      type: "list",
      message: "Pick the framework you want:",
      when: () => !useVue && !useReact,
      choices: [
        { name: "React", value: "react" },
        { name: "Vue", value: "vue" }
      ]
    };
    const { featurePrompt } = resolveIntroPrompts();
    const injectedPrompts = [];
    const promptAPI = new PromptModuleAPI(
      featurePrompt,
      injectedPrompts,
      promptCompleteCbs
    );
    const promptModules = getPromptModules();
    promptModules.forEach(m => m(promptAPI));

    const prompts = [
      frameworkPrompt,
      featurePrompt,
      ...injectedPrompts
    ]
    return prompts;
  }

  function resolveDefaultCheckedFeatures() {
    const result = [];

    if (useTypeScript) result.push("ts");

    return result;
  }
}

module.exports = create
