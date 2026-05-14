'use strict';

const test = require('ava');
const har = require('./helpers/har');

test('Verify domains: total number of requests per domain should be right', t => {
  const result = har.pagesFromTestHar('domains/run.sitespeed.io.har');
  t.is(result[0].domains['run.sitespeed.io'].requests, 8);
  t.is(result[0].domains['www.google-analytics.com'].requests, 2);
});

test.todo(
  'Verify domains: we should be able to verify the size for all responses per domain'
);
