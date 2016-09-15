'use strict';
let assert = require('assert');
let har = require('./helpers/har');


describe('Redirect', function() {

  it('The domains should be the final destination of the redirect', function() {
    return har.pagesFromTestHar('redirect/aftonbladet.se-redirecting-to-www.har')
      .then((result) => {
        assert.strictEqual(result[0].baseDomain, 'www.aftonbladet.se');
      });
  });

  it('The final URL should be right', function() {
    return har.pagesFromTestHar('redirect/www.sitespeed.io-redirecting-to-https.har')
      .then((result) => {
        assert.strictEqual(result[0].finalUrl, 'https://www.sitespeed.io/');
      });
  });

  it('We should be able to identify frontend redirects or at least maybe guess them?');


});
