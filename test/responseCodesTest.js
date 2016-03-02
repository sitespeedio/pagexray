'use strict';
let assert = require('assert');
let har = require('./helpers/har');


describe('Resonse codes', function() {

  it('We should be able identify all response codes', function() {
    return har.getPages('test/files/redirect/aftonbladet.se-redirecting-to-www.har').then((result) => {
      assert.strictEqual(result[0].responseCodes[200], 168, '200');
      assert.strictEqual(result[0].responseCodes[404], 1, '404');
      assert.strictEqual(result[0].responseCodes[301], 1, '301');
      assert.strictEqual(result[0].responseCodes[204], 2, '204');
    });
  });



});
