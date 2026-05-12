'use strict';

const assert = require('chai').assert,
  har = require('./helpers/har');

describe('renderBlocking.recalculateStyle', function() {
  it('should surface page-level style recalculation work for browsertime HARs', function() {
    return har.pagesFromTestHar('sitespeed/browsertime-recalculate-style.har')
      .then(pages => {
        const rb = pages[0].renderBlocking;
        assert.isObject(rb, 'renderBlocking should exist');
        assert.isObject(rb.recalculateStyle, 'recalculateStyle should be attached');
        assert.isObject(rb.recalculateStyle.beforeFCP);
        assert.isObject(rb.recalculateStyle.beforeLCP);
        assert.isNumber(rb.recalculateStyle.beforeFCP.elements);
        assert.isNumber(rb.recalculateStyle.beforeFCP.durationInMillis);
        assert.isNumber(rb.recalculateStyle.beforeLCP.elements);
        assert.isNumber(rb.recalculateStyle.beforeLCP.durationInMillis);
      });
  });

  it('should leave renderBlocking alone for HARs without _renderBlocking', function() {
    // The Aftonbladet HAR is a plain (non-browsertime, non-WPT) HAR
    // with no _renderBlocking field on the page — recalculateStyle
    // should not get fabricated for it.
    return har.pagesFromTestHar('aftonbladet.se-redirecting-to-www.har')
      .then(pages => {
        if (pages[0].renderBlocking) {
          assert.isUndefined(pages[0].renderBlocking.recalculateStyle);
        }
      });
  });
});
