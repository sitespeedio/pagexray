'use strict';

const test = require('ava');
const util = require('../lib/util');
const har = require('./helpers/har');

const typeToMimeMapping = {
  html: ['text/html', 'text/html; charset=utf-8'],
  plain: ['text/plain'],
  javascript: ['text/javascript', 'application/x-javascript; charset=utf-8'],
  css: ['text/css'],
  image: ['image/png', 'image/jpg', 'image/gif', 'image/webp'],
  svg: ['image/svg+xml'],
  font: [
    'application/font-woff',
    'application/font-sfnt',
    'application/x-font-opentype',
    'application/x-font-ttf',
    'application/vnd.ms-fontobject',
    'application/x-font-ttf',
    'application/x-font-opentype'
  ],
  flash: ['application/x-shockwave-flash'],
  favicon: ['image/x-icon', 'image/vnd.microsoft.icon'],
  other: ['application/my-own-type']
};

for (const [type, mimes] of Object.entries(typeToMimeMapping)) {
  for (const mime of new Set(mimes)) {
    test(`getContentType: categorize ${mime} as ${type}`, t => {
      t.is(
        util.getContentType(mime, 'https:/www.test.com/test.strange'),
        type
      );
    });
  }
}

test('getHostname: fetch the domain from a URL with a filename', t => {
  t.is(
    util.getHostname('https://www.sitespeed.io/with/a/path.jsp'),
    'www.sitespeed.io'
  );
});

test('getHostname: fetch the domain from a URL with a query string', t => {
  t.is(
    util.getHostname('https://www.sitespeed.io/with/a/?apa=hepp&apa2=oj'),
    'www.sitespeed.io'
  );
});

test('getHostname: fetch the domain from a URL with #', t => {
  t.is(
    util.getHostname('http://www.sitespeed.io/with/a/?apa=hepp&apa2=oj#yes'),
    'www.sitespeed.io'
  );
});

test('getHostname: fetch the domain from a URL with only the domain', t => {
  t.is(util.getHostname('http://www.sitespeed.io'), 'www.sitespeed.io');
});

test('getHostname: fetch the domain from a URL without a sub domain', t => {
  t.is(util.getHostname('http://sitespeed.io'), 'sitespeed.io');
});

test('getHostname: empty if missing', t => {
  t.is(util.getHostname('hoppla'), '');
});

test('getHostname: empty if undefined', t => {
  t.is(util.getHostname(), '');
});

test('getDocumentRequests: should not report redirects when none exist', t => {
  const harFile = har.parseTestHar('domains/run.sitespeed.io.har');
  const firstRequest = harFile.log.entries[0];
  const result = util.getDocumentRequests(
    harFile.log.entries,
    firstRequest.pageref
  );
  t.is(result.length, 1);
});

test('getDocumentRequests: return empty array when no entries match the pageref', t => {
  // Previously this threw "Cannot read properties of undefined (reading 'response')"
  // when a HAR contained a page whose pageref didn't appear in log.entries.
  t.deepEqual(util.getDocumentRequests([], 'page_0'), []);
});

test('getConnectionType: detect HTTP/3 from the canonical string', t => {
  // Some HARs report the version as 'HTTP/3' / 'HTTP/3.0' rather than the
  // lowercase 'h3' shorthand. Both should map to 'h3'.
  t.is(util.getConnectionType('HTTP/3'), 'h3');
  t.is(util.getConnectionType('HTTP/3.0'), 'h3');
  t.is(util.getConnectionType('h3'), 'h3');
  t.is(util.getConnectionType('h3-29'), 'h3');
});

test('getMainDomain: peel off two-label public suffixes beyond .co.uk', t => {
  // Previously only `.co.uk` was recognised, so `bbc.com.br` collapsed
  // to `com` and the auto-firstParty regex pulled in unrelated sites.
  t.is(util.getMainDomain('www.bbc.co.uk'), 'bbc');
  t.is(util.getMainDomain('www.bbc.com.br'), 'bbc');
  t.is(util.getMainDomain('www.bbc.co.jp'), 'bbc');
  t.is(util.getMainDomain('www.bbc.com.au'), 'bbc');
  t.is(util.getMainDomain('www.bbc.com'), 'bbc');
  t.is(util.getMainDomain('sitespeed.io'), 'sitespeed');
});
