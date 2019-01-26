# readfile-directory-index-fallback

[![npm version](https://img.shields.io/npm/v/readfile-directory-index-fallback.svg)](https://www.npmjs.com/package/readfile-directory-index-fallback)
[![Build Status](https://travis-ci.com/shinnn/readfile-directory-index-fallback.svg?branch=master)](https://travis-ci.com/shinnn/readfile-directory-index-fallback)
[![Build status](https://ci.appveyor.com/api/projects/status/r01bvq5lpmx7xfc0/branch/master?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/readfile-directory-index-fallback/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/readfile-directory-index-fallback.svg)](https://coveralls.io/r/shinnn/readfile-directory-index-fallback)

[`fs.readFile()`][readfile] using the directory index as a fallback

```javascript
const readfileDirectoryIndexFallback = require('readfile-directory-index-fallback');

// When the file `index.html` exists in the `foo` directory
readfileDirectoryIndexFallback('foo', (err, buf) => {
  buf.toString(); //=> the contents of `foo/index.html`
});
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install readfile-directory-index-fallback
```

## API

```javascript
const readfileDescendantFallback = require('readfile-directory-index-fallback');
```

### readfileDirectoryIndexFallback(*filePath*,[ *options*,] *callback*)

*filePath*: `string` `Buffer` `Uint8Array` `URL` `integer`  
*options*: `Object` ([`fs.readFile()`][readfile] options) or `string` (encoding)  
*callback*: `Function`

First, it tries to read a file at *filePath*. Then,

1. If the *filePath* points to an existing file, it passes the contents of the file to the callback.
2. If nothing exists in *filePath*, it passes an error to the callback.
3. If *filePath* points to an existing directory, it tries to read `index.html` (or the file specified in [`directoryIndex`](#optionsdirectoryindex) option) immediately under *filePath* directory.

#### options

In addition to the following, all [`fs.readFile()`][readfile] options are available.

##### options.directoryIndex

Type: `string` or `boolean`  
Default: `'index.html'`

A filename of the directory index contents (e.g. `index.php`).

```javascript
// When the file `home.html` exists in the `site/contents` directory
readfileDirectoryIndexFallback('site/contents', {directoryIndex: 'home.html'}, (err, buf) => {
  buf.toString(); //=> the contents of `site/contents/index.html`
});
```

`false` disables the fallback feature, that is, this function becomes the same as [`fs.readFile`][readfile].

```javascript
// Even if index.html exists in the `foo` directory
readfileDirectoryIndexFallback('foo', {directoryIndex: false}, err => {
  err.code; //=> `EISDIR`
});
```

#### callback(*error*, *buffer*)

*error*: `Error` if it fails to read a file, otherwise `null`  
*buffer*: `Buffer` or `String` (according to [`fs.readFile`][readfile] option)

## License

[ISC License](./LICENSE) © 2017 - 2019 Shinnosuke Watanabe

[readfile]: https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
