# HARtoPageSummary
Convert a HAR to a summary of a page, more describing what's important of a web page. This is a part of the coming sitespeed.io 4.0.

## Install
```bash
npm install HARtoPageSummary -g
```

## Run
```bash
HARtoPageSummary /path/to/my.har
```

Or if you want to prettify the HAR
```bash
HARtoPageSummary --pretty /path/to/my.har
```

If you want to use it inside your code, use it like this:
```node
var HARtoPageSummary = require('HARtoPageSummary'),
var har = // your HAR
var pages = HARtoPageSummary.convert(har);
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
    },
    "assets": [
     {
       "type": "doc",
       "url": "http://www.nytimes.com/",
       "size": 33132,
       "expires": 0,
       "status": 200,
       "timeSinceLastModified": -1,
       "httpVersion": "1.1",
       "headers": {
         "request": {
           "host": "www.nytimes.com",
           "connection": "keep-alive",
           "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
           "upgrade-insecure-requests": "1",
           "user-agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36 PTST/231",
           "accept-encoding": "gzip, deflate, sdch",
           "accept-language": "en-US,en;q=0.8"
         },
         "response": {
           "server": "Apache",
           "vary": "Host",
           "x-app-name": "homepage",
           "cache-control": "no-cache",
           "content-type": "text/html; charset=utf-8",
           "date": "Sat, 29 Aug 2015 19:44:56 GMT",
           "x-varnish": "2072003290 2071932251",
           "age": "1369",
           "via": "1.1 varnish",
           "x-api-version": "5-5",
           "x-cache": "hit",
           "x-pagetype": "homepage",
           "connection": "close",
           "x-frame-options": "DENY",
           "set-cookie": "RMID=007f0101480b55e20bb8000c;Path=/; Domain=.nytimes.com;Expires=Sun, 28 Aug 2016 19:44:56 UTC",
           "content-encoding": "gzip",
           "transfer-encoding": "chunked"
         }
       }
     },
     {
       "type": "css",
       "url": "http://a1.nyt.com/assets/homepage/20150828-152658/css/homepage/styles.css",
       "size": 71447,
       "expires": 31452117,
       "status": 200,
       "timeSinceLastModified": 1978334.978,
       "httpVersion": "1.1",
       "headers": {
       "request": {
          "host": "a1.nyt.com",
          "connection": "keep-alive",
          "accept": "text/css,*/*;q=0.1",
          "user-agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36 PTST/231",
          "referer": "http://www.nytimes.com/",
          "accept-encoding": "gzip, deflate, sdch",
          "accept-language": "en-US,en;q=0.8"
        },
        "response": {
          "server": "nginx",
          "content-type": "text/css",
          "last-modified": "Fri, 28 Aug 2015 20:03:44 GMT",
          "vary": "Accept-Encoding",
          "content-encoding": "gzip",
          "cache-control": "public, max-age=31452117",
          "expires": "Sat, 27 Aug 2016 20:26:53 GMT",
          "date": "Sat, 29 Aug 2015 19:44:56 GMT",
          "content-length": "71133",
          "connection": "keep-alive"
          }
        }
    },
     ...
   ]
  }
]

```
