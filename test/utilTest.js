'use strict';

var assert = require('chai').assert,
  util = require('../lib/util');

describe('util', function() {

  describe('#getContentType', function() {

    it('text/plain should be categorized as doc', function() {
      var result = util.getContentType('text/plain');
      assert.deepEqual(result, 'doc');
    });

    it('text/html should be categorized as doc', function() {
      var result = util.getContentType('text/html');
      assert.deepEqual(result, 'doc');
    });

    it('text/html; charset=utf-8 with charset should be categorized as doc', function() {
      var result = util.getContentType('text/html; charset=utf-8');
      assert.deepEqual(result, 'doc');
    });

    it('text/javascript should be categorized as js', function() {
      var result = util.getContentType('text/javascript');
      assert.deepEqual(result, 'js');
    });

    it('application/x-javascript; charset=utf-8 should be categorized as js', function() {
      var result = util.getContentType('application/x-javascript; charset=utf-8');
      assert.deepEqual(result, 'js');
    });

    it('text/css should be categorized as css', function() {
      var result = util.getContentType('text/css');
      assert.deepEqual(result, 'css');
    });

    it('image/png should be categorized as image', function() {
      var result = util.getContentType('image/png');
      assert.deepEqual(result, 'image');
    });

    it('image/jpg should be categorized as image', function() {
      var result = util.getContentType('image/jpg');
      assert.deepEqual(result, 'image');
    });

    it('image/gif should be categorized as image', function() {
      var result = util.getContentType('image/gif');
      assert.deepEqual(result, 'image');
    });

    it('image/x-icon should be categorized as image', function() {
      var result = util.getContentType('image/x-icon');
      assert.deepEqual(result, 'image');
    });

    it('image/svg+xml should be categorized as image', function() {
      var result = util.getContentType('image/svg+xml');
      assert.deepEqual(result, 'image');
    });

    it('image/webp should be categorized as image', function() {
      var result = util.getContentType('image/webp');
      assert.deepEqual(result, 'image');
    });


    it('application/font-woff should be categorized as font', function() {
      var result = util.getContentType('application/font-woff');
      assert.deepEqual(result, 'font');
    });

    it('application/font-sfnt should be categorized as font', function() {
      var result = util.getContentType('application/font-sfnt');
      assert.deepEqual(result, 'font');
    });

    it('application/x-font-opentype should be categorized as font', function() {
      var result = util.getContentType('application/x-font-opentype');
      assert.deepEqual(result, 'font');
    });

    it('application/x-font-ttf should be categorized as font', function() {
      var result = util.getContentType('application/x-font-ttf');
      assert.deepEqual(result, 'font');
    });

    it('application/x-shockwave-flash should be categorized as flash', function() {
      var result = util.getContentType('application/x-shockwave-flash');
      assert.deepEqual(result, 'flash');
    });

    it('application/my-own-type should be categorized as unkown', function() {
      var result = util.getContentType('application/my-own-type');
      assert.deepEqual(result, 'unknown');
    });

  });

  describe('#flattenHeaders', function() {
    // setup a HAR header structure
    var headers = [{
      name: 'header1',
      value: 'value1'
    }, {
      name: 'header2',
      value: 'value2'
    }, {
      name: 'HEADER3',
      value: 'value3'
    } ];


    var myFlattenHeaders = util.flattenHeaders(headers);

    it('the name of the key should be removed when the headers are flatten', function() {
      assert.isUndefined(myFlattenHeaders.name);
    });

    it('the name of the value should be removed when the headers are flatten', function() {
      assert.isUndefined(myFlattenHeaders.value);
    });

    it('all header names should be lowercase when flattend', function() {
      assert.strictEqual(myFlattenHeaders.header3, 'value3');
      assert.isUndefined(myFlattenHeaders.HEADER3);
    });

  });

  describe('#getHostname', function() {

    it('should fetch the domain from a URL with a filename', function() {
      var result = util.getHostname('https://www.sitespeed.io/with/a/path.jsp');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL with a query string', function() {
      var result = util.getHostname('https://www.sitespeed.io/with/a/?apa=hepp&apa2=oj');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL with #', function() {
      var result = util.getHostname('http://www.sitespeed.io/with/a/?apa=hepp&apa2=oj#yes');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL with only the domain', function() {
      var result = util.getHostname('http://www.sitespeed.io');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL without a sub domain', function() {
      var result = util.getHostname('http://sitespeed.io');
      assert.deepEqual(result, 'sitespeed.io');
    });

    it('the domain should be empty if it is missing', function() {
      var result = util.getHostname('hoppla');
      assert.deepEqual(result, '');
    });

    it('the domain should be empty if it is undefined', function() {
      var result = util.getHostname();
      assert.deepEqual(result, '');
    });

  });
});
