# CHANGELOG - PageXray

## 4.4.4 2023-08-31
### Fixed
* Added a safer header check [#125](https://github.com/sitespeedio/pagexray/pull/125).

## 4.4.3 2023-08-31
### Fixed
* If the meta section from a HAR file from Browsertime was missing, we didn't catch that. Fixed in [#124](https://github.com/sitespeedio/pagexray/pull/124).
* Update to latest minimist [#122](https://github.com/sitespeedio/pagexray/pull/122).

## 4.4.2 2022-05-05
### Fixed
* Added missing SSL timings to the time per domain [#117](https://github.com/sitespeedio/pagexray/pull/117)
## 4.4.1 2022-04-05
### Fixed
* Bumped minimist to 1.2.6
## 4.4.0 2022-02-04
### Added
* Fallback if mime types aren't mapped and use file endings. At the moment we fallback for some of the font types [#109](https://github.com/sitespeedio/pagexray/pull/109).

## 4.3.1 2021-07-21
### Added 
* Added missing in_body_parser_blocking render blocking info for Chrome.

## 4.3.0 2021-06-02
### Added 
* Include request method per asset [#105](https://github.com/sitespeedio/pagexray/pull/105). 

## 4.2.0 2021-05-28
### Added
* Attach info about render blocking assets coming/working in Chrome 92 [#104](https://github.com/sitespeedio/pagexray/pull/104).

## 4.1.0 2021-04-08
### Added
* Attach Google Web Vitals data from Browsertime [#101](https://github.com/sitespeedio/pagexray/pull/101).

## 4.0.0 2020-12-12
### Changed
* The new header structure actually sucked. Instead follow other tools and flatten headers returning an array [#98](https://github.com/sitespeedio/pagexray/pull/98).

## 3.1.1 2020-12-11
### Fixed
* Ooops, missed to expose the third party cookie data [#97](https://github.com/sitespeedio/pagexray/pull/97).

## 3.1.0 2020-12-11
### Added
* Get third party domains for cookies [#96](https://github.com/sitespeedio/pagexray/pull/96).

## 3.0.0 2020-12-11
### Changed
* Request/response headers are now returned with name/value keys to handle headers with the same name. This will only affect you if you get assets from PageXray [#93](https://github.com/sitespeedio/pagexray/pull/93).

* Removed cookie statistics field since it was broken. Report number of first and third party cookies instead.
### Added
* PageXray can categorise connections as H3 [#95](https://github.com/sitespeedio/pagexray/pull/95).
### Fixed
* Getting cookies was broken. Fixed in [#92](https://github.com/sitespeedio/pagexray/pull/92), [#93](https://github.com/sitespeedio/pagexray/pull/93) and [#94](https://github.com/sitespeedio/pagexray/pull/94).

## 2.6.0 2020-11-13
### Added
* If an asset has the HTML/text content it will be added to the asset section [#90](https://github.com/sitespeedio/pagexray/pull/90).

## 2.5.10 2020-06-20
### Fixed
* Updated minimist to 1.2.5

## 2.5.9 2019-10-11
### Fixed
* Generic copy meta tag from sitespeed.io instead of specific fields [#80](https://github.com/sitespeedio/pagexray/pull/80).

## 2.5.8 2019-08-26
### Fixed
* Updated dependencies [#79](https://github.com/sitespeedio/pagexray/pull/79).

## 2.5.7 2019-05-26
### Fixed
* Fix for categorise Wikipedia first/third party correct [#76](https://github.com/sitespeedio/pagexray/pull/76)

## 2.5.6 2019-04-16
### Fixed
* Handle pages that doesn't have any requests [#75](https://github.com/sitespeedio/pagexray/pull/75).

## 2.5.5 2019-04-06
### Fixed
* Counting the amount of requests per page, was broken in some cases. The order of the entries in the HAR file used to matter, fixed in [#74](https://github.com/sitespeedio/pagexray/pull/74).

## 2.5.4 2019-03-04
### Fixed
* Test first party domain on the actual domain instead on the URL [#73](https://github.com/sitespeedio/pagexray/pull/73) since some measuring scripts include the URL in GET parameters that break the calculation.

## 2.5.3 2019-01-20
### Fixed
* Fixing null error with some tracking pixels , thank you [rohit-nar](https://github.com/rohit-nair) for the PR [#71](https://github.com/sitespeedio/pagexray/pull/71)

## 2.5.2 2019-01-09
### Fixed
* If the HAR contains a URL for a page, use that URL (to get the right URL for a SPA) [#69](https://github.com/sitespeedio/pagexray/pull/69)

## 2.5.1 2018-12-17
### Fixed
* Using a HAR file from Browsertime without meta data made converting fail.

## 2.5.0 2018-11-16
### Added
* If you don't add your own firstparty regex, we set a default one based on the hostname. If your hostname is www.sitespeed.io we will use *.sitespeed.* [#68](https://github.com/sitespeedio/pagexray/pull/68).

## 2.4.0 2018-10-05
### Added
* We missed video/audio/xml/pdf as content type so we categorised them as others. Lets be specific instead [#67](https://github.com/sitespeedio/pagexray/pull/67).

## 2.3.1 2018-05-15
### Fixed
* If one of the WebPageTest runs failed, PageXray was broken.

## 2.3.0 2018-05-12
### Added
* Count requests/size that happens after onContentLoad and onLoad.
* Calculate fullyLoaded.

## 2.2.2 2018-04-25
### Fixed
* Better way to handle URL redirects -> more correct and avoid errors.

## 2.2.1 2018-03-28
### Fixed
* Collect the size of 304 responses see [sitespeed.io #1963](https://github.com/sitespeedio/sitespeed.io/issues/1963)

## 2.2.0 2018-03-19
### Added
* Adding totalTime to results for each asset and domain [#59](https://github.com/sitespeedio/pagexray/pull/59).

## 2.1.0 2018-02-01
### Added
* Include CPU metrics from Browsertime. Also align the WebPageTest CPU metrics with Browsertime (cpu.events.* instead of cpu.*).

## 2.0.4 2018-01-17
### Fixed
* If the HTTP version is unknown in the HAR, categorize it as unknown instead of h1/empty [#54](https://github.com/sitespeedio/pagexray/pull/54).

## 2.0.3 2018-01-14
### Fixed
* WebPageTest HAR files sometimes has request with timings that probably is wrong [#52](https://github.com/sitespeedio/pagexray/pull/52)

## 2.0.2 2017-12-27
### Fixed
* Fixed infinite loop for getting redirects URLs [#50](https://github.com/sitespeedio/pagexray/issues/50).

## 2.0.1 2017-12-19
### Fixed
* Chrome strips everything after # in the URL in the HAR, Firefox keeps it. Handle both [#49](https://github.com/sitespeedio/pagexray/issues/49).

## 2.0.0 2017-11-10
### Added
* We moved to the NodeJS 8.x since it is now LTS.

### Fixed
* Har files that includes the same url loaded with different http version (h1 vs h2) are now parsed correctly.
* Handle redirects to paths (e.g. /foo) and convert to absolute urls.

## 1.0.1 2017-10-15
### Fixed
* Fix expires and timeSinceLastModified parsing for invalid dates.
* Avoid error if optional entry timings are missing in HAR.

## Added
* Get the PageXray version with --version.

## 1.0.0 2017-08-26
### Added
* You can now run PageXray in the browser! Check Github releases to download that version.
* If the HAR is generated with sitespeed.io > 5.4.3, we pickup some extra meta data: connection type, URL to the result page, URL to the video, URL to the screenshot. And we also add the browser and version if that is availible.
* Pickup firstParty/thirdParty config from the HAR, override with config.
* Collect timings per domain. 
* Collect timings per timing type instead of total. This change is not backward compatible and you need to calculate the total yourself.

## 0.14.3 2017-06-23
### Fixed
* Collect assets that have 2XX status code instead of just strict 200. Thanks @vio for the PR.

##  0.14.2 2017-05-16
### Fixed
* Calculating timing for an assets included both SSL and Connect time, that is wrong since connect time includes SSL time.

## 0.14.1 2016-12-05
------------------------
### Fixed
* Making sure default content types values exist even if they don't

## 0.14.0 2016-11-27
### Added
* Added breakdown for first vs third party asset content types

## 0.13.1 2016-10-17
------------------------
### Fixed
* documentRedirects should be 0 when there's no redirects (not -1).
* Match fonts from Google Fonts.

## 0.13.0 2016-09-22
### Added
* Collect number of responses missing compression (that can be compressed)

### Fixed
* Get cookies from the request instead of the response (great @tobli!)

## 0.12.0 2016-09-14
### Added
* Collect cookie stats for a page (max/min median etc)
* Collect cookie stats for first vs third parties

## 0.11.0 2016-09-12
### Added
* Collect total download time for each response
* Collect number of cookies per asset

##  0.10.0 2016-09-01
### Changed
* Internal: We moved to airbnb eslint style rules.

### Added
* Collect total number of domains in totalDomain.

## 0.9.0 - 2016-05-20
### Changed
* Always report default content types (html, css, javascript etc) + add others. Before we only added the types that was in the HAR.

* Make sure content size is > -1 (sometimes Firefox HAR have assets that are -1 in size).

## 0.8.0 - 2016-05-15
### Changed
Even cleaner structure for first party vs third party assets.

## 0.7.0 - 2016-05-15
### Changed
New structure for domains to be able to support 1st vs 3rd party assets. Supply a regex for 1st party domains and you will get stats for 1st vs 3rd.

## 0.6.0 - 2016-04-18
### Fixed
* Fix content type matching for JSON.

### Changed
* Renamed 'others' content type to 'other' for consistency.

## 0.5.0 - 2016-04-17
### Changed
* New name new game. The project is now known as project PageXray.

## 0.4.0 - 2016-04-12
### Added
* Collect the full redirect chain

## 0.3.8 - 2016-03-02
### Fixed
* Removed console log.

## 0.3.7 - 2016-03-02
### Fixed
* Create statistics per page instead of take stats for all pages.
