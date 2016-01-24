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
    "url": "http://www.nytimes.com/",
    "baseDomain": "www.nytimes.com",
    "size": 2013204,
    "requests": 227,
    "doc": {
      "size": 42213,
      "requests": 14
    },
    "domains": {
      "www.nytimes.com": {
        "requests": 24,
        "size": 90436
      },
      ...
    },
    "responseCodes": {
      "101": 2,
      "200": 260,
      "204": 17,
      "206": 1,
      "302": 42,
      "303": 1,
      "304": 3,
      "307": 1,
      "503": 1
    },  
    "css": {
      "transferSize": 73270,
      "contentSize": 73270,
      "headerSize": 1460,
      "requests": 3
    },
    "js": {
      "transferSize": 831734,
      "contentSize": 831734,
      "headerSize": 1460,
      "requests": 53
    },
    "image": {
      "transferSize": 744820,
      "contentSize": 744820,
      "headerSize": 1460,
      "requests": 103
    },
    "font": {
      "transferSize": 304000,
      "contentSize": 304000,
      "headerSize": 1460,
      "requests": 11
    },
    "json": {
      "transferSize": 3828,
      "contentSize": 3828,
      "headerSize": 1460,
      "requests": 2
    },
    "unknown": {
      "transferSize": 84677,
      "contentSize": 84677,
      "headerSize": 0,
      "requests": 2
    },
    "flash": {
      "transferSize": 4798,
      "contentSize": 4798,
      "headerSize": 1461,
      "requests": 2
    }
   ]
  }
]

```

[travis-image]: https://img.shields.io/travis/sitespeedio/snufkin.svg?style=flat-square
[travis-url]: https://travis-ci.org/sitespeedio/snufkin
