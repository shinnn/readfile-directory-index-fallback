'use strict';

var readFileDirectoryIndexFallback = require('..');
var test = require('tape');

test('readFileDirectoryIndexFallback()', function(t) {
  t.plan(12);

  t.equal(
    readFileDirectoryIndexFallback.name,
    'readFileDirectoryIndexFallback',
    'should have a function name.'
  );

  var option = {directoryIndex: true};

  readFileDirectoryIndexFallback('.gitattributes', option, function(err, buf) {
    t.deepEqual(
      [err, buf],
      [null, new Buffer('* text=auto\n')],
      'should read a file.'
    );
    t.deepEqual(
      option,
      {directoryIndex: true},
      'should not modify the original option object.'
    );
  });

  readFileDirectoryIndexFallback('test', 'utf8', function(err, buf) {
    t.deepEqual([err, buf], [null, 'foo\n'], 'should read index.html of the directory.');
  });

  readFileDirectoryIndexFallback('./', {
    directoryIndex: '.gitattributes',
    encoding: 'utf8'
  }, function(err, buf) {
    t.deepEqual(
      [err, buf],
      [null, '* text=auto\n'],
      'should read the specified directory index file.'
    );
  });

  readFileDirectoryIndexFallback('foo', function(err) {
    t.equal(
      err.code,
      'ENOENT',
      'should pass an error to the callback when the file doesn\'t exist.'
    );
  });

  readFileDirectoryIndexFallback('node_modules', {directoryIndex: '.bin'}, function(err) {
    t.equal(
      err.code,
      'EISDIR',
      'should pass an error to the callback when the directory index path points to a directory.'
    );
  });

  readFileDirectoryIndexFallback('test', {directoryIndex: false}, function(err) {
    t.equal(
      err.code,
      'EISDIR',
      'should not use index.html as a fallback when `directoryIndex` option is `false`.'
    );
  });

  t.throws(
    readFileDirectoryIndexFallback.bind(null, ['test'], t.fail),
    /TypeError.*path/,
    'should throw a type error when it takes non-string value as its first argument.'
  );

  t.throws(
    readFileDirectoryIndexFallback.bind(null, 'test', {}),
    /TypeError.*must be.*function/,
    'should throw a type error when it takes non-function value as its last argument.'
  );

  t.throws(
    readFileDirectoryIndexFallback.bind(null, 'test', {directoryIndex: 123}, t.fail),
    /TypeError.*must be a string or a boolean/,
    'should throw a type error when `directoryIndex` option is neither boolean nor string.'
  );

  t.throws(
    readFileDirectoryIndexFallback.bind(null),
    /TypeError.*must be.*function/,
    'should throw a type error when it takes no arguments.'
  );
});
