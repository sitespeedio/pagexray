#!/usr/bin/env node

'use strict';

let fs = require('fs'),
  Promise = require('bluebird'),
  path = require('path'),
  hartopage = require('../../lib/index');

Promise.promisifyAll(fs);

module.exports = {
  getPages: function(harFile) {
    return fs.readFileAsync(path.resolve(harFile))
      .then(JSON.parse)
      .then(hartopage.convert)
      .then((pages) => {
        return pages;
      })
      .catch((e) => {
        console.error('Error fetching page(s)', e);
      })
  }
};
