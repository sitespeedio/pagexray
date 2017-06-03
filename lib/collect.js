'use strict';

const util = require('./util');
const headers = require('./headers');
const isEmpty = require('lodash.isempty');

function getTiming(entry, field) {
  return entry.timings[field] === -1 ? 0 : entry.timings[field];
}

/*
 * Collect information about a response (asset).
 * @private
 * @param {Object} entry The HAR entry.
 * @returns {Object} A simplified asset.
 */
module.exports = {

  asset: (entry) => {
    const response = entry.response;
    const request = entry.request;

    const contentType = util.getContentType(response.content.mimeType);
    const requestHeaders = headers.flatten(request.headers);
    const responseHeaders = headers.flatten(response.headers);

    const timing = getTiming(entry, 'blocked') + getTiming(entry, 'dns') +
      getTiming(entry, 'connect') +
      getTiming(entry, 'send') + getTiming(entry, 'wait') +
      getTiming(entry, 'receive');

    return {
      type: contentType,
      url: request.url,
      transferSize: response.bodySize,
      contentSize: response.content.size < 0 ? response.bodySize : response.content.size,
      headerSize: response.headersSize,
      expires: headers.getExpires(responseHeaders),
      status: response.status,
      timeSinceLastModified: headers.getTimeSinceLastModified(responseHeaders),
      httpVersion: util.getHTTPVersion(response.httpVersion),
      headers: {
        request: requestHeaders,
        response: responseHeaders,
      },
      timing,
      cookies: request.cookies.length,
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
  domainInfo: (asset, domains) => {
    const domain = util.getHostname(asset.url);
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
        headerSize: asset.headerSize,
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
  responseCode: (asset, responseCodes) => {
    const count = responseCodes[asset.status] || 0;

    responseCodes[asset.status] = count + 1;
  },
  /**
   * Check if the asset should be compressed but isn't.
   */
  missingCompression: (asset, myPage) => {
    const encoding = asset.headers.response['content-encoding'];

    const couldBeCompressed = ['html', 'plain', 'json', 'javascript', 'css', 'svg'].includes(asset.type);
    const isCompressed = ['gzip', 'br', 'deflate'].includes(encoding);
    const isLargeFile = asset.contentSize > 2000;

    if (couldBeCompressed && isLargeFile && !isCompressed) {
      myPage.missingCompression += 1;
    }
  },
  /*
   * Collect content type from an asset.
   * @param {Object} asset The asset.
   * @param {Object} myPage The placeholder for content types.
   * @returns {void}
   * @private
   */
  contentType: (asset, myPage) => {
    if (isEmpty(myPage.contentTypes)) {
      // we have a couple of default content types that we always reports
      // if we find others, just add them
      myPage.contentTypes = {
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
      };
    }
    if (asset.status === 200) {
      // TODO how to handle unknown?
      if (myPage.contentTypes[asset.type]) {
        myPage.contentTypes[asset.type].requests += 1;
        // header vs content size?
        // Firefox sometimes has asset size -1 in HAR files
        myPage.contentTypes[asset.type].transferSize += asset.transferSize > 0 ?
          asset.transferSize : 0;
        myPage.contentTypes[asset.type].contentSize += asset.contentSize > 0 ?
          asset.contentSize : 0;
        myPage.contentTypes[asset.type].headerSize += asset.headerSize > 0 ?
          asset.headerSize : 0;
      } else {
        myPage.contentTypes[asset.type] = {
          transferSize: asset.transferSize > 0 ? asset.transferSize : 0,
          contentSize: asset.contentSize > 0 ? asset.contentSize : 0,
          headerSize: asset.headerSize > 0 ? asset.headerSize : 0,
          requests: 1,
        };
      }
    }
  },
};
