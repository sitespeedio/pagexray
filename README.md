# Snufkin

[![Build status][travis-image]][travis-url]

Convert a HAR to a summary of a page, describing what's important of a web page in a performance perspective to a page. This is a part of the coming sitespeed.io 4.0 but you can use it standalone.

## What do we collect?
 * The size and the number of requests per content type
 * The size and requests per domain
 * The number of requests per response code
 * The base domain and the httpVersion used for the base asset (the main HTML document)
 * All assets (responses) with the following data: type, url, size, expires (a normalized expires convering max-age/expires to just expires in seconds), status (response code), timeSinceLastModified (using the last modified field in the reponse header and normalizing to seconds), httpVersion and all request and response headers.

## Install
```bash
npm install snufkin -g
```

## Run
```bash
snufkin /path/to/my.har
```

Or if you want to prettify the HAR
```bash
snufkin --pretty /path/to/my.har
```
And if you want to get info per request/response:
```bash
snufkin -includeAssets /path/to/my.har
```

If you want to use it in node, use it like this:
```node
let snufkin= require('snufkin');
let har = // your HAR
let pages = snufkin.convert(har);
```
## Output
All sizes are in bytes. Expires and timeSinceLastModified are in seconds.

```json
[
  {
    "url": "https://run.sitespeed.io/",
    "finalUrl": "https://run.sitespeed.io/",
    "baseDomain": "run.sitespeed.io",
    "documentRedirects": 0,
    "transferSize": 102069,
    "contentSize": 102069,
    "headerSize": 6480,
    "requests": 11,
    "httpVersion": "HTTP/2.0",
    "contentTypes": {
      "doc": {
        "transferSize": 12311,
        "contentSize": 12311,
        "headerSize": 582,
        "requests": 1
      },
      "js": {
        "transferSize": 26285,
        "contentSize": 26285,
        "headerSize": 347,
        "requests": 1
      },
      "image": {
        "transferSize": 56955,
        "contentSize": 56955,
        "headerSize": 4907,
        "requests": 8
      },
      "favicon": {
        "transferSize": 6518,
        "contentSize": 6518,
        "headerSize": 644,
        "requests": 1
      }
    },
    "domains": {
      "run.sitespeed.io": {
        "requests": 9,
        "transferSize": 75749,
        "contentSize": 75749,
        "headerSize": 5788
      },
      "www.google-analytics.com": {
        "requests": 2,
        "transferSize": 26320,
        "contentSize": 26320,
        "headerSize": 692
      }
    },
    "responseCodes": {
      "200": 11
    }
  }
]

```

[travis-image]: https://img.shields.io/travis/sitespeedio/snufkin.svg?style=flat-square
[travis-url]: https://travis-ci.org/sitespeedio/snufkin
