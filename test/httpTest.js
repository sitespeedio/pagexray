'use strict';

const test = require('ava');
const har = require('./helpers/har');

test('HTTP versions: identify HTTP2 from Chrome', t => {
  const result = har.pagesFromTestHar('http/http2-chrome.har');
  t.is(result[0].httpVersion, 'HTTP/2.0');
});

test('HTTP versions: identify HTTP2 from Firefox', t => {
  const result = har.pagesFromTestHar('http/http2-firefox.har');
  t.is(result[0].httpVersion, 'HTTP/2.0');
});

test.todo(
  'HTTP versions: identify SPDY from Firefox (Firefox HAR says HTTP/1)'
);

test('HTTP versions: identify SPDY from Chrome', t => {
  const result = har.pagesFromTestHar('http/spdy-chrome.har');
  t.is(result[0].httpVersion, 'SPDY/3.1');
});

test('HTTP versions: identify 1.1 from Firefox', t => {
  const result = har.pagesFromTestHar('http/http1.1-firefox.har');
  t.is(result[0].httpVersion, 'HTTP/1.1');
});

test('HTTP versions: identify 1.1 from Chrome', t => {
  const result = har.pagesFromTestHar('http/http1.1-chrome.har');
  t.is(result[0].httpVersion, 'HTTP/1.1');
});
