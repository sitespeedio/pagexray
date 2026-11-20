'use strict';

const test = require('ava');
const pagexray = require('../lib/index');
const testHar = require('./helpers/har');

function entry(url, mimeType) {
  return {
    pageref: 'page_0',
    startedDateTime: '2024-01-01T00:00:00.000Z',
    time: 10,
    request: { method: 'GET', url, headers: [] },
    response: {
      status: 200,
      httpVersion: 'http/1.1',
      headersSize: 0,
      bodySize: 0,
      content: { mimeType, size: 0 },
      headers: [],
      redirectURL: ''
    },
    timings: {}
  };
}

test('First party (wikipedia): non-wikipedia hosts must be classified as third party', t => {
  // The auto-derived firstParty regex for wikipedia used to be
  // '(.*wikipedia.*||.*wikimedia.*)' — the empty alternative made it
  // match every URL, so a Google Analytics request on a Wikipedia page
  // was wrongly counted as first-party.
  const har = {
    log: {
      creator: { name: 'Browsertime' },
      browser: { name: 'chrome', version: '1' },
      pages: [
        {
          id: 'page_0',
          startedDateTime: '2024-01-01T00:00:00.000Z',
          title: 'wikipedia',
          pageTimings: { onLoad: 1000, onContentLoad: 800 }
        }
      ],
      entries: [
        entry('https://en.wikipedia.org/', 'text/html'),
        entry('https://upload.wikimedia.org/logo.png', 'image/png'),
        entry(
          'https://www.google-analytics.com/analytics.js',
          'application/javascript'
        )
      ]
    }
  };

  const page = pagexray.convert(har)[0];
  t.is(page.firstParty.requests, 2, 'wikipedia + wikimedia are first-party');
  t.is(page.thirdParty.requests, 1, 'google-analytics is third-party');
});

for (const browser of ['chrome', 'firefox']) {
  test(`First party: each page in a ${browser} HAR uses its own site`, t => {
    // The HAR has www.example.com and then www.sitespeed.io. The default
    // first party regex was made from the first page only, so every
    // request on the second page was counted as third party.
    const pages = testHar.pagesFromTestHar(`browsertime/${browser}-two-sites.har`);
    t.is(pages[0].firstPartyRegEx, '.*example.*');
    t.is(pages[1].firstPartyRegEx, '.*sitespeed.*');
    t.is(pages[1].firstParty.requests, pages[1].requests);
    t.is(pages[1].thirdParty.requests, undefined);
  });
}

test('First party: an IP address is only first party for that address', t => {
  // The default regex for 127.0.0.1 was '.*0.*', which matched every
  // host with a 0 in the name.
  const har = {
    log: {
      creator: {name: 'Browsertime'},
      pages: [
        {
          id: 'page_0',
          startedDateTime: '2024-01-01T00:00:00.000Z',
          pageTimings: {onLoad: 1000, onContentLoad: 800}
        }
      ],
      entries: [
        entry('http://127.0.0.1:3000/', 'text/html'),
        entry('http://127.0.0.1:3000/app.js', 'application/javascript'),
        entry('https://cdn10.example.com/lib.js', 'application/javascript')
      ]
    }
  };
  const page = pagexray.convert(har)[0];
  t.is(page.firstPartyRegEx, '^127\\.0\\.0\\.1$');
  t.is(page.firstParty.requests, 2);
  t.is(page.thirdParty.requests, 1);
});
