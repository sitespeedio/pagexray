'use strict';

const test = require('ava');
const har = require('./helpers/har');

test('Converting URLs: should convert urls', t => {
  const result = har.pagesFromTestHar('www.nytimes.com.har');
  t.deepEqual(
    result.map(r => r.url),
    ['http://www.nytimes.com/', 'http://www.nytimes.com/']
  );
});
