var fs = require('fs');

module.exports = {
  parseTestHar: function(fileName, cb) {
    fs.readFile('test/files/' + fileName, 'utf-8', function(err, data) {
      if (err) {
        return cb(err);
      }
      try {
        var har = JSON.parse(data);
        return cb(null, har);
      } catch (e) {
        return cb(e);
      }
    });
  }
};
