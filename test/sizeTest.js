'use strict';
let assert = require('assert');
let har = require('./helpers/har');


describe('Verify different sizes', function() {

  it('Total contentSize should not be minus values', function() {
    return har.getPages('test/files/size/minusSizeForContentFirefox.har').then((result) => {
      assert.strictEqual(result[0].contentSize > 0, true);
    });
  });

});
