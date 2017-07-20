'use strict';

const util = require('./util');
const collect = require('./collect');
const Statistics = require('./statistics').Statistics;

/**
 * Convert a HAR object to a better page summary.
 * @module PageXray
 */

module.exports = {
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
        currentPage = {
          url: har.log.entries[0].request.url,
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
          // TODO this will not be right if redirected!!!
          httpType: util.getConnectionType(
            har.log.entries[0].response.httpVersion
          ),
          httpVersion: util.getHTTPVersion(
            har.log.entries[0].response.httpVersion
          ),
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
    return pages;
  }
};
