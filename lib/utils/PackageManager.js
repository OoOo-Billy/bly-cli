const { hasYarn } = require('./env')
const { spawn } = require('child_process')
const { rejects } = require('assert')

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
    // TODO remove npm funding info.
    return this.runCommand('install')
  }

  runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const child = spawn(this.bin, [command, ...args], {
        cwd: this.context,
        stdio: ['inherit', 'inherit', 'inherit'],
      })

      child.on('close', code => {
        if (code !== 0) {
          reject(`command failed: ${command} ${args.join(' ')}`)
          return
        }
        resolve()
      })
    })
  }
}

module.exports = PackageManager
