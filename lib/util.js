/**
 * @fileoverview Utilities for getting content from HAR:s.
 * @author Peter Hedenskog
 * @copyright (c) 2015, Peter Hedenskog, Tobias Lidskog.
 * Released under the Apache 2.0 License.
 */

'use strict';

module.exports = {

  /**
   * Get the content type from mime type.
   * @param {string} mimeType The mimeType
   * @returns {string} the content type or 'unknown'.
   */
  getContentType: function(mimeType) {
    if (mimeType) {
      if (/html/.test(mimeType) || /plain/.test(mimeType)) {
        return 'doc';
      } else if (mimeType.indexOf('text/css') > -1) {
        return 'css';
      } else if (/javascript/.test(mimeType)) {
        return 'js';
      } else if (/flash/.test(mimeType)) {
        return 'flash';
      } else if (/image/.test(mimeType)) {
        return 'image';
      } else if (/font/.test(mimeType)) {
        return 'font';
      } else if (mimeType.indexOf('application/json') > -1) {
        return 'json';
      } else if (mimeType === 'application/ocsp-response') {
        return 'ocsp';
      }
    }
    return 'unknown';
  },

  /**
   * Flatten HAR file headers. Har files has the header of the
   * type name/values lets use as simple JSON as possible + make
   * the key lower case to make them easier to find
   * @param {Object} headers All the headers for an asset.
   * @returns {Object} flatten headers.
   */
  flattenHeaders: function(headers) {
    var flattenHeader = {};
    headers.forEach(function(header) {
      flattenHeader[header.name.toLowerCase()] = header.value;
    });

    return flattenHeader;
  },

  /**
   * Get the hostname from a URL string.
   * @param {string} url The URL like https://www.example.com/hepp
   * @returns {string} the hostname
   */
  getHostname: function(url) {
    if (url) {
      var hostname = url.split('/')[2];
      return (hostname && hostname.split(':')[0]) || '';
    } else {
      return '';
    }
  },

  /**
   * Get the expires time (in seconds) from the respose headers.
   * Do we have an expire date for this asset? Lets hope we do.
   * first check if we have a maxAge header, then use that
   * else do we have an expires header?
   * @param {Object} responseHeaders The headers.
   * @returns {int} the expire time in seconds.
   */
  getExpires: function(responseHeaders) {
    var maxAgeRegExp = /max-age=(\d+)/,
      expireTime = 0;

    if (responseHeaders['cache-control']) {
      if (responseHeaders['cache-control'].indexOf('no-cache') !== -1 ||
        responseHeaders['cache-control'].indexOf('no-store') !== -1) {
        return 0;
      } else {
        var matches = responseHeaders['cache-control'].match(maxAgeRegExp);
        if (matches) {
          return parseInt(matches[1], 10);
        }
      }
    } else if (responseHeaders.expires) {
      var expiresDate = new Date(responseHeaders.expires);
      var now = new Date().getTime();
      expireTime = expiresDate.getTime() - now;
    }
    return expireTime;
  },

  /**
   * Get the final URL for a HAR file. Lets start with the tested URL
   * and check if it is redirected, and then report the last URL
   * @param {Object} harEntry The har entry that is the first occurance.
   * @param {Object} har The har.
   * @returns {string} the last url in the redirect chain.
   */
  getFinalURL: function(harEntry, har) {
    var url = harEntry.request.url;
    var redirections = har.log.entries.reduce(function(results, entry) {
      results[entry.request.url] = entry.response.redirectURL || '';
      return results;
    }, {});

    var nextUrl = redirections[url];

    if (nextUrl === null) {
      return null;
    }

    while (nextUrl !== '') {
      url = nextUrl;
      nextUrl = redirections[url];
    }

    return url;
  },
  /**
   * Get the time since the asset was last modified in seconds.
   * If we don't find a value, we return -1.
   * @param {Object} headers The headers.
   * @returns {int} the time since the asset was last modified in seconds.
   */
  getTimeSinceLastModified: function(headers) {
    var now = new Date();
    var lastModifiedDate;
    if (headers['last-modified']) {
      lastModifiedDate = new Date(headers['last-modified']);
    } else if (headers.date) {
      now = new Date(headers.date);
    }

    // TODO how do we define if we don't have a timing
    // is it better to just return 0?
    if (!lastModifiedDate) {
      return -1;
    }

    return (now.getTime() - lastModifiedDate.getTime()) / 1000;
  }
};
