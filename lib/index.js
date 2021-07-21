'use strict';

const util = require('./util');
const collect = require('./collect');
const sitespeed = require('./sitespeed');
const webpagetest = require('./webpagetest');
const Statistics = require('./statistics').Statistics;

function cleanupStatistics(pages, config, firstParty) {
  pages.forEach(page => {
    page.expireStats = page.expireStats.summarize();
    page.lastModifiedStats = page.lastModifiedStats.summarize();
    page.totalDomains = Object.keys(page.domains).length;
    if (!config.includeAssets) {
      page.assets = [];
    }
    if (!firstParty) {
      page.firstParty = {};
      page.thirdParty = {};
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
    let firstParty;

    if (
      config.firstParty ||
      (har.log.pages[0]._meta && har.log.pages[0]._meta.firstParty)
    ) {
      firstParty = config.firstParty || har.log.pages[0]._meta.firstParty;
    }

    function sortByTime(a, b) {
      // We can "fix" this later by checking entry.pageref
      // and for WebPagetest use entry._run
      return (
        new Date(a.startedDateTime).getTime() -
        new Date(b.startedDateTime).getTime()
      );
    }

    const entries = Array.from(har.log.entries);
    // Sometimes WebPageTest has request in run number 2
    // that has timings from run number 1
    if (har.log.creator.name !== 'WebPagetest') {
      entries.sort(sortByTime);
    }

    // Summarize the timings for all pages
    const pageTimings = {};
    const pageUrls = {};
    for (let page of har.log.pages) {
      const pageStartTime = new Date(page.startedDateTime).getTime();
      pageTimings[page.id] = {
        onLoad: pageStartTime + page.pageTimings.onLoad,
        onContentLoad: pageStartTime + page.pageTimings.onContentLoad
      };
      // Browsertime adds the URL to make sure we use the browsers URL
      // for SPA:s
      if (page._url) {
        pageUrls[page.id] = page._url;
      }
    }
    entries.forEach(entry => {
      if (!testedPages[entry.pageref]) {
        const requests = util.getDocumentRequests(entries, entry.pageref);

        const finalEntry = requests.pop();
        const redirectChain = requests.map(entry => entry.request.url);
        const httpVersion = finalEntry.response.httpVersion;
        const finalUrl = finalEntry.request.url;
        const baseDomain = util.getHostname(finalUrl);
        // If there is no setup for a first party setup,
        // then use a default one
        if (!firstParty) {
          const mainDomain = util.getMainDomain(baseDomain);
          // Hack for ... Wikipedia!
          if (mainDomain === 'wikipedia') {
            firstParty = '(.*wikipedia.*||.*wikimedia.*)';
          } else {
            firstParty = '.*' + mainDomain + '.*';
          }
        }
        currentPage = {
          url: pageUrls[entry.pageref]
            ? pageUrls[entry.pageref]
            : entry.request.url,
          meta: { browser: {}, startedDateTime: entry.startedDateTime },
          finalUrl,
          baseDomain: baseDomain,
          firstPartyRegEx: firstParty,
          documentRedirects: redirectChain.length,
          redirectChain,
          transferSize: 0,
          contentSize: 0,
          headerSize: 0,
          requests: 0,
          cookieNames: [],
          cookieNamesThirdParties: [],
          cookies: 0,
          missingCompression: 0,
          fullyLoaded: util.getFullyLoaded(
            entry.pageref,
            entries,
            entry.startedDateTime
          ),
          httpType: util.getConnectionType(httpVersion),
          httpVersion: util.getHTTPVersion(httpVersion),
          contentTypes: collect.defaultContentTypes(),
          assets: [],
          responseCodes: {},
          firstParty: {
            cookies: 0,
            contentTypes: collect.defaultContentTypes()
          },
          thirdParty: {
            cookies: 0,
            contentTypes: collect.defaultContentTypes()
          },
          domains: {},
          expireStats: new Statistics(),
          lastModifiedStats: new Statistics(),
          afterOnContentLoad: {
            requests: 0,
            transferSize: 0,
            contentTypes: collect.defaultContentTypes()
          },
          afterOnLoad: {
            requests: 0,
            transferSize: 0,
            contentTypes: collect.defaultContentTypes()
          }
        };

        if (har.log.browser && har.log.browser.name) {
          currentPage.meta.browser.name = har.log.browser.name;
        }
        if (har.log.browser && har.log.browser.version) {
          currentPage.meta.browser.version = har.log.browser.version;
        }

        testedPages[entry.pageref] = currentPage;
        pages.push(currentPage);
      } else {
        currentPage = testedPages[entry.pageref];
      }

      const asset = collect.asset(entry, firstParty);
      currentPage.expireStats.add(asset.expires);
      if (asset.timeSinceLastModified !== -1) {
        currentPage.lastModifiedStats.add(asset.timeSinceLastModified);
      }

      currentPage.assets.push(asset);
      collect.domainInfo(asset, currentPage.domains, config);
      collect.responseCode(asset, currentPage.responseCodes);
      collect.contentType(asset, currentPage.contentTypes);
      collect.missingCompression(asset, currentPage);

      if (asset.renderBlocking) {
        if (!currentPage.renderBlocking) {
          currentPage.renderBlocking = {
            blocking: 0,
            potentiallyBlocking: 0,
            in_body_parser_blocking: 0
          };
        }
        if (asset.renderBlocking === 'potentially_blocking') {
          currentPage.renderBlocking.potentiallyBlocking += 1;
        } else if (asset.renderBlocking === 'blocking') {
          currentPage.renderBlocking.blocking += 1;
        } else if (asset.renderBlocking === 'in_body_parser_blocking') {
          currentPage.renderBlocking.in_body_parser_blocking += 1;
        }
      }

      currentPage.transferSize += entry.response.bodySize;
      currentPage.contentSize +=
        entry.response.content.size < 0
          ? entry.response.bodySize
          : entry.response.content.size;
      currentPage.headerSize += Math.max(entry.response.headersSize, 0);

      const entryStart = new Date(entry.startedDateTime).getTime();
      if (
        pageTimings[entry.pageref] &&
        entryStart > pageTimings[entry.pageref].onLoad
      ) {
        currentPage.afterOnLoad.requests += 1;
        currentPage.afterOnLoad.transferSize += entry.response.bodySize;
        collect.contentType(asset, currentPage.afterOnLoad.contentTypes);
      }
      if (
        pageTimings[entry.pageref] &&
        entryStart > pageTimings[entry.pageref].onContentLoad
      ) {
        currentPage.afterOnContentLoad.requests += 1;
        currentPage.afterOnContentLoad.transferSize += entry.response.bodySize;
        collect.contentType(asset, currentPage.afterOnContentLoad.contentTypes);
      }
      // add first/third party info
      if (firstParty) {
        // is it a third party asset?
        let stats = currentPage.thirdParty;
        if (util.getHostname(asset.url).match(firstParty)) {
          stats = currentPage.firstParty;
        }

        stats.requests = stats.requests + 1 || 1;
        stats.transferSize =
          stats.transferSize + asset.transferSize || asset.transferSize;
        stats.contentSize =
          stats.contentSize + asset.contentSize || asset.contentSize;
        stats.headerSize =
          stats.headerSize + asset.headerSize || asset.headerSize;
        collect.contentType(asset, stats.contentTypes);
        currentPage.firstParty.cookies +=
          asset.cookieNames.length - asset.cookieNamesThirdParties.length;
        currentPage.thirdParty.cookies += asset.cookieNamesThirdParties.length;
      }
      if (asset.cookieNames.length > 0) {
        currentPage.cookieNames.push(...asset.cookieNames);
        currentPage.cookies += asset.cookieNames.length;
      }
      if (asset.cookieNamesThirdParties.length > 0) {
        currentPage.cookieNamesThirdParties.push(
          ...asset.cookieNamesThirdParties
        );
      }
      currentPage.requests += 1;
    });

    // cleanup the stats
    cleanupStatistics(pages, config, firstParty);

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
