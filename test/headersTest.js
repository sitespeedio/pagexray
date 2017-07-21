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

    it('should return positive time with only last-modified header', () => {
      const requestHeaders = {
        'last-modified': new Date('05 October 2011 14:48 UTC').toISOString()
      };
      const timeSinceLastModified = headers.getTimeSinceLastModified(requestHeaders);
      assert(timeSinceLastModified > 0);
    });

    it('should calculate diff between last-modified and date headers', () => {
      const requestHeaders = {
        'last-modified': new Date('05 October 2011 14:48 UTC').toISOString(),
        'date': new Date('05 October 2011 14:49 UTC').toISOString()
      };
      const timeSinceLastModified = headers.getTimeSinceLastModified(requestHeaders);
      assert.equal(timeSinceLastModified, 60);
    });
  });
});
