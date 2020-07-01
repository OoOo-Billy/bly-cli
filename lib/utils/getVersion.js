const { exec } = require('child_process')
const { name, version: local } = require('../../package.json')
const diff = require('semver/functions/diff')

module.exports = function getVersion(packageName = name, version = null) {
  return new Promise(function (resolve, reject) {
    exec(`npm view ${packageName} version`, function (err, stdout, _stderr) {
      if (err) {
        //   at ChildProcess.exithandler (child_process.js:303:12)
        //   at ChildProcess.emit (events.js:311:20)
        //   at maybeClose (internal/child_process.js:1021:16)
        //   at Socket.<anonymous> (internal/child_process.js:443:11)
        //   at Socket.emit (events.js:311:20)
        //   at Pipe.<anonymous> (net.js:668:12) {
        // killed: false,
        // code: 1,
        // signal: null,
        // cmd: 'npm view bly-cli version'
        reject()
        throw err
      }
      if (packageName === name) {
        const diffType = diff(local, stdout)
        if (diffType === 'major' || diffType === 'minor') {
          echo(
            `\n ✨  New ${chalk.yellow(
              diffType
            )} version of bly-cli available! ${chalk.red(
              local
            )} → ${chalk.green(stdout)}`
          )
          echo(
            ' 📖 ',
            chalk.yellow('See:'),
            chalk.cyan('https://github.com/OoOo-Billy/bly-cli')
          )
          echo(` 👉  Run ${chalk.green(`npm install -g ${name}`)} to update!\n`)
        }
        // stdout
      }
      version = stdout

      if (!version) {
        // TODO 提醒自行安装相关依赖
        reject()
      }

      resolve(version.trim())
    })
  })
}
