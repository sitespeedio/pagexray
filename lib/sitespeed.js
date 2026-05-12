'use strict';

module.exports = {
  addMetrics: (har, pages) => {
    // For each page in the HAR file, add the extra metrics in
    // PageXray.
    // Using Browsertime we know the order of the pages are the same as
    // we generate in PageXray
    for (let i = 0; i < har.log.pages.length; i++) {
      const harPage = har.log.pages[i];
      const pageXrayPage = pages[i];
      if (pageXrayPage) {
        if (harPage._meta) {
          for (let name of Object.keys(harPage._meta)) {
            pageXrayPage.meta[name] = harPage._meta[name];
          }
        }
        pageXrayPage.visualMetrics = harPage._visualMetrics;
        pageXrayPage.meta.title = harPage.title;
        if (harPage._cpu) {
          pageXrayPage.cpu = harPage._cpu;
        }

        if (harPage._googleWebVitals) {
          pageXrayPage.googleWebVitals = harPage._googleWebVitals;
        }

        // Page-level style recalculation work captured by sitespeed.io
        // /browsertime (elements touched + duration before FCP/LCP).
        // The counts in `renderBlocking` come from iterating entries
        // in index.js, so the parent object may not exist yet for HARs
        // that have no per-request render-blocking flags — initialize
        // it before attaching the recalculation block.
        if (
          harPage._renderBlocking &&
          harPage._renderBlocking.recalculateStyle
        ) {
          if (!pageXrayPage.renderBlocking) {
            pageXrayPage.renderBlocking = {
              blocking: 0,
              potentiallyBlocking: 0,
              in_body_parser_blocking: 0
            };
          }
          pageXrayPage.renderBlocking.recalculateStyle =
            harPage._renderBlocking.recalculateStyle;
        }
      }
    }
  }
};
