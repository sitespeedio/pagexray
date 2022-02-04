'use strict';

const urlParser = require('url');

// Priorities list of matchers
const MIME_TYPE_MATCHERS = [
  [/^text\/html/, 'html'],
  [/^text\/plain/, 'plain'],
  [/^text\/css/, 'css'],
  [/^text\/xml/, 'xml'],
  [/javascript/, 'javascript'],
  [/flash/, 'flash'],
  [/^image\/x-icon/, 'favicon'],
  [/^image\/vnd.microsoft.icon/, 'favicon'],
  [/svg/, 'svg'],
  [/^image/, 'image'],
  [/^application\/.*font/, 'font'],
  [/^font\/.*/, 'font'],
  [/^application\/json/, 'json'],
  [/^application\/xml/, 'xml'],
  [/^application\/pdf/, 'pdf'],
  [/^audio\/.*/, 'audio'],
  [/^video\/.*/, 'video'],
  [/^application\/ocsp-response/, 'oscp'],
  [/.*/, 'other'] // Always match 'other' if all else fails
];

const FILE_ENDINGS_MATCHERS = [
  [/\.woff$/, 'font'],
  [/\.woff2$/, 'font'],
  [/\.eot$/, 'font'],
  [/\.ttf$/, 'font'],
  [/.*/, 'other'] // Always
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
  getContentType: (mimeType, url) => {
    let type = MIME_TYPE_MATCHERS.find(matcher => matcher[0].test(mimeType))[1];
    // Hack for woff that has mimetype application/octet-stream and others
    if (type === 'other') {
      return FILE_ENDINGS_MATCHERS.find(matcher => matcher[0].test(url))[1];
    } else {
      return type;
    }
  },
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
    } else if (version.startsWith('h3')) {
      return 'h3';
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
   * Get the main domain from a hostname
   * www.sitespeed.io -> sitespeed
   * www.sitespeed.co.uk ->  sitespeed
   */
  getMainDomain: hostname => {
    let domain = hostname;

    if (hostname != null) {
      const parts = hostname.split('.').reverse();
      if (parts != null && parts.length > 1) {
        domain = parts[1] + '.' + parts[0];
        if (
          hostname.toLowerCase().indexOf('.co.uk') != -1 &&
          parts.length > 2
        ) {
          domain = parts[2] + '.' + domain;
        }
      }
    }
    return domain.split('.')[0];
  },
  /**
   * Get when the page is fully loaded
   * @param {Object} pageId
   * @param entries
   * @param {Object} pageStartDateTime
   */
  getFullyLoaded: (pageId, entries, pageStartDateTime) => {
    let pageEntries = Array.from(entries);
    pageEntries = Array.from(
      pageEntries.filter(entry => entry.pageref === pageId)
    );

    let pageEnd = 0;
    for (let entry of pageEntries) {
      let entryEnd =
        new Date(entry.startedDateTime).getTime() +
        entry.time -
        new Date(pageStartDateTime).getTime();
      if (entryEnd > pageEnd) {
        pageEnd = entryEnd;
      }
    }
    return pageEnd;
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
