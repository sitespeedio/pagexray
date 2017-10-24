#!/usr/bin/env node

'use strict';

const pagexray = require('../lib/index');
const fs = require('fs');
const minimist = require('minimist');
const packageInfo = require('../package');

const argv = minimist(process.argv.slice(2), {
  boolean: ['pretty', 'includeAssets']
});

if (argv.version) {
  console.log(`${packageInfo.version}`);
} else if (argv.help || !argv._[0]) {
  console.log('   Convert a HAR file to a (better) page summary.');
  console.log('   Usage: pagexray [options] pathToHarFile\n');
  console.log('   Options:');
  console.log('   --pretty              Pretty format the JSON [false]');
  console.log(
    '   --includeAssets       Include info about every asset in the result [false]'
  );
  console.log(
    '   --firstParty          A regex defining if a URL is 1st or 3rd party URL'
  );
} else {
  const har = JSON.parse(fs.readFileSync(argv._[0]));
  const pages = pagexray.convert(har, argv);
  if (argv.pretty) {
    console.log(JSON.stringify(pages, null, '  '));
  } else {
    console.log(JSON.stringify(pages));
  }
}
