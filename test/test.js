'use strict';

var noop = require('nop');
var readFileDirectoryIndexFallback = require('../');
var test = require('tape');

test('takeout()', function(t) {
  t.plan(12);

  readFileDirectoryIndexFallback('.gitattributes', function(err, buf) {
    t.error(err, 'should read the file.');
    t.equal(buf.toString(), '* text=auto\n', 'should pass a valid buffer to the callback.');
  });

  readFileDirectoryIndexFallback('test', function(err, buf) {
    t.error(err, 'should read index.html of the directory.');
    t.equal(
      buf.toString(), 'foo\n',
      'should pass a valid buffer of the directory index file to the callback.'
    );
  });

  readFileDirectoryIndexFallback('test', {directoryIndex: 'test.js'}, function(err) {
    t.error(err, 'should read the specified directory index file.');
  });

  readFileDirectoryIndexFallback('foo', function(err) {
    t.equal(
      err.code, 'ENOENT',
      'should pass an error to the callback when the file doesn\'t exist.'
    );
  });

  readFileDirectoryIndexFallback('node_modules', {directoryIndex: '.bin'}, function(err) {
    t.equal(
      err.code, 'EISDIR',
      'should pass an error to the callback when the directory index path points to a directory.'
    );
  });

  readFileDirectoryIndexFallback('test', {encoding: 'base64'}, function(err, output) {
    t.error(err, 'should accept fs.readFile options.');
    t.equal(output, 'Zm9vCg==', 'should reflect fs.readFile options in the output.');
  });

  t.throws(
    readFileDirectoryIndexFallback.bind(['test'], noop), /TypeError/,
    'should throw a type error when it takes non-string value as its first argument.'
  );

  t.throws(
    readFileDirectoryIndexFallback.bind('test', {}), /TypeError/,
    'should throw a type error when it takes non-function value as its last argument.'
  );

  t.throws(
    readFileDirectoryIndexFallback.bind('test', {directoryIndex: true}, noop), /TypeError/,
    'should throw a type error when `directoryIndex` option takes a non-string value.'
  );
});
