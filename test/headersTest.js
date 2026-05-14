'use strict';

const test = require('ava');
const headers = require('../lib/headers');

test('headers.flatten: flatten HAR headers', t => {
  const harHeaders = [
    {name: 'header1', value: 'value1'},
    {name: 'header2', value: 'value2'},
    {name: 'HEADER3', value: 'value3'},
    {name: 'HEADER3', value: 'value4'}
  ];
  const expected = {
    header1: ['value1'],
    header2: ['value2'],
    header3: ['value3', 'value4']
  };
  t.deepEqual(headers.flatten(harHeaders), expected);
});

test('getTimeSinceLastModified: -1 for missing last-modified header', t => {
  t.is(headers.getTimeSinceLastModified({}), -1);
});

test('getTimeSinceLastModified: -1 for invalid last-modified header', t => {
  t.is(headers.getTimeSinceLastModified({'last-modified': ['xyz']}), -1);
});

test('getTimeSinceLastModified: positive time with only last-modified header', t => {
  const result = headers.getTimeSinceLastModified({
    'last-modified': ['Wed, 26 Aug 2015 12:37:50 GMT']
  });
  t.true(result > 0);
});

test('getTimeSinceLastModified: handle invalid date header', t => {
  // last-modified is kept comfortably in the future so the
  // `Date.now()` fallback (used when `date` is unparseable)
  // still yields a negative diff — exercising the fallback
  // path is the point of this test.
  const result = headers.getTimeSinceLastModified({
    'last-modified': ['Wed, 26 Aug 2099 12:37:50 GMT'],
    date: ['Wedding']
  });
  t.true(result < 0);
});

test('getTimeSinceLastModified: calculate diff between last-modified and date headers', t => {
  const result = headers.getTimeSinceLastModified({
    'last-modified': ['Wed, 26 Aug 2015 12:37:50 GMT'],
    date: ['Wed, 26 Aug 2015 12:37:51 GMT']
  });
  t.is(result, 1);
});

test('getExpires: 0 for empty headers', t => {
  t.is(headers.getExpires({}), 0);
});

test('getExpires: 0 when cache-control is no-cache', t => {
  t.is(headers.getExpires({'cache-control': ['no-cache']}), 0);
});

test('getExpires: 0 when cache-control is no-store', t => {
  t.is(headers.getExpires({'cache-control': ['no-store']}), 0);
});

test('getExpires: parse max-age from cache-control', t => {
  t.is(headers.getExpires({'cache-control': ['max-age=42']}), 42);
});

test('getExpires: handle invalid max-age from cache-control', t => {
  t.is(headers.getExpires({'cache-control': ['max-age=xyz42']}), 0);
});

test('getExpires: handle invalid expires header (xyz)', t => {
  t.is(headers.getExpires({expires: ['xyz']}), 0);
});

test('getExpires: handle multi-line expires header (nytimes.com)', t => {
  t.is(
    headers.getExpires({
      expires: ['Wed Sep 15 09:14:42 MDT 2010\nThu Sep 16 15:24:47 MDT 2010']
    }),
    0
  );
});

test('getExpires: handle numeric expires header (nytimes.com)', t => {
  t.is(headers.getExpires({expires: ['0']}), 0);
});

test('getExpires: parse valid expires header', t => {
  t.true(headers.getExpires({expires: ['Wed, 26 Aug 2015 12:37:50 GMT']}) < 0);
});

test('getExpires: parse case-insensitive max-age (RFC 7234 §5.2)', t => {
  t.is(headers.getExpires({'cache-control': ['Max-Age=42']}), 42);
});

test('getExpires: respect case-insensitive no-cache', t => {
  t.is(headers.getExpires({'cache-control': ['No-Cache, Max-Age=42']}), 0);
});

test('getThirdPartyCookieNames: match Domain= case-insensitively', t => {
  // RFC 6265 §5.2: attribute names are case-insensitive. The previous
  // implementation split on the literal string "Domain=" and missed
  // cookies that used lowercase `domain=`.
  const harHeaders = [
    {name: 'Set-Cookie', value: 'sid=abc; domain=.tracker.io; Path=/'}
  ];
  t.deepEqual(
    headers.getThirdPartyCookieNames(harHeaders, '.*sitespeed.*'),
    [{name: 'sid', domain: '.tracker.io'}]
  );
});

test('getThirdPartyCookieNames: skip cookies whose domain matches first-party', t => {
  const harHeaders = [
    {name: 'Set-Cookie', value: 'sid=abc; Domain=.sitespeed.io; Path=/'}
  ];
  t.deepEqual(
    headers.getThirdPartyCookieNames(harHeaders, '.*sitespeed.*'),
    []
  );
});
