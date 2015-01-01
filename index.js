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

  if (typeof cb !== 'function') {
    throw new TypeError(
      cb +
      ' is not a function. The last argument must be a callback function.'
    );
  }

  var directoryIndex;
  if (options.directoryIndex === undefined || options.directoryIndex === true) {
    directoryIndex = 'index.html';
  } else if (typeof options.directoryIndex === 'string') {
    directoryIndex = options.directoryIndex;
  } else if (options.directoryIndex !== false) {
    throw new TypeError(
      'directoryIndex option must be a string or a boolean, but it was ' +
      typeof options.directoryIndex + '.'
    );
  }

  fs.readFile(filePath, options, function(err, buf) {
    if (err) {
      if (err.code === 'EISDIR' && directoryIndex) {
        fs.readFile(path.join(filePath, directoryIndex), options, cb);
        return;
      }

      cb(err);
      return;
    }

    cb(err, buf);
  });
};
