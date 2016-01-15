/**
 * @author Peter Hedenskog
 * @copyright (c) 2015, Peter Hedenskog, Tobias Lidskog.
 * Released under the Apache 2.0 License.
 */

'use strict';

let util = require('./util');

/*
 * Collect information about a response (asset).
 * @private
 * @param {Object} entry The HAR entry.
 * @returns {Object} A simplified asset.
 */
function collectAsset(entry) {
  let contentType = util.getContentType(entry.response.content.mimeType);
  let requestHeaders = util.flattenHeaders(entry.request.headers);
  let responseHeaders = util.flattenHeaders(entry.response.headers);
  return {
    type: contentType,
    url: entry.request.url,
    transferSize:  entry.response.bodySize,
    contentSize: entry.response.content.size,
    headerSize: entry.response.headersSize,
    expires: util.getExpires(responseHeaders),
    status: entry.response.status,
    timeSinceLastModified: util.getTimeSinceLastModified(responseHeaders),
    httpVersion: entry.response.httpVersion,
    headers: {
      request: requestHeaders,
      response: responseHeaders
    }
  };
}

/*
 * Collect information about the domain for the asset.
 * @param {Object} asset The asset.
 * @param {Object} domains The placeholder for the domain info.
 * @returns {void}
 * @private
 */
function collectDomainInfo(asset, domains) {
  let domain = util.getHostname(asset.url);
  if (domains[domain]) {
    domains[domain].transferSize += asset.transferSize;
    domains[domain].contentSize += asset.contentSize;
    domains[domain].headerSize += asset.headerSize;
    domains[domain].requests += 1;
  } else {
    domains[domain] = {
      requests: 1,
      transferSize: asset.transferSize,
      contentSize: asset.contentSize,
      headerSize: asset.headerSize
    };
  }
}

/*
 * Collect the response code from a asset.
 * @param {Object} asset The asset.
 * @param {Object} responseCodes Where we keep all the response codes.
 * @returns {void}
 * @private
 */
function collectResponseCode(asset, responseCodes) {
  if (responseCodes[asset.status]) {
    responseCodes[asset.status]++;
  } else {
    responseCodes[asset.status] = 1;
  }
}

/*
 * Collect content type from an asset.
 * @param {Object} asset The asset.
 * @param {Object} myPage The placeholder for content types.
 * @returns {void}
 * @private
 */
function collectContentType(asset, myPage) {
  if (asset.status === 200) {

    // TODO how to handle unknown?
    if (myPage[asset.type]) {
      myPage[asset.type].requests++;
      // header vs content size?
      myPage[asset.type].transferSize += asset.transferSize;
      myPage[asset.type].contentSize += asset.contentSize;
      myPage[asset.type].headerSize += asset.headerSize;
    } else {
      myPage[asset.type] = {
        transferSize: asset.transferSize,
        contentSize: asset.contentSize,
        headerSize: asset.headerSize,
        requests: 1
      };
    }
  }
}

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

    har.log.entries.forEach(function(entry) {
      if (!testedPages[entry.pageref]) {
        myPage = {
          url: har.log.entries[0].request.url,
          // TODO handle redirects
          baseDomain: util.getHostname(util.getFinalURL(entry, har)),
          transferSize: 0,
          contentSize: 0,
          headerSize: 0,
          requests: 0,
          // TODO this will not be right if redirected
          httpVersion: har.log.entries[0].response.httpVersion
        };
        testedPages[entry.pageref] = myPage;
        pages.push(myPage);
      }
      let asset = collectAsset(entry);
      assets.push(asset);
      collectDomainInfo(asset, domains);
      collectResponseCode(asset, responseCodes);
      collectContentType(asset, myPage);

      myPage.transferSize += entry.response.bodySize;
      myPage.contentSize += entry.response.content.size;
      myPage.headerSize += entry.response.headersSize;

      myPage.requests++;
      myPage.domains = domains;
      myPage.responseCodes = responseCodes;
      if (config.includeAssets) {
        myPage.assets = assets;
      }

    });

    return pages;
  }
};
