'use strict';

const fs = require('fs'),
  Promise = require('bluebird'),
  path = require('path'),
  hartopage = require('../../lib/index');

Promise.promisifyAll(fs);

module.exports = {
  parseTestHar(relativePath) {
    const harPath = path.resolve(__dirname, '..', 'files', relativePath);
    return fs.readFileAsync(harPath)
      .then(JSON.parse);
  },
  pagesFromTestHar(relativePath) {
    return this.parseTestHar(relativePath)
      .then(hartopage.convert);
  }
};
