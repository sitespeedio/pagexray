'use strict';

const assert = require('assert'),
  Page = require('../lib/page'),
  testHars = require('./helpers/har'),
  hartopage = require('../lib/index');

describe('compare', function() {
  const options = {includeAssets: true, firstParty: 'http://www\.sitespeed\.io.*'};

  it('should generate same output for new and old for wpt har', function() {
    return testHars.parseTestHar('www.sitespeed.io-redirecting-to-https.har')
      .then((har) => {
        const oldPages = hartopage.convert(har, options);

        const newPages = Page.fromHar(har, options);

        assert.deepEqual(newPages, oldPages);
      });
  });

  it('should generate same output for new and old for bt har', function() {
    return testHars.parseTestHar('www.sitespeed.io.har')
      .then((har) => {

        const oldPages = hartopage.convert(har, options);

        const newPages = Page.fromHar(har, options);

        assert.deepEqual(newPages, oldPages);
      });
  });

});
