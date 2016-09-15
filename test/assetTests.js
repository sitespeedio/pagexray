'use strict';

const assert = require('assert'),
  Asset = require('../lib/asset'),
  testHars = require('./helpers/har');

describe('asset', function() {

  describe('#fromHarEntry', function() {
    it('should parse redirects', function() {
      return testHars.parseTestHar('www.sitespeed.io-redirecting-to-https.har')
        .then((har) => {
          const assets = har.log.entries.map(Asset.fromHarEntry);

          assert.strictEqual(assets[0].url, 'http://www.sitespeed.io/');
          assert.strictEqual(assets[0].redirectUrl, 'https://www.sitespeed.io/');
          assert.equal(assets[0].type, 'other');
          assert.strictEqual(assets[1].url, 'https://www.sitespeed.io/');
          assert.equal(assets[1].redirectUrl, null);
        });

    });
  });
});
