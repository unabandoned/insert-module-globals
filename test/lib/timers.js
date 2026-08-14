// Minimal browser timers shim vendored to drop the timers-browserify dev dep.
// module-deps maps `timers` to this module in the setImmediate/clearImmediate
// tests; it just re-exports the ambient timer globals a browser would provide.
module.exports = {
  setImmediate: globalThis.setImmediate, clearImmediate: globalThis.clearImmediate,
  setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout
}
