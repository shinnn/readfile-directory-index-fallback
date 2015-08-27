/*!
 * readfile-directory-index-fallback | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/readfile-directory-index-fallback
*/
'use strict';

const fs = require('graceful-fs');
const path = require('path');
const stripBom = require('strip-bom');

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

  let directoryIndex;
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

  fs.readFile(filePath, options, (firstErr, firstBuf) => {
    if (firstErr) {
      if (firstErr.code === 'EISDIR' && directoryIndex) {
        fs.readFile(path.join(filePath, directoryIndex), options, (err, buf) => {
          if (err) {
            if (typeof options.directoryIndex !== 'string') {
              err = firstErr;
            }
            cb(err);
            return;
          }

          cb(null, stripBom(buf));
        });
        return;
      }

      cb(firstErr);
      return;
    }

    cb(null, stripBom(firstBuf));
  });
};
