#!/usr/bin/env node

'use strict';

var pagexray = require('../lib/index'),
  fs = require('fs'),
  minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
  boolean: ['pretty', 'includeAssets']
});

if (argv.help || !argv._[0]) {
  console.log('   Convert a HAR file to a (better) page summary.');
  console.log('   Usage: pagexray [options] pathToHarFile\n');
  console.log('   Options:');
  console.log('   --pretty              Pretty format the JSON [false]');
  console.log('   --includeAssets       Include info about every asset in the result [false]');
} else {
  var har = JSON.parse(fs.readFileSync(argv._[0]));
  var pages = pagexray.convert(har, argv);
  if (argv.pretty) {
    console.log(JSON.stringify(pages, null, '  '));
  } else {
    console.log(JSON.stringify(pages));
  }
}
