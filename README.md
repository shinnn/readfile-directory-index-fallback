# readfile-directory-index-fallback

[![NPM version](https://badge.fury.io/js/readfile-directory-index-fallback.svg)](https://www.npmjs.org/package/readfile-directory-index-fallback)
[![Build Status](https://travis-ci.org/shinnn/readfile-directory-index-fallback.svg?branch=master)](https://travis-ci.org/shinnn/readfile-directory-index-fallback)
[![Build status](https://ci.appveyor.com/api/projects/status/r01bvq5lpmx7xfc0?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/readfile-directory-index-fallback)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/readfile-directory-index-fallback.svg)](https://coveralls.io/r/shinnn/readfile-directory-index-fallback)
[![devDependency Status](https://david-dm.org/shinnn/readfile-directory-index-fallback/dev-status.svg)](https://david-dm.org/shinnn/readfile-directory-index-fallback#info=devDependencies)

[fs.readFile][readfile] using the directory index as a fallback

```javascript
var readfileDirectoryIndexFallback = require('readfile-directory-index-fallback');

// When the file `index.html` exists in the `foo` directory
readfileDirectoryIndexFallback('foo', function(err, buf) {
  err; //=> null
  buf.toString(); //=> the contents of `foo/index.html`
});
```

## Installation

[Use npm](https://www.npmjs.org/doc/cli/npm-install.html).

```sh
npm install readfile-directory-index-fallback
```

## API

```javascript
var readfileDescendantFallback = require('readfile-directory-index-fallback');
```

### readfileDirectoryIndexFallback(*filePath*,[ *options*,] *callback*)

*filePath*: `String`  
*options*: `Object` ([`fs.readFile`][readfile] options)  
*callback*: `Function`

First, it tries to read a file at *filePath*. Then,

1. If the *filePath* points to an existing file, it passes the contents of the file to the callback.
2. If nothing exists in *filePath*, it passes an error to the callback.
3. If *filePath* points to an existing directory, it tries to read `index.html` (or the file specified in [`directoryIndex`](#optionsdirectoryindex) option) immediately under *filePath* directory.

#### options

In addition to the following, all [fs.readFile][readfile] options are available.

##### options.directoryIndex

Type: `String` or `Boolean`  
Default: `index.html`

A filename of the directory index contents (e.g. `index.php`).

```javascript
// When the file `home.html` exists in the `site/contents` directory
readfileDirectoryIndexFallback('site/contents', {directoryIndex: 'home.html'}, function(err, buf) {
  err; //=> null
  buf.toString(); //=> the contents of `site/contents/index.html`
});
```

`false` disables the fallback feature, that is, this function becomes the same as [`fs.readFile`][readfile].

```javascript
// Even if index.html exists in the `foo` directory
readfileDirectoryIndexFallback('foo', function(err, buf) {
  err.code; //=> `EISDIR`
  buf.toString(); //=> `undefined`
});
```

#### callback(*error*, *buffer*)

*error*: `Error` if it fails to read a file, otherwise `null`  
*buffer*: `Buffer` or `String` (according to [`fs.readFile`][readfile] option)

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[readfile]: http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
