const chalk = require('chalk');

const name = require('../package.json').name;

/**
 * Prepends the log text with a dark colored module info.
 **/
function logText(text) {
  process.stdout.write(`${chalk.gray(name)} ${text}\n`);
}

/**
 * Prepends the log text with an uppercase error field.
 **/
function logError(text) {
  return logText(`${chalk.bgRed('ERROR')} ${text}`);
}

module.exports = {
  text: logText,
  error: logError,
};
