
'use strict';
let assert = require('assert');
let har = require('./helpers/har');


describe('Check content types', function() {
  it('We should be able to identify the number of content types', function() {
    return har.getPages('test/files/contentTypes/linkedin.har').then((result) => {
      console.log(result[0]);
      assert.strictEqual(result[0].doc.requests, 1, 'We couldnt get the right number of docs');
      assert.strictEqual(result[0].js.requests, 8, 'We couldnt get the right number of js');
      assert.strictEqual(result[0].css.requests, 2, 'We couldnt get the right number of css');
      assert.strictEqual(result[0].image.requests, 5, 'We couldnt get the right number of image');
      assert.strictEqual(result[0].others.requests, 2, 'We couldnt get the right number of others');
    });
  });
});
