'use strict';

const test = require('ava');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const cli = path.resolve(__dirname, '..', 'bin', 'index.js');
const harFile = path.resolve(__dirname, 'files', 'size', 'allSizes.har');

function run(args, input) {
  return spawnSync(process.execPath, [cli, ...args], {
    input,
    encoding: 'utf8'
  });
}

test('CLI: convert a HAR file', t => {
  const result = run([harFile]);
  t.is(result.status, 0);
  const pages = JSON.parse(result.stdout);
  t.is(pages.length, 1);
  t.deepEqual(pages[0].assets, []);
});

test('CLI: read the HAR from stdin', t => {
  const result = run(['-'], fs.readFileSync(harFile, 'utf8'));
  t.is(result.status, 0);
  t.is(JSON.parse(result.stdout).length, 1);
});

test('CLI: use the options', t => {
  const result = run([
    '--includeAssets',
    '--firstParty',
    '.*nothing.*',
    '--pretty',
    harFile
  ]);
  t.is(result.status, 0);
  const page = JSON.parse(result.stdout)[0];
  t.true(page.assets.length > 0);
  t.is(page.firstPartyRegEx, '.*nothing.*');
  t.true(result.stdout.includes('\n  '));
});

test('CLI: show the version', t => {
  const result = run(['--version']);
  t.is(result.stdout.trim(), require('../package.json').version);
});

test('CLI: fail with a message for a missing file or an unknown option', t => {
  for (const args of [['missing.har'], ['--unknown', harFile]]) {
    const result = run(args);
    t.is(result.status, 1);
    t.true(result.stderr.startsWith('pagexray: '));
  }
});
