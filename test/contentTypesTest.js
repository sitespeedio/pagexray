'use strict';
let assert = require('assert');
let har = require('./helpers/har');


describe('Check content types', function() {
  it('should be able to identify the number of content types', function() {
    return har.pagesFromTestHar('contentTypes/linkedin.har')
      .then((result) => {
        const types = result[0].contentTypes;
        assert.strictEqual(types.html.requests, 1, 'We couldnt get the right number of html');
        assert.strictEqual(types.javascript.requests, 8, 'We couldnt get the right number of javascript');
        assert.strictEqual(types.css.requests, 2, 'We couldnt get the right number of css');
        assert.strictEqual(types.image.requests, 5, 'We couldnt get the right number of image');
        assert.strictEqual(types.other.requests, 1, 'We couldnt get the right number of other');
      });
  });

  it('should be able to identify the number of content types (part 2)', function() {
    return har.pagesFromTestHar('contentTypes/aftonbladet.se.har')
      .then((result) => {
        const types = result[0].contentTypes;
        assert.strictEqual(types.html.requests, 8, 'We couldnt get the right number of html');
        assert.strictEqual(types.javascript.requests, 31, 'We couldnt get the right number of javscript');
        assert.strictEqual(types.css.requests, 4, 'We couldnt get the right number of css');
        assert.strictEqual(types.image.requests, 94, 'We couldnt get the right number of image');
        assert.strictEqual(types.font.requests, 3, 'We couldnt get the right number of fonts');
        assert.strictEqual(types.json.requests, 3, 'We couldnt get the right number of json');
        assert.strictEqual(types.svg.requests, 2, 'We couldnt get the right number of svg');
        assert.strictEqual(types.plain.requests, 2, 'We couldnt get the right number of plain');
        assert.strictEqual(types.favicon.requests, 1, 'We couldnt get the right number of favicons');
        assert.strictEqual(types.other.requests, 20, 'We couldnt get the right number of other');
      });
  });
});
