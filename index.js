var undeclaredIdentifiers = require('undeclared-identifiers');
var through = require('through2').default;
var merge = require('xtend');
var acorn = require('acorn');

// defined(): the first argument that is not undefined. Replaces the tiny
// `defined` runtime dependency acorn-node pulled in.
function defined () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
}

// Local acorn-node-compatible parse wrapper. acorn-node bundled a set of
// plugins and defaults; acorn 8 with ecmaVersion 'latest' natively parses
// everything those plugins added (bigint, class fields, static class features,
// numeric separators, import.meta, `export * as ns from`), so we call acorn
// directly while replicating acorn-node's default options exactly. The AST is
// consumed by undeclared-identifiers, so parsing behaviour is preserved.
function parse (src, opts) {
    if (!opts) opts = {};
    var acornOpts = {
        ecmaVersion: 'latest',
        allowHashBang: true,
        allowReturnOutsideFunction: true,
        ranges: defined(opts.ranges, opts.range),
        locations: defined(opts.locations, opts.loc),
        allowReserved: defined(opts.allowReserved, true),
        allowImportExportEverywhere: defined(opts.allowImportExportEverywhere, false)
    };

    if (opts.ecmaVersion != null) acornOpts.ecmaVersion = opts.ecmaVersion;
    if (opts.sourceType != null) acornOpts.sourceType = opts.sourceType;
    if (opts.allowHashBang != null) acornOpts.allowHashBang = opts.allowHashBang;
    if (opts.allowReturnOutsideFunction != null) acornOpts.allowReturnOutsideFunction = opts.allowReturnOutsideFunction;

    return acorn.parse(src, acornOpts);
}

var path = require('path');
var isAbsolute = path.isAbsolute || require('path-is-absolute');
var processPath = require.resolve('process/browser.js');
var isbufferPath = require.resolve('is-buffer')
var combineSourceMap = require('combine-source-map');

function getRelativeRequirePath(fullPath, fromPath) {
  var relpath = path.relative(path.dirname(fromPath), fullPath);
  // If fullPath is in the same directory or a subdirectory of fromPath,
  // relpath will result in something like "index.js", "src/abc.js".
  // require() needs "./" prepended to these paths.
  if (!/^\./.test(relpath) && !isAbsolute(relpath)) {
    relpath = "./" + relpath;
  }
  // On Windows: Convert path separators to what require() expects
  if (path.sep === '\\') {
    relpath = relpath.replace(/\\/g, '/');
  }
  return relpath;
}

var defaultVars = {
    process: function (file) {
        var relpath = getRelativeRequirePath(processPath, file);
        return 'require(' + JSON.stringify(relpath) + ')';
    },
    global: function () {
        return 'typeof global !== "undefined" ? global : '
            + 'typeof self !== "undefined" ? self : '
            + 'typeof window !== "undefined" ? window : {}'
        ;
    },
    'Buffer.isBuffer': function (file) {
        var relpath = getRelativeRequirePath(isbufferPath, file);
        return 'require(' + JSON.stringify(relpath) + ')';
    },
    Buffer: function () {
        return 'require("buffer").Buffer';
    },
    setImmediate: function () {
        return 'require("timers").setImmediate';
    },
    clearImmediate: function () {
        return 'require("timers").clearImmediate';
    },
    __filename: function (file, basedir) {
        var relpath = path.relative(basedir, file);
        // standardize path separators, use slash in Windows too
        if ( path.sep === '\\' ) {
          relpath = relpath.replace(/\\/g, '/');
        }
        var filename = '/' + relpath;
        return JSON.stringify(filename);
    },
    __dirname: function (file, basedir) {
        var relpath = path.relative(basedir, file);
        // standardize path separators, use slash in Windows too
        if ( path.sep === '\\' ) {
          relpath = relpath.replace(/\\/g, '/');
        }
        var dir = path.dirname('/' + relpath );
        return JSON.stringify(dir);
    }
};

