#!/usr/bin/env node
// @flow
'use strict';

const meow = require('meow');
const readPkgUp = require('read-pkg-up');
const chalk = require('chalk');
const validateNpmPackage = require('./');

const cli = meow(`
  Usage
    validate-npm-package
    validate-npm-package [path/to/package]

  Options
    --quiet, -q   Only output errors, ignore warnings
`, {
  alias: {
    q: 'quiet',
  },
});

const pkg = readPkgUp.sync({
  cwd: cli.input[0] || process.cwd(),
  normalize: false,
}).pkg;

const results = validateNpmPackage(pkg);

for (let error of results.errors) {
  console.error(chalk.red('error'), error);
}

if (!cli.flags.quiet) {
  for (let warning of results.warnings) {
    console.log(chalk.yellow('warning'), warning);
  }
}

let isValid = results.validForNewPackages && results.validForOldPackages;
if (!isValid) {
  process.exit(1);
}
