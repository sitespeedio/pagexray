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

test('Sizes: a size of -1 in the HAR is not subtracted', t => {
  // Chrome sets headersSize to -1 for HTTP/2 and HTTP/3. The first party,
  // third party and domain totals subtracted it, so they were negative.
  const pages = har.pagesFromTestHar('browsertime/chrome-two-sites.har');
  for (const page of pages) {
    const totals = [
      page.transferSize,
      page.contentSize,
      page.headerSize,
      page.afterOnLoad.transferSize,
      page.afterOnContentLoad.transferSize
    ];
    for (const party of [page.firstParty, page.thirdParty]) {
      totals.push(party.transferSize, party.contentSize, party.headerSize);
    }
    for (const domain of Object.values(page.domains)) {
      totals.push(domain.transferSize, domain.contentSize, domain.headerSize);
    }
    for (const total of totals.filter(value => value !== undefined)) {
      t.true(total >= 0);
    }
  }
});
