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
    }
    return version.toUpperCase();
  },
  getConnectionType: version => {
    if (version === 'h2' || version === 'HTTP/2.0') {
      return 'h2';
    } else if (version.indexOf('spdy') > -1) {
      return 'spdy';
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
   * Get the final URL for a HAR file. Lets start with the tested URL
   * and check if it is redirected, and then report the last URL
   * @param {string} url The url to check.
   * @param {Object} har The har.
   * @param {Object} pageId
   * @returns {Object} final url and redirect chain.
   * @throws if har doesn't have exactly one page
   */
  getRedirectTarget: (url, har, pageId) => {
    const chain = [];
    const redirections = har.log.entries
      .filter(entry => {
        return pageId !== undefined ? entry.pageref === pageId : true;
      })
      .reduce((results, entry) => {
        let destination = entry.response.redirectURL;
        if (destination) {
          if (destination.startsWith('/')) {
            destination = urlParser.resolve(entry.request.url, destination);
          }
          results[entry.request.url] = destination;
        }
        return results;
      }, {});
    let nextUrl = redirections[url];
    // Fixes https://github.com/sitespeedio/pagexray/issues/50
    // for now
    redirections[url] = undefined;
    while (nextUrl) {
      chain.push(nextUrl);
      nextUrl = redirections[nextUrl];
      // Right now we aren't the best in the world to handle redirects back
      // and forth to the same page but it's kind of an edge case with redirects
      // like:
      // hepp --> hopp --> hepp --> happ --> hepp --> hipp
      // https://github.com/sitespeedio/pagexray/issues/50
      redirections[url] = undefined;
    }
    const finalUrl = chain.length > 0 ? chain[chain.length - 1] : url;
    return {
      finalUrl,
      chain
    };
  },
  getEntryByURL(entries, url, pageId) {
    // Chrome and Chrome-HAR strips everything after #
    // Firefox keeps it
    const myEntry = entries.find(
      entry => entry.request.url === url && entry.pageref === pageId
    );
    // Try without #
    if (!myEntry) {
      const withoutHash = url.split('#')[0];
      return entries.find(
        entry => entry.request.url === withoutHash && entry.pageref === pageId
      );
    } else {
      return myEntry;
    }
  }
};
