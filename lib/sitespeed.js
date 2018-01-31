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
      pageXrayPage.meta.connectivity = harPage._meta.connectivity;
      pageXrayPage.meta.screenshot = harPage._meta.screenshot;
      pageXrayPage.meta.video = harPage._meta.video;
      pageXrayPage.meta.result = harPage._meta.result;
      pageXrayPage.visualMetrics = harPage._visualMetrics;
      pageXrayPage.meta.title = harPage.title;

      if (harPage._cpu) {
        pageXrayPage.cpu = harPage._cpu;
      }
    }
  }
};
