# HAR to Page
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

If you want to use it inside your code, use it like this:
```node
var snufkin= require('snufkin'),
var har = // your HAR
var pages = snufkin.convert(har);
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
      "size": 73237,
      "requests": 3
    },
    "js": {
      "size": 831734,
      "requests": 53
    },
    "image": {
      "size": 744820,
      "requests": 103
    },
    "font": {
      "size": 304513,
      "requests": 11
    },
    "json": {
      "size": 3828,
      "requests": 2
    },
    "unknown": {
      "size": 84677,
      "requests": 2
    },
    "flash": {
      "size": 4798,
      "requests": 2
    }
   ]
  }
]

```
