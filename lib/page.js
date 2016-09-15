'use strict';

const countBy = require('lodash.countby');
const groupBy = require('lodash.groupby');
const merge = require('lodash.merge');
const reduce = require('lodash.reduce');
const harParser = require('./harParser');
const Asset = require('./asset');
const Statistics = require('./statistics').Statistics;
const util = require('./util');

function resolveDocumentRedirects(assets) {
  const firstAsset = assets[0];
  const chain = [];
  let lastAsset = firstAsset;
  let index = 0;

  while (lastAsset.redirectUrl) {
    chain.push(lastAsset.redirectUrl);
    index += 1;
    lastAsset = assets[index];
  }

  return {
    url: firstAsset.url,
    finalUrl: lastAsset.url,
    chain,
    documentAsset: lastAsset,
  };
}

function aggregateSizes(assets, accumulator, path) {
  assets = assets || [];

  const sizes = assets.reduce((result, asset) => {
    result.requests += 1;

    for (const sizeName of ['transferSize', 'contentSize', 'headerSize']) {
      const size = asset[sizeName];
      if (size > 0) {
        result[sizeName] += size;
      }
    }

    return result;
  }, {
    transferSize: 0,
    contentSize: 0,
    headerSize: 0,
    requests: 0,
  });

  if (path) {
    accumulator[path] = sizes;
    return accumulator;
  }
  return merge(accumulator, sizes);
}

function aggregateCookies(assets) {
  return reduce(assets, (stats, asset) => stats.add(asset.cookies),
    new Statistics()).summarize();
}

class Page {
  static fromHar(har, config) {
    config = config || {};

    const hars = harParser.split(har);

    return hars.reduce((pages, onePageHar) => {
      const assets = Asset.fromHarEntries(onePageHar.log.entries, config);
      const page = this.fromAssets(assets, config);
      pages.push(page);
      return pages;
    }, []);
  }

  static fromAssets(allAssets, config) {
    config = config || {};

    const documentRedirects = resolveDocumentRedirects(allAssets);

    const documentAsset = documentRedirects.documentAsset;

    const page = {
      url: documentRedirects.url,
      finalUrl: documentRedirects.finalUrl,
      redirectChain: documentRedirects.chain,
      baseDomain: util.getHostname(documentRedirects.url),
      httpType: documentAsset.httpType,
      httpVersion: documentAsset.httpVersion,
    };

    aggregateSizes(allAssets, page);

    const assetsByType = groupBy(allAssets, 'type');

    merge(assetsByType, {
      html: [],
      css: [],
      javascript: [],
      image: [],
      font: [],
    });

    page.contentTypes = reduce(assetsByType, (result, assets, type) =>
      // FIXME this doesn't exclude assets without content type (e.g. 302s and 404s)
      aggregateSizes(assets, result, type), {});

    const assetsByDomain = groupBy(allAssets, asset => util.getHostname(asset.url));
    page.domains = reduce(assetsByDomain, (result, assets, domain) =>
      aggregateSizes(assets, result, domain), {});
    page.totalDomains = Object.keys(assetsByDomain).length;

    page.responseCodes = countBy(allAssets, 'status');

    page.cookieStats = reduce(allAssets,
      (stats, asset) => stats.add(asset.cookies),
      new Statistics()).summarize();

    page.expireStats = reduce(allAssets,
      (stats, asset) => stats.add(asset.expires),
      new Statistics()).summarize();

    const assetsWithLastModified = allAssets.filter(asset => asset.timeSinceLastModified);
    page.lastModifiedStats = reduce(assetsWithLastModified,
      (stats, asset) => stats.add(asset.timeSinceLastModified),
      new Statistics()).summarize();

    page.missingCompression = allAssets.filter(a => a.missingCompression).length;

    if (config.includeAssets) {
      page.assets = allAssets;
    }

    if (config.firstParty) {
      const assetsByParty = groupBy(allAssets,
        a => (a.url.match(config.firstParty) ? 'firstParty' : 'thirdParty'));

      aggregateSizes(assetsByParty.firstParty, page, 'firstParty');
      page.firstParty.cookieStats = aggregateCookies(assetsByParty.firstParty);

      aggregateSizes(assetsByParty.thirdParty, page, 'thirdParty');
      page.thirdParty.cookieStats = aggregateCookies(assetsByParty.thirdParty);
    }

    return page;
  }
}

module.exports = Page;
