'use strict';

const assert = require('assert'),
  Asset = require('../lib/asset'),
  Page = require('../lib/page'),
  testHars = require('./helpers/har');

describe('page', function() {

  describe('#fromHar', function() {
    it('should parse redirects', function() {
      return testHars.parseTestHar('www.sitespeed.io-redirecting-to-https.har')
        .then((har) => {
          const page = Page.fromHar(har)[0];

          assert.strictEqual(page.url, 'http://www.sitespeed.io/');
          assert.strictEqual(page.finalUrl, 'https://www.sitespeed.io/');
          assert.strictEqual(page.httpType, 'h1');
        });
    });

    it('should exclude assets if so configured', function() {
      return testHars.parseTestHar('www.sitespeed.io-redirecting-to-https.har')
        .then((har) => {
          const page = Page.fromHar(har, {includeAssets: false})[0];

          assert.equal(page.assets, undefined);
        });
    });

  });

  describe('#fromAssets', function() {
    it('should parse redirects', function() {
      return testHars.parseTestHar('www.sitespeed.io-redirecting-to-https.har')
        .then((har) => {
          const assets = har.log.entries.map(Asset.fromHarEntry);

          const page = Page.fromAssets(assets);

          assert.strictEqual(page.url, 'http://www.sitespeed.io/');
          assert.strictEqual(page.finalUrl, 'https://www.sitespeed.io/');
          assert.strictEqual(page.httpType, 'h1');
        });
    });

    it('should parse cookies', function() {
      return testHars.parseTestHar('www.nytimes.com.har')
        .then((har) => {
          const assets = har.log.entries.map(Asset.fromHarEntry);

          const page = Page.fromAssets(assets);

          assert.strictEqual(page.cookieStats.max, 25);
        });
    });

    it('should exclude assets if so configured', function() {
      return testHars.parseTestHar('www.sitespeed.io-redirecting-to-https.har')
        .then((har) => {
          const assets = har.log.entries.map(Asset.fromHarEntry);

          const page = Page.fromAssets(assets, {includeAssets: false});

          assert.equal(page.assets, undefined);
        });
    });
  });
});
