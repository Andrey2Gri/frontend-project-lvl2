#!/usr/bin/env node
import program from 'commander';
import gendiff from '../src/index.js';
import stylish from '../src/stylish.js';

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1>, <filepath2>')
  .option('-f, --format [type]', 'output format', stylish)
  .action((filepath1, filepath2, options) => {
    console.log(gendiff(filepath1, filepath2, options.format));
  });

program.parse(process.argv);

export default program;
