# CHANGELOG - PageXray

UNRELEASED
------------------------
### Changed
* Convert lib functions to new ES6 short syntax.

* If time since last modified header is missing return undefined for value instead of -1.

* Key 'documentRedirects' in output now returns 0 if there are no document redirects instead of -1.

* httpType and httpVersion should now return the correct info if inital test URL is redirected.

version 0.9.0 - 2016-05-20
------------------------
### Changed
* Always report default content types (html, css, javascript etc) + add others. Before we only added the types that was in the HAR.

* Make sure content size is > -1 (sometimes Firefox HAR have assets that are -1 in size).

version 0.8.0 - 2016-05-15
------------------------
### Changed
Even cleaner structure for first party vs third party assets.

version 0.7.0 - 2016-05-15
------------------------
### Changed
New structure for domains to be able to support 1st vs 3rd party assets. Supply a regex for 1st party domains and you will get stats for 1st vs 3rd.

version 0.6.0 - 2016-04-18
------------------------
### Fixed
* Fix content type matching for JSON.

### Changed
* Renamed 'others' content type to 'other' for consistency.

version 0.5.0 - 2016-04-17
------------------------
### Changed
* New name new game. The project is now known as project PageXray.

version 0.4.0 - 2016-04-12
------------------------
### Added
* Collect the full redirect chain

version 0.3.8 - 2016-03-02
------------------------
### Fixed
* Removed console log.

version 0.3.7 - 2016-03-02
------------------------
### Fixed
* Create statistics per page instead of take stats for all pages.
