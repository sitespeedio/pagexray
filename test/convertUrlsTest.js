'use strict';
let assert = require('assert'),
  pluck = require('lodash.pluck'),
  har = require('./helpers/har');


describe('Converting URLs', function() {

  it('Should convert urls', function() {
    return har.getPages('test/files/www.nytimes.com.har').then((result) => {
      var exectedUrls = ['http://www.nytimes.com/', 'http://www.nytimes.com/'];
      assert.deepEqual(pluck(result, 'url'), exectedUrls);
    });
  });

});
