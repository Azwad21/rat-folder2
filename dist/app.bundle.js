'use strict';

var global$1 = (typeof global$1 !== "undefined" ? global$1 :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var browser$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var pathParse = createCommonjsModule(function (module) {
'use strict';

var isWindows = browser$1.platform === 'win32';

// Regex to split a windows path into into [dir, root, basename, name, ext]
var splitWindowsRe =
    /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/;

var win32 = {};

function win32SplitPath(filename) {
  return splitWindowsRe.exec(filename).slice(1);
}

win32.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = win32SplitPath(pathString);
  if (!allParts || allParts.length !== 5) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  return {
    root: allParts[1],
    dir: allParts[0] === allParts[1] ? allParts[0] : allParts[0].slice(0, -1),
    base: allParts[2],
    ext: allParts[4],
    name: allParts[3]
  };
};



// Split a filename into [dir, root, basename, name, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/;
var posix = {};


function posixSplitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}


posix.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = posixSplitPath(pathString);
  if (!allParts || allParts.length !== 5) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  
  return {
    root: allParts[1],
    dir: allParts[0].slice(0, -1),
    base: allParts[2],
    ext: allParts[4],
    name: allParts[3],
  };
};


if (isWindows)
  module.exports = win32.parse;
else /* posix */
  module.exports = posix.parse;

module.exports.posix = posix.parse;
module.exports.win32 = win32.parse;
});
var pathParse_1 = pathParse.posix;
var pathParse_2 = pathParse.win32;

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
function resolve() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/';

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
};

// posix version
function isAbsolute(path) {
  return path.charAt(0) === '/';
}

// posix version
function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}


// path.relative(from, to)
// posix version
function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

var sep = '/';
var delimiter = ':';

function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

function basename(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}


function extname(path) {
  return splitPath(path)[3];
}
var pathModule = {
  extname: extname,
  basename: basename,
  dirname: dirname,
  sep: sep,
  delimiter: delimiter,
  relative: relative,
  join: join,
  isAbsolute: isAbsolute,
  normalize: normalize,
  resolve: resolve
};
function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

// import "./sass/style.scss";
// console.log(pathModule)

class RatFolder {
    constructor(rootElm = undefined, autoInit = true, path = undefined, type = "paths") {
        this.rootElm = rootElm;
        this.pathType = type;
        if (this.rootElm == undefined) throw new Error("No root element specified");

        if (autoInit) {
            this.define();
        } else if (!autoInit) {
            if (path != undefined && path instanceof Object && Object.keys(path).length != 0) {
                this.elm = this._parsePaths(path, document.createElement("div"));
                this._resolvePathElement(this.elm, path);
                this._addComputeElements(this.elm);
                this._appendChild(this.elm);
                this._setInitialStyle(this.elm);
                this._setComputedStyles(this.elm);
                this._addEvents(this.elm);
                this._setGutters(this.elm);
                // this.pathM("D:\\rat-folder2\\yarn.lock", "file");
                // console.log(elm);

            }
        }
    }

    define() {
        console.log("define");
    }

    _parsePaths(path, elm) {
        // console.log(path);
        if (path.children) {
            // const folder = document.createElement("div");
            elm.classList.add("folder", "view-element");
            elm.dataset.name = path.name;

            path.children.forEach(e => {
                if (e.type == "directory") {
                    const subFolder = document.createElement("div");
                    subFolder.classList.add("folder", "view-element");
                    subFolder.dataset.name = e.name;
                    subFolder.dataset.path = e.path;
                    subFolder.dataset.size = e.size;
                    subFolder.tabIndex = -1;
                    // subFolder.dataset.height = subFolder.offsetHeight;
                    // subFolder.dataset.width = subFolder.offsetWidth;
                    elm.appendChild(subFolder);

                    if (e.children) {
                        this._parsePaths(e, subFolder);
                    }
                }
            });

            path.children.forEach(e => {
                if (e.type == "file") {
                    const file = document.createElement("div");
                    file.classList.add("file", "view-element");
                    file.dataset.name = e.name;
                    file.dataset.extension = pathParse(e.path).ext;
                    if (file.dataset.title == file.dataset.extension) file.dataset.name = null;
                    file.dataset.path = e.path;
                    file.dataset.size = e.size;
                    file.tabIndex = -1;
                    elm.appendChild(file);
                }
            });

            // elm.appendChild(folder);
        }

        return elm;
    }

