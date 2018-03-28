'use strict';
let assert = require('assert');
let har = require('./helpers/har');

describe('Resonse codes', function() {
  it('We should be able identify all response codes', function() {
    return har
      .pagesFromTestHar('redirect/aftonbladet.se-redirecting-to-www.har')
      .then(result => {
        assert.strictEqual(result[0].responseCodes[200], 168, '200');
        assert.strictEqual(result[0].responseCodes[404], 1, '404');
        assert.strictEqual(result[0].responseCodes[301], 1, '301');
        assert.strictEqual(result[0].responseCodes[204], 2, '204');
      });
  });

  it('304 should be included in the page size', function() {
    return har.pagesFromTestHar('responseCodes/304.har').then(result => {
      console.log(result[0].contentTypes.css);
      console.log(result[0].contentTypes.javascript);
    });
  });
});
