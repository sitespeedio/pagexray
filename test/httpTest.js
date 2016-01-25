
'use strict';
let assert = require('assert');
let har = require('./helpers/har');


describe('Verify HTTP versions', function() {

  it('We should be able to identify HTTP2 from Chrome', function() {
    return har.getPages('test/files/http/http2-chrome.har').then((result) => {
      assert.strictEqual(result[0].httpVersion, 'HTTP/2.0');
    });
  });

  it('We should be able to identify HTTP2 from Firefox', function() {
    return har.getPages('test/files/http/http2-firefox.har').then((result) => {
      assert.strictEqual(result[0].httpVersion, 'HTTP/2.0');
    });
  });

  it('We should be able to identify SPDY from Firefox but the HAR files generated from Firefox says HTTP/1');

  /*
  it('We should be able to identify SPDY from Firefox', function() {
    return har.getPages('test/files/http/spdy-firefox2.har').then((result) => {
      assert.strictEqual(result[0].httpVersion, 'SPDY/3.1');
    });
  });
*/

  it('We should be able to identify SPDY from Chrome', function() {
    return har.getPages('test/files/http/spdy-chrome.har').then((result) => {
      assert.strictEqual(result[0].httpVersion, 'SPDY/3.1');
    });
  });

  it('We should be able to identify 1.1 from Firefox', function() {
    return har.getPages('test/files/http/http1.1-firefox.har').then((result) => {
      assert.strictEqual(result[0].httpVersion, 'HTTP/1.1');
    });
  });

  it('We should be able to identify 1.1 from Chrome', function() {
    return har.getPages('test/files/http/http1.1-chrome.har').then((result) => {
      assert.strictEqual(result[0].httpVersion, 'HTTP/1.1');
    });
  });

});
