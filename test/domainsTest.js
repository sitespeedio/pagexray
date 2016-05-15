'use strict';
let assert = require('assert');
let har = require('./helpers/har');


describe('Verify domains', function() {

  it('Total number of requests per domain should be right', function() {
    return har.getPages('test/files/domains/run.sitespeed.io.har').then((result) => {
      assert.strictEqual(result[0].domains.single["run.sitespeed.io"].requests, 8);
      assert.strictEqual(result[0].domains.single["www.google-analytics.com"].requests, 2);
    });
  });

  it('We should be able to verify the size for all responses per domain');

});
