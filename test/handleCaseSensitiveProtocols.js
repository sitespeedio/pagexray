'use strict';

const test = require('ava');
const har = require('./helpers/har');

test('Handle URLs with different cases: should handle HTTPS and https', t => {
  const result = har.pagesFromTestHar('case-sensitive-protocol.har');
  t.deepEqual(
    result.map(r => r.url),
    ['https://www.verizonwireless.com/devices']
  );
});
