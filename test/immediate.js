var test = require('./tap-adapter');
var mdeps = require('module-deps');
var bpack = require('browser-pack');
var insert = require('../');
var concat = require('concat-stream');
var vm = require('vm');

test('immediate', function (t) {
    t.plan(3);
    var deps = mdeps({
        modules: { timers: require.resolve('timers-browserify') }
    });
    var pack = bpack({ raw: true, hasExports: true });
    deps.pipe(pack).pipe(concat(function (src) {
        var c = {
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
            setImmediate: setImmediate,
            clearImmediate: clearImmediate,
            T: t
        };
        // timers-browserify@2 sources setImmediate/clearImmediate off the
        // global object (self/global) rather than implementing them itself, so
        // the sandbox must expose them the way a browser global would.
        c.self = c;
        t.ok(/require\("timers"\)/.test(src), 'timers required in source');
        t.notOk(/require\("\//.test(src), 'absolute path not required in source');
        vm.runInNewContext(src, c);
    }));
    deps.write({ transform: inserter, global: true });
    deps.end({ id: 'main', file: __dirname + '/immediate/main.js' });
});

function inserter (file) {
    return insert(file, { basedir: __dirname + '/immediate' });
}
