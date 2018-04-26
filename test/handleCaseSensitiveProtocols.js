'use strict';
let assert = require('assert'),
  pluck = require('lodash.pluck'),
  har = require('./helpers/har');

describe('Handle URLs with different different cases', function() {
  it('Should handle HTTPS and https', function() {
    return har.pagesFromTestHar('case-sensitive-protocol.har').then(result => {
      const exectedUrls = ['https://www.verizonwireless.com/devices'];
      assert.deepEqual(pluck(result, 'url'), exectedUrls);
    });
  });
});
