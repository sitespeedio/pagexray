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
   * Convert a HAR object to a Page.
   * @param {Object} har The HAR to process.
   * @param {Object} config The config object.
   * @returns {Object} The converted page object.
   */

  convert: (har, config) => {
    config = config || {};

    const pages = [];
    let myPage = {};
    const testedPages = {};

    har.log.entries.forEach((entry) => {
      if (!testedPages[entry.pageref]) {
        const redirects = util.getFinalURL(entry, har);
        myPage = {
          url: har.log.entries[0].request.url,
          finalUrl: redirects.url,
          baseDomain: util.getHostname(redirects.url),
          documentRedirects: (redirects.chain.length - 1),
          redirectChain: redirects.chain,
          transferSize: 0,
          contentSize: 0,
          headerSize: 0,
          requests: 0,
          // TODO this will not be right if redirected!!!
          httpType: util.getConnectionType(har.log.entries[0].response.httpVersion),
          httpVersion: util.getHTTPVersion(har.log.entries[0].response.httpVersion),
          // we have a couple of default content tyypes that we always reports
          // if we find others, just add them
          contentTypes: {
            html: {
              transferSize: 0,
              contentSize: 0,
              headerSize: 0,
              requests: 0,
            },
            css: {
              transferSize: 0,
              contentSize: 0,
              headerSize: 0,
              requests: 0,
            },
            javascript: {
              transferSize: 0,
              contentSize: 0,
              headerSize: 0,
              requests: 0,
            },
            image: {
              transferSize: 0,
              contentSize: 0,
              headerSize: 0,
              requests: 0,
            },
            font: {
              transferSize: 0,
              contentSize: 0,
              headerSize: 0,
              requests: 0,
            },
          },
          assets: [],
          responseCodes: {},
          firstParty: {
            cookieStats: new Statistics(),
          },
          thirdParty: {
            cookieStats: new Statistics(),
          },
          domains: {},
          expireStats: new Statistics(),
          lastModifiedStats: new Statistics(),
          cookieStats: new Statistics(),
        };
        testedPages[entry.pageref] = myPage;
        pages.push(myPage);
      }
      const asset = collect.asset(entry);
      myPage.expireStats.add(asset.expires);
      if (asset.timeSinceLastModified !== -1) {
        myPage.lastModifiedStats.add(asset.timeSinceLastModified);
      }
      myPage.cookieStats.add(asset.cookies);

      myPage.assets.push(asset);
      collect.domainInfo(asset, myPage.domains, config);
      collect.responseCode(asset, myPage.responseCodes);
      collect.contentType(asset, myPage);

      myPage.transferSize += entry.response.bodySize;
      myPage.contentSize += entry.response.content.size < 0 ? entry.response.bodySize :
        entry.response.content.size;
      myPage.headerSize += entry.response.headersSize;

      // add first/third party info
      if (config.firstParty) {
        // is it a third party asset?
        if (asset.url.match(config.firstParty) === null) {
          myPage.thirdParty.requests = myPage.thirdParty.requests + 1 || 1;
          myPage.thirdParty.transferSize = myPage.thirdParty.transferSize + asset.transferSize ||
            asset.transferSize;
          myPage.thirdParty.contentSize = myPage.thirdParty.contentSize + asset.contentSize ||
            asset.contentSize;
          myPage.thirdParty.headerSize = myPage.thirdParty.headerSize + asset.headerSize ||
            asset.headerSize;
          myPage.thirdParty.cookieStats.add(asset.cookies);
        } else {
          myPage.firstParty.requests = myPage.firstParty.requests + 1 || 1;
          myPage.firstParty.transferSize = myPage.firstParty.transferSize + asset.transferSize ||
            asset.transferSize;
          myPage.firstParty.contentSize = myPage.firstParty.contentSize + asset.contentSize ||
            asset.contentSize;
          myPage.firstParty.headerSize = myPage.firstParty.headerSize + asset.headerSize ||
            asset.headerSize;
          myPage.firstParty.cookieStats.add(asset.cookies);
        }
      }

      myPage.requests += 1;
    });

    // cleanup the stats
    pages.forEach((page) => {
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
  },
};
