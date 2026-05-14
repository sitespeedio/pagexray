'use strict';

const test = require('ava');
const har = require('./helpers/har');

test('Requests: we should be able identify the right number of requests', t => {
  const result = har.pagesFromTestHar('requests/expressen.har');
  t.is(result[0].requests, 202, 'Run 1');
  t.is(result[1].requests, 203, 'Run 2');
  t.is(result[2].requests, 202, 'Run 3');
});
