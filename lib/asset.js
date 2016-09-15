'use strict';

const getContentType = require('./contentTypes').getContentType;
const isEmpty = require('lodash.isempty');
const pick = require('lodash.pick');
const reduce = require('lodash.reduce');

/**
 * Flatten HAR file headers. Har files has the header of the
 * type name/values lets use as simple JSON as possible + make
 * the key lower case to make them easier to find
 * @param {Object} headers All the headers for an asset.
 * @returns {Object} flatten headers.
 */
function flattenHeaders(headers) {
  return headers.reduce((result, header) => {
    result[header.name.toLowerCase()] = header.value;
    return result;
  }, {});
}

function secondsSince(dateString, nowString) {
  let now = Date.now();
  if (nowString) {
    now = Date.parse(nowString);
  }
  return (now - Date.parse(dateString)) / 1000;
}

function getExpires(responseHeaders) {
  const cacheControl = responseHeaders['cache-control'];
  if (cacheControl) {
    if (cacheControl.includes('no-cache') || cacheControl.includes('no-store')) {
      return 0;
    }

    const matches = cacheControl.match(/max-age=(\d+)/);
    if (matches) {
      return parseInt(matches[1], 10);
    }
  } else if (responseHeaders.expires) {
    return secondsSince(responseHeaders.expires, responseHeaders.date);
  }
  return 0;
}

/**
 * Get the time since the asset was last modified in seconds.
 * If we don't find a value, we return undefined.
 * @param {Object} headers The headers.
 * @returns {int|undefined} the time since the asset was last modified in seconds.
 */
function getTimeSinceLastModified(headers) {
  if (headers['last-modified']) {
    return secondsSince(headers['last-modified'], headers.date);
  }
  return undefined;
}

function getHTTPVersion(version) {
  if (version === 'h2' || version === 'HTTP/2.0') {
    return 'HTTP/2.0';
  } else if (version.indexOf('spdy') > -1) {
    return version.toUpperCase();
  }
  return version.toUpperCase();
}

function getConnectionType(version) {
  if (version === 'h2' || version === 'HTTP/2.0') {
    return 'h2';
  } else if (version.indexOf('spdy') > -1) {
    return 'spdy';
  }
  return 'h1';
}

function isMissingCompression(asset) {
  const COMPRESSABLE_TYPES = ['html', 'plain', 'json', 'javascript', 'css', 'svg'];

  if (COMPRESSABLE_TYPES.indexOf(asset.type) >= 0) {
    return false;
  }

  if (asset.contentSize < 2000) {
    // Don't care for small enough files
    return false;
  }

  const COMPRESSION_ENCODINGS = ['giz', 'br', 'deflate'];

  return COMPRESSION_ENCODINGS.indexOf(asset.headers.response['content-encoding']) >= 0;
}

class Asset {
  static fromHarEntries(entries, config) {
    return entries.reduce((result, entry) => {
      result.push(this.fromHarEntry(entry, config));
      return result;
    }, []);
  }

  static fromHarEntry(entry) {
    const response = entry.response;
    const request = entry.request;

    const requestHeaders = flattenHeaders(request.headers);
    const responseHeaders = flattenHeaders(response.headers);

    const timings = pick(entry.timings, ['blocked', 'dns', 'connect', 'send', 'wait', 'receive']);

    const totalTime = reduce(timings, (total, value) => {
      if (value > 0) {
        total += value;
      }
      return total;
    }, 0);

    const asset = {
      /*
       contentSize: entry.response.content.size < 0 ? entry.response.bodySize :
       entry.response.content.size,
       */

      url: request.url,
      type: getContentType(response.content.mimeType),
      timing: totalTime,
      contentSize: response.content.size < 0 ? response.bodySize : response.content.size,
      transferSize: response.bodySize,
      headerSize: response.headersSize,
      expires: getExpires(responseHeaders),
      status: response.status,
      httpType: getConnectionType(response.httpVersion),
      httpVersion: getHTTPVersion(response.httpVersion),
      headers: {
        request: requestHeaders,
        response: responseHeaders,
      },
      cookies: request.cookies.length,
    };

    if (isMissingCompression(asset)) {
      asset.missingCompression = true;
    }

    const timeSinceLastModified = getTimeSinceLastModified(responseHeaders);
    if (timeSinceLastModified) {
      asset.timeSinceLastModified = timeSinceLastModified;
    }

    const redirectUrl = response.redirectURL;
    if (!isEmpty(redirectUrl)) {
      asset.redirectUrl = redirectUrl;
    }

    return asset;
  }
}

module.exports = Asset;
