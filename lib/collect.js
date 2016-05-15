'use strict';

let util = require('./util'),
  headers= require('./headers');

/*
 * Collect information about a response (asset).
 * @private
 * @param {Object} entry The HAR entry.
 * @returns {Object} A simplified asset.
 */
module.exports = {

  asset: function(entry) {
    let contentType = util.getContentType(entry.response.content.mimeType);
    let requestHeaders = headers.flatten(entry.request.headers);
    let responseHeaders = headers.flatten(entry.response.headers);
    return {
      type: contentType,
      url: entry.request.url,
      transferSize: entry.response.bodySize,
      contentSize: entry.response.content.size < 0 ? entry.response.bodySize : entry.response.content.size,
      headerSize: entry.response.headersSize,
      expires: headers.getExpires(responseHeaders),
      status: entry.response.status,
      timeSinceLastModified: headers.getTimeSinceLastModified(responseHeaders),
      httpVersion: util.getHTTPVersion(entry.response.httpVersion),
      headers: {
        request: requestHeaders,
        response: responseHeaders
      }
    };
  },

  /*
   * Collect information about the domain for the asset.
   * @param {Object} asset The asset.
   * @param {Object} domains The placeholder for the domain info.
   * @param {Object} the configuration object.
   * @returns {void}
   * @private
   */
  domainInfo: function(asset, domains) {
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
  },

  /*
   * Collect the response code from a asset.
   * @param {Object} asset The asset.
   * @param {Object} responseCodes Where we keep all the response codes.
   * @returns {void}
   * @private
   */
  responseCode: function(asset, responseCodes) {
    if (responseCodes[asset.status]) {
      responseCodes[asset.status]++;
    } else {
      responseCodes[asset.status] = 1;
    }
  },

  /*
   * Collect content type from an asset.
   * @param {Object} asset The asset.
   * @param {Object} myPage The placeholder for content types.
   * @returns {void}
   * @private
   */
  contentType: function(asset, myPage) {
    if (asset.status === 200) {

      // TODO how to handle unknown?
      if (myPage.contentTypes[asset.type]) {
        myPage.contentTypes[asset.type].requests++;
        // header vs content size?
        myPage.contentTypes[asset.type].transferSize += asset.transferSize;
        myPage.contentTypes[asset.type].contentSize += asset.contentSize;
        myPage.contentTypes[asset.type].headerSize += asset.headerSize;
      } else {
        myPage.contentTypes[asset.type] = {
          transferSize: asset.transferSize,
          contentSize: asset.contentSize,
          headerSize: asset.headerSize,
          requests: 1
        };
      }
    }
  }
}
