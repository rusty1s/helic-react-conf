#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const meow = require('meow');

const spawn = require('../utils/spawn');
const resolve = require('../utils/resolve');
const write = require('../utils/write');

// The jest config file must be a json file.  We write this file as jon into
// the .cache folder of the `react-dev-config` from where we can address it.
const jest = require(resolve('jest.js'));
const configPath = write.toCache('jest.json', JSON.stringify(jest));

// Proxy is enabled in Node.js v6.* by default; if you are not on Node v6.*
// yet, make sure you invoke Jest using node --harmony_proxies
// https://facebook.github.io/jest/docs/tutorial-webpack.html
const version = parseInt(process.version.match(/\d/)[0], 10);
const harmony = version < 6 ? ['--harmony_proxies'] : [];

// Jest needs a `.babelrc` in the root of your package folder, so we write it.
const babelrc = require(resolve('babelrc.js'));
const babelrcPath = path.join(process.cwd(), '.babelrc');
fs.writeFileSync(babelrcPath, JSON.stringify(babelrc));

const cli = meow(`
Usage
  test [options]

Options
  --help   This help text.
  --watch  Watch files for changes and rerun tests related to changed files.
`);

const args = [
  '--config', configPath,
].concat(cli.flags.watch ? ['--watch'] : []);

// Run jest for testing.
const result = spawn('jest', args, harmony);

// Delete created `.babelrc`.
fs.unlinkSync(babelrcPath);

process.exitCode = result.status;
