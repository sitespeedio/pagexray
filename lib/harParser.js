'use strict';

const groupBy = require('lodash.groupby');
const pick = require('lodash.pick');
const merge = require('lodash.merge');
const reduce = require('lodash.reduce');

module.exports = {
  /**
   * Split har multiple one page hars.
   * @param har
   */
  split: (har) => {
    const sharedData = pick(har.log, ['version', 'creator', 'browser', 'comment']);
    const pagesById = groupBy(har.log.pages, 'id');
    const entriesByPageId = groupBy(har.log.entries, 'pageref');

    return reduce(pagesById, (hars, page, pageId) => {
      const entries = entriesByPageId[pageId];

      const subHar = {
        log: {
          pages: [page],
          entries,
        },
      };

      merge(subHar.log, sharedData);

      hars.push(subHar);

      return hars;
    }, []);
  },
};
