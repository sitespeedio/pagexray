'use strict';

var assert = require('chai').assert,
headers = require('../lib/headers')

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
});
