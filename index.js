'use strict';

const {join} = require('path');
const {readFile} = require('fs');

module.exports = function readFileDirectoryIndexFallback(...args) {
	const argLen = args.length;

	if (argLen !== 2 && argLen !== 3) {
		throw new RangeError(`Expected 2 or 3 arguments (<string|Buffer|Uint8Array|URL|integer>[, <Object|string>], <Function>), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const [filePath, options, cb] = argLen === 2 ? [args[0], {}, args[1]] : args;

	if (typeof cb !== 'function') {
		const error = new TypeError(`${cb} is not a function. The last argument must be a callback function.`);
		error.code = 'ERR_INVALID_ARG_TYPE';

		throw error;
	}

	let directoryIndex;

	if (options.directoryIndex === undefined || options.directoryIndex === true) {
		directoryIndex = 'index.html';
	} else if (typeof options.directoryIndex === 'string') {
		directoryIndex = options.directoryIndex;
	} else if (options.directoryIndex !== false) {
		throw new TypeError(`directoryIndex option must be a string or a boolean, but it was ${
			typeof options.directoryIndex}.`);
	}

	readFile(filePath, options, (firstErr, firstBuf) => {
		if (firstErr) {
			if (firstErr.code === 'EISDIR' && directoryIndex) {
				readFile(join(filePath, directoryIndex), options, (err, buf) => {
					if (err) {
						if (typeof options.directoryIndex !== 'string') {
							err = firstErr;
						}
						cb(err);
						return;
					}

					cb(null, buf);
				});
				return;
			}

			cb(firstErr);
			return;
		}

		cb(null, firstBuf);
	});
};
