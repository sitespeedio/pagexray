'use strict';

var assert = require('chai').assert,
  fs = require('fs'),
  hartopage = require('../lib/index');

describe('index', function() {

  describe('#redirecting', function() {
    var page;

    before(function(done) {
      fs.readFile('test/files/aftonbladet.se-redirecting-to-www.har', 'utf-8', function(err, data) {
        if (err) {
          return done(err);
        }
        var har = JSON.parse(data);

        page = hartopage.convert(har);
        done();
      });
    });

    it('The domains should be the final destination of the redirect', function() {
      assert.strictEqual(page[0].baseDomain, 'www.aftonbladet.se');
    });

  });

});
