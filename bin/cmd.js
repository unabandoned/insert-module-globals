#!/usr/bin/env node

var insert = require('../');
var through = require('through2').default;
var Writable = require('node:stream').Writable;
var JSONStream = require('JSONStream');

// Tiny concat-stream replacement: pipe a stream in, get a single Buffer back.
function concat (cb) {
    var chunks = [];
    return new Writable({
        write: function (c, e, n) { chunks.push(Buffer.from(c)); n() },
        final: function (done) { cb(Buffer.concat(chunks)); done() }
    });
}

var basedir = process.argv[2] || process.cwd();

process.stdin
    .pipe(JSONStream.parse([ true ]))
    .pipe(through.obj(write))
    .pipe(JSONStream.stringify())
    .pipe(process.stdout)
;

function write (row, enc, next) {
    var self = this;
    var s = insert(row.id, { basedir: basedir });
    s.pipe(concat(function (src) {
        row.source = src.toString('utf8');
        self.push(row);
        next();
    }));
    s.end(row.source);
}
