/**
 * @author Peter Hedenskog
 * @copyright (c) 2015, Peter Hedenskog, Tobias Lidskog.
 * Released under the Apache 2.0 License.
 */

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
   * @param {HAR} har The HAR to process.
   * @param {Object} config The config object.
   * @returns {Object} The converted page object.
   */

  convert: function(har, config) {
    config = config || {};

    let assets = [];
    let responseCodes = {};
    let domains = {};
    let pages = [];
    let myPage = {};
    let testedPages = {};

    let exipireStats = new Statistics();
    let lastModifiedStats = new Statistics();

    har.log.entries.forEach(function(entry) {
      if (!testedPages[entry.pageref]) {
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
          httpVersion: util.getHTTPVersion(har.log.entries[0].response.httpVersion),
          contentTypes: {}
        };
        testedPages[entry.pageref] = myPage;
        pages.push(myPage);
      }
      let asset = collect.asset(entry);
      exipireStats.add(asset.expires);
      if (asset.timeSinceLastModified !== -1) {
        lastModifiedStats.add(asset.timeSinceLastModified);
      }

      assets.push(asset);
      collect.domainInfo(asset, domains);
      collect.responseCode(asset, responseCodes);
      collect.contentType(asset, myPage);

      myPage.transferSize += entry.response.bodySize;
      myPage.contentSize += entry.response.content.size < 0 ? entry.response.bodySize : entry.response.content.size;
      myPage.headerSize += entry.response.headersSize;

      myPage.requests++;
      myPage.domains = domains;
      myPage.responseCodes = responseCodes;
      myPage.expireStats = exipireStats.summarize();
      myPage.lastModifiedStats = lastModifiedStats.summarize();
      if (config.includeAssets) {
        myPage.assets = assets;
      }
    });

    return pages;
  }
};
