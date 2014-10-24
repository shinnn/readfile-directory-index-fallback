/*!
 * readfile-directory-index-fallback | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/readfile-directory-index-fallback
*/
'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function readFileDirectoryIndexFallback(filePath, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {};
  }

  if (options.directoryIndex === undefined) {
    options.directoryIndex = 'index.html';
  }

  fs.readFile(filePath, options, function(err, buf) {
    if (err) {
      if (err.code === 'EISDIR' && options.directoryIndex !== false) {
        fs.readFile(path.join(filePath, options.directoryIndex), options, cb);
        return;
      }

      cb(err);
      return;
    }

    cb(err, buf);
  });
};
