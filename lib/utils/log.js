const readline = require("readline");
const cli = require("../../package.json").name;
const version = require("../../package.json").version;

exports.clearConsole = async () => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    console.log(chalk.bold.blue(`${cli.toUpperCase()} v${version}`));
  }
};
