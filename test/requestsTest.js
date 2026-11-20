'use strict';

const test = require('ava');
const har = require('./helpers/har');
const pagexray = require('../lib/index');

test('Requests: we should be able identify the right number of requests', t => {
  const result = har.pagesFromTestHar('requests/expressen.har');
  t.is(result[0].requests, 202, 'Run 1');
  t.is(result[1].requests, 203, 'Run 2');
  t.is(result[2].requests, 202, 'Run 3');
});

test('Requests: a HAR without pages is one page', t => {
  // The pages field is optional in a HAR, and a HAR without it crashed.
  const entry = url => ({
    startedDateTime: '2024-01-01T00:00:00.000Z',
    time: 10,
    request: {method: 'GET', url, headers: []},
    response: {
      status: 200,
      httpVersion: 'h2',
      headersSize: 0,
      bodySize: 100,
      content: {mimeType: 'text/html', size: 100},
      headers: [],
      redirectURL: ''
    },
    timings: {}
  });
  const entries = [entry('https://www.test.com/'), entry('https://www.test.com/a')];
  for (const log of [
    {creator: {name: 'x'}, entries},
    {creator: {name: 'x'}, pages: [], entries}
  ]) {
    const pages = pagexray.convert({log});
    t.is(pages.length, 1);
    t.is(pages[0].requests, 2);
  }
});
