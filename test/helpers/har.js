'use strict';

const fs = require('fs');
const path = require('path');
const pagexray = require('../../lib/index');

function parseTestHar(relativePath) {
  const harPath = path.resolve(__dirname, '..', 'files', relativePath);
  return JSON.parse(fs.readFileSync(harPath, 'utf8'));
}

function pagesFromTestHar(relativePath) {
  return pagexray.convert(parseTestHar(relativePath));
}

module.exports = {
  parseTestHar,
  pagesFromTestHar
};
