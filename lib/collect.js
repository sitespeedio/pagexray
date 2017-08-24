'use strict';

const util = require('./util');
const headers = require('./headers');

function getTiming(entry, field) {
  return entry.timings[field] === -1
    ? 0
    : Number(entry.timings[field].toFixed(0));
}

function newContentData() {
  return {
    transferSize: 0,
    contentSize: 0,
    headerSize: 0,
    requests: 0,
    timings: {
      blocked: 0,
      dns: 0,
      connect: 0,
      send: 0,
      wait: 0,
      receive: 0
    }
  };
}

/*
 * Collect information about a response (asset).
 * @private
 * @param {Object} entry The HAR entry.
 * @returns {Object} A simplified asset.
 */
module.exports = {
  asset: entry => {
    const response = entry.response;
    const request = entry.request;

    const contentType = util.getContentType(response.content.mimeType);
    const requestHeaders = headers.flatten(request.headers);
    const responseHeaders = headers.flatten(response.headers);

    const timings = {
      blocked: getTiming(entry, 'blocked'),
      dns: getTiming(entry, 'dns'),
      connect: getTiming(entry, 'connect'),
      send: getTiming(entry, 'send'),
      wait: getTiming(entry, 'wait'),
      receive: getTiming(entry, 'receive')
    };

    return {
      type: contentType,
      url: request.url,
      transferSize: response.bodySize,
      contentSize:
        response.content.size < 0 ? response.bodySize : response.content.size,
      headerSize: response.headersSize,
      expires: headers.getExpires(responseHeaders),
      status: response.status,
      timeSinceLastModified: headers.getTimeSinceLastModified(responseHeaders),
      httpVersion: util.getHTTPVersion(response.httpVersion),
      headers: {
        request: requestHeaders,
        response: responseHeaders
      },
      timings,
      cookies: request.cookies.length
    };
  },

  /*
   * Collect information about the domain for the asset.
   * @param {Object} asset The asset.
   * @param {Object} domains The holder for the domain info.
   * @param {Object} the configuration object.
   * @returns {void}
   * @private
   */
  domainInfo: (asset, domains) => {
    const domain = util.getHostname(asset.url);
    const contentData = domains[domain] || newContentData();

    contentData.transferSize += asset.transferSize;
    contentData.contentSize += asset.contentSize;
    contentData.headerSize += asset.headerSize;
    contentData.requests += 1;

    contentData.timings.blocked += asset.timings.blocked;
    contentData.timings.dns += asset.timings.dns;
    contentData.timings.connect += asset.timings.connect;
    contentData.timings.send += asset.timings.send;
    contentData.timings.wait += asset.timings.wait;
    contentData.timings.receive += asset.timings.receive;

    domains[domain] = contentData;
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

    const couldBeCompressed = [
      'html',
      'plain',
      'json',
      'javascript',
      'css',
      'svg'
    ].includes(asset.type);
    const isCompressed = ['gzip', 'br', 'deflate'].includes(encoding);
    const isLargeFile = asset.contentSize > 2000;

    if (couldBeCompressed && isLargeFile && !isCompressed) {
      myPage.missingCompression += 1;
    }
  },
  /**
   * A set of default content type data that should always be included in reports
   */
  defaultContentTypes() {
    return {
      html: newContentData(),
      css: newContentData(),
      javascript: newContentData(),
      image: newContentData(),
      font: newContentData()
    };
  },
  /*
   * Collect content type from an asset.
   * @param {Object} asset The asset.
   * @param {Object} contentTypes The holder for content types.
   * @returns {void}
   * @private
   */
  contentType: (asset, contentTypes) => {
    if (!/^2\d{2}/.test(asset.status)) {
      return;
    }

    // TODO how to handle unknown?

    const contentData = contentTypes[asset.type] || newContentData();

    contentData.requests += 1;
    // header vs content size?
    // Firefox sometimes has asset size -1 in HAR files
    contentData.transferSize += Math.max(asset.transferSize, 0);
    contentData.contentSize += Math.max(asset.contentSize, 0);
    contentData.headerSize += Math.max(asset.headerSize, 0);

    contentTypes[asset.type] = contentData;
  }
};
