'use strict';

const test = require('ava');
const har = require('./helpers/har');

test('Content types: identify the number of content types', t => {
  const types = har.pagesFromTestHar('contentTypes/linkedin.har')[0]
    .contentTypes;
  t.is(types.html.requests, 1, 'html');
  t.is(types.javascript.requests, 8, 'javascript');
  t.is(types.css.requests, 2, 'css');
  t.is(types.image.requests, 5, 'image');
  t.is(types.xml.requests, 1, 'xml');
});

test('Content types: identify the number of content types (part 2)', t => {
  const types = har.pagesFromTestHar('contentTypes/aftonbladet.se.har')[0]
    .contentTypes;
  t.is(types.html.requests, 8, 'html');
  t.is(types.javascript.requests, 31, 'javascript');
  t.is(types.css.requests, 4, 'css');
  t.is(types.image.requests, 94, 'image');
  t.is(types.font.requests, 3, 'font');
  t.is(types.json.requests, 3, 'json');
  t.is(types.svg.requests, 2, 'svg');
  t.is(types.plain.requests, 2, 'plain');
  t.is(types.favicon.requests, 1, 'favicon');
  t.is(types.xml.requests, 1, 'xml');
  t.is(types.other.requests, 21, 'other');
});

test('Content types: fall back to file endings', t => {
  const types = har.pagesFromTestHar('contentTypes/ferguson.har')[0]
    .contentTypes;
  t.is(types.font.requests, 8);
});

test('Content types: favicon is always in the default content type shape', t => {
  // Pages without a favicon used to omit the field entirely, which
  // forced consumers to special-case it. The default shape now
  // matches the README example.
  const types = har.pagesFromTestHar('contentTypes/linkedin.har')[0]
    .contentTypes;
  t.true('favicon' in types, 'favicon default missing');
  t.is(types.favicon.requests, 0);
});

test('Content types: missingCompression is not over-reported for gzipped assets', t => {
  // Regression: headers.flatten wraps values in arrays, so the
  // string comparison in missingCompression never matched and every
  // large text asset was flagged. The aftonbladet HAR is gzipped
  // throughout — only a couple of assets should remain.
  const result = har.pagesFromTestHar('contentTypes/aftonbladet.se.har');
  t.true(
    result[0].missingCompression < 5,
    'missingCompression should be near 0 on a gzipped page, got ' +
      result[0].missingCompression
  );
});
