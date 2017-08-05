'use strict';

class Statistics {
  constructor() {
    this.values = [];
    this.total = 0;
  }

  add(value) {
    this.values.push(value);
    this.total += value;
    return this;
  }

  summarize() {
    const values = this.values;
    // keeping backward compatibility
    if (values.length === 0) {
      return undefined;
    }

    values.sort((a, b) => a - b);

    const middle = Math.floor(values.length / 2);
    const isEven = values.length % 2 === 0;
    let median;
    if (isEven) {
      median = Number(((values[middle] + values[middle - 1]) / 2).toFixed(0));
    } else {
      median = Number(values[middle].toFixed(0));
    }

    return {
      min: Number(values[0].toFixed(0)),
      median,
      max: Number(values[values.length - 1].toFixed(0)),
      total: Number(this.total.toFixed(0)),
      values: values.length
    };
  }
}
module.exports = {
  Statistics
};
