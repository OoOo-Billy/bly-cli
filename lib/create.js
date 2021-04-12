'use strict'

const path = require('path')
const fs = require('fs-extra')
const semver = require('semver')
const validateProjectName = require('validate-npm-package-name')
const inquirer = require('inquirer')
const { execSync } = require('child_process')
const { clearConsole } = require('./utils/log')
const { logWithSpinner, stopSpinner } = require('./utils/spinner')
const { hasYarn, hasGit } = require('./utils/env')
const { getPromptModules } = require('./utils/createTools')
const PromptModuleAPI = require('./PromptModuleAPI')
// TODO Waiting for optimization
const optionConfig = require('../config/command/command.json').commands.create.option.split(',')
const sortObject = require('./utils/sortObject')
const getVersion = require('./utils/getVersion')
const writeFileTree = require('./utils/writeFileTree')
const runGenerator = require('./runGenerator')
const PackageManager = require('./utils/PackageManager')
const generateReadme = require('./utils/generateReadme')
const chalk = require('chalk')
const { createLogSpace } = require('./utils')

async function create(options) {
  const isTestOrDebug = process.env.BLY_CLI_DEBUG
  const promptCompleteCbs = []

  let projectName = [],
    ops = []
  for (const op of options) {
    if (op.startsWith('-')) {
      ops.push(op)
    } else {
      projectName.push(op)
    }
  }

  if (!projectName.length)
    return echo(chalk.red(`\n  Missing required argument ${chalk.yellow('<app-name>')}.\n`))
  if (projectName.length > 1) {
    echo(
      chalk.yellow(
        "\n Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored."
      )
    )
    projectName = projectName.slice(0, 1)
  }

  const cwd = process.cwd()
  const inCurrent = projectName[0] === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName[0]
  const targetDir = path.resolve(cwd, projectName[0] || '.')

  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    echo(chalk.red(`Invalid project name: "${name}"`))
    result.errors &&
      result.errors.forEach(err => {
        echo(chalk.red('Error: ' + err))
      })
    result.warnings &&
      result.warnings.forEach(warn => {
        echo(chalk.yellowBright('Warning: ' + warn))
      })
    process.exit(1)
  }

  ops.forEach(o => {
    if (!optionConfig.includes(o)) {
      echo(chalk.red(`\n Unknown option ${chalk.yellow(o)}.\n`))
      process.exit(1)
    }
  })

  // check template type
  let useVue = ops.includes('--vue') || ops.includes('-v')
  let useReact = ops.includes('--react') || ops.includes('-r')
  if (useVue && useReact) {
    echo(chalk.red('\n Only one template type is allowed.\n'))
    process.exit(1)
  }

  const preset = {
    targetDir
  }

  if (fs.existsSync(targetDir)) {
    await clearConsole()
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `Generate project in current directory?`
        }
      ])
      if (!ok) {
        return
      }
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Merge', value: 'merge' },
            { name: 'Cancel', value: false }
          ]
        }
      ])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        preset.removeDir = true
      }
    }
  }

  // check typescript support.
  let useTypeScript = ops.includes('--typescript') || ops.includes('-t')
  const unsupportedNodeVersion = !semver.satisfies(process.version, '>=8.10.0')
  if (unsupportedNodeVersion && useTypeScript) {
    echo(
      chalk.red(
        `\nYou are using Node ${process.version} with the TypeScript template. Node 8.10 or higher is required to use TypeScript.\n`
      )
    )

    process.exit(1)
  }

  // Get a global preset, every next step will depend on it.
  Object.assign(preset, await promptAndResolvePreset())
  async function promptAndResolvePreset(answers = null) {
    await clearConsole()
    // prompt
    if (useVue || useReact) {
      echo(
        chalk.green('?'),
        chalk.bold('Selected project template:'),
        chalk.cyan((useReact && 'React') || (useVue && 'Vue'))
      )
    }

    // Choose features
    answers = await inquirer.prompt(resolvePrompts())

    // Update useTypeScript cause the selection may not be consistent
    // with original command
    useTypeScript = answers.features.includes('ts')

    switch (answers.template) {
      case 'react':
        useReact = true
        break
      case 'vue':
        useVue = true
        break
      default:
        answers.template = (useReact && 'react') || (useVue && 'vue')
    }

    answers.features = answers.features || []

    // 创建项目的所有配置最终都会解析在 preset 里.
    const preset = {
      template: (useReact && 'react') || (useVue && 'vue'),
      useConfigFiles: true,
      scripts: {},
      modules: {},
      plugins: {}
    }

    if (answers.packageManager) {
      preset.packageManager = answers.packageManager
    }

    // 通过 prompt modules 里注册的回调函数，把选择的 answers 解析到 preset 里
    promptCompleteCbs.forEach(cb => cb(answers, preset))

    return preset
  }

  const packageManager = preset.packageManager || (hasYarn() ? 'yarn' : 'npm')
  const pm = new PackageManager({ context: targetDir, packageManager })

  // Beginning create.
  creatingFilesAndTemplate()

  async function creatingFilesAndTemplate() {
    await clearConsole()
    if (preset.removeDir) {
      logWithSpinner('🗑 ', `Removing ${chalk.yellow(targetDir)}...`)
      await fs.remove(targetDir)
      stopSpinner()
    }
    echo(`✨  Creating project in ${chalk.cyan(targetDir)}.`)

    echo()
    logWithSpinner('📝', 'Writing package.json...')
    const packageJson = parsePresetToPkg(preset)

    if (useVue) {
      // get latest CLI plugin version
      const latest = await getVersion('vue-cli-version-marker')
      for (const dep in packageJson.devDependencies) {
        if (typeof packageJson.devDependencies[dep] === 'string') continue
        // Note: the default creator includes no more than `@vue/cli-*` & `@vue/babel-preset-env`,
        // so it is fine to only test `@vue` prefix.
        // Other `@vue/*` packages' version may not be in sync with the cli itself.
        packageJson.devDependencies[dep] = /^@vue/.test(dep) ? `~${latest}` : 'latest'
      }
      for (const dep in packageJson.dependencies) {
        if (typeof packageJson.dependencies[dep] === 'string') continue
        packageJson.dependencies[dep] = 'latest'
      }
    }
    if (useReact) {
      const latest = await getVersion('react')
      for (const dep in packageJson.devDependencies) {
        if (typeof packageJson.devDependencies[dep] === 'string') continue
        packageJson.devDependencies[dep] = 'latest'
      }
      for (const dep in packageJson.dependencies) {
        if (typeof packageJson.dependencies[dep] === 'string') continue
        packageJson.dependencies[dep] = /^react$|^react-dom$/.test(dep) ? `^${latest}` : 'latest'
      }
    }

    const pkg = await getPackageVersion(packageJson)

    // write package.json
    await writeFileTree(targetDir, {
      'package.json': JSON.stringify(pkg, null, 2) + '\n'
    })

    // create template files
    logWithSpinner('🚀', 'Invoking templates generators...')
    runGenerator(preset)

    stopSpinner()
    echo('📦  Installing packages. This might take a couple of minutes...\n')
    if (!isTestOrDebug) {
      await pm.install()
    }

    if (!fs.existsSync(path.join(targetDir, './README.md'))) {
      // generate README.md
      echo('📄  Generating README.md...')
      await writeFileTree(targetDir, {
        'README.md': generateReadme(pkg, packageManager)
      })
    }

    echo('🗃   Initializing git repository...')
    // TODO: debug - why did't track README.md in windows.
    let gitCommitFailed = false
    if (hasGit()) {
      run('git init && git add -A')
      if (isTestOrDebug) {
        run('git config user.name test && git config user.email test@test.com')
      }
      const msg = /**typeof preset.gitInitMessage === 'string' ? preset.gitInitMessage :*/ 'init'
      try {
        run('git commit -m ' + msg + ' --no-verify')
      } catch (e) {
        gitCommitFailed = true
      }
    }

    echo()
    echo(`🎉  Successfully created project ${chalk.yellow(name)}.`)
    echo(
      `\n👉  Get started by typing:\n\n` +
        (targetDir === process.cwd() ? '' : chalk.cyan(` ${chalk.gray('$')} cd ${name}\n`)) +
        chalk.cyan(` ${chalk.gray('$')} ${packageManager === 'yarn' ? 'yarn start' : 'npm start'}`)
    )
    echo()

    if (gitCommitFailed) {
      echo(
        chalk.bgYellow.black('WARN'),
        chalk.yellow('Skipped git commit due to missing username and email in git config.\n') +
          createLogSpace(5) +
          chalk.yellow('You will need to perform the initial commit yourself.\n')
      )
    }

    // TODO Removed this when ts module finished.
    if (useTypeScript) {
      echo(
        chalk.bgYellow.black('WARN'),
        chalk.yellow(
          'The Typescript module is not yet fully developed, ' +
            'so we helped you create the basic Typescript files. ' +
            'The rest needs to be done by yourself.\n'
        )
      )
    }
  }

  function run(command) {
    execSync(command, { cwd: targetDir })
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
      featurePrompt
    }
  }

  function resolveOutroPrompts() {
    const outroPrompts = []
    if (hasYarn()) {
      outroPrompts.push({
        name: 'packageManager',
        type: 'list',
        message: 'Pick the package manager to use when installing dependencies:',
        choices: [
          {
            name: 'Use Yarn',
            value: 'yarn',
            short: 'Yarn'
          },
          {
            name: 'Use NPM',
            value: 'npm',
            short: 'NPM'
          }
        ]
      })
    }
    return outroPrompts
  }

  function resolvePrompts() {
    const templatePrompt = {
      name: 'template',
      type: 'list',
      message: 'Pick a template you want:',
      when: () => !useVue && !useReact,
      choices: [
        { name: 'React', value: 'react' },
        { name: 'Vue', value: 'vue' }
      ]
    }
    const { featurePrompt } = resolveIntroPrompts()
    const injectedPrompts = []
    const promptAPI = new PromptModuleAPI(featurePrompt, injectedPrompts, promptCompleteCbs)
    const promptModules = getPromptModules()
    const promptSetting = { useVue, useReact }
    promptModules.forEach(m => m(promptAPI, promptSetting))

    const outroPrompts = resolveOutroPrompts()

    const prompts = [templatePrompt, featurePrompt, ...injectedPrompts, ...outroPrompts]
    return prompts
  }

  function resolveDefaultCheckedFeatures() {
    const result = []

    if (useTypeScript) result.push('ts')

    return result
  }

  function parsePresetToPkg(preset) {
    const pkg = {
      name,
      version: '0.1.0',
      private: true,
      scripts: {
        ...preset.scripts
      },
      dependencies: {
        ...preset.modules
      },
      devDependencies: {
        ...preset.plugins
      }
    }
    return sortPkg(pkg)
  }

  function sortPkg(pkg) {
    // ensure package.json keys has readable order
    pkg.dependencies = sortObject(pkg.dependencies)
    pkg.devDependencies = sortObject(pkg.devDependencies)
    pkg.scripts = sortObject(pkg.scripts, [
      'start',
      'build',
      'test:unit',
      'test:e2e',
      'lint',
      'deploy'
    ])
    pkg = sortObject(pkg, [
      'name',
      'version',
      'private',
      'description',
      'author',
      'scripts',
      'main',
      'module',
      'browser',
      'jsDelivr',
      'unpkg',
      'files',
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'vue',
      'babel',
      'eslintConfig',
      'prettier',
      'postcss',
      'browserslist',
      'jest'
    ])
    return pkg
  }

  async function getPackageVersion(pkg) {
    for (const key of ['dependencies', 'devDependencies']) {
      for (const id in pkg[key]) {
        if (pkg[key][id] === 'latest') {
          pkg[key][id] = '^' + (await getVersion(id))
        }
      }
    }

    return pkg
  }
}

module.exports = create
