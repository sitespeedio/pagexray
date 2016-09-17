'use strict';

const Stats = require('fast-stats').Stats;

function percentileName(percentile) {
  if (percentile === 0) {
    return 'min';
  } else if (percentile === 100) {
    return 'max';
  } else if (percentile === 50) {
    return 'median';
  }
  return `p${String(percentile).replace('.', '_')}`;
}

class Statistics {
  constructor() {
    this.stats = new Stats();
  }

  add(value) {
    this.stats.push(value);
    return this;
  }

  summarize(options) {
    options = options || {};
    const percentiles = options.percentiles || [0, 10, 50, 90, 99, 100];
    const decimals = options.decimals || 0;
    const data = {};
    const self = this;

    percentiles.forEach(p => {
      const name = percentileName(p);
      data[name] = Number(self.stats.percentile(p).toFixed(decimals));
    });

    return data;
  }
}

module.exports = {
  Statistics,
};
