'use strict';

const assert = require('chai').assert,
  util = require('../lib/util'),
  forEach = require('lodash.foreach'),
  har = require('./helpers/har');

describe('util', function() {

  describe('#getContentType', function() {
    const typeToMimeMapping = {
      'html': ['text/html', 'text/html; charset=utf-8'],
      'plain': ['text/plain'],
      'javascript': ['text/javascript', 'application/x-javascript; charset=utf-8'],
      'css': ['text/css'],
      'image': ['image/png', 'image/jpg', 'image/gif', 'image/webp'],
      'svg': ['image/svg+xml'],
      'font': ['application/font-woff', 'application/font-sfnt', 'application/x-font-opentype',
        'application/x-font-ttf', 'application/vnd.ms-fontobject', 'application/x-font-ttf',
        'application/x-font-opentype'
      ],
      'flash': ['application/x-shockwave-flash'],
      'favicon': ['image/x-icon', 'image/vnd.microsoft.icon'],
      'other': ['application/my-own-type']
    };

    forEach(typeToMimeMapping, function(mimes, type) {
      forEach(mimes, function(mime) {
        it('should categorize ' + mime + ' as ' + type, function() {
          const result = util.getContentType(mime, 'https:/www.test.com/test.strange');
          assert.equal(result, type);
        });
      });
    });
  });

  describe('#getHostname', function() {

    it('should fetch the domain from a URL with a filename', function() {
      const result = util.getHostname('https://www.sitespeed.io/with/a/path.jsp');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL with a query string', function() {
      const result = util.getHostname('https://www.sitespeed.io/with/a/?apa=hepp&apa2=oj');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL with #', function() {
      const result = util.getHostname('http://www.sitespeed.io/with/a/?apa=hepp&apa2=oj#yes');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL with only the domain', function() {
      const result = util.getHostname('http://www.sitespeed.io');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL without a sub domain', function() {
      const result = util.getHostname('http://sitespeed.io');
      assert.deepEqual(result, 'sitespeed.io');
    });

    it('the domain should be empty if it is missing', function() {
      const result = util.getHostname('hoppla');
      assert.deepEqual(result, '');
    });

    it('the domain should be empty if it is undefined', function() {
      const result = util.getHostname();
      assert.deepEqual(result, '');
    });

  });

  describe('#getDocumentRequests', () => {
    it('should not report redirects when non exist', () => {
      return har.parseTestHar('domains/run.sitespeed.io.har')
        .then((har) => {
          const firstRequest = har.log.entries[0];
          const result = util.getDocumentRequests(har.log.entries, firstRequest.pageref);
          assert(result.length, 1, 'Incorrectly parsed redirects');
        });
    });

    it('should return an empty array when no entries match the pageref', () => {
      // Previously this threw "Cannot read properties of undefined (reading 'response')"
      // when a HAR contained a page whose pageref didn't appear in log.entries.
      const result = util.getDocumentRequests([], 'page_0');
      assert.deepEqual(result, []);
    });
  });

  describe('#getConnectionType', () => {
    it('should detect HTTP/3 from the canonical string', () => {
      // Some HARs report the version as 'HTTP/3' / 'HTTP/3.0' rather than the
      // lowercase 'h3' shorthand. Both should map to 'h3'.
      assert.equal(util.getConnectionType('HTTP/3'), 'h3');
      assert.equal(util.getConnectionType('HTTP/3.0'), 'h3');
      assert.equal(util.getConnectionType('h3'), 'h3');
      assert.equal(util.getConnectionType('h3-29'), 'h3');
    });
  });
});
