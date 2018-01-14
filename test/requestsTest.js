'use strict';
let assert = require('assert');
let har = require('./helpers/har');


describe('Requests', function() {

  it('We should be able identify the right number of requests', function() {
    return har.pagesFromTestHar('requests/expressen.har')
      .then((result) => {
        assert.strictEqual(result[0].requests, 202, 'Run 1');
        assert.strictEqual(result[1].requests, 203, 'Run 2');
        assert.strictEqual(result[2].requests, 202, 'Run 3');
      });
  });


});
