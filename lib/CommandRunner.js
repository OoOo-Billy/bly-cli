'use strict'

function CommandRunner() {
  this.map = {}

  this.run = commands => {
    if (this.check(commands)) {
      this.map[commands[2]](commands.slice(3))
    }
  }

  this.register = (commandName, fn) => {
    // TODO: 寻找更好的方式注册 actions
    this.map[commandName] = fn
  }
}

CommandRunner.prototype.check = function (commands) {
  if (!commands[2])
    return echo(chalk.redBright("\nThere are no commands to run, see 'bly --help'.\n"))
  if (!this.map[commands[2]])
    return echo(`\n${chalk.red('Error')}: '${commands[2]}' is not a command. See 'bly --help'.\n`)
  return true
}

module.exports = CommandRunner
