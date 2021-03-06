'use strict';

const readFileDirectoryIndexFallback = require('..');
const test = require('tape');

test('readFileDirectoryIndexFallback()', t => {
	t.plan(8);

	const option = {directoryIndex: true};

	readFileDirectoryIndexFallback('.gitattributes', option, (...args) => {
		t.deepEqual(args, [null, Buffer.from('* text=auto eol=lf\n')], 'should read a file.');
		t.deepEqual(option, {directoryIndex: true}, 'should not modify the original option object.');
	});

	readFileDirectoryIndexFallback('test', 'utf8', (...args) => {
		t.deepEqual(args, [null, 'foo\n'], 'should read index.html of the directory.');
	});

	readFileDirectoryIndexFallback('./', {
		directoryIndex: '.gitattributes',
		encoding: 'utf8'
	}, (err, buf) => {
		t.deepEqual(
			[err, buf],
			[null, '* text=auto eol=lf\n'],
			'should read the specified directory index file.'
		);
	});

	readFileDirectoryIndexFallback('foo', {directoryIndex: true}, err => {
		t.equal(
			err.code,
			'ENOENT',
			'should pass an error to the callback when the directory index doesn\'t exist.'
		);
	});

	readFileDirectoryIndexFallback('node_modules', {directoryIndex: '.bin'}, err => {
		t.equal(
			err.code,
			'EISDIR',
			'should pass an error to the callback when the directory index path points to a directory.'
		);
	});

	readFileDirectoryIndexFallback('node_modules', err => {
		t.equal(
			err.code,
			'EISDIR',
			'should pass the first error to the callback when the index file doesn\'t exist ' +
      'under the target directory.'
		);
	});

	readFileDirectoryIndexFallback('test', {directoryIndex: false}, err => {
		t.equal(
			err.code,
			'EISDIR',
			'should not use index.html as a fallback when `directoryIndex` option is `false`.'
		);
	});
});

test('readFileDirectoryIndexFallback()', t => {
	t.throws(
		() => readFileDirectoryIndexFallback(['test'], t.fail),
		/^TypeError.*path/u,
		'should fail when it takes non-string value as its first argument.'
	);

	t.throws(
		() => readFileDirectoryIndexFallback('test', {}),
		/^TypeError.*must be.*function/u,
		'should fail when it takes non-function value as its last argument.'
	);

	t.throws(
		() => readFileDirectoryIndexFallback('test', {directoryIndex: 123}, t.fail),
		/^TypeError.*must be a string or a boolean/u,
		'should fail when `directoryIndex` option is neither boolean nor string.'
	);

	t.throws(
		() => readFileDirectoryIndexFallback(),
		/^RangeError.*Expected 2 or 3 arguments \(.*\), but got no arguments\./u,
		'should fail when it takes no arguments.'
	);

	t.throws(
		() => readFileDirectoryIndexFallback('_', {}, t.fail, '_'),
		/^RangeError.*Expected 2 or 3 arguments \(.*\), but got 4 arguments\./u,
		'should fail when it takes too many arguments.'
	);

	t.end();
});
