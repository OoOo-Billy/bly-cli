const { execSync } = require('child_process')

let _hasYarn
let _hasGit

// env detection
exports.hasYarn = () => {
  if (_hasYarn !== void 0) {
    return _hasYarn
  }
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return (_hasYarn = true)
  } catch (e) {
    return (_hasYarn = false)
  }
}

exports.hasGit = () => {
  if (process.env.BLY_CLI_DEBUG) {
    return true
  }
  if (_hasGit !== void 0) {
    return _hasGit
  }
  try {
    execSync('git --version', { stdio: 'ignore' })
    return (_hasGit = true)
  } catch (e) {
    return (_hasGit = false)
  }
}
