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
        for (let name of Object.keys(harPage._meta)) {
          pageXrayPage.meta[name] = harPage._meta[name];
        }
        pageXrayPage.visualMetrics = harPage._visualMetrics;
        pageXrayPage.meta.title = harPage.title;
        if (harPage._cpu) {
          pageXrayPage.cpu = harPage._cpu;
        }

        if (harPage._googleWebVitals) {
          pageXrayPage.googleWebVitals = harPage._googleWebVitals;
        }
      }
    }
  }
};
