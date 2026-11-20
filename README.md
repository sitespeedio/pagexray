# PageXray

![Unit tests](https://github.com/sitespeedio/pagexray/workflows/Unit%20tests/badge.svg?branch=main)

![Page Xray](img/pagexray.png)

We love the HAR file but it's hard to actually see what the page includes only looking at the file. The PageXray converts a HAR file to a JSON format that is easier to read. We use the format internally in the coach and sitespeed.io. And with PageXray you can use it standalone in your browser.

## What do we collect?

 * The size and the number of requests per content type
 * The size and requests per domain
 * The number of requests per response code
 * The base domain and the httpVersion used for the base asset (the main HTML document)
 * The size and requests for first and third party, and the cookies they set
 * All assets (responses) with the following data: type, url, method, status (response code), transferSize, contentSize, headerSize, expires (the cache time in seconds, from max-age or Expires), timeSinceLastModified (from the Last-Modified header, in seconds), httpVersion, timings and totalTime, cookie names, all request and response headers and content (the response body, when the HAR has it).
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

Or read the HAR from stdin
```bash
cat /path/to/my.har | pagexray -
```

Or if you want to prettify the output
```bash
pagexray --pretty /path/to/my.har
```
And if you want to get info per request/response:
```bash
pagexray --includeAssets /path/to/my.har
```

If you want to classify first vs. third party requests yourself, pass a regex that matches your first-party hostnames:
```bash
pagexray --firstParty '.*sitespeed.*' /path/to/my.har
```

Show the version with `pagexray --version` and all options with `pagexray --help`.

If you want to use it in node, use it like this:
```node
const fs = require("fs");
const pagexray = require("pagexray");
const har = JSON.parse(fs.readFileSync("/path/to/my.har"));

const pages = pagexray.convert(har);
// Or if you want to include the per-asset information
// const pages = pagexray.convert(har, {includeAssets: true});
// Or set the first party yourself
// const pages = pagexray.convert(har, {firstParty: '.*sitespeed.*'});
// Or convert only one page (run) in the HAR
// const page = pagexray.convertIndex(har, 0);

console.log(pages)
```
## Using in your browser
Build the browser version with `npm run dist`, and include *dist/pagexray.min.js* on your page. PageXray is exposed as *window.PageXray*. [compare.sitespeed.io](https://compare.sitespeed.io) uses it this way.

```javascript
const pageXray = window.PageXray.convert(har);
```

## Output
All sizes are in bytes. Expires and timeSinceLastModified are in seconds. All times are in milliseconds.

This is the output for https://www.sitespeed.io/ tested with Chrome 158 in Browsertime:

```json
[
  {
    "url": "https://www.sitespeed.io/",
    "meta": {
      "browser": {
        "name": "Chrome",
        "version": "158.0.8127.36"
      },
      "startedDateTime": "2026-11-20T13:52:00.633Z",
      "connectivity": "native",
      "title": "https://www.sitespeed.io/ run 1"
    },
    "finalUrl": "https://www.sitespeed.io/",
    "baseDomain": "www.sitespeed.io",
    "firstPartyRegEx": ".*sitespeed.*",
    "documentRedirects": 0,
    "redirectChain": [],
    "transferSize": 61254,
    "contentSize": 105702,
    "headerSize": 0,
    "requests": 9,
    "cookieNames": [],
    "cookieNamesThirdParties": [],
    "cookies": 0,
    "missingCompression": 0,
    "fullyLoaded": 797.06591796875,
    "httpType": "h2",
    "httpVersion": "HTTP/2.0",
    "contentTypes": {
      "html": {
        "transferSize": 6352,
        "contentSize": 25651,
        "headerSize": 0,
        "requests": 1
      },
      "css": {
        "transferSize": 6026,
        "contentSize": 27316,
        "headerSize": 0,
        "requests": 1
      },
      "javascript": {
        "transferSize": 1301,
        "contentSize": 1988,
        "headerSize": 0,
        "requests": 3
      },
      "image": {
        "transferSize": 44589,
        "contentSize": 44229,
        "headerSize": 0,
        "requests": 3
      },
      "font": {
        "transferSize": 0,
        "contentSize": 0,
        "headerSize": 0,
        "requests": 0
      },
      "favicon": {
        "transferSize": 2986,
        "contentSize": 6518,
        "headerSize": 0,
        "requests": 1
      }
    },
    "assets": [],
    "responseCodes": {
      "200": 9
    },
    "firstParty": {
      "cookies": 0,
      "contentTypes": {
        "html": {
          "transferSize": 6352,
          "contentSize": 25651,
          "headerSize": 0,
          "requests": 1
        },
        "css": {
          "transferSize": 6026,
          "contentSize": 27316,
          "headerSize": 0,
          "requests": 1
        },
        "javascript": {
          "transferSize": 1301,
          "contentSize": 1988,
          "headerSize": 0,
          "requests": 3
        },
        "image": {
          "transferSize": 44589,
          "contentSize": 44229,
          "headerSize": 0,
          "requests": 3
        },
        "font": {
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
        },
        "favicon": {
          "transferSize": 2986,
          "contentSize": 6518,
          "headerSize": 0,
          "requests": 1
        }
      },
      "requests": 9,
      "transferSize": 61254,
      "contentSize": 105702,
      "headerSize": 0
    },
    "thirdParty": {
      "cookies": 0,
      "contentTypes": {
        "html": {
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
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
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
        },
        "font": {
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
        },
        "favicon": {
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
        }
      }
    },
    "domains": {
      "www.sitespeed.io": {
        "transferSize": 61254,
        "contentSize": 105702,
        "headerSize": 0,
        "requests": 9,
        "timings": {
          "blocked": 2,
          "dns": 0,
          "ssl": 167,
          "connect": 172,
          "send": 0,
          "wait": 1403,
          "receive": 32
        },
        "totalTime": 1776
      }
    },
    "expireStats": {
      "min": 0,
      "median": 31536000,
      "max": 31536000,
      "total": 252288000,
      "values": 9
    },
    "afterOnContentLoad": {
      "requests": 1,
      "transferSize": 2986,
      "contentTypes": {
        "html": {
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
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
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
        },
        "font": {
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
        },
        "favicon": {
          "transferSize": 2986,
          "contentSize": 6518,
          "headerSize": 0,
          "requests": 1
        }
      }
    },
    "afterOnLoad": {
      "requests": 1,
      "transferSize": 2986,
      "contentTypes": {
        "html": {
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
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
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
        },
        "font": {
          "transferSize": 0,
          "contentSize": 0,
          "headerSize": 0,
          "requests": 0
        },
        "favicon": {
          "transferSize": 2986,
          "contentSize": 6518,
          "headerSize": 0,
          "requests": 1
        }
      }
    },
    "renderBlocking": {
      "blocking": 1,
      "potentiallyBlocking": 0,
      "in_body_parser_blocking": 0
    },
    "totalDomains": 1,
    "visualMetrics": {
      "FirstVisualChange": 454,
      "LastVisualChange": 697,
      "SpeedIndex": 519,
      "videoRecordingStart": 909,
      "VisualReadiness": 243,
      "VisualComplete85": 666,
      "VisualComplete95": 697,
      "VisualComplete99": 697,
      "VisualProgress": {
        "0": 0,
        "454": 71,
        "484": 71,
        "515": 71,
        "545": 71,
        "575": 71,
        "606": 71,
        "666": 87,
        "697": 100
      }
    },
    "cpu": {
      "longTasks": {
        "tasks": 0,
        "totalDuration": 0,
        "totalBlockingTime": 0,
        "maxPotentialFid": 0,
        "lastLongTask": 0,
        "beforeFirstPaint": {
          "tasks": 0,
          "totalDuration": 0
        },
        "beforeFirstContentfulPaint": {
          "tasks": 0,
          "totalDuration": 0
        },
        "beforeLargestContentfulPaint": {
          "tasks": 0,
          "totalDuration": 0
        },
        "afterLoadEventEnd": {
          "tasks": 0,
          "totalDuration": 0
        }
      }
    },
    "googleWebVitals": {
      "cumulativeLayoutShift": 0,
      "ttfb": 357,
      "largestContentfulPaint": 683,
      "firstContentfulPaint": 667,
      "firstInputDelay": 0,
      "totalBlockingTime": 0
    }
  }
]
```

Some of the fields:

 * `firstPartyRegEx` — the regex that was used to split first vs. third party. It is the one you passed with `--firstParty` / `config.firstParty`, or else one made from the domain of each page (`.*sitespeed.*` for www.sitespeed.io).
 * `firstParty` / `thirdParty` — the totals only exist when that party has requests.
 * `cookieNamesThirdParties` — `{name, domain}` for each cookie that is set for another domain than the first party.
 * `missingCompression` — the number of text responses over 2 KB that are not compressed with gzip, Brotli, deflate or zstd.
 * `fullyLoaded` — milliseconds from page start to the last response finishing.
 * `afterOnLoad` / `afterOnContentLoad` — request count, transfer size and content types for requests that start after `load` / `DOMContentLoaded`. They need the `onLoad` / `onContentLoad` page timings in the HAR, and are 0 without them.
 * `expireStats` / `lastModifiedStats` — min, median, max and total of the cache times and the times since last modified for all responses.

### Additional fields

Depending on the HAR you feed in, the page object may also include:

 * `visualMetrics` — SpeedIndex, First and Last Visual Change and the visual progress from sitespeed.io/browsertime or WebPageTest.
 * `renderBlocking` — counts of `blocking`, `potentiallyBlocking` and `in_body_parser_blocking` assets (Chrome 92+). On sitespeed.io/browsertime HARs it also carries `recalculateStyle.beforeFCP` / `.beforeLCP` (elements touched + duration) for style-recalc work before each paint milestone.
 * `googleWebVitals` — Core Web Vitals captured by sitespeed.io/browsertime.
 * `cpu` — CPU events captured by sitespeed.io/browsertime or WebPageTest.
