'use strict';

module.exports = {
  contentTypes() {
    return {
      HTML: 'html',
      PLAIN: 'plain',
      CSS: 'css',
      JS: 'javascript',
      FLASH: 'flash',
      FAVICON: 'favicon',
      IMAGE: 'image',
      SVG: 'svg',
      FONT: 'font',
      JSON: 'json',
      OCSP: 'ocsp',
      OTHER: 'other',
    };
  },

  /**
   * Get the content type from mime type.
   * @param {string} mimeType The mimeType
   * @returns {string} the content type or 'other'.
   */
  getContentType(mimeType) {
    const types = module.exports.contentTypes();

    if (!mimeType || mimeType === '') {
      return types.OTHER;
    }

    if (/html/.test(mimeType)) {
      return types.HTML;
    } else if (/plain/.test(mimeType)) {
      return types.PLAIN;
    } else if (/text\/css/.test(mimeType)) {
      return types.CSS;
    } else if (/javascript/.test(mimeType)) {
      return types.JS;
    } else if (/flash/.test(mimeType)) {
      return types.FLASH;
    } else if (/^image\/x-icon/.test(mimeType) || /^image\/vnd.microsoft.icon/.test(mimeType)) {
      return types.FAVICON;
    } else if (/image/.test(mimeType)) {
      return types.IMAGE;
    } else if (/svg/.test(mimeType)) {
      return types.SVG;
    } else if (/^application\/.*font/.test(mimeType)) {
      return types.FONT;
    } else if (/application\/json/.test(mimeType)) {
      return types.JSON;
    } else if (/application\/ocsp-response/.test(mimeType)) {
      return types.OCSP;
    }
    return types.OTHER;
  },

};
