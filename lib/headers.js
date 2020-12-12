'use strict';

function parseHttpDate(dateString) {
  // dates should follow the formats specified in https://tools.ietf.org/html/rfc7231#section-7.1.1.1
  // This is not a complete test, but catches common exception such as '0', that would still pass Date.parse()
  if (!/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun).+/.test(dateString)) {
    return undefined;
  }

  const date = Date.parse(dateString);

  if (!isFinite(date)) {
    return undefined;
  }

  return date;
}

module.exports = {
  /**
   * Flatten HAR file headers. Har files has the header of the
   * type name/values lets use as simple JSON as possible + make
   * the key lower case to make them easier to find
   * @param {Object} headers All the headers for an asset.
   * @returns {Object} flatten headers.
   */
  flatten: headers => {
    const theHeaders = headers.reduce((result, header) => {
      if (!result[header.name.toLowerCase()]) {
        result[header.name.toLowerCase()] = [header.value];
      } else {
        result[header.name.toLowerCase()].push(header.value);
      }
      return result;
    }, {});
    return theHeaders;
  },
  /**
   * Get the expires time (in seconds) from the response headers.
   * Do we have an expire date for this asset? Lets hope we do.
   * first check if we have a maxAge header, then use that
   * else do we have an expires header?
   * @param {Object} responseHeaders The headers.
   * @returns {int} the expire time in seconds.
   */
  getExpires: responseHeaders => {
    const maxAgeRegExp = /max-age=(\d+)/;
    let expireSeconds = 0;

    if (responseHeaders['cache-control']) {
      if (
        responseHeaders['cache-control'][0].indexOf('no-cache') !== -1 ||
        responseHeaders['cache-control'][0].indexOf('no-store') !== -1
      ) {
        return 0;
      }
      const matches = responseHeaders['cache-control'][0].match(maxAgeRegExp);
      if (matches) {
        return parseInt(matches[1], 10);
      }
    } else if (responseHeaders.expires) {
      const expiresMillis = parseHttpDate(responseHeaders.expires[0]);

      if (isFinite(expiresMillis))
        expireSeconds = (expiresMillis - Date.now()) / 1000;
    }
    return expireSeconds;
  },
  /**
   * Get the time since the asset was last modified in seconds.
   * If we don't find a value, we return -1.
   * @param {Object} headers The headers.
   * @returns {int} the time since the asset was last modified in seconds.
   */
  getTimeSinceLastModified: headers => {
    if (headers['last-modified']) {
      const lastModifiedMillis = parseHttpDate(headers['last-modified'][0]);

      if (!isFinite(lastModifiedMillis)) {
        return -1;
      }
      if (headers.date) {
        let dateMillis = parseHttpDate(headers.date[0]);
        if (!isFinite(dateMillis)) {
          dateMillis = Date.now();
        }

        return (dateMillis - lastModifiedMillis) / 1000;
      } else {
        return (Date.now() - lastModifiedMillis) / 1000;
      }
    } else {
      return -1;
    }
  },
  getCookieNames: headers => {
    const cookies = headers.filter(h => h.name.match(/^set-cookie$/i));
    const cookieNames = cookies.map(h => {
      return h.value.split('=')[0];
    });
    return cookieNames;
  },
  getThirdPartyCookieNames: (headers, regex) => {
    const cookies = headers.filter(h => h.name.match(/^set-cookie$/i));
    const cookieNames = cookies
      .map(h => {
        const name = h.value.split('=')[0];
        const domain = h.value.split('Domain=')[1];
        if (domain) {
          const d = domain.split(';')[0];
          if (!d.match(regex)) {
            return { name, domain: d };
          }
        }
      })
      .filter(Boolean);
    return cookieNames;
  }
};
