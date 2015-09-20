/**
 * @fileoverview Main HARToPAge object.
 * @author Peter Hedenskog
 * @copyright (c) 2015, Peter Hedenskog, Tobias Lidskog.
 * Released under the Apache 2.0 License.
 */

'use strict';

// TODO:
// handling multiple har:s in one file
// return a clean setup
// get the httpVersion of the main page
// add timings?
// domains
// assets per domain
// weight per domain

var util = require('./util');

var assets = [];
var responseCodes = {};
var domains = {};
var pages = [];
var myPage = {};

/**
 * Collect information about a response (asset).
 * @param {Object} entry The HAR entry.
 * @returns {Object} A simplified asset.
 * @private
 */
function collectAsset(entry) {
  var contentType = util.getContentType(entry.response.content.mimeType);
  var requestHeaders = util.flattenHeaders(entry.request.headers);
  var responseHeaders = util.flattenHeaders(entry.response.headers);
  return {
    type: contentType,
    url: entry.request.url,
    size: entry.response.headersSize + entry.response.bodySize,
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

/**
 * Collect information about the domain for the asset.
 * @param {Object} asset The asset.
 * @returns {void}
 * @private
 */
function collectDomainInfo(asset) {
  var domain = util.getHostname(asset.url);
  if (domains[domain]) {
    domains[domain].size += asset.size;
    domains[domain].requests += 1;
  } else {
    domains[domain] = {
      requests: 1,
      size: asset.size
    };
  }
}

/**
 * Collect the response code from a asset.
 * @param {Object} asset The asset.
 * @returns {void}
 * @private
 */
function collectResponseCode(asset) {
  if (responseCodes[asset.status]) {
    responseCodes[asset.status]++;
  } else {
    responseCodes[asset.status] = 1;
  }
}

/**
 * Collect content type from an asset.
 * @param {Object} asset The asset.
 * @returns {void}
 * @private
 */
function collectContentType(asset) {
  if (asset.status === 200) {

    // TODO how to handle unknown?
    if (myPage[asset.type]) {
      myPage[asset.type].requests++;
      // header vs content size?
      myPage[asset.type].size += asset.size;
    } else {
      myPage[asset.type] = {
        size: asset.size,
        requests: 1
      };
    }
  }
}

module.exports = {

  /**
   * Convert a HAR file object to a Page.
   * @param {Object} har The har to process.
   * @returns {Object} The converted page object.
   */

  convert: function(har) {
    var testedPages = {};
    har.log.entries.forEach(function(entry) {
      if (!testedPages[entry.pageref]) {
        myPage = {
          url: har.log.entries[0].request.url,
          // TODO handle redirects
          baseDomain: util.getHostname(util.getFinalURL(entry, har)),
          size: 0,
          requests: 0
        };
        testedPages[entry.pageref] = myPage;
        pages.push(myPage);
      }
      var asset = collectAsset(entry);
      assets.push(asset);
      collectDomainInfo(asset);
      collectResponseCode(asset);
      collectContentType(asset);

      if (entry.response.status === 200) {
        myPage.size += entry.response.content.size;
      }
      myPage.requests++;
      myPage.domains = domains;
      myPage.responseCodes = responseCodes;
      myPage.assets = assets;

    });

    return pages;
  }
};
