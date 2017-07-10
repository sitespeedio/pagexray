'use strict';

class Statistics {
  constructor() {
    this.values = [];
  }

  add(value) {
    this.values.push(value);
    return this;
  }

  summarize() {
    const values = this.values;
    // keeping backward compability
    if (values.length === 0) {
      return undefined;
    }

    values.sort((a, b) => a - b);

    const data = {
      min: Number(values[0]).toFixed(0),
      max: Number(values[values.length - 1]).toFixed(0),
    };

    const middle = Math.floor(values.length / 2);
    const isEven = values.length % 2 === 0;
    data.median = isEven ?
      (Number(values[middle] + values[middle - 1]) / 2).toFixed(0) : values[middle];

    return data;
  }
}

module.exports = {
  Statistics,
};
