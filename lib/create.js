"use strict"

const path = require("path");
const fs = require("fs-extra");
const semver = require("semver");
const validateProjectName = require("validate-npm-package-name");
const inquirer = require("inquirer");
const { clearConsole } = require("./utils/log");
const { logWithSpinner, stopSpinner } = require("./utils/spinner");
const { hasYarn } = require("./utils/env");
const { getPromptModules } = require("./utils/createTools");
const PromptModuleAPI = require("./PromptModuleAPI");
const optionConfig = require("../config/command/command.json").commands.create.option.split(",");
const sortObject = require("./utils/sortObject");
const getVersion = require("./utils/getVersion");
const writeFileTree = require("./utils/writeFileTree");
const copyTemplate = require("./utils/copyTemplate");

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
  let useVue = ops.includes("--vue") || ops.includes("-v");
  let useReact = ops.includes("--react") || ops.includes("-r");
  if (useVue && useReact) {
    echo(chalk.red("\n Only one template type is allowed.\n"));
    process.exit(1);
  }

  const preset = {};

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
            { name: "Merge", value: "merge" },
            { name: "Cancel", value: false }
          ]
        }
      ]);
      if (!action) {
        return
      } else if (action === "overwrite") {
        preset.removeDir = true;
      }
    }
  }

  // check typescript support.
  const useTypeScript = ops.includes("--typescript") || ops.includes("-t");
  const unsupportedNodeVersion = !semver.satisfies(process.version, ">=8.10.0");
  if (unsupportedNodeVersion && useTypeScript) {
    echo(
      chalk.red(
        `\nYou are using Node ${process.version} with the TypeScript template. Node 8.10 or higher is required to use TypeScript.\n`
      )
    );

    process.exit(1);
  }

  // Get a global preset, every next step will depend on it.
  Object.assign(preset, await promptAndResolvePreset());
  async function promptAndResolvePreset(answers = null) {
    await clearConsole();
    // prompt
    if (useVue || useReact) {
      echo(
        chalk.green("?"),
        chalk.bold("Selected project template:"),
        chalk.cyan(useReact && "React" || useVue && "Vue")
      );
    }

    // Choose features
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
    const preset = {
      useConfigFiles: true,
      scripts: {},
      modules: {},
      plugins: {}
    };

    // console.log("debug: answers - ", answers);

    // 通过 prompt modules 里注册的回调函数，把选择的 answers 解析到 preset 里
    promptCompleteCbs.forEach(cb => cb(answers, preset));

    // console.log("debug: preset - ", preset);
    return preset;
  }

  const useYarn = hasYarn();
  const packageManager = useYarn ? "yarn" : null;

  // Beginning create.
  install();
  async function install() {
    await clearConsole()
    if (preset.removeDir) {
      logWithSpinner("🗑 ", `Removing ${chalk.yellow(targetDir)}...`);
      fs.removeSync(targetDir);
    }
    logWithSpinner("✨", `Creating project in ${chalk.cyan(targetDir)}...`);

    const packageJson = parsePresetToPkg(preset);

    if (useVue) {
      // get latest CLI plugin version
      const latest = await getVersion("vue-cli-version-marker");
      for (const dep in packageJson.devDependencies) {
        // Note: the default creator includes no more than `@vue/cli-*` & `@vue/babel-preset-env`,
        // so it is fine to only test `@vue` prefix.
        // Other `@vue/*` packages' version may not be in sync with the cli itself.
        packageJson.devDependencies[dep] = (
          ((/^@vue/.test(dep)) ? `~${latest}` : "latest")
        );
      }
      for (const dep in packageJson.dependencies) {
        packageJson.dependencies[dep] = "latest";
      }
    }
    if (useReact) {
      const latest = await getVersion("react");
      for (const dep in packageJson.devDependencies) {
        packageJson.devDependencies[dep] = "latest";
      }
      for (const dep in packageJson.dependencies) {
        packageJson.dependencies[dep] = (
          ((/react|react-dom/.test(dep)) ? `^${latest}` : "latest")
        );
      }
    }

    const pkgStr = await getPackageVersion(packageJson);

    // write package.json
    await writeFileTree(targetDir, {
      'package.json': pkgStr
    })

    // create template files
    // await copyTemplate(preset);

    // setTimeout(() => {
    //   logWithSpinner("🗃 ", "Initializing git repository...");
    // }, 3000)
    setTimeout(() => {
      stopSpinner()
      echo("⚙\u{fe0f}   Installing CLI plugins. This might take a while...")
      echo()
      echo("🚀  Invoking generators...")
      echo("📦  Installing additional dependencies...")
      echo("📦  Installing packages. This might take a couple of minutes...")
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
          `\n👉  Get started by typing:\n\n` +
          (targetDir === process.cwd() ? "" : chalk.cyan(` ${chalk.gray("$")} cd ${name}\n`)) +
          chalk.cyan(` ${chalk.gray("$")} ${packageManager === "yarn" ? "yarn start" : "npm start"}`)
          // TODO: 兼容 react 的启动方式 “start”
        )
      }
      echo()
      // this.emit("creation", { event: "done" })
    }, 12000)
  }

  function resolveIntroPrompts() {
    const featurePrompt = {
      name: "features",
      when: true,
      type: "checkbox",
      message: "Check the features needed for your project:",
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
    const templatePrompt = {
      name: "template",
      type: "list",
      message: "Pick a template you want:",
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
      templatePrompt,
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

  function parsePresetToPkg(preset) {
    const pkg = {
      name,
      version: "0.1.0",
      private: true,
      scripts: {
        ...preset.scripts
      },
      dependencies: {
        ...preset.modules
      },
      devDependencies: {
        ...preset.plugins
      },
    };
    return sortPkg(pkg);
  }

  function sortPkg(pkg) {
    // ensure package.json keys has readable order
    pkg.dependencies = sortObject(pkg.dependencies);
    pkg.devDependencies = sortObject(pkg.devDependencies);
    pkg.scripts = sortObject(pkg.scripts, [
      "start",
      "build",
      "test:unit",
      "test:e2e",
      "lint",
      "deploy"
    ]);
    pkg = sortObject(pkg, [
      "name",
      "version",
      "private",
      "description",
      "author",
      "scripts",
      "main",
      "module",
      "browser",
      "jsDelivr",
      "unpkg",
      "files",
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "vue",
      "babel",
      "eslintConfig",
      "prettier",
      "postcss",
      "browserslist",
      "jest"
    ]);
    return pkg;
  }

  async function getPackageVersion(pkg) {
    for (const key of ["dependencies", "devDependencies"]) {
      for (const id in pkg[key]) {
        if (pkg[key][id] === "latest") {
          pkg[key][id] = "^" + await getVersion(id);
        }
      }
    }

    return JSON.stringify(pkg, null, 2);
  }
}

module.exports = create;
