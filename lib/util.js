'use strict';

const urlParser = require('url');

// Priorities list of matchers
const MIME_TYPE_MATCHERS = [
  [/^text\/html/, 'html'],
  [/^text\/plain/, 'plain'],
  [/^text\/css/, 'css'],
  [/javascript/, 'javascript'],
  [/flash/, 'flash'],
  [/^image\/x-icon/, 'favicon'],
  [/^image\/vnd.microsoft.icon/, 'favicon'],
  [/svg/, 'svg'],
  [/^image/, 'image'],
  [/^application\/.*font/, 'font'],
  [/^font\/.*/, 'font'],
  [/^application\/json/, 'json'],
  [/^application\/ocsp-response/, 'oscp'],
  [/.*/, 'other'] // Always match 'other' if all else fails
];

/**
 * Utilities for getting content from HAR:s.
 * @module util
 */
module.exports = {
  /**
   * Get the content type from mime type.
   * @param {string} mimeType The mimeType
   * @returns {string} the content type or 'other'.
   */
  getContentType: mimeType =>
    MIME_TYPE_MATCHERS.find(matcher => matcher[0].test(mimeType))[1],

  getHTTPVersion: version => {
    if (version === 'h2' || version === 'HTTP/2.0') {
      return 'HTTP/2.0';
    } else if (version.indexOf('spdy') > -1) {
      return version.toUpperCase();
    } else if (version === '') {
      return 'Unknown';
    }
    return version.toUpperCase();
  },
  getConnectionType: version => {
    if (version === 'h2' || version === 'HTTP/2.0') {
      return 'h2';
    } else if (version.indexOf('spdy') > -1) {
      return 'spdy';
    } else if (version === '') {
      return 'Unknown';
    }
    return 'h1';
  },
  /**
   * Get the hostname from a URL string.
   * @param {string} url The URL like https://www.example.com/hepp
   * @returns {string} the hostname
   */
  getHostname: url => {
    if (!url) {
      return '';
    }

    return urlParser.parse(url).hostname || '';
  },
  /**
   * Get main document requests (including redirects) for a HAR file.
   * @param entries
   * @param {Object} pageId
   * @returns {Object} redirect chain.
   */
  getDocumentRequests: (entries, pageId) => {
    let pageEntries = Array.from(entries);
    if (pageId) {
      pageEntries = Array.from(
        entries.filter(entry => entry.pageref === pageId)
      );
    }

    const requests = [];
    let entry;

    do {
      entry = pageEntries.shift();
      requests.push(entry);
    } while (entry.response.redirectURL);

    return requests;
  }
};