module.exports = function (file, opts) {
    if (/\.json$/i.test(file)) return through();
    if (!opts) opts = {};
    
    var basedir = opts.basedir || '/';
    var vars = merge(defaultVars, opts.vars);
    var varNames = Object.keys(vars).filter(function(name) {
        return typeof vars[name] === 'function';
    });
    
    var quick = RegExp(varNames.map(function (name) {
        return '\\b' + name + '\\b';
    }).join('|'));
    
    var chunks = [];
    
    return through(write, end);
    
    function write (chunk, enc, next) { chunks.push(chunk); next() }
    
    function end (done) {
        var self = this;
        var source = Buffer.isBuffer(chunks[0])
            ? Buffer.concat(chunks).toString('utf8')
            : chunks.join('')
        ;
        source = source
            .replace(/^\ufeff/, '')
            .replace(/^#![^\n]*\n/, '\n');

        if (opts.always !== true && !quick.test(source)) {
            self.push(source);
            return done();
        }

        try {
            var undeclared = opts.always
                ? { identifiers: varNames, properties: [] }
                : undeclaredIdentifiers(parse(source), { wildcard: true })
            ;
        }
        catch (err) {
            var e = new SyntaxError(
                (err.message || err) + ' while parsing ' + file
            );
            e.type = 'syntax';
            e.filename = file;
            return done(e);
        }

        var globals = {};
        
        varNames.forEach(function (name) {
            if (!/\./.test(name)) return;
            var parts = name.split('.')
            var prop = undeclared.properties.indexOf(name)
            if (prop === -1 || countprops(undeclared.properties, parts[0]) > 1) return;
            var value = vars[name](file, basedir);
            if (!value) return;
            globals[parts[0]] = '{'
                + JSON.stringify(parts[1]) + ':' + value + '}';
            self.emit('global', name);
        });
        varNames.forEach(function (name) {
            if (/\./.test(name)) return;
            if (globals[name]) return;
            if (undeclared.identifiers.indexOf(name) < 0) return;
            var value = vars[name](file, basedir);
            if (!value) return;
            globals[name] = value;
            self.emit('global', name);
        });
        
        // closeOver may return a string synchronously, or a Promise for a
        // string when a source map is generated (combine-source-map's comment()
        // is now asynchronous). Handle both uniformly.
        Promise.resolve(closeOver(globals, source, file, opts)).then(function (out) {
            self.push(out);
            done();
        }, function (err) {
            done(err);
        });
    }
};

module.exports.vars = defaultVars;

function closeOver (globals, src, file, opts) {
    var keys = Object.keys(globals);
    if (keys.length === 0) return src;
    var values = keys.map(function (key) { return globals[key] });
    
    // we double-wrap the source in IIFEs to prevent code like
    //     (function(Buffer){ const Buffer = null }())
    // which causes a parse error.
    var wrappedSource = '(function (){\n' + src + '\n}).call(this)';
    if (keys.length <= 3) {
        wrappedSource = '(function (' + keys.join(',') + '){'
            + wrappedSource + '}).call(this,' + values.join(',') + ')'
        ;
    }
    else {
      // necessary to make arguments[3..6] still work for workerify etc
      // a,b,c,arguments[3..6],d,e,f...
      var extra = [ '__argument0', '__argument1', '__argument2', '__argument3' ];
      var names = keys.slice(0,3).concat(extra).concat(keys.slice(3));
      values.splice(3, 0,
          'arguments[3]','arguments[4]',
          'arguments[5]','arguments[6]'
      );
      wrappedSource = '(function (' + names.join(',') + '){'
        + wrappedSource + '}).call(this,' + values.join(',') + ')';
    }

    // Generate source maps if wanted. Including the right offset for
    // the wrapped source.
    if (!opts.debug) {
        return wrappedSource;
    }
    var sourceFile = path.relative(opts.basedir, file)
        .replace(/\\/g, '/');
    var sourceMap = combineSourceMap.create().addFile(
        { sourceFile: sourceFile, source: src},
        { line: 1 });
    // @unabandoned/combine-source-map's comment() is asynchronous (it combines
    // maps lazily and returns a Promise); await it and assemble the annotated
    // source once the sourceMappingURL comment is ready.
    return sourceMap.comment().then(function (comment) {
        return combineSourceMap.removeComments(wrappedSource) + "\n" + comment;
    });
}

function countprops (props, name) {
    return props.filter(function (prop) {
        return prop.slice(0, name.length + 1) === name + '.';
    }).length;
}
