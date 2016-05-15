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
  domainInfo: function(asset, domains, config) {
    let domain = util.getHostname(asset.url);
    if (domains.single[domain]) {
      domains.single[domain].transferSize += asset.transferSize;
      domains.single[domain].contentSize += asset.contentSize;
      domains.single[domain].headerSize += asset.headerSize;
      domains.single[domain].requests += 1;
    } else {
      domains.single[domain] = {
        requests: 1,
        transferSize: asset.transferSize,
        contentSize: asset.contentSize,
        headerSize: asset.headerSize
      };
    }

    // add first/third party info
    if (config.firstParty) {
      // is it a third party asset?
      if (asset.url.match(config.firstParty) === null) {
        domains.summary.thirdParty.requests = domains.summary.thirdParty.requests + 1 || 1;
        domains.summary.thirdParty.transferSize = domains.summary.thirdParty.transferSize + asset.transferSize || asset.transferSize;
        domains.summary.thirdParty.contentSize= domains.summary.thirdParty.contentSize + asset.contentSize|| asset.contentSize;
        domains.summary.thirdParty.headerSize = domains.summary.thirdParty.headerSize + asset.headerSize || asset.headerSize;
      }
      else {
        domains.summary.firstParty.requests = domains.summary.firstParty.requests + 1 || 1;
        domains.summary.firstParty.transferSize = domains.summary.firstParty.transferSize + asset.transferSize || asset.transferSize;
        domains.summary.firstParty.contentSize= domains.summary.firstParty.contentSize + asset.contentSize|| asset.contentSize;
        domains.summary.firstParty.headerSize = domains.summary.firstParty.headerSize + asset.headerSize || asset.headerSize;
      }
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
