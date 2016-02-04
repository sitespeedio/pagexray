'use strict';

let Stats = require('fast-stats').Stats;

function percentileName(percentile) {
  if (percentile === 0) {
    return 'min';
  } else if (percentile === 100) {
    return 'max';
  } else {
    return 'p' + String(percentile).replace('.', '_');
  }
}

class Statistics {
  constructor(name) {
    this.name = name;
    this.stats = new Stats();
  }

  add(value) {
    this.stats.push(value);
  }

  summarize(options) {
    options = options || {};
    let percentiles = options.percentiles || [0, 10, 90, 99, 100];
    let decimals = options.decimals || 0;
    let data = {};
    let self = this;

    percentiles.forEach(function(p) {
      let name = percentileName(p);
      data[name] = self.stats.percentile(p).toFixed(decimals);
    });

    return data;
  }
}

module.exports = {
  Statistics: Statistics
};
