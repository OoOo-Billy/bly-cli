const { hasYarn } = require('./env')
const { spawn } = require('child_process')

class PackageManager {
  constructor({ context, packageManager } = {}) {
    this.context = context || process.cwd()

    if (packageManager) {
      this.bin = packageManager
    }

    // if no package managers specified
    if (!this.bin) {
      this.bin = hasYarn() ? 'yarn' : 'npm'
    }
  }

  install() {
    this.runCommand('install')
  }

  // TODO should be a async function
  runCommand(command, args = []) {
    const child = spawn(this.bin, [command, ...args], { cwd: this.context })
    // TODO Find how to print the npm progress.
    child.stdout.on('data', data => {
      console.log(`stdout: ${data}`)
    })

    child.stderr.on('data', data => {
      // warning will be here.
      console.error(`stderr: ${data}`)
    })

    child.on('close', code => {
      console.log(`子进程退出，退出码 ${code}`)
      if (code === 1) {
        process.exit(1)
      }
    })
  }
}

module.exports = PackageManager
