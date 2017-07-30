'use strict';

const util = require('./util');
const collect = require('./collect');
const sitespeed = require('./sitespeed');
const webpagetest = require('./webpagetest');
const Statistics = require('./statistics').Statistics;

function cleanupStatistics(pages, config) {
  pages.forEach(page => {
    page.expireStats = page.expireStats.summarize();
    page.lastModifiedStats = page.lastModifiedStats.summarize();
    page.cookieStats = page.cookieStats.summarize();
    page.totalDomains = Object.keys(page.domains).length;
    if (!config.includeAssets) {
      page.assets = [];
    }
    if (!config.firstParty) {
      page.firstParty = {};
      page.thirdParty = {};
    } else {
      page.firstParty.cookieStats = page.firstParty.cookieStats.summarize();
      page.thirdParty.cookieStats = page.thirdParty.cookieStats.summarize();
    }
  });
}
/**
 * Convert a HAR object to a better page summary.
 * @module PageXray
 */

module.exports = {
  /**
   * Convert one HAR to a page. Use this when you are interested
   * of one specific run in a HAR.
   * @param {Object} har The HAR to process.
   * @param {Number} index The index of the HAR file of the run that will be converted.
   * @param {Object} config The config object.
   * @returns {Array} The converted page object.
   */
  convertIndex: (har, index, config) => {
    // TODO in the future only convert that specific run to save time
    const pages = module.exports.convert(har, config);
    return pages[index];
  },

  /**
   * Convert a HAR object to an array of pages.
   * @param {Object} har The HAR to process.
   * @param {Object} config The config object.
   * @returns {Array} The converted page objects.
   */

  convert: (har, config) => {
    config = config || {};

    const pages = [];
    let currentPage = {};
    const testedPages = {};

    har.log.entries.forEach(entry => {
      if (!testedPages[entry.pageref]) {
        const redirects = util.getFinalURL(entry, har);
        const httpVersion =
          redirects.chain.length === 0
            ? entry.response.httpVersion
            : util.getEntryByURL(har.log.entries, redirects.url).response
                .httpVersion;
        currentPage = {
          url: entry.request.url,
          meta: { browser: {}, startedDateTime: entry.startedDateTime },
          finalUrl: redirects.url,
          baseDomain: util.getHostname(redirects.url),
          documentRedirects:
            redirects.chain.length === 0 ? 0 : redirects.chain.length - 1,
          redirectChain: redirects.chain,
          transferSize: 0,
          contentSize: 0,
          headerSize: 0,
          requests: 0,
          missingCompression: 0,
          httpType: util.getConnectionType(httpVersion),
          httpVersion: util.getHTTPVersion(httpVersion),
          contentTypes: collect.defaultContentTypes(),
          assets: [],
          responseCodes: {},
          firstParty: {
            cookieStats: new Statistics(),
            contentTypes: collect.defaultContentTypes()
          },
          thirdParty: {
            cookieStats: new Statistics(),
            contentTypes: collect.defaultContentTypes()
          },
          domains: {},
          expireStats: new Statistics(),
          lastModifiedStats: new Statistics(),
          cookieStats: new Statistics()
        };

        if (har.log.browser && har.log.browser.name) {
          currentPage.meta.browser.name = har.log.browser.name;
        }
        if (har.log.browser && har.log.browser.version) {
          currentPage.meta.browser.version = har.log.browser.version;
        }

        testedPages[entry.pageref] = currentPage;
        pages.push(currentPage);
      }
      const asset = collect.asset(entry);
      currentPage.expireStats.add(asset.expires);
      if (asset.timeSinceLastModified !== -1) {
        currentPage.lastModifiedStats.add(asset.timeSinceLastModified);
      }
      currentPage.cookieStats.add(asset.cookies);

      currentPage.assets.push(asset);
      collect.domainInfo(asset, currentPage.domains, config);
      collect.responseCode(asset, currentPage.responseCodes);
      collect.contentType(asset, currentPage.contentTypes);
      collect.missingCompression(asset, currentPage);

      currentPage.transferSize += entry.response.bodySize;
      currentPage.contentSize +=
        entry.response.content.size < 0
          ? entry.response.bodySize
          : entry.response.content.size;
      currentPage.headerSize += entry.response.headersSize;

      // add first/third party info
      if (config.firstParty) {
        // is it a third party asset?

        let stats = currentPage.thirdParty;

        if (asset.url.match(config.firstParty)) {
          stats = currentPage.firstParty;
        }

        stats.requests = stats.requests + 1 || 1;
        stats.transferSize =
          stats.transferSize + asset.transferSize || asset.transferSize;
        stats.contentSize =
          stats.contentSize + asset.contentSize || asset.contentSize;
        stats.headerSize =
          stats.headerSize + asset.headerSize || asset.headerSize;
        stats.cookieStats.add(asset.cookies);
        collect.contentType(asset, stats.contentTypes);
      }

      currentPage.requests += 1;
    });

    // cleanup the stats
    cleanupStatistics(pages, config);

    // If we have that extra meta field in the HAR, we are pretty sure
    // it is generated using sitespeed.io/browsertime, so add those
    // extra metrics
    if (har.log.pages[0]._meta) {
      sitespeed.addMetrics(har, pages);
    } else if (har.log.creator.name === 'WebPagetest') {
      webpagetest.addMetrics(har, pages);
    }
    return pages;
  }
};