    _resolvePathElement(elm, path) {
        if (elm.classList.contains("folder")) {
            elm.classList.remove("folder");
            elm.classList.add("rat-tree");
        }

        if (elm.classList.contains("view-element")) {
            elm.classList.remove("view-element");
        }

        elm.dataset.path = path.path;
        elm.dataset.size = path.size;

        let folders = elm.querySelectorAll("div.folder.view-element");
        let files = elm.querySelectorAll("div.file.view-element");

        folders.forEach(folder => {
            let folderName = folder.dataset.name;

            let spanTextElement = document.createElement("span");
            spanTextElement.classList.add("textElement");

            let spanLabelElement = document.createElement("span");
            spanLabelElement.classList.add("label");
            spanLabelElement.innerText = folderName;

            spanTextElement.appendChild(spanLabelElement);
            folder.insertAdjacentElement("afterbegin", spanTextElement);

        });

        files.forEach(file => {
            let fileName = file.dataset.name;
            let fileExtension = file.dataset.extension;

            let spanTextElement = document.createElement("span");
            spanTextElement.classList.add("textElement");

            let spanLabelElement = document.createElement("span");
            spanLabelElement.classList.add("label");
            spanLabelElement.innerText = fileName;

            spanTextElement.appendChild(spanLabelElement);
            file.insertAdjacentElement("afterbegin", spanTextElement);

        });

    }

    _addComputeElements(elm) {
        let folders = elm.querySelectorAll("div.folder.view-element");
        let files = elm.querySelectorAll("div.file.view-element");

        folders.forEach(folder => {
            const span = document.createElement("span");
            span.classList.add("caret");

            const i_Element = document.createElement("i");
            i_Element.classList.add("bi", "bi-chevron-right");

            const folderSpan = document.createElement("span");
            folderSpan.classList.add("folderIcon");
            const folderIElement = document.createElement("i");
            folderIElement.classList.add("bi", "bi-folder-fill");

            span.appendChild(i_Element);
            folderSpan.appendChild(folderIElement);
            folder.querySelector("span.textElement").insertAdjacentElement("afterbegin", folderSpan);
            folder.querySelector("span.textElement").insertAdjacentElement("afterbegin", span);
        });

        files.forEach(file => {
            const span = document.createElement("span");
            span.classList.add("fileIcon");

            const i_Element = document.createElement("i");
            i_Element.classList.add("bi", "bi-file-fill");

            span.appendChild(i_Element);
            file.querySelector("span.textElement").insertAdjacentElement("afterbegin", span);
        });
    }

    _appendChild(elm) {
        this.rootElm.appendChild(elm);
    }

    _setInitialStyle(elm) {
        this.sizes = {
            caret: 12,
            folderIcon: 12,
            fileIcon: 12,
            gap: 3,
            totalFolderPadding: 3 + 12 + 3 + 12 + 3,
            totalFilePadding: 3 + 12 + 3

        };

        if (elm.querySelector("div.folder.view-element")) {
            this.sizes.caret = parseInt(
                getComputedStyle(elm.querySelector("div.folder.view-element > span.textElement > span.caret"))
                    .getPropertyValue("font-size")
            ) || 12;
            this.sizes.folderIcon = parseInt(
                getComputedStyle(elm.querySelector("div.folder.view-element > span.textElement > span.folderIcon"))
                    .getPropertyValue("font-size")
            ) || 12;
        }

        if (elm.querySelector("div.file.view-element")) {
            this.sizes.fileIcon = parseInt(
                getComputedStyle(elm.querySelector("div.file.view-element > span.textElement > span.fileIcon"))
                    .getPropertyValue("font-size")
            ) || 12;
        }

        this.sizes.totalFolderPadding = (this.sizes.gap * 3) + (this.sizes.caret + this.sizes.folderIcon);
        this.sizes.totalFilePadding = (this.sizes.gap * 2) + (this.sizes.fileIcon);
        this.sizes.iconOffset = (this.sizes.totalFolderPadding - this.sizes.folderIcon) - this.sizes.gap;

        const styleElement = document.createElement("style");
        styleElement.id = "rat-tree-view-styling";

        const styleText = `
            div.tree-view-container div.folder.view-element > span.textElement {
                padding-left: ${this.sizes.totalFolderPadding}px;
                padding-right: ${this.sizes.totalFolderPadding}px;
            }
            
            div.tree-view-container div.folder.view-element > span.textElement > span.caret {
                left: ${this.sizes.gap}px;
            }

            div.tree-view-container div.folder.view-element > span.textElement > span.folderIcon {
                left: ${this.sizes.iconOffset}px;
            }

            div.tree-view-container div.file.view-element > span.textElement > span.fileIcon {
                left: ${this.sizes.iconOffset}px;
            }

            div.tree-view-container div.file.view-element > span.textElement {
                padding-left: ${this.sizes.totalFolderPadding}px;
                padding-right: ${this.sizes.totalFolderPadding}px;
            }
        `;

        styleElement.innerText = styleText;
        document.head.insertAdjacentElement("beforeend", styleElement);

        // console.log(this.sizes);

    }

