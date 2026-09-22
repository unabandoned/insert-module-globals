'use strict';

// The slice of through2 this package uses, over @unabandoned/readable-stream.
//
// through2 itself is maintained, so this is not an adoption — the problem is
// that it binds to upstream readable-stream, which is abandoned and brings
// buffer, string_decoder and abort-controller with it. npm `overrides` cannot
// fix that for a published library, since they only apply at the root of an
// install.
//
// Only the classic form is reproduced: `through(write, end)` and
// `through.obj(write, end)`, a Transform whose _transform and _flush are the
// functions given. through2 v5's async-generator and `.ctor` support is not
// used here and is not recreated.

var Transform = require('@unabandoned/readable-stream').Transform;

function make(options, write, end) {
	if (typeof options === 'function') {
		end = write;
		write = options;
		options = {};
	}
	if (typeof write !== 'function') {
		write = function passthrough(chunk, enc, cb) { cb(null, chunk); };
	}

	var t = new Transform(options || {});
	t._transform = write;
	if (typeof end === 'function') {
		t._flush = end;
	}
	return t;
}

function through(options, write, end) {
	return make(options, write, end);
}

through.obj = function obj(options, write, end) {
	if (typeof options === 'function') {
		end = write;
		write = options;
		options = {};
	}
	return make({ objectMode: true, highWaterMark: 16, ...options }, write, end);
};

module.exports = through;
