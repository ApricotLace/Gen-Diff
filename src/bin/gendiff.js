#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';
import { version } from '../../package.json';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format: Default - object form, Plain, JSON')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig, options) => console.log(
    genDiff(firstConfig, secondConfig, options.format),
  ))
  .parse(process.argv);
