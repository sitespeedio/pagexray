# PageXray

![Unit tests](https://github.com/sitespeedio/pagexray/workflows/Unit%20tests/badge.svg?branch=main)

![Page Xray](img/pagexray.png)

We love the HAR file but it's hard to actually see what the page includes only looking at the file. The PageXray converts a HAR file to a JSON format that is easier to read. We use the format internally in the coach and sitespeed.io. And with PageXray you can use it standalone in your browser.

## What do we collect?

 * The size and the number of requests per content type
 * The size and requests per domain
 * The number of requests per response code
 * The base domain and the httpVersion used for the base asset (the main HTML document)
 * All assets (responses) with the following data: type, url, size, expires (a normalized expires converting max-age/expires to just expires in seconds), status (response code), timeSinceLastModified (using the last modified field in the response header and normalizing to seconds), httpVersion and all request and response headers.
 * If you use a HAR from WebPageTest we also get SpeedIndex and other VisualMetrics. 
 * If your HAR is from sitespeed.io you will also get some extra metrics like SpeedIndex.

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
pagexray --includeAssets /path/to/my.har
```

If you want to use it in node, use it like this:
```node
const fs = require("fs");
const pagexray = require("pagexray");
const har = JSON.parse(fs.readFileSync("/path/to/my.har"));

const pages = pagexray.convert(har);
// Or ofyou want to include the each asset information
// const pages = pagexray.convert(har, {includeAssets: true});

console.log(pages)
```
## Using in your browser
Include the latest pagexray.min.js (that you find in the relases) on your page. PageXray is exposed as *window.PageXray*

```javascript
const pageXray = window.PageXray.convert(har);
```

## Output
All sizes are in bytes. Expires and timeSinceLastModified are in seconds.

```json
[
  {
    "url": "https://www.sitespeed.io/",
    "meta": {
      "browser": {
        "name": "Chrome",
        "version": "60.0.3112.78"
      },
      "startedDateTime": "2017-08-24T18:26:29.077Z",
      "connectivity": "native",
      "title": "Sitespeed.io - Welcome to the wonderful world of Web Performance run 1"
    },
    "finalUrl": "https://www.sitespeed.io/",
    "baseDomain": "www.sitespeed.io",
    "documentRedirects": 0,
    "redirectChain": [],
    "transferSize": 98791,
    "contentSize": 120776,
    "headerSize": 0,
    "requests": 10,
    "missingCompression": 0,
    "httpType": "h2",
    "httpVersion": "HTTP/2.0",
    "contentTypes": {
      "html": {
        "transferSize": 8479,
        "contentSize": 28279,
        "headerSize": 0,
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
        "contentSize": 0,
        "headerSize": 0,
        "requests": 0
      },
      "image": {
        "transferSize": 87309,
        "contentSize": 85979,
        "headerSize": 0,
        "requests": 8
      },
      "font": {
        "transferSize": 0,
        "contentSize": 0,
        "headerSize": 0,
        "requests": 0
      },
      "favicon": {
        "transferSize": 3003,
        "contentSize": 6518,
        "headerSize": 0,
        "requests": 1
      }
    },
    "assets": [],
    "responseCodes": {
      "200": 10
    },
    "firstParty": {},
    "thirdParty": {},
    "domains": {
      "www.sitespeed.io": {
        "transferSize": 98791,
        "contentSize": 120776,
        "headerSize": -10,
        "requests": 10,
        "timings": {
          "blocked": 169,
          "dns": 0,
          "connect": 0,
          "send": 6,
          "wait": 3624,
          "receive": 104
        }
      }
    },
    "expireStats": {
      "min": 600,
      "median": 31536000,
      "max": 31536000,
      "total": 283824600,
      "values": 10
    },
    "lastModifiedStats": {
      "min": 733347,
      "median": 733444,
      "max": 733480,
      "total": 7334359,
      "values": 10
    },
    "cookieStats": {
      "min": 0,
      "median": 0,
      "max": 0,
      "total": 0,
      "values": 10
    },
    "totalDomains": 1,
    "visualMetrics": {
      "FirstVisualChange": 617,
      "SpeedIndex": 625,
      "VisualComplete85": 617,
      "LastVisualChange": 1033,
      "VisualProgress": {
        "0": 0,
        "617": 98,
        "633": 98,
        "667": 98,
        "850": 98,
        "1033": 100
      }
    }
  }
]

```
