'use strict';

module.exports = {
  addMetrics: (har, pages) => {
    for (let i = 0; i < har.log.pages.length; i++) {
      const harPage = har.log.pages[i];
      const pageXrayPage = pages[i];
      // sometimes we WebPageTest doesn't send data for that page, if the run failed
      if (pageXrayPage) {
        pageXrayPage.visualMetrics = {};
        if (harPage._lastVisualChange) {
          pageXrayPage.visualMetrics.LastVisualChange =
            harPage._lastVisualChange;
        }
        if (harPage._SpeedIndex) {
          pageXrayPage.visualMetrics.SpeedIndex = harPage._SpeedIndex;
        }
        if (harPage.pageTimings._startRender) {
          pageXrayPage.visualMetrics.FirstVisualChange =
            harPage.pageTimings._startRender;
        }
        if (harPage._visualComplete85) {
          pageXrayPage.visualMetrics.VisualComplete85 =
            harPage._visualComplete85;
        }

        pageXrayPage.meta.title = harPage.title;

        // take the CPU data that starts with _cpu and remove
        // the _cpu part
        const cpu = Object.keys(harPage)
          .filter(metricName => {
            return metricName.indexOf('_cpu') === 0;
          })
          .reduce((cpuData, name) => {
            cpuData[name.split('.')[1]] = harPage[name];
            return cpuData;
          }, {});
        if (Object.keys(cpu).length > 0) {
          pageXrayPage.cpu = {};
          pageXrayPage.cpu.events = cpu;
        }
      }
    }
  }
};
