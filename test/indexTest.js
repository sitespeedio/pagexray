'use strict';

var assert = require('chai').assert,
  pluck = require('lodash.pluck'),
  parseTestHar = require('./helpers/testUtils').parseTestHar,
  hartopage = require('../lib/index');

describe('index', function() {

  describe('#convert', function() {
    var sourceHar;

    before(function(done) {
      parseTestHar('www.nytimes.com.har', function(err, har) {
        if (err) {
          return done(err);
        }
        sourceHar = har;
        done();
      });
    });

    // Skip since it doesn't work at the moment, convert is keeping state between invocations.
    it('should convert urls', function() {
      var convertedSummary = hartopage.convert(sourceHar);
      var exectedUrls = ['http://www.nytimes.com/', 'http://www.nytimes.com/'];
      assert.deepEqual(pluck(convertedSummary, 'url'), exectedUrls);
    });
  });
});
