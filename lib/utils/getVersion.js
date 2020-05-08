const { exec } = require("child_process");
const { name, version: local } = require("../../package.json");
const diff = require('semver/functions/diff')

module.exports = async function getVersion(packageName = name, version = null) {
  exec(`npm view ${packageName} version`, function(err, stdout, _stderr) {
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
      throw err;
    }

    if (packageName === name) {
      const diffType = diff(local, stdout);
      switch (diffType) {
        case "major":
          echo(` 🌟 A new great version of ${chalk.cyan(name)} has been release, use ${chalk.yellow("npm update")} upgrade to ${chalk.cyan(stdout)}!`);
          break;
        case "minor":
          echo(chalk.green(` 🌟️ New version available: ${stdout}`));
          break;
      }
      // stdout
    }

    version = stdout;
  });

  if (!version) {
    // TODO 提醒自行安装相关依赖
  }
  return version;
};