'use strict';

let util = require('./util'),
  collect = require('./collect'),
  Statistics = require('./statistics').Statistics;

/**
 * Convert a HAR object to a better page summary.
 * @module Snufkin
 */

module.exports = {

  /**
   * Convert a HAR object to a Page.
   * @param {Object} har The HAR to process.
   * @param {Object} config The config object.
   * @returns {Object} The converted page object.
   */

  convert: function(har, config) {
    config = config || {};

    let pages = [];
    let myPage = {};
    let testedPages = {};

    har.log.entries.forEach(function(entry) {
      if (!testedPages[entry.pageref]) {
        console.log(entry.pageref);
        let redirects = util.getFinalURL(entry, har);
        myPage = {
          url: har.log.entries[0].request.url,
          finalUrl: redirects.url,
          baseDomain: util.getHostname(redirects.url),
          documentRedirects: redirects.redirects,
          transferSize: 0,
          contentSize: 0,
          headerSize: 0,
          requests: 0,
          // TODO this will not be right if redirected!!!
          httpType: util.getConnectionType(har.log.entries[0].response.httpVersion),
          httpVersion: util.getHTTPVersion(har.log.entries[0].response.httpVersion),
          contentTypes: {},
          assets: [],
          responseCodes: {},
          domains: {},
          expireStats: new Statistics(),
          lastModifiedStats: new Statistics()

        };
        testedPages[entry.pageref] = myPage;
        pages.push(myPage);
      }
      let asset = collect.asset(entry);
      myPage.expireStats.add(asset.expires);
      if (asset.timeSinceLastModified !== -1) {
        myPage.lastModifiedStats.add(asset.timeSinceLastModified);
      }

      myPage.assets.push(asset);
      collect.domainInfo(asset, myPage.domains);
      collect.responseCode(asset, myPage.responseCodes);
      collect.contentType(asset, myPage);

      myPage.transferSize += entry.response.bodySize;
      myPage.contentSize += entry.response.content.size < 0 ? entry.response.bodySize : entry.response.content.size;
      myPage.headerSize += entry.response.headersSize;

      myPage.requests++;
    });

    // cleanup the stats
    pages.forEach(function(page) {
      page.expireStats = page.expireStats.summarize();
      page.lastModifiedStats = page.lastModifiedStats.summarize();
      if (!config.includeAssets) {
        page.assets = [];
      }
    });

    return pages;
  }
};
