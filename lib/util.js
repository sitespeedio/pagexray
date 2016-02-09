'use strict';

const MIME_TYPE_TO_CONTENT = {
    'html': 'doc',
    'plain': 'doc',
    'text\/css': 'css',
    'javascript': 'js',
    'flash': 'flash',
    'image\/x-icon': 'favicon',
    'image\/vnd.microsoft.icon': 'favicon',
    'image': 'image',
    'font': 'font',
    'application\/json/': 'json',
    'application\/ocsp-response': 'oscp'
  }
  /**
   * Utilities for getting content from HAR:s.
   * @module util
   */
module.exports = {

  /**
   * Get the content type from mime type.
   * @param {string} mimeType The mimeType
   * @returns {string} the content type or 'others'.
   */
  getContentType: function(mimeType) {

    let regs = Object.keys(MIME_TYPE_TO_CONTENT);
    for (let i = 0; i < regs.length; i++) {
      let regex = new RegExp(regs[i]);
      if (regex.test(mimeType)) {
        return MIME_TYPE_TO_CONTENT[regs[i]];
      }
    }
    return 'others';
  },

  getHTTPVersion: function(version) {
    if (version==='h2' || version === 'HTTP/2.0') {
      return 'HTTP/2.0';
    }
    else if (version.indexOf('spdy') > -1) {
      return version.toUpperCase();
    }
    else return version.toUpperCase();
  },
  /**
   * Get the hostname from a URL string.
   * @param {string} url The URL like https://www.example.com/hepp
   * @returns {string} the hostname
   */
  getHostname: function(url) {
    if (url) {
      let hostname = url.split('/')[2];
      return (hostname && hostname.split(':')[0]) || '';
    } else {
      return '';
    }
  },
  /**
   * Get the final URL for a HAR file. Lets start with the tested URL
   * and check if it is redirected, and then report the last URL
   * @param {Object} harEntry The har entry that is the first occurrence.
   * @param {Object} har The har.
   * @returns {string} the last url in the redirect chain.
   */
  getFinalURL: function(harEntry, har) {
    let redirects = 0;
    let url = harEntry.request.url;
    let redirections = har.log.entries.reduce(function(results, entry) {
      results[entry.request.url] = entry.response.redirectURL || '';
      return results;
    }, {});

    let nextUrl = redirections[url];

    if (nextUrl === null) {
      return null;
    }

    while (nextUrl !== '') {
      url = nextUrl;
      nextUrl = redirections[url];
      redirects++;
    }
    return {
      url, redirects
    };
  }
};
