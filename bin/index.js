#!/usr/bin/env node

/**
 * @fileoverview CLI index object.
 * @author Peter Hedenskog
 * @copyright (c) 2015, Peter Hedenskog, Tobias Lidskog.
 * Released under the Apache 2.0 License.
 */

'use strict';

var snufkin = require('../lib/index'),
  fs = require('fs'),
  minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
  boolean: ['pretty', 'includeAssets']
});

if (argv.help || !argv._[0]) {
  console.log('   Convert a HAR file to a (better) page summary.');
  console.log('   Usage: snufkin [options] pathToHarFile\n');
  console.log('   Options:');
  console.log('   --pretty              Pretty format the JSON [false]');
  console.log('   --includeAssets       Include info about every asset in the result [false]');
} else {
  var har = JSON.parse(fs.readFileSync(argv._[0]));
  var pages = snufkin.convert(har, argv);
  if (argv.pretty) {
    console.log(JSON.stringify(pages, null, '  '));
  } else {
    console.log(JSON.stringify(pages));
  }
}
