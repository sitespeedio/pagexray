#!/usr/bin/env node

'use strict';

const pagexray = require('../lib/index');
const fs = require('fs');
const minimist = require('minimist');
const packageInfo = require('../package');

const argv = minimist(process.argv.slice(2), {
  boolean: ['pretty', 'includeAssets']
});

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.on('data', chunk => chunks.push(chunk));
    process.stdin.on('end', () =>
      resolve(Buffer.concat(chunks).toString('utf8'))
    );
    process.stdin.on('error', reject);
  });
}

function fail(message) {
  process.stderr.write('pagexray: ' + message + '\n');
  process.exit(1);
}

function emit(pages) {
  if (argv.pretty) {
    process.stdout.write(JSON.stringify(pages, null, '  ') + '\n');
  } else {
    process.stdout.write(JSON.stringify(pages) + '\n');
  }
}

function run(harText, source) {
  let har;
  try {
    har = JSON.parse(harText);
  } catch (e) {
    return fail('could not parse ' + source + ' as JSON: ' + e.message);
  }
  emit(pagexray.convert(har, argv));
}

if (argv.version) {
  console.log(`${packageInfo.version}`);
} else if (argv.help || (!argv._[0] && process.stdin.isTTY)) {
  console.log('   Convert a HAR file to a (better) page summary.');
  console.log('   Usage: pagexray [options] pathToHarFile');
  console.log(
    '          pagexray [options] -                (read HAR from stdin)\n'
  );
  console.log('   Options:');
  console.log('   --pretty              Pretty format the JSON [false]');
  console.log(
    '   --includeAssets       Include info about every asset in the result [false]'
  );
  console.log(
    '   --firstParty          A regex defining if a URL is 1st or 3rd party URL'
  );
} else if (!argv._[0] || argv._[0] === '-') {
  readStdin().then(
    text => run(text, 'stdin'),
    err => fail('could not read stdin: ' + err.message)
  );
} else {
  const path = argv._[0];
  let harText;
  try {
    harText = fs.readFileSync(path, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      return fail('file not found: ' + path);
    }
    return fail('could not read ' + path + ': ' + e.message);
  }
  run(harText, path);
}
