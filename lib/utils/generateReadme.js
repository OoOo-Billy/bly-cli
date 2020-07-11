/**
 * Copy from @vue/cli - 4.4.4
 */

const descriptions = {
  build: 'Bundles the app into static files for production.',
  start: 'Starts the development server.',
  eject:
    'Removes this tool and copies build dependencies, configuration files and scripts into the app directory.',
  test: 'Launches the test runner in the interactive watch mode.'
}

function printScripts(pkg, packageManager) {
  return Object.keys(pkg.scripts || {})
    .map(key => {
      if (!descriptions[key]) return ''
      return [
        `\n### ${descriptions[key]}\n`,
        '```',
        `${packageManager} ${packageManager !== 'yarn' ? 'run ' : ''}${key}`,
        '```',
        ''
      ].join('\n')
    })
    .join('')
}

module.exports = function generateReadme(pkg, packageManager) {
  return [
    `# ${pkg.name}\n`,
    `This project was bootstrapped with [Bly-cli](https://github.com/OoOo-Billy/bly-cli).\n`,
    '## Project setup\n',
    '```',
    `${packageManager} install`,
    '```',
    printScripts(pkg, packageManager),
    '### Customize configuration\n',
    'See [Configuration Reference](https://cli.vuejs.org/config/).',
    ''
  ].join('\n')
}
