'use strict';

const test = require('ava');
const har = require('./helpers/har');

test('Sizes: total contentSize should not be minus values', t => {
  const result = har.pagesFromTestHar('size/minusSizeForContentFirefox.har');
  t.true(result[0].contentSize > 0);
});

test('Sizes: total contentSize should be right', t => {
  // yep it's true, I used Google to calculate the size
  const result = har.pagesFromTestHar('size/allSizes.har');
  t.is(result[0].contentSize, 102069);
});

test('Sizes: total transferSize should be right', t => {
  const result = har.pagesFromTestHar('size/allSizes.har');
  t.is(result[0].transferSize, 102069);
});

test('Sizes: total headerSize should be right', t => {
  const result = har.pagesFromTestHar('size/allSizes.har');
  t.is(result[0].headerSize, 6480);
});
