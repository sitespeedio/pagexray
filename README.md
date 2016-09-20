# PageXray

[![Build status][travis-image]][travis-url]

![Page Xray](img/pagexray.png)

We love the HAR file but it's hard to actually see what the page includes only looking at the file. The PageXray converts a HAR file to a JSON format that is easier to read. We use the format internally in the coach and sitespeed.io.

## What do we collect?

 * The size and the number of requests per content type
 * The size and requests per domain
 * The number of requests per response code
 * The base domain and the httpVersion used for the base asset (the main HTML document)
 * All assets (responses) with the following data: type, url, size, expires (a normalized expires converting max-age/expires to just expires in seconds), status (response code), timeSinceLastModified (using the last modified field in the response header and normalizing to seconds), httpVersion and all request and response headers.

## Install
```bash
npm install pagexray -g
```

## Run
```bash
pagexray /path/to/my.har
```

Or if you want to prettify the HAR
```bash
pagexray --pretty /path/to/my.har
```
And if you want to get info per request/response:
```bash
pagexray -includeAssets /path/to/my.har
```

If you want to use it in node, use it like this:
```node
let pagexray = require('pagexray');
let har = // your HAR
let pages = pagexray.convert(har);
```
## Output
All sizes are in bytes. Expires and timeSinceLastModified are in seconds.

```json
[
  {
    "url": "https://www.sitespeed.io/",
    "finalUrl": "https://www.sitespeed.io/",
    "baseDomain": "www.sitespeed.io",
    "documentRedirects": -1,
    "redirectChain": [],
    "transferSize": 160894,
    "contentSize": 221699,
    "headerSize": 8027,
    "requests": 12,
    "missingCompression": 0,
    "httpType": "h1",
    "httpVersion": "HTTP/1.1",
    "contentTypes": {
      "html": {
        "transferSize": 7276,
        "contentSize": 24962,
        "headerSize": 776,
        "requests": 1
      },
      "css": {
        "transferSize": 0,
        "contentSize": 0,
        "headerSize": 0,
        "requests": 0
      },
      "javascript": {
        "transferSize": 0,
        "contentSize": 43082,
        "headerSize": 0,
        "requests": 1
      },
      "image": {
        "transferSize": 153620,
        "contentSize": 153655,
        "headerSize": 7253,
        "requests": 10
      },
      "font": {
        "transferSize": 0,
        "contentSize": 0,
        "headerSize": 0,
        "requests": 0
      }
    },
    "assets": [],
    "responseCodes": {
      "200": 12
    },
    "firstParty": {},
    "thirdParty": {},
    "domains": {
      "www.sitespeed.io": {
        "requests": 10,
        "transferSize": 160896,
        "contentSize": 178582,
        "headerSize": 8029
      },
      "ssl.google-analytics.com": {
        "requests": 2,
        "transferSize": -2,
        "contentSize": 43117,
        "headerSize": -2
      }
    },
    "expireStats": {
      "min": 0,
      "p10": 600,
      "median": 31536000,
      "p90": 31536000,
      "p99": 31536000,
      "max": 31536000
    },
    "lastModifiedStats": {
      "min": 3121029,
      "p10": 8475293,
      "median": 8475313,
      "p90": 8475339,
      "p99": 578982140,
      "max": 578982140
    },
    "cookieStats": {
      "min": 0,
      "p10": 0,
      "median": 0,
      "p90": 0,
      "p99": 0,
      "max": 0
    },
    "totalDomains": 2
  }
]

```

[travis-image]: https://img.shields.io/travis/sitespeedio/pagexray.svg?style=flat-square
[travis-url]: https://travis-ci.org/sitespeedio/pagexray
