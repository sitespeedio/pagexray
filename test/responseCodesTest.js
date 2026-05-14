'use strict';

const test = require('ava');
const har = require('./helpers/har');

test('Response codes: we should be able identify all response codes', t => {
  const result = har.pagesFromTestHar(
    'redirect/aftonbladet.se-redirecting-to-www.har'
  );
  t.is(result[0].responseCodes[200], 168, '200');
  t.is(result[0].responseCodes[404], 1, '404');
  t.is(result[0].responseCodes[301], 1, '301');
  t.is(result[0].responseCodes[204], 2, '204');
});

test('Response codes: 304 should be included in the page size', t => {
  const result = har.pagesFromTestHar('responseCodes/304.har');
  t.truthy(result[0].contentTypes.css);
  t.truthy(result[0].contentTypes.javascript);
});
