'use strict';
let assert = require('assert');
let har = require('./helpers/har');


describe('Verify different sizes', function() {

  it('Total contentSize should not be minus values', function() {
    return har.pagesFromTestHar('size/minusSizeForContentFirefox.har')
      .then((result) => {
        assert.strictEqual(result[0].contentSize > 0, true);
      });
  });

  it('Total contentSize should right', function() {
    return har.pagesFromTestHar('size/allSizes.har')
      .then((result) => {
        // yep it's true, I used Google to calculate the size
        assert.strictEqual(result[0].contentSize, 102069);
      });
  });

  it('Total transferSize should right', function() {
    return har.pagesFromTestHar('size/allSizes.har')
      .then((result) => {
        assert.strictEqual(result[0].transferSize, 102069);
      });
  });

  it('Total headerSize should right', function() {
    return har.pagesFromTestHar('size/allSizes.har')
      .then((result) => {
        assert.strictEqual(result[0].headerSize, 6480);
      });
  });

});
