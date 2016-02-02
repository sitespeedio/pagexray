
'use strict';
let assert = require('assert');
let har = require('./helpers/har');


describe('Check content types', function() {
  it('We should be able to identify the number of content types', function() {
    return har.getPages('test/files/contentTypes/linkedin.har').then((result) => {
      assert.strictEqual(result[0].contentTypes.doc.requests, 1, 'We couldnt get the right number of docs');
      assert.strictEqual(result[0].contentTypes.js.requests, 8, 'We couldnt get the right number of js');
      assert.strictEqual(result[0].contentTypes.css.requests, 2, 'We couldnt get the right number of css');
      assert.strictEqual(result[0].contentTypes.image.requests, 5, 'We couldnt get the right number of image');
      assert.strictEqual(result[0].contentTypes.others.requests, 2, 'We couldnt get the right number of others');
    });
  });

  it('We should be able to identify the number of content types (part 2)', function() {
    return har.getPages('test/files/contentTypes/aftonbladet.se.har').then((result) => {
      assert.strictEqual(result[0].contentTypes.doc.requests, 10, 'We couldnt get the right number of docs');
      assert.strictEqual(result[0].contentTypes.js.requests, 31, 'We couldnt get the right number of js');
      assert.strictEqual(result[0].contentTypes.css.requests, 4, 'We couldnt get the right number of css');
      assert.strictEqual(result[0].contentTypes.image.requests, 96, 'We couldnt get the right number of image');
      assert.strictEqual(result[0].contentTypes.font.requests, 3, 'We couldnt get the right number of fonts');
      assert.strictEqual(result[0].contentTypes.favicon.requests, 1, 'We couldnt get the right number of favicons');
      assert.strictEqual(result[0].contentTypes.others.requests, 23, 'We couldnt get the right number of others');
    });
  });
});
