'use strict';

module.exports = {

  /**
   * Flatten HAR file headers. Har files has the header of the
   * type name/values lets use as simple JSON as possible + make
   * the key lower case to make them easier to find
   * @param {Object} headers All the headers for an asset.
   * @returns {Object} flatten headers.
   */
  flatten: (headers) => {
    return headers.reduce((result, header) => {
      result[header.name.toLowerCase()] = header.value;
      return result;
    }, {});
  },
  /**
   * Get the expires time (in seconds) from the response headers.
   * Do we have an expire date for this asset? Lets hope we do.
   * first check if we have a maxAge header, then use that
   * else do we have an expires header?
   * @param {Object} responseHeaders The headers.
   * @returns {int} the expire time in seconds.
   */
  getExpires: (responseHeaders) => {
    let maxAgeRegExp = /max-age=(\d+)/,
      expireTime = 0;

    if (responseHeaders['cache-control']) {
      if (responseHeaders['cache-control'].indexOf('no-cache') !== -1 ||
        responseHeaders['cache-control'].indexOf('no-store') !== -1) {
        return 0;
      } else {
        let matches = responseHeaders['cache-control'].match(maxAgeRegExp);
        if (matches) {
          return parseInt(matches[1], 10);
        }
      }
    } else if (responseHeaders.expires) {
      let expiresDate = new Date(responseHeaders.expires);
      let now = new Date().getTime();
      expireTime = expiresDate.getTime() - now;
    }
    return expireTime;
  },
  /**
   * Get the time since the asset was last modified in seconds.
   * If we don't find a value, we return 0.
   * @param {Object} headers The headers.
   * @returns {int} the time since the asset was last modified in seconds.
   */
  getTimeSinceLastModified: (headers) =>{
    let now = new Date();
    let lastModifiedDate;
    if (headers['last-modified']) {
      lastModifiedDate = new Date(headers['last-modified']);
    } else if (headers.date) {
      now = new Date(headers.date);
    }

    if (!lastModifiedDate) {
      return;
    }

    return (now.getTime() - lastModifiedDate.getTime()) / 1000;
  }
};
