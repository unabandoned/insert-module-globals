// Minimal concat-stream replacement backed by node:stream. Pipe a stream in and
// the callback receives a single Buffer of the concatenated output — the exact
// shape the test suite relied on from concat-stream (dropped as an abandoned dep).
var Writable = require('node:stream').Writable

module.exports = function collect (cb) {
  var chunks = []
  return new Writable({
    write: function (c, e, n) { chunks.push(Buffer.from(c)); n() },
    final: function (done) { cb(Buffer.concat(chunks)); done() }
  })
}
