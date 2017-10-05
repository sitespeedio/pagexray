'use strict';

const assert = require('chai').assert;
const headers = require('../lib/headers');

describe('headers', function() {

  describe('#flattenHeaders', function() {
    it('should flatten HAR headers', function() {
      var harHeaders = [{
        name: 'header1',
        value: 'value1'
      }, {
        name: 'header2',
        value: 'value2'
      }, {
        name: 'HEADER3',
        value: 'value3'
      }];
      var expected = {
        'header1': 'value1',
        'header2': 'value2',
        'header3': 'value3'
      };

      var flattenedHeaders = headers.flatten(harHeaders);
      assert.deepEqual(flattenedHeaders, expected);
    });
  });

  describe('#getTimeSinceLastModified', () => {
    it('should return -1 for missing last-modified header', () => {
      const requestHeaders = {};
      const timeSinceLastModified = headers.getTimeSinceLastModified(requestHeaders);
      assert.equal(timeSinceLastModified, -1);
    });

    it('should return -1 for invalid last-modified header', () => {
      const requestHeaders = {'last-modified': 'xyz'};
      const timeSinceLastModified = headers.getTimeSinceLastModified(requestHeaders);
      assert.equal(timeSinceLastModified, -1);
    });

    it('should return positive time with only last-modified header', () => {
      const requestHeaders = {
        'last-modified': 'Wed, 26 Aug 2015 12:37:50 GMT'
      };
      const timeSinceLastModified = headers.getTimeSinceLastModified(requestHeaders);
      assert.isTrue(timeSinceLastModified > 0);
    });

    it('should handle invalid date header', () => {
      const requestHeaders = {
        'last-modified': 'Wed, 26 Aug 2025 12:37:50 GMT',
        'date': 'Wedding'
      };
      const timeSinceLastModified = headers.getTimeSinceLastModified(requestHeaders);
      assert.isTrue(timeSinceLastModified < 0);
    });

    it('should calculate diff between last-modified and date headers', () => {
      const requestHeaders = {
        'last-modified': 'Wed, 26 Aug 2015 12:37:50 GMT',
        'date': 'Wed, 26 Aug 2015 12:37:51 GMT'
      };
      const timeSinceLastModified = headers.getTimeSinceLastModified(requestHeaders);
      assert.equal(timeSinceLastModified, 1);
    });
  });

  describe('#getExpires', () => {
    it('should return 0 for empty headers', () => {
      const responseHeaders = {};
      const expires = headers.getExpires(responseHeaders);
      assert.equal(expires, 0);
    });
    it('should return 0 for when cache-control is no-cache', () => {
      const responseHeaders = {'cache-control': 'no-cache'};
      const expires = headers.getExpires(responseHeaders);
      assert.equal(expires, 0);
    });
    it('should return 0 for when cache-control is no-store', () => {
      const responseHeaders = {'cache-control': 'no-store'};
      const expires = headers.getExpires(responseHeaders);
      assert.equal(expires, 0);
    });
    it('should parse max-age from cache-control', () => {
      const responseHeaders = {'cache-control': 'max-age=42'};
      const expires = headers.getExpires(responseHeaders);
      assert.equal(expires, 42);
    });
    it('should handle invalid max-age from cache-control', () => {
      const responseHeaders = {'cache-control': 'max-age=xyz42'};
      const expires = headers.getExpires(responseHeaders);
      assert.equal(expires, 0);
    });
    it('should handle invalid expires header', () => {
      const responseHeaders = {'expires': 'xyz'};
      const expires = headers.getExpires(responseHeaders);
      assert.equal(expires, 0);
    });
    it('should handle invalid expires header', () => {
      // this example is from nytimes.com
      const responseHeaders = {'expires': 'Wed Sep 15 09:14:42 MDT 2010\nThu Sep 16 15:24:47 MDT 2010'};
      const expires = headers.getExpires(responseHeaders);
      assert.equal(expires, 0);
    });
    it('should handle numeric expires header', () => {
      // this example is from nytimes.com
      const responseHeaders = {'expires': '0'};
      const expires = headers.getExpires(responseHeaders);
      assert.equal(expires, 0);
    });
    it('should parse valid expires header', () => {
      const responseHeaders = {'expires': 'Wed, 26 Aug 2015 12:37:50 GMT'};
      const expires = headers.getExpires(responseHeaders);
      assert.isTrue(expires < 0);
    });
  });
});