    _setComputedStyles(elm) {
        const folders = elm.querySelectorAll("div.folder.view-element");
        const files = elm.querySelectorAll("div.file.view-element");
        const folderIcons = elm.querySelectorAll("span.folderIcon");
        const fileIcons = elm.querySelectorAll("span.fileIcon");
        const carets = elm.querySelectorAll("span.caret");

        folders.forEach(folder => {
            if (folder.parentElement.classList.contains("rat-tree")) {
                folder.querySelector("span.textElement").style.paddingLeft = this.sizes.totalFolderPadding + "px";
            } else if (folder.parentElement.classList.contains("folder")) {
                const padding = (folder.parentElement.querySelector("span.textElement").style.paddingLeft || this.sizes.totalFolderPadding);
                const computePadding = parseInt(padding) + this.sizes.folderIcon;
                folder.querySelector("span.textElement").style.paddingLeft = computePadding + "px";
            }
        });

        files.forEach(file => {
            if (file.parentElement.classList.contains("folder")) {
                const computePaddingFile = parseInt(file.parentElement.querySelector("span.textElement").style.paddingLeft) + this.sizes.folderIcon;
                const spanElement = file.querySelector("span.textElement");
                spanElement.style.paddingLeft = computePaddingFile + "px";
            }
        });

        folderIcons.forEach(icon => {
            const padding = parseInt(icon.parentElement.style.paddingLeft);
            const computeOffset = (padding - this.sizes.folderIcon) - this.sizes.gap;
            icon.style.left = computeOffset + "px";
        });

        fileIcons.forEach(icon => {
            const padding = parseInt(icon.parentElement.style.paddingLeft);
            const computeOffset = (padding - this.sizes.folderIcon) - this.sizes.gap;
            icon.style.left = computeOffset + "px";
        });

        carets.forEach(caret => {
            const padding = parseInt(caret.parentElement.style.paddingLeft);
            const computeOffset = (padding - (this.sizes.caret * 2)) - (this.sizes.gap * 2);
            caret.style.left = computeOffset + "px";
        });
    }

    _setGutters(elm) {
        const folders = elm.querySelectorAll("div.folder.view-element");

        folders.forEach(folder => {
            folder.classList.toggle("active");
            // const folderTopOffset = folder.getBoundingClientRect();
            const folderTopOffset = getComputedStyle(folder).getPropertyValue("height");
            const caretOffset = folder.querySelector("span.textElement > span.caret");
            folder.style = `
            --top: ${folderTopOffset};
            --left: calc(${caretOffset.style.left} + ${caretOffset.getBoundingClientRect().width / 2}px);
            `;
            // console.log(folderTopOffset);
            // folder.classList.toggle("active");
        });

        folders.forEach(folder => {
            folder.classList.toggle("active");
        });
    }

