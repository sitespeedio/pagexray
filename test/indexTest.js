'use strict';

var assert = require('chai').assert,
  fs = require('fs'),
  hartopage = require('../lib/index');

describe('index', function() {

  describe('#redirecting', function() {
    var har = JSON.parse(fs.readFileSync('test/files/aftonbladet.se-redirecting-to-www.har'));

    var page = hartopage.convert(har);

    it('The domains should be the final destination of the redirect', function() {
      assert.strictEqual(page[0].baseDomain, 'www.aftonbladet.se');
    });

  });

});
