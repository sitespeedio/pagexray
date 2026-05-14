'use strict';

const test = require('ava');
const har = require('./helpers/har');

test('renderBlocking.recalculateStyle: surface page-level style recalculation work for browsertime HARs', t => {
  const pages = har.pagesFromTestHar(
    'sitespeed/browsertime-recalculate-style.har'
  );
  const rb = pages[0].renderBlocking;
  t.is(typeof rb, 'object');
  t.not(rb, null);
  t.is(typeof rb.recalculateStyle, 'object');
  t.is(typeof rb.recalculateStyle.beforeFCP, 'object');
  t.is(typeof rb.recalculateStyle.beforeLCP, 'object');
  t.is(typeof rb.recalculateStyle.beforeFCP.elements, 'number');
  t.is(typeof rb.recalculateStyle.beforeFCP.durationInMillis, 'number');
  t.is(typeof rb.recalculateStyle.beforeLCP.elements, 'number');
  t.is(typeof rb.recalculateStyle.beforeLCP.durationInMillis, 'number');
});

test('renderBlocking.recalculateStyle: leave renderBlocking alone for HARs without _renderBlocking', t => {
  // The Aftonbladet HAR is a plain (non-browsertime, non-WPT) HAR
  // with no _renderBlocking field on the page — recalculateStyle
  // should not get fabricated for it.
  const pages = har.pagesFromTestHar('aftonbladet.se-redirecting-to-www.har');
  if (pages[0].renderBlocking) {
    t.is(pages[0].renderBlocking.recalculateStyle, undefined);
  } else {
    t.pass();
  }
});
