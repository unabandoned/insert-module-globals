/*!
 * Determine if an object is a Buffer
 *
 * Vendored from is-buffer@1.1.6 (MIT, Feross Aboukhadijeh) to drop an abandoned
 * runtime dependency. insert-module-globals injects this module into browser
 * bundles as the `Buffer.isBuffer` shim, so it must ship with the package.
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}