    _addEvents(elm) {
        const folders = elm.querySelectorAll("div.folder.view-element");
        if (folders) {
            folders.forEach(folder => {
                const caret = folder.querySelector("span.textElement > span.caret");

                caret.addEventListener("click", () => {
                    this.toggleCaret(folder);
                    caret.parentElement.parentElement.classList.toggle("viewGutter");
                    if (!caret.parentElement.parentElement.classList.contains("rat-hovered")) {
                        caret.parentElement.parentElement.classList.add("rat-hovered");
                    } else if (caret.parentElement.parentElement.classList.contains("rat-hovered")) {
                        caret.parentElement.parentElement.classList.remove("rat-hovered");
                    }

                    if (folder.children) {
                        for (let subFolder of folder.children) {
                            if (subFolder.classList.contains("folder")) {
                                subFolder.classList.toggle("active");
                            }
                        }

                        for (let file of folder.children) {
                            if (file.classList.contains("file")) {
                                file.classList.toggle("active");
                            }
                        }
                    };
                });

                folder.addEventListener("mouseenter", () => {
                    if (!folder.classList.contains("viewGutter")) return;
                    if (!folder.classList.contains("rat-hovered")) {
                        folder.classList.add("rat-hovered");
                    }
                });
                folder.addEventListener("mouseleave", () => {
                    if (!folder.classList.contains("viewGutter")) return;
                    if (folder.classList.contains("rat-hovered")) {
                        folder.classList.remove("rat-hovered");
                    }
                });
            });
        }
    }

    toggleCaret(elm) {
        const i = elm.querySelector("span.textElement > span.caret > i.bi");
        if (i.classList.contains("bi-chevron-right")) {
            i.classList.toggle("bi-chevron-right");
            i.classList.toggle("bi-chevron-down");
        } else if (i.classList.contains("bi-chevron-down")) {
            i.classList.toggle("bi-chevron-right");
            i.classList.toggle("bi-chevron-down");
        }
        
    }

    pathMessage(path, msg, type) {
        console.log(pathModule);
        if (type == "file") {
            const files = this.elm.querySelectorAll("[data-path].file");
            files.forEach(file => {
                const dataPath = file.dataset.path;
                if (pathModule.normalize(dataPath) == pathModule.normalize(path)) {
                    // console.log(dataPath, path);
                    if (msg == "warning") {
                        file.classList.toggle("rat-warning");
                    } else if (msg == "success") {
                        file.classList.toggle("rat-success");
                    } else if (msg == "info") {
                        file.classList.toggle("rat-info");
                    } else if (msg == "notify") {
                        file.classList.toggle("rat-notify");
                    } else {
                        console.warn("Please give a message type.");
                    }
                }
            });
        } else if (type == "folder") {
            const folders = this.elm.querySelectorAll("[data-path].folder");
            folders.forEach(folder => {
                const dataPath = folder.dataset.path;
                if (pathModule.normalize(dataPath) == pathModule.normalize(path)) {
                    // console.log(dataPath, path);
                    if (msg == "warning") {
                        folder.classList.toggle("rat-warning");
                    } else if (msg == "success") {
                        folder.classList.toggle("rat-success");
                    } else if (msg == "info") {
                        folder.classList.toggle("rat-info");
                    } else if (msg == "notify") {
                        folder.classList.toggle("rat-notify");
                    } else {
                        console.warn("Please give a message type.");
                    }
                }
            });
        }
    }

}

/* if (path.children) {
            // container.classList.add("container");

            const folder = document.createElement("div");
            folder.dataset.name = path.name;
            folder.dataset.type = path.type;
            folder.classList.add("directory", "view-element");
            path.children.forEach(e => {
                if (e.type == "file") return;
                const child = document.createElement("div");
                child.dataset.name = e.name;
                child.dataset.type = e.type;
                child.classList.add("directory", "view-element")
                folder.appendChild(child)
                if (e.children) {
                    this.parsePaths(e, child);
                }
            })

            path.children.forEach(e => {
                if (e.type == "directory") return
                const [filename] = e.name.split(".");
                const extensionName = pathModule.extname(e.path);
                // console.log(extensionName, filename)

                const child = document.createElement("div");
                child.dataset.name = filename || null;
                child.dataset.type = e.type;
                child.dataset.extension = extensionName;
                child.classList.add("file", "view-element")
                elm.appendChild(child)
                // if (e.children) {
                    this.parsePaths(e, child);
                // }
            })

            elm.appendChild(folder)
        } */
