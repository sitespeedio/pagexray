'use strict';

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
  [/^application\/json/, 'json'],
  [/^application\/ocsp-response/, 'oscp'],
  [/.*/, 'other'], // Always match 'other' if all else fails
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
  getContentType: mimeType => {
    const type = MIME_TYPE_MATCHERS.find((matcher) => matcher[0].test(mimeType))[1];
    return type;
  },

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
    if (url) {
      const hostname = url.split('/')[2];
      return (hostname && hostname.split(':')[0]) || '';
    }
    return '';
  },
  /**
   * Get the final URL for a HAR file. Lets start with the tested URL
   * and check if it is redirected, and then report the last URL
   * @param {Object} harEntry The har entry that is the first occurrence.
   * @param {Object} har The har.
   * @returns {string} the last url in the redirect chain.
   */
  getFinalURL: (harEntry, har) => {
    let url = harEntry.request.url;
    let chain = [url];
    const redirections = har.log.entries.reduce((results, entry) => {
      results[entry.request.url] = entry.response.redirectURL || '';
      return results;
    }, {});

    let nextUrl = redirections[url];

    while (nextUrl && nextUrl !== '') {
      url = nextUrl;
      nextUrl = redirections[url];
      chain.push(nextUrl);
    }
    // we don't have a redirect
    if (chain.length === 1) {
      chain = [];
    }
    return {
      url,
      chain,
    };
  },
  getMatchingPage(har, pageId) {
    for (const page of har.log.pages) {
      if (pageId === page.id) {
        return page;
      }
    }
    return undefined;
  },
};
