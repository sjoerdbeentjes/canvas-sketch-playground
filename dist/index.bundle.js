/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/canvas-sketch-util/math.js":
/*!*************************************************!*\
  !*** ./node_modules/canvas-sketch-util/math.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defined = __webpack_require__(/*! defined */ "./node_modules/defined/index.js");
var EPSILON = Number.EPSILON;

function clamp (value, min, max) {
  return min < max
    ? (value < min ? min : value > max ? max : value)
    : (value < max ? max : value > min ? min : value);
}

function clamp01 (v) {
  return clamp(v, 0, 1);
}

function lerp (min, max, t) {
  return min * (1 - t) + max * t;
}

function inverseLerp (min, max, t) {
  if (Math.abs(min - max) < EPSILON) return 0;
  else return (t - min) / (max - min);
}

function smoothstep (min, max, t) {
  var x = clamp(inverseLerp(min, max, t), 0, 1);
  return x * x * (3 - 2 * x);
}

function toFinite (n, defaultValue) {
  defaultValue = defined(defaultValue, 0);
  return typeof n === 'number' && isFinite(n) ? n : defaultValue;
}

function expandVector (dims) {
  if (typeof dims !== 'number') throw new TypeError('Expected dims argument');
  return function (p, defaultValue) {
    defaultValue = defined(defaultValue, 0);
    var scalar;
    if (p == null) {
      // No vector, create a default one
      scalar = defaultValue;
    } else if (typeof p === 'number' && isFinite(p)) {
      // Expand single channel to multiple vector
      scalar = p;
    }

    var out = [];
    var i;
    if (scalar == null) {
      for (i = 0; i < dims; i++) {
        out[i] = toFinite(p[i], defaultValue);
      }
    } else {
      for (i = 0; i < dims; i++) {
        out[i] = scalar;
      }
    }
    return out;
  };
}

function lerpArray (min, max, t, out) {
  out = out || [];
  if (min.length !== max.length) {
    throw new TypeError('min and max array are expected to have the same length');
  }
  for (var i = 0; i < min.length; i++) {
    out[i] = lerp(min[i], max[i], t);
  }
  return out;
}

function newArray (n, initialValue) {
  n = defined(n, 0);
  if (typeof n !== 'number') throw new TypeError('Expected n argument to be a number');
  var out = [];
  for (var i = 0; i < n; i++) out.push(initialValue);
  return out;
}

function linspace (n, opts) {
  n = defined(n, 0);
  if (typeof n !== 'number') throw new TypeError('Expected n argument to be a number');
  opts = opts || {};
  if (typeof opts === 'boolean') {
    opts = { endpoint: true };
  }
  var offset = defined(opts.offset, 0);
  if (opts.endpoint) {
    return newArray(n).map(function (_, i) {
      return n <= 1 ? 0 : ((i + offset) / (n - 1));
    });
  } else {
    return newArray(n).map(function (_, i) {
      return (i + offset) / n;
    });
  }
}

function lerpFrames (values, t, out) {
  t = clamp(t, 0, 1);

  var len = values.length - 1;
  var whole = t * len;
  var frame = Math.floor(whole);
  var fract = whole - frame;

  var nextFrame = Math.min(frame + 1, len);
  var a = values[frame % values.length];
  var b = values[nextFrame % values.length];
  if (typeof a === 'number' && typeof b === 'number') {
    return lerp(a, b, fract);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    return lerpArray(a, b, fract, out);
  } else {
    throw new TypeError('Mismatch in value type of two array elements: ' + frame + ' and ' + nextFrame);
  }
}

function mod (a, b) {
  return ((a % b) + b) % b;
}

function degToRad (n) {
  return n * Math.PI / 180;
}

function radToDeg (n) {
  return n * 180 / Math.PI;
}

function fract (n) {
  return n - Math.floor(n);
}

function sign (n) {
  if (n > 0) return 1;
  else if (n < 0) return -1;
  else return 0;
}

function wrap (value, from, to) {
  if (typeof from !== 'number' || typeof to !== 'number') {
    throw new TypeError('Must specify "to" and "from" arguments as numbers');
  }
  // algorithm from http://stackoverflow.com/a/5852628/599884
  if (from > to) {
    var t = from;
    from = to;
    to = t;
  }
  var cycle = to - from;
  if (cycle === 0) {
    return to;
  }
  return value - cycle * Math.floor((value - from) / cycle);
}

// Specific function from Unity / ofMath, not sure its needed?
// function lerpWrap (a, b, t, min, max) {
//   return wrap(a + wrap(b - a, min, max) * t, min, max)
// }

function pingPong (t, length) {
  t = mod(t, length * 2);
  return length - Math.abs(t - length);
}

function damp (a, b, lambda, dt) {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

function dampArray (a, b, lambda, dt, out) {
  out = out || [];
  for (var i = 0; i < a.length; i++) {
    out[i] = damp(a[i], b[i], lambda, dt);
  }
  return out;
}

function mapRange (value, inputMin, inputMax, outputMin, outputMax, clamp) {
  // Reference:
  // https://openframeworks.cc/documentation/math/ofMath/
  if (Math.abs(inputMin - inputMax) < EPSILON) {
    return outputMin;
  } else {
    var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
    if (clamp) {
      if (outputMax < outputMin) {
        if (outVal < outputMax) outVal = outputMax;
        else if (outVal > outputMin) outVal = outputMin;
      } else {
        if (outVal > outputMax) outVal = outputMax;
        else if (outVal < outputMin) outVal = outputMin;
      }
    }
    return outVal;
  }
}

module.exports = {
  mod: mod,
  fract: fract,
  sign: sign,
  degToRad: degToRad,
  radToDeg: radToDeg,
  wrap: wrap,
  pingPong: pingPong,
  linspace: linspace,
  lerp: lerp,
  lerpArray: lerpArray,
  inverseLerp: inverseLerp,
  lerpFrames: lerpFrames,
  clamp: clamp,
  clamp01: clamp01,
  smoothstep: smoothstep,
  damp: damp,
  dampArray: dampArray,
  mapRange: mapRange,
  expand2D: expandVector(2),
  expand3D: expandVector(3),
  expand4D: expandVector(4)
};


/***/ }),

/***/ "./node_modules/canvas-sketch-util/random.js":
/*!***************************************************!*\
  !*** ./node_modules/canvas-sketch-util/random.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var seedRandom = __webpack_require__(/*! seed-random */ "./node_modules/seed-random/index.js");
var SimplexNoise = __webpack_require__(/*! simplex-noise */ "./node_modules/simplex-noise/simplex-noise.js");
var defined = __webpack_require__(/*! defined */ "./node_modules/defined/index.js");

function createRandom (defaultSeed) {
  defaultSeed = defined(defaultSeed, null);
  var defaultRandom = Math.random;
  var currentSeed;
  var currentRandom;
  var noiseGenerator;
  var _nextGaussian = null;
  var _hasNextGaussian = false;

  setSeed(defaultSeed);

  return {
    value: value,
    createRandom: function (defaultSeed) {
      return createRandom(defaultSeed);
    },
    setSeed: setSeed,
    getSeed: getSeed,
    getRandomSeed: getRandomSeed,
    valueNonZero: valueNonZero,
    permuteNoise: permuteNoise,
    noise1D: noise1D,
    noise2D: noise2D,
    noise3D: noise3D,
    noise4D: noise4D,
    sign: sign,
    boolean: boolean,
    chance: chance,
    range: range,
    rangeFloor: rangeFloor,
    pick: pick,
    shuffle: shuffle,
    onCircle: onCircle,
    insideCircle: insideCircle,
    onSphere: onSphere,
    insideSphere: insideSphere,
    quaternion: quaternion,
    weighted: weighted,
    weightedSet: weightedSet,
    weightedSetIndex: weightedSetIndex,
    gaussian: gaussian
  };

  function setSeed (seed, opt) {
    if (typeof seed === 'number' || typeof seed === 'string') {
      currentSeed = seed;
      currentRandom = seedRandom(currentSeed, opt);
    } else {
      currentSeed = undefined;
      currentRandom = defaultRandom;
    }
    noiseGenerator = createNoise();
    _nextGaussian = null;
    _hasNextGaussian = false;
  }

  function value () {
    return currentRandom();
  }

  function valueNonZero () {
    var u = 0;
    while (u === 0) u = value();
    return u;
  }

  function getSeed () {
    return currentSeed;
  }

  function getRandomSeed () {
    var seed = String(Math.floor(Math.random() * 1000000));
    return seed;
  }

  function createNoise () {
    return new SimplexNoise(currentRandom);
  }

  function permuteNoise () {
    noiseGenerator = createNoise();
  }

  function noise1D (x, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise2D(x * frequency, 0);
  }

  function noise2D (x, y, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise2D(x * frequency, y * frequency);
  }

  function noise3D (x, y, z, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise3D(
      x * frequency,
      y * frequency,
      z * frequency
    );
  }

  function noise4D (x, y, z, w, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
    if (!isFinite(w)) throw new TypeError('w component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise4D(
      x * frequency,
      y * frequency,
      z * frequency,
      w * frequency
    );
  }

  function sign () {
    return boolean() ? 1 : -1;
  }

  function boolean () {
    return value() > 0.5;
  }

  function chance (n) {
    n = defined(n, 0.5);
    if (typeof n !== 'number') throw new TypeError('expected n to be a number');
    return value() < n;
  }

  function range (min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return value() * (max - min) + min;
  }

  function rangeFloor (min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return Math.floor(range(min, max));
  }

  function pick (array) {
    if (array.length === 0) return undefined;
    return array[rangeFloor(0, array.length)];
  }

  function shuffle (arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Expected Array, got ' + typeof arr);
    }

    var rand;
    var tmp;
    var len = arr.length;
    var ret = arr.slice();
    while (len) {
      rand = Math.floor(value() * len--);
      tmp = ret[len];
      ret[len] = ret[rand];
      ret[rand] = tmp;
    }
    return ret;
  }

  function onCircle (radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    var theta = value() * 2.0 * Math.PI;
    out[0] = radius * Math.cos(theta);
    out[1] = radius * Math.sin(theta);
    return out;
  }

  function insideCircle (radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    onCircle(1, out);
    var r = radius * Math.sqrt(value());
    out[0] *= r;
    out[1] *= r;
    return out;
  }

  function onSphere (radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    var u = value() * Math.PI * 2;
    var v = value() * 2 - 1;
    var phi = u;
    var theta = Math.acos(v);
    out[0] = radius * Math.sin(theta) * Math.cos(phi);
    out[1] = radius * Math.sin(theta) * Math.sin(phi);
    out[2] = radius * Math.cos(theta);
    return out;
  }

  function insideSphere (radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    var u = value() * Math.PI * 2;
    var v = value() * 2 - 1;
    var k = value();

    var phi = u;
    var theta = Math.acos(v);
    var r = radius * Math.cbrt(k);
    out[0] = r * Math.sin(theta) * Math.cos(phi);
    out[1] = r * Math.sin(theta) * Math.sin(phi);
    out[2] = r * Math.cos(theta);
    return out;
  }

  function quaternion (out) {
    out = out || [];
    var u1 = value();
    var u2 = value();
    var u3 = value();

    var sq1 = Math.sqrt(1 - u1);
    var sq2 = Math.sqrt(u1);

    var theta1 = Math.PI * 2 * u2;
    var theta2 = Math.PI * 2 * u3;

    var x = Math.sin(theta1) * sq1;
    var y = Math.cos(theta1) * sq1;
    var z = Math.sin(theta2) * sq2;
    var w = Math.cos(theta2) * sq2;
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }

  function weightedSet (set) {
    set = set || [];
    if (set.length === 0) return null;
    return set[weightedSetIndex(set)].value;
  }

  function weightedSetIndex (set) {
    set = set || [];
    if (set.length === 0) return -1;
    return weighted(set.map(function (s) {
      return s.weight;
    }));
  }

  function weighted (weights) {
    weights = weights || [];
    if (weights.length === 0) return -1;
    var totalWeight = 0;
    var i;

    for (i = 0; i < weights.length; i++) {
      totalWeight += weights[i];
    }

    if (totalWeight <= 0) throw new Error('Weights must sum to > 0');

    var random = value() * totalWeight;
    for (i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        return i;
      }
      random -= weights[i];
    }
    return 0;
  }

  function gaussian (mean, standardDerivation) {
    mean = defined(mean, 0);
    standardDerivation = defined(standardDerivation, 1);

    // https://github.com/openjdk-mirror/jdk7u-jdk/blob/f4d80957e89a19a29bb9f9807d2a28351ed7f7df/src/share/classes/java/util/Random.java#L496
    if (_hasNextGaussian) {
      _hasNextGaussian = false;
      var result = _nextGaussian;
      _nextGaussian = null;
      return mean + standardDerivation * result;
    } else {
      var v1 = 0;
      var v2 = 0;
      var s = 0;
      do {
        v1 = value() * 2 - 1; // between -1 and 1
        v2 = value() * 2 - 1; // between -1 and 1
        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s === 0);
      var multiplier = Math.sqrt(-2 * Math.log(s) / s);
      _nextGaussian = (v2 * multiplier);
      _hasNextGaussian = true;
      return mean + standardDerivation * (v1 * multiplier);
    }
  }
}

module.exports = createRandom();


/***/ }),

/***/ "./node_modules/canvas-sketch/dist/canvas-sketch.umd.js":
/*!**************************************************************!*\
  !*** ./node_modules/canvas-sketch/dist/canvas-sketch.umd.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function (global, factory) {
     true ? module.exports = factory(__webpack_require__(/*! convert-length */ "./node_modules/convert-length/convert-length.js")) :
    0;
}(this, (function (convertLength) {

    convertLength = convertLength && convertLength.hasOwnProperty('default') ? convertLength['default'] : convertLength;

    var defined = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] !== undefined) return arguments[i];
        }
    };

    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */
    /* eslint-disable no-unused-vars */
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    function toObject(val) {
    	if (val === null || val === undefined) {
    		throw new TypeError('Object.assign cannot be called with null or undefined');
    	}

    	return Object(val);
    }

    function shouldUseNative() {
    	try {
    		if (!Object.assign) {
    			return false;
    		}

    		// Detect buggy property enumeration order in older V8 versions.

    		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
    		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
    		test1[5] = 'de';
    		if (Object.getOwnPropertyNames(test1)[0] === '5') {
    			return false;
    		}

    		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    		var test2 = {};
    		for (var i = 0; i < 10; i++) {
    			test2['_' + String.fromCharCode(i)] = i;
    		}
    		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
    			return test2[n];
    		});
    		if (order2.join('') !== '0123456789') {
    			return false;
    		}

    		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    		var test3 = {};
    		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
    			test3[letter] = letter;
    		});
    		if (Object.keys(Object.assign({}, test3)).join('') !==
    				'abcdefghijklmnopqrst') {
    			return false;
    		}

    		return true;
    	} catch (err) {
    		// We don't expect any of the above to throw, but better to be safe.
    		return false;
    	}
    }

    var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
    	var from;
    	var to = toObject(target);
    	var symbols;

    	for (var s = 1; s < arguments.length; s++) {
    		from = Object(arguments[s]);

    		for (var key in from) {
    			if (hasOwnProperty.call(from, key)) {
    				to[key] = from[key];
    			}
    		}

    		if (getOwnPropertySymbols) {
    			symbols = getOwnPropertySymbols(from);
    			for (var i = 0; i < symbols.length; i++) {
    				if (propIsEnumerable.call(from, symbols[i])) {
    					to[symbols[i]] = from[symbols[i]];
    				}
    			}
    		}
    	}

    	return to;
    };

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var browser =
      commonjsGlobal.performance &&
      commonjsGlobal.performance.now ? function now() {
        return performance.now()
      } : Date.now || function now() {
        return +new Date
      };

    var isPromise_1 = isPromise;

    function isPromise(obj) {
      return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }

    var isDom = isNode;

    function isNode (val) {
      return (!val || typeof val !== 'object')
        ? false
        : (typeof window === 'object' && typeof window.Node === 'object')
          ? (val instanceof window.Node)
          : (typeof val.nodeType === 'number') &&
            (typeof val.nodeName === 'string')
    }

    function getClientAPI() {
        return typeof window !== 'undefined' && window['canvas-sketch-cli'];
    }

    function isBrowser() {
        return typeof document !== 'undefined';
    }

    function isWebGLContext(ctx) {
        return typeof ctx.clear === 'function' && typeof ctx.clearColor === 'function' && typeof ctx.bufferData === 'function';
    }

    function isCanvas(element) {
        return isDom(element) && /canvas/i.test(element.nodeName) && typeof element.getContext === 'function';
    }

    var keys = createCommonjsModule(function (module, exports) {
    exports = module.exports = typeof Object.keys === 'function'
      ? Object.keys : shim;

    exports.shim = shim;
    function shim (obj) {
      var keys = [];
      for (var key in obj) keys.push(key);
      return keys;
    }
    });
    var keys_1 = keys.shim;

    var is_arguments = createCommonjsModule(function (module, exports) {
    var supportsArgumentsClass = (function(){
      return Object.prototype.toString.call(arguments)
    })() == '[object Arguments]';

    exports = module.exports = supportsArgumentsClass ? supported : unsupported;

    exports.supported = supported;
    function supported(object) {
      return Object.prototype.toString.call(object) == '[object Arguments]';
    }
    exports.unsupported = unsupported;
    function unsupported(object){
      return object &&
        typeof object == 'object' &&
        typeof object.length == 'number' &&
        Object.prototype.hasOwnProperty.call(object, 'callee') &&
        !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
        false;
    }});
    var is_arguments_1 = is_arguments.supported;
    var is_arguments_2 = is_arguments.unsupported;

    var deepEqual_1 = createCommonjsModule(function (module) {
    var pSlice = Array.prototype.slice;



    var deepEqual = module.exports = function (actual, expected, opts) {
      if (!opts) opts = {};
      // 7.1. All identical values are equivalent, as determined by ===.
      if (actual === expected) {
        return true;

      } else if (actual instanceof Date && expected instanceof Date) {
        return actual.getTime() === expected.getTime();

      // 7.3. Other pairs that do not both pass typeof value == 'object',
      // equivalence is determined by ==.
      } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
        return opts.strict ? actual === expected : actual == expected;

      // 7.4. For all other Object pairs, including Array objects, equivalence is
      // determined by having the same number of owned properties (as verified
      // with Object.prototype.hasOwnProperty.call), the same set of keys
      // (although not necessarily the same order), equivalent values for every
      // corresponding key, and an identical 'prototype' property. Note: this
      // accounts for both named and indexed properties on Arrays.
      } else {
        return objEquiv(actual, expected, opts);
      }
    };

    function isUndefinedOrNull(value) {
      return value === null || value === undefined;
    }

    function isBuffer (x) {
      if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
      if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
        return false;
      }
      if (x.length > 0 && typeof x[0] !== 'number') return false;
      return true;
    }

    function objEquiv(a, b, opts) {
      var i, key;
      if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
        return false;
      // an identical 'prototype' property.
      if (a.prototype !== b.prototype) return false;
      //~~~I've managed to break Object.keys through screwy arguments passing.
      //   Converting to array solves the problem.
      if (is_arguments(a)) {
        if (!is_arguments(b)) {
          return false;
        }
        a = pSlice.call(a);
        b = pSlice.call(b);
        return deepEqual(a, b, opts);
      }
      if (isBuffer(a)) {
        if (!isBuffer(b)) {
          return false;
        }
        if (a.length !== b.length) return false;
        for (i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }
      try {
        var ka = keys(a),
            kb = keys(b);
      } catch (e) {//happens when one is a string literal and the other isn't
        return false;
      }
      // having the same number of owned properties (keys incorporates
      // hasOwnProperty)
      if (ka.length != kb.length)
        return false;
      //the same set of keys (although not necessarily the same order),
      ka.sort();
      kb.sort();
      //~~~cheap key test
      for (i = ka.length - 1; i >= 0; i--) {
        if (ka[i] != kb[i])
          return false;
      }
      //equivalent values for every corresponding key, and
      //~~~possibly expensive deep test
      for (i = ka.length - 1; i >= 0; i--) {
        key = ka[i];
        if (!deepEqual(a[key], b[key], opts)) return false;
      }
      return typeof a === typeof b;
    }
    });

    var dateformat = createCommonjsModule(function (module, exports) {
    /*
     * Date Format 1.2.3
     * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
     * MIT license
     *
     * Includes enhancements by Scott Trenda <scott.trenda.net>
     * and Kris Kowal <cixar.com/~kris.kowal/>
     *
     * Accepts a date, a mask, or a date and a mask.
     * Returns a formatted version of the given date.
     * The date defaults to the current date/time.
     * The mask defaults to dateFormat.masks.default.
     */

    (function(global) {

      var dateFormat = (function() {
          var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g;
          var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
          var timezoneClip = /[^-+\dA-Z]/g;
      
          // Regexes and supporting functions are cached through closure
          return function (date, mask, utc, gmt) {
      
            // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
            if (arguments.length === 1 && kindOf(date) === 'string' && !/\d/.test(date)) {
              mask = date;
              date = undefined;
            }
      
            date = date || new Date;
      
            if(!(date instanceof Date)) {
              date = new Date(date);
            }
      
            if (isNaN(date)) {
              throw TypeError('Invalid date');
            }
      
            mask = String(dateFormat.masks[mask] || mask || dateFormat.masks['default']);
      
            // Allow setting the utc/gmt argument via the mask
            var maskSlice = mask.slice(0, 4);
            if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
              mask = mask.slice(4);
              utc = true;
              if (maskSlice === 'GMT:') {
                gmt = true;
              }
            }
      
            var _ = utc ? 'getUTC' : 'get';
            var d = date[_ + 'Date']();
            var D = date[_ + 'Day']();
            var m = date[_ + 'Month']();
            var y = date[_ + 'FullYear']();
            var H = date[_ + 'Hours']();
            var M = date[_ + 'Minutes']();
            var s = date[_ + 'Seconds']();
            var L = date[_ + 'Milliseconds']();
            var o = utc ? 0 : date.getTimezoneOffset();
            var W = getWeek(date);
            var N = getDayOfWeek(date);
            var flags = {
              d:    d,
              dd:   pad(d),
              ddd:  dateFormat.i18n.dayNames[D],
              dddd: dateFormat.i18n.dayNames[D + 7],
              m:    m + 1,
              mm:   pad(m + 1),
              mmm:  dateFormat.i18n.monthNames[m],
              mmmm: dateFormat.i18n.monthNames[m + 12],
              yy:   String(y).slice(2),
              yyyy: y,
              h:    H % 12 || 12,
              hh:   pad(H % 12 || 12),
              H:    H,
              HH:   pad(H),
              M:    M,
              MM:   pad(M),
              s:    s,
              ss:   pad(s),
              l:    pad(L, 3),
              L:    pad(Math.round(L / 10)),
              t:    H < 12 ? dateFormat.i18n.timeNames[0] : dateFormat.i18n.timeNames[1],
              tt:   H < 12 ? dateFormat.i18n.timeNames[2] : dateFormat.i18n.timeNames[3],
              T:    H < 12 ? dateFormat.i18n.timeNames[4] : dateFormat.i18n.timeNames[5],
              TT:   H < 12 ? dateFormat.i18n.timeNames[6] : dateFormat.i18n.timeNames[7],
              Z:    gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
              o:    (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
              S:    ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
              W:    W,
              N:    N
            };
      
            return mask.replace(token, function (match) {
              if (match in flags) {
                return flags[match];
              }
              return match.slice(1, match.length - 1);
            });
          };
        })();

      dateFormat.masks = {
        'default':               'ddd mmm dd yyyy HH:MM:ss',
        'shortDate':             'm/d/yy',
        'mediumDate':            'mmm d, yyyy',
        'longDate':              'mmmm d, yyyy',
        'fullDate':              'dddd, mmmm d, yyyy',
        'shortTime':             'h:MM TT',
        'mediumTime':            'h:MM:ss TT',
        'longTime':              'h:MM:ss TT Z',
        'isoDate':               'yyyy-mm-dd',
        'isoTime':               'HH:MM:ss',
        'isoDateTime':           'yyyy-mm-dd\'T\'HH:MM:sso',
        'isoUtcDateTime':        'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
        'expiresHeaderFormat':   'ddd, dd mmm yyyy HH:MM:ss Z'
      };

      // Internationalization strings
      dateFormat.i18n = {
        dayNames: [
          'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ],
        monthNames: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ],
        timeNames: [
          'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
        ]
      };

    function pad(val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) {
        val = '0' + val;
      }
      return val;
    }

    /**
     * Get the ISO 8601 week number
     * Based on comments from
     * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
     *
     * @param  {Object} `date`
     * @return {Number}
     */
    function getWeek(date) {
      // Remove time components of date
      var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // Change date to Thursday same week
      targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

      // Take January 4th as it is always in week 1 (see ISO 8601)
      var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

      // Change date to Thursday same week
      firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

      // Check if daylight-saving-time-switch occurred and correct for it
      var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
      targetThursday.setHours(targetThursday.getHours() - ds);

      // Number of weeks between target Thursday and first Thursday
      var weekDiff = (targetThursday - firstThursday) / (86400000*7);
      return 1 + Math.floor(weekDiff);
    }

    /**
     * Get ISO-8601 numeric representation of the day of the week
     * 1 (for Monday) through 7 (for Sunday)
     * 
     * @param  {Object} `date`
     * @return {Number}
     */
    function getDayOfWeek(date) {
      var dow = date.getDay();
      if(dow === 0) {
        dow = 7;
      }
      return dow;
    }

    /**
     * kind-of shortcut
     * @param  {*} val
     * @return {String}
     */
    function kindOf(val) {
      if (val === null) {
        return 'null';
      }

      if (val === undefined) {
        return 'undefined';
      }

      if (typeof val !== 'object') {
        return typeof val;
      }

      if (Array.isArray(val)) {
        return 'array';
      }

      return {}.toString.call(val)
        .slice(8, -1).toLowerCase();
    }


      if (false) {} else {
        module.exports = dateFormat;
      }
    })(commonjsGlobal);
    });

    /*!
     * repeat-string <https://github.com/jonschlinkert/repeat-string>
     *
     * Copyright (c) 2014-2015, Jon Schlinkert.
     * Licensed under the MIT License.
     */

    /**
     * Results cache
     */

    var res = '';
    var cache;

    /**
     * Expose `repeat`
     */

    var repeatString = repeat;

    /**
     * Repeat the given `string` the specified `number`
     * of times.
     *
     * **Example:**
     *
     * ```js
     * var repeat = require('repeat-string');
     * repeat('A', 5);
     * //=> AAAAA
     * ```
     *
     * @param {String} `string` The string to repeat
     * @param {Number} `number` The number of times to repeat the string
     * @return {String} Repeated string
     * @api public
     */

    function repeat(str, num) {
      if (typeof str !== 'string') {
        throw new TypeError('expected a string');
      }

      // cover common, quick use cases
      if (num === 1) return str;
      if (num === 2) return str + str;

      var max = str.length * num;
      if (cache !== str || typeof cache === 'undefined') {
        cache = str;
        res = '';
      } else if (res.length >= max) {
        return res.substr(0, max);
      }

      while (max > res.length && num > 1) {
        if (num & 1) {
          res += str;
        }

        num >>= 1;
        str += str;
      }

      res += str;
      res = res.substr(0, max);
      return res;
    }

    var padLeft = function padLeft(str, num, ch) {
      str = str.toString();

      if (typeof num === 'undefined') {
        return str;
      }

      if (ch === 0) {
        ch = '0';
      } else if (ch) {
        ch = ch.toString();
      } else {
        ch = ' ';
      }

      return repeatString(ch, num - str.length) + str;
    };

    var noop = function () {};
    var link;
    var supportedEncodings = ['image/png','image/jpeg','image/webp'];
    function exportCanvas(canvas, opt) {
        if ( opt === void 0 ) opt = {};

        var encoding = opt.encoding || 'image/png';
        if (!supportedEncodings.includes(encoding)) 
            { throw new Error(("Invalid canvas encoding " + encoding)); }
        var extension = (encoding.split('/')[1] || '').replace(/jpeg/i, 'jpg');
        if (extension) 
            { extension = ("." + extension).toLowerCase(); }
        return {
            extension: extension,
            type: encoding,
            dataURL: canvas.toDataURL(encoding, opt.encodingQuality)
        };
    }

    function createBlobFromDataURL(dataURL) {
        return new Promise(function (resolve) {
            var splitIndex = dataURL.indexOf(',');
            if (splitIndex === -1) {
                resolve(new window.Blob());
                return;
            }
            var base64 = dataURL.slice(splitIndex + 1);
            var byteString = window.atob(base64);
            var mimeMatch = /data:([^;+]);/.exec(dataURL);
            var mime = (mimeMatch ? mimeMatch[1] : '') || undefined;
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0;i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            resolve(new window.Blob([ab], {
                type: mime
            }));
        });
    }

    function saveDataURL(dataURL, opts) {
        if ( opts === void 0 ) opts = {};

        return createBlobFromDataURL(dataURL).then(function (blob) { return saveBlob(blob, opts); });
    }

    function saveBlob(blob, opts) {
        if ( opts === void 0 ) opts = {};

        return new Promise(function (resolve) {
            opts = objectAssign({
                extension: '',
                prefix: '',
                suffix: ''
            }, opts);
            var filename = resolveFilename(opts);
            var client = getClientAPI();
            if (client && typeof client.saveBlob === 'function' && client.output) {
                return client.saveBlob(blob, objectAssign({}, opts, {
                    filename: filename
                })).then(function (ev) { return resolve(ev); });
            } else {
                if (!link) {
                    link = document.createElement('a');
                    link.style.visibility = 'hidden';
                    link.target = '_blank';
                }
                link.download = filename;
                link.href = window.URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.onclick = (function () {
                    link.onclick = noop;
                    setTimeout(function () {
                        window.URL.revokeObjectURL(blob);
                        document.body.removeChild(link);
                        link.removeAttribute('href');
                        resolve({
                            filename: filename,
                            client: false
                        });
                    });
                });
                link.click();
            }
        });
    }

    function saveFile(data, opts) {
        if ( opts === void 0 ) opts = {};

        var parts = Array.isArray(data) ? data : [data];
        var blob = new window.Blob(parts, {
            type: opts.type || ''
        });
        return saveBlob(blob, opts);
    }

    function getFileName() {
        var dateFormatStr = "yyyy.mm.dd-HH.MM.ss";
        return dateformat(new Date(), dateFormatStr);
    }

    function resolveFilename(opt) {
        if ( opt === void 0 ) opt = {};

        opt = objectAssign({}, opt);
        if (typeof opt.file === 'function') {
            return opt.file(opt);
        } else if (opt.file) {
            return opt.file;
        }
        var frame = null;
        var extension = '';
        if (typeof opt.extension === 'string') 
            { extension = opt.extension; }
        if (typeof opt.frame === 'number') {
            var totalFrames;
            if (typeof opt.totalFrames === 'number') {
                totalFrames = opt.totalFrames;
            } else {
                totalFrames = Math.max(1000, opt.frame);
            }
            frame = padLeft(String(opt.frame), String(totalFrames).length, '0');
        }
        var layerStr = isFinite(opt.totalLayers) && isFinite(opt.layer) && opt.totalLayers > 1 ? ("" + (opt.layer)) : '';
        if (frame != null) {
            return [layerStr,frame].filter(Boolean).join('-') + extension;
        } else {
            var defaultFileName = opt.timeStamp;
            return [opt.prefix,opt.name || defaultFileName,layerStr,opt.hash,opt.suffix].filter(Boolean).join('-') + extension;
        }
    }

    function keyboardShortcuts (opt) {
        if ( opt === void 0 ) opt = {};

        var handler = function (ev) {
            if (!opt.enabled()) 
                { return; }
            var client = getClientAPI();
            if (ev.keyCode === 83 && !ev.altKey && (ev.metaKey || ev.ctrlKey)) {
                ev.preventDefault();
                opt.save(ev);
            } else if (ev.keyCode === 32) {
                opt.togglePlay(ev);
            } else if (client && !ev.altKey && ev.keyCode === 75 && (ev.metaKey || ev.ctrlKey)) {
                ev.preventDefault();
                opt.commit(ev);
            }
        };
        var attach = function () {
            window.addEventListener('keydown', handler);
        };
        var detach = function () {
            window.removeEventListener('keydown', handler);
        };
        return {
            attach: attach,
            detach: detach
        };
    }

    var defaultUnits = 'mm';
    var data = [['postcard',101.6,152.4],['poster-small',280,430],['poster',460,610],
        ['poster-large',610,910],['business-card',50.8,88.9],['a0',841,1189],['a1',594,
        841],['a2',420,594],['a3',297,420],['a4',210,297],['a5',148,210],['a6',105,148],
        ['a7',74,105],['a8',52,74],['a9',37,52],['a10',26,37],['2a0',1189,1682],['4a0',
        1682,2378],['b0',1000,1414],['b1',707,1000],['b1+',720,1020],['b2',500,707],['b2+',
        520,720],['b3',353,500],['b4',250,353],['b5',176,250],['b6',125,176],['b7',88,
        125],['b8',62,88],['b9',44,62],['b10',31,44],['b11',22,32],['b12',16,22],['c0',
        917,1297],['c1',648,917],['c2',458,648],['c3',324,458],['c4',229,324],['c5',162,
        229],['c6',114,162],['c7',81,114],['c8',57,81],['c9',40,57],['c10',28,40],['c11',
        22,32],['c12',16,22],['half-letter',5.5,8.5,'in'],['letter',8.5,11,'in'],['legal',
        8.5,14,'in'],['junior-legal',5,8,'in'],['ledger',11,17,'in'],['tabloid',11,17,
        'in'],['ansi-a',8.5,11.0,'in'],['ansi-b',11.0,17.0,'in'],['ansi-c',17.0,22.0,
        'in'],['ansi-d',22.0,34.0,'in'],['ansi-e',34.0,44.0,'in'],['arch-a',9,12,'in'],
        ['arch-b',12,18,'in'],['arch-c',18,24,'in'],['arch-d',24,36,'in'],['arch-e',36,
        48,'in'],['arch-e1',30,42,'in'],['arch-e2',26,38,'in'],['arch-e3',27,39,'in']];
    var paperSizes = data.reduce(function (dict, preset) {
        var item = {
            units: preset[3] || defaultUnits,
            dimensions: [preset[1],preset[2]]
        };
        dict[preset[0]] = item;
        dict[preset[0].replace(/-/g, ' ')] = item;
        return dict;
    }, {})

    function getDimensionsFromPreset(dimensions, unitsTo, pixelsPerInch) {
        if ( unitsTo === void 0 ) unitsTo = 'px';
        if ( pixelsPerInch === void 0 ) pixelsPerInch = 72;

        if (typeof dimensions === 'string') {
            var key = dimensions.toLowerCase();
            if (!(key in paperSizes)) {
                throw new Error(("The dimension preset \"" + dimensions + "\" is not supported or could not be found; try using a4, a3, postcard, letter, etc."));
            }
            var preset = paperSizes[key];
            return preset.dimensions.map(function (d) { return convertDistance(d, preset.units, unitsTo, pixelsPerInch); });
        } else {
            return dimensions;
        }
    }

    function convertDistance(dimension, unitsFrom, unitsTo, pixelsPerInch) {
        if ( unitsFrom === void 0 ) unitsFrom = 'px';
        if ( unitsTo === void 0 ) unitsTo = 'px';
        if ( pixelsPerInch === void 0 ) pixelsPerInch = 72;

        return convertLength(dimension, unitsFrom, unitsTo, {
            pixelsPerInch: pixelsPerInch,
            precision: 4,
            roundPixel: true
        });
    }

    function checkIfHasDimensions(settings) {
        if (!settings.dimensions) 
            { return false; }
        if (typeof settings.dimensions === 'string') 
            { return true; }
        if (Array.isArray(settings.dimensions) && settings.dimensions.length >= 2) 
            { return true; }
        return false;
    }

    function getParentSize(props, settings) {
        if (!isBrowser) {
            return [300,150];
        }
        var element = settings.parent || window;
        if (element === window || element === document || element === document.body) {
            return [window.innerWidth,window.innerHeight];
        } else {
            var ref = element.getBoundingClientRect();
            var width = ref.width;
            var height = ref.height;
            return [width,height];
        }
    }

    function resizeCanvas(props, settings) {
        var width, height;
        var styleWidth, styleHeight;
        var canvasWidth, canvasHeight;
        var dimensions = settings.dimensions;
        var hasDimensions = checkIfHasDimensions(settings);
        var exporting = props.exporting;
        var scaleToFit = hasDimensions ? settings.scaleToFit !== false : false;
        var scaleToView = !exporting && hasDimensions ? settings.scaleToView : true;
        var units = settings.units;
        var pixelsPerInch = typeof settings.pixelsPerInch === 'number' && isFinite(settings.pixelsPerInch) ? settings.pixelsPerInch : 72;
        var bleed = defined(settings.bleed, 0);
        var devicePixelRatio = isBrowser() ? window.devicePixelRatio : 1;
        var basePixelRatio = scaleToView ? devicePixelRatio : 1;
        var pixelRatio, exportPixelRatio;
        if (typeof settings.pixelRatio === 'number' && isFinite(settings.pixelRatio)) {
            pixelRatio = settings.pixelRatio;
            exportPixelRatio = defined(settings.exportPixelRatio, pixelRatio);
        } else {
            if (hasDimensions) {
                pixelRatio = basePixelRatio;
                exportPixelRatio = defined(settings.exportPixelRatio, 1);
            } else {
                pixelRatio = devicePixelRatio;
                exportPixelRatio = defined(settings.exportPixelRatio, pixelRatio);
            }
        }
        if (typeof settings.maxPixelRatio === 'number' && isFinite(settings.maxPixelRatio)) {
            pixelRatio = Math.min(settings.maxPixelRatio, pixelRatio);
            exportPixelRatio = Math.min(settings.maxPixelRatio, exportPixelRatio);
        }
        if (exporting) {
            pixelRatio = exportPixelRatio;
        }
        var ref = getParentSize(props, settings);
        var parentWidth = ref[0];
        var parentHeight = ref[1];
        var trimWidth, trimHeight;
        if (hasDimensions) {
            var result = getDimensionsFromPreset(dimensions, units, pixelsPerInch);
            var highest = Math.max(result[0], result[1]);
            var lowest = Math.min(result[0], result[1]);
            if (settings.orientation) {
                var landscape = settings.orientation === 'landscape';
                width = landscape ? highest : lowest;
                height = landscape ? lowest : highest;
            } else {
                width = result[0];
                height = result[1];
            }
            trimWidth = width;
            trimHeight = height;
            width += bleed * 2;
            height += bleed * 2;
        } else {
            width = parentWidth;
            height = parentHeight;
            trimWidth = width;
            trimHeight = height;
        }
        var realWidth = width;
        var realHeight = height;
        if (hasDimensions && units) {
            realWidth = convertDistance(width, units, 'px', pixelsPerInch);
            realHeight = convertDistance(height, units, 'px', pixelsPerInch);
        }
        styleWidth = Math.round(realWidth);
        styleHeight = Math.round(realHeight);
        if (scaleToFit && !exporting && hasDimensions) {
            var aspect = width / height;
            var windowAspect = parentWidth / parentHeight;
            var scaleToFitPadding = defined(settings.scaleToFitPadding, 40);
            var maxWidth = Math.round(parentWidth - scaleToFitPadding * 2);
            var maxHeight = Math.round(parentHeight - scaleToFitPadding * 2);
            if (styleWidth > maxWidth || styleHeight > maxHeight) {
                if (windowAspect > aspect) {
                    styleHeight = maxHeight;
                    styleWidth = Math.round(styleHeight * aspect);
                } else {
                    styleWidth = maxWidth;
                    styleHeight = Math.round(styleWidth / aspect);
                }
            }
        }
        canvasWidth = scaleToView ? Math.round(pixelRatio * styleWidth) : Math.round(exportPixelRatio * realWidth);
        canvasHeight = scaleToView ? Math.round(pixelRatio * styleHeight) : Math.round(exportPixelRatio * realHeight);
        var viewportWidth = scaleToView ? Math.round(styleWidth) : Math.round(realWidth);
        var viewportHeight = scaleToView ? Math.round(styleHeight) : Math.round(realHeight);
        var scaleX = canvasWidth / width;
        var scaleY = canvasHeight / height;
        return {
            bleed: bleed,
            pixelRatio: pixelRatio,
            width: width,
            height: height,
            dimensions: [width,height],
            units: units || 'px',
            scaleX: scaleX,
            scaleY: scaleY,
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight,
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,
            trimWidth: trimWidth,
            trimHeight: trimHeight,
            styleWidth: styleWidth,
            styleHeight: styleHeight
        };
    }

    var getCanvasContext_1 = getCanvasContext;
    function getCanvasContext (type, opts) {
      if (typeof type !== 'string') {
        throw new TypeError('must specify type string')
      }

      opts = opts || {};

      if (typeof document === 'undefined' && !opts.canvas) {
        return null // check for Node
      }

      var canvas = opts.canvas || document.createElement('canvas');
      if (typeof opts.width === 'number') {
        canvas.width = opts.width;
      }
      if (typeof opts.height === 'number') {
        canvas.height = opts.height;
      }

      var attribs = opts;
      var gl;
      try {
        var names = [ type ];
        // prefix GL contexts
        if (type.indexOf('webgl') === 0) {
          names.push('experimental-' + type);
        }

        for (var i = 0; i < names.length; i++) {
          gl = canvas.getContext(names[i], attribs);
          if (gl) return gl
        }
      } catch (e) {
        gl = null;
      }
      return (gl || null) // ensure null on fail
    }

    function createCanvasElement() {
        if (!isBrowser()) {
            throw new Error('It appears you are runing from Node.js or a non-browser environment. Try passing in an existing { canvas } interface instead.');
        }
        return document.createElement('canvas');
    }

    function createCanvas(settings) {
        if ( settings === void 0 ) settings = {};

        var context, canvas;
        var ownsCanvas = false;
        if (settings.canvas !== false) {
            context = settings.context;
            if (!context || typeof context === 'string') {
                var newCanvas = settings.canvas;
                if (!newCanvas) {
                    newCanvas = createCanvasElement();
                    ownsCanvas = true;
                }
                var type = context || '2d';
                if (typeof newCanvas.getContext !== 'function') {
                    throw new Error("The specified { canvas } element does not have a getContext() function, maybe it is not a <canvas> tag?");
                }
                context = getCanvasContext_1(type, objectAssign({}, settings.attributes, {
                    canvas: newCanvas
                }));
                if (!context) {
                    throw new Error(("Failed at canvas.getContext('" + type + "') - the browser may not support this context, or a different context may already be in use with this canvas."));
                }
            }
            canvas = context.canvas;
            if (settings.canvas && canvas !== settings.canvas) {
                throw new Error('The { canvas } and { context } settings must point to the same underlying canvas element');
            }
            if (settings.pixelated) {
                context.imageSmoothingEnabled = false;
                context.mozImageSmoothingEnabled = false;
                context.oImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                canvas.style['image-rendering'] = 'pixelated';
            }
        }
        return {
            canvas: canvas,
            context: context,
            ownsCanvas: ownsCanvas
        };
    }

    var SketchManager = function SketchManager() {
        var this$1 = this;

        this._settings = {};
        this._props = {};
        this._sketch = undefined;
        this._raf = null;
        this._lastRedrawResult = undefined;
        this._isP5Resizing = false;
        this._keyboardShortcuts = keyboardShortcuts({
            enabled: function () { return this$1.settings.hotkeys !== false; },
            save: function (ev) {
                if (ev.shiftKey) {
                    if (this$1.props.recording) {
                        this$1.endRecord();
                        this$1.run();
                    } else 
                        { this$1.record(); }
                } else 
                    { this$1.exportFrame(); }
            },
            togglePlay: function () {
                if (this$1.props.playing) 
                    { this$1.pause(); }
                 else 
                    { this$1.play(); }
            },
            commit: function (ev) {
                this$1.exportFrame({
                    commit: true
                });
            }
        });
        this._animateHandler = (function () { return this$1.animate(); });
        this._resizeHandler = (function () {
            var changed = this$1.resize();
            if (changed) {
                this$1.render();
            }
        });
    };

    var prototypeAccessors = { sketch: { configurable: true },settings: { configurable: true },props: { configurable: true } };
    prototypeAccessors.sketch.get = function () {
        return this._sketch;
    };
    prototypeAccessors.settings.get = function () {
        return this._settings;
    };
    prototypeAccessors.props.get = function () {
        return this._props;
    };
    SketchManager.prototype._computePlayhead = function _computePlayhead (currentTime, duration) {
        var hasDuration = typeof duration === 'number' && isFinite(duration);
        return hasDuration ? currentTime / duration : 0;
    };
    SketchManager.prototype._computeFrame = function _computeFrame (playhead, time, totalFrames, fps) {
        return isFinite(totalFrames) && totalFrames > 1 ? Math.floor(playhead * (totalFrames - 1)) : Math.floor(fps * time);
    };
    SketchManager.prototype._computeCurrentFrame = function _computeCurrentFrame () {
        return this._computeFrame(this.props.playhead, this.props.time, this.props.totalFrames, this.props.fps);
    };
    SketchManager.prototype._getSizeProps = function _getSizeProps () {
        var props = this.props;
        return {
            width: props.width,
            height: props.height,
            pixelRatio: props.pixelRatio,
            canvasWidth: props.canvasWidth,
            canvasHeight: props.canvasHeight,
            viewportWidth: props.viewportWidth,
            viewportHeight: props.viewportHeight
        };
    };
    SketchManager.prototype.run = function run () {
        if (!this.sketch) 
            { throw new Error('should wait until sketch is loaded before trying to play()'); }
        if (this.settings.playing !== false) {
            this.play();
        }
        if (typeof this.sketch.dispose === 'function') {
            console.warn('In canvas-sketch@0.0.23 the dispose() event has been renamed to unload()');
        }
        if (!this.props.started) {
            this._signalBegin();
            this.props.started = true;
        }
        this.tick();
        this.render();
        return this;
    };
    SketchManager.prototype.play = function play () {
        var animate = this.settings.animate;
        if ('animation' in this.settings) {
            animate = true;
            console.warn('[canvas-sketch] { animation } has been renamed to { animate }');
        }
        if (!animate) 
            { return; }
        if (!isBrowser()) {
            console.error('[canvas-sketch] WARN: Using { animate } in Node.js is not yet supported');
            return;
        }
        if (this.props.playing) 
            { return; }
        if (!this.props.started) {
            this._signalBegin();
            this.props.started = true;
        }
        this.props.playing = true;
        if (this._raf != null) 
            { window.cancelAnimationFrame(this._raf); }
        this._lastTime = browser();
        this._raf = window.requestAnimationFrame(this._animateHandler);
    };
    SketchManager.prototype.pause = function pause () {
        if (this.props.recording) 
            { this.endRecord(); }
        this.props.playing = false;
        if (this._raf != null && isBrowser()) {
            window.cancelAnimationFrame(this._raf);
        }
    };
    SketchManager.prototype.togglePlay = function togglePlay () {
        if (this.props.playing) 
            { this.pause(); }
         else 
            { this.play(); }
    };
    SketchManager.prototype.stop = function stop () {
        this.pause();
        this.props.frame = 0;
        this.props.playhead = 0;
        this.props.time = 0;
        this.props.deltaTime = 0;
        this.props.started = false;
        this.render();
    };
    SketchManager.prototype.record = function record () {
            var this$1 = this;

        if (this.props.recording) 
            { return; }
        if (!isBrowser()) {
            console.error('[canvas-sketch] WARN: Recording from Node.js is not yet supported');
            return;
        }
        this.stop();
        this.props.playing = true;
        this.props.recording = true;
        var frameInterval = 1 / this.props.fps;
        if (this._raf != null) 
            { window.cancelAnimationFrame(this._raf); }
        var tick = function () {
            if (!this$1.props.recording) 
                { return Promise.resolve(); }
            this$1.props.deltaTime = frameInterval;
            this$1.tick();
            return this$1.exportFrame({
                sequence: true
            }).then(function () {
                if (!this$1.props.recording) 
                    { return; }
                this$1.props.deltaTime = 0;
                this$1.props.frame++;
                if (this$1.props.frame < this$1.props.totalFrames) {
                    this$1.props.time += frameInterval;
                    this$1.props.playhead = this$1._computePlayhead(this$1.props.time, this$1.props.duration);
                    this$1._raf = window.requestAnimationFrame(tick);
                } else {
                    console.log('Finished recording');
                    this$1._signalEnd();
                    this$1.endRecord();
                    this$1.stop();
                    this$1.run();
                }
            });
        };
        if (!this.props.started) {
            this._signalBegin();
            this.props.started = true;
        }
        this._raf = window.requestAnimationFrame(tick);
    };
    SketchManager.prototype._signalBegin = function _signalBegin () {
            var this$1 = this;

        if (this.sketch && typeof this.sketch.begin === 'function') {
            this._wrapContextScale(function (props) { return this$1.sketch.begin(props); });
        }
    };
    SketchManager.prototype._signalEnd = function _signalEnd () {
            var this$1 = this;

        if (this.sketch && typeof this.sketch.end === 'function') {
            this._wrapContextScale(function (props) { return this$1.sketch.end(props); });
        }
    };
    SketchManager.prototype.endRecord = function endRecord () {
        if (this._raf != null && isBrowser()) 
            { window.cancelAnimationFrame(this._raf); }
        this.props.recording = false;
        this.props.deltaTime = 0;
        this.props.playing = false;
    };
    SketchManager.prototype.exportFrame = function exportFrame (opt) {
            var this$1 = this;
            if ( opt === void 0 ) opt = {};

        if (!this.sketch) 
            { return Promise.all([]); }
        if (typeof this.sketch.preExport === 'function') {
            this.sketch.preExport();
        }
        var exportOpts = objectAssign({
            sequence: opt.sequence,
            frame: opt.sequence ? this.props.frame : undefined,
            file: this.settings.file,
            name: this.settings.name,
            prefix: this.settings.prefix,
            suffix: this.settings.suffix,
            encoding: this.settings.encoding,
            encodingQuality: this.settings.encodingQuality,
            timeStamp: getFileName(),
            totalFrames: isFinite(this.props.totalFrames) ? Math.max(100, this.props.totalFrames) : 1000
        });
        var client = getClientAPI();
        var p = Promise.resolve();
        if (client && opt.commit && typeof client.commit === 'function') {
            var commitOpts = objectAssign({}, exportOpts);
            var hash = client.commit(commitOpts);
            if (isPromise_1(hash)) 
                { p = hash; }
             else 
                { p = Promise.resolve(hash); }
        }
        return p.then(function (hash) { return this$1._doExportFrame(objectAssign({}, exportOpts, {
            hash: hash || ''
        })); });
    };
    SketchManager.prototype._doExportFrame = function _doExportFrame (exportOpts) {
            var this$1 = this;
            if ( exportOpts === void 0 ) exportOpts = {};

        this._props.exporting = true;
        this.resize();
        var drawResult = this.render();
        var canvas = this.props.canvas;
        if (typeof drawResult === 'undefined') {
            drawResult = [canvas];
        }
        drawResult = [].concat(drawResult).filter(Boolean);
        drawResult = drawResult.map(function (result) {
            var hasDataObject = typeof result === 'object' && result && ('data' in result || 'dataURL' in result);
            var data = hasDataObject ? result.data : result;
            var opts = hasDataObject ? objectAssign({}, result, {
                data: data
            }) : {
                data: data
            };
            if (isCanvas(data)) {
                var encoding = opts.encoding || exportOpts.encoding;
                var encodingQuality = defined(opts.encodingQuality, exportOpts.encodingQuality, 0.95);
                var ref = exportCanvas(data, {
                    encoding: encoding,
                    encodingQuality: encodingQuality
                });
                    var dataURL = ref.dataURL;
                    var extension = ref.extension;
                    var type = ref.type;
                return Object.assign(opts, {
                    dataURL: dataURL,
                    extension: extension,
                    type: type
                });
            } else {
                return opts;
            }
        });
        this._props.exporting = false;
        this.resize();
        this.render();
        return Promise.all(drawResult.map(function (result, i, layerList) {
            var curOpt = objectAssign({}, exportOpts, result, {
                layer: i,
                totalLayers: layerList.length
            });
            var data = result.data;
            if (result.dataURL) {
                var dataURL = result.dataURL;
                delete curOpt.dataURL;
                return saveDataURL(dataURL, curOpt);
            } else {
                return saveFile(data, curOpt);
            }
        })).then(function (ev) {
            if (ev.length > 0) {
                var eventWithOutput = ev.find(function (e) { return e.outputName; });
                var isClient = ev.some(function (e) { return e.client; });
                var item;
                if (ev.length > 1) 
                    { item = ev.length; }
                 else if (eventWithOutput) 
                    { item = (eventWithOutput.outputName) + "/" + (ev[0].filename); }
                 else 
                    { item = "" + (ev[0].filename); }
                var ofSeq = '';
                if (exportOpts.sequence) {
                    var hasTotalFrames = isFinite(this$1.props.totalFrames);
                    ofSeq = hasTotalFrames ? (" (frame " + (exportOpts.frame + 1) + " / " + (this$1.props.totalFrames) + ")") : (" (frame " + (exportOpts.frame) + ")");
                } else if (ev.length > 1) {
                    ofSeq = " files";
                }
                var client = isClient ? 'canvas-sketch-cli' : 'canvas-sketch';
                console.log(("%c[" + client + "]%c Exported %c" + item + "%c" + ofSeq), 'color: #8e8e8e;', 'color: initial;', 'font-weight: bold;', 'font-weight: initial;');
            }
            if (typeof this$1.sketch.postExport === 'function') {
                this$1.sketch.postExport();
            }
        });
    };
    SketchManager.prototype._wrapContextScale = function _wrapContextScale (cb) {
        this._preRender();
        cb(this.props);
        this._postRender();
    };
    SketchManager.prototype._preRender = function _preRender () {
        var props = this.props;
        if (!this.props.gl && props.context && !props.p5) {
            props.context.save();
            if (this.settings.scaleContext !== false) {
                props.context.scale(props.scaleX, props.scaleY);
            }
        } else if (props.p5) {
            props.p5.scale(props.scaleX / props.pixelRatio, props.scaleY / props.pixelRatio);
        }
    };
    SketchManager.prototype._postRender = function _postRender () {
        var props = this.props;
        if (!this.props.gl && props.context && !props.p5) {
            props.context.restore();
        }
        if (props.gl && this.settings.flush !== false && !props.p5) {
            props.gl.flush();
        }
    };
    SketchManager.prototype.tick = function tick () {
        if (this.sketch && typeof this.sketch.tick === 'function') {
            this._preRender();
            this.sketch.tick(this.props);
            this._postRender();
        }
    };
    SketchManager.prototype.render = function render () {
        if (this.props.p5) {
            this._lastRedrawResult = undefined;
            this.props.p5.redraw();
            return this._lastRedrawResult;
        } else {
            return this.submitDrawCall();
        }
    };
    SketchManager.prototype.submitDrawCall = function submitDrawCall () {
        if (!this.sketch) 
            { return; }
        var props = this.props;
        this._preRender();
        var drawResult;
        if (typeof this.sketch === 'function') {
            drawResult = this.sketch(props);
        } else if (typeof this.sketch.render === 'function') {
            drawResult = this.sketch.render(props);
        }
        this._postRender();
        return drawResult;
    };
    SketchManager.prototype.update = function update (opt) {
            var this$1 = this;
            if ( opt === void 0 ) opt = {};

        var notYetSupported = ['animate'];
        Object.keys(opt).forEach(function (key) {
            if (notYetSupported.indexOf(key) >= 0) {
                throw new Error(("Sorry, the { " + key + " } option is not yet supported with update()."));
            }
        });
        var oldCanvas = this._settings.canvas;
        var oldContext = this._settings.context;
        for (var key in opt) {
            var value = opt[key];
            if (typeof value !== 'undefined') {
                this$1._settings[key] = value;
            }
        }
        var timeOpts = Object.assign({}, this._settings, opt);
        if ('time' in opt && 'frame' in opt) 
            { throw new Error('You should specify { time } or { frame } but not both'); }
         else if ('time' in opt) 
            { delete timeOpts.frame; }
         else if ('frame' in opt) 
            { delete timeOpts.time; }
        if ('duration' in opt && 'totalFrames' in opt) 
            { throw new Error('You should specify { duration } or { totalFrames } but not both'); }
         else if ('duration' in opt) 
            { delete timeOpts.totalFrames; }
         else if ('totalFrames' in opt) 
            { delete timeOpts.duration; }
        var timeProps = this.getTimeProps(timeOpts);
        Object.assign(this._props, timeProps);
        if (oldCanvas !== this._settings.canvas || oldContext !== this._settings.context) {
            var ref = createCanvas(this._settings);
                var canvas = ref.canvas;
                var context = ref.context;
            this.props.canvas = canvas;
            this.props.context = context;
            this._setupGLKey();
            this._appendCanvasIfNeeded();
        }
        if (opt.p5 && typeof opt.p5 !== 'function') {
            this.props.p5 = opt.p5;
            this.props.p5.draw = (function () {
                if (this$1._isP5Resizing) 
                    { return; }
                this$1._lastRedrawResult = this$1.submitDrawCall();
            });
        }
        if ('playing' in opt) {
            if (opt.playing) 
                { this.play(); }
             else 
                { this.pause(); }
        }
        this.resize();
        this.render();
        return this.props;
    };
    SketchManager.prototype.resize = function resize () {
        var oldSizes = this._getSizeProps();
        var settings = this.settings;
        var props = this.props;
        var newProps = resizeCanvas(props, settings);
        Object.assign(this._props, newProps);
        var ref = this.props;
            var pixelRatio = ref.pixelRatio;
            var canvasWidth = ref.canvasWidth;
            var canvasHeight = ref.canvasHeight;
            var styleWidth = ref.styleWidth;
            var styleHeight = ref.styleHeight;
        var canvas = this.props.canvas;
        if (canvas && settings.resizeCanvas !== false) {
            if (props.p5) {
                if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
                    this._isP5Resizing = true;
                    props.p5.pixelDensity(pixelRatio);
                    props.p5.resizeCanvas(canvasWidth / pixelRatio, canvasHeight / pixelRatio, false);
                    this._isP5Resizing = false;
                }
            } else {
                if (canvas.width !== canvasWidth) 
                    { canvas.width = canvasWidth; }
                if (canvas.height !== canvasHeight) 
                    { canvas.height = canvasHeight; }
            }
            if (isBrowser() && settings.styleCanvas !== false) {
                canvas.style.width = styleWidth + "px";
                canvas.style.height = styleHeight + "px";
            }
        }
        var newSizes = this._getSizeProps();
        var changed = !deepEqual_1(oldSizes, newSizes);
        if (changed) {
            this._sizeChanged();
        }
        return changed;
    };
    SketchManager.prototype._sizeChanged = function _sizeChanged () {
        if (this.sketch && typeof this.sketch.resize === 'function') {
            this.sketch.resize(this.props);
        }
    };
    SketchManager.prototype.animate = function animate () {
        if (!this.props.playing) 
            { return; }
        if (!isBrowser()) {
            console.error('[canvas-sketch] WARN: Animation in Node.js is not yet supported');
            return;
        }
        this._raf = window.requestAnimationFrame(this._animateHandler);
        var now = browser();
        var fps = this.props.fps;
        var frameIntervalMS = 1000 / fps;
        var deltaTimeMS = now - this._lastTime;
        var duration = this.props.duration;
        var hasDuration = typeof duration === 'number' && isFinite(duration);
        var isNewFrame = true;
        var playbackRate = this.settings.playbackRate;
        if (playbackRate === 'fixed') {
            deltaTimeMS = frameIntervalMS;
        } else if (playbackRate === 'throttle') {
            if (deltaTimeMS > frameIntervalMS) {
                now = now - deltaTimeMS % frameIntervalMS;
                this._lastTime = now;
            } else {
                isNewFrame = false;
            }
        } else {
            this._lastTime = now;
        }
        var deltaTime = deltaTimeMS / 1000;
        var newTime = this.props.time + deltaTime * this.props.timeScale;
        if (newTime < 0 && hasDuration) {
            newTime = duration + newTime;
        }
        var isFinished = false;
        var isLoopStart = false;
        var looping = this.settings.loop !== false;
        if (hasDuration && newTime >= duration) {
            if (looping) {
                isNewFrame = true;
                newTime = newTime % duration;
                isLoopStart = true;
            } else {
                isNewFrame = false;
                newTime = duration;
                isFinished = true;
            }
            this._signalEnd();
        }
        if (isNewFrame) {
            this.props.deltaTime = deltaTime;
            this.props.time = newTime;
            this.props.playhead = this._computePlayhead(newTime, duration);
            var lastFrame = this.props.frame;
            this.props.frame = this._computeCurrentFrame();
            if (isLoopStart) 
                { this._signalBegin(); }
            if (lastFrame !== this.props.frame) 
                { this.tick(); }
            this.render();
            this.props.deltaTime = 0;
        }
        if (isFinished) {
            this.pause();
        }
    };
    SketchManager.prototype.dispatch = function dispatch (cb) {
        if (typeof cb !== 'function') 
            { throw new Error('must pass function into dispatch()'); }
        cb(this.props);
        this.render();
    };
    SketchManager.prototype.mount = function mount () {
        this._appendCanvasIfNeeded();
    };
    SketchManager.prototype.unmount = function unmount () {
        if (isBrowser()) {
            window.removeEventListener('resize', this._resizeHandler);
            this._keyboardShortcuts.detach();
        }
        if (this.props.canvas.parentElement) {
            this.props.canvas.parentElement.removeChild(this.props.canvas);
        }
    };
    SketchManager.prototype._appendCanvasIfNeeded = function _appendCanvasIfNeeded () {
        if (!isBrowser()) 
            { return; }
        if (this.settings.parent !== false && (this.props.canvas && !this.props.canvas.parentElement)) {
            var defaultParent = this.settings.parent || document.body;
            defaultParent.appendChild(this.props.canvas);
        }
    };
    SketchManager.prototype._setupGLKey = function _setupGLKey () {
        if (this.props.context) {
            if (isWebGLContext(this.props.context)) {
                this._props.gl = this.props.context;
            } else {
                delete this._props.gl;
            }
        }
    };
    SketchManager.prototype.getTimeProps = function getTimeProps (settings) {
            if ( settings === void 0 ) settings = {};

        var duration = settings.duration;
        var totalFrames = settings.totalFrames;
        var timeScale = defined(settings.timeScale, 1);
        var fps = defined(settings.fps, 24);
        var hasDuration = typeof duration === 'number' && isFinite(duration);
        var hasTotalFrames = typeof totalFrames === 'number' && isFinite(totalFrames);
        var totalFramesFromDuration = hasDuration ? Math.floor(fps * duration) : undefined;
        var durationFromTotalFrames = hasTotalFrames ? totalFrames / fps : undefined;
        if (hasDuration && hasTotalFrames && totalFramesFromDuration !== totalFrames) {
            throw new Error('You should specify either duration or totalFrames, but not both. Or, they must match exactly.');
        }
        if (typeof settings.dimensions === 'undefined' && typeof settings.units !== 'undefined') {
            console.warn("You've specified a { units } setting but no { dimension }, so the units will be ignored.");
        }
        totalFrames = defined(totalFrames, totalFramesFromDuration, Infinity);
        duration = defined(duration, durationFromTotalFrames, Infinity);
        var startTime = settings.time;
        var startFrame = settings.frame;
        var hasStartTime = typeof startTime === 'number' && isFinite(startTime);
        var hasStartFrame = typeof startFrame === 'number' && isFinite(startFrame);
        var time = 0;
        var frame = 0;
        var playhead = 0;
        if (hasStartTime && hasStartFrame) {
            throw new Error('You should specify either start frame or time, but not both.');
        } else if (hasStartTime) {
            time = startTime;
            playhead = this._computePlayhead(time, duration);
            frame = this._computeFrame(playhead, time, totalFrames, fps);
        } else if (hasStartFrame) {
            frame = startFrame;
            time = frame / fps;
            playhead = this._computePlayhead(time, duration);
        }
        return {
            playhead: playhead,
            time: time,
            frame: frame,
            duration: duration,
            totalFrames: totalFrames,
            fps: fps,
            timeScale: timeScale
        };
    };
    SketchManager.prototype.setup = function setup (settings, overrides) {
            var this$1 = this;
            if ( settings === void 0 ) settings = {};
            if ( overrides === void 0 ) overrides = {};

        if (this.sketch) 
            { throw new Error('Multiple setup() calls not yet supported.'); }
        this._settings = Object.assign({}, settings, this._settings);
        var ref = createCanvas(this._settings);
            var context = ref.context;
            var canvas = ref.canvas;
        var timeProps = this.getTimeProps(this._settings);
        this._props = Object.assign({}, timeProps,
            {canvas: canvas,
            context: context,
            deltaTime: 0,
            started: false,
            exporting: false,
            playing: false,
            recording: false,
            settings: this.settings,
            render: function () { return this$1.render(); },
            togglePlay: function () { return this$1.togglePlay(); },
            dispatch: function (cb) { return this$1.dispatch(cb); },
            tick: function () { return this$1.tick(); },
            resize: function () { return this$1.resize(); },
            update: function (opt) { return this$1.update(opt); },
            exportFrame: function (opt) { return this$1.exportFrame(opt); },
            record: function () { return this$1.record(); },
            play: function () { return this$1.play(); },
            pause: function () { return this$1.pause(); },
            stop: function () { return this$1.stop(); }});
        this._setupGLKey();
        this.resize();
    };
    SketchManager.prototype.loadAndRun = function loadAndRun (canvasSketch, newSettings) {
            var this$1 = this;

        return this.load(canvasSketch, newSettings).then(function () {
            this$1.run();
            return this$1;
        });
    };
    SketchManager.prototype.unload = function unload () {
            var this$1 = this;

        this.pause();
        if (!this.sketch) 
            { return; }
        if (typeof this.sketch.unload === 'function') {
            this._wrapContextScale(function (props) { return this$1.sketch.unload(props); });
        }
        this._sketch = null;
    };
    SketchManager.prototype.destroy = function destroy () {
        this.unload();
        this.unmount();
    };
    SketchManager.prototype.load = function load (createSketch, newSettings) {
            var this$1 = this;

        if (typeof createSketch !== 'function') {
            throw new Error('The function must take in a function as the first parameter. Example:\n  canvasSketcher(() => { ... }, settings)');
        }
        if (this.sketch) {
            this.unload();
        }
        if (typeof newSettings !== 'undefined') {
            this.update(newSettings);
        }
        this._preRender();
        var preload = Promise.resolve();
        if (this.settings.p5) {
            if (!isBrowser()) {
                throw new Error('[canvas-sketch] ERROR: Using p5.js in Node.js is not supported');
            }
            preload = new Promise(function (resolve) {
                var P5Constructor = this$1.settings.p5;
                var preload;
                if (P5Constructor.p5) {
                    preload = P5Constructor.preload;
                    P5Constructor = P5Constructor.p5;
                }
                var p5Sketch = function (p5) {
                    if (preload) 
                        { p5.preload = (function () { return preload(p5); }); }
                    p5.setup = (function () {
                        var props = this$1.props;
                        var isGL = this$1.settings.context === 'webgl';
                        var renderer = isGL ? p5.WEBGL : p5.P2D;
                        p5.noLoop();
                        p5.pixelDensity(props.pixelRatio);
                        p5.createCanvas(props.viewportWidth, props.viewportHeight, renderer);
                        if (isGL && this$1.settings.attributes) {
                            p5.setAttributes(this$1.settings.attributes);
                        }
                        this$1.update({
                            p5: p5,
                            canvas: p5.canvas,
                            context: p5._renderer.drawingContext
                        });
                        resolve();
                    });
                };
                if (typeof P5Constructor === 'function') {
                    new P5Constructor(p5Sketch);
                } else {
                    if (typeof window.createCanvas !== 'function') {
                        throw new Error("{ p5 } setting is passed but can't find p5.js in global (window) scope. Maybe you did not create it globally?\nnew p5(); // <-- attaches to global scope");
                    }
                    p5Sketch(window);
                }
            });
        }
        return preload.then(function () {
            var loader = createSketch(this$1.props);
            if (!isPromise_1(loader)) {
                loader = Promise.resolve(loader);
            }
            return loader;
        }).then(function (sketch) {
            if (!sketch) 
                { sketch = {}; }
            this$1._sketch = sketch;
            if (isBrowser()) {
                this$1._keyboardShortcuts.attach();
                window.addEventListener('resize', this$1._resizeHandler);
            }
            this$1._postRender();
            this$1._sizeChanged();
            return this$1;
        }).catch(function (err) {
            console.warn('Could not start sketch, the async loading function rejected with an error:\n    Error: ' + err.message);
            throw err;
        });
    };

    Object.defineProperties( SketchManager.prototype, prototypeAccessors );

    var CACHE = 'hot-id-cache';
    var runtimeCollisions = [];
    function isHotReload() {
        var client = getClientAPI();
        return client && client.hot;
    }

    function cacheGet(id) {
        var client = getClientAPI();
        if (!client) 
            { return undefined; }
        client[CACHE] = client[CACHE] || {};
        return client[CACHE][id];
    }

    function cachePut(id, data) {
        var client = getClientAPI();
        if (!client) 
            { return undefined; }
        client[CACHE] = client[CACHE] || {};
        client[CACHE][id] = data;
    }

    function getTimeProp(oldManager, newSettings) {
        return newSettings.animate ? {
            time: oldManager.props.time
        } : undefined;
    }

    function canvasSketch(sketch, settings) {
        if ( settings === void 0 ) settings = {};

        if (settings.p5) {
            if (settings.canvas || settings.context && typeof settings.context !== 'string') {
                throw new Error("In { p5 } mode, you can't pass your own canvas or context, unless the context is a \"webgl\" or \"2d\" string");
            }
            var context = typeof settings.context === 'string' ? settings.context : false;
            settings = Object.assign({}, settings, {
                canvas: false,
                context: context
            });
        }
        var isHot = isHotReload();
        var hotID;
        if (isHot) {
            hotID = defined(settings.id, '$__DEFAULT_CANVAS_SKETCH_ID__$');
        }
        var isInjecting = isHot && typeof hotID === 'string';
        if (isInjecting && runtimeCollisions.includes(hotID)) {
            console.warn("Warning: You have multiple calls to canvasSketch() in --hot mode. You must pass unique { id } strings in settings to enable hot reload across multiple sketches. ", hotID);
            isInjecting = false;
        }
        var preload = Promise.resolve();
        if (isInjecting) {
            runtimeCollisions.push(hotID);
            var previousData = cacheGet(hotID);
            if (previousData) {
                var next = function () {
                    var newProps = getTimeProp(previousData.manager, settings);
                    previousData.manager.destroy();
                    return newProps;
                };
                preload = previousData.load.then(next).catch(next);
            }
        }
        return preload.then(function (newProps) {
            var manager = new SketchManager();
            var result;
            if (sketch) {
                settings = Object.assign({}, settings, newProps);
                manager.setup(settings);
                manager.mount();
                result = manager.loadAndRun(sketch);
            } else {
                result = Promise.resolve(manager);
            }
            if (isInjecting) {
                cachePut(hotID, {
                    load: result,
                    manager: manager
                });
            }
            return result;
        });
    }

    canvasSketch.canvasSketch = canvasSketch;
    canvasSketch.PaperSizes = paperSizes;

    return canvasSketch;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzLXNrZXRjaC51bWQuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9kZWZpbmVkL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcmlnaHQtbm93L2Jyb3dzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvaXMtcHJvbWlzZS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9pcy1kb20vaW5kZXguanMiLCIuLi9saWIvdXRpbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kZWVwLWVxdWFsL2xpYi9rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RlZXAtZXF1YWwvbGliL2lzX2FyZ3VtZW50cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9kZWVwLWVxdWFsL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RhdGVmb3JtYXQvbGliL2RhdGVmb3JtYXQuanMiLCIuLi9ub2RlX21vZHVsZXMvcmVwZWF0LXN0cmluZy9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9wYWQtbGVmdC9pbmRleC5qcyIsIi4uL2xpYi9zYXZlLmpzIiwiLi4vbGliL2NvcmUva2V5Ym9hcmRTaG9ydGN1dHMuanMiLCIuLi9saWIvcGFwZXItc2l6ZXMuanMiLCIuLi9saWIvZGlzdGFuY2VzLmpzIiwiLi4vbGliL2NvcmUvcmVzaXplQ2FudmFzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2dldC1jYW52YXMtY29udGV4dC9pbmRleC5qcyIsIi4uL2xpYi9jb3JlL2NyZWF0ZUNhbnZhcy5qcyIsIi4uL2xpYi9jb3JlL1NrZXRjaE1hbmFnZXIuanMiLCIuLi9saWIvY2FudmFzLXNrZXRjaC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXJndW1lbnRzW2ldICE9PSB1bmRlZmluZWQpIHJldHVybiBhcmd1bWVudHNbaV07XG4gICAgfVxufTtcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9XG4gIGdsb2JhbC5wZXJmb3JtYW5jZSAmJlxuICBnbG9iYWwucGVyZm9ybWFuY2Uubm93ID8gZnVuY3Rpb24gbm93KCkge1xuICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKVxuICB9IDogRGF0ZS5ub3cgfHwgZnVuY3Rpb24gbm93KCkge1xuICAgIHJldHVybiArbmV3IERhdGVcbiAgfVxuIiwibW9kdWxlLmV4cG9ydHMgPSBpc1Byb21pc2U7XG5cbmZ1bmN0aW9uIGlzUHJvbWlzZShvYmopIHtcbiAgcmV0dXJuICEhb2JqICYmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSAmJiB0eXBlb2Ygb2JqLnRoZW4gPT09ICdmdW5jdGlvbic7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGlzTm9kZVxuXG5mdW5jdGlvbiBpc05vZGUgKHZhbCkge1xuICByZXR1cm4gKCF2YWwgfHwgdHlwZW9mIHZhbCAhPT0gJ29iamVjdCcpXG4gICAgPyBmYWxzZVxuICAgIDogKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHR5cGVvZiB3aW5kb3cuTm9kZSA9PT0gJ29iamVjdCcpXG4gICAgICA/ICh2YWwgaW5zdGFuY2VvZiB3aW5kb3cuTm9kZSlcbiAgICAgIDogKHR5cGVvZiB2YWwubm9kZVR5cGUgPT09ICdudW1iZXInKSAmJlxuICAgICAgICAodHlwZW9mIHZhbC5ub2RlTmFtZSA9PT0gJ3N0cmluZycpXG59XG4iLCIvLyBUT0RPOiBXZSBjYW4gcmVtb3ZlIGEgaHVnZSBjaHVuayBvZiBidW5kbGUgc2l6ZSBieSB1c2luZyBhIHNtYWxsZXJcbi8vIHV0aWxpdHkgbW9kdWxlIGZvciBjb252ZXJ0aW5nIHVuaXRzLlxuaW1wb3J0IGlzRE9NIGZyb20gJ2lzLWRvbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDbGllbnRBUEkgKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93WydjYW52YXMtc2tldGNoLWNsaSddO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCcm93c2VyICgpIHtcbiAgcmV0dXJuIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dlYkdMQ29udGV4dCAoY3R4KSB7XG4gIHJldHVybiB0eXBlb2YgY3R4LmNsZWFyID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBjdHguY2xlYXJDb2xvciA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgY3R4LmJ1ZmZlckRhdGEgPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NhbnZhcyAoZWxlbWVudCkge1xuICByZXR1cm4gaXNET00oZWxlbWVudCkgJiYgL2NhbnZhcy9pLnRlc3QoZWxlbWVudC5ub2RlTmFtZSkgJiYgdHlwZW9mIGVsZW1lbnQuZ2V0Q29udGV4dCA9PT0gJ2Z1bmN0aW9uJztcbn1cbiIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBPYmplY3Qua2V5cyA9PT0gJ2Z1bmN0aW9uJ1xuICA/IE9iamVjdC5rZXlzIDogc2hpbTtcblxuZXhwb3J0cy5zaGltID0gc2hpbTtcbmZ1bmN0aW9uIHNoaW0gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSBrZXlzLnB1c2goa2V5KTtcbiAgcmV0dXJuIGtleXM7XG59XG4iLCJ2YXIgc3VwcG9ydHNBcmd1bWVudHNDbGFzcyA9IChmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZ3VtZW50cylcbn0pKCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHN1cHBvcnRzQXJndW1lbnRzQ2xhc3MgPyBzdXBwb3J0ZWQgOiB1bnN1cHBvcnRlZDtcblxuZXhwb3J0cy5zdXBwb3J0ZWQgPSBzdXBwb3J0ZWQ7XG5mdW5jdGlvbiBzdXBwb3J0ZWQob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn07XG5cbmV4cG9ydHMudW5zdXBwb3J0ZWQgPSB1bnN1cHBvcnRlZDtcbmZ1bmN0aW9uIHVuc3VwcG9ydGVkKG9iamVjdCl7XG4gIHJldHVybiBvYmplY3QgJiZcbiAgICB0eXBlb2Ygb2JqZWN0ID09ICdvYmplY3QnICYmXG4gICAgdHlwZW9mIG9iamVjdC5sZW5ndGggPT0gJ251bWJlcicgJiZcbiAgICBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnY2FsbGVlJykgJiZcbiAgICAhT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iamVjdCwgJ2NhbGxlZScpIHx8XG4gICAgZmFsc2U7XG59O1xuIiwidmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBvYmplY3RLZXlzID0gcmVxdWlyZSgnLi9saWIva2V5cy5qcycpO1xudmFyIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9saWIvaXNfYXJndW1lbnRzLmpzJyk7XG5cbnZhciBkZWVwRXF1YWwgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBvcHRzKSB7XG4gIGlmICghb3B0cykgb3B0cyA9IHt9O1xuICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIERhdGUgJiYgZXhwZWN0ZWQgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQgfHwgdHlwZW9mIGFjdHVhbCAhPSAnb2JqZWN0JyAmJiB0eXBlb2YgZXhwZWN0ZWQgIT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gb3B0cy5zdHJpY3QgPyBhY3R1YWwgPT09IGV4cGVjdGVkIDogYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIDcuNC4gRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkLCBvcHRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKHgpIHtcbiAgaWYgKCF4IHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgeC5sZW5ndGggIT09ICdudW1iZXInKSByZXR1cm4gZmFsc2U7XG4gIGlmICh0eXBlb2YgeC5jb3B5ICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB4LnNsaWNlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh4Lmxlbmd0aCA+IDAgJiYgdHlwZW9mIHhbMF0gIT09ICdudW1iZXInKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiLCBvcHRzKSB7XG4gIHZhciBpLCBrZXk7XG4gIGlmIChpc1VuZGVmaW5lZE9yTnVsbChhKSB8fCBpc1VuZGVmaW5lZE9yTnVsbChiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS5cbiAgaWYgKGEucHJvdG90eXBlICE9PSBiLnByb3RvdHlwZSkgcmV0dXJuIGZhbHNlO1xuICAvL35+fkkndmUgbWFuYWdlZCB0byBicmVhayBPYmplY3Qua2V5cyB0aHJvdWdoIHNjcmV3eSBhcmd1bWVudHMgcGFzc2luZy5cbiAgLy8gICBDb252ZXJ0aW5nIHRvIGFycmF5IHNvbHZlcyB0aGUgcHJvYmxlbS5cbiAgaWYgKGlzQXJndW1lbnRzKGEpKSB7XG4gICAgaWYgKCFpc0FyZ3VtZW50cyhiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBkZWVwRXF1YWwoYSwgYiwgb3B0cyk7XG4gIH1cbiAgaWYgKGlzQnVmZmVyKGEpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhW2ldICE9PSBiW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIGthID0gb2JqZWN0S2V5cyhhKSxcbiAgICAgICAga2IgPSBvYmplY3RLZXlzKGIpO1xuICB9IGNhdGNoIChlKSB7Ly9oYXBwZW5zIHdoZW4gb25lIGlzIGEgc3RyaW5nIGxpdGVyYWwgYW5kIHRoZSBvdGhlciBpc24ndFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGthW2ldICE9IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFkZWVwRXF1YWwoYVtrZXldLCBiW2tleV0sIG9wdHMpKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiBhID09PSB0eXBlb2YgYjtcbn1cbiIsIi8qXG4gKiBEYXRlIEZvcm1hdCAxLjIuM1xuICogKGMpIDIwMDctMjAwOSBTdGV2ZW4gTGV2aXRoYW4gPHN0ZXZlbmxldml0aGFuLmNvbT5cbiAqIE1JVCBsaWNlbnNlXG4gKlxuICogSW5jbHVkZXMgZW5oYW5jZW1lbnRzIGJ5IFNjb3R0IFRyZW5kYSA8c2NvdHQudHJlbmRhLm5ldD5cbiAqIGFuZCBLcmlzIEtvd2FsIDxjaXhhci5jb20vfmtyaXMua293YWwvPlxuICpcbiAqIEFjY2VwdHMgYSBkYXRlLCBhIG1hc2ssIG9yIGEgZGF0ZSBhbmQgYSBtYXNrLlxuICogUmV0dXJucyBhIGZvcm1hdHRlZCB2ZXJzaW9uIG9mIHRoZSBnaXZlbiBkYXRlLlxuICogVGhlIGRhdGUgZGVmYXVsdHMgdG8gdGhlIGN1cnJlbnQgZGF0ZS90aW1lLlxuICogVGhlIG1hc2sgZGVmYXVsdHMgdG8gZGF0ZUZvcm1hdC5tYXNrcy5kZWZhdWx0LlxuICovXG5cbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBkYXRlRm9ybWF0ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRva2VuID0gL2R7MSw0fXxtezEsNH18eXkoPzp5eSk/fChbSGhNc1R0XSlcXDE/fFtMbG9TWldOXXxcIlteXCJdKlwifCdbXiddKicvZztcbiAgICAgIHZhciB0aW1lem9uZSA9IC9cXGIoPzpbUE1DRUFdW1NEUF1UfCg/OlBhY2lmaWN8TW91bnRhaW58Q2VudHJhbHxFYXN0ZXJufEF0bGFudGljKSAoPzpTdGFuZGFyZHxEYXlsaWdodHxQcmV2YWlsaW5nKSBUaW1lfCg/OkdNVHxVVEMpKD86Wy0rXVxcZHs0fSk/KVxcYi9nO1xuICAgICAgdmFyIHRpbWV6b25lQ2xpcCA9IC9bXi0rXFxkQS1aXS9nO1xuICBcbiAgICAgIC8vIFJlZ2V4ZXMgYW5kIHN1cHBvcnRpbmcgZnVuY3Rpb25zIGFyZSBjYWNoZWQgdGhyb3VnaCBjbG9zdXJlXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGUsIG1hc2ssIHV0YywgZ210KSB7XG4gIFxuICAgICAgICAvLyBZb3UgY2FuJ3QgcHJvdmlkZSB1dGMgaWYgeW91IHNraXAgb3RoZXIgYXJncyAodXNlIHRoZSAnVVRDOicgbWFzayBwcmVmaXgpXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIGtpbmRPZihkYXRlKSA9PT0gJ3N0cmluZycgJiYgIS9cXGQvLnRlc3QoZGF0ZSkpIHtcbiAgICAgICAgICBtYXNrID0gZGF0ZTtcbiAgICAgICAgICBkYXRlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gIFxuICAgICAgICBkYXRlID0gZGF0ZSB8fCBuZXcgRGF0ZTtcbiAgXG4gICAgICAgIGlmKCEoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAoaXNOYU4oZGF0ZSkpIHtcbiAgICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ0ludmFsaWQgZGF0ZScpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBtYXNrID0gU3RyaW5nKGRhdGVGb3JtYXQubWFza3NbbWFza10gfHwgbWFzayB8fCBkYXRlRm9ybWF0Lm1hc2tzWydkZWZhdWx0J10pO1xuICBcbiAgICAgICAgLy8gQWxsb3cgc2V0dGluZyB0aGUgdXRjL2dtdCBhcmd1bWVudCB2aWEgdGhlIG1hc2tcbiAgICAgICAgdmFyIG1hc2tTbGljZSA9IG1hc2suc2xpY2UoMCwgNCk7XG4gICAgICAgIGlmIChtYXNrU2xpY2UgPT09ICdVVEM6JyB8fCBtYXNrU2xpY2UgPT09ICdHTVQ6Jykge1xuICAgICAgICAgIG1hc2sgPSBtYXNrLnNsaWNlKDQpO1xuICAgICAgICAgIHV0YyA9IHRydWU7XG4gICAgICAgICAgaWYgKG1hc2tTbGljZSA9PT0gJ0dNVDonKSB7XG4gICAgICAgICAgICBnbXQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICBcbiAgICAgICAgdmFyIF8gPSB1dGMgPyAnZ2V0VVRDJyA6ICdnZXQnO1xuICAgICAgICB2YXIgZCA9IGRhdGVbXyArICdEYXRlJ10oKTtcbiAgICAgICAgdmFyIEQgPSBkYXRlW18gKyAnRGF5J10oKTtcbiAgICAgICAgdmFyIG0gPSBkYXRlW18gKyAnTW9udGgnXSgpO1xuICAgICAgICB2YXIgeSA9IGRhdGVbXyArICdGdWxsWWVhciddKCk7XG4gICAgICAgIHZhciBIID0gZGF0ZVtfICsgJ0hvdXJzJ10oKTtcbiAgICAgICAgdmFyIE0gPSBkYXRlW18gKyAnTWludXRlcyddKCk7XG4gICAgICAgIHZhciBzID0gZGF0ZVtfICsgJ1NlY29uZHMnXSgpO1xuICAgICAgICB2YXIgTCA9IGRhdGVbXyArICdNaWxsaXNlY29uZHMnXSgpO1xuICAgICAgICB2YXIgbyA9IHV0YyA/IDAgOiBkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICAgIHZhciBXID0gZ2V0V2VlayhkYXRlKTtcbiAgICAgICAgdmFyIE4gPSBnZXREYXlPZldlZWsoZGF0ZSk7XG4gICAgICAgIHZhciBmbGFncyA9IHtcbiAgICAgICAgICBkOiAgICBkLFxuICAgICAgICAgIGRkOiAgIHBhZChkKSxcbiAgICAgICAgICBkZGQ6ICBkYXRlRm9ybWF0LmkxOG4uZGF5TmFtZXNbRF0sXG4gICAgICAgICAgZGRkZDogZGF0ZUZvcm1hdC5pMThuLmRheU5hbWVzW0QgKyA3XSxcbiAgICAgICAgICBtOiAgICBtICsgMSxcbiAgICAgICAgICBtbTogICBwYWQobSArIDEpLFxuICAgICAgICAgIG1tbTogIGRhdGVGb3JtYXQuaTE4bi5tb250aE5hbWVzW21dLFxuICAgICAgICAgIG1tbW06IGRhdGVGb3JtYXQuaTE4bi5tb250aE5hbWVzW20gKyAxMl0sXG4gICAgICAgICAgeXk6ICAgU3RyaW5nKHkpLnNsaWNlKDIpLFxuICAgICAgICAgIHl5eXk6IHksXG4gICAgICAgICAgaDogICAgSCAlIDEyIHx8IDEyLFxuICAgICAgICAgIGhoOiAgIHBhZChIICUgMTIgfHwgMTIpLFxuICAgICAgICAgIEg6ICAgIEgsXG4gICAgICAgICAgSEg6ICAgcGFkKEgpLFxuICAgICAgICAgIE06ICAgIE0sXG4gICAgICAgICAgTU06ICAgcGFkKE0pLFxuICAgICAgICAgIHM6ICAgIHMsXG4gICAgICAgICAgc3M6ICAgcGFkKHMpLFxuICAgICAgICAgIGw6ICAgIHBhZChMLCAzKSxcbiAgICAgICAgICBMOiAgICBwYWQoTWF0aC5yb3VuZChMIC8gMTApKSxcbiAgICAgICAgICB0OiAgICBIIDwgMTIgPyBkYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzBdIDogZGF0ZUZvcm1hdC5pMThuLnRpbWVOYW1lc1sxXSxcbiAgICAgICAgICB0dDogICBIIDwgMTIgPyBkYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzJdIDogZGF0ZUZvcm1hdC5pMThuLnRpbWVOYW1lc1szXSxcbiAgICAgICAgICBUOiAgICBIIDwgMTIgPyBkYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzRdIDogZGF0ZUZvcm1hdC5pMThuLnRpbWVOYW1lc1s1XSxcbiAgICAgICAgICBUVDogICBIIDwgMTIgPyBkYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzZdIDogZGF0ZUZvcm1hdC5pMThuLnRpbWVOYW1lc1s3XSxcbiAgICAgICAgICBaOiAgICBnbXQgPyAnR01UJyA6IHV0YyA/ICdVVEMnIDogKFN0cmluZyhkYXRlKS5tYXRjaCh0aW1lem9uZSkgfHwgWycnXSkucG9wKCkucmVwbGFjZSh0aW1lem9uZUNsaXAsICcnKSxcbiAgICAgICAgICBvOiAgICAobyA+IDAgPyAnLScgOiAnKycpICsgcGFkKE1hdGguZmxvb3IoTWF0aC5hYnMobykgLyA2MCkgKiAxMDAgKyBNYXRoLmFicyhvKSAlIDYwLCA0KSxcbiAgICAgICAgICBTOiAgICBbJ3RoJywgJ3N0JywgJ25kJywgJ3JkJ11bZCAlIDEwID4gMyA/IDAgOiAoZCAlIDEwMCAtIGQgJSAxMCAhPSAxMCkgKiBkICUgMTBdLFxuICAgICAgICAgIFc6ICAgIFcsXG4gICAgICAgICAgTjogICAgTlxuICAgICAgICB9O1xuICBcbiAgICAgICAgcmV0dXJuIG1hc2sucmVwbGFjZSh0b2tlbiwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgaWYgKG1hdGNoIGluIGZsYWdzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmxhZ3NbbWF0Y2hdO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbWF0Y2guc2xpY2UoMSwgbWF0Y2gubGVuZ3RoIC0gMSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KSgpO1xuXG4gIGRhdGVGb3JtYXQubWFza3MgPSB7XG4gICAgJ2RlZmF1bHQnOiAgICAgICAgICAgICAgICdkZGQgbW1tIGRkIHl5eXkgSEg6TU06c3MnLFxuICAgICdzaG9ydERhdGUnOiAgICAgICAgICAgICAnbS9kL3l5JyxcbiAgICAnbWVkaXVtRGF0ZSc6ICAgICAgICAgICAgJ21tbSBkLCB5eXl5JyxcbiAgICAnbG9uZ0RhdGUnOiAgICAgICAgICAgICAgJ21tbW0gZCwgeXl5eScsXG4gICAgJ2Z1bGxEYXRlJzogICAgICAgICAgICAgICdkZGRkLCBtbW1tIGQsIHl5eXknLFxuICAgICdzaG9ydFRpbWUnOiAgICAgICAgICAgICAnaDpNTSBUVCcsXG4gICAgJ21lZGl1bVRpbWUnOiAgICAgICAgICAgICdoOk1NOnNzIFRUJyxcbiAgICAnbG9uZ1RpbWUnOiAgICAgICAgICAgICAgJ2g6TU06c3MgVFQgWicsXG4gICAgJ2lzb0RhdGUnOiAgICAgICAgICAgICAgICd5eXl5LW1tLWRkJyxcbiAgICAnaXNvVGltZSc6ICAgICAgICAgICAgICAgJ0hIOk1NOnNzJyxcbiAgICAnaXNvRGF0ZVRpbWUnOiAgICAgICAgICAgJ3l5eXktbW0tZGRcXCdUXFwnSEg6TU06c3NvJyxcbiAgICAnaXNvVXRjRGF0ZVRpbWUnOiAgICAgICAgJ1VUQzp5eXl5LW1tLWRkXFwnVFxcJ0hIOk1NOnNzXFwnWlxcJycsXG4gICAgJ2V4cGlyZXNIZWFkZXJGb3JtYXQnOiAgICdkZGQsIGRkIG1tbSB5eXl5IEhIOk1NOnNzIFonXG4gIH07XG5cbiAgLy8gSW50ZXJuYXRpb25hbGl6YXRpb24gc3RyaW5nc1xuICBkYXRlRm9ybWF0LmkxOG4gPSB7XG4gICAgZGF5TmFtZXM6IFtcbiAgICAgICdTdW4nLCAnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnLFxuICAgICAgJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J1xuICAgIF0sXG4gICAgbW9udGhOYW1lczogW1xuICAgICAgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJywgJ09jdCcsICdOb3YnLCAnRGVjJyxcbiAgICAgICdKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ1xuICAgIF0sXG4gICAgdGltZU5hbWVzOiBbXG4gICAgICAnYScsICdwJywgJ2FtJywgJ3BtJywgJ0EnLCAnUCcsICdBTScsICdQTSdcbiAgICBdXG4gIH07XG5cbmZ1bmN0aW9uIHBhZCh2YWwsIGxlbikge1xuICB2YWwgPSBTdHJpbmcodmFsKTtcbiAgbGVuID0gbGVuIHx8IDI7XG4gIHdoaWxlICh2YWwubGVuZ3RoIDwgbGVuKSB7XG4gICAgdmFsID0gJzAnICsgdmFsO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbi8qKlxuICogR2V0IHRoZSBJU08gODYwMSB3ZWVrIG51bWJlclxuICogQmFzZWQgb24gY29tbWVudHMgZnJvbVxuICogaHR0cDovL3RlY2hibG9nLnByb2N1cmlvcy5ubC9rL242MTgvbmV3cy92aWV3LzMzNzk2LzE0ODYzL0NhbGN1bGF0ZS1JU08tODYwMS13ZWVrLWFuZC15ZWFyLWluLWphdmFzY3JpcHQuaHRtbFxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gYGRhdGVgXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldFdlZWsoZGF0ZSkge1xuICAvLyBSZW1vdmUgdGltZSBjb21wb25lbnRzIG9mIGRhdGVcbiAgdmFyIHRhcmdldFRodXJzZGF5ID0gbmV3IERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKTtcblxuICAvLyBDaGFuZ2UgZGF0ZSB0byBUaHVyc2RheSBzYW1lIHdlZWtcbiAgdGFyZ2V0VGh1cnNkYXkuc2V0RGF0ZSh0YXJnZXRUaHVyc2RheS5nZXREYXRlKCkgLSAoKHRhcmdldFRodXJzZGF5LmdldERheSgpICsgNikgJSA3KSArIDMpO1xuXG4gIC8vIFRha2UgSmFudWFyeSA0dGggYXMgaXQgaXMgYWx3YXlzIGluIHdlZWsgMSAoc2VlIElTTyA4NjAxKVxuICB2YXIgZmlyc3RUaHVyc2RheSA9IG5ldyBEYXRlKHRhcmdldFRodXJzZGF5LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuXG4gIC8vIENoYW5nZSBkYXRlIHRvIFRodXJzZGF5IHNhbWUgd2Vla1xuICBmaXJzdFRodXJzZGF5LnNldERhdGUoZmlyc3RUaHVyc2RheS5nZXREYXRlKCkgLSAoKGZpcnN0VGh1cnNkYXkuZ2V0RGF5KCkgKyA2KSAlIDcpICsgMyk7XG5cbiAgLy8gQ2hlY2sgaWYgZGF5bGlnaHQtc2F2aW5nLXRpbWUtc3dpdGNoIG9jY3VycmVkIGFuZCBjb3JyZWN0IGZvciBpdFxuICB2YXIgZHMgPSB0YXJnZXRUaHVyc2RheS5nZXRUaW1lem9uZU9mZnNldCgpIC0gZmlyc3RUaHVyc2RheS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICB0YXJnZXRUaHVyc2RheS5zZXRIb3Vycyh0YXJnZXRUaHVyc2RheS5nZXRIb3VycygpIC0gZHMpO1xuXG4gIC8vIE51bWJlciBvZiB3ZWVrcyBiZXR3ZWVuIHRhcmdldCBUaHVyc2RheSBhbmQgZmlyc3QgVGh1cnNkYXlcbiAgdmFyIHdlZWtEaWZmID0gKHRhcmdldFRodXJzZGF5IC0gZmlyc3RUaHVyc2RheSkgLyAoODY0MDAwMDAqNyk7XG4gIHJldHVybiAxICsgTWF0aC5mbG9vcih3ZWVrRGlmZik7XG59XG5cbi8qKlxuICogR2V0IElTTy04NjAxIG51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgdGhlIGRheSBvZiB0aGUgd2Vla1xuICogMSAoZm9yIE1vbmRheSkgdGhyb3VnaCA3IChmb3IgU3VuZGF5KVxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBkYXRlYFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXREYXlPZldlZWsoZGF0ZSkge1xuICB2YXIgZG93ID0gZGF0ZS5nZXREYXkoKTtcbiAgaWYoZG93ID09PSAwKSB7XG4gICAgZG93ID0gNztcbiAgfVxuICByZXR1cm4gZG93O1xufVxuXG4vKipcbiAqIGtpbmQtb2Ygc2hvcnRjdXRcbiAqIEBwYXJhbSAgeyp9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBraW5kT2YodmFsKSB7XG4gIGlmICh2YWwgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG5cbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWwgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWw7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWwpXG4gICAgLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xufTtcblxuXG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZGF0ZUZvcm1hdDtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRhdGVGb3JtYXQ7XG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLmRhdGVGb3JtYXQgPSBkYXRlRm9ybWF0O1xuICB9XG59KSh0aGlzKTtcbiIsIi8qIVxuICogcmVwZWF0LXN0cmluZyA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvcmVwZWF0LXN0cmluZz5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFJlc3VsdHMgY2FjaGVcbiAqL1xuXG52YXIgcmVzID0gJyc7XG52YXIgY2FjaGU7XG5cbi8qKlxuICogRXhwb3NlIGByZXBlYXRgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSByZXBlYXQ7XG5cbi8qKlxuICogUmVwZWF0IHRoZSBnaXZlbiBgc3RyaW5nYCB0aGUgc3BlY2lmaWVkIGBudW1iZXJgXG4gKiBvZiB0aW1lcy5cbiAqXG4gKiAqKkV4YW1wbGU6KipcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlcGVhdCA9IHJlcXVpcmUoJ3JlcGVhdC1zdHJpbmcnKTtcbiAqIHJlcGVhdCgnQScsIDUpO1xuICogLy89PiBBQUFBQVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGBzdHJpbmdgIFRoZSBzdHJpbmcgdG8gcmVwZWF0XG4gKiBAcGFyYW0ge051bWJlcn0gYG51bWJlcmAgVGhlIG51bWJlciBvZiB0aW1lcyB0byByZXBlYXQgdGhlIHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSBSZXBlYXRlZCBzdHJpbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gcmVwZWF0KHN0ciwgbnVtKSB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4cGVjdGVkIGEgc3RyaW5nJyk7XG4gIH1cblxuICAvLyBjb3ZlciBjb21tb24sIHF1aWNrIHVzZSBjYXNlc1xuICBpZiAobnVtID09PSAxKSByZXR1cm4gc3RyO1xuICBpZiAobnVtID09PSAyKSByZXR1cm4gc3RyICsgc3RyO1xuXG4gIHZhciBtYXggPSBzdHIubGVuZ3RoICogbnVtO1xuICBpZiAoY2FjaGUgIT09IHN0ciB8fCB0eXBlb2YgY2FjaGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgY2FjaGUgPSBzdHI7XG4gICAgcmVzID0gJyc7XG4gIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+PSBtYXgpIHtcbiAgICByZXR1cm4gcmVzLnN1YnN0cigwLCBtYXgpO1xuICB9XG5cbiAgd2hpbGUgKG1heCA+IHJlcy5sZW5ndGggJiYgbnVtID4gMSkge1xuICAgIGlmIChudW0gJiAxKSB7XG4gICAgICByZXMgKz0gc3RyO1xuICAgIH1cblxuICAgIG51bSA+Pj0gMTtcbiAgICBzdHIgKz0gc3RyO1xuICB9XG5cbiAgcmVzICs9IHN0cjtcbiAgcmVzID0gcmVzLnN1YnN0cigwLCBtYXgpO1xuICByZXR1cm4gcmVzO1xufVxuIiwiLyohXG4gKiBwYWQtbGVmdCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvcGFkLWxlZnQ+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHJlcGVhdCA9IHJlcXVpcmUoJ3JlcGVhdC1zdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYWRMZWZ0KHN0ciwgbnVtLCBjaCkge1xuICBzdHIgPSBzdHIudG9TdHJpbmcoKTtcblxuICBpZiAodHlwZW9mIG51bSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgaWYgKGNoID09PSAwKSB7XG4gICAgY2ggPSAnMCc7XG4gIH0gZWxzZSBpZiAoY2gpIHtcbiAgICBjaCA9IGNoLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgY2ggPSAnICc7XG4gIH1cblxuICByZXR1cm4gcmVwZWF0KGNoLCBudW0gLSBzdHIubGVuZ3RoKSArIHN0cjtcbn07XG4iLCJpbXBvcnQgZGF0ZWZvcm1hdCBmcm9tICdkYXRlZm9ybWF0JztcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgcGFkTGVmdCBmcm9tICdwYWQtbGVmdCc7XG5pbXBvcnQgeyBnZXRDbGllbnRBUEkgfSBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBub29wID0gKCkgPT4ge307XG5sZXQgbGluaztcblxuLy8gQWx0ZXJuYXRpdmUgc29sdXRpb24gZm9yIHNhdmluZyBmaWxlcyxcbi8vIGEgYml0IHNsb3dlciBhbmQgZG9lcyBub3Qgd29yayBpbiBTYWZhcmlcbi8vIGZ1bmN0aW9uIGZldGNoQmxvYkZyb21EYXRhVVJMIChkYXRhVVJMKSB7XG4vLyAgIHJldHVybiB3aW5kb3cuZmV0Y2goZGF0YVVSTCkudGhlbihyZXMgPT4gcmVzLmJsb2IoKSk7XG4vLyB9XG5cbmNvbnN0IHN1cHBvcnRlZEVuY29kaW5ncyA9IFtcbiAgJ2ltYWdlL3BuZycsXG4gICdpbWFnZS9qcGVnJyxcbiAgJ2ltYWdlL3dlYnAnXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0Q2FudmFzIChjYW52YXMsIG9wdCA9IHt9KSB7XG4gIGNvbnN0IGVuY29kaW5nID0gb3B0LmVuY29kaW5nIHx8ICdpbWFnZS9wbmcnO1xuICBpZiAoIXN1cHBvcnRlZEVuY29kaW5ncy5pbmNsdWRlcyhlbmNvZGluZykpIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjYW52YXMgZW5jb2RpbmcgJHtlbmNvZGluZ31gKTtcbiAgbGV0IGV4dGVuc2lvbiA9IChlbmNvZGluZy5zcGxpdCgnLycpWzFdIHx8ICcnKS5yZXBsYWNlKC9qcGVnL2ksICdqcGcnKTtcbiAgaWYgKGV4dGVuc2lvbikgZXh0ZW5zaW9uID0gYC4ke2V4dGVuc2lvbn1gLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiB7XG4gICAgZXh0ZW5zaW9uLFxuICAgIHR5cGU6IGVuY29kaW5nLFxuICAgIGRhdGFVUkw6IGNhbnZhcy50b0RhdGFVUkwoZW5jb2RpbmcsIG9wdC5lbmNvZGluZ1F1YWxpdHkpXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJsb2JGcm9tRGF0YVVSTCAoZGF0YVVSTCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCBzcGxpdEluZGV4ID0gZGF0YVVSTC5pbmRleE9mKCcsJyk7XG4gICAgaWYgKHNwbGl0SW5kZXggPT09IC0xKSB7XG4gICAgICByZXNvbHZlKG5ldyB3aW5kb3cuQmxvYigpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgYmFzZTY0ID0gZGF0YVVSTC5zbGljZShzcGxpdEluZGV4ICsgMSk7XG4gICAgY29uc3QgYnl0ZVN0cmluZyA9IHdpbmRvdy5hdG9iKGJhc2U2NCk7XG4gICAgY29uc3QgbWltZU1hdGNoID0gL2RhdGE6KFteOytdKTsvLmV4ZWMoZGF0YVVSTCk7XG4gICAgY29uc3QgbWltZSA9IChtaW1lTWF0Y2ggPyBtaW1lTWF0Y2hbMV0gOiAnJykgfHwgdW5kZWZpbmVkO1xuICAgIGNvbnN0IGFiID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVTdHJpbmcubGVuZ3RoKTtcbiAgICBjb25zdCBpYSA9IG5ldyBVaW50OEFycmF5KGFiKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVTdHJpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlhW2ldID0gYnl0ZVN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICByZXNvbHZlKG5ldyB3aW5kb3cuQmxvYihbIGFiIF0sIHsgdHlwZTogbWltZSB9KSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURhdGFVUkwgKGRhdGFVUkwsIG9wdHMgPSB7fSkge1xuICByZXR1cm4gY3JlYXRlQmxvYkZyb21EYXRhVVJMKGRhdGFVUkwpXG4gICAgLnRoZW4oYmxvYiA9PiBzYXZlQmxvYihibG9iLCBvcHRzKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlQmxvYiAoYmxvYiwgb3B0cyA9IHt9KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBvcHRzID0gYXNzaWduKHsgZXh0ZW5zaW9uOiAnJywgcHJlZml4OiAnJywgc3VmZml4OiAnJyB9LCBvcHRzKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IHJlc29sdmVGaWxlbmFtZShvcHRzKTtcblxuICAgIGNvbnN0IGNsaWVudCA9IGdldENsaWVudEFQSSgpO1xuICAgIGlmIChjbGllbnQgJiYgdHlwZW9mIGNsaWVudC5zYXZlQmxvYiA9PT0gJ2Z1bmN0aW9uJyAmJiBjbGllbnQub3V0cHV0KSB7XG4gICAgICAvLyBuYXRpdmUgc2F2aW5nIHVzaW5nIGEgQ0xJIHRvb2xcbiAgICAgIHJldHVybiBjbGllbnQuc2F2ZUJsb2IoYmxvYiwgYXNzaWduKHt9LCBvcHRzLCB7IGZpbGVuYW1lIH0pKVxuICAgICAgICAudGhlbihldiA9PiByZXNvbHZlKGV2KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGZvcmNlIGRvd25sb2FkXG4gICAgICBpZiAoIWxpbmspIHtcbiAgICAgICAgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbGluay5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIGxpbmsudGFyZ2V0ID0gJ19ibGFuayc7XG4gICAgICB9XG4gICAgICBsaW5rLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICBsaW5rLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIGxpbmsub25jbGljayA9IG5vb3A7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgICAgbGluay5yZW1vdmVBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICAgICAgICByZXNvbHZlKHsgZmlsZW5hbWUsIGNsaWVudDogZmFsc2UgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGxpbmsuY2xpY2soKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUZpbGUgKGRhdGEsIG9wdHMgPSB7fSkge1xuICBjb25zdCBwYXJ0cyA9IEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogWyBkYXRhIF07XG4gIGNvbnN0IGJsb2IgPSBuZXcgd2luZG93LkJsb2IocGFydHMsIHsgdHlwZTogb3B0cy50eXBlIHx8ICcnIH0pO1xuICByZXR1cm4gc2F2ZUJsb2IoYmxvYiwgb3B0cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWxlTmFtZSAoKSB7XG4gIGNvbnN0IGRhdGVGb3JtYXRTdHIgPSBgeXl5eS5tbS5kZC1ISC5NTS5zc2A7XG4gIHJldHVybiBkYXRlZm9ybWF0KG5ldyBEYXRlKCksIGRhdGVGb3JtYXRTdHIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdEZpbGUgKHByZWZpeCA9ICcnLCBzdWZmaXggPSAnJywgZXh0KSB7XG4gIC8vIGNvbnN0IGRhdGVGb3JtYXRTdHIgPSBgeXl5eS5tbS5kZC1ISC5NTS5zc2A7XG4gIGNvbnN0IGRhdGVGb3JtYXRTdHIgPSBgeXl5eS1tbS1kZCAnYXQnIGguTU0uc3MgVFRgO1xuICByZXR1cm4gYCR7cHJlZml4fSR7ZGF0ZWZvcm1hdChuZXcgRGF0ZSgpLCBkYXRlRm9ybWF0U3RyKX0ke3N1ZmZpeH0ke2V4dH1gO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRmlsZW5hbWUgKG9wdCA9IHt9KSB7XG4gIG9wdCA9IGFzc2lnbih7fSwgb3B0KTtcblxuICAvLyBDdXN0b20gZmlsZW5hbWUgZnVuY3Rpb25cbiAgaWYgKHR5cGVvZiBvcHQuZmlsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBvcHQuZmlsZShvcHQpO1xuICB9IGVsc2UgaWYgKG9wdC5maWxlKSB7XG4gICAgcmV0dXJuIG9wdC5maWxlO1xuICB9XG5cbiAgbGV0IGZyYW1lID0gbnVsbDtcbiAgbGV0IGV4dGVuc2lvbiA9ICcnO1xuICBpZiAodHlwZW9mIG9wdC5leHRlbnNpb24gPT09ICdzdHJpbmcnKSBleHRlbnNpb24gPSBvcHQuZXh0ZW5zaW9uO1xuXG4gIGlmICh0eXBlb2Ygb3B0LmZyYW1lID09PSAnbnVtYmVyJykge1xuICAgIGxldCB0b3RhbEZyYW1lcztcbiAgICBpZiAodHlwZW9mIG9wdC50b3RhbEZyYW1lcyA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRvdGFsRnJhbWVzID0gb3B0LnRvdGFsRnJhbWVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b3RhbEZyYW1lcyA9IE1hdGgubWF4KDEwMDAsIG9wdC5mcmFtZSk7XG4gICAgfVxuICAgIGZyYW1lID0gcGFkTGVmdChTdHJpbmcob3B0LmZyYW1lKSwgU3RyaW5nKHRvdGFsRnJhbWVzKS5sZW5ndGgsICcwJyk7XG4gIH1cblxuICBjb25zdCBsYXllclN0ciA9IGlzRmluaXRlKG9wdC50b3RhbExheWVycykgJiYgaXNGaW5pdGUob3B0LmxheWVyKSAmJiBvcHQudG90YWxMYXllcnMgPiAxID8gYCR7b3B0LmxheWVyfWAgOiAnJztcbiAgaWYgKGZyYW1lICE9IG51bGwpIHtcbiAgICByZXR1cm4gWyBsYXllclN0ciwgZnJhbWUgXS5maWx0ZXIoQm9vbGVhbikuam9pbignLScpICsgZXh0ZW5zaW9uO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGRlZmF1bHRGaWxlTmFtZSA9IG9wdC50aW1lU3RhbXA7XG4gICAgcmV0dXJuIFsgb3B0LnByZWZpeCwgb3B0Lm5hbWUgfHwgZGVmYXVsdEZpbGVOYW1lLCBsYXllclN0ciwgb3B0Lmhhc2gsIG9wdC5zdWZmaXggXS5maWx0ZXIoQm9vbGVhbikuam9pbignLScpICsgZXh0ZW5zaW9uO1xuICB9XG59XG4iLCJpbXBvcnQgeyBnZXRDbGllbnRBUEkgfSBmcm9tICcuLi91dGlsJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdCA9IHt9KSB7XG4gIGNvbnN0IGhhbmRsZXIgPSBldiA9PiB7XG4gICAgaWYgKCFvcHQuZW5hYmxlZCgpKSByZXR1cm47XG5cbiAgICBjb25zdCBjbGllbnQgPSBnZXRDbGllbnRBUEkoKTtcbiAgICBpZiAoZXYua2V5Q29kZSA9PT0gODMgJiYgIWV2LmFsdEtleSAmJiAoZXYubWV0YUtleSB8fCBldi5jdHJsS2V5KSkge1xuICAgICAgLy8gQ21kICsgU1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG9wdC5zYXZlKGV2KTtcbiAgICB9IGVsc2UgaWYgKGV2LmtleUNvZGUgPT09IDMyKSB7XG4gICAgICAvLyBTcGFjZVxuICAgICAgLy8gVE9ETzogd2hhdCB0byBkbyB3aXRoIHRoaXM/IGtlZXAgaXQsIG9yIHJlbW92ZSBpdD9cbiAgICAgIG9wdC50b2dnbGVQbGF5KGV2KTtcbiAgICB9IGVsc2UgaWYgKGNsaWVudCAmJiAhZXYuYWx0S2V5ICYmIGV2LmtleUNvZGUgPT09IDc1ICYmIChldi5tZXRhS2V5IHx8IGV2LmN0cmxLZXkpKSB7XG4gICAgICAvLyBDbWQgKyBLLCBvbmx5IHdoZW4gY2FudmFzLXNrZXRjaC1jbGkgaXMgdXNlZFxuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG9wdC5jb21taXQoZXYpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhdHRhY2ggPSAoKSA9PiB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVyKTtcbiAgfTtcblxuICBjb25zdCBkZXRhY2ggPSAoKSA9PiB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVyKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGF0dGFjaCxcbiAgICBkZXRhY2hcbiAgfTtcbn1cbiIsImNvbnN0IGRlZmF1bHRVbml0cyA9ICdtbSc7XG5cbmNvbnN0IGRhdGEgPSBbXG4gIC8vIENvbW1vbiBQYXBlciBTaXplc1xuICAvLyAoTW9zdGx5IE5vcnRoLUFtZXJpY2FuIGJhc2VkKVxuICBbICdwb3N0Y2FyZCcsIDEwMS42LCAxNTIuNCBdLFxuICBbICdwb3N0ZXItc21hbGwnLCAyODAsIDQzMCBdLFxuICBbICdwb3N0ZXInLCA0NjAsIDYxMCBdLFxuICBbICdwb3N0ZXItbGFyZ2UnLCA2MTAsIDkxMCBdLFxuICBbICdidXNpbmVzcy1jYXJkJywgNTAuOCwgODguOSBdLFxuXG4gIC8vIFN0YW5kYXJkIFBhcGVyIFNpemVzXG4gIFsgJ2EwJywgODQxLCAxMTg5IF0sXG4gIFsgJ2ExJywgNTk0LCA4NDEgXSxcbiAgWyAnYTInLCA0MjAsIDU5NCBdLFxuICBbICdhMycsIDI5NywgNDIwIF0sXG4gIFsgJ2E0JywgMjEwLCAyOTcgXSxcbiAgWyAnYTUnLCAxNDgsIDIxMCBdLFxuICBbICdhNicsIDEwNSwgMTQ4IF0sXG4gIFsgJ2E3JywgNzQsIDEwNSBdLFxuICBbICdhOCcsIDUyLCA3NCBdLFxuICBbICdhOScsIDM3LCA1MiBdLFxuICBbICdhMTAnLCAyNiwgMzcgXSxcbiAgWyAnMmEwJywgMTE4OSwgMTY4MiBdLFxuICBbICc0YTAnLCAxNjgyLCAyMzc4IF0sXG4gIFsgJ2IwJywgMTAwMCwgMTQxNCBdLFxuICBbICdiMScsIDcwNywgMTAwMCBdLFxuICBbICdiMSsnLCA3MjAsIDEwMjAgXSxcbiAgWyAnYjInLCA1MDAsIDcwNyBdLFxuICBbICdiMisnLCA1MjAsIDcyMCBdLFxuICBbICdiMycsIDM1MywgNTAwIF0sXG4gIFsgJ2I0JywgMjUwLCAzNTMgXSxcbiAgWyAnYjUnLCAxNzYsIDI1MCBdLFxuICBbICdiNicsIDEyNSwgMTc2IF0sXG4gIFsgJ2I3JywgODgsIDEyNSBdLFxuICBbICdiOCcsIDYyLCA4OCBdLFxuICBbICdiOScsIDQ0LCA2MiBdLFxuICBbICdiMTAnLCAzMSwgNDQgXSxcbiAgWyAnYjExJywgMjIsIDMyIF0sXG4gIFsgJ2IxMicsIDE2LCAyMiBdLFxuICBbICdjMCcsIDkxNywgMTI5NyBdLFxuICBbICdjMScsIDY0OCwgOTE3IF0sXG4gIFsgJ2MyJywgNDU4LCA2NDggXSxcbiAgWyAnYzMnLCAzMjQsIDQ1OCBdLFxuICBbICdjNCcsIDIyOSwgMzI0IF0sXG4gIFsgJ2M1JywgMTYyLCAyMjkgXSxcbiAgWyAnYzYnLCAxMTQsIDE2MiBdLFxuICBbICdjNycsIDgxLCAxMTQgXSxcbiAgWyAnYzgnLCA1NywgODEgXSxcbiAgWyAnYzknLCA0MCwgNTcgXSxcbiAgWyAnYzEwJywgMjgsIDQwIF0sXG4gIFsgJ2MxMScsIDIyLCAzMiBdLFxuICBbICdjMTInLCAxNiwgMjIgXSxcblxuICAvLyBVc2UgaW5jaGVzIGZvciBOb3J0aCBBbWVyaWNhbiBzaXplcyxcbiAgLy8gYXMgaXQgcHJvZHVjZXMgbGVzcyBmbG9hdCBwcmVjaXNpb24gZXJyb3JzXG4gIFsgJ2hhbGYtbGV0dGVyJywgNS41LCA4LjUsICdpbicgXSxcbiAgWyAnbGV0dGVyJywgOC41LCAxMSwgJ2luJyBdLFxuICBbICdsZWdhbCcsIDguNSwgMTQsICdpbicgXSxcbiAgWyAnanVuaW9yLWxlZ2FsJywgNSwgOCwgJ2luJyBdLFxuICBbICdsZWRnZXInLCAxMSwgMTcsICdpbicgXSxcbiAgWyAndGFibG9pZCcsIDExLCAxNywgJ2luJyBdLFxuICBbICdhbnNpLWEnLCA4LjUsIDExLjAsICdpbicgXSxcbiAgWyAnYW5zaS1iJywgMTEuMCwgMTcuMCwgJ2luJyBdLFxuICBbICdhbnNpLWMnLCAxNy4wLCAyMi4wLCAnaW4nIF0sXG4gIFsgJ2Fuc2ktZCcsIDIyLjAsIDM0LjAsICdpbicgXSxcbiAgWyAnYW5zaS1lJywgMzQuMCwgNDQuMCwgJ2luJyBdLFxuICBbICdhcmNoLWEnLCA5LCAxMiwgJ2luJyBdLFxuICBbICdhcmNoLWInLCAxMiwgMTgsICdpbicgXSxcbiAgWyAnYXJjaC1jJywgMTgsIDI0LCAnaW4nIF0sXG4gIFsgJ2FyY2gtZCcsIDI0LCAzNiwgJ2luJyBdLFxuICBbICdhcmNoLWUnLCAzNiwgNDgsICdpbicgXSxcbiAgWyAnYXJjaC1lMScsIDMwLCA0MiwgJ2luJyBdLFxuICBbICdhcmNoLWUyJywgMjYsIDM4LCAnaW4nIF0sXG4gIFsgJ2FyY2gtZTMnLCAyNywgMzksICdpbicgXVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZGF0YS5yZWR1Y2UoKGRpY3QsIHByZXNldCkgPT4ge1xuICBjb25zdCBpdGVtID0ge1xuICAgIHVuaXRzOiBwcmVzZXRbM10gfHwgZGVmYXVsdFVuaXRzLFxuICAgIGRpbWVuc2lvbnM6IFsgcHJlc2V0WzFdLCBwcmVzZXRbMl0gXVxuICB9O1xuICBkaWN0W3ByZXNldFswXV0gPSBpdGVtO1xuICBkaWN0W3ByZXNldFswXS5yZXBsYWNlKC8tL2csICcgJyldID0gaXRlbTtcbiAgcmV0dXJuIGRpY3Q7XG59LCB7fSk7XG4iLCJpbXBvcnQgcGFwZXJTaXplcyBmcm9tICcuL3BhcGVyLXNpemVzJztcbmltcG9ydCBjb252ZXJ0TGVuZ3RoIGZyb20gJ2NvbnZlcnQtbGVuZ3RoJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERpbWVuc2lvbnNGcm9tUHJlc2V0IChkaW1lbnNpb25zLCB1bml0c1RvID0gJ3B4JywgcGl4ZWxzUGVySW5jaCA9IDcyKSB7XG4gIGlmICh0eXBlb2YgZGltZW5zaW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBrZXkgPSBkaW1lbnNpb25zLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCEoa2V5IGluIHBhcGVyU2l6ZXMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBkaW1lbnNpb24gcHJlc2V0IFwiJHtkaW1lbnNpb25zfVwiIGlzIG5vdCBzdXBwb3J0ZWQgb3IgY291bGQgbm90IGJlIGZvdW5kOyB0cnkgdXNpbmcgYTQsIGEzLCBwb3N0Y2FyZCwgbGV0dGVyLCBldGMuYClcbiAgICB9XG4gICAgY29uc3QgcHJlc2V0ID0gcGFwZXJTaXplc1trZXldO1xuICAgIHJldHVybiBwcmVzZXQuZGltZW5zaW9ucy5tYXAoZCA9PiB7XG4gICAgICByZXR1cm4gY29udmVydERpc3RhbmNlKGQsIHByZXNldC51bml0cywgdW5pdHNUbywgcGl4ZWxzUGVySW5jaCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRpbWVuc2lvbnM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnREaXN0YW5jZSAoZGltZW5zaW9uLCB1bml0c0Zyb20gPSAncHgnLCB1bml0c1RvID0gJ3B4JywgcGl4ZWxzUGVySW5jaCA9IDcyKSB7XG4gIHJldHVybiBjb252ZXJ0TGVuZ3RoKGRpbWVuc2lvbiwgdW5pdHNGcm9tLCB1bml0c1RvLCB7XG4gICAgcGl4ZWxzUGVySW5jaCxcbiAgICBwcmVjaXNpb246IDQsXG4gICAgcm91bmRQaXhlbDogdHJ1ZVxuICB9KTtcbn1cbiIsImltcG9ydCBkZWZpbmVkIGZyb20gJ2RlZmluZWQnO1xuaW1wb3J0IHsgZ2V0RGltZW5zaW9uc0Zyb21QcmVzZXQsIGNvbnZlcnREaXN0YW5jZSB9IGZyb20gJy4uL2Rpc3RhbmNlcyc7XG5pbXBvcnQgeyBpc0Jyb3dzZXIgfSBmcm9tICcuLi91dGlsJztcblxuZnVuY3Rpb24gY2hlY2tJZkhhc0RpbWVuc2lvbnMgKHNldHRpbmdzKSB7XG4gIGlmICghc2V0dGluZ3MuZGltZW5zaW9ucykgcmV0dXJuIGZhbHNlO1xuICBpZiAodHlwZW9mIHNldHRpbmdzLmRpbWVuc2lvbnMgPT09ICdzdHJpbmcnKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc2V0dGluZ3MuZGltZW5zaW9ucykgJiYgc2V0dGluZ3MuZGltZW5zaW9ucy5sZW5ndGggPj0gMikgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0UGFyZW50U2l6ZSAocHJvcHMsIHNldHRpbmdzKSB7XG4gIC8vIFdoZW4gbm8geyBkaW1lbnNpb24gfSBpcyBwYXNzZWQgaW4gbm9kZSwgd2UgZGVmYXVsdCB0byBIVE1MIGNhbnZhcyBzaXplXG4gIGlmICghaXNCcm93c2VyKSB7XG4gICAgcmV0dXJuIFsgMzAwLCAxNTAgXTtcbiAgfVxuXG4gIGxldCBlbGVtZW50ID0gc2V0dGluZ3MucGFyZW50IHx8IHdpbmRvdztcblxuICBpZiAoZWxlbWVudCA9PT0gd2luZG93IHx8XG4gICAgICBlbGVtZW50ID09PSBkb2N1bWVudCB8fFxuICAgICAgZWxlbWVudCA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgIHJldHVybiBbIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgXTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIFsgd2lkdGgsIGhlaWdodCBdO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc2l6ZUNhbnZhcyAocHJvcHMsIHNldHRpbmdzKSB7XG4gIGxldCB3aWR0aCwgaGVpZ2h0O1xuICBsZXQgc3R5bGVXaWR0aCwgc3R5bGVIZWlnaHQ7XG4gIGxldCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0O1xuXG4gIGNvbnN0IGRpbWVuc2lvbnMgPSBzZXR0aW5ncy5kaW1lbnNpb25zO1xuICBjb25zdCBoYXNEaW1lbnNpb25zID0gY2hlY2tJZkhhc0RpbWVuc2lvbnMoc2V0dGluZ3MpO1xuICBjb25zdCBleHBvcnRpbmcgPSBwcm9wcy5leHBvcnRpbmc7XG4gIGNvbnN0IHNjYWxlVG9GaXQgPSBoYXNEaW1lbnNpb25zID8gc2V0dGluZ3Muc2NhbGVUb0ZpdCAhPT0gZmFsc2UgOiBmYWxzZTtcbiAgY29uc3Qgc2NhbGVUb1ZpZXcgPSAoIWV4cG9ydGluZyAmJiBoYXNEaW1lbnNpb25zKSA/IHNldHRpbmdzLnNjYWxlVG9WaWV3IDogdHJ1ZTtcbiAgY29uc3QgdW5pdHMgPSBzZXR0aW5ncy51bml0cztcbiAgY29uc3QgcGl4ZWxzUGVySW5jaCA9ICh0eXBlb2Ygc2V0dGluZ3MucGl4ZWxzUGVySW5jaCA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoc2V0dGluZ3MucGl4ZWxzUGVySW5jaCkpID8gc2V0dGluZ3MucGl4ZWxzUGVySW5jaCA6IDcyO1xuICBjb25zdCBibGVlZCA9IGRlZmluZWQoc2V0dGluZ3MuYmxlZWQsIDApO1xuXG4gIGNvbnN0IGRldmljZVBpeGVsUmF0aW8gPSBpc0Jyb3dzZXIoKSA/IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIDogMTtcbiAgY29uc3QgYmFzZVBpeGVsUmF0aW8gPSBzY2FsZVRvVmlldyA/IGRldmljZVBpeGVsUmF0aW8gOiAxO1xuXG4gIGxldCBwaXhlbFJhdGlvLCBleHBvcnRQaXhlbFJhdGlvO1xuXG4gIC8vIElmIGEgcGl4ZWwgcmF0aW8gaXMgc3BlY2lmaWVkLCB3ZSB3aWxsIHVzZSBpdC5cbiAgLy8gT3RoZXJ3aXNlOlxuICAvLyAgLT4gSWYgZGltZW5zaW9uIGlzIHNwZWNpZmllZCwgdXNlIGJhc2UgcmF0aW8gKGkuZS4gc2l6ZSBmb3IgZXhwb3J0KVxuICAvLyAgLT4gSWYgbm8gZGltZW5zaW9uIGlzIHNwZWNpZmllZCwgdXNlIGRldmljZSByYXRpbyAoaS5lLiBzaXplIGZvciBzY3JlZW4pXG4gIGlmICh0eXBlb2Ygc2V0dGluZ3MucGl4ZWxSYXRpbyA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoc2V0dGluZ3MucGl4ZWxSYXRpbykpIHtcbiAgICAvLyBXaGVuIHsgcGl4ZWxSYXRpbyB9IGlzIHNwZWNpZmllZCwgaXQncyBhbHNvIHVzZWQgYXMgZGVmYXVsdCBleHBvcnRQaXhlbFJhdGlvLlxuICAgIHBpeGVsUmF0aW8gPSBzZXR0aW5ncy5waXhlbFJhdGlvO1xuICAgIGV4cG9ydFBpeGVsUmF0aW8gPSBkZWZpbmVkKHNldHRpbmdzLmV4cG9ydFBpeGVsUmF0aW8sIHBpeGVsUmF0aW8pO1xuICB9IGVsc2Uge1xuICAgIGlmIChoYXNEaW1lbnNpb25zKSB7XG4gICAgICAvLyBXaGVuIGEgZGltZW5zaW9uIGlzIHNwZWNpZmllZCwgdXNlIHRoZSBiYXNlIHJhdGlvIHJhdGhlciB0aGFuIHNjcmVlbiByYXRpb1xuICAgICAgcGl4ZWxSYXRpbyA9IGJhc2VQaXhlbFJhdGlvO1xuICAgICAgLy8gRGVmYXVsdCB0byBhIHBpeGVsIHJhdGlvIG9mIDEgc28gdGhhdCB5b3UgZW5kIHVwIHdpdGggdGhlIHNhbWUgZGltZW5zaW9uXG4gICAgICAvLyB5b3Ugc3BlY2lmaWVkLCBpLmUuIFsgNTAwLCA1MDAgXSBpcyBleHBvcnRlZCBhcyA1MDB4NTAwIHB4XG4gICAgICBleHBvcnRQaXhlbFJhdGlvID0gZGVmaW5lZChzZXR0aW5ncy5leHBvcnRQaXhlbFJhdGlvLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gZGltZW5zaW9uIGlzIHNwZWNpZmllZCwgYXNzdW1lIGZ1bGwtc2NyZWVuIHNpemluZ1xuICAgICAgcGl4ZWxSYXRpbyA9IGRldmljZVBpeGVsUmF0aW87XG4gICAgICAvLyBEZWZhdWx0IHRvIHNjcmVlbiBwaXhlbCByYXRpbywgc28gdGhhdCBpdCdzIGxpa2UgdGFraW5nIGEgZGV2aWNlIHNjcmVlbnNob3RcbiAgICAgIGV4cG9ydFBpeGVsUmF0aW8gPSBkZWZpbmVkKHNldHRpbmdzLmV4cG9ydFBpeGVsUmF0aW8sIHBpeGVsUmF0aW8pO1xuICAgIH1cbiAgfVxuXG4gIC8vIENsYW1wIHBpeGVsIHJhdGlvXG4gIGlmICh0eXBlb2Ygc2V0dGluZ3MubWF4UGl4ZWxSYXRpbyA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoc2V0dGluZ3MubWF4UGl4ZWxSYXRpbykpIHtcbiAgICBwaXhlbFJhdGlvID0gTWF0aC5taW4oc2V0dGluZ3MubWF4UGl4ZWxSYXRpbywgcGl4ZWxSYXRpbyk7XG4gICAgZXhwb3J0UGl4ZWxSYXRpbyA9IE1hdGgubWluKHNldHRpbmdzLm1heFBpeGVsUmF0aW8sIGV4cG9ydFBpeGVsUmF0aW8pO1xuICB9XG5cbiAgLy8gSGFuZGxlIGV4cG9ydCBwaXhlbCByYXRpb1xuICBpZiAoZXhwb3J0aW5nKSB7XG4gICAgcGl4ZWxSYXRpbyA9IGV4cG9ydFBpeGVsUmF0aW87XG4gIH1cblxuICAvLyBwYXJlbnRXaWR0aCA9IHR5cGVvZiBwYXJlbnRXaWR0aCA9PT0gJ3VuZGVmaW5lZCcgPyBkZWZhdWx0Tm9kZVNpemVbMF0gOiBwYXJlbnRXaWR0aDtcbiAgLy8gcGFyZW50SGVpZ2h0ID0gdHlwZW9mIHBhcmVudEhlaWdodCA9PT0gJ3VuZGVmaW5lZCcgPyBkZWZhdWx0Tm9kZVNpemVbMV0gOiBwYXJlbnRIZWlnaHQ7XG5cbiAgbGV0IFsgcGFyZW50V2lkdGgsIHBhcmVudEhlaWdodCBdID0gZ2V0UGFyZW50U2l6ZShwcm9wcywgc2V0dGluZ3MpO1xuICBsZXQgdHJpbVdpZHRoLCB0cmltSGVpZ2h0O1xuXG4gIC8vIFlvdSBjYW4gc3BlY2lmeSBhIGRpbWVuc2lvbnMgaW4gcGl4ZWxzIG9yIGNtL20vaW4vZXRjXG4gIGlmIChoYXNEaW1lbnNpb25zKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZ2V0RGltZW5zaW9uc0Zyb21QcmVzZXQoZGltZW5zaW9ucywgdW5pdHMsIHBpeGVsc1BlckluY2gpO1xuICAgIGNvbnN0IGhpZ2hlc3QgPSBNYXRoLm1heChyZXN1bHRbMF0sIHJlc3VsdFsxXSk7XG4gICAgY29uc3QgbG93ZXN0ID0gTWF0aC5taW4ocmVzdWx0WzBdLCByZXN1bHRbMV0pO1xuICAgIGlmIChzZXR0aW5ncy5vcmllbnRhdGlvbikge1xuICAgICAgY29uc3QgbGFuZHNjYXBlID0gc2V0dGluZ3Mub3JpZW50YXRpb24gPT09ICdsYW5kc2NhcGUnO1xuICAgICAgd2lkdGggPSBsYW5kc2NhcGUgPyBoaWdoZXN0IDogbG93ZXN0O1xuICAgICAgaGVpZ2h0ID0gbGFuZHNjYXBlID8gbG93ZXN0IDogaGlnaGVzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgd2lkdGggPSByZXN1bHRbMF07XG4gICAgICBoZWlnaHQgPSByZXN1bHRbMV07XG4gICAgfVxuXG4gICAgdHJpbVdpZHRoID0gd2lkdGg7XG4gICAgdHJpbUhlaWdodCA9IGhlaWdodDtcblxuICAgIC8vIEFwcGx5IGJsZWVkIHdoaWNoIGlzIGFzc3VtZWQgdG8gYmUgaW4gdGhlIHNhbWUgdW5pdHNcbiAgICB3aWR0aCArPSBibGVlZCAqIDI7XG4gICAgaGVpZ2h0ICs9IGJsZWVkICogMjtcbiAgfSBlbHNlIHtcbiAgICB3aWR0aCA9IHBhcmVudFdpZHRoO1xuICAgIGhlaWdodCA9IHBhcmVudEhlaWdodDtcbiAgICB0cmltV2lkdGggPSB3aWR0aDtcbiAgICB0cmltSGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgLy8gUmVhbCBzaXplIGluIHBpeGVscyBhZnRlciBQUEkgaXMgdGFrZW4gaW50byBhY2NvdW50XG4gIGxldCByZWFsV2lkdGggPSB3aWR0aDtcbiAgbGV0IHJlYWxIZWlnaHQgPSBoZWlnaHQ7XG4gIGlmIChoYXNEaW1lbnNpb25zICYmIHVuaXRzKSB7XG4gICAgLy8gQ29udmVydCB0byBkaWdpdGFsL3BpeGVsIHVuaXRzIGlmIG5lY2Vzc2FyeVxuICAgIHJlYWxXaWR0aCA9IGNvbnZlcnREaXN0YW5jZSh3aWR0aCwgdW5pdHMsICdweCcsIHBpeGVsc1BlckluY2gpO1xuICAgIHJlYWxIZWlnaHQgPSBjb252ZXJ0RGlzdGFuY2UoaGVpZ2h0LCB1bml0cywgJ3B4JywgcGl4ZWxzUGVySW5jaCk7XG4gIH1cblxuICAvLyBIb3cgYmlnIHRvIHNldCB0aGUgJ3ZpZXcnIG9mIHRoZSBjYW52YXMgaW4gdGhlIGJyb3dzZXIgKGkuZS4gc3R5bGUpXG4gIHN0eWxlV2lkdGggPSBNYXRoLnJvdW5kKHJlYWxXaWR0aCk7XG4gIHN0eWxlSGVpZ2h0ID0gTWF0aC5yb3VuZChyZWFsSGVpZ2h0KTtcblxuICAvLyBJZiB3ZSB3aXNoIHRvIHNjYWxlIHRoZSB2aWV3IHRvIHRoZSBicm93c2VyIHdpbmRvd1xuICBpZiAoc2NhbGVUb0ZpdCAmJiAhZXhwb3J0aW5nICYmIGhhc0RpbWVuc2lvbnMpIHtcbiAgICBjb25zdCBhc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcbiAgICBjb25zdCB3aW5kb3dBc3BlY3QgPSBwYXJlbnRXaWR0aCAvIHBhcmVudEhlaWdodDtcbiAgICBjb25zdCBzY2FsZVRvRml0UGFkZGluZyA9IGRlZmluZWQoc2V0dGluZ3Muc2NhbGVUb0ZpdFBhZGRpbmcsIDQwKTtcbiAgICBjb25zdCBtYXhXaWR0aCA9IE1hdGgucm91bmQocGFyZW50V2lkdGggLSBzY2FsZVRvRml0UGFkZGluZyAqIDIpO1xuICAgIGNvbnN0IG1heEhlaWdodCA9IE1hdGgucm91bmQocGFyZW50SGVpZ2h0IC0gc2NhbGVUb0ZpdFBhZGRpbmcgKiAyKTtcbiAgICBpZiAoc3R5bGVXaWR0aCA+IG1heFdpZHRoIHx8IHN0eWxlSGVpZ2h0ID4gbWF4SGVpZ2h0KSB7XG4gICAgICBpZiAod2luZG93QXNwZWN0ID4gYXNwZWN0KSB7XG4gICAgICAgIHN0eWxlSGVpZ2h0ID0gbWF4SGVpZ2h0O1xuICAgICAgICBzdHlsZVdpZHRoID0gTWF0aC5yb3VuZChzdHlsZUhlaWdodCAqIGFzcGVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHlsZVdpZHRoID0gbWF4V2lkdGg7XG4gICAgICAgIHN0eWxlSGVpZ2h0ID0gTWF0aC5yb3VuZChzdHlsZVdpZHRoIC8gYXNwZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjYW52YXNXaWR0aCA9IHNjYWxlVG9WaWV3ID8gTWF0aC5yb3VuZChwaXhlbFJhdGlvICogc3R5bGVXaWR0aCkgOiBNYXRoLnJvdW5kKGV4cG9ydFBpeGVsUmF0aW8gKiByZWFsV2lkdGgpO1xuICBjYW52YXNIZWlnaHQgPSBzY2FsZVRvVmlldyA/IE1hdGgucm91bmQocGl4ZWxSYXRpbyAqIHN0eWxlSGVpZ2h0KSA6IE1hdGgucm91bmQoZXhwb3J0UGl4ZWxSYXRpbyAqIHJlYWxIZWlnaHQpO1xuXG4gIGNvbnN0IHZpZXdwb3J0V2lkdGggPSBzY2FsZVRvVmlldyA/IE1hdGgucm91bmQoc3R5bGVXaWR0aCkgOiBNYXRoLnJvdW5kKHJlYWxXaWR0aCk7XG4gIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gc2NhbGVUb1ZpZXcgPyBNYXRoLnJvdW5kKHN0eWxlSGVpZ2h0KSA6IE1hdGgucm91bmQocmVhbEhlaWdodCk7XG5cbiAgY29uc3Qgc2NhbGVYID0gY2FudmFzV2lkdGggLyB3aWR0aDtcbiAgY29uc3Qgc2NhbGVZID0gY2FudmFzSGVpZ2h0IC8gaGVpZ2h0O1xuXG4gIC8vIEFzc2lnbiB0byBjdXJyZW50IHByb3BzXG4gIHJldHVybiB7XG4gICAgYmxlZWQsXG4gICAgcGl4ZWxSYXRpbyxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgZGltZW5zaW9uczogWyB3aWR0aCwgaGVpZ2h0IF0sXG4gICAgdW5pdHM6IHVuaXRzIHx8ICdweCcsXG4gICAgc2NhbGVYLFxuICAgIHNjYWxlWSxcbiAgICB2aWV3cG9ydFdpZHRoLFxuICAgIHZpZXdwb3J0SGVpZ2h0LFxuICAgIGNhbnZhc1dpZHRoLFxuICAgIGNhbnZhc0hlaWdodCxcbiAgICB0cmltV2lkdGgsXG4gICAgdHJpbUhlaWdodCxcbiAgICBzdHlsZVdpZHRoLFxuICAgIHN0eWxlSGVpZ2h0XG4gIH07XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGdldENhbnZhc0NvbnRleHRcbmZ1bmN0aW9uIGdldENhbnZhc0NvbnRleHQgKHR5cGUsIG9wdHMpIHtcbiAgaWYgKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSB0eXBlIHN0cmluZycpXG4gIH1cblxuICBvcHRzID0gb3B0cyB8fCB7fVxuXG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnICYmICFvcHRzLmNhbnZhcykge1xuICAgIHJldHVybiBudWxsIC8vIGNoZWNrIGZvciBOb2RlXG4gIH1cblxuICB2YXIgY2FudmFzID0gb3B0cy5jYW52YXMgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgaWYgKHR5cGVvZiBvcHRzLndpZHRoID09PSAnbnVtYmVyJykge1xuICAgIGNhbnZhcy53aWR0aCA9IG9wdHMud2lkdGhcbiAgfVxuICBpZiAodHlwZW9mIG9wdHMuaGVpZ2h0ID09PSAnbnVtYmVyJykge1xuICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRzLmhlaWdodFxuICB9XG5cbiAgdmFyIGF0dHJpYnMgPSBvcHRzXG4gIHZhciBnbFxuICB0cnkge1xuICAgIHZhciBuYW1lcyA9IFsgdHlwZSBdXG4gICAgLy8gcHJlZml4IEdMIGNvbnRleHRzXG4gICAgaWYgKHR5cGUuaW5kZXhPZignd2ViZ2wnKSA9PT0gMCkge1xuICAgICAgbmFtZXMucHVzaCgnZXhwZXJpbWVudGFsLScgKyB0eXBlKVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGdsID0gY2FudmFzLmdldENvbnRleHQobmFtZXNbaV0sIGF0dHJpYnMpXG4gICAgICBpZiAoZ2wpIHJldHVybiBnbFxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGdsID0gbnVsbFxuICB9XG4gIHJldHVybiAoZ2wgfHwgbnVsbCkgLy8gZW5zdXJlIG51bGwgb24gZmFpbFxufVxuIiwiaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJztcbmltcG9ydCBnZXRDYW52YXNDb250ZXh0IGZyb20gJ2dldC1jYW52YXMtY29udGV4dCc7XG5pbXBvcnQgeyBpc0Jyb3dzZXIgfSBmcm9tICcuLi91dGlsJztcblxuZnVuY3Rpb24gY3JlYXRlQ2FudmFzRWxlbWVudCAoKSB7XG4gIGlmICghaXNCcm93c2VyKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0l0IGFwcGVhcnMgeW91IGFyZSBydW5pbmcgZnJvbSBOb2RlLmpzIG9yIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnQuIFRyeSBwYXNzaW5nIGluIGFuIGV4aXN0aW5nIHsgY2FudmFzIH0gaW50ZXJmYWNlIGluc3RlYWQuJyk7XG4gIH1cbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDYW52YXMgKHNldHRpbmdzID0ge30pIHtcbiAgbGV0IGNvbnRleHQsIGNhbnZhcztcbiAgbGV0IG93bnNDYW52YXMgPSBmYWxzZTtcbiAgaWYgKHNldHRpbmdzLmNhbnZhcyAhPT0gZmFsc2UpIHtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIGNhbnZhcyBhbmQgY29udGV4dCB0byBjcmVhdGVcbiAgICBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dDtcbiAgICBpZiAoIWNvbnRleHQgfHwgdHlwZW9mIGNvbnRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgbmV3Q2FudmFzID0gc2V0dGluZ3MuY2FudmFzO1xuICAgICAgaWYgKCFuZXdDYW52YXMpIHtcbiAgICAgICAgbmV3Q2FudmFzID0gY3JlYXRlQ2FudmFzRWxlbWVudCgpO1xuICAgICAgICBvd25zQ2FudmFzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHR5cGUgPSBjb250ZXh0IHx8ICcyZCc7XG4gICAgICBpZiAodHlwZW9mIG5ld0NhbnZhcy5nZXRDb250ZXh0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHNwZWNpZmllZCB7IGNhbnZhcyB9IGVsZW1lbnQgZG9lcyBub3QgaGF2ZSBhIGdldENvbnRleHQoKSBmdW5jdGlvbiwgbWF5YmUgaXQgaXMgbm90IGEgPGNhbnZhcz4gdGFnP2ApO1xuICAgICAgfVxuICAgICAgY29udGV4dCA9IGdldENhbnZhc0NvbnRleHQodHlwZSwgYXNzaWduKHt9LCBzZXR0aW5ncy5hdHRyaWJ1dGVzLCB7IGNhbnZhczogbmV3Q2FudmFzIH0pKTtcbiAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCBhdCBjYW52YXMuZ2V0Q29udGV4dCgnJHt0eXBlfScpIC0gdGhlIGJyb3dzZXIgbWF5IG5vdCBzdXBwb3J0IHRoaXMgY29udGV4dCwgb3IgYSBkaWZmZXJlbnQgY29udGV4dCBtYXkgYWxyZWFkeSBiZSBpbiB1c2Ugd2l0aCB0aGlzIGNhbnZhcy5gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYW52YXMgPSBjb250ZXh0LmNhbnZhcztcbiAgICAvLyBFbnN1cmUgY29udGV4dCBtYXRjaGVzIHVzZXIncyBjYW52YXMgZXhwZWN0YXRpb25zXG4gICAgaWYgKHNldHRpbmdzLmNhbnZhcyAmJiBjYW52YXMgIT09IHNldHRpbmdzLmNhbnZhcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgeyBjYW52YXMgfSBhbmQgeyBjb250ZXh0IH0gc2V0dGluZ3MgbXVzdCBwb2ludCB0byB0aGUgc2FtZSB1bmRlcmx5aW5nIGNhbnZhcyBlbGVtZW50Jyk7XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgcGl4ZWxhdGlvbiB0byBjYW52YXMgaWYgbmVjZXNzYXJ5LCB0aGlzIGlzIG1vc3RseSBhIGNvbnZlbmllbmNlIHV0aWxpdHlcbiAgICBpZiAoc2V0dGluZ3MucGl4ZWxhdGVkKSB7XG4gICAgICBjb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgY29udGV4dC5tb3pJbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgIGNvbnRleHQub0ltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgY29udGV4dC53ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgIGNvbnRleHQubXNJbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgIGNhbnZhcy5zdHlsZVsnaW1hZ2UtcmVuZGVyaW5nJ10gPSAncGl4ZWxhdGVkJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgY2FudmFzLCBjb250ZXh0LCBvd25zQ2FudmFzIH07XG59XG4iLCJpbXBvcnQgZGVmaW5lZCBmcm9tICdkZWZpbmVkJztcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgcmlnaHROb3cgZnJvbSAncmlnaHQtbm93JztcbmltcG9ydCBpc1Byb21pc2UgZnJvbSAnaXMtcHJvbWlzZSc7XG5pbXBvcnQgeyBpc0Jyb3dzZXIsIGlzV2ViR0xDb250ZXh0LCBpc0NhbnZhcywgZ2V0Q2xpZW50QVBJIH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xuaW1wb3J0IHsgc2F2ZUZpbGUsIHNhdmVEYXRhVVJMLCBnZXRGaWxlTmFtZSwgZXhwb3J0Q2FudmFzIH0gZnJvbSAnLi4vc2F2ZSc7XG5cbmltcG9ydCBrZXlib2FyZFNob3J0Y3V0cyBmcm9tICcuL2tleWJvYXJkU2hvcnRjdXRzJztcbmltcG9ydCByZXNpemVDYW52YXMgZnJvbSAnLi9yZXNpemVDYW52YXMnO1xuaW1wb3J0IGNyZWF0ZUNhbnZhcyBmcm9tICcuL2NyZWF0ZUNhbnZhcyc7XG5cbmNsYXNzIFNrZXRjaE1hbmFnZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSB7fTtcbiAgICB0aGlzLl9wcm9wcyA9IHt9O1xuICAgIHRoaXMuX3NrZXRjaCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9yYWYgPSBudWxsO1xuXG4gICAgLy8gU29tZSBoYWNreSB0aGluZ3MgcmVxdWlyZWQgdG8gZ2V0IGFyb3VuZCBwNS5qcyBzdHJ1Y3R1cmVcbiAgICB0aGlzLl9sYXN0UmVkcmF3UmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2lzUDVSZXNpemluZyA9IGZhbHNlO1xuXG4gICAgdGhpcy5fa2V5Ym9hcmRTaG9ydGN1dHMgPSBrZXlib2FyZFNob3J0Y3V0cyh7XG4gICAgICBlbmFibGVkOiAoKSA9PiB0aGlzLnNldHRpbmdzLmhvdGtleXMgIT09IGZhbHNlLFxuICAgICAgc2F2ZTogKGV2KSA9PiB7XG4gICAgICAgIGlmIChldi5zaGlmdEtleSkge1xuICAgICAgICAgIGlmICh0aGlzLnByb3BzLnJlY29yZGluZykge1xuICAgICAgICAgICAgdGhpcy5lbmRSZWNvcmQoKTtcbiAgICAgICAgICAgIHRoaXMucnVuKCk7XG4gICAgICAgICAgfSBlbHNlIHRoaXMucmVjb3JkKCk7XG4gICAgICAgIH0gZWxzZSB0aGlzLmV4cG9ydEZyYW1lKCk7XG4gICAgICB9LFxuICAgICAgdG9nZ2xlUGxheTogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5wbGF5aW5nKSB0aGlzLnBhdXNlKCk7XG4gICAgICAgIGVsc2UgdGhpcy5wbGF5KCk7XG4gICAgICB9LFxuICAgICAgY29tbWl0OiAoZXYpID0+IHtcbiAgICAgICAgdGhpcy5leHBvcnRGcmFtZSh7IGNvbW1pdDogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2FuaW1hdGVIYW5kbGVyID0gKCkgPT4gdGhpcy5hbmltYXRlKCk7XG5cbiAgICB0aGlzLl9yZXNpemVIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgY29uc3QgY2hhbmdlZCA9IHRoaXMucmVzaXplKCk7XG4gICAgICAvLyBPbmx5IHJlLXJlbmRlciB3aGVuIHNpemUgYWN0dWFsbHkgY2hhbmdlc1xuICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2V0IHNrZXRjaCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NrZXRjaDtcbiAgfVxuXG4gIGdldCBzZXR0aW5ncyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NldHRpbmdzO1xuICB9XG5cbiAgZ2V0IHByb3BzICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHJvcHM7XG4gIH1cblxuICBfY29tcHV0ZVBsYXloZWFkIChjdXJyZW50VGltZSwgZHVyYXRpb24pIHtcbiAgICBjb25zdCBoYXNEdXJhdGlvbiA9IHR5cGVvZiBkdXJhdGlvbiA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoZHVyYXRpb24pO1xuICAgIHJldHVybiBoYXNEdXJhdGlvbiA/IGN1cnJlbnRUaW1lIC8gZHVyYXRpb24gOiAwO1xuICB9XG5cbiAgX2NvbXB1dGVGcmFtZSAocGxheWhlYWQsIHRpbWUsIHRvdGFsRnJhbWVzLCBmcHMpIHtcbiAgICByZXR1cm4gKGlzRmluaXRlKHRvdGFsRnJhbWVzKSAmJiB0b3RhbEZyYW1lcyA+IDEpXG4gICAgICA/IE1hdGguZmxvb3IocGxheWhlYWQgKiAodG90YWxGcmFtZXMgLSAxKSlcbiAgICAgIDogTWF0aC5mbG9vcihmcHMgKiB0aW1lKTtcbiAgfVxuXG4gIF9jb21wdXRlQ3VycmVudEZyYW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcHV0ZUZyYW1lKFxuICAgICAgdGhpcy5wcm9wcy5wbGF5aGVhZCwgdGhpcy5wcm9wcy50aW1lLFxuICAgICAgdGhpcy5wcm9wcy50b3RhbEZyYW1lcywgdGhpcy5wcm9wcy5mcHNcbiAgICApO1xuICB9XG5cbiAgX2dldFNpemVQcm9wcyAoKSB7XG4gICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiB7XG4gICAgICB3aWR0aDogcHJvcHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHByb3BzLmhlaWdodCxcbiAgICAgIHBpeGVsUmF0aW86IHByb3BzLnBpeGVsUmF0aW8sXG4gICAgICBjYW52YXNXaWR0aDogcHJvcHMuY2FudmFzV2lkdGgsXG4gICAgICBjYW52YXNIZWlnaHQ6IHByb3BzLmNhbnZhc0hlaWdodCxcbiAgICAgIHZpZXdwb3J0V2lkdGg6IHByb3BzLnZpZXdwb3J0V2lkdGgsXG4gICAgICB2aWV3cG9ydEhlaWdodDogcHJvcHMudmlld3BvcnRIZWlnaHRcbiAgICB9O1xuICB9XG5cbiAgcnVuICgpIHtcbiAgICBpZiAoIXRoaXMuc2tldGNoKSB0aHJvdyBuZXcgRXJyb3IoJ3Nob3VsZCB3YWl0IHVudGlsIHNrZXRjaCBpcyBsb2FkZWQgYmVmb3JlIHRyeWluZyB0byBwbGF5KCknKTtcblxuICAgIC8vIFN0YXJ0IGFuIGFuaW1hdGlvbiBmcmFtZSBsb29wIGlmIG5lY2Vzc2FyeVxuICAgIGlmICh0aGlzLnNldHRpbmdzLnBsYXlpbmcgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG5cbiAgICAvLyBMZXQncyBsZXQgdGhpcyB3YXJuaW5nIGhhbmcgYXJvdW5kIGZvciBhIGZldyB2ZXJzaW9ucy4uLlxuICAgIGlmICh0eXBlb2YgdGhpcy5za2V0Y2guZGlzcG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdJbiBjYW52YXMtc2tldGNoQDAuMC4yMyB0aGUgZGlzcG9zZSgpIGV2ZW50IGhhcyBiZWVuIHJlbmFtZWQgdG8gdW5sb2FkKCknKTtcbiAgICB9XG5cbiAgICAvLyBJbiBjYXNlIHdlIGFyZW4ndCBwbGF5aW5nIG9yIGFuaW1hdGVkLCBtYWtlIHN1cmUgd2Ugc3RpbGwgdHJpZ2dlciBiZWdpbiBtZXNzYWdlLi4uXG4gICAgaWYgKCF0aGlzLnByb3BzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuX3NpZ25hbEJlZ2luKCk7XG4gICAgICB0aGlzLnByb3BzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFJlbmRlciBhbiBpbml0aWFsIGZyYW1lXG4gICAgdGhpcy50aWNrKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHBsYXkgKCkge1xuICAgIGxldCBhbmltYXRlID0gdGhpcy5zZXR0aW5ncy5hbmltYXRlO1xuICAgIGlmICgnYW5pbWF0aW9uJyBpbiB0aGlzLnNldHRpbmdzKSB7XG4gICAgICBhbmltYXRlID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUud2FybignW2NhbnZhcy1za2V0Y2hdIHsgYW5pbWF0aW9uIH0gaGFzIGJlZW4gcmVuYW1lZCB0byB7IGFuaW1hdGUgfScpO1xuICAgIH1cbiAgICBpZiAoIWFuaW1hdGUpIHJldHVybjtcbiAgICBpZiAoIWlzQnJvd3NlcigpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbY2FudmFzLXNrZXRjaF0gV0FSTjogVXNpbmcgeyBhbmltYXRlIH0gaW4gTm9kZS5qcyBpcyBub3QgeWV0IHN1cHBvcnRlZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5wbGF5aW5nKSByZXR1cm47XG4gICAgaWYgKCF0aGlzLnByb3BzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuX3NpZ25hbEJlZ2luKCk7XG4gICAgICB0aGlzLnByb3BzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdwbGF5JywgdGhpcy5wcm9wcy50aW1lKVxuXG4gICAgLy8gU3RhcnQgYSByZW5kZXIgbG9vcFxuICAgIHRoaXMucHJvcHMucGxheWluZyA9IHRydWU7XG4gICAgaWYgKHRoaXMuX3JhZiAhPSBudWxsKSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fcmFmKTtcbiAgICB0aGlzLl9sYXN0VGltZSA9IHJpZ2h0Tm93KCk7XG4gICAgdGhpcy5fcmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9hbmltYXRlSGFuZGxlcik7XG4gIH1cblxuICBwYXVzZSAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVjb3JkaW5nKSB0aGlzLmVuZFJlY29yZCgpO1xuICAgIHRoaXMucHJvcHMucGxheWluZyA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX3JhZiAhPSBudWxsICYmIGlzQnJvd3NlcigpKSB7XG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fcmFmKTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVQbGF5ICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5wbGF5aW5nKSB0aGlzLnBhdXNlKCk7XG4gICAgZWxzZSB0aGlzLnBsYXkoKTtcbiAgfVxuXG4gIC8vIFN0b3AgYW5kIHJlc2V0IHRvIGZyYW1lIHplcm9cbiAgc3RvcCAoKSB7XG4gICAgdGhpcy5wYXVzZSgpO1xuICAgIHRoaXMucHJvcHMuZnJhbWUgPSAwO1xuICAgIHRoaXMucHJvcHMucGxheWhlYWQgPSAwO1xuICAgIHRoaXMucHJvcHMudGltZSA9IDA7XG4gICAgdGhpcy5wcm9wcy5kZWx0YVRpbWUgPSAwO1xuICAgIHRoaXMucHJvcHMuc3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZWNvcmQgKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnJlY29yZGluZykgcmV0dXJuO1xuICAgIGlmICghaXNCcm93c2VyKCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tjYW52YXMtc2tldGNoXSBXQVJOOiBSZWNvcmRpbmcgZnJvbSBOb2RlLmpzIGlzIG5vdCB5ZXQgc3VwcG9ydGVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5wcm9wcy5wbGF5aW5nID0gdHJ1ZTtcbiAgICB0aGlzLnByb3BzLnJlY29yZGluZyA9IHRydWU7XG5cbiAgICBjb25zdCBmcmFtZUludGVydmFsID0gMSAvIHRoaXMucHJvcHMuZnBzO1xuICAgIC8vIFJlbmRlciBlYWNoIGZyYW1lIGluIHRoZSBzZXF1ZW5jZVxuICAgIGlmICh0aGlzLl9yYWYgIT0gbnVsbCkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX3JhZik7XG4gICAgY29uc3QgdGljayA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5wcm9wcy5yZWNvcmRpbmcpIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIHRoaXMucHJvcHMuZGVsdGFUaW1lID0gZnJhbWVJbnRlcnZhbDtcbiAgICAgIHRoaXMudGljaygpO1xuICAgICAgcmV0dXJuIHRoaXMuZXhwb3J0RnJhbWUoeyBzZXF1ZW5jZTogdHJ1ZSB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnByb3BzLnJlY29yZGluZykgcmV0dXJuOyAvLyB3YXMgY2FuY2VsbGVkIGJlZm9yZVxuICAgICAgICAgIHRoaXMucHJvcHMuZGVsdGFUaW1lID0gMDtcbiAgICAgICAgICB0aGlzLnByb3BzLmZyYW1lKys7XG4gICAgICAgICAgaWYgKHRoaXMucHJvcHMuZnJhbWUgPCB0aGlzLnByb3BzLnRvdGFsRnJhbWVzKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnRpbWUgKz0gZnJhbWVJbnRlcnZhbDtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucGxheWhlYWQgPSB0aGlzLl9jb21wdXRlUGxheWhlYWQodGhpcy5wcm9wcy50aW1lLCB0aGlzLnByb3BzLmR1cmF0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX3JhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGaW5pc2hlZCByZWNvcmRpbmcnKTtcbiAgICAgICAgICAgIHRoaXMuX3NpZ25hbEVuZCgpO1xuICAgICAgICAgICAgdGhpcy5lbmRSZWNvcmQoKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5ydW4oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBUcmlnZ2VyIGEgc3RhcnQgZXZlbnQgYmVmb3JlIHdlIGJlZ2luIHJlY29yZGluZ1xuICAgIGlmICghdGhpcy5wcm9wcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLl9zaWduYWxCZWdpbigpO1xuICAgICAgdGhpcy5wcm9wcy5zdGFydGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLl9yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICB9XG5cbiAgX3NpZ25hbEJlZ2luICgpIHtcbiAgICBpZiAodGhpcy5za2V0Y2ggJiYgdHlwZW9mIHRoaXMuc2tldGNoLmJlZ2luID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl93cmFwQ29udGV4dFNjYWxlKHByb3BzID0+IHRoaXMuc2tldGNoLmJlZ2luKHByb3BzKSk7XG4gICAgfVxuICB9XG5cbiAgX3NpZ25hbEVuZCAoKSB7XG4gICAgaWYgKHRoaXMuc2tldGNoICYmIHR5cGVvZiB0aGlzLnNrZXRjaC5lbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuX3dyYXBDb250ZXh0U2NhbGUocHJvcHMgPT4gdGhpcy5za2V0Y2guZW5kKHByb3BzKSk7XG4gICAgfVxuICB9XG5cbiAgZW5kUmVjb3JkICgpIHtcbiAgICBpZiAodGhpcy5fcmFmICE9IG51bGwgJiYgaXNCcm93c2VyKCkpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9yYWYpO1xuICAgIHRoaXMucHJvcHMucmVjb3JkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5wcm9wcy5kZWx0YVRpbWUgPSAwO1xuICAgIHRoaXMucHJvcHMucGxheWluZyA9IGZhbHNlO1xuICB9XG5cbiAgZXhwb3J0RnJhbWUgKG9wdCA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLnNrZXRjaCkgcmV0dXJuIFByb21pc2UuYWxsKFtdKTtcbiAgICBpZiAodHlwZW9mIHRoaXMuc2tldGNoLnByZUV4cG9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5za2V0Y2gucHJlRXhwb3J0KCk7XG4gICAgfVxuXG4gICAgLy8gT3B0aW9ucyBmb3IgZXhwb3J0IGZ1bmN0aW9uXG4gICAgbGV0IGV4cG9ydE9wdHMgPSBhc3NpZ24oe1xuICAgICAgc2VxdWVuY2U6IG9wdC5zZXF1ZW5jZSxcbiAgICAgIGZyYW1lOiBvcHQuc2VxdWVuY2UgPyB0aGlzLnByb3BzLmZyYW1lIDogdW5kZWZpbmVkLFxuICAgICAgZmlsZTogdGhpcy5zZXR0aW5ncy5maWxlLFxuICAgICAgbmFtZTogdGhpcy5zZXR0aW5ncy5uYW1lLFxuICAgICAgcHJlZml4OiB0aGlzLnNldHRpbmdzLnByZWZpeCxcbiAgICAgIHN1ZmZpeDogdGhpcy5zZXR0aW5ncy5zdWZmaXgsXG4gICAgICBlbmNvZGluZzogdGhpcy5zZXR0aW5ncy5lbmNvZGluZyxcbiAgICAgIGVuY29kaW5nUXVhbGl0eTogdGhpcy5zZXR0aW5ncy5lbmNvZGluZ1F1YWxpdHksXG4gICAgICB0aW1lU3RhbXA6IGdldEZpbGVOYW1lKCksXG4gICAgICB0b3RhbEZyYW1lczogaXNGaW5pdGUodGhpcy5wcm9wcy50b3RhbEZyYW1lcykgPyBNYXRoLm1heCgxMDAsIHRoaXMucHJvcHMudG90YWxGcmFtZXMpIDogMTAwMFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2xpZW50ID0gZ2V0Q2xpZW50QVBJKCk7XG4gICAgbGV0IHAgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBpZiAoY2xpZW50ICYmIG9wdC5jb21taXQgJiYgdHlwZW9mIGNsaWVudC5jb21taXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IGNvbW1pdE9wdHMgPSBhc3NpZ24oe30sIGV4cG9ydE9wdHMpO1xuICAgICAgY29uc3QgaGFzaCA9IGNsaWVudC5jb21taXQoY29tbWl0T3B0cyk7XG4gICAgICBpZiAoaXNQcm9taXNlKGhhc2gpKSBwID0gaGFzaDtcbiAgICAgIGVsc2UgcCA9IFByb21pc2UucmVzb2x2ZShoYXNoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcC50aGVuKGhhc2ggPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2RvRXhwb3J0RnJhbWUoYXNzaWduKHt9LCBleHBvcnRPcHRzLCB7IGhhc2g6IGhhc2ggfHwgJycgfSkpO1xuICAgIH0pO1xuICB9XG5cbiAgX2RvRXhwb3J0RnJhbWUgKGV4cG9ydE9wdHMgPSB7fSkge1xuICAgIHRoaXMuX3Byb3BzLmV4cG9ydGluZyA9IHRydWU7XG5cbiAgICAvLyBSZXNpemUgdG8gb3V0cHV0IHJlc29sdXRpb25cbiAgICB0aGlzLnJlc2l6ZSgpO1xuXG4gICAgLy8gRHJhdyBhdCB0aGlzIG91dHB1dCByZXNvbHV0aW9uXG4gICAgbGV0IGRyYXdSZXN1bHQgPSB0aGlzLnJlbmRlcigpO1xuXG4gICAgLy8gVGhlIHNlbGYgb3duZWQgY2FudmFzIChtYXkgYmUgdW5kZWZpbmVkLi4uISlcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnByb3BzLmNhbnZhcztcblxuICAgIC8vIEdldCBsaXN0IG9mIHJlc3VsdHMgZnJvbSByZW5kZXJcbiAgICBpZiAodHlwZW9mIGRyYXdSZXN1bHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBkcmF3UmVzdWx0ID0gWyBjYW52YXMgXTtcbiAgICB9XG4gICAgZHJhd1Jlc3VsdCA9IFtdLmNvbmNhdChkcmF3UmVzdWx0KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAvLyBUcmFuc2Zvcm0gdGhlIGNhbnZhcy9maWxlIGRlc2NyaXB0b3JzIGludG8gYSBjb25zaXN0ZW50IGZvcm1hdCxcbiAgICAvLyBhbmQgcHVsbCBvdXQgYW55IGRhdGEgVVJMcyBmcm9tIGNhbnZhcyBlbGVtZW50c1xuICAgIGRyYXdSZXN1bHQgPSBkcmF3UmVzdWx0Lm1hcChyZXN1bHQgPT4ge1xuICAgICAgY29uc3QgaGFzRGF0YU9iamVjdCA9IHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnICYmIHJlc3VsdCAmJiAoJ2RhdGEnIGluIHJlc3VsdCB8fCAnZGF0YVVSTCcgaW4gcmVzdWx0KTtcbiAgICAgIGNvbnN0IGRhdGEgPSBoYXNEYXRhT2JqZWN0ID8gcmVzdWx0LmRhdGEgOiByZXN1bHQ7XG4gICAgICBjb25zdCBvcHRzID0gaGFzRGF0YU9iamVjdCA/IGFzc2lnbih7fSwgcmVzdWx0LCB7IGRhdGEgfSkgOiB7IGRhdGEgfTtcbiAgICAgIGlmIChpc0NhbnZhcyhkYXRhKSkge1xuICAgICAgICBjb25zdCBlbmNvZGluZyA9IG9wdHMuZW5jb2RpbmcgfHwgZXhwb3J0T3B0cy5lbmNvZGluZztcbiAgICAgICAgY29uc3QgZW5jb2RpbmdRdWFsaXR5ID0gZGVmaW5lZChvcHRzLmVuY29kaW5nUXVhbGl0eSwgZXhwb3J0T3B0cy5lbmNvZGluZ1F1YWxpdHksIDAuOTUpO1xuICAgICAgICBjb25zdCB7IGRhdGFVUkwsIGV4dGVuc2lvbiwgdHlwZSB9ID0gZXhwb3J0Q2FudmFzKGRhdGEsIHsgZW5jb2RpbmcsIGVuY29kaW5nUXVhbGl0eSB9KTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0cywgeyBkYXRhVVJMLCBleHRlbnNpb24sIHR5cGUgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb3B0cztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIE5vdyByZXR1cm4gdG8gcmVndWxhciByZW5kZXJpbmcgbW9kZVxuICAgIHRoaXMuX3Byb3BzLmV4cG9ydGluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVzaXplKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICAgIC8vIEFuZCBub3cgd2UgY2FuIHNhdmUgZWFjaCByZXN1bHRcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoZHJhd1Jlc3VsdC5tYXAoKHJlc3VsdCwgaSwgbGF5ZXJMaXN0KSA9PiB7XG4gICAgICAvLyBCeSBkZWZhdWx0LCBpZiByZW5kZXJpbmcgbXVsdGlwbGUgbGF5ZXJzIHdlIHdpbGwgZ2l2ZSB0aGVtIGluZGljZXNcbiAgICAgIGNvbnN0IGN1ck9wdCA9IGFzc2lnbih7fSwgZXhwb3J0T3B0cywgcmVzdWx0LCB7IGxheWVyOiBpLCB0b3RhbExheWVyczogbGF5ZXJMaXN0Lmxlbmd0aCB9KTtcbiAgICAgIGNvbnN0IGRhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgIGlmIChyZXN1bHQuZGF0YVVSTCkge1xuICAgICAgICBjb25zdCBkYXRhVVJMID0gcmVzdWx0LmRhdGFVUkw7XG4gICAgICAgIGRlbGV0ZSBjdXJPcHQuZGF0YVVSTDsgLy8gYXZvaWQgc2VuZGluZyBlbnRpcmUgYmFzZTY0IGRhdGEgYXJvdW5kXG4gICAgICAgIHJldHVybiBzYXZlRGF0YVVSTChkYXRhVVJMLCBjdXJPcHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNhdmVGaWxlKGRhdGEsIGN1ck9wdCk7XG4gICAgICB9XG4gICAgfSkpLnRoZW4oZXYgPT4ge1xuICAgICAgaWYgKGV2Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgZXZlbnRXaXRoT3V0cHV0ID0gZXYuZmluZChlID0+IGUub3V0cHV0TmFtZSk7XG4gICAgICAgIGNvbnN0IGlzQ2xpZW50ID0gZXYuc29tZShlID0+IGUuY2xpZW50KTtcbiAgICAgICAgbGV0IGl0ZW07XG4gICAgICAgIC8vIG1hbnkgZmlsZXMsIGp1c3QgbG9nIGhvdyBtYW55IHdlcmUgZXhwb3J0ZWRcbiAgICAgICAgaWYgKGV2Lmxlbmd0aCA+IDEpIGl0ZW0gPSBldi5sZW5ndGg7XG4gICAgICAgIC8vIGluIENMSSwgd2Uga25vdyBleGFjdCBwYXRoIGRpcm5hbWVcbiAgICAgICAgZWxzZSBpZiAoZXZlbnRXaXRoT3V0cHV0KSBpdGVtID0gYCR7ZXZlbnRXaXRoT3V0cHV0Lm91dHB1dE5hbWV9LyR7ZXZbMF0uZmlsZW5hbWV9YDtcbiAgICAgICAgLy8gaW4gYnJvd3Nlciwgd2UgY2FuIG9ubHkga25vdyBpdCB3ZW50IHRvIFwiYnJvd3NlciBkb3dubG9hZCBmb2xkZXJcIlxuICAgICAgICBlbHNlIGl0ZW0gPSBgJHtldlswXS5maWxlbmFtZX1gO1xuICAgICAgICBsZXQgb2ZTZXEgPSAnJztcbiAgICAgICAgaWYgKGV4cG9ydE9wdHMuc2VxdWVuY2UpIHtcbiAgICAgICAgICBjb25zdCBoYXNUb3RhbEZyYW1lcyA9IGlzRmluaXRlKHRoaXMucHJvcHMudG90YWxGcmFtZXMpO1xuICAgICAgICAgIG9mU2VxID0gaGFzVG90YWxGcmFtZXMgPyBgIChmcmFtZSAke2V4cG9ydE9wdHMuZnJhbWUgKyAxfSAvICR7dGhpcy5wcm9wcy50b3RhbEZyYW1lc30pYCA6IGAgKGZyYW1lICR7ZXhwb3J0T3B0cy5mcmFtZX0pYDtcbiAgICAgICAgfSBlbHNlIGlmIChldi5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgb2ZTZXEgPSBgIGZpbGVzYDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjbGllbnQgPSBpc0NsaWVudCA/ICdjYW52YXMtc2tldGNoLWNsaScgOiAnY2FudmFzLXNrZXRjaCc7XG4gICAgICAgIGNvbnNvbGUubG9nKGAlY1ske2NsaWVudH1dJWMgRXhwb3J0ZWQgJWMke2l0ZW19JWMke29mU2VxfWAsICdjb2xvcjogIzhlOGU4ZTsnLCAnY29sb3I6IGluaXRpYWw7JywgJ2ZvbnQtd2VpZ2h0OiBib2xkOycsICdmb250LXdlaWdodDogaW5pdGlhbDsnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5za2V0Y2gucG9zdEV4cG9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnNrZXRjaC5wb3N0RXhwb3J0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBfd3JhcENvbnRleHRTY2FsZSAoY2IpIHtcbiAgICB0aGlzLl9wcmVSZW5kZXIoKTtcbiAgICBjYih0aGlzLnByb3BzKTtcbiAgICB0aGlzLl9wb3N0UmVuZGVyKCk7XG4gIH1cblxuICBfcHJlUmVuZGVyICgpIHtcbiAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyBTY2FsZSBjb250ZXh0IGZvciB1bml0IHNpemluZ1xuICAgIGlmICghdGhpcy5wcm9wcy5nbCAmJiBwcm9wcy5jb250ZXh0ICYmICFwcm9wcy5wNSkge1xuICAgICAgcHJvcHMuY29udGV4dC5zYXZlKCk7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5zY2FsZUNvbnRleHQgIT09IGZhbHNlKSB7XG4gICAgICAgIHByb3BzLmNvbnRleHQuc2NhbGUocHJvcHMuc2NhbGVYLCBwcm9wcy5zY2FsZVkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocHJvcHMucDUpIHtcbiAgICAgIHByb3BzLnA1LnNjYWxlKHByb3BzLnNjYWxlWCAvIHByb3BzLnBpeGVsUmF0aW8sIHByb3BzLnNjYWxlWSAvIHByb3BzLnBpeGVsUmF0aW8pO1xuICAgIH1cbiAgfVxuXG4gIF9wb3N0UmVuZGVyICgpIHtcbiAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIXRoaXMucHJvcHMuZ2wgJiYgcHJvcHMuY29udGV4dCAmJiAhcHJvcHMucDUpIHtcbiAgICAgIHByb3BzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIC8vIEZsdXNoIGJ5IGRlZmF1bHQsIHRoaXMgbWF5IGJlIHJldmlzaXRlZCBhdCBhIGxhdGVyIHBvaW50LlxuICAgIC8vIFdlIGRvIHRoaXMgdG8gZW5zdXJlIHRvRGF0YVVSTCBjYW4gYmUgY2FsbGVkIGltbWVkaWF0ZWx5IGFmdGVyLlxuICAgIC8vIE1vc3QgbGlrZWx5IGJyb3dzZXJzIGFscmVhZHkgaGFuZGxlIHRoaXMsIHNvIHdlIG1heSByZXZpc2l0IHRoaXMgYW5kXG4gICAgLy8gcmVtb3ZlIGl0IGlmIGl0IGltcHJvdmVzIHBlcmZvcm1hbmNlIHdpdGhvdXQgYW55IHVzYWJpbGl0eSBpc3N1ZXMuXG4gICAgaWYgKHByb3BzLmdsICYmIHRoaXMuc2V0dGluZ3MuZmx1c2ggIT09IGZhbHNlICYmICFwcm9wcy5wNSkge1xuICAgICAgcHJvcHMuZ2wuZmx1c2goKTtcbiAgICB9XG4gIH1cblxuICB0aWNrICgpIHtcbiAgICBpZiAodGhpcy5za2V0Y2ggJiYgdHlwZW9mIHRoaXMuc2tldGNoLnRpY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuX3ByZVJlbmRlcigpO1xuICAgICAgdGhpcy5za2V0Y2gudGljayh0aGlzLnByb3BzKTtcbiAgICAgIHRoaXMuX3Bvc3RSZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnA1KSB7XG4gICAgICB0aGlzLl9sYXN0UmVkcmF3UmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5wcm9wcy5wNS5yZWRyYXcoKTtcbiAgICAgIHJldHVybiB0aGlzLl9sYXN0UmVkcmF3UmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zdWJtaXREcmF3Q2FsbCgpO1xuICAgIH1cbiAgfVxuXG4gIHN1Ym1pdERyYXdDYWxsICgpIHtcbiAgICBpZiAoIXRoaXMuc2tldGNoKSByZXR1cm47XG5cbiAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdGhpcy5fcHJlUmVuZGVyKCk7XG5cbiAgICBsZXQgZHJhd1Jlc3VsdDtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5za2V0Y2ggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRyYXdSZXN1bHQgPSB0aGlzLnNrZXRjaChwcm9wcyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5za2V0Y2gucmVuZGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBkcmF3UmVzdWx0ID0gdGhpcy5za2V0Y2gucmVuZGVyKHByb3BzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9wb3N0UmVuZGVyKCk7XG5cbiAgICByZXR1cm4gZHJhd1Jlc3VsdDtcbiAgfVxuXG4gIHVwZGF0ZSAob3B0ID0ge30pIHtcbiAgICAvLyBDdXJyZW50bHkgdXBkYXRlKCkgaXMgb25seSBmb2N1c2VkIG9uIHJlc2l6aW5nLFxuICAgIC8vIGJ1dCBsYXRlciB3ZSB3aWxsIHN1cHBvcnQgb3RoZXIgb3B0aW9ucyBsaWtlIHN3aXRjaGluZ1xuICAgIC8vIGZyYW1lcyBhbmQgc3VjaC5cbiAgICBjb25zdCBub3RZZXRTdXBwb3J0ZWQgPSBbXG4gICAgICAnYW5pbWF0ZSdcbiAgICBdO1xuXG4gICAgT2JqZWN0LmtleXMob3B0KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAobm90WWV0U3VwcG9ydGVkLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgU29ycnksIHRoZSB7ICR7a2V5fSB9IG9wdGlvbiBpcyBub3QgeWV0IHN1cHBvcnRlZCB3aXRoIHVwZGF0ZSgpLmApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3Qgb2xkQ2FudmFzID0gdGhpcy5fc2V0dGluZ3MuY2FudmFzO1xuICAgIGNvbnN0IG9sZENvbnRleHQgPSB0aGlzLl9zZXR0aW5ncy5jb250ZXh0O1xuXG4gICAgLy8gTWVyZ2UgbmV3IG9wdGlvbnMgaW50byBzZXR0aW5nc1xuICAgIGZvciAobGV0IGtleSBpbiBvcHQpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gb3B0W2tleV07XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykgeyAvLyBpZ25vcmUgdW5kZWZpbmVkXG4gICAgICAgIHRoaXMuX3NldHRpbmdzW2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNZXJnZSBpbiB0aW1lIHByb3BzXG4gICAgY29uc3QgdGltZU9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9zZXR0aW5ncywgb3B0KTtcbiAgICBpZiAoJ3RpbWUnIGluIG9wdCAmJiAnZnJhbWUnIGluIG9wdCkgdGhyb3cgbmV3IEVycm9yKCdZb3Ugc2hvdWxkIHNwZWNpZnkgeyB0aW1lIH0gb3IgeyBmcmFtZSB9IGJ1dCBub3QgYm90aCcpO1xuICAgIGVsc2UgaWYgKCd0aW1lJyBpbiBvcHQpIGRlbGV0ZSB0aW1lT3B0cy5mcmFtZTtcbiAgICBlbHNlIGlmICgnZnJhbWUnIGluIG9wdCkgZGVsZXRlIHRpbWVPcHRzLnRpbWU7XG4gICAgaWYgKCdkdXJhdGlvbicgaW4gb3B0ICYmICd0b3RhbEZyYW1lcycgaW4gb3B0KSB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBzaG91bGQgc3BlY2lmeSB7IGR1cmF0aW9uIH0gb3IgeyB0b3RhbEZyYW1lcyB9IGJ1dCBub3QgYm90aCcpO1xuICAgIGVsc2UgaWYgKCdkdXJhdGlvbicgaW4gb3B0KSBkZWxldGUgdGltZU9wdHMudG90YWxGcmFtZXM7XG4gICAgZWxzZSBpZiAoJ3RvdGFsRnJhbWVzJyBpbiBvcHQpIGRlbGV0ZSB0aW1lT3B0cy5kdXJhdGlvbjtcblxuICAgIGNvbnN0IHRpbWVQcm9wcyA9IHRoaXMuZ2V0VGltZVByb3BzKHRpbWVPcHRzKTtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuX3Byb3BzLCB0aW1lUHJvcHMpO1xuXG4gICAgLy8gSWYgZWl0aGVyIGNhbnZhcyBvciBjb250ZXh0IGlzIGNoYW5nZWQsIHdlIHNob3VsZCByZS11cGRhdGVcbiAgICBpZiAob2xkQ2FudmFzICE9PSB0aGlzLl9zZXR0aW5ncy5jYW52YXMgfHwgb2xkQ29udGV4dCAhPT0gdGhpcy5fc2V0dGluZ3MuY29udGV4dCkge1xuICAgICAgY29uc3QgeyBjYW52YXMsIGNvbnRleHQgfSA9IGNyZWF0ZUNhbnZhcyh0aGlzLl9zZXR0aW5ncyk7XG5cbiAgICAgIHRoaXMucHJvcHMuY2FudmFzID0gY2FudmFzO1xuICAgICAgdGhpcy5wcm9wcy5jb250ZXh0ID0gY29udGV4dDtcblxuICAgICAgLy8gRGVsZXRlIG9yIGFkZCBhICdnbCcgcHJvcCBmb3IgY29udmVuaWVuY2VcbiAgICAgIHRoaXMuX3NldHVwR0xLZXkoKTtcblxuICAgICAgLy8gUmUtbW91bnQgdGhlIG5ldyBjYW52YXMgaWYgaXQgaGFzIG5vIHBhcmVudFxuICAgICAgdGhpcy5fYXBwZW5kQ2FudmFzSWZOZWVkZWQoKTtcbiAgICB9XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gc3VwcG9ydCBQNS5qc1xuICAgIGlmIChvcHQucDUgJiYgdHlwZW9mIG9wdC5wNSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5wcm9wcy5wNSA9IG9wdC5wNTtcbiAgICAgIHRoaXMucHJvcHMucDUuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2lzUDVSZXNpemluZykgcmV0dXJuO1xuICAgICAgICB0aGlzLl9sYXN0UmVkcmF3UmVzdWx0ID0gdGhpcy5zdWJtaXREcmF3Q2FsbCgpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgcGxheWluZyBzdGF0ZSBpZiBuZWNlc3NhcnlcbiAgICBpZiAoJ3BsYXlpbmcnIGluIG9wdCkge1xuICAgICAgaWYgKG9wdC5wbGF5aW5nKSB0aGlzLnBsYXkoKTtcbiAgICAgIGVsc2UgdGhpcy5wYXVzZSgpO1xuICAgIH1cblxuICAgIC8vIERyYXcgbmV3IGZyYW1lXG4gICAgdGhpcy5yZXNpemUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHJldHVybiB0aGlzLnByb3BzO1xuICB9XG5cbiAgcmVzaXplICgpIHtcbiAgICBjb25zdCBvbGRTaXplcyA9IHRoaXMuX2dldFNpemVQcm9wcygpO1xuXG4gICAgY29uc3Qgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzO1xuICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcblxuICAgIC8vIFJlY29tcHV0ZSBuZXcgcHJvcGVydGllcyBiYXNlZCBvbiBjdXJyZW50IHNldHVwXG4gICAgY29uc3QgbmV3UHJvcHMgPSByZXNpemVDYW52YXMocHJvcHMsIHNldHRpbmdzKTtcblxuICAgIC8vIEFzc2lnbiB0byBjdXJyZW50IHByb3BzXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLl9wcm9wcywgbmV3UHJvcHMpO1xuXG4gICAgLy8gTm93IHdlIGFjdHVhbGx5IHVwZGF0ZSB0aGUgY2FudmFzIHdpZHRoL2hlaWdodCBhbmQgc3R5bGUgcHJvcHNcbiAgICBjb25zdCB7XG4gICAgICBwaXhlbFJhdGlvLFxuICAgICAgY2FudmFzV2lkdGgsXG4gICAgICBjYW52YXNIZWlnaHQsXG4gICAgICBzdHlsZVdpZHRoLFxuICAgICAgc3R5bGVIZWlnaHRcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIFVwZGF0ZSBjYW52YXMgc2V0dGluZ3NcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnByb3BzLmNhbnZhcztcbiAgICBpZiAoY2FudmFzICYmIHNldHRpbmdzLnJlc2l6ZUNhbnZhcyAhPT0gZmFsc2UpIHtcbiAgICAgIGlmIChwcm9wcy5wNSkge1xuICAgICAgICAvLyBQNS5qcyBzcGVjaWZpYyBlZGdlIGNhc2VcbiAgICAgICAgaWYgKGNhbnZhcy53aWR0aCAhPT0gY2FudmFzV2lkdGggfHwgY2FudmFzLmhlaWdodCAhPT0gY2FudmFzSGVpZ2h0KSB7XG4gICAgICAgICAgdGhpcy5faXNQNVJlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgICAvLyBUaGlzIGNhdXNlcyBhIHJlLWRyYXcgOlxcIHNvIHdlIGlnbm9yZSBkcmF3cyBpbiB0aGUgbWVhbiB0aW1lLi4uIHNvcnRhIGhhY2t5XG4gICAgICAgICAgcHJvcHMucDUucGl4ZWxEZW5zaXR5KHBpeGVsUmF0aW8pO1xuICAgICAgICAgIHByb3BzLnA1LnJlc2l6ZUNhbnZhcyhjYW52YXNXaWR0aCAvIHBpeGVsUmF0aW8sIGNhbnZhc0hlaWdodCAvIHBpeGVsUmF0aW8sIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl9pc1A1UmVzaXppbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yY2UgY2FudmFzIHNpemVcbiAgICAgICAgaWYgKGNhbnZhcy53aWR0aCAhPT0gY2FudmFzV2lkdGgpIGNhbnZhcy53aWR0aCA9IGNhbnZhc1dpZHRoO1xuICAgICAgICBpZiAoY2FudmFzLmhlaWdodCAhPT0gY2FudmFzSGVpZ2h0KSBjYW52YXMuaGVpZ2h0ID0gY2FudmFzSGVpZ2h0O1xuICAgICAgfVxuICAgICAgLy8gVXBkYXRlIGNhbnZhcyBzdHlsZVxuICAgICAgaWYgKGlzQnJvd3NlcigpICYmIHNldHRpbmdzLnN0eWxlQ2FudmFzICE9PSBmYWxzZSkge1xuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBgJHtzdHlsZVdpZHRofXB4YDtcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke3N0eWxlSGVpZ2h0fXB4YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBuZXdTaXplcyA9IHRoaXMuX2dldFNpemVQcm9wcygpO1xuICAgIGxldCBjaGFuZ2VkID0gIWRlZXBFcXVhbChvbGRTaXplcywgbmV3U2l6ZXMpO1xuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICB0aGlzLl9zaXplQ2hhbmdlZCgpO1xuICAgIH1cbiAgICByZXR1cm4gY2hhbmdlZDtcbiAgfVxuXG4gIF9zaXplQ2hhbmdlZCAoKSB7XG4gICAgLy8gU2VuZCByZXNpemUgZXZlbnQgdG8gc2tldGNoXG4gICAgaWYgKHRoaXMuc2tldGNoICYmIHR5cGVvZiB0aGlzLnNrZXRjaC5yZXNpemUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuc2tldGNoLnJlc2l6ZSh0aGlzLnByb3BzKTtcbiAgICB9XG4gIH1cblxuICBhbmltYXRlICgpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMucGxheWluZykgcmV0dXJuO1xuICAgIGlmICghaXNCcm93c2VyKCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tjYW52YXMtc2tldGNoXSBXQVJOOiBBbmltYXRpb24gaW4gTm9kZS5qcyBpcyBub3QgeWV0IHN1cHBvcnRlZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1hdGVIYW5kbGVyKTtcblxuICAgIGxldCBub3cgPSByaWdodE5vdygpO1xuXG4gICAgY29uc3QgZnBzID0gdGhpcy5wcm9wcy5mcHM7XG4gICAgY29uc3QgZnJhbWVJbnRlcnZhbE1TID0gMTAwMCAvIGZwcztcbiAgICBsZXQgZGVsdGFUaW1lTVMgPSBub3cgLSB0aGlzLl9sYXN0VGltZTtcblxuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5wcm9wcy5kdXJhdGlvbjtcbiAgICBjb25zdCBoYXNEdXJhdGlvbiA9IHR5cGVvZiBkdXJhdGlvbiA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoZHVyYXRpb24pO1xuXG4gICAgbGV0IGlzTmV3RnJhbWUgPSB0cnVlO1xuICAgIGNvbnN0IHBsYXliYWNrUmF0ZSA9IHRoaXMuc2V0dGluZ3MucGxheWJhY2tSYXRlO1xuICAgIGlmIChwbGF5YmFja1JhdGUgPT09ICdmaXhlZCcpIHtcbiAgICAgIGRlbHRhVGltZU1TID0gZnJhbWVJbnRlcnZhbE1TO1xuICAgIH0gZWxzZSBpZiAocGxheWJhY2tSYXRlID09PSAndGhyb3R0bGUnKSB7XG4gICAgICBpZiAoZGVsdGFUaW1lTVMgPiBmcmFtZUludGVydmFsTVMpIHtcbiAgICAgICAgbm93ID0gbm93IC0gKGRlbHRhVGltZU1TICUgZnJhbWVJbnRlcnZhbE1TKTtcbiAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSBub3c7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc05ld0ZyYW1lID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xhc3RUaW1lID0gbm93O1xuICAgIH1cblxuICAgIGNvbnN0IGRlbHRhVGltZSA9IGRlbHRhVGltZU1TIC8gMTAwMDtcbiAgICBsZXQgbmV3VGltZSA9IHRoaXMucHJvcHMudGltZSArIGRlbHRhVGltZSAqIHRoaXMucHJvcHMudGltZVNjYWxlO1xuXG4gICAgLy8gSGFuZGxlIHJldmVyc2UgdGltZSBzY2FsZVxuICAgIGlmIChuZXdUaW1lIDwgMCAmJiBoYXNEdXJhdGlvbikge1xuICAgICAgbmV3VGltZSA9IGR1cmF0aW9uICsgbmV3VGltZTtcbiAgICB9XG5cbiAgICAvLyBSZS1zdGFydCBhbmltYXRpb25cbiAgICBsZXQgaXNGaW5pc2hlZCA9IGZhbHNlO1xuICAgIGxldCBpc0xvb3BTdGFydCA9IGZhbHNlO1xuXG4gICAgY29uc3QgbG9vcGluZyA9IHRoaXMuc2V0dGluZ3MubG9vcCAhPT0gZmFsc2U7XG5cbiAgICBpZiAoaGFzRHVyYXRpb24gJiYgbmV3VGltZSA+PSBkdXJhdGlvbikge1xuICAgICAgLy8gUmUtc3RhcnQgYW5pbWF0aW9uXG4gICAgICBpZiAobG9vcGluZykge1xuICAgICAgICBpc05ld0ZyYW1lID0gdHJ1ZTtcbiAgICAgICAgbmV3VGltZSA9IG5ld1RpbWUgJSBkdXJhdGlvbjtcbiAgICAgICAgaXNMb29wU3RhcnQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNOZXdGcmFtZSA9IGZhbHNlO1xuICAgICAgICBuZXdUaW1lID0gZHVyYXRpb247XG4gICAgICAgIGlzRmluaXNoZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zaWduYWxFbmQoKTtcbiAgICB9XG5cbiAgICBpZiAoaXNOZXdGcmFtZSkge1xuICAgICAgdGhpcy5wcm9wcy5kZWx0YVRpbWUgPSBkZWx0YVRpbWU7XG4gICAgICB0aGlzLnByb3BzLnRpbWUgPSBuZXdUaW1lO1xuICAgICAgdGhpcy5wcm9wcy5wbGF5aGVhZCA9IHRoaXMuX2NvbXB1dGVQbGF5aGVhZChuZXdUaW1lLCBkdXJhdGlvbik7XG4gICAgICBjb25zdCBsYXN0RnJhbWUgPSB0aGlzLnByb3BzLmZyYW1lO1xuICAgICAgdGhpcy5wcm9wcy5mcmFtZSA9IHRoaXMuX2NvbXB1dGVDdXJyZW50RnJhbWUoKTtcbiAgICAgIGlmIChpc0xvb3BTdGFydCkgdGhpcy5fc2lnbmFsQmVnaW4oKTtcbiAgICAgIGlmIChsYXN0RnJhbWUgIT09IHRoaXMucHJvcHMuZnJhbWUpIHRoaXMudGljaygpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgIHRoaXMucHJvcHMuZGVsdGFUaW1lID0gMDtcbiAgICB9XG5cbiAgICBpZiAoaXNGaW5pc2hlZCkge1xuICAgICAgdGhpcy5wYXVzZSgpO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BhdGNoIChjYikge1xuICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBFcnJvcignbXVzdCBwYXNzIGZ1bmN0aW9uIGludG8gZGlzcGF0Y2goKScpO1xuICAgIGNiKHRoaXMucHJvcHMpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBtb3VudCAoKSB7XG4gICAgdGhpcy5fYXBwZW5kQ2FudmFzSWZOZWVkZWQoKTtcbiAgfVxuXG4gIHVubW91bnQgKCkge1xuICAgIGlmIChpc0Jyb3dzZXIoKSkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUhhbmRsZXIpO1xuICAgICAgdGhpcy5fa2V5Ym9hcmRTaG9ydGN1dHMuZGV0YWNoKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLmNhbnZhcy5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLnByb3BzLmNhbnZhcy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMucHJvcHMuY2FudmFzKTtcbiAgICB9XG4gIH1cblxuICBfYXBwZW5kQ2FudmFzSWZOZWVkZWQgKCkge1xuICAgIGlmICghaXNCcm93c2VyKCkpIHJldHVybjtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5wYXJlbnQgIT09IGZhbHNlICYmICh0aGlzLnByb3BzLmNhbnZhcyAmJiAhdGhpcy5wcm9wcy5jYW52YXMucGFyZW50RWxlbWVudCkpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQYXJlbnQgPSB0aGlzLnNldHRpbmdzLnBhcmVudCB8fCBkb2N1bWVudC5ib2R5O1xuICAgICAgZGVmYXVsdFBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLnByb3BzLmNhbnZhcyk7XG4gICAgfVxuICB9XG5cbiAgX3NldHVwR0xLZXkgKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNvbnRleHQpIHtcbiAgICAgIGlmIChpc1dlYkdMQ29udGV4dCh0aGlzLnByb3BzLmNvbnRleHQpKSB7XG4gICAgICAgIHRoaXMuX3Byb3BzLmdsID0gdGhpcy5wcm9wcy5jb250ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Byb3BzLmdsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFRpbWVQcm9wcyAoc2V0dGluZ3MgPSB7fSkge1xuICAgIC8vIEdldCB0aW1pbmcgZGF0YVxuICAgIGxldCBkdXJhdGlvbiA9IHNldHRpbmdzLmR1cmF0aW9uO1xuICAgIGxldCB0b3RhbEZyYW1lcyA9IHNldHRpbmdzLnRvdGFsRnJhbWVzO1xuICAgIGNvbnN0IHRpbWVTY2FsZSA9IGRlZmluZWQoc2V0dGluZ3MudGltZVNjYWxlLCAxKTtcbiAgICBjb25zdCBmcHMgPSBkZWZpbmVkKHNldHRpbmdzLmZwcywgMjQpO1xuICAgIGNvbnN0IGhhc0R1cmF0aW9uID0gdHlwZW9mIGR1cmF0aW9uID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShkdXJhdGlvbik7XG4gICAgY29uc3QgaGFzVG90YWxGcmFtZXMgPSB0eXBlb2YgdG90YWxGcmFtZXMgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHRvdGFsRnJhbWVzKTtcblxuICAgIGNvbnN0IHRvdGFsRnJhbWVzRnJvbUR1cmF0aW9uID0gaGFzRHVyYXRpb24gPyBNYXRoLmZsb29yKGZwcyAqIGR1cmF0aW9uKSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBkdXJhdGlvbkZyb21Ub3RhbEZyYW1lcyA9IGhhc1RvdGFsRnJhbWVzID8gKHRvdGFsRnJhbWVzIC8gZnBzKSA6IHVuZGVmaW5lZDtcbiAgICBpZiAoaGFzRHVyYXRpb24gJiYgaGFzVG90YWxGcmFtZXMgJiYgdG90YWxGcmFtZXNGcm9tRHVyYXRpb24gIT09IHRvdGFsRnJhbWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBzaG91bGQgc3BlY2lmeSBlaXRoZXIgZHVyYXRpb24gb3IgdG90YWxGcmFtZXMsIGJ1dCBub3QgYm90aC4gT3IsIHRoZXkgbXVzdCBtYXRjaCBleGFjdGx5LicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MuZGltZW5zaW9ucyA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHNldHRpbmdzLnVuaXRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKGBZb3UndmUgc3BlY2lmaWVkIGEgeyB1bml0cyB9IHNldHRpbmcgYnV0IG5vIHsgZGltZW5zaW9uIH0sIHNvIHRoZSB1bml0cyB3aWxsIGJlIGlnbm9yZWQuYCk7XG4gICAgfVxuXG4gICAgdG90YWxGcmFtZXMgPSBkZWZpbmVkKHRvdGFsRnJhbWVzLCB0b3RhbEZyYW1lc0Zyb21EdXJhdGlvbiwgSW5maW5pdHkpO1xuICAgIGR1cmF0aW9uID0gZGVmaW5lZChkdXJhdGlvbiwgZHVyYXRpb25Gcm9tVG90YWxGcmFtZXMsIEluZmluaXR5KTtcblxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHNldHRpbmdzLnRpbWU7XG4gICAgY29uc3Qgc3RhcnRGcmFtZSA9IHNldHRpbmdzLmZyYW1lO1xuICAgIGNvbnN0IGhhc1N0YXJ0VGltZSA9IHR5cGVvZiBzdGFydFRpbWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHN0YXJ0VGltZSk7XG4gICAgY29uc3QgaGFzU3RhcnRGcmFtZSA9IHR5cGVvZiBzdGFydEZyYW1lID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShzdGFydEZyYW1lKTtcblxuICAgIC8vIHN0YXJ0IGF0IHplcm8gdW5sZXNzIHVzZXIgc3BlY2lmaWVzIGZyYW1lIG9yIHRpbWUgKGJ1dCBub3QgYm90aCBtaXNtYXRjaGVkKVxuICAgIGxldCB0aW1lID0gMDtcbiAgICBsZXQgZnJhbWUgPSAwO1xuICAgIGxldCBwbGF5aGVhZCA9IDA7XG4gICAgaWYgKGhhc1N0YXJ0VGltZSAmJiBoYXNTdGFydEZyYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBzaG91bGQgc3BlY2lmeSBlaXRoZXIgc3RhcnQgZnJhbWUgb3IgdGltZSwgYnV0IG5vdCBib3RoLicpO1xuICAgIH0gZWxzZSBpZiAoaGFzU3RhcnRUaW1lKSB7XG4gICAgICAvLyBVc2VyIHNwZWNpZmllcyB0aW1lLCB3ZSBpbmZlciBmcmFtZXMgZnJvbSBGUFNcbiAgICAgIHRpbWUgPSBzdGFydFRpbWU7XG4gICAgICBwbGF5aGVhZCA9IHRoaXMuX2NvbXB1dGVQbGF5aGVhZCh0aW1lLCBkdXJhdGlvbik7XG4gICAgICBmcmFtZSA9IHRoaXMuX2NvbXB1dGVGcmFtZShcbiAgICAgICAgcGxheWhlYWQsIHRpbWUsXG4gICAgICAgIHRvdGFsRnJhbWVzLCBmcHNcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChoYXNTdGFydEZyYW1lKSB7XG4gICAgICAvLyBVc2VyIHNwZWNpZmllcyBmcmFtZSBudW1iZXIsIHdlIGluZmVyIHRpbWUgZnJvbSBGUFNcbiAgICAgIGZyYW1lID0gc3RhcnRGcmFtZTtcbiAgICAgIHRpbWUgPSBmcmFtZSAvIGZwcztcbiAgICAgIHBsYXloZWFkID0gdGhpcy5fY29tcHV0ZVBsYXloZWFkKHRpbWUsIGR1cmF0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcGxheWhlYWQsXG4gICAgICB0aW1lLFxuICAgICAgZnJhbWUsXG4gICAgICBkdXJhdGlvbixcbiAgICAgIHRvdGFsRnJhbWVzLFxuICAgICAgZnBzLFxuICAgICAgdGltZVNjYWxlXG4gICAgfTtcbiAgfVxuXG4gIHNldHVwIChzZXR0aW5ncyA9IHt9LCBvdmVycmlkZXMgPSB7fSkge1xuICAgIGlmICh0aGlzLnNrZXRjaCkgdGhyb3cgbmV3IEVycm9yKCdNdWx0aXBsZSBzZXR1cCgpIGNhbGxzIG5vdCB5ZXQgc3VwcG9ydGVkLicpO1xuXG4gICAgdGhpcy5fc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBzZXR0aW5ncywgdGhpcy5fc2V0dGluZ3MpO1xuXG4gICAgLy8gR2V0IGluaXRpYWwgY2FudmFzICYgY29udGV4dFxuICAgIGNvbnN0IHsgY29udGV4dCwgY2FudmFzIH0gPSBjcmVhdGVDYW52YXModGhpcy5fc2V0dGluZ3MpO1xuXG4gICAgY29uc3QgdGltZVByb3BzID0gdGhpcy5nZXRUaW1lUHJvcHModGhpcy5fc2V0dGluZ3MpO1xuXG4gICAgLy8gSW5pdGlhbCByZW5kZXIgc3RhdGUgZmVhdHVyZXNcbiAgICB0aGlzLl9wcm9wcyA9IHtcbiAgICAgIC4uLnRpbWVQcm9wcyxcbiAgICAgIGNhbnZhcyxcbiAgICAgIGNvbnRleHQsXG4gICAgICBkZWx0YVRpbWU6IDAsXG4gICAgICBzdGFydGVkOiBmYWxzZSxcbiAgICAgIGV4cG9ydGluZzogZmFsc2UsXG4gICAgICBwbGF5aW5nOiBmYWxzZSxcbiAgICAgIHJlY29yZGluZzogZmFsc2UsXG4gICAgICBzZXR0aW5nczogdGhpcy5zZXR0aW5ncyxcblxuICAgICAgLy8gRXhwb3J0IHNvbWUgc3BlY2lmaWMgYWN0aW9ucyB0byB0aGUgc2tldGNoXG4gICAgICByZW5kZXI6ICgpID0+IHRoaXMucmVuZGVyKCksXG4gICAgICB0b2dnbGVQbGF5OiAoKSA9PiB0aGlzLnRvZ2dsZVBsYXkoKSxcbiAgICAgIGRpc3BhdGNoOiAoY2IpID0+IHRoaXMuZGlzcGF0Y2goY2IpLFxuICAgICAgdGljazogKCkgPT4gdGhpcy50aWNrKCksXG4gICAgICByZXNpemU6ICgpID0+IHRoaXMucmVzaXplKCksXG4gICAgICB1cGRhdGU6IChvcHQpID0+IHRoaXMudXBkYXRlKG9wdCksXG4gICAgICBleHBvcnRGcmFtZTogb3B0ID0+IHRoaXMuZXhwb3J0RnJhbWUob3B0KSxcbiAgICAgIHJlY29yZDogKCkgPT4gdGhpcy5yZWNvcmQoKSxcbiAgICAgIHBsYXk6ICgpID0+IHRoaXMucGxheSgpLFxuICAgICAgcGF1c2U6ICgpID0+IHRoaXMucGF1c2UoKSxcbiAgICAgIHN0b3A6ICgpID0+IHRoaXMuc3RvcCgpXG4gICAgfTtcblxuICAgIC8vIEZvciBXZWJHTCBza2V0Y2hlcywgYSBnbCB2YXJpYWJsZSByZWFkcyBhIGJpdCBiZXR0ZXJcbiAgICB0aGlzLl9zZXR1cEdMS2V5KCk7XG5cbiAgICAvLyBUcmlnZ2VyIGluaXRpYWwgcmVzaXplIG5vdyBzbyB0aGF0IGNhbnZhcyBpcyBhbHJlYWR5IHNpemVkXG4gICAgLy8gYnkgdGhlIHRpbWUgd2UgbG9hZCB0aGUgc2tldGNoXG4gICAgdGhpcy5yZXNpemUoKTtcbiAgfVxuXG4gIGxvYWRBbmRSdW4gKGNhbnZhc1NrZXRjaCwgbmV3U2V0dGluZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkKGNhbnZhc1NrZXRjaCwgbmV3U2V0dGluZ3MpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5ydW4oKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pO1xuICB9XG5cbiAgdW5sb2FkICgpIHtcbiAgICB0aGlzLnBhdXNlKCk7XG4gICAgaWYgKCF0aGlzLnNrZXRjaCkgcmV0dXJuO1xuICAgIGlmICh0eXBlb2YgdGhpcy5za2V0Y2gudW5sb2FkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl93cmFwQ29udGV4dFNjYWxlKHByb3BzID0+IHRoaXMuc2tldGNoLnVubG9hZChwcm9wcykpO1xuICAgIH1cbiAgICB0aGlzLl9za2V0Y2ggPSBudWxsO1xuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy51bmxvYWQoKTtcbiAgICB0aGlzLnVubW91bnQoKTtcbiAgfVxuXG4gIGxvYWQgKGNyZWF0ZVNrZXRjaCwgbmV3U2V0dGluZ3MpIHtcbiAgICAvLyBVc2VyIGRpZG4ndCBzcGVjaWZ5IGEgZnVuY3Rpb25cbiAgICBpZiAodHlwZW9mIGNyZWF0ZVNrZXRjaCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZnVuY3Rpb24gbXVzdCB0YWtlIGluIGEgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IHBhcmFtZXRlci4gRXhhbXBsZTpcXG4gIGNhbnZhc1NrZXRjaGVyKCgpID0+IHsgLi4uIH0sIHNldHRpbmdzKScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNrZXRjaCkge1xuICAgICAgdGhpcy51bmxvYWQoKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG5ld1NldHRpbmdzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy51cGRhdGUobmV3U2V0dGluZ3MpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgaXMgYSBiaXQgb2YgYSB0cmlja3kgY2FzZTsgd2Ugc2V0IHVwIHRoZSBhdXRvLXNjYWxpbmcgaGVyZVxuICAgIC8vIGluIGNhc2UgdGhlIHVzZXIgZGVjaWRlcyB0byByZW5kZXIgYW55dGhpbmcgdG8gdGhlIGNvbnRleHQgKmJlZm9yZSogdGhlXG4gICAgLy8gcmVuZGVyKCkgZnVuY3Rpb24uLi4gSG93ZXZlciwgdXNlcnMgc2hvdWxkIGluc3RlYWQgdXNlIGJlZ2luKCkgZnVuY3Rpb24gZm9yIHRoYXQuXG4gICAgdGhpcy5fcHJlUmVuZGVyKCk7XG5cbiAgICBsZXQgcHJlbG9hZCA9IFByb21pc2UucmVzb2x2ZSgpO1xuXG4gICAgLy8gQmVjYXVzZSBvZiBQNS5qcydzIHVudXN1YWwgc3RydWN0dXJlLCB3ZSBoYXZlIHRvIGRvIGEgYml0IG9mXG4gICAgLy8gbGlicmFyeS1zcGVjaWZpYyBjaGFuZ2VzIHRvIHN1cHBvcnQgaXQgcHJvcGVybHkuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MucDUpIHtcbiAgICAgIGlmICghaXNCcm93c2VyKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbY2FudmFzLXNrZXRjaF0gRVJST1I6IFVzaW5nIHA1LmpzIGluIE5vZGUuanMgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgfVxuICAgICAgcHJlbG9hZCA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBsZXQgUDVDb25zdHJ1Y3RvciA9IHRoaXMuc2V0dGluZ3MucDU7XG4gICAgICAgIGxldCBwcmVsb2FkO1xuICAgICAgICBpZiAoUDVDb25zdHJ1Y3Rvci5wNSkge1xuICAgICAgICAgIHByZWxvYWQgPSBQNUNvbnN0cnVjdG9yLnByZWxvYWQ7XG4gICAgICAgICAgUDVDb25zdHJ1Y3RvciA9IFA1Q29uc3RydWN0b3IucDU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgc2tldGNoIHNldHVwOyBkaXNhYmxlIGxvb3AsIHNldCBzaXppbmcsIGV0Yy5cbiAgICAgICAgY29uc3QgcDVTa2V0Y2ggPSBwNSA9PiB7XG4gICAgICAgICAgLy8gSG9vayBpbiBwcmVsb2FkIGlmIG5lY2Vzc2FyeVxuICAgICAgICAgIGlmIChwcmVsb2FkKSBwNS5wcmVsb2FkID0gKCkgPT4gcHJlbG9hZChwNSk7XG4gICAgICAgICAgcDUuc2V0dXAgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICBjb25zdCBpc0dMID0gdGhpcy5zZXR0aW5ncy5jb250ZXh0ID09PSAnd2ViZ2wnO1xuICAgICAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBpc0dMID8gcDUuV0VCR0wgOiBwNS5QMkQ7XG4gICAgICAgICAgICBwNS5ub0xvb3AoKTtcbiAgICAgICAgICAgIHA1LnBpeGVsRGVuc2l0eShwcm9wcy5waXhlbFJhdGlvKTtcbiAgICAgICAgICAgIHA1LmNyZWF0ZUNhbnZhcyhwcm9wcy52aWV3cG9ydFdpZHRoLCBwcm9wcy52aWV3cG9ydEhlaWdodCwgcmVuZGVyZXIpO1xuICAgICAgICAgICAgaWYgKGlzR0wgJiYgdGhpcy5zZXR0aW5ncy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgIHA1LnNldEF0dHJpYnV0ZXModGhpcy5zZXR0aW5ncy5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51cGRhdGUoeyBwNSwgY2FudmFzOiBwNS5jYW52YXMsIGNvbnRleHQ6IHA1Ll9yZW5kZXJlci5kcmF3aW5nQ29udGV4dCB9KTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFN1cHBvcnQgZ2xvYmFsIGFuZCBpbnN0YW5jZSBQNS5qcyBtb2Rlc1xuICAgICAgICBpZiAodHlwZW9mIFA1Q29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBuZXcgUDVDb25zdHJ1Y3RvcihwNVNrZXRjaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuY3JlYXRlQ2FudmFzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ7IHA1IH0gc2V0dGluZyBpcyBwYXNzZWQgYnV0IGNhbid0IGZpbmQgcDUuanMgaW4gZ2xvYmFsICh3aW5kb3cpIHNjb3BlLiBNYXliZSB5b3UgZGlkIG5vdCBjcmVhdGUgaXQgZ2xvYmFsbHk/XFxubmV3IHA1KCk7IC8vIDwtLSBhdHRhY2hlcyB0byBnbG9iYWwgc2NvcGVcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHA1U2tldGNoKHdpbmRvdyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwcmVsb2FkLnRoZW4oKCkgPT4ge1xuICAgICAgLy8gTG9hZCB0aGUgdXNlcidzIHNrZXRjaFxuICAgICAgbGV0IGxvYWRlciA9IGNyZWF0ZVNrZXRjaCh0aGlzLnByb3BzKTtcbiAgICAgIGlmICghaXNQcm9taXNlKGxvYWRlcikpIHtcbiAgICAgICAgbG9hZGVyID0gUHJvbWlzZS5yZXNvbHZlKGxvYWRlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbG9hZGVyO1xuICAgIH0pLnRoZW4oc2tldGNoID0+IHtcbiAgICAgIGlmICghc2tldGNoKSBza2V0Y2ggPSB7fTtcbiAgICAgIHRoaXMuX3NrZXRjaCA9IHNrZXRjaDtcblxuICAgICAgLy8gT25jZSB0aGUgc2tldGNoIGlzIGxvYWRlZCB3ZSBjYW4gYWRkIHRoZSBldmVudHNcbiAgICAgIGlmIChpc0Jyb3dzZXIoKSkge1xuICAgICAgICB0aGlzLl9rZXlib2FyZFNob3J0Y3V0cy5hdHRhY2goKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUhhbmRsZXIpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wb3N0UmVuZGVyKCk7XG5cbiAgICAgIC8vIFRoZSBpbml0aWFsIHJlc2l6ZSgpIGluIHRoZSBjb25zdHJ1Y3RvciB3aWxsIG5vdCBoYXZlXG4gICAgICAvLyB0cmlnZ2VyZWQgYSByZXNpemUoKSBldmVudCBvbiB0aGUgc2tldGNoLCBzaW5jZSBpdCB3YXMgYmVmb3JlXG4gICAgICAvLyB0aGUgc2tldGNoIHdhcyBsb2FkZWQuIFNvIHdlIHNlbmQgdGhlIHNpZ25hbCBoZXJlLCBhbGxvd2luZ1xuICAgICAgLy8gdXNlcnMgdG8gcmVhY3QgdG8gdGhlIGluaXRpYWwgc2l6ZSBiZWZvcmUgZmlyc3QgcmVuZGVyLlxuICAgICAgdGhpcy5fc2l6ZUNoYW5nZWQoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLndhcm4oJ0NvdWxkIG5vdCBzdGFydCBza2V0Y2gsIHRoZSBhc3luYyBsb2FkaW5nIGZ1bmN0aW9uIHJlamVjdGVkIHdpdGggYW4gZXJyb3I6XFxuICAgIEVycm9yOiAnICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNrZXRjaE1hbmFnZXI7XG4iLCJpbXBvcnQgU2tldGNoTWFuYWdlciBmcm9tICcuL2NvcmUvU2tldGNoTWFuYWdlcic7XG5pbXBvcnQgUGFwZXJTaXplcyBmcm9tICcuL3BhcGVyLXNpemVzJztcbmltcG9ydCB7IGdldENsaWVudEFQSSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgZGVmaW5lZCBmcm9tICdkZWZpbmVkJztcblxuY29uc3QgQ0FDSEUgPSAnaG90LWlkLWNhY2hlJztcbmNvbnN0IHJ1bnRpbWVDb2xsaXNpb25zID0gW107XG5cbmZ1bmN0aW9uIGlzSG90UmVsb2FkICgpIHtcbiAgY29uc3QgY2xpZW50ID0gZ2V0Q2xpZW50QVBJKCk7XG4gIHJldHVybiBjbGllbnQgJiYgY2xpZW50LmhvdDtcbn1cblxuZnVuY3Rpb24gY2FjaGVHZXQgKGlkKSB7XG4gIGNvbnN0IGNsaWVudCA9IGdldENsaWVudEFQSSgpO1xuICBpZiAoIWNsaWVudCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgY2xpZW50W0NBQ0hFXSA9IGNsaWVudFtDQUNIRV0gfHwge307XG4gIHJldHVybiBjbGllbnRbQ0FDSEVdW2lkXTtcbn1cblxuZnVuY3Rpb24gY2FjaGVQdXQgKGlkLCBkYXRhKSB7XG4gIGNvbnN0IGNsaWVudCA9IGdldENsaWVudEFQSSgpO1xuICBpZiAoIWNsaWVudCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgY2xpZW50W0NBQ0hFXSA9IGNsaWVudFtDQUNIRV0gfHwge307XG4gIGNsaWVudFtDQUNIRV1baWRdID0gZGF0YTtcbn1cblxuZnVuY3Rpb24gZ2V0VGltZVByb3AgKG9sZE1hbmFnZXIsIG5ld1NldHRpbmdzKSB7XG4gIC8vIFN0YXRpYyBza2V0Y2hlcyBpZ25vcmUgdGhlIHRpbWUgcGVyc2lzdGVuY3lcbiAgcmV0dXJuIG5ld1NldHRpbmdzLmFuaW1hdGUgPyB7IHRpbWU6IG9sZE1hbmFnZXIucHJvcHMudGltZSB9IDogdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBjYW52YXNTa2V0Y2ggKHNrZXRjaCwgc2V0dGluZ3MgPSB7fSkge1xuICBpZiAoc2V0dGluZ3MucDUpIHtcbiAgICBpZiAoc2V0dGluZ3MuY2FudmFzIHx8IChzZXR0aW5ncy5jb250ZXh0ICYmIHR5cGVvZiBzZXR0aW5ncy5jb250ZXh0ICE9PSAnc3RyaW5nJykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW4geyBwNSB9IG1vZGUsIHlvdSBjYW4ndCBwYXNzIHlvdXIgb3duIGNhbnZhcyBvciBjb250ZXh0LCB1bmxlc3MgdGhlIGNvbnRleHQgaXMgYSBcIndlYmdsXCIgb3IgXCIyZFwiIHN0cmluZ2ApO1xuICAgIH1cblxuICAgIC8vIERvIG5vdCBjcmVhdGUgYSBjYW52YXMgb24gc3RhcnR1cCwgc2luY2UgUDUuanMgZG9lcyB0aGF0IGZvciB1c1xuICAgIGNvbnN0IGNvbnRleHQgPSB0eXBlb2Ygc2V0dGluZ3MuY29udGV4dCA9PT0gJ3N0cmluZycgPyBzZXR0aW5ncy5jb250ZXh0IDogZmFsc2U7XG4gICAgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBzZXR0aW5ncywgeyBjYW52YXM6IGZhbHNlLCBjb250ZXh0IH0pO1xuICB9XG5cbiAgY29uc3QgaXNIb3QgPSBpc0hvdFJlbG9hZCgpO1xuICBsZXQgaG90SUQ7XG4gIGlmIChpc0hvdCkge1xuICAgIC8vIFVzZSBhIG1hZ2ljIG5hbWUgYnkgZGVmYXVsdCwgZm9yY2UgdXNlciB0byBkZWZpbmUgZWFjaCBza2V0Y2ggaWYgdGhleVxuICAgIC8vIHJlcXVpcmUgbW9yZSB0aGFuIG9uZSBpbiBhbiBhcHBsaWNhdGlvbi4gT3BlbiB0byBvdGhlciBpZGVhcyBvbiBob3cgdG8gdGFja2xlXG4gICAgLy8gdGhpcyBhcyB3ZWxsLi4uXG4gICAgaG90SUQgPSBkZWZpbmVkKHNldHRpbmdzLmlkLCAnJF9fREVGQVVMVF9DQU5WQVNfU0tFVENIX0lEX18kJyk7XG4gIH1cbiAgbGV0IGlzSW5qZWN0aW5nID0gaXNIb3QgJiYgdHlwZW9mIGhvdElEID09PSAnc3RyaW5nJztcblxuICBpZiAoaXNJbmplY3RpbmcgJiYgcnVudGltZUNvbGxpc2lvbnMuaW5jbHVkZXMoaG90SUQpKSB7XG4gICAgY29uc29sZS53YXJuKGBXYXJuaW5nOiBZb3UgaGF2ZSBtdWx0aXBsZSBjYWxscyB0byBjYW52YXNTa2V0Y2goKSBpbiAtLWhvdCBtb2RlLiBZb3UgbXVzdCBwYXNzIHVuaXF1ZSB7IGlkIH0gc3RyaW5ncyBpbiBzZXR0aW5ncyB0byBlbmFibGUgaG90IHJlbG9hZCBhY3Jvc3MgbXVsdGlwbGUgc2tldGNoZXMuIGAsIGhvdElEKTtcbiAgICBpc0luamVjdGluZyA9IGZhbHNlO1xuICB9XG5cbiAgbGV0IHByZWxvYWQgPSBQcm9taXNlLnJlc29sdmUoKTtcblxuICBpZiAoaXNJbmplY3RpbmcpIHtcbiAgICAvLyBNYXJrIHRoaXMgYXMgYWxyZWFkeSBzcG90dGVkIGluIHRoaXMgcnVudGltZSBpbnN0YW5jZVxuICAgIHJ1bnRpbWVDb2xsaXNpb25zLnB1c2goaG90SUQpO1xuXG4gICAgY29uc3QgcHJldmlvdXNEYXRhID0gY2FjaGVHZXQoaG90SUQpO1xuICAgIGlmIChwcmV2aW91c0RhdGEpIHtcbiAgICAgIGNvbnN0IG5leHQgPSAoKSA9PiB7XG4gICAgICAgIC8vIEdyYWIgbmV3IHByb3BzIGZyb20gb2xkIHNrZXRjaCBpbnN0YW5jZVxuICAgICAgICBjb25zdCBuZXdQcm9wcyA9IGdldFRpbWVQcm9wKHByZXZpb3VzRGF0YS5tYW5hZ2VyLCBzZXR0aW5ncyk7XG4gICAgICAgIC8vIERlc3Ryb3kgdGhlIG9sZCBpbnN0YW5jZVxuICAgICAgICBwcmV2aW91c0RhdGEubWFuYWdlci5kZXN0cm95KCk7XG4gICAgICAgIC8vIFBhc3MgYWxvbmcgbmV3IHByb3BzXG4gICAgICAgIHJldHVybiBuZXdQcm9wcztcbiAgICAgIH07XG5cbiAgICAgIC8vIE1vdmUgYWxvbmcgdGhlIG5leHQgZGF0YS4uLlxuICAgICAgcHJlbG9hZCA9IHByZXZpb3VzRGF0YS5sb2FkLnRoZW4obmV4dCkuY2F0Y2gobmV4dCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHByZWxvYWQudGhlbihuZXdQcm9wcyA9PiB7XG4gICAgY29uc3QgbWFuYWdlciA9IG5ldyBTa2V0Y2hNYW5hZ2VyKCk7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAoc2tldGNoKSB7XG4gICAgICAvLyBNZXJnZSB3aXRoIGluY29taW5nIGRhdGFcbiAgICAgIHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgc2V0dGluZ3MsIG5ld1Byb3BzKTtcblxuICAgICAgLy8gQXBwbHkgc2V0dGluZ3MgYW5kIGNyZWF0ZSBhIGNhbnZhc1xuICAgICAgbWFuYWdlci5zZXR1cChzZXR0aW5ncyk7XG5cbiAgICAgIC8vIE1vdW50IHRvIERPTVxuICAgICAgbWFuYWdlci5tb3VudCgpO1xuXG4gICAgICAvLyBsb2FkIHRoZSBza2V0Y2ggZmlyc3RcbiAgICAgIHJlc3VsdCA9IG1hbmFnZXIubG9hZEFuZFJ1bihza2V0Y2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBQcm9taXNlLnJlc29sdmUobWFuYWdlcik7XG4gICAgfVxuICAgIGlmIChpc0luamVjdGluZykge1xuICAgICAgY2FjaGVQdXQoaG90SUQsIHsgbG9hZDogcmVzdWx0LCBtYW5hZ2VyIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcbn1cblxuLy8gVE9ETzogRmlndXJlIG91dCBhIG5pY2Ugd2F5IHRvIGV4cG9ydCB0aGluZ3MuXG5jYW52YXNTa2V0Y2guY2FudmFzU2tldGNoID0gY2FudmFzU2tldGNoO1xuY2FudmFzU2tldGNoLlBhcGVyU2l6ZXMgPSBQYXBlclNpemVzO1xuXG5leHBvcnQgZGVmYXVsdCBjYW52YXNTa2V0Y2g7XG4iXSwibmFtZXMiOlsiZ2xvYmFsIiwiaXNET00iLCJpc0FyZ3VtZW50cyIsIm9iamVjdEtleXMiLCJkZWZpbmUiLCJ0aGlzIiwicmVwZWF0IiwiY29uc3QiLCJsZXQiLCJhc3NpZ24iLCJnZXRDYW52YXNDb250ZXh0IiwicmlnaHROb3ci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


/***/ }),

/***/ "./node_modules/convert-length/convert-length.js":
/*!*******************************************************!*\
  !*** ./node_modules/convert-length/convert-length.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defined = __webpack_require__(/*! defined */ "./node_modules/defined/index.js");
var units = [ 'mm', 'cm', 'm', 'pc', 'pt', 'in', 'ft', 'px' ];

var conversions = {
  // metric
  m: {
    system: 'metric',
    factor: 1
  },
  cm: {
    system: 'metric',
    factor: 1 / 100
  },
  mm: {
    system: 'metric',
    factor: 1 / 1000
  },
  // imperial
  pt: {
    system: 'imperial',
    factor: 1 / 72
  },
  pc: {
    system: 'imperial',
    factor: 1 / 6
  },
  in: {
    system: 'imperial',
    factor: 1
  },
  ft: {
    system: 'imperial',
    factor: 12
  }
};

const anchors = {
  metric: {
    unit: 'm',
    ratio: 1 / 0.0254
  },
  imperial: {
    unit: 'in',
    ratio: 0.0254
  }
};

function round (value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function convertDistance (value, fromUnit, toUnit, opts) {
  if (typeof value !== 'number' || !isFinite(value)) throw new Error('Value must be a finite number');
  if (!fromUnit || !toUnit) throw new Error('Must specify from and to units');

  opts = opts || {};
  var pixelsPerInch = defined(opts.pixelsPerInch, 96);
  var precision = opts.precision;
  var roundPixel = opts.roundPixel !== false;

  fromUnit = fromUnit.toLowerCase();
  toUnit = toUnit.toLowerCase();

  if (units.indexOf(fromUnit) === -1) throw new Error('Invalid from unit "' + fromUnit + '", must be one of: ' + units.join(', '));
  if (units.indexOf(toUnit) === -1) throw new Error('Invalid from unit "' + toUnit + '", must be one of: ' + units.join(', '));

  if (fromUnit === toUnit) {
    // We don't need to convert from A to B since they are the same already
    return value;
  }

  var toFactor = 1;
  var fromFactor = 1;
  var isToPixel = false;

  if (fromUnit === 'px') {
    fromFactor = 1 / pixelsPerInch;
    fromUnit = 'in';
  }
  if (toUnit === 'px') {
    isToPixel = true;
    toFactor = pixelsPerInch;
    toUnit = 'in';
  }

  var fromUnitData = conversions[fromUnit];
  var toUnitData = conversions[toUnit];

  // source to anchor inside source's system
  var anchor = value * fromUnitData.factor * fromFactor;

  // if systems differ, convert one to another
  if (fromUnitData.system !== toUnitData.system) {
    // regular 'm' to 'in' and so forth
    anchor *= anchors[fromUnitData.system].ratio;
  }

  var result = anchor / toUnitData.factor * toFactor;
  if (isToPixel && roundPixel) {
    result = Math.round(result);
  } else if (typeof precision === 'number' && isFinite(precision)) {
    result = round(result, precision);
  }
  return result;
}

module.exports = convertDistance;
module.exports.units = units;


/***/ }),

/***/ "./node_modules/defined/index.js":
/*!***************************************!*\
  !*** ./node_modules/defined/index.js ***!
  \***************************************/
/***/ ((module) => {

module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};


/***/ }),

/***/ "./node_modules/seed-random/index.js":
/*!*******************************************!*\
  !*** ./node_modules/seed-random/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var width = 256;// each RC4 output is 0 <= x < 256
var chunks = 6;// at least six RC4 outputs for each double
var digits = 52;// there are 52 significant digits in a double
var pool = [];// pool: entropy pool starts empty
var GLOBAL = typeof __webpack_require__.g === 'undefined' ? window : __webpack_require__.g;

//
// The following constants are related to IEEE 754 limits.
//
var startdenom = Math.pow(width, chunks),
    significance = Math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1;


var oldRandom = Math.random;

//
// seedrandom()
// This is the seedrandom function described above.
//
module.exports = function(seed, options) {
  if (options && options.global === true) {
    options.global = false;
    Math.random = module.exports(seed, options);
    options.global = true;
    return Math.random;
  }
  var use_entropy = (options && options.entropy) || false;
  var key = [];

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    use_entropy ? [seed, tostring(pool)] :
    0 in arguments ? seed : autoseed(), 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  return function() {         // Closure to return a random double:
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer Math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };
};

module.exports.resetGlobal = function () {
  Math.random = oldRandom;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability discard an initial batch of values.
    // See http://www.rsa.com/rsalabs/node.asp?id=2009
  })(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj)[0], prop;
  if (depth && typ == 'o') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 's' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto if available.
//
/** @param {Uint8Array=} seed */
function autoseed(seed) {
  try {
    GLOBAL.crypto.getRandomValues(seed = new Uint8Array(width));
    return tostring(seed);
  } catch (e) {
    return [+new Date, GLOBAL, GLOBAL.navigator && GLOBAL.navigator.plugins,
            GLOBAL.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call Math.random on its own again after
// initialization.
//
mixkey(Math.random(), pool);


/***/ }),

/***/ "./node_modules/simplex-noise/simplex-noise.js":
/*!*****************************************************!*\
  !*** ./node_modules/simplex-noise/simplex-noise.js ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 * A fast javascript implementation of simplex noise by Jonas Wagner

Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
Better rank ordering method by Stefan Gustavson in 2012.


 Copyright (c) 2018 Jonas Wagner

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
(function() {
  'use strict';

  var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  var F3 = 1.0 / 3.0;
  var G3 = 1.0 / 6.0;
  var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
  var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

  function SimplexNoise(randomOrSeed) {
    var random;
    if (typeof randomOrSeed == 'function') {
      random = randomOrSeed;
    }
    else if (randomOrSeed) {
      random = alea(randomOrSeed);
    } else {
      random = Math.random;
    }
    this.p = buildPermutationTable(random);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (var i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }

  }
  SimplexNoise.prototype = {
    grad3: new Float32Array([1, 1, 0,
      -1, 1, 0,
      1, -1, 0,

      -1, -1, 0,
      1, 0, 1,
      -1, 0, 1,

      1, 0, -1,
      -1, 0, -1,
      0, 1, 1,

      0, -1, 1,
      0, 1, -1,
      0, -1, -1]),
    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
      0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
      1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
      -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
      1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
      -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
      1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
      -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
    noise2D: function(xin, yin) {
      var permMod12 = this.permMod12;
      var perm = this.perm;
      var grad3 = this.grad3;
      var n0 = 0; // Noise contributions from the three corners
      var n1 = 0;
      var n2 = 0;
      // Skew the input space to determine which simplex cell we're in
      var s = (xin + yin) * F2; // Hairy factor for 2D
      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var t = (i + j) * G2;
      var X0 = i - t; // Unskew the cell origin back to (x,y) space
      var Y0 = j - t;
      var x0 = xin - X0; // The x,y distances from the cell origin
      var y0 = yin - Y0;
      // For the 2D case, the simplex shape is an equilateral triangle.
      // Determine which simplex we are in.
      var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      else {
        i1 = 0;
        j1 = 1;
      } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
      // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
      // c = (3-sqrt(3))/6
      var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
      var y1 = y0 - j1 + G2;
      var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
      var y2 = y0 - 1.0 + 2.0 * G2;
      // Work out the hashed gradient indices of the three simplex corners
      var ii = i & 255;
      var jj = j & 255;
      // Calculate the contribution from the three corners
      var t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 >= 0) {
        var gi0 = permMod12[ii + perm[jj]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
      }
      var t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 >= 0) {
        var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
      }
      var t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 >= 0) {
        var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
      }
      // Add contributions from each corner to get the final noise value.
      // The result is scaled to return values in the interval [-1,1].
      return 70.0 * (n0 + n1 + n2);
    },
    // 3D simplex noise
    noise3D: function(xin, yin, zin) {
      var permMod12 = this.permMod12;
      var perm = this.perm;
      var grad3 = this.grad3;
      var n0, n1, n2, n3; // Noise contributions from the four corners
      // Skew the input space to determine which simplex cell we're in
      var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var k = Math.floor(zin + s);
      var t = (i + j + k) * G3;
      var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
      var Y0 = j - t;
      var Z0 = k - t;
      var x0 = xin - X0; // The x,y,z distances from the cell origin
      var y0 = yin - Y0;
      var z0 = zin - Z0;
      // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
      // Determine which simplex we are in.
      var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
      var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
      if (x0 >= y0) {
        if (y0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } // X Y Z order
        else if (x0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } // X Z Y order
        else {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } // Z X Y order
      }
      else { // x0<y0
        if (y0 < z0) {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Z Y X order
        else if (x0 < z0) {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Y Z X order
        else {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } // Y X Z order
      }
      // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
      // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
      // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
      // c = 1/6.
      var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
      var y1 = y0 - j1 + G3;
      var z1 = z0 - k1 + G3;
      var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
      var y2 = y0 - j2 + 2.0 * G3;
      var z2 = z0 - k2 + 2.0 * G3;
      var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
      var y3 = y0 - 1.0 + 3.0 * G3;
      var z3 = z0 - 1.0 + 3.0 * G3;
      // Work out the hashed gradient indices of the four simplex corners
      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      // Calculate the contribution from the four corners
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0) n0 = 0.0;
      else {
        var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0) n1 = 0.0;
      else {
        var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0) n2 = 0.0;
      else {
        var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0) n3 = 0.0;
      else {
        var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
        t3 *= t3;
        n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
      }
      // Add contributions from each corner to get the final noise value.
      // The result is scaled to stay just inside [-1,1]
      return 32.0 * (n0 + n1 + n2 + n3);
    },
    // 4D simplex noise, better simplex rank ordering method 2012-03-09
    noise4D: function(x, y, z, w) {
      var perm = this.perm;
      var grad4 = this.grad4;

      var n0, n1, n2, n3, n4; // Noise contributions from the five corners
      // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
      var s = (x + y + z + w) * F4; // Factor for 4D skewing
      var i = Math.floor(x + s);
      var j = Math.floor(y + s);
      var k = Math.floor(z + s);
      var l = Math.floor(w + s);
      var t = (i + j + k + l) * G4; // Factor for 4D unskewing
      var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
      var Y0 = j - t;
      var Z0 = k - t;
      var W0 = l - t;
      var x0 = x - X0; // The x,y,z,w distances from the cell origin
      var y0 = y - Y0;
      var z0 = z - Z0;
      var w0 = w - W0;
      // For the 4D case, the simplex is a 4D shape I won't even try to describe.
      // To find out which of the 24 possible simplices we're in, we need to
      // determine the magnitude ordering of x0, y0, z0 and w0.
      // Six pair-wise comparisons are performed between each possible pair
      // of the four coordinates, and the results are used to rank the numbers.
      var rankx = 0;
      var ranky = 0;
      var rankz = 0;
      var rankw = 0;
      if (x0 > y0) rankx++;
      else ranky++;
      if (x0 > z0) rankx++;
      else rankz++;
      if (x0 > w0) rankx++;
      else rankw++;
      if (y0 > z0) ranky++;
      else rankz++;
      if (y0 > w0) ranky++;
      else rankw++;
      if (z0 > w0) rankz++;
      else rankw++;
      var i1, j1, k1, l1; // The integer offsets for the second simplex corner
      var i2, j2, k2, l2; // The integer offsets for the third simplex corner
      var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
      // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
      // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
      // impossible. Only the 24 indices which have non-zero entries make any sense.
      // We use a thresholding to set the coordinates in turn from the largest magnitude.
      // Rank 3 denotes the largest coordinate.
      i1 = rankx >= 3 ? 1 : 0;
      j1 = ranky >= 3 ? 1 : 0;
      k1 = rankz >= 3 ? 1 : 0;
      l1 = rankw >= 3 ? 1 : 0;
      // Rank 2 denotes the second largest coordinate.
      i2 = rankx >= 2 ? 1 : 0;
      j2 = ranky >= 2 ? 1 : 0;
      k2 = rankz >= 2 ? 1 : 0;
      l2 = rankw >= 2 ? 1 : 0;
      // Rank 1 denotes the second smallest coordinate.
      i3 = rankx >= 1 ? 1 : 0;
      j3 = ranky >= 1 ? 1 : 0;
      k3 = rankz >= 1 ? 1 : 0;
      l3 = rankw >= 1 ? 1 : 0;
      // The fifth corner has all coordinate offsets = 1, so no need to compute that.
      var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
      var y1 = y0 - j1 + G4;
      var z1 = z0 - k1 + G4;
      var w1 = w0 - l1 + G4;
      var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
      var y2 = y0 - j2 + 2.0 * G4;
      var z2 = z0 - k2 + 2.0 * G4;
      var w2 = w0 - l2 + 2.0 * G4;
      var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
      var y3 = y0 - j3 + 3.0 * G4;
      var z3 = z0 - k3 + 3.0 * G4;
      var w3 = w0 - l3 + 3.0 * G4;
      var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
      var y4 = y0 - 1.0 + 4.0 * G4;
      var z4 = z0 - 1.0 + 4.0 * G4;
      var w4 = w0 - 1.0 + 4.0 * G4;
      // Work out the hashed gradient indices of the five simplex corners
      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      var ll = l & 255;
      // Calculate the contribution from the five corners
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
      if (t0 < 0) n0 = 0.0;
      else {
        var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
        t0 *= t0;
        n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
      if (t1 < 0) n1 = 0.0;
      else {
        var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
        t1 *= t1;
        n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
      if (t2 < 0) n2 = 0.0;
      else {
        var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
        t2 *= t2;
        n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
      if (t3 < 0) n3 = 0.0;
      else {
        var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
        t3 *= t3;
        n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
      }
      var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
      if (t4 < 0) n4 = 0.0;
      else {
        var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
        t4 *= t4;
        n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
      }
      // Sum up and scale the result to cover the range [-1,1]
      return 27.0 * (n0 + n1 + n2 + n3 + n4);
    }
  };

  function buildPermutationTable(random) {
    var i;
    var p = new Uint8Array(256);
    for (i = 0; i < 256; i++) {
      p[i] = i;
    }
    for (i = 0; i < 255; i++) {
      var r = i + ~~(random() * (256 - i));
      var aux = p[i];
      p[i] = p[r];
      p[r] = aux;
    }
    return p;
  }
  SimplexNoise._buildPermutationTable = buildPermutationTable;

  function alea() {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    var mash = masher();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < arguments.length; i++) {
      s0 -= mash(arguments[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(arguments[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(arguments[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;
    return function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
  }
  function masher() {
    var n = 0xefc8249d;
    return function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };
  }

  // amd
  if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {return SimplexNoise;}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  // common js
  if (true) exports.SimplexNoise = SimplexNoise;
  // browser
  else {}
  // nodejs
  if (true) {
    module.exports = SimplexNoise;
  }

})();


/***/ }),

/***/ "./src/sketches/dots.js":
/*!******************************!*\
  !*** ./src/sketches/dots.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var canvas_sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! canvas-sketch */ "./node_modules/canvas-sketch/dist/canvas-sketch.umd.js");
/* harmony import */ var canvas_sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(canvas_sketch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! canvas-sketch-util/random */ "./node_modules/canvas-sketch-util/random.js");
/* harmony import */ var canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! canvas-sketch-util/math */ "./node_modules/canvas-sketch-util/math.js");
/* harmony import */ var canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__);




// You can force a specific seed by replacing this with a string value
const defaultSeed = "";

// Set a random seed so we can reproduce this print later
canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().setSeed(defaultSeed || canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().getRandomSeed());

// Print to console so we can see which seed is being used and copy it if desired
console.log("Random Seed:", canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().getSeed());

function perc2color(perc) {
  var r,
    g,
    b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return "#" + ("000000" + h.toString(16)).slice(-6);
}

const settings = {
  hotkeys: false,
  suffix: canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().getSeed(),
  dimensions: [1000, 1000],
};

const sketch = ({ width, height }) => {
  const pageSize = Math.min(width, height);

  // page settings
  const margin = 0;
  const gridSize = 50;
  const background = "black";

  // segment settings
  const frequency = 0.75;
  const alpha = 1;

  // Create some flat data structure worth of points
  const cells = (0,canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__.linspace)(gridSize, true)
    .map((v) => {
      return (0,canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__.linspace)(gridSize, true).map((u) => {
        return [u, v];
      });
    })
    .flat();

  return ({ context, frame, playhead }) => {
    // Fill the canvas
    context.fillStyle = background;
    context.globalAlpha = 1;
    context.fillRect(0, 0, width, height);

    // draw grid
    const innerSize = pageSize - margin * 1;
    cells.forEach((cell) => {
      const [u, v] = cell;

      const n = canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().noise2D(u * 2, v * 2, frequency);
      const size = Math.abs(n) * 15;

      // scale to inner size
      let x = u * innerSize;
      let y = v * innerSize;

      // center on page
      x += (width - innerSize) / 2;
      y += (height - innerSize) / 2;

      // draw cell
      context.globalAlpha = alpha;
      context.strokeStyle = "white";
      context.fillStyle = "white";
      context.fill();

      dot(context, x, y, size);
    });
  };
};

function dot(context, x, y, size) {
  context.beginPath();
  context.arc(x, y, size, 0, 2 * Math.PI, true);
  context.stroke();
}

canvas_sketch__WEBPACK_IMPORTED_MODULE_0___default()(sketch, settings);


/***/ }),

/***/ "./src/sketches/lines.js":
/*!*******************************!*\
  !*** ./src/sketches/lines.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var canvas_sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! canvas-sketch */ "./node_modules/canvas-sketch/dist/canvas-sketch.umd.js");
/* harmony import */ var canvas_sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(canvas_sketch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! canvas-sketch-util/random */ "./node_modules/canvas-sketch-util/random.js");
/* harmony import */ var canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! canvas-sketch-util/math */ "./node_modules/canvas-sketch-util/math.js");
/* harmony import */ var canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__);




const defaultSeed = "";

canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().setSeed(defaultSeed || canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().getRandomSeed());

const settings = {
  dimensions: [2048, 2048],
};

const pointCount = 40;
const lineCount = 1000;
const frequency = 0.75;
const amplitude = 180;

const sketch = ({ width, height }) => {
  return ({ context }) => {
    const points = (0,canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__.linspace)(pointCount, true).map((u) => {
      return (0,canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__.linspace)(lineCount, true).map((v) => {
        const n = canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().noise2D(u * 2, v * 2, frequency, amplitude);
        const x = u * (width / 2) + n + width / 4;
        const y = v * height;

        return [x, y, n];
      });
    });

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";

    context.lineWidth = "4";
    context.strokeStyle = "black";

    points.map((line) => {
      line.map(([x, y, n], index) => {
        if (line[index - 1]) {
          context.beginPath();
          context.moveTo(line[index - 1][0], line[index - 1][1]);
          context.lineTo(x, y);
          context.strokeStyle = `hsl(${Math.abs(
            (n / amplitude) * 360
          )}, 80%, ${Math.abs((n / 200) * 100)}%)`;
          context.stroke();
        }
      });
    });
  };
};

canvas_sketch__WEBPACK_IMPORTED_MODULE_0___default()(sketch, settings);


/***/ }),

/***/ "./src/sketches/waves.js":
/*!*******************************!*\
  !*** ./src/sketches/waves.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var canvas_sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! canvas-sketch */ "./node_modules/canvas-sketch/dist/canvas-sketch.umd.js");
/* harmony import */ var canvas_sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(canvas_sketch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! canvas-sketch-util/random */ "./node_modules/canvas-sketch-util/random.js");
/* harmony import */ var canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! canvas-sketch-util/math */ "./node_modules/canvas-sketch-util/math.js");
/* harmony import */ var canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__);




// You can force a specific seed by replacing this with a string value
const defaultSeed = "";

// Set a random seed so we can reproduce this print later
canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().setSeed(defaultSeed || canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().getRandomSeed());

// Print to console so we can see which seed is being used and copy it if desired
console.log("Random Seed:", canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().getSeed());

const settings = {
  hotkeys: false,
  suffix: canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().getSeed(),
  animate: true,
  duration: 5,
  dimensions: [1000, 1000],
  fps: 30,
};

const sketch = ({ width, height }) => {
  const pageSize = Math.min(width, height);

  // page settings
  const margin = 0;
  const gridSize = 50;
  const background = "black";

  // segment settings
  const length = pageSize * 0.1;
  const lineWidth = pageSize * 0.00175;
  const frequency = 0.75;
  const alpha = 1;

  // Create some flat data structure worth of points
  const cells = (0,canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__.linspace)(gridSize, true)
    .map((v) => {
      return (0,canvas_sketch_util_math__WEBPACK_IMPORTED_MODULE_2__.linspace)(gridSize, true).map((u) => {
        return [u, v];
      });
    })
    .flat();

  return ({ context, frame, playhead }) => {
    // Fill the canvas
    context.fillStyle = background;
    context.globalAlpha = 1;
    context.fillRect(0, 0, width, height);

    // draw grid
    const innerSize = pageSize - margin * 1;
    cells.forEach((cell) => {
      const [u, v] = cell;

      // scale to inner size
      let x = u * innerSize;
      let y = v * innerSize;

      // center on page
      x += (width - innerSize) / 2;
      y += (height - innerSize) / 2;

      // get a random angle from noise
      const n = canvas_sketch_util_random__WEBPACK_IMPORTED_MODULE_1___default().noise2D(u * 2 - 1, v * 2 - 1, frequency);
      // const angle = n * Math.PI * 2;
      const angle = Math.PI * playhead + n * 5;

      // draw cell
      context.globalAlpha = alpha;
      context.strokeStyle =
        n < 0.1 ? "transparent" : `hsl(40, 100%, ${n * 100}%)`;

      segment(context, x, y, angle, length, lineWidth);
    });
  };
};

function segment(context, x, y, angle = 0, length = 1, lineWidth = 1) {
  const halfLength = length / 2;
  const u = Math.cos(angle) * halfLength;
  const v = Math.sin(angle) * halfLength;

  context.beginPath();
  context.moveTo(x - u, y - v);
  context.lineTo(x + u, y + v);
  context.lineWidth = lineWidth;
  context.stroke();
}

canvas_sketch__WEBPACK_IMPORTED_MODULE_0___default()(sketch, settings);


/***/ }),

/***/ "./src/sketches sync recursive \\.js$":
/*!**********************************!*\
  !*** ./src/sketches/ sync \.js$ ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./dots.js": "./src/sketches/dots.js",
	"./lines.js": "./src/sketches/lines.js",
	"./waves.js": "./src/sketches/waves.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/sketches sync recursive \\.js$";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
function requireAll(r) {
  r.keys().forEach(r);
}

const app = {
  init() {
    console.log(this.files);
  },
  files: requireAll(__webpack_require__("./src/sketches sync recursive \\.js$")),
};

app.init();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtc2tldGNoLW5vaXNlLTAxLy4vbm9kZV9tb2R1bGVzL2NhbnZhcy1za2V0Y2gtdXRpbC9tYXRoLmpzIiwid2VicGFjazovL2NhbnZhcy1za2V0Y2gtbm9pc2UtMDEvLi9ub2RlX21vZHVsZXMvY2FudmFzLXNrZXRjaC11dGlsL3JhbmRvbS5qcyIsIndlYnBhY2s6Ly9jYW52YXMtc2tldGNoLW5vaXNlLTAxLy4vbm9kZV9tb2R1bGVzL2NhbnZhcy1za2V0Y2gvZGlzdC9jYW52YXMtc2tldGNoLnVtZC5qcyIsIndlYnBhY2s6Ly9jYW52YXMtc2tldGNoLW5vaXNlLTAxLy4vbm9kZV9tb2R1bGVzL2NvbnZlcnQtbGVuZ3RoL2NvbnZlcnQtbGVuZ3RoLmpzIiwid2VicGFjazovL2NhbnZhcy1za2V0Y2gtbm9pc2UtMDEvLi9ub2RlX21vZHVsZXMvZGVmaW5lZC9pbmRleC5qcyIsIndlYnBhY2s6Ly9jYW52YXMtc2tldGNoLW5vaXNlLTAxLy4vbm9kZV9tb2R1bGVzL3NlZWQtcmFuZG9tL2luZGV4LmpzIiwid2VicGFjazovL2NhbnZhcy1za2V0Y2gtbm9pc2UtMDEvLi9ub2RlX21vZHVsZXMvc2ltcGxleC1ub2lzZS9zaW1wbGV4LW5vaXNlLmpzIiwid2VicGFjazovL2NhbnZhcy1za2V0Y2gtbm9pc2UtMDEvLi9zcmMvc2tldGNoZXMvZG90cy5qcyIsIndlYnBhY2s6Ly9jYW52YXMtc2tldGNoLW5vaXNlLTAxLy4vc3JjL3NrZXRjaGVzL2xpbmVzLmpzIiwid2VicGFjazovL2NhbnZhcy1za2V0Y2gtbm9pc2UtMDEvLi9zcmMvc2tldGNoZXMvd2F2ZXMuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLXNrZXRjaC1ub2lzZS0wMS8vVXNlcnMvc2pvZXJkYmVlbnRqZXMvQ29kZS9jYW52YXMtc2tldGNoLXBsYXlncm91bmQvc3JjL3NrZXRjaGVzfHN5bmN8L1xcLmpzJC8iLCJ3ZWJwYWNrOi8vY2FudmFzLXNrZXRjaC1ub2lzZS0wMS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jYW52YXMtc2tldGNoLW5vaXNlLTAxL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NhbnZhcy1za2V0Y2gtbm9pc2UtMDEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NhbnZhcy1za2V0Y2gtbm9pc2UtMDEvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9jYW52YXMtc2tldGNoLW5vaXNlLTAxL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FudmFzLXNrZXRjaC1ub2lzZS0wMS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NhbnZhcy1za2V0Y2gtbm9pc2UtMDEvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsY0FBYyxtQkFBTyxDQUFDLGdEQUFTO0FBQy9COztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsVUFBVTtBQUMzQjtBQUNBO0FBQ0EsS0FBSztBQUNMLGlCQUFpQixVQUFVO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdCQUFnQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzdOQSxpQkFBaUIsbUJBQU8sQ0FBQyx3REFBYTtBQUN0QyxtQkFBbUIsbUJBQU8sQ0FBQyxvRUFBZTtBQUMxQyxjQUFjLG1CQUFPLENBQUMsZ0RBQVM7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LGFBQWE7QUFDYjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxJQUFJOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxSEFBcUg7QUFDckg7QUFDQTtBQUNBLHVEQUF1RCxpRUFBaUUsRUFBRTtBQUMxSCxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQSxhQUFhLGNBQWM7QUFDM0I7QUFDQSxhQUFhLGFBQWE7QUFDMUI7QUFDQSxhQUFhLGFBQWE7QUFDMUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQSxDQUFDLEk7Ozs7O1dDUEQsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILG9CQUFvQiwyREFBNkM7QUFDakU7O0FBRUEiLCJmaWxlIjoiaW5kZXguYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGRlZmluZWQgPSByZXF1aXJlKCdkZWZpbmVkJyk7XG52YXIgRVBTSUxPTiA9IE51bWJlci5FUFNJTE9OO1xuXG5mdW5jdGlvbiBjbGFtcCAodmFsdWUsIG1pbiwgbWF4KSB7XG4gIHJldHVybiBtaW4gPCBtYXhcbiAgICA/ICh2YWx1ZSA8IG1pbiA/IG1pbiA6IHZhbHVlID4gbWF4ID8gbWF4IDogdmFsdWUpXG4gICAgOiAodmFsdWUgPCBtYXggPyBtYXggOiB2YWx1ZSA+IG1pbiA/IG1pbiA6IHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gY2xhbXAwMSAodikge1xuICByZXR1cm4gY2xhbXAodiwgMCwgMSk7XG59XG5cbmZ1bmN0aW9uIGxlcnAgKG1pbiwgbWF4LCB0KSB7XG4gIHJldHVybiBtaW4gKiAoMSAtIHQpICsgbWF4ICogdDtcbn1cblxuZnVuY3Rpb24gaW52ZXJzZUxlcnAgKG1pbiwgbWF4LCB0KSB7XG4gIGlmIChNYXRoLmFicyhtaW4gLSBtYXgpIDwgRVBTSUxPTikgcmV0dXJuIDA7XG4gIGVsc2UgcmV0dXJuICh0IC0gbWluKSAvIChtYXggLSBtaW4pO1xufVxuXG5mdW5jdGlvbiBzbW9vdGhzdGVwIChtaW4sIG1heCwgdCkge1xuICB2YXIgeCA9IGNsYW1wKGludmVyc2VMZXJwKG1pbiwgbWF4LCB0KSwgMCwgMSk7XG4gIHJldHVybiB4ICogeCAqICgzIC0gMiAqIHgpO1xufVxuXG5mdW5jdGlvbiB0b0Zpbml0ZSAobiwgZGVmYXVsdFZhbHVlKSB7XG4gIGRlZmF1bHRWYWx1ZSA9IGRlZmluZWQoZGVmYXVsdFZhbHVlLCAwKTtcbiAgcmV0dXJuIHR5cGVvZiBuID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShuKSA/IG4gOiBkZWZhdWx0VmFsdWU7XG59XG5cbmZ1bmN0aW9uIGV4cGFuZFZlY3RvciAoZGltcykge1xuICBpZiAodHlwZW9mIGRpbXMgIT09ICdudW1iZXInKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBkaW1zIGFyZ3VtZW50Jyk7XG4gIHJldHVybiBmdW5jdGlvbiAocCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgZGVmYXVsdFZhbHVlID0gZGVmaW5lZChkZWZhdWx0VmFsdWUsIDApO1xuICAgIHZhciBzY2FsYXI7XG4gICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgLy8gTm8gdmVjdG9yLCBjcmVhdGUgYSBkZWZhdWx0IG9uZVxuICAgICAgc2NhbGFyID0gZGVmYXVsdFZhbHVlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHAgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHApKSB7XG4gICAgICAvLyBFeHBhbmQgc2luZ2xlIGNoYW5uZWwgdG8gbXVsdGlwbGUgdmVjdG9yXG4gICAgICBzY2FsYXIgPSBwO1xuICAgIH1cblxuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgaTtcbiAgICBpZiAoc2NhbGFyID09IG51bGwpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBkaW1zOyBpKyspIHtcbiAgICAgICAgb3V0W2ldID0gdG9GaW5pdGUocFtpXSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGRpbXM7IGkrKykge1xuICAgICAgICBvdXRbaV0gPSBzY2FsYXI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxlcnBBcnJheSAobWluLCBtYXgsIHQsIG91dCkge1xuICBvdXQgPSBvdXQgfHwgW107XG4gIGlmIChtaW4ubGVuZ3RoICE9PSBtYXgubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbWluIGFuZCBtYXggYXJyYXkgYXJlIGV4cGVjdGVkIHRvIGhhdmUgdGhlIHNhbWUgbGVuZ3RoJyk7XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtaW4ubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRbaV0gPSBsZXJwKG1pbltpXSwgbWF4W2ldLCB0KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBuZXdBcnJheSAobiwgaW5pdGlhbFZhbHVlKSB7XG4gIG4gPSBkZWZpbmVkKG4sIDApO1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBuIGFyZ3VtZW50IHRvIGJlIGEgbnVtYmVyJyk7XG4gIHZhciBvdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIG91dC5wdXNoKGluaXRpYWxWYWx1ZSk7XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGxpbnNwYWNlIChuLCBvcHRzKSB7XG4gIG4gPSBkZWZpbmVkKG4sIDApO1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBuIGFyZ3VtZW50IHRvIGJlIGEgbnVtYmVyJyk7XG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdib29sZWFuJykge1xuICAgIG9wdHMgPSB7IGVuZHBvaW50OiB0cnVlIH07XG4gIH1cbiAgdmFyIG9mZnNldCA9IGRlZmluZWQob3B0cy5vZmZzZXQsIDApO1xuICBpZiAob3B0cy5lbmRwb2ludCkge1xuICAgIHJldHVybiBuZXdBcnJheShuKS5tYXAoZnVuY3Rpb24gKF8sIGkpIHtcbiAgICAgIHJldHVybiBuIDw9IDEgPyAwIDogKChpICsgb2Zmc2V0KSAvIChuIC0gMSkpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXdBcnJheShuKS5tYXAoZnVuY3Rpb24gKF8sIGkpIHtcbiAgICAgIHJldHVybiAoaSArIG9mZnNldCkgLyBuO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxlcnBGcmFtZXMgKHZhbHVlcywgdCwgb3V0KSB7XG4gIHQgPSBjbGFtcCh0LCAwLCAxKTtcblxuICB2YXIgbGVuID0gdmFsdWVzLmxlbmd0aCAtIDE7XG4gIHZhciB3aG9sZSA9IHQgKiBsZW47XG4gIHZhciBmcmFtZSA9IE1hdGguZmxvb3Iod2hvbGUpO1xuICB2YXIgZnJhY3QgPSB3aG9sZSAtIGZyYW1lO1xuXG4gIHZhciBuZXh0RnJhbWUgPSBNYXRoLm1pbihmcmFtZSArIDEsIGxlbik7XG4gIHZhciBhID0gdmFsdWVzW2ZyYW1lICUgdmFsdWVzLmxlbmd0aF07XG4gIHZhciBiID0gdmFsdWVzW25leHRGcmFtZSAlIHZhbHVlcy5sZW5ndGhdO1xuICBpZiAodHlwZW9mIGEgPT09ICdudW1iZXInICYmIHR5cGVvZiBiID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBsZXJwKGEsIGIsIGZyYWN0KTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGEpICYmIEFycmF5LmlzQXJyYXkoYikpIHtcbiAgICByZXR1cm4gbGVycEFycmF5KGEsIGIsIGZyYWN0LCBvdXQpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ01pc21hdGNoIGluIHZhbHVlIHR5cGUgb2YgdHdvIGFycmF5IGVsZW1lbnRzOiAnICsgZnJhbWUgKyAnIGFuZCAnICsgbmV4dEZyYW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2QgKGEsIGIpIHtcbiAgcmV0dXJuICgoYSAlIGIpICsgYikgJSBiO1xufVxuXG5mdW5jdGlvbiBkZWdUb1JhZCAobikge1xuICByZXR1cm4gbiAqIE1hdGguUEkgLyAxODA7XG59XG5cbmZ1bmN0aW9uIHJhZFRvRGVnIChuKSB7XG4gIHJldHVybiBuICogMTgwIC8gTWF0aC5QSTtcbn1cblxuZnVuY3Rpb24gZnJhY3QgKG4pIHtcbiAgcmV0dXJuIG4gLSBNYXRoLmZsb29yKG4pO1xufVxuXG5mdW5jdGlvbiBzaWduIChuKSB7XG4gIGlmIChuID4gMCkgcmV0dXJuIDE7XG4gIGVsc2UgaWYgKG4gPCAwKSByZXR1cm4gLTE7XG4gIGVsc2UgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIHdyYXAgKHZhbHVlLCBmcm9tLCB0bykge1xuICBpZiAodHlwZW9mIGZyb20gIT09ICdudW1iZXInIHx8IHR5cGVvZiB0byAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNdXN0IHNwZWNpZnkgXCJ0b1wiIGFuZCBcImZyb21cIiBhcmd1bWVudHMgYXMgbnVtYmVycycpO1xuICB9XG4gIC8vIGFsZ29yaXRobSBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU4NTI2MjgvNTk5ODg0XG4gIGlmIChmcm9tID4gdG8pIHtcbiAgICB2YXIgdCA9IGZyb207XG4gICAgZnJvbSA9IHRvO1xuICAgIHRvID0gdDtcbiAgfVxuICB2YXIgY3ljbGUgPSB0byAtIGZyb207XG4gIGlmIChjeWNsZSA9PT0gMCkge1xuICAgIHJldHVybiB0bztcbiAgfVxuICByZXR1cm4gdmFsdWUgLSBjeWNsZSAqIE1hdGguZmxvb3IoKHZhbHVlIC0gZnJvbSkgLyBjeWNsZSk7XG59XG5cbi8vIFNwZWNpZmljIGZ1bmN0aW9uIGZyb20gVW5pdHkgLyBvZk1hdGgsIG5vdCBzdXJlIGl0cyBuZWVkZWQ/XG4vLyBmdW5jdGlvbiBsZXJwV3JhcCAoYSwgYiwgdCwgbWluLCBtYXgpIHtcbi8vICAgcmV0dXJuIHdyYXAoYSArIHdyYXAoYiAtIGEsIG1pbiwgbWF4KSAqIHQsIG1pbiwgbWF4KVxuLy8gfVxuXG5mdW5jdGlvbiBwaW5nUG9uZyAodCwgbGVuZ3RoKSB7XG4gIHQgPSBtb2QodCwgbGVuZ3RoICogMik7XG4gIHJldHVybiBsZW5ndGggLSBNYXRoLmFicyh0IC0gbGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gZGFtcCAoYSwgYiwgbGFtYmRhLCBkdCkge1xuICByZXR1cm4gbGVycChhLCBiLCAxIC0gTWF0aC5leHAoLWxhbWJkYSAqIGR0KSk7XG59XG5cbmZ1bmN0aW9uIGRhbXBBcnJheSAoYSwgYiwgbGFtYmRhLCBkdCwgb3V0KSB7XG4gIG91dCA9IG91dCB8fCBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0W2ldID0gZGFtcChhW2ldLCBiW2ldLCBsYW1iZGEsIGR0KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBtYXBSYW5nZSAodmFsdWUsIGlucHV0TWluLCBpbnB1dE1heCwgb3V0cHV0TWluLCBvdXRwdXRNYXgsIGNsYW1wKSB7XG4gIC8vIFJlZmVyZW5jZTpcbiAgLy8gaHR0cHM6Ly9vcGVuZnJhbWV3b3Jrcy5jYy9kb2N1bWVudGF0aW9uL21hdGgvb2ZNYXRoL1xuICBpZiAoTWF0aC5hYnMoaW5wdXRNaW4gLSBpbnB1dE1heCkgPCBFUFNJTE9OKSB7XG4gICAgcmV0dXJuIG91dHB1dE1pbjtcbiAgfSBlbHNlIHtcbiAgICB2YXIgb3V0VmFsID0gKCh2YWx1ZSAtIGlucHV0TWluKSAvIChpbnB1dE1heCAtIGlucHV0TWluKSAqIChvdXRwdXRNYXggLSBvdXRwdXRNaW4pICsgb3V0cHV0TWluKTtcbiAgICBpZiAoY2xhbXApIHtcbiAgICAgIGlmIChvdXRwdXRNYXggPCBvdXRwdXRNaW4pIHtcbiAgICAgICAgaWYgKG91dFZhbCA8IG91dHB1dE1heCkgb3V0VmFsID0gb3V0cHV0TWF4O1xuICAgICAgICBlbHNlIGlmIChvdXRWYWwgPiBvdXRwdXRNaW4pIG91dFZhbCA9IG91dHB1dE1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvdXRWYWwgPiBvdXRwdXRNYXgpIG91dFZhbCA9IG91dHB1dE1heDtcbiAgICAgICAgZWxzZSBpZiAob3V0VmFsIDwgb3V0cHV0TWluKSBvdXRWYWwgPSBvdXRwdXRNaW47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRWYWw7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1vZDogbW9kLFxuICBmcmFjdDogZnJhY3QsXG4gIHNpZ246IHNpZ24sXG4gIGRlZ1RvUmFkOiBkZWdUb1JhZCxcbiAgcmFkVG9EZWc6IHJhZFRvRGVnLFxuICB3cmFwOiB3cmFwLFxuICBwaW5nUG9uZzogcGluZ1BvbmcsXG4gIGxpbnNwYWNlOiBsaW5zcGFjZSxcbiAgbGVycDogbGVycCxcbiAgbGVycEFycmF5OiBsZXJwQXJyYXksXG4gIGludmVyc2VMZXJwOiBpbnZlcnNlTGVycCxcbiAgbGVycEZyYW1lczogbGVycEZyYW1lcyxcbiAgY2xhbXA6IGNsYW1wLFxuICBjbGFtcDAxOiBjbGFtcDAxLFxuICBzbW9vdGhzdGVwOiBzbW9vdGhzdGVwLFxuICBkYW1wOiBkYW1wLFxuICBkYW1wQXJyYXk6IGRhbXBBcnJheSxcbiAgbWFwUmFuZ2U6IG1hcFJhbmdlLFxuICBleHBhbmQyRDogZXhwYW5kVmVjdG9yKDIpLFxuICBleHBhbmQzRDogZXhwYW5kVmVjdG9yKDMpLFxuICBleHBhbmQ0RDogZXhwYW5kVmVjdG9yKDQpXG59O1xuIiwidmFyIHNlZWRSYW5kb20gPSByZXF1aXJlKCdzZWVkLXJhbmRvbScpO1xudmFyIFNpbXBsZXhOb2lzZSA9IHJlcXVpcmUoJ3NpbXBsZXgtbm9pc2UnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnZGVmaW5lZCcpO1xuXG5mdW5jdGlvbiBjcmVhdGVSYW5kb20gKGRlZmF1bHRTZWVkKSB7XG4gIGRlZmF1bHRTZWVkID0gZGVmaW5lZChkZWZhdWx0U2VlZCwgbnVsbCk7XG4gIHZhciBkZWZhdWx0UmFuZG9tID0gTWF0aC5yYW5kb207XG4gIHZhciBjdXJyZW50U2VlZDtcbiAgdmFyIGN1cnJlbnRSYW5kb207XG4gIHZhciBub2lzZUdlbmVyYXRvcjtcbiAgdmFyIF9uZXh0R2F1c3NpYW4gPSBudWxsO1xuICB2YXIgX2hhc05leHRHYXVzc2lhbiA9IGZhbHNlO1xuXG4gIHNldFNlZWQoZGVmYXVsdFNlZWQpO1xuXG4gIHJldHVybiB7XG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGNyZWF0ZVJhbmRvbTogZnVuY3Rpb24gKGRlZmF1bHRTZWVkKSB7XG4gICAgICByZXR1cm4gY3JlYXRlUmFuZG9tKGRlZmF1bHRTZWVkKTtcbiAgICB9LFxuICAgIHNldFNlZWQ6IHNldFNlZWQsXG4gICAgZ2V0U2VlZDogZ2V0U2VlZCxcbiAgICBnZXRSYW5kb21TZWVkOiBnZXRSYW5kb21TZWVkLFxuICAgIHZhbHVlTm9uWmVybzogdmFsdWVOb25aZXJvLFxuICAgIHBlcm11dGVOb2lzZTogcGVybXV0ZU5vaXNlLFxuICAgIG5vaXNlMUQ6IG5vaXNlMUQsXG4gICAgbm9pc2UyRDogbm9pc2UyRCxcbiAgICBub2lzZTNEOiBub2lzZTNELFxuICAgIG5vaXNlNEQ6IG5vaXNlNEQsXG4gICAgc2lnbjogc2lnbixcbiAgICBib29sZWFuOiBib29sZWFuLFxuICAgIGNoYW5jZTogY2hhbmNlLFxuICAgIHJhbmdlOiByYW5nZSxcbiAgICByYW5nZUZsb29yOiByYW5nZUZsb29yLFxuICAgIHBpY2s6IHBpY2ssXG4gICAgc2h1ZmZsZTogc2h1ZmZsZSxcbiAgICBvbkNpcmNsZTogb25DaXJjbGUsXG4gICAgaW5zaWRlQ2lyY2xlOiBpbnNpZGVDaXJjbGUsXG4gICAgb25TcGhlcmU6IG9uU3BoZXJlLFxuICAgIGluc2lkZVNwaGVyZTogaW5zaWRlU3BoZXJlLFxuICAgIHF1YXRlcm5pb246IHF1YXRlcm5pb24sXG4gICAgd2VpZ2h0ZWQ6IHdlaWdodGVkLFxuICAgIHdlaWdodGVkU2V0OiB3ZWlnaHRlZFNldCxcbiAgICB3ZWlnaHRlZFNldEluZGV4OiB3ZWlnaHRlZFNldEluZGV4LFxuICAgIGdhdXNzaWFuOiBnYXVzc2lhblxuICB9O1xuXG4gIGZ1bmN0aW9uIHNldFNlZWQgKHNlZWQsIG9wdCkge1xuICAgIGlmICh0eXBlb2Ygc2VlZCA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHNlZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjdXJyZW50U2VlZCA9IHNlZWQ7XG4gICAgICBjdXJyZW50UmFuZG9tID0gc2VlZFJhbmRvbShjdXJyZW50U2VlZCwgb3B0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFNlZWQgPSB1bmRlZmluZWQ7XG4gICAgICBjdXJyZW50UmFuZG9tID0gZGVmYXVsdFJhbmRvbTtcbiAgICB9XG4gICAgbm9pc2VHZW5lcmF0b3IgPSBjcmVhdGVOb2lzZSgpO1xuICAgIF9uZXh0R2F1c3NpYW4gPSBudWxsO1xuICAgIF9oYXNOZXh0R2F1c3NpYW4gPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbHVlICgpIHtcbiAgICByZXR1cm4gY3VycmVudFJhbmRvbSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gdmFsdWVOb25aZXJvICgpIHtcbiAgICB2YXIgdSA9IDA7XG4gICAgd2hpbGUgKHUgPT09IDApIHUgPSB2YWx1ZSgpO1xuICAgIHJldHVybiB1O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2VlZCAoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRTZWVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmFuZG9tU2VlZCAoKSB7XG4gICAgdmFyIHNlZWQgPSBTdHJpbmcoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCkpO1xuICAgIHJldHVybiBzZWVkO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9pc2UgKCkge1xuICAgIHJldHVybiBuZXcgU2ltcGxleE5vaXNlKGN1cnJlbnRSYW5kb20pO1xuICB9XG5cbiAgZnVuY3Rpb24gcGVybXV0ZU5vaXNlICgpIHtcbiAgICBub2lzZUdlbmVyYXRvciA9IGNyZWF0ZU5vaXNlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBub2lzZTFEICh4LCBmcmVxdWVuY3ksIGFtcGxpdHVkZSkge1xuICAgIGlmICghaXNGaW5pdGUoeCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ggY29tcG9uZW50IGZvciBub2lzZSgpIG11c3QgYmUgZmluaXRlJyk7XG4gICAgZnJlcXVlbmN5ID0gZGVmaW5lZChmcmVxdWVuY3ksIDEpO1xuICAgIGFtcGxpdHVkZSA9IGRlZmluZWQoYW1wbGl0dWRlLCAxKTtcbiAgICByZXR1cm4gYW1wbGl0dWRlICogbm9pc2VHZW5lcmF0b3Iubm9pc2UyRCh4ICogZnJlcXVlbmN5LCAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vaXNlMkQgKHgsIHksIGZyZXF1ZW5jeSwgYW1wbGl0dWRlKSB7XG4gICAgaWYgKCFpc0Zpbml0ZSh4KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigneCBjb21wb25lbnQgZm9yIG5vaXNlKCkgbXVzdCBiZSBmaW5pdGUnKTtcbiAgICBpZiAoIWlzRmluaXRlKHkpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCd5IGNvbXBvbmVudCBmb3Igbm9pc2UoKSBtdXN0IGJlIGZpbml0ZScpO1xuICAgIGZyZXF1ZW5jeSA9IGRlZmluZWQoZnJlcXVlbmN5LCAxKTtcbiAgICBhbXBsaXR1ZGUgPSBkZWZpbmVkKGFtcGxpdHVkZSwgMSk7XG4gICAgcmV0dXJuIGFtcGxpdHVkZSAqIG5vaXNlR2VuZXJhdG9yLm5vaXNlMkQoeCAqIGZyZXF1ZW5jeSwgeSAqIGZyZXF1ZW5jeSk7XG4gIH1cblxuICBmdW5jdGlvbiBub2lzZTNEICh4LCB5LCB6LCBmcmVxdWVuY3ksIGFtcGxpdHVkZSkge1xuICAgIGlmICghaXNGaW5pdGUoeCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ggY29tcG9uZW50IGZvciBub2lzZSgpIG11c3QgYmUgZmluaXRlJyk7XG4gICAgaWYgKCFpc0Zpbml0ZSh5KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigneSBjb21wb25lbnQgZm9yIG5vaXNlKCkgbXVzdCBiZSBmaW5pdGUnKTtcbiAgICBpZiAoIWlzRmluaXRlKHopKSB0aHJvdyBuZXcgVHlwZUVycm9yKCd6IGNvbXBvbmVudCBmb3Igbm9pc2UoKSBtdXN0IGJlIGZpbml0ZScpO1xuICAgIGZyZXF1ZW5jeSA9IGRlZmluZWQoZnJlcXVlbmN5LCAxKTtcbiAgICBhbXBsaXR1ZGUgPSBkZWZpbmVkKGFtcGxpdHVkZSwgMSk7XG4gICAgcmV0dXJuIGFtcGxpdHVkZSAqIG5vaXNlR2VuZXJhdG9yLm5vaXNlM0QoXG4gICAgICB4ICogZnJlcXVlbmN5LFxuICAgICAgeSAqIGZyZXF1ZW5jeSxcbiAgICAgIHogKiBmcmVxdWVuY3lcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gbm9pc2U0RCAoeCwgeSwgeiwgdywgZnJlcXVlbmN5LCBhbXBsaXR1ZGUpIHtcbiAgICBpZiAoIWlzRmluaXRlKHgpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCd4IGNvbXBvbmVudCBmb3Igbm9pc2UoKSBtdXN0IGJlIGZpbml0ZScpO1xuICAgIGlmICghaXNGaW5pdGUoeSkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3kgY29tcG9uZW50IGZvciBub2lzZSgpIG11c3QgYmUgZmluaXRlJyk7XG4gICAgaWYgKCFpc0Zpbml0ZSh6KSkgdGhyb3cgbmV3IFR5cGVFcnJvcigneiBjb21wb25lbnQgZm9yIG5vaXNlKCkgbXVzdCBiZSBmaW5pdGUnKTtcbiAgICBpZiAoIWlzRmluaXRlKHcpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCd3IGNvbXBvbmVudCBmb3Igbm9pc2UoKSBtdXN0IGJlIGZpbml0ZScpO1xuICAgIGZyZXF1ZW5jeSA9IGRlZmluZWQoZnJlcXVlbmN5LCAxKTtcbiAgICBhbXBsaXR1ZGUgPSBkZWZpbmVkKGFtcGxpdHVkZSwgMSk7XG4gICAgcmV0dXJuIGFtcGxpdHVkZSAqIG5vaXNlR2VuZXJhdG9yLm5vaXNlNEQoXG4gICAgICB4ICogZnJlcXVlbmN5LFxuICAgICAgeSAqIGZyZXF1ZW5jeSxcbiAgICAgIHogKiBmcmVxdWVuY3ksXG4gICAgICB3ICogZnJlcXVlbmN5XG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNpZ24gKCkge1xuICAgIHJldHVybiBib29sZWFuKCkgPyAxIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBib29sZWFuICgpIHtcbiAgICByZXR1cm4gdmFsdWUoKSA+IDAuNTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoYW5jZSAobikge1xuICAgIG4gPSBkZWZpbmVkKG4sIDAuNSk7XG4gICAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgbiB0byBiZSBhIG51bWJlcicpO1xuICAgIHJldHVybiB2YWx1ZSgpIDwgbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmdlIChtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG1pbiAhPT0gJ251bWJlcicgfHwgdHlwZW9mIG1heCAhPT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGFsbCBhcmd1bWVudHMgdG8gYmUgbnVtYmVycycpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZSgpICogKG1heCAtIG1pbikgKyBtaW47XG4gIH1cblxuICBmdW5jdGlvbiByYW5nZUZsb29yIChtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG1pbiAhPT0gJ251bWJlcicgfHwgdHlwZW9mIG1heCAhPT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGFsbCBhcmd1bWVudHMgdG8gYmUgbnVtYmVycycpO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLmZsb29yKHJhbmdlKG1pbiwgbWF4KSk7XG4gIH1cblxuICBmdW5jdGlvbiBwaWNrIChhcnJheSkge1xuICAgIGlmIChhcnJheS5sZW5ndGggPT09IDApIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIGFycmF5W3JhbmdlRmxvb3IoMCwgYXJyYXkubGVuZ3RoKV07XG4gIH1cblxuICBmdW5jdGlvbiBzaHVmZmxlIChhcnIpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgQXJyYXksIGdvdCAnICsgdHlwZW9mIGFycik7XG4gICAgfVxuXG4gICAgdmFyIHJhbmQ7XG4gICAgdmFyIHRtcDtcbiAgICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgICB2YXIgcmV0ID0gYXJyLnNsaWNlKCk7XG4gICAgd2hpbGUgKGxlbikge1xuICAgICAgcmFuZCA9IE1hdGguZmxvb3IodmFsdWUoKSAqIGxlbi0tKTtcbiAgICAgIHRtcCA9IHJldFtsZW5dO1xuICAgICAgcmV0W2xlbl0gPSByZXRbcmFuZF07XG4gICAgICByZXRbcmFuZF0gPSB0bXA7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBvbkNpcmNsZSAocmFkaXVzLCBvdXQpIHtcbiAgICByYWRpdXMgPSBkZWZpbmVkKHJhZGl1cywgMSk7XG4gICAgb3V0ID0gb3V0IHx8IFtdO1xuICAgIHZhciB0aGV0YSA9IHZhbHVlKCkgKiAyLjAgKiBNYXRoLlBJO1xuICAgIG91dFswXSA9IHJhZGl1cyAqIE1hdGguY29zKHRoZXRhKTtcbiAgICBvdXRbMV0gPSByYWRpdXMgKiBNYXRoLnNpbih0aGV0YSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2lkZUNpcmNsZSAocmFkaXVzLCBvdXQpIHtcbiAgICByYWRpdXMgPSBkZWZpbmVkKHJhZGl1cywgMSk7XG4gICAgb3V0ID0gb3V0IHx8IFtdO1xuICAgIG9uQ2lyY2xlKDEsIG91dCk7XG4gICAgdmFyIHIgPSByYWRpdXMgKiBNYXRoLnNxcnQodmFsdWUoKSk7XG4gICAgb3V0WzBdICo9IHI7XG4gICAgb3V0WzFdICo9IHI7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU3BoZXJlIChyYWRpdXMsIG91dCkge1xuICAgIHJhZGl1cyA9IGRlZmluZWQocmFkaXVzLCAxKTtcbiAgICBvdXQgPSBvdXQgfHwgW107XG4gICAgdmFyIHUgPSB2YWx1ZSgpICogTWF0aC5QSSAqIDI7XG4gICAgdmFyIHYgPSB2YWx1ZSgpICogMiAtIDE7XG4gICAgdmFyIHBoaSA9IHU7XG4gICAgdmFyIHRoZXRhID0gTWF0aC5hY29zKHYpO1xuICAgIG91dFswXSA9IHJhZGl1cyAqIE1hdGguc2luKHRoZXRhKSAqIE1hdGguY29zKHBoaSk7XG4gICAgb3V0WzFdID0gcmFkaXVzICogTWF0aC5zaW4odGhldGEpICogTWF0aC5zaW4ocGhpKTtcbiAgICBvdXRbMl0gPSByYWRpdXMgKiBNYXRoLmNvcyh0aGV0YSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2lkZVNwaGVyZSAocmFkaXVzLCBvdXQpIHtcbiAgICByYWRpdXMgPSBkZWZpbmVkKHJhZGl1cywgMSk7XG4gICAgb3V0ID0gb3V0IHx8IFtdO1xuICAgIHZhciB1ID0gdmFsdWUoKSAqIE1hdGguUEkgKiAyO1xuICAgIHZhciB2ID0gdmFsdWUoKSAqIDIgLSAxO1xuICAgIHZhciBrID0gdmFsdWUoKTtcblxuICAgIHZhciBwaGkgPSB1O1xuICAgIHZhciB0aGV0YSA9IE1hdGguYWNvcyh2KTtcbiAgICB2YXIgciA9IHJhZGl1cyAqIE1hdGguY2JydChrKTtcbiAgICBvdXRbMF0gPSByICogTWF0aC5zaW4odGhldGEpICogTWF0aC5jb3MocGhpKTtcbiAgICBvdXRbMV0gPSByICogTWF0aC5zaW4odGhldGEpICogTWF0aC5zaW4ocGhpKTtcbiAgICBvdXRbMl0gPSByICogTWF0aC5jb3ModGhldGEpO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBxdWF0ZXJuaW9uIChvdXQpIHtcbiAgICBvdXQgPSBvdXQgfHwgW107XG4gICAgdmFyIHUxID0gdmFsdWUoKTtcbiAgICB2YXIgdTIgPSB2YWx1ZSgpO1xuICAgIHZhciB1MyA9IHZhbHVlKCk7XG5cbiAgICB2YXIgc3ExID0gTWF0aC5zcXJ0KDEgLSB1MSk7XG4gICAgdmFyIHNxMiA9IE1hdGguc3FydCh1MSk7XG5cbiAgICB2YXIgdGhldGExID0gTWF0aC5QSSAqIDIgKiB1MjtcbiAgICB2YXIgdGhldGEyID0gTWF0aC5QSSAqIDIgKiB1MztcblxuICAgIHZhciB4ID0gTWF0aC5zaW4odGhldGExKSAqIHNxMTtcbiAgICB2YXIgeSA9IE1hdGguY29zKHRoZXRhMSkgKiBzcTE7XG4gICAgdmFyIHogPSBNYXRoLnNpbih0aGV0YTIpICogc3EyO1xuICAgIHZhciB3ID0gTWF0aC5jb3ModGhldGEyKSAqIHNxMjtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgb3V0WzJdID0gejtcbiAgICBvdXRbM10gPSB3O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBmdW5jdGlvbiB3ZWlnaHRlZFNldCAoc2V0KSB7XG4gICAgc2V0ID0gc2V0IHx8IFtdO1xuICAgIGlmIChzZXQubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gc2V0W3dlaWdodGVkU2V0SW5kZXgoc2V0KV0udmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiB3ZWlnaHRlZFNldEluZGV4IChzZXQpIHtcbiAgICBzZXQgPSBzZXQgfHwgW107XG4gICAgaWYgKHNldC5sZW5ndGggPT09IDApIHJldHVybiAtMTtcbiAgICByZXR1cm4gd2VpZ2h0ZWQoc2V0Lm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIHMud2VpZ2h0O1xuICAgIH0pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdlaWdodGVkICh3ZWlnaHRzKSB7XG4gICAgd2VpZ2h0cyA9IHdlaWdodHMgfHwgW107XG4gICAgaWYgKHdlaWdodHMubGVuZ3RoID09PSAwKSByZXR1cm4gLTE7XG4gICAgdmFyIHRvdGFsV2VpZ2h0ID0gMDtcbiAgICB2YXIgaTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCB3ZWlnaHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbFdlaWdodCArPSB3ZWlnaHRzW2ldO1xuICAgIH1cblxuICAgIGlmICh0b3RhbFdlaWdodCA8PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ1dlaWdodHMgbXVzdCBzdW0gdG8gPiAwJyk7XG5cbiAgICB2YXIgcmFuZG9tID0gdmFsdWUoKSAqIHRvdGFsV2VpZ2h0O1xuICAgIGZvciAoaSA9IDA7IGkgPCB3ZWlnaHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmFuZG9tIDwgd2VpZ2h0c1tpXSkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICAgIHJhbmRvbSAtPSB3ZWlnaHRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdhdXNzaWFuIChtZWFuLCBzdGFuZGFyZERlcml2YXRpb24pIHtcbiAgICBtZWFuID0gZGVmaW5lZChtZWFuLCAwKTtcbiAgICBzdGFuZGFyZERlcml2YXRpb24gPSBkZWZpbmVkKHN0YW5kYXJkRGVyaXZhdGlvbiwgMSk7XG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vb3Blbmpkay1taXJyb3IvamRrN3UtamRrL2Jsb2IvZjRkODA5NTdlODlhMTlhMjliYjlmOTgwN2QyYTI4MzUxZWQ3ZjdkZi9zcmMvc2hhcmUvY2xhc3Nlcy9qYXZhL3V0aWwvUmFuZG9tLmphdmEjTDQ5NlxuICAgIGlmIChfaGFzTmV4dEdhdXNzaWFuKSB7XG4gICAgICBfaGFzTmV4dEdhdXNzaWFuID0gZmFsc2U7XG4gICAgICB2YXIgcmVzdWx0ID0gX25leHRHYXVzc2lhbjtcbiAgICAgIF9uZXh0R2F1c3NpYW4gPSBudWxsO1xuICAgICAgcmV0dXJuIG1lYW4gKyBzdGFuZGFyZERlcml2YXRpb24gKiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2MSA9IDA7XG4gICAgICB2YXIgdjIgPSAwO1xuICAgICAgdmFyIHMgPSAwO1xuICAgICAgZG8ge1xuICAgICAgICB2MSA9IHZhbHVlKCkgKiAyIC0gMTsgLy8gYmV0d2VlbiAtMSBhbmQgMVxuICAgICAgICB2MiA9IHZhbHVlKCkgKiAyIC0gMTsgLy8gYmV0d2VlbiAtMSBhbmQgMVxuICAgICAgICBzID0gdjEgKiB2MSArIHYyICogdjI7XG4gICAgICB9IHdoaWxlIChzID49IDEgfHwgcyA9PT0gMCk7XG4gICAgICB2YXIgbXVsdGlwbGllciA9IE1hdGguc3FydCgtMiAqIE1hdGgubG9nKHMpIC8gcyk7XG4gICAgICBfbmV4dEdhdXNzaWFuID0gKHYyICogbXVsdGlwbGllcik7XG4gICAgICBfaGFzTmV4dEdhdXNzaWFuID0gdHJ1ZTtcbiAgICAgIHJldHVybiBtZWFuICsgc3RhbmRhcmREZXJpdmF0aW9uICogKHYxICogbXVsdGlwbGllcik7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUmFuZG9tKCk7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdjb252ZXJ0LWxlbmd0aCcpKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnY29udmVydC1sZW5ndGgnXSwgZmFjdG9yeSkgOlxuICAgIChnbG9iYWwuY2FudmFzU2tldGNoID0gZmFjdG9yeShudWxsKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoY29udmVydExlbmd0aCkge1xuXG4gICAgY29udmVydExlbmd0aCA9IGNvbnZlcnRMZW5ndGggJiYgY29udmVydExlbmd0aC5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpID8gY29udmVydExlbmd0aFsnZGVmYXVsdCddIDogY29udmVydExlbmd0aDtcblxuICAgIHZhciBkZWZpbmVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qXG4gICAgb2JqZWN0LWFzc2lnblxuICAgIChjKSBTaW5kcmUgU29yaHVzXG4gICAgQGxpY2Vuc2UgTUlUXG4gICAgKi9cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICAgIHZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuICAgIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gICAgdmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4gICAgZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG4gICAgXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG4gICAgXHR9XG5cbiAgICBcdHJldHVybiBPYmplY3QodmFsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG4gICAgXHR0cnkge1xuICAgIFx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcbiAgICBcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdH1cblxuICAgIFx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cbiAgICBcdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuICAgIFx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG4gICAgXHRcdHRlc3QxWzVdID0gJ2RlJztcbiAgICBcdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG4gICAgXHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHR9XG5cbiAgICBcdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuICAgIFx0XHR2YXIgdGVzdDIgPSB7fTtcbiAgICBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuICAgIFx0XHR9XG4gICAgXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG4gICAgXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuICAgIFx0XHR9KTtcbiAgICBcdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG4gICAgXHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHR9XG5cbiAgICBcdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuICAgIFx0XHR2YXIgdGVzdDMgPSB7fTtcbiAgICBcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG4gICAgXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcbiAgICBcdFx0fSk7XG4gICAgXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuICAgIFx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuICAgIFx0XHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0fVxuXG4gICAgXHRcdHJldHVybiB0cnVlO1xuICAgIFx0fSBjYXRjaCAoZXJyKSB7XG4gICAgXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG4gICAgXHRcdHJldHVybiBmYWxzZTtcbiAgICBcdH1cbiAgICB9XG5cbiAgICB2YXIgb2JqZWN0QXNzaWduID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gICAgXHR2YXIgZnJvbTtcbiAgICBcdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG4gICAgXHR2YXIgc3ltYm9scztcblxuICAgIFx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcbiAgICBcdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG4gICAgXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG4gICAgXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuICAgIFx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcbiAgICBcdFx0XHR9XG4gICAgXHRcdH1cblxuICAgIFx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcbiAgICBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcbiAgICBcdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcbiAgICBcdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuICAgIFx0fVxuXG4gICAgXHRyZXR1cm4gdG87XG4gICAgfTtcblxuICAgIHZhciBjb21tb25qc0dsb2JhbCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDoge307XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDb21tb25qc01vZHVsZShmbiwgbW9kdWxlKSB7XG4gICAgXHRyZXR1cm4gbW9kdWxlID0geyBleHBvcnRzOiB7fSB9LCBmbihtb2R1bGUsIG1vZHVsZS5leHBvcnRzKSwgbW9kdWxlLmV4cG9ydHM7XG4gICAgfVxuXG4gICAgdmFyIGJyb3dzZXIgPVxuICAgICAgY29tbW9uanNHbG9iYWwucGVyZm9ybWFuY2UgJiZcbiAgICAgIGNvbW1vbmpzR2xvYmFsLnBlcmZvcm1hbmNlLm5vdyA/IGZ1bmN0aW9uIG5vdygpIHtcbiAgICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpXG4gICAgICB9IDogRGF0ZS5ub3cgfHwgZnVuY3Rpb24gbm93KCkge1xuICAgICAgICByZXR1cm4gK25ldyBEYXRlXG4gICAgICB9O1xuXG4gICAgdmFyIGlzUHJvbWlzZV8xID0gaXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gaXNQcm9taXNlKG9iaikge1xuICAgICAgcmV0dXJuICEhb2JqICYmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSAmJiB0eXBlb2Ygb2JqLnRoZW4gPT09ICdmdW5jdGlvbic7XG4gICAgfVxuXG4gICAgdmFyIGlzRG9tID0gaXNOb2RlO1xuXG4gICAgZnVuY3Rpb24gaXNOb2RlICh2YWwpIHtcbiAgICAgIHJldHVybiAoIXZhbCB8fCB0eXBlb2YgdmFsICE9PSAnb2JqZWN0JylcbiAgICAgICAgPyBmYWxzZVxuICAgICAgICA6ICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygd2luZG93Lk5vZGUgPT09ICdvYmplY3QnKVxuICAgICAgICAgID8gKHZhbCBpbnN0YW5jZW9mIHdpbmRvdy5Ob2RlKVxuICAgICAgICAgIDogKHR5cGVvZiB2YWwubm9kZVR5cGUgPT09ICdudW1iZXInKSAmJlxuICAgICAgICAgICAgKHR5cGVvZiB2YWwubm9kZU5hbWUgPT09ICdzdHJpbmcnKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENsaWVudEFQSSgpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvd1snY2FudmFzLXNrZXRjaC1jbGknXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzV2ViR0xDb250ZXh0KGN0eCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGN0eC5jbGVhciA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgY3R4LmNsZWFyQ29sb3IgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGN0eC5idWZmZXJEYXRhID09PSAnZnVuY3Rpb24nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQ2FudmFzKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGlzRG9tKGVsZW1lbnQpICYmIC9jYW52YXMvaS50ZXN0KGVsZW1lbnQubm9kZU5hbWUpICYmIHR5cGVvZiBlbGVtZW50LmdldENvbnRleHQgPT09ICdmdW5jdGlvbic7XG4gICAgfVxuXG4gICAgdmFyIGtleXMgPSBjcmVhdGVDb21tb25qc01vZHVsZShmdW5jdGlvbiAobW9kdWxlLCBleHBvcnRzKSB7XG4gICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nXG4gICAgICA/IE9iamVjdC5rZXlzIDogc2hpbTtcblxuICAgIGV4cG9ydHMuc2hpbSA9IHNoaW07XG4gICAgZnVuY3Rpb24gc2hpbSAob2JqKSB7XG4gICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9XG4gICAgfSk7XG4gICAgdmFyIGtleXNfMSA9IGtleXMuc2hpbTtcblxuICAgIHZhciBpc19hcmd1bWVudHMgPSBjcmVhdGVDb21tb25qc01vZHVsZShmdW5jdGlvbiAobW9kdWxlLCBleHBvcnRzKSB7XG4gICAgdmFyIHN1cHBvcnRzQXJndW1lbnRzQ2xhc3MgPSAoZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJndW1lbnRzKVxuICAgIH0pKCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbiAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBzdXBwb3J0c0FyZ3VtZW50c0NsYXNzID8gc3VwcG9ydGVkIDogdW5zdXBwb3J0ZWQ7XG5cbiAgICBleHBvcnRzLnN1cHBvcnRlZCA9IHN1cHBvcnRlZDtcbiAgICBmdW5jdGlvbiBzdXBwb3J0ZWQob2JqZWN0KSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG4gICAgfVxuICAgIGV4cG9ydHMudW5zdXBwb3J0ZWQgPSB1bnN1cHBvcnRlZDtcbiAgICBmdW5jdGlvbiB1bnN1cHBvcnRlZChvYmplY3Qpe1xuICAgICAgcmV0dXJuIG9iamVjdCAmJlxuICAgICAgICB0eXBlb2Ygb2JqZWN0ID09ICdvYmplY3QnICYmXG4gICAgICAgIHR5cGVvZiBvYmplY3QubGVuZ3RoID09ICdudW1iZXInICYmXG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdjYWxsZWUnKSAmJlxuICAgICAgICAhT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iamVjdCwgJ2NhbGxlZScpIHx8XG4gICAgICAgIGZhbHNlO1xuICAgIH19KTtcbiAgICB2YXIgaXNfYXJndW1lbnRzXzEgPSBpc19hcmd1bWVudHMuc3VwcG9ydGVkO1xuICAgIHZhciBpc19hcmd1bWVudHNfMiA9IGlzX2FyZ3VtZW50cy51bnN1cHBvcnRlZDtcblxuICAgIHZhciBkZWVwRXF1YWxfMSA9IGNyZWF0ZUNvbW1vbmpzTW9kdWxlKGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICB2YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5cblxuICAgIHZhciBkZWVwRXF1YWwgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBvcHRzKSB7XG4gICAgICBpZiAoIW9wdHMpIG9wdHMgPSB7fTtcbiAgICAgIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICAgICAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIH0gZWxzZSBpZiAoYWN0dWFsIGluc3RhbmNlb2YgRGF0ZSAmJiBleHBlY3RlZCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAgICAgLy8gNy4zLiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAgICAgLy8gZXF1aXZhbGVuY2UgaXMgZGV0ZXJtaW5lZCBieSA9PS5cbiAgICAgIH0gZWxzZSBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQgfHwgdHlwZW9mIGFjdHVhbCAhPSAnb2JqZWN0JyAmJiB0eXBlb2YgZXhwZWN0ZWQgIT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG9wdHMuc3RyaWN0ID8gYWN0dWFsID09PSBleHBlY3RlZCA6IGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAgICAgLy8gNy40LiBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gICAgICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgICAgIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgICAgIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgICAgIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gICAgICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkLCBvcHRzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWRPck51bGwodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQnVmZmVyICh4KSB7XG4gICAgICBpZiAoIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnIHx8IHR5cGVvZiB4Lmxlbmd0aCAhPT0gJ251bWJlcicpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICh0eXBlb2YgeC5jb3B5ICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB4LnNsaWNlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh4Lmxlbmd0aCA+IDAgJiYgdHlwZW9mIHhbMF0gIT09ICdudW1iZXInKSByZXR1cm4gZmFsc2U7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvYmpFcXVpdihhLCBiLCBvcHRzKSB7XG4gICAgICB2YXIgaSwga2V5O1xuICAgICAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKGEpIHx8IGlzVW5kZWZpbmVkT3JOdWxsKGIpKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuXG4gICAgICBpZiAoYS5wcm90b3R5cGUgIT09IGIucHJvdG90eXBlKSByZXR1cm4gZmFsc2U7XG4gICAgICAvL35+fkkndmUgbWFuYWdlZCB0byBicmVhayBPYmplY3Qua2V5cyB0aHJvdWdoIHNjcmV3eSBhcmd1bWVudHMgcGFzc2luZy5cbiAgICAgIC8vICAgQ29udmVydGluZyB0byBhcnJheSBzb2x2ZXMgdGhlIHByb2JsZW0uXG4gICAgICBpZiAoaXNfYXJndW1lbnRzKGEpKSB7XG4gICAgICAgIGlmICghaXNfYXJndW1lbnRzKGIpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICAgICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgICAgICByZXR1cm4gZGVlcEVxdWFsKGEsIGIsIG9wdHMpO1xuICAgICAgfVxuICAgICAgaWYgKGlzQnVmZmVyKGEpKSB7XG4gICAgICAgIGlmICghaXNCdWZmZXIoYikpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChhW2ldICE9PSBiW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICB2YXIga2EgPSBrZXlzKGEpLFxuICAgICAgICAgICAga2IgPSBrZXlzKGIpO1xuICAgICAgfSBjYXRjaCAoZSkgey8vaGFwcGVucyB3aGVuIG9uZSBpcyBhIHN0cmluZyBsaXRlcmFsIGFuZCB0aGUgb3RoZXIgaXNuJ3RcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAgICAgLy8gaGFzT3duUHJvcGVydHkpXG4gICAgICBpZiAoa2EubGVuZ3RoICE9IGtiLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAgICAgIGthLnNvcnQoKTtcbiAgICAgIGtiLnNvcnQoKTtcbiAgICAgIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgICAgIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChrYVtpXSAhPSBrYltpXSlcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gICAgICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgICAgIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGtleSA9IGthW2ldO1xuICAgICAgICBpZiAoIWRlZXBFcXVhbChhW2tleV0sIGJba2V5XSwgb3B0cykpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0eXBlb2YgYSA9PT0gdHlwZW9mIGI7XG4gICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGRhdGVmb3JtYXQgPSBjcmVhdGVDb21tb25qc01vZHVsZShmdW5jdGlvbiAobW9kdWxlLCBleHBvcnRzKSB7XG4gICAgLypcbiAgICAgKiBEYXRlIEZvcm1hdCAxLjIuM1xuICAgICAqIChjKSAyMDA3LTIwMDkgU3RldmVuIExldml0aGFuIDxzdGV2ZW5sZXZpdGhhbi5jb20+XG4gICAgICogTUlUIGxpY2Vuc2VcbiAgICAgKlxuICAgICAqIEluY2x1ZGVzIGVuaGFuY2VtZW50cyBieSBTY290dCBUcmVuZGEgPHNjb3R0LnRyZW5kYS5uZXQ+XG4gICAgICogYW5kIEtyaXMgS293YWwgPGNpeGFyLmNvbS9+a3Jpcy5rb3dhbC8+XG4gICAgICpcbiAgICAgKiBBY2NlcHRzIGEgZGF0ZSwgYSBtYXNrLCBvciBhIGRhdGUgYW5kIGEgbWFzay5cbiAgICAgKiBSZXR1cm5zIGEgZm9ybWF0dGVkIHZlcnNpb24gb2YgdGhlIGdpdmVuIGRhdGUuXG4gICAgICogVGhlIGRhdGUgZGVmYXVsdHMgdG8gdGhlIGN1cnJlbnQgZGF0ZS90aW1lLlxuICAgICAqIFRoZSBtYXNrIGRlZmF1bHRzIHRvIGRhdGVGb3JtYXQubWFza3MuZGVmYXVsdC5cbiAgICAgKi9cblxuICAgIChmdW5jdGlvbihnbG9iYWwpIHtcblxuICAgICAgdmFyIGRhdGVGb3JtYXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRva2VuID0gL2R7MSw0fXxtezEsNH18eXkoPzp5eSk/fChbSGhNc1R0XSlcXDE/fFtMbG9TWldOXXxcIlteXCJdKlwifCdbXiddKicvZztcbiAgICAgICAgICB2YXIgdGltZXpvbmUgPSAvXFxiKD86W1BNQ0VBXVtTRFBdVHwoPzpQYWNpZmljfE1vdW50YWlufENlbnRyYWx8RWFzdGVybnxBdGxhbnRpYykgKD86U3RhbmRhcmR8RGF5bGlnaHR8UHJldmFpbGluZykgVGltZXwoPzpHTVR8VVRDKSg/OlstK11cXGR7NH0pPylcXGIvZztcbiAgICAgICAgICB2YXIgdGltZXpvbmVDbGlwID0gL1teLStcXGRBLVpdL2c7XG4gICAgICBcbiAgICAgICAgICAvLyBSZWdleGVzIGFuZCBzdXBwb3J0aW5nIGZ1bmN0aW9ucyBhcmUgY2FjaGVkIHRocm91Z2ggY2xvc3VyZVxuICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0ZSwgbWFzaywgdXRjLCBnbXQpIHtcbiAgICAgIFxuICAgICAgICAgICAgLy8gWW91IGNhbid0IHByb3ZpZGUgdXRjIGlmIHlvdSBza2lwIG90aGVyIGFyZ3MgKHVzZSB0aGUgJ1VUQzonIG1hc2sgcHJlZml4KVxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYga2luZE9mKGRhdGUpID09PSAnc3RyaW5nJyAmJiAhL1xcZC8udGVzdChkYXRlKSkge1xuICAgICAgICAgICAgICBtYXNrID0gZGF0ZTtcbiAgICAgICAgICAgICAgZGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgIFxuICAgICAgICAgICAgZGF0ZSA9IGRhdGUgfHwgbmV3IERhdGU7XG4gICAgICBcbiAgICAgICAgICAgIGlmKCEoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgIFxuICAgICAgICAgICAgaWYgKGlzTmFOKGRhdGUpKSB7XG4gICAgICAgICAgICAgIHRocm93IFR5cGVFcnJvcignSW52YWxpZCBkYXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICBcbiAgICAgICAgICAgIG1hc2sgPSBTdHJpbmcoZGF0ZUZvcm1hdC5tYXNrc1ttYXNrXSB8fCBtYXNrIHx8IGRhdGVGb3JtYXQubWFza3NbJ2RlZmF1bHQnXSk7XG4gICAgICBcbiAgICAgICAgICAgIC8vIEFsbG93IHNldHRpbmcgdGhlIHV0Yy9nbXQgYXJndW1lbnQgdmlhIHRoZSBtYXNrXG4gICAgICAgICAgICB2YXIgbWFza1NsaWNlID0gbWFzay5zbGljZSgwLCA0KTtcbiAgICAgICAgICAgIGlmIChtYXNrU2xpY2UgPT09ICdVVEM6JyB8fCBtYXNrU2xpY2UgPT09ICdHTVQ6Jykge1xuICAgICAgICAgICAgICBtYXNrID0gbWFzay5zbGljZSg0KTtcbiAgICAgICAgICAgICAgdXRjID0gdHJ1ZTtcbiAgICAgICAgICAgICAgaWYgKG1hc2tTbGljZSA9PT0gJ0dNVDonKSB7XG4gICAgICAgICAgICAgICAgZ210ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgXG4gICAgICAgICAgICB2YXIgXyA9IHV0YyA/ICdnZXRVVEMnIDogJ2dldCc7XG4gICAgICAgICAgICB2YXIgZCA9IGRhdGVbXyArICdEYXRlJ10oKTtcbiAgICAgICAgICAgIHZhciBEID0gZGF0ZVtfICsgJ0RheSddKCk7XG4gICAgICAgICAgICB2YXIgbSA9IGRhdGVbXyArICdNb250aCddKCk7XG4gICAgICAgICAgICB2YXIgeSA9IGRhdGVbXyArICdGdWxsWWVhciddKCk7XG4gICAgICAgICAgICB2YXIgSCA9IGRhdGVbXyArICdIb3VycyddKCk7XG4gICAgICAgICAgICB2YXIgTSA9IGRhdGVbXyArICdNaW51dGVzJ10oKTtcbiAgICAgICAgICAgIHZhciBzID0gZGF0ZVtfICsgJ1NlY29uZHMnXSgpO1xuICAgICAgICAgICAgdmFyIEwgPSBkYXRlW18gKyAnTWlsbGlzZWNvbmRzJ10oKTtcbiAgICAgICAgICAgIHZhciBvID0gdXRjID8gMCA6IGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBXID0gZ2V0V2VlayhkYXRlKTtcbiAgICAgICAgICAgIHZhciBOID0gZ2V0RGF5T2ZXZWVrKGRhdGUpO1xuICAgICAgICAgICAgdmFyIGZsYWdzID0ge1xuICAgICAgICAgICAgICBkOiAgICBkLFxuICAgICAgICAgICAgICBkZDogICBwYWQoZCksXG4gICAgICAgICAgICAgIGRkZDogIGRhdGVGb3JtYXQuaTE4bi5kYXlOYW1lc1tEXSxcbiAgICAgICAgICAgICAgZGRkZDogZGF0ZUZvcm1hdC5pMThuLmRheU5hbWVzW0QgKyA3XSxcbiAgICAgICAgICAgICAgbTogICAgbSArIDEsXG4gICAgICAgICAgICAgIG1tOiAgIHBhZChtICsgMSksXG4gICAgICAgICAgICAgIG1tbTogIGRhdGVGb3JtYXQuaTE4bi5tb250aE5hbWVzW21dLFxuICAgICAgICAgICAgICBtbW1tOiBkYXRlRm9ybWF0LmkxOG4ubW9udGhOYW1lc1ttICsgMTJdLFxuICAgICAgICAgICAgICB5eTogICBTdHJpbmcoeSkuc2xpY2UoMiksXG4gICAgICAgICAgICAgIHl5eXk6IHksXG4gICAgICAgICAgICAgIGg6ICAgIEggJSAxMiB8fCAxMixcbiAgICAgICAgICAgICAgaGg6ICAgcGFkKEggJSAxMiB8fCAxMiksXG4gICAgICAgICAgICAgIEg6ICAgIEgsXG4gICAgICAgICAgICAgIEhIOiAgIHBhZChIKSxcbiAgICAgICAgICAgICAgTTogICAgTSxcbiAgICAgICAgICAgICAgTU06ICAgcGFkKE0pLFxuICAgICAgICAgICAgICBzOiAgICBzLFxuICAgICAgICAgICAgICBzczogICBwYWQocyksXG4gICAgICAgICAgICAgIGw6ICAgIHBhZChMLCAzKSxcbiAgICAgICAgICAgICAgTDogICAgcGFkKE1hdGgucm91bmQoTCAvIDEwKSksXG4gICAgICAgICAgICAgIHQ6ICAgIEggPCAxMiA/IGRhdGVGb3JtYXQuaTE4bi50aW1lTmFtZXNbMF0gOiBkYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzFdLFxuICAgICAgICAgICAgICB0dDogICBIIDwgMTIgPyBkYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzJdIDogZGF0ZUZvcm1hdC5pMThuLnRpbWVOYW1lc1szXSxcbiAgICAgICAgICAgICAgVDogICAgSCA8IDEyID8gZGF0ZUZvcm1hdC5pMThuLnRpbWVOYW1lc1s0XSA6IGRhdGVGb3JtYXQuaTE4bi50aW1lTmFtZXNbNV0sXG4gICAgICAgICAgICAgIFRUOiAgIEggPCAxMiA/IGRhdGVGb3JtYXQuaTE4bi50aW1lTmFtZXNbNl0gOiBkYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzddLFxuICAgICAgICAgICAgICBaOiAgICBnbXQgPyAnR01UJyA6IHV0YyA/ICdVVEMnIDogKFN0cmluZyhkYXRlKS5tYXRjaCh0aW1lem9uZSkgfHwgWycnXSkucG9wKCkucmVwbGFjZSh0aW1lem9uZUNsaXAsICcnKSxcbiAgICAgICAgICAgICAgbzogICAgKG8gPiAwID8gJy0nIDogJysnKSArIHBhZChNYXRoLmZsb29yKE1hdGguYWJzKG8pIC8gNjApICogMTAwICsgTWF0aC5hYnMobykgJSA2MCwgNCksXG4gICAgICAgICAgICAgIFM6ICAgIFsndGgnLCAnc3QnLCAnbmQnLCAncmQnXVtkICUgMTAgPiAzID8gMCA6IChkICUgMTAwIC0gZCAlIDEwICE9IDEwKSAqIGQgJSAxMF0sXG4gICAgICAgICAgICAgIFc6ICAgIFcsXG4gICAgICAgICAgICAgIE46ICAgIE5cbiAgICAgICAgICAgIH07XG4gICAgICBcbiAgICAgICAgICAgIHJldHVybiBtYXNrLnJlcGxhY2UodG9rZW4sIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgICAgICAgICBpZiAobWF0Y2ggaW4gZmxhZ3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmxhZ3NbbWF0Y2hdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBtYXRjaC5zbGljZSgxLCBtYXRjaC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKCk7XG5cbiAgICAgIGRhdGVGb3JtYXQubWFza3MgPSB7XG4gICAgICAgICdkZWZhdWx0JzogICAgICAgICAgICAgICAnZGRkIG1tbSBkZCB5eXl5IEhIOk1NOnNzJyxcbiAgICAgICAgJ3Nob3J0RGF0ZSc6ICAgICAgICAgICAgICdtL2QveXknLFxuICAgICAgICAnbWVkaXVtRGF0ZSc6ICAgICAgICAgICAgJ21tbSBkLCB5eXl5JyxcbiAgICAgICAgJ2xvbmdEYXRlJzogICAgICAgICAgICAgICdtbW1tIGQsIHl5eXknLFxuICAgICAgICAnZnVsbERhdGUnOiAgICAgICAgICAgICAgJ2RkZGQsIG1tbW0gZCwgeXl5eScsXG4gICAgICAgICdzaG9ydFRpbWUnOiAgICAgICAgICAgICAnaDpNTSBUVCcsXG4gICAgICAgICdtZWRpdW1UaW1lJzogICAgICAgICAgICAnaDpNTTpzcyBUVCcsXG4gICAgICAgICdsb25nVGltZSc6ICAgICAgICAgICAgICAnaDpNTTpzcyBUVCBaJyxcbiAgICAgICAgJ2lzb0RhdGUnOiAgICAgICAgICAgICAgICd5eXl5LW1tLWRkJyxcbiAgICAgICAgJ2lzb1RpbWUnOiAgICAgICAgICAgICAgICdISDpNTTpzcycsXG4gICAgICAgICdpc29EYXRlVGltZSc6ICAgICAgICAgICAneXl5eS1tbS1kZFxcJ1RcXCdISDpNTTpzc28nLFxuICAgICAgICAnaXNvVXRjRGF0ZVRpbWUnOiAgICAgICAgJ1VUQzp5eXl5LW1tLWRkXFwnVFxcJ0hIOk1NOnNzXFwnWlxcJycsXG4gICAgICAgICdleHBpcmVzSGVhZGVyRm9ybWF0JzogICAnZGRkLCBkZCBtbW0geXl5eSBISDpNTTpzcyBaJ1xuICAgICAgfTtcblxuICAgICAgLy8gSW50ZXJuYXRpb25hbGl6YXRpb24gc3RyaW5nc1xuICAgICAgZGF0ZUZvcm1hdC5pMThuID0ge1xuICAgICAgICBkYXlOYW1lczogW1xuICAgICAgICAgICdTdW4nLCAnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnLFxuICAgICAgICAgICdTdW5kYXknLCAnTW9uZGF5JywgJ1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheScsICdTYXR1cmRheSdcbiAgICAgICAgXSxcbiAgICAgICAgbW9udGhOYW1lczogW1xuICAgICAgICAgICdKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYycsXG4gICAgICAgICAgJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXG4gICAgICAgIF0sXG4gICAgICAgIHRpbWVOYW1lczogW1xuICAgICAgICAgICdhJywgJ3AnLCAnYW0nLCAncG0nLCAnQScsICdQJywgJ0FNJywgJ1BNJ1xuICAgICAgICBdXG4gICAgICB9O1xuXG4gICAgZnVuY3Rpb24gcGFkKHZhbCwgbGVuKSB7XG4gICAgICB2YWwgPSBTdHJpbmcodmFsKTtcbiAgICAgIGxlbiA9IGxlbiB8fCAyO1xuICAgICAgd2hpbGUgKHZhbC5sZW5ndGggPCBsZW4pIHtcbiAgICAgICAgdmFsID0gJzAnICsgdmFsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIElTTyA4NjAxIHdlZWsgbnVtYmVyXG4gICAgICogQmFzZWQgb24gY29tbWVudHMgZnJvbVxuICAgICAqIGh0dHA6Ly90ZWNoYmxvZy5wcm9jdXJpb3Mubmwvay9uNjE4L25ld3Mvdmlldy8zMzc5Ni8xNDg2My9DYWxjdWxhdGUtSVNPLTg2MDEtd2Vlay1hbmQteWVhci1pbi1qYXZhc2NyaXB0Lmh0bWxcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gYGRhdGVgXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFdlZWsoZGF0ZSkge1xuICAgICAgLy8gUmVtb3ZlIHRpbWUgY29tcG9uZW50cyBvZiBkYXRlXG4gICAgICB2YXIgdGFyZ2V0VGh1cnNkYXkgPSBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXREYXRlKCkpO1xuXG4gICAgICAvLyBDaGFuZ2UgZGF0ZSB0byBUaHVyc2RheSBzYW1lIHdlZWtcbiAgICAgIHRhcmdldFRodXJzZGF5LnNldERhdGUodGFyZ2V0VGh1cnNkYXkuZ2V0RGF0ZSgpIC0gKCh0YXJnZXRUaHVyc2RheS5nZXREYXkoKSArIDYpICUgNykgKyAzKTtcblxuICAgICAgLy8gVGFrZSBKYW51YXJ5IDR0aCBhcyBpdCBpcyBhbHdheXMgaW4gd2VlayAxIChzZWUgSVNPIDg2MDEpXG4gICAgICB2YXIgZmlyc3RUaHVyc2RheSA9IG5ldyBEYXRlKHRhcmdldFRodXJzZGF5LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuXG4gICAgICAvLyBDaGFuZ2UgZGF0ZSB0byBUaHVyc2RheSBzYW1lIHdlZWtcbiAgICAgIGZpcnN0VGh1cnNkYXkuc2V0RGF0ZShmaXJzdFRodXJzZGF5LmdldERhdGUoKSAtICgoZmlyc3RUaHVyc2RheS5nZXREYXkoKSArIDYpICUgNykgKyAzKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgZGF5bGlnaHQtc2F2aW5nLXRpbWUtc3dpdGNoIG9jY3VycmVkIGFuZCBjb3JyZWN0IGZvciBpdFxuICAgICAgdmFyIGRzID0gdGFyZ2V0VGh1cnNkYXkuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIGZpcnN0VGh1cnNkYXkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICAgIHRhcmdldFRodXJzZGF5LnNldEhvdXJzKHRhcmdldFRodXJzZGF5LmdldEhvdXJzKCkgLSBkcyk7XG5cbiAgICAgIC8vIE51bWJlciBvZiB3ZWVrcyBiZXR3ZWVuIHRhcmdldCBUaHVyc2RheSBhbmQgZmlyc3QgVGh1cnNkYXlcbiAgICAgIHZhciB3ZWVrRGlmZiA9ICh0YXJnZXRUaHVyc2RheSAtIGZpcnN0VGh1cnNkYXkpIC8gKDg2NDAwMDAwKjcpO1xuICAgICAgcmV0dXJuIDEgKyBNYXRoLmZsb29yKHdlZWtEaWZmKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgSVNPLTg2MDEgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiB0aGUgZGF5IG9mIHRoZSB3ZWVrXG4gICAgICogMSAoZm9yIE1vbmRheSkgdGhyb3VnaCA3IChmb3IgU3VuZGF5KVxuICAgICAqIFxuICAgICAqIEBwYXJhbSAge09iamVjdH0gYGRhdGVgXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldERheU9mV2VlayhkYXRlKSB7XG4gICAgICB2YXIgZG93ID0gZGF0ZS5nZXREYXkoKTtcbiAgICAgIGlmKGRvdyA9PT0gMCkge1xuICAgICAgICBkb3cgPSA3O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRvdztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBraW5kLW9mIHNob3J0Y3V0XG4gICAgICogQHBhcmFtICB7Kn0gdmFsXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGtpbmRPZih2YWwpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICdudWxsJztcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiAndW5kZWZpbmVkJztcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsO1xuICAgICAgfVxuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIHJldHVybiAnYXJyYXknO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWwpXG4gICAgICAgIC5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cblxuICAgICAgaWYgKHR5cGVvZiB1bmRlZmluZWQgPT09ICdmdW5jdGlvbicgJiYgdW5kZWZpbmVkLmFtZCkge1xuICAgICAgICB1bmRlZmluZWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBkYXRlRm9ybWF0O1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGF0ZUZvcm1hdDtcbiAgICAgIH1cbiAgICB9KShjb21tb25qc0dsb2JhbCk7XG4gICAgfSk7XG5cbiAgICAvKiFcbiAgICAgKiByZXBlYXQtc3RyaW5nIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9yZXBlYXQtc3RyaW5nPlxuICAgICAqXG4gICAgICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEpvbiBTY2hsaW5rZXJ0LlxuICAgICAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIFJlc3VsdHMgY2FjaGVcbiAgICAgKi9cblxuICAgIHZhciByZXMgPSAnJztcbiAgICB2YXIgY2FjaGU7XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgYHJlcGVhdGBcbiAgICAgKi9cblxuICAgIHZhciByZXBlYXRTdHJpbmcgPSByZXBlYXQ7XG5cbiAgICAvKipcbiAgICAgKiBSZXBlYXQgdGhlIGdpdmVuIGBzdHJpbmdgIHRoZSBzcGVjaWZpZWQgYG51bWJlcmBcbiAgICAgKiBvZiB0aW1lcy5cbiAgICAgKlxuICAgICAqICoqRXhhbXBsZToqKlxuICAgICAqXG4gICAgICogYGBganNcbiAgICAgKiB2YXIgcmVwZWF0ID0gcmVxdWlyZSgncmVwZWF0LXN0cmluZycpO1xuICAgICAqIHJlcGVhdCgnQScsIDUpO1xuICAgICAqIC8vPT4gQUFBQUFcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyaW5nYCBUaGUgc3RyaW5nIHRvIHJlcGVhdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBgbnVtYmVyYCBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIHJlcGVhdCB0aGUgc3RyaW5nXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBSZXBlYXRlZCBzdHJpbmdcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gcmVwZWF0KHN0ciwgbnVtKSB7XG4gICAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgYSBzdHJpbmcnKTtcbiAgICAgIH1cblxuICAgICAgLy8gY292ZXIgY29tbW9uLCBxdWljayB1c2UgY2FzZXNcbiAgICAgIGlmIChudW0gPT09IDEpIHJldHVybiBzdHI7XG4gICAgICBpZiAobnVtID09PSAyKSByZXR1cm4gc3RyICsgc3RyO1xuXG4gICAgICB2YXIgbWF4ID0gc3RyLmxlbmd0aCAqIG51bTtcbiAgICAgIGlmIChjYWNoZSAhPT0gc3RyIHx8IHR5cGVvZiBjYWNoZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY2FjaGUgPSBzdHI7XG4gICAgICAgIHJlcyA9ICcnO1xuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID49IG1heCkge1xuICAgICAgICByZXR1cm4gcmVzLnN1YnN0cigwLCBtYXgpO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAobWF4ID4gcmVzLmxlbmd0aCAmJiBudW0gPiAxKSB7XG4gICAgICAgIGlmIChudW0gJiAxKSB7XG4gICAgICAgICAgcmVzICs9IHN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIG51bSA+Pj0gMTtcbiAgICAgICAgc3RyICs9IHN0cjtcbiAgICAgIH1cblxuICAgICAgcmVzICs9IHN0cjtcbiAgICAgIHJlcyA9IHJlcy5zdWJzdHIoMCwgbWF4KTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgdmFyIHBhZExlZnQgPSBmdW5jdGlvbiBwYWRMZWZ0KHN0ciwgbnVtLCBjaCkge1xuICAgICAgc3RyID0gc3RyLnRvU3RyaW5nKCk7XG5cbiAgICAgIGlmICh0eXBlb2YgbnVtID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2ggPT09IDApIHtcbiAgICAgICAgY2ggPSAnMCc7XG4gICAgICB9IGVsc2UgaWYgKGNoKSB7XG4gICAgICAgIGNoID0gY2gudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoID0gJyAnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVwZWF0U3RyaW5nKGNoLCBudW0gLSBzdHIubGVuZ3RoKSArIHN0cjtcbiAgICB9O1xuXG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB2YXIgbGluaztcbiAgICB2YXIgc3VwcG9ydGVkRW5jb2RpbmdzID0gWydpbWFnZS9wbmcnLCdpbWFnZS9qcGVnJywnaW1hZ2Uvd2VicCddO1xuICAgIGZ1bmN0aW9uIGV4cG9ydENhbnZhcyhjYW52YXMsIG9wdCkge1xuICAgICAgICBpZiAoIG9wdCA9PT0gdm9pZCAwICkgb3B0ID0ge307XG5cbiAgICAgICAgdmFyIGVuY29kaW5nID0gb3B0LmVuY29kaW5nIHx8ICdpbWFnZS9wbmcnO1xuICAgICAgICBpZiAoIXN1cHBvcnRlZEVuY29kaW5ncy5pbmNsdWRlcyhlbmNvZGluZykpIFxuICAgICAgICAgICAgeyB0aHJvdyBuZXcgRXJyb3IoKFwiSW52YWxpZCBjYW52YXMgZW5jb2RpbmcgXCIgKyBlbmNvZGluZykpOyB9XG4gICAgICAgIHZhciBleHRlbnNpb24gPSAoZW5jb2Rpbmcuc3BsaXQoJy8nKVsxXSB8fCAnJykucmVwbGFjZSgvanBlZy9pLCAnanBnJyk7XG4gICAgICAgIGlmIChleHRlbnNpb24pIFxuICAgICAgICAgICAgeyBleHRlbnNpb24gPSAoXCIuXCIgKyBleHRlbnNpb24pLnRvTG93ZXJDYXNlKCk7IH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGV4dGVuc2lvbjogZXh0ZW5zaW9uLFxuICAgICAgICAgICAgdHlwZTogZW5jb2RpbmcsXG4gICAgICAgICAgICBkYXRhVVJMOiBjYW52YXMudG9EYXRhVVJMKGVuY29kaW5nLCBvcHQuZW5jb2RpbmdRdWFsaXR5KVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJsb2JGcm9tRGF0YVVSTChkYXRhVVJMKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgdmFyIHNwbGl0SW5kZXggPSBkYXRhVVJMLmluZGV4T2YoJywnKTtcbiAgICAgICAgICAgIGlmIChzcGxpdEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IHdpbmRvdy5CbG9iKCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiYXNlNjQgPSBkYXRhVVJMLnNsaWNlKHNwbGl0SW5kZXggKyAxKTtcbiAgICAgICAgICAgIHZhciBieXRlU3RyaW5nID0gd2luZG93LmF0b2IoYmFzZTY0KTtcbiAgICAgICAgICAgIHZhciBtaW1lTWF0Y2ggPSAvZGF0YTooW147K10pOy8uZXhlYyhkYXRhVVJMKTtcbiAgICAgICAgICAgIHZhciBtaW1lID0gKG1pbWVNYXRjaCA/IG1pbWVNYXRjaFsxXSA6ICcnKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgICB2YXIgYWIgPSBuZXcgQXJyYXlCdWZmZXIoYnl0ZVN0cmluZy5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIGlhID0gbmV3IFVpbnQ4QXJyYXkoYWIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IGJ5dGVTdHJpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpYVtpXSA9IGJ5dGVTdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUobmV3IHdpbmRvdy5CbG9iKFthYl0sIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBtaW1lXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhdmVEYXRhVVJMKGRhdGFVUkwsIG9wdHMpIHtcbiAgICAgICAgaWYgKCBvcHRzID09PSB2b2lkIDAgKSBvcHRzID0ge307XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJsb2JGcm9tRGF0YVVSTChkYXRhVVJMKS50aGVuKGZ1bmN0aW9uIChibG9iKSB7IHJldHVybiBzYXZlQmxvYihibG9iLCBvcHRzKTsgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZUJsb2IoYmxvYiwgb3B0cykge1xuICAgICAgICBpZiAoIG9wdHMgPT09IHZvaWQgMCApIG9wdHMgPSB7fTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgIG9wdHMgPSBvYmplY3RBc3NpZ24oe1xuICAgICAgICAgICAgICAgIGV4dGVuc2lvbjogJycsXG4gICAgICAgICAgICAgICAgcHJlZml4OiAnJyxcbiAgICAgICAgICAgICAgICBzdWZmaXg6ICcnXG4gICAgICAgICAgICB9LCBvcHRzKTtcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IHJlc29sdmVGaWxlbmFtZShvcHRzKTtcbiAgICAgICAgICAgIHZhciBjbGllbnQgPSBnZXRDbGllbnRBUEkoKTtcbiAgICAgICAgICAgIGlmIChjbGllbnQgJiYgdHlwZW9mIGNsaWVudC5zYXZlQmxvYiA9PT0gJ2Z1bmN0aW9uJyAmJiBjbGllbnQub3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsaWVudC5zYXZlQmxvYihibG9iLCBvYmplY3RBc3NpZ24oe30sIG9wdHMsIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGVuYW1lXG4gICAgICAgICAgICAgICAgfSkpLnRoZW4oZnVuY3Rpb24gKGV2KSB7IHJldHVybiByZXNvbHZlKGV2KTsgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghbGluaykge1xuICAgICAgICAgICAgICAgICAgICBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAgICAgICBsaW5rLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgICAgICAgICAgbGluay50YXJnZXQgPSAnX2JsYW5rJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGluay5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgICAgICAgICAgbGluay5vbmNsaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluay5vbmNsaWNrID0gbm9vcDtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTChibG9iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnJlbW92ZUF0dHJpYnV0ZSgnaHJlZicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGVuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhdmVGaWxlKGRhdGEsIG9wdHMpIHtcbiAgICAgICAgaWYgKCBvcHRzID09PSB2b2lkIDAgKSBvcHRzID0ge307XG5cbiAgICAgICAgdmFyIHBhcnRzID0gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbZGF0YV07XG4gICAgICAgIHZhciBibG9iID0gbmV3IHdpbmRvdy5CbG9iKHBhcnRzLCB7XG4gICAgICAgICAgICB0eXBlOiBvcHRzLnR5cGUgfHwgJydcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzYXZlQmxvYihibG9iLCBvcHRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRGaWxlTmFtZSgpIHtcbiAgICAgICAgdmFyIGRhdGVGb3JtYXRTdHIgPSBcInl5eXkubW0uZGQtSEguTU0uc3NcIjtcbiAgICAgICAgcmV0dXJuIGRhdGVmb3JtYXQobmV3IERhdGUoKSwgZGF0ZUZvcm1hdFN0cik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZUZpbGVuYW1lKG9wdCkge1xuICAgICAgICBpZiAoIG9wdCA9PT0gdm9pZCAwICkgb3B0ID0ge307XG5cbiAgICAgICAgb3B0ID0gb2JqZWN0QXNzaWduKHt9LCBvcHQpO1xuICAgICAgICBpZiAodHlwZW9mIG9wdC5maWxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0LmZpbGUob3B0KTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHQuZmlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdC5maWxlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmcmFtZSA9IG51bGw7XG4gICAgICAgIHZhciBleHRlbnNpb24gPSAnJztcbiAgICAgICAgaWYgKHR5cGVvZiBvcHQuZXh0ZW5zaW9uID09PSAnc3RyaW5nJykgXG4gICAgICAgICAgICB7IGV4dGVuc2lvbiA9IG9wdC5leHRlbnNpb247IH1cbiAgICAgICAgaWYgKHR5cGVvZiBvcHQuZnJhbWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgdG90YWxGcmFtZXM7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdC50b3RhbEZyYW1lcyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0b3RhbEZyYW1lcyA9IG9wdC50b3RhbEZyYW1lcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdG90YWxGcmFtZXMgPSBNYXRoLm1heCgxMDAwLCBvcHQuZnJhbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnJhbWUgPSBwYWRMZWZ0KFN0cmluZyhvcHQuZnJhbWUpLCBTdHJpbmcodG90YWxGcmFtZXMpLmxlbmd0aCwgJzAnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGF5ZXJTdHIgPSBpc0Zpbml0ZShvcHQudG90YWxMYXllcnMpICYmIGlzRmluaXRlKG9wdC5sYXllcikgJiYgb3B0LnRvdGFsTGF5ZXJzID4gMSA/IChcIlwiICsgKG9wdC5sYXllcikpIDogJyc7XG4gICAgICAgIGlmIChmcmFtZSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gW2xheWVyU3RyLGZyYW1lXS5maWx0ZXIoQm9vbGVhbikuam9pbignLScpICsgZXh0ZW5zaW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGRlZmF1bHRGaWxlTmFtZSA9IG9wdC50aW1lU3RhbXA7XG4gICAgICAgICAgICByZXR1cm4gW29wdC5wcmVmaXgsb3B0Lm5hbWUgfHwgZGVmYXVsdEZpbGVOYW1lLGxheWVyU3RyLG9wdC5oYXNoLG9wdC5zdWZmaXhdLmZpbHRlcihCb29sZWFuKS5qb2luKCctJykgKyBleHRlbnNpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBrZXlib2FyZFNob3J0Y3V0cyAob3B0KSB7XG4gICAgICAgIGlmICggb3B0ID09PSB2b2lkIDAgKSBvcHQgPSB7fTtcblxuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgaWYgKCFvcHQuZW5hYmxlZCgpKSBcbiAgICAgICAgICAgICAgICB7IHJldHVybjsgfVxuICAgICAgICAgICAgdmFyIGNsaWVudCA9IGdldENsaWVudEFQSSgpO1xuICAgICAgICAgICAgaWYgKGV2LmtleUNvZGUgPT09IDgzICYmICFldi5hbHRLZXkgJiYgKGV2Lm1ldGFLZXkgfHwgZXYuY3RybEtleSkpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIG9wdC5zYXZlKGV2KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgICAgICAgICAgICBvcHQudG9nZ2xlUGxheShldik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNsaWVudCAmJiAhZXYuYWx0S2V5ICYmIGV2LmtleUNvZGUgPT09IDc1ICYmIChldi5tZXRhS2V5IHx8IGV2LmN0cmxLZXkpKSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBvcHQuY29tbWl0KGV2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBkZXRhY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXR0YWNoOiBhdHRhY2gsXG4gICAgICAgICAgICBkZXRhY2g6IGRldGFjaFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0VW5pdHMgPSAnbW0nO1xuICAgIHZhciBkYXRhID0gW1sncG9zdGNhcmQnLDEwMS42LDE1Mi40XSxbJ3Bvc3Rlci1zbWFsbCcsMjgwLDQzMF0sWydwb3N0ZXInLDQ2MCw2MTBdLFxuICAgICAgICBbJ3Bvc3Rlci1sYXJnZScsNjEwLDkxMF0sWydidXNpbmVzcy1jYXJkJyw1MC44LDg4LjldLFsnYTAnLDg0MSwxMTg5XSxbJ2ExJyw1OTQsXG4gICAgICAgIDg0MV0sWydhMicsNDIwLDU5NF0sWydhMycsMjk3LDQyMF0sWydhNCcsMjEwLDI5N10sWydhNScsMTQ4LDIxMF0sWydhNicsMTA1LDE0OF0sXG4gICAgICAgIFsnYTcnLDc0LDEwNV0sWydhOCcsNTIsNzRdLFsnYTknLDM3LDUyXSxbJ2ExMCcsMjYsMzddLFsnMmEwJywxMTg5LDE2ODJdLFsnNGEwJyxcbiAgICAgICAgMTY4MiwyMzc4XSxbJ2IwJywxMDAwLDE0MTRdLFsnYjEnLDcwNywxMDAwXSxbJ2IxKycsNzIwLDEwMjBdLFsnYjInLDUwMCw3MDddLFsnYjIrJyxcbiAgICAgICAgNTIwLDcyMF0sWydiMycsMzUzLDUwMF0sWydiNCcsMjUwLDM1M10sWydiNScsMTc2LDI1MF0sWydiNicsMTI1LDE3Nl0sWydiNycsODgsXG4gICAgICAgIDEyNV0sWydiOCcsNjIsODhdLFsnYjknLDQ0LDYyXSxbJ2IxMCcsMzEsNDRdLFsnYjExJywyMiwzMl0sWydiMTInLDE2LDIyXSxbJ2MwJyxcbiAgICAgICAgOTE3LDEyOTddLFsnYzEnLDY0OCw5MTddLFsnYzInLDQ1OCw2NDhdLFsnYzMnLDMyNCw0NThdLFsnYzQnLDIyOSwzMjRdLFsnYzUnLDE2MixcbiAgICAgICAgMjI5XSxbJ2M2JywxMTQsMTYyXSxbJ2M3Jyw4MSwxMTRdLFsnYzgnLDU3LDgxXSxbJ2M5Jyw0MCw1N10sWydjMTAnLDI4LDQwXSxbJ2MxMScsXG4gICAgICAgIDIyLDMyXSxbJ2MxMicsMTYsMjJdLFsnaGFsZi1sZXR0ZXInLDUuNSw4LjUsJ2luJ10sWydsZXR0ZXInLDguNSwxMSwnaW4nXSxbJ2xlZ2FsJyxcbiAgICAgICAgOC41LDE0LCdpbiddLFsnanVuaW9yLWxlZ2FsJyw1LDgsJ2luJ10sWydsZWRnZXInLDExLDE3LCdpbiddLFsndGFibG9pZCcsMTEsMTcsXG4gICAgICAgICdpbiddLFsnYW5zaS1hJyw4LjUsMTEuMCwnaW4nXSxbJ2Fuc2ktYicsMTEuMCwxNy4wLCdpbiddLFsnYW5zaS1jJywxNy4wLDIyLjAsXG4gICAgICAgICdpbiddLFsnYW5zaS1kJywyMi4wLDM0LjAsJ2luJ10sWydhbnNpLWUnLDM0LjAsNDQuMCwnaW4nXSxbJ2FyY2gtYScsOSwxMiwnaW4nXSxcbiAgICAgICAgWydhcmNoLWInLDEyLDE4LCdpbiddLFsnYXJjaC1jJywxOCwyNCwnaW4nXSxbJ2FyY2gtZCcsMjQsMzYsJ2luJ10sWydhcmNoLWUnLDM2LFxuICAgICAgICA0OCwnaW4nXSxbJ2FyY2gtZTEnLDMwLDQyLCdpbiddLFsnYXJjaC1lMicsMjYsMzgsJ2luJ10sWydhcmNoLWUzJywyNywzOSwnaW4nXV07XG4gICAgdmFyIHBhcGVyU2l6ZXMgPSBkYXRhLnJlZHVjZShmdW5jdGlvbiAoZGljdCwgcHJlc2V0KSB7XG4gICAgICAgIHZhciBpdGVtID0ge1xuICAgICAgICAgICAgdW5pdHM6IHByZXNldFszXSB8fCBkZWZhdWx0VW5pdHMsXG4gICAgICAgICAgICBkaW1lbnNpb25zOiBbcHJlc2V0WzFdLHByZXNldFsyXV1cbiAgICAgICAgfTtcbiAgICAgICAgZGljdFtwcmVzZXRbMF1dID0gaXRlbTtcbiAgICAgICAgZGljdFtwcmVzZXRbMF0ucmVwbGFjZSgvLS9nLCAnICcpXSA9IGl0ZW07XG4gICAgICAgIHJldHVybiBkaWN0O1xuICAgIH0sIHt9KVxuXG4gICAgZnVuY3Rpb24gZ2V0RGltZW5zaW9uc0Zyb21QcmVzZXQoZGltZW5zaW9ucywgdW5pdHNUbywgcGl4ZWxzUGVySW5jaCkge1xuICAgICAgICBpZiAoIHVuaXRzVG8gPT09IHZvaWQgMCApIHVuaXRzVG8gPSAncHgnO1xuICAgICAgICBpZiAoIHBpeGVsc1BlckluY2ggPT09IHZvaWQgMCApIHBpeGVsc1BlckluY2ggPSA3MjtcblxuICAgICAgICBpZiAodHlwZW9mIGRpbWVuc2lvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gZGltZW5zaW9ucy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKCEoa2V5IGluIHBhcGVyU2l6ZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKChcIlRoZSBkaW1lbnNpb24gcHJlc2V0IFxcXCJcIiArIGRpbWVuc2lvbnMgKyBcIlxcXCIgaXMgbm90IHN1cHBvcnRlZCBvciBjb3VsZCBub3QgYmUgZm91bmQ7IHRyeSB1c2luZyBhNCwgYTMsIHBvc3RjYXJkLCBsZXR0ZXIsIGV0Yy5cIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHByZXNldCA9IHBhcGVyU2l6ZXNba2V5XTtcbiAgICAgICAgICAgIHJldHVybiBwcmVzZXQuZGltZW5zaW9ucy5tYXAoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGNvbnZlcnREaXN0YW5jZShkLCBwcmVzZXQudW5pdHMsIHVuaXRzVG8sIHBpeGVsc1BlckluY2gpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkaW1lbnNpb25zO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29udmVydERpc3RhbmNlKGRpbWVuc2lvbiwgdW5pdHNGcm9tLCB1bml0c1RvLCBwaXhlbHNQZXJJbmNoKSB7XG4gICAgICAgIGlmICggdW5pdHNGcm9tID09PSB2b2lkIDAgKSB1bml0c0Zyb20gPSAncHgnO1xuICAgICAgICBpZiAoIHVuaXRzVG8gPT09IHZvaWQgMCApIHVuaXRzVG8gPSAncHgnO1xuICAgICAgICBpZiAoIHBpeGVsc1BlckluY2ggPT09IHZvaWQgMCApIHBpeGVsc1BlckluY2ggPSA3MjtcblxuICAgICAgICByZXR1cm4gY29udmVydExlbmd0aChkaW1lbnNpb24sIHVuaXRzRnJvbSwgdW5pdHNUbywge1xuICAgICAgICAgICAgcGl4ZWxzUGVySW5jaDogcGl4ZWxzUGVySW5jaCxcbiAgICAgICAgICAgIHByZWNpc2lvbjogNCxcbiAgICAgICAgICAgIHJvdW5kUGl4ZWw6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJZkhhc0RpbWVuc2lvbnMoc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKCFzZXR0aW5ncy5kaW1lbnNpb25zKSBcbiAgICAgICAgICAgIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MuZGltZW5zaW9ucyA9PT0gJ3N0cmluZycpIFxuICAgICAgICAgICAgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzZXR0aW5ncy5kaW1lbnNpb25zKSAmJiBzZXR0aW5ncy5kaW1lbnNpb25zLmxlbmd0aCA+PSAyKSBcbiAgICAgICAgICAgIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcmVudFNpemUocHJvcHMsIHNldHRpbmdzKSB7XG4gICAgICAgIGlmICghaXNCcm93c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gWzMwMCwxNTBdO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbGVtZW50ID0gc2V0dGluZ3MucGFyZW50IHx8IHdpbmRvdztcbiAgICAgICAgaWYgKGVsZW1lbnQgPT09IHdpbmRvdyB8fCBlbGVtZW50ID09PSBkb2N1bWVudCB8fCBlbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICByZXR1cm4gW3dpbmRvdy5pbm5lcldpZHRoLHdpbmRvdy5pbm5lckhlaWdodF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVmID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHJlZi53aWR0aDtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSByZWYuaGVpZ2h0O1xuICAgICAgICAgICAgcmV0dXJuIFt3aWR0aCxoZWlnaHRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzaXplQ2FudmFzKHByb3BzLCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgd2lkdGgsIGhlaWdodDtcbiAgICAgICAgdmFyIHN0eWxlV2lkdGgsIHN0eWxlSGVpZ2h0O1xuICAgICAgICB2YXIgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodDtcbiAgICAgICAgdmFyIGRpbWVuc2lvbnMgPSBzZXR0aW5ncy5kaW1lbnNpb25zO1xuICAgICAgICB2YXIgaGFzRGltZW5zaW9ucyA9IGNoZWNrSWZIYXNEaW1lbnNpb25zKHNldHRpbmdzKTtcbiAgICAgICAgdmFyIGV4cG9ydGluZyA9IHByb3BzLmV4cG9ydGluZztcbiAgICAgICAgdmFyIHNjYWxlVG9GaXQgPSBoYXNEaW1lbnNpb25zID8gc2V0dGluZ3Muc2NhbGVUb0ZpdCAhPT0gZmFsc2UgOiBmYWxzZTtcbiAgICAgICAgdmFyIHNjYWxlVG9WaWV3ID0gIWV4cG9ydGluZyAmJiBoYXNEaW1lbnNpb25zID8gc2V0dGluZ3Muc2NhbGVUb1ZpZXcgOiB0cnVlO1xuICAgICAgICB2YXIgdW5pdHMgPSBzZXR0aW5ncy51bml0cztcbiAgICAgICAgdmFyIHBpeGVsc1BlckluY2ggPSB0eXBlb2Ygc2V0dGluZ3MucGl4ZWxzUGVySW5jaCA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoc2V0dGluZ3MucGl4ZWxzUGVySW5jaCkgPyBzZXR0aW5ncy5waXhlbHNQZXJJbmNoIDogNzI7XG4gICAgICAgIHZhciBibGVlZCA9IGRlZmluZWQoc2V0dGluZ3MuYmxlZWQsIDApO1xuICAgICAgICB2YXIgZGV2aWNlUGl4ZWxSYXRpbyA9IGlzQnJvd3NlcigpID8gd2luZG93LmRldmljZVBpeGVsUmF0aW8gOiAxO1xuICAgICAgICB2YXIgYmFzZVBpeGVsUmF0aW8gPSBzY2FsZVRvVmlldyA/IGRldmljZVBpeGVsUmF0aW8gOiAxO1xuICAgICAgICB2YXIgcGl4ZWxSYXRpbywgZXhwb3J0UGl4ZWxSYXRpbztcbiAgICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5waXhlbFJhdGlvID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShzZXR0aW5ncy5waXhlbFJhdGlvKSkge1xuICAgICAgICAgICAgcGl4ZWxSYXRpbyA9IHNldHRpbmdzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICBleHBvcnRQaXhlbFJhdGlvID0gZGVmaW5lZChzZXR0aW5ncy5leHBvcnRQaXhlbFJhdGlvLCBwaXhlbFJhdGlvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChoYXNEaW1lbnNpb25zKSB7XG4gICAgICAgICAgICAgICAgcGl4ZWxSYXRpbyA9IGJhc2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgIGV4cG9ydFBpeGVsUmF0aW8gPSBkZWZpbmVkKHNldHRpbmdzLmV4cG9ydFBpeGVsUmF0aW8sIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwaXhlbFJhdGlvID0gZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBleHBvcnRQaXhlbFJhdGlvID0gZGVmaW5lZChzZXR0aW5ncy5leHBvcnRQaXhlbFJhdGlvLCBwaXhlbFJhdGlvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHNldHRpbmdzLm1heFBpeGVsUmF0aW8gPT09ICdudW1iZXInICYmIGlzRmluaXRlKHNldHRpbmdzLm1heFBpeGVsUmF0aW8pKSB7XG4gICAgICAgICAgICBwaXhlbFJhdGlvID0gTWF0aC5taW4oc2V0dGluZ3MubWF4UGl4ZWxSYXRpbywgcGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICBleHBvcnRQaXhlbFJhdGlvID0gTWF0aC5taW4oc2V0dGluZ3MubWF4UGl4ZWxSYXRpbywgZXhwb3J0UGl4ZWxSYXRpbyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cG9ydGluZykge1xuICAgICAgICAgICAgcGl4ZWxSYXRpbyA9IGV4cG9ydFBpeGVsUmF0aW87XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlZiA9IGdldFBhcmVudFNpemUocHJvcHMsIHNldHRpbmdzKTtcbiAgICAgICAgdmFyIHBhcmVudFdpZHRoID0gcmVmWzBdO1xuICAgICAgICB2YXIgcGFyZW50SGVpZ2h0ID0gcmVmWzFdO1xuICAgICAgICB2YXIgdHJpbVdpZHRoLCB0cmltSGVpZ2h0O1xuICAgICAgICBpZiAoaGFzRGltZW5zaW9ucykge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldERpbWVuc2lvbnNGcm9tUHJlc2V0KGRpbWVuc2lvbnMsIHVuaXRzLCBwaXhlbHNQZXJJbmNoKTtcbiAgICAgICAgICAgIHZhciBoaWdoZXN0ID0gTWF0aC5tYXgocmVzdWx0WzBdLCByZXN1bHRbMV0pO1xuICAgICAgICAgICAgdmFyIGxvd2VzdCA9IE1hdGgubWluKHJlc3VsdFswXSwgcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5vcmllbnRhdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBsYW5kc2NhcGUgPSBzZXR0aW5ncy5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZSc7XG4gICAgICAgICAgICAgICAgd2lkdGggPSBsYW5kc2NhcGUgPyBoaWdoZXN0IDogbG93ZXN0O1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IGxhbmRzY2FwZSA/IGxvd2VzdCA6IGhpZ2hlc3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdpZHRoID0gcmVzdWx0WzBdO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IHJlc3VsdFsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyaW1XaWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgdHJpbUhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgIHdpZHRoICs9IGJsZWVkICogMjtcbiAgICAgICAgICAgIGhlaWdodCArPSBibGVlZCAqIDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCA9IHBhcmVudFdpZHRoO1xuICAgICAgICAgICAgaGVpZ2h0ID0gcGFyZW50SGVpZ2h0O1xuICAgICAgICAgICAgdHJpbVdpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICB0cmltSGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHZhciByZWFsV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdmFyIHJlYWxIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGlmIChoYXNEaW1lbnNpb25zICYmIHVuaXRzKSB7XG4gICAgICAgICAgICByZWFsV2lkdGggPSBjb252ZXJ0RGlzdGFuY2Uod2lkdGgsIHVuaXRzLCAncHgnLCBwaXhlbHNQZXJJbmNoKTtcbiAgICAgICAgICAgIHJlYWxIZWlnaHQgPSBjb252ZXJ0RGlzdGFuY2UoaGVpZ2h0LCB1bml0cywgJ3B4JywgcGl4ZWxzUGVySW5jaCk7XG4gICAgICAgIH1cbiAgICAgICAgc3R5bGVXaWR0aCA9IE1hdGgucm91bmQocmVhbFdpZHRoKTtcbiAgICAgICAgc3R5bGVIZWlnaHQgPSBNYXRoLnJvdW5kKHJlYWxIZWlnaHQpO1xuICAgICAgICBpZiAoc2NhbGVUb0ZpdCAmJiAhZXhwb3J0aW5nICYmIGhhc0RpbWVuc2lvbnMpIHtcbiAgICAgICAgICAgIHZhciBhc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcbiAgICAgICAgICAgIHZhciB3aW5kb3dBc3BlY3QgPSBwYXJlbnRXaWR0aCAvIHBhcmVudEhlaWdodDtcbiAgICAgICAgICAgIHZhciBzY2FsZVRvRml0UGFkZGluZyA9IGRlZmluZWQoc2V0dGluZ3Muc2NhbGVUb0ZpdFBhZGRpbmcsIDQwKTtcbiAgICAgICAgICAgIHZhciBtYXhXaWR0aCA9IE1hdGgucm91bmQocGFyZW50V2lkdGggLSBzY2FsZVRvRml0UGFkZGluZyAqIDIpO1xuICAgICAgICAgICAgdmFyIG1heEhlaWdodCA9IE1hdGgucm91bmQocGFyZW50SGVpZ2h0IC0gc2NhbGVUb0ZpdFBhZGRpbmcgKiAyKTtcbiAgICAgICAgICAgIGlmIChzdHlsZVdpZHRoID4gbWF4V2lkdGggfHwgc3R5bGVIZWlnaHQgPiBtYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93QXNwZWN0ID4gYXNwZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlSGVpZ2h0ID0gbWF4SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBzdHlsZVdpZHRoID0gTWF0aC5yb3VuZChzdHlsZUhlaWdodCAqIGFzcGVjdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVXaWR0aCA9IG1heFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICBzdHlsZUhlaWdodCA9IE1hdGgucm91bmQoc3R5bGVXaWR0aCAvIGFzcGVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhbnZhc1dpZHRoID0gc2NhbGVUb1ZpZXcgPyBNYXRoLnJvdW5kKHBpeGVsUmF0aW8gKiBzdHlsZVdpZHRoKSA6IE1hdGgucm91bmQoZXhwb3J0UGl4ZWxSYXRpbyAqIHJlYWxXaWR0aCk7XG4gICAgICAgIGNhbnZhc0hlaWdodCA9IHNjYWxlVG9WaWV3ID8gTWF0aC5yb3VuZChwaXhlbFJhdGlvICogc3R5bGVIZWlnaHQpIDogTWF0aC5yb3VuZChleHBvcnRQaXhlbFJhdGlvICogcmVhbEhlaWdodCk7XG4gICAgICAgIHZhciB2aWV3cG9ydFdpZHRoID0gc2NhbGVUb1ZpZXcgPyBNYXRoLnJvdW5kKHN0eWxlV2lkdGgpIDogTWF0aC5yb3VuZChyZWFsV2lkdGgpO1xuICAgICAgICB2YXIgdmlld3BvcnRIZWlnaHQgPSBzY2FsZVRvVmlldyA/IE1hdGgucm91bmQoc3R5bGVIZWlnaHQpIDogTWF0aC5yb3VuZChyZWFsSGVpZ2h0KTtcbiAgICAgICAgdmFyIHNjYWxlWCA9IGNhbnZhc1dpZHRoIC8gd2lkdGg7XG4gICAgICAgIHZhciBzY2FsZVkgPSBjYW52YXNIZWlnaHQgLyBoZWlnaHQ7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBibGVlZDogYmxlZWQsXG4gICAgICAgICAgICBwaXhlbFJhdGlvOiBwaXhlbFJhdGlvLFxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICBkaW1lbnNpb25zOiBbd2lkdGgsaGVpZ2h0XSxcbiAgICAgICAgICAgIHVuaXRzOiB1bml0cyB8fCAncHgnLFxuICAgICAgICAgICAgc2NhbGVYOiBzY2FsZVgsXG4gICAgICAgICAgICBzY2FsZVk6IHNjYWxlWSxcbiAgICAgICAgICAgIHZpZXdwb3J0V2lkdGg6IHZpZXdwb3J0V2lkdGgsXG4gICAgICAgICAgICB2aWV3cG9ydEhlaWdodDogdmlld3BvcnRIZWlnaHQsXG4gICAgICAgICAgICBjYW52YXNXaWR0aDogY2FudmFzV2lkdGgsXG4gICAgICAgICAgICBjYW52YXNIZWlnaHQ6IGNhbnZhc0hlaWdodCxcbiAgICAgICAgICAgIHRyaW1XaWR0aDogdHJpbVdpZHRoLFxuICAgICAgICAgICAgdHJpbUhlaWdodDogdHJpbUhlaWdodCxcbiAgICAgICAgICAgIHN0eWxlV2lkdGg6IHN0eWxlV2lkdGgsXG4gICAgICAgICAgICBzdHlsZUhlaWdodDogc3R5bGVIZWlnaHRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgZ2V0Q2FudmFzQ29udGV4dF8xID0gZ2V0Q2FudmFzQ29udGV4dDtcbiAgICBmdW5jdGlvbiBnZXRDYW52YXNDb250ZXh0ICh0eXBlLCBvcHRzKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSB0eXBlIHN0cmluZycpXG4gICAgICB9XG5cbiAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyAmJiAhb3B0cy5jYW52YXMpIHtcbiAgICAgICAgcmV0dXJuIG51bGwgLy8gY2hlY2sgZm9yIE5vZGVcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbnZhcyA9IG9wdHMuY2FudmFzIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgaWYgKHR5cGVvZiBvcHRzLndpZHRoID09PSAnbnVtYmVyJykge1xuICAgICAgICBjYW52YXMud2lkdGggPSBvcHRzLndpZHRoO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvcHRzLmhlaWdodCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IG9wdHMuaGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICB2YXIgYXR0cmlicyA9IG9wdHM7XG4gICAgICB2YXIgZ2w7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgbmFtZXMgPSBbIHR5cGUgXTtcbiAgICAgICAgLy8gcHJlZml4IEdMIGNvbnRleHRzXG4gICAgICAgIGlmICh0eXBlLmluZGV4T2YoJ3dlYmdsJykgPT09IDApIHtcbiAgICAgICAgICBuYW1lcy5wdXNoKCdleHBlcmltZW50YWwtJyArIHR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGdsID0gY2FudmFzLmdldENvbnRleHQobmFtZXNbaV0sIGF0dHJpYnMpO1xuICAgICAgICAgIGlmIChnbCkgcmV0dXJuIGdsXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZ2wgPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChnbCB8fCBudWxsKSAvLyBlbnN1cmUgbnVsbCBvbiBmYWlsXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2FudmFzRWxlbWVudCgpIHtcbiAgICAgICAgaWYgKCFpc0Jyb3dzZXIoKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJdCBhcHBlYXJzIHlvdSBhcmUgcnVuaW5nIGZyb20gTm9kZS5qcyBvciBhIG5vbi1icm93c2VyIGVudmlyb25tZW50LiBUcnkgcGFzc2luZyBpbiBhbiBleGlzdGluZyB7IGNhbnZhcyB9IGludGVyZmFjZSBpbnN0ZWFkLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDYW52YXMoc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKCBzZXR0aW5ncyA9PT0gdm9pZCAwICkgc2V0dGluZ3MgPSB7fTtcblxuICAgICAgICB2YXIgY29udGV4dCwgY2FudmFzO1xuICAgICAgICB2YXIgb3duc0NhbnZhcyA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3MuY2FudmFzICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHQ7XG4gICAgICAgICAgICBpZiAoIWNvbnRleHQgfHwgdHlwZW9mIGNvbnRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0NhbnZhcyA9IHNldHRpbmdzLmNhbnZhcztcbiAgICAgICAgICAgICAgICBpZiAoIW5ld0NhbnZhcykge1xuICAgICAgICAgICAgICAgICAgICBuZXdDYW52YXMgPSBjcmVhdGVDYW52YXNFbGVtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIG93bnNDYW52YXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IGNvbnRleHQgfHwgJzJkJztcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5ld0NhbnZhcy5nZXRDb250ZXh0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBzcGVjaWZpZWQgeyBjYW52YXMgfSBlbGVtZW50IGRvZXMgbm90IGhhdmUgYSBnZXRDb250ZXh0KCkgZnVuY3Rpb24sIG1heWJlIGl0IGlzIG5vdCBhIDxjYW52YXM+IHRhZz9cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBnZXRDYW52YXNDb250ZXh0XzEodHlwZSwgb2JqZWN0QXNzaWduKHt9LCBzZXR0aW5ncy5hdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhczogbmV3Q2FudmFzXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKFwiRmFpbGVkIGF0IGNhbnZhcy5nZXRDb250ZXh0KCdcIiArIHR5cGUgKyBcIicpIC0gdGhlIGJyb3dzZXIgbWF5IG5vdCBzdXBwb3J0IHRoaXMgY29udGV4dCwgb3IgYSBkaWZmZXJlbnQgY29udGV4dCBtYXkgYWxyZWFkeSBiZSBpbiB1c2Ugd2l0aCB0aGlzIGNhbnZhcy5cIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbnZhcyA9IGNvbnRleHQuY2FudmFzO1xuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmNhbnZhcyAmJiBjYW52YXMgIT09IHNldHRpbmdzLmNhbnZhcykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHsgY2FudmFzIH0gYW5kIHsgY29udGV4dCB9IHNldHRpbmdzIG11c3QgcG9pbnQgdG8gdGhlIHNhbWUgdW5kZXJseWluZyBjYW52YXMgZWxlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLnBpeGVsYXRlZCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3pJbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm9JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnRleHQubXNJbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjYW52YXMuc3R5bGVbJ2ltYWdlLXJlbmRlcmluZyddID0gJ3BpeGVsYXRlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNhbnZhczogY2FudmFzLFxuICAgICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgICAgIG93bnNDYW52YXM6IG93bnNDYW52YXNcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgU2tldGNoTWFuYWdlciA9IGZ1bmN0aW9uIFNrZXRjaE1hbmFnZXIoKSB7XG4gICAgICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuX3NldHRpbmdzID0ge307XG4gICAgICAgIHRoaXMuX3Byb3BzID0ge307XG4gICAgICAgIHRoaXMuX3NrZXRjaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fcmFmID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGFzdFJlZHJhd1Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5faXNQNVJlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2tleWJvYXJkU2hvcnRjdXRzID0ga2V5Ym9hcmRTaG9ydGN1dHMoe1xuICAgICAgICAgICAgZW5hYmxlZDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcyQxLnNldHRpbmdzLmhvdGtleXMgIT09IGZhbHNlOyB9LFxuICAgICAgICAgICAgc2F2ZTogZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzJDEucHJvcHMucmVjb3JkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzJDEuZW5kUmVjb3JkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzJDEucnVuKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGhpcyQxLnJlY29yZCgpOyB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIFxuICAgICAgICAgICAgICAgICAgICB7IHRoaXMkMS5leHBvcnRGcmFtZSgpOyB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9nZ2xlUGxheTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzJDEucHJvcHMucGxheWluZykgXG4gICAgICAgICAgICAgICAgICAgIHsgdGhpcyQxLnBhdXNlKCk7IH1cbiAgICAgICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICAgICAgeyB0aGlzJDEucGxheSgpOyB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tbWl0OiBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICB0aGlzJDEuZXhwb3J0RnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICBjb21taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2FuaW1hdGVIYW5kbGVyID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMkMS5hbmltYXRlKCk7IH0pO1xuICAgICAgICB0aGlzLl9yZXNpemVIYW5kbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gdGhpcyQxLnJlc2l6ZSgpO1xuICAgICAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzJDEucmVuZGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyBza2V0Y2g6IHsgY29uZmlndXJhYmxlOiB0cnVlIH0sc2V0dGluZ3M6IHsgY29uZmlndXJhYmxlOiB0cnVlIH0scHJvcHM6IHsgY29uZmlndXJhYmxlOiB0cnVlIH0gfTtcbiAgICBwcm90b3R5cGVBY2Nlc3NvcnMuc2tldGNoLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NrZXRjaDtcbiAgICB9O1xuICAgIHByb3RvdHlwZUFjY2Vzc29ycy5zZXR0aW5ncy5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXR0aW5ncztcbiAgICB9O1xuICAgIHByb3RvdHlwZUFjY2Vzc29ycy5wcm9wcy5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wcztcbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLl9jb21wdXRlUGxheWhlYWQgPSBmdW5jdGlvbiBfY29tcHV0ZVBsYXloZWFkIChjdXJyZW50VGltZSwgZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIGhhc0R1cmF0aW9uID0gdHlwZW9mIGR1cmF0aW9uID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShkdXJhdGlvbik7XG4gICAgICAgIHJldHVybiBoYXNEdXJhdGlvbiA/IGN1cnJlbnRUaW1lIC8gZHVyYXRpb24gOiAwO1xuICAgIH07XG4gICAgU2tldGNoTWFuYWdlci5wcm90b3R5cGUuX2NvbXB1dGVGcmFtZSA9IGZ1bmN0aW9uIF9jb21wdXRlRnJhbWUgKHBsYXloZWFkLCB0aW1lLCB0b3RhbEZyYW1lcywgZnBzKSB7XG4gICAgICAgIHJldHVybiBpc0Zpbml0ZSh0b3RhbEZyYW1lcykgJiYgdG90YWxGcmFtZXMgPiAxID8gTWF0aC5mbG9vcihwbGF5aGVhZCAqICh0b3RhbEZyYW1lcyAtIDEpKSA6IE1hdGguZmxvb3IoZnBzICogdGltZSk7XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS5fY29tcHV0ZUN1cnJlbnRGcmFtZSA9IGZ1bmN0aW9uIF9jb21wdXRlQ3VycmVudEZyYW1lICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXB1dGVGcmFtZSh0aGlzLnByb3BzLnBsYXloZWFkLCB0aGlzLnByb3BzLnRpbWUsIHRoaXMucHJvcHMudG90YWxGcmFtZXMsIHRoaXMucHJvcHMuZnBzKTtcbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLl9nZXRTaXplUHJvcHMgPSBmdW5jdGlvbiBfZ2V0U2l6ZVByb3BzICgpIHtcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoOiBwcm9wcy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogcHJvcHMuaGVpZ2h0LFxuICAgICAgICAgICAgcGl4ZWxSYXRpbzogcHJvcHMucGl4ZWxSYXRpbyxcbiAgICAgICAgICAgIGNhbnZhc1dpZHRoOiBwcm9wcy5jYW52YXNXaWR0aCxcbiAgICAgICAgICAgIGNhbnZhc0hlaWdodDogcHJvcHMuY2FudmFzSGVpZ2h0LFxuICAgICAgICAgICAgdmlld3BvcnRXaWR0aDogcHJvcHMudmlld3BvcnRXaWR0aCxcbiAgICAgICAgICAgIHZpZXdwb3J0SGVpZ2h0OiBwcm9wcy52aWV3cG9ydEhlaWdodFxuICAgICAgICB9O1xuICAgIH07XG4gICAgU2tldGNoTWFuYWdlci5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gcnVuICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNrZXRjaCkgXG4gICAgICAgICAgICB7IHRocm93IG5ldyBFcnJvcignc2hvdWxkIHdhaXQgdW50aWwgc2tldGNoIGlzIGxvYWRlZCBiZWZvcmUgdHJ5aW5nIHRvIHBsYXkoKScpOyB9XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnBsYXlpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2tldGNoLmRpc3Bvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignSW4gY2FudmFzLXNrZXRjaEAwLjAuMjMgdGhlIGRpc3Bvc2UoKSBldmVudCBoYXMgYmVlbiByZW5hbWVkIHRvIHVubG9hZCgpJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NpZ25hbEJlZ2luKCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGljaygpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbiBwbGF5ICgpIHtcbiAgICAgICAgdmFyIGFuaW1hdGUgPSB0aGlzLnNldHRpbmdzLmFuaW1hdGU7XG4gICAgICAgIGlmICgnYW5pbWF0aW9uJyBpbiB0aGlzLnNldHRpbmdzKSB7XG4gICAgICAgICAgICBhbmltYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW2NhbnZhcy1za2V0Y2hdIHsgYW5pbWF0aW9uIH0gaGFzIGJlZW4gcmVuYW1lZCB0byB7IGFuaW1hdGUgfScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYW5pbWF0ZSkgXG4gICAgICAgICAgICB7IHJldHVybjsgfVxuICAgICAgICBpZiAoIWlzQnJvd3NlcigpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbY2FudmFzLXNrZXRjaF0gV0FSTjogVXNpbmcgeyBhbmltYXRlIH0gaW4gTm9kZS5qcyBpcyBub3QgeWV0IHN1cHBvcnRlZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnBsYXlpbmcpIFxuICAgICAgICAgICAgeyByZXR1cm47IH1cbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NpZ25hbEJlZ2luKCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvcHMucGxheWluZyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLl9yYWYgIT0gbnVsbCkgXG4gICAgICAgICAgICB7IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9yYWYpOyB9XG4gICAgICAgIHRoaXMuX2xhc3RUaW1lID0gYnJvd3NlcigpO1xuICAgICAgICB0aGlzLl9yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1hdGVIYW5kbGVyKTtcbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gcGF1c2UgKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5yZWNvcmRpbmcpIFxuICAgICAgICAgICAgeyB0aGlzLmVuZFJlY29yZCgpOyB9XG4gICAgICAgIHRoaXMucHJvcHMucGxheWluZyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5fcmFmICE9IG51bGwgJiYgaXNCcm93c2VyKCkpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9yYWYpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS50b2dnbGVQbGF5ID0gZnVuY3Rpb24gdG9nZ2xlUGxheSAoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnBsYXlpbmcpIFxuICAgICAgICAgICAgeyB0aGlzLnBhdXNlKCk7IH1cbiAgICAgICAgIGVsc2UgXG4gICAgICAgICAgICB7IHRoaXMucGxheSgpOyB9XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gc3RvcCAoKSB7XG4gICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgdGhpcy5wcm9wcy5mcmFtZSA9IDA7XG4gICAgICAgIHRoaXMucHJvcHMucGxheWhlYWQgPSAwO1xuICAgICAgICB0aGlzLnByb3BzLnRpbWUgPSAwO1xuICAgICAgICB0aGlzLnByb3BzLmRlbHRhVGltZSA9IDA7XG4gICAgICAgIHRoaXMucHJvcHMuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH07XG4gICAgU2tldGNoTWFuYWdlci5wcm90b3R5cGUucmVjb3JkID0gZnVuY3Rpb24gcmVjb3JkICgpIHtcbiAgICAgICAgICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnJlY29yZGluZykgXG4gICAgICAgICAgICB7IHJldHVybjsgfVxuICAgICAgICBpZiAoIWlzQnJvd3NlcigpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbY2FudmFzLXNrZXRjaF0gV0FSTjogUmVjb3JkaW5nIGZyb20gTm9kZS5qcyBpcyBub3QgeWV0IHN1cHBvcnRlZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB0aGlzLnByb3BzLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnByb3BzLnJlY29yZGluZyA9IHRydWU7XG4gICAgICAgIHZhciBmcmFtZUludGVydmFsID0gMSAvIHRoaXMucHJvcHMuZnBzO1xuICAgICAgICBpZiAodGhpcy5fcmFmICE9IG51bGwpIFxuICAgICAgICAgICAgeyB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fcmFmKTsgfVxuICAgICAgICB2YXIgdGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcyQxLnByb3BzLnJlY29yZGluZykgXG4gICAgICAgICAgICAgICAgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7IH1cbiAgICAgICAgICAgIHRoaXMkMS5wcm9wcy5kZWx0YVRpbWUgPSBmcmFtZUludGVydmFsO1xuICAgICAgICAgICAgdGhpcyQxLnRpY2soKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzJDEuZXhwb3J0RnJhbWUoe1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlOiB0cnVlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMkMS5wcm9wcy5yZWNvcmRpbmcpIFxuICAgICAgICAgICAgICAgICAgICB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIHRoaXMkMS5wcm9wcy5kZWx0YVRpbWUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMkMS5wcm9wcy5mcmFtZSsrO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzJDEucHJvcHMuZnJhbWUgPCB0aGlzJDEucHJvcHMudG90YWxGcmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcyQxLnByb3BzLnRpbWUgKz0gZnJhbWVJbnRlcnZhbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcyQxLnByb3BzLnBsYXloZWFkID0gdGhpcyQxLl9jb21wdXRlUGxheWhlYWQodGhpcyQxLnByb3BzLnRpbWUsIHRoaXMkMS5wcm9wcy5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMkMS5fcmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmluaXNoZWQgcmVjb3JkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMkMS5fc2lnbmFsRW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMkMS5lbmRSZWNvcmQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcyQxLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcyQxLnJ1bigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMuc3RhcnRlZCkge1xuICAgICAgICAgICAgdGhpcy5fc2lnbmFsQmVnaW4oKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLl9zaWduYWxCZWdpbiA9IGZ1bmN0aW9uIF9zaWduYWxCZWdpbiAoKSB7XG4gICAgICAgICAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5za2V0Y2ggJiYgdHlwZW9mIHRoaXMuc2tldGNoLmJlZ2luID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLl93cmFwQ29udGV4dFNjYWxlKGZ1bmN0aW9uIChwcm9wcykgeyByZXR1cm4gdGhpcyQxLnNrZXRjaC5iZWdpbihwcm9wcyk7IH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS5fc2lnbmFsRW5kID0gZnVuY3Rpb24gX3NpZ25hbEVuZCAoKSB7XG4gICAgICAgICAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5za2V0Y2ggJiYgdHlwZW9mIHRoaXMuc2tldGNoLmVuZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5fd3JhcENvbnRleHRTY2FsZShmdW5jdGlvbiAocHJvcHMpIHsgcmV0dXJuIHRoaXMkMS5za2V0Y2guZW5kKHByb3BzKTsgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLmVuZFJlY29yZCA9IGZ1bmN0aW9uIGVuZFJlY29yZCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9yYWYgIT0gbnVsbCAmJiBpc0Jyb3dzZXIoKSkgXG4gICAgICAgICAgICB7IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9yYWYpOyB9XG4gICAgICAgIHRoaXMucHJvcHMucmVjb3JkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucHJvcHMuZGVsdGFUaW1lID0gMDtcbiAgICAgICAgdGhpcy5wcm9wcy5wbGF5aW5nID0gZmFsc2U7XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS5leHBvcnRGcmFtZSA9IGZ1bmN0aW9uIGV4cG9ydEZyYW1lIChvcHQpIHtcbiAgICAgICAgICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCBvcHQgPT09IHZvaWQgMCApIG9wdCA9IHt9O1xuXG4gICAgICAgIGlmICghdGhpcy5za2V0Y2gpIFxuICAgICAgICAgICAgeyByZXR1cm4gUHJvbWlzZS5hbGwoW10pOyB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5za2V0Y2gucHJlRXhwb3J0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnNrZXRjaC5wcmVFeHBvcnQoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXhwb3J0T3B0cyA9IG9iamVjdEFzc2lnbih7XG4gICAgICAgICAgICBzZXF1ZW5jZTogb3B0LnNlcXVlbmNlLFxuICAgICAgICAgICAgZnJhbWU6IG9wdC5zZXF1ZW5jZSA/IHRoaXMucHJvcHMuZnJhbWUgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBmaWxlOiB0aGlzLnNldHRpbmdzLmZpbGUsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLnNldHRpbmdzLm5hbWUsXG4gICAgICAgICAgICBwcmVmaXg6IHRoaXMuc2V0dGluZ3MucHJlZml4LFxuICAgICAgICAgICAgc3VmZml4OiB0aGlzLnNldHRpbmdzLnN1ZmZpeCxcbiAgICAgICAgICAgIGVuY29kaW5nOiB0aGlzLnNldHRpbmdzLmVuY29kaW5nLFxuICAgICAgICAgICAgZW5jb2RpbmdRdWFsaXR5OiB0aGlzLnNldHRpbmdzLmVuY29kaW5nUXVhbGl0eSxcbiAgICAgICAgICAgIHRpbWVTdGFtcDogZ2V0RmlsZU5hbWUoKSxcbiAgICAgICAgICAgIHRvdGFsRnJhbWVzOiBpc0Zpbml0ZSh0aGlzLnByb3BzLnRvdGFsRnJhbWVzKSA/IE1hdGgubWF4KDEwMCwgdGhpcy5wcm9wcy50b3RhbEZyYW1lcykgOiAxMDAwXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY2xpZW50ID0gZ2V0Q2xpZW50QVBJKCk7XG4gICAgICAgIHZhciBwID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIGlmIChjbGllbnQgJiYgb3B0LmNvbW1pdCAmJiB0eXBlb2YgY2xpZW50LmNvbW1pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGNvbW1pdE9wdHMgPSBvYmplY3RBc3NpZ24oe30sIGV4cG9ydE9wdHMpO1xuICAgICAgICAgICAgdmFyIGhhc2ggPSBjbGllbnQuY29tbWl0KGNvbW1pdE9wdHMpO1xuICAgICAgICAgICAgaWYgKGlzUHJvbWlzZV8xKGhhc2gpKSBcbiAgICAgICAgICAgICAgICB7IHAgPSBoYXNoOyB9XG4gICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICB7IHAgPSBQcm9taXNlLnJlc29sdmUoaGFzaCk7IH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcC50aGVuKGZ1bmN0aW9uIChoYXNoKSB7IHJldHVybiB0aGlzJDEuX2RvRXhwb3J0RnJhbWUob2JqZWN0QXNzaWduKHt9LCBleHBvcnRPcHRzLCB7XG4gICAgICAgICAgICBoYXNoOiBoYXNoIHx8ICcnXG4gICAgICAgIH0pKTsgfSk7XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS5fZG9FeHBvcnRGcmFtZSA9IGZ1bmN0aW9uIF9kb0V4cG9ydEZyYW1lIChleHBvcnRPcHRzKSB7XG4gICAgICAgICAgICB2YXIgdGhpcyQxID0gdGhpcztcbiAgICAgICAgICAgIGlmICggZXhwb3J0T3B0cyA9PT0gdm9pZCAwICkgZXhwb3J0T3B0cyA9IHt9O1xuXG4gICAgICAgIHRoaXMuX3Byb3BzLmV4cG9ydGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgICAgIHZhciBkcmF3UmVzdWx0ID0gdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMucHJvcHMuY2FudmFzO1xuICAgICAgICBpZiAodHlwZW9mIGRyYXdSZXN1bHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkcmF3UmVzdWx0ID0gW2NhbnZhc107XG4gICAgICAgIH1cbiAgICAgICAgZHJhd1Jlc3VsdCA9IFtdLmNvbmNhdChkcmF3UmVzdWx0KS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIGRyYXdSZXN1bHQgPSBkcmF3UmVzdWx0Lm1hcChmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB2YXIgaGFzRGF0YU9iamVjdCA9IHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnICYmIHJlc3VsdCAmJiAoJ2RhdGEnIGluIHJlc3VsdCB8fCAnZGF0YVVSTCcgaW4gcmVzdWx0KTtcbiAgICAgICAgICAgIHZhciBkYXRhID0gaGFzRGF0YU9iamVjdCA/IHJlc3VsdC5kYXRhIDogcmVzdWx0O1xuICAgICAgICAgICAgdmFyIG9wdHMgPSBoYXNEYXRhT2JqZWN0ID8gb2JqZWN0QXNzaWduKHt9LCByZXN1bHQsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KSA6IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGlzQ2FudmFzKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVuY29kaW5nID0gb3B0cy5lbmNvZGluZyB8fCBleHBvcnRPcHRzLmVuY29kaW5nO1xuICAgICAgICAgICAgICAgIHZhciBlbmNvZGluZ1F1YWxpdHkgPSBkZWZpbmVkKG9wdHMuZW5jb2RpbmdRdWFsaXR5LCBleHBvcnRPcHRzLmVuY29kaW5nUXVhbGl0eSwgMC45NSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlZiA9IGV4cG9ydENhbnZhcyhkYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIGVuY29kaW5nOiBlbmNvZGluZyxcbiAgICAgICAgICAgICAgICAgICAgZW5jb2RpbmdRdWFsaXR5OiBlbmNvZGluZ1F1YWxpdHlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFVUkwgPSByZWYuZGF0YVVSTDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4dGVuc2lvbiA9IHJlZi5leHRlbnNpb247XG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gcmVmLnR5cGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0cywge1xuICAgICAgICAgICAgICAgICAgICBkYXRhVVJMOiBkYXRhVVJMLFxuICAgICAgICAgICAgICAgICAgICBleHRlbnNpb246IGV4dGVuc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3Byb3BzLmV4cG9ydGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoZHJhd1Jlc3VsdC5tYXAoZnVuY3Rpb24gKHJlc3VsdCwgaSwgbGF5ZXJMaXN0KSB7XG4gICAgICAgICAgICB2YXIgY3VyT3B0ID0gb2JqZWN0QXNzaWduKHt9LCBleHBvcnRPcHRzLCByZXN1bHQsIHtcbiAgICAgICAgICAgICAgICBsYXllcjogaSxcbiAgICAgICAgICAgICAgICB0b3RhbExheWVyczogbGF5ZXJMaXN0Lmxlbmd0aFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5kYXRhVVJMKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFVUkwgPSByZXN1bHQuZGF0YVVSTDtcbiAgICAgICAgICAgICAgICBkZWxldGUgY3VyT3B0LmRhdGFVUkw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNhdmVEYXRhVVJMKGRhdGFVUkwsIGN1ck9wdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzYXZlRmlsZShkYXRhLCBjdXJPcHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSkudGhlbihmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50V2l0aE91dHB1dCA9IGV2LmZpbmQoZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGUub3V0cHV0TmFtZTsgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGlzQ2xpZW50ID0gZXYuc29tZShmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS5jbGllbnQ7IH0pO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtO1xuICAgICAgICAgICAgICAgIGlmIChldi5sZW5ndGggPiAxKSBcbiAgICAgICAgICAgICAgICAgICAgeyBpdGVtID0gZXYubGVuZ3RoOyB9XG4gICAgICAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50V2l0aE91dHB1dCkgXG4gICAgICAgICAgICAgICAgICAgIHsgaXRlbSA9IChldmVudFdpdGhPdXRwdXQub3V0cHV0TmFtZSkgKyBcIi9cIiArIChldlswXS5maWxlbmFtZSk7IH1cbiAgICAgICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICAgICAgeyBpdGVtID0gXCJcIiArIChldlswXS5maWxlbmFtZSk7IH1cbiAgICAgICAgICAgICAgICB2YXIgb2ZTZXEgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoZXhwb3J0T3B0cy5zZXF1ZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFzVG90YWxGcmFtZXMgPSBpc0Zpbml0ZSh0aGlzJDEucHJvcHMudG90YWxGcmFtZXMpO1xuICAgICAgICAgICAgICAgICAgICBvZlNlcSA9IGhhc1RvdGFsRnJhbWVzID8gKFwiIChmcmFtZSBcIiArIChleHBvcnRPcHRzLmZyYW1lICsgMSkgKyBcIiAvIFwiICsgKHRoaXMkMS5wcm9wcy50b3RhbEZyYW1lcykgKyBcIilcIikgOiAoXCIgKGZyYW1lIFwiICsgKGV4cG9ydE9wdHMuZnJhbWUpICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBvZlNlcSA9IFwiIGZpbGVzXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjbGllbnQgPSBpc0NsaWVudCA/ICdjYW52YXMtc2tldGNoLWNsaScgOiAnY2FudmFzLXNrZXRjaCc7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coKFwiJWNbXCIgKyBjbGllbnQgKyBcIl0lYyBFeHBvcnRlZCAlY1wiICsgaXRlbSArIFwiJWNcIiArIG9mU2VxKSwgJ2NvbG9yOiAjOGU4ZThlOycsICdjb2xvcjogaW5pdGlhbDsnLCAnZm9udC13ZWlnaHQ6IGJvbGQ7JywgJ2ZvbnQtd2VpZ2h0OiBpbml0aWFsOycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzJDEuc2tldGNoLnBvc3RFeHBvcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzJDEuc2tldGNoLnBvc3RFeHBvcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS5fd3JhcENvbnRleHRTY2FsZSA9IGZ1bmN0aW9uIF93cmFwQ29udGV4dFNjYWxlIChjYikge1xuICAgICAgICB0aGlzLl9wcmVSZW5kZXIoKTtcbiAgICAgICAgY2IodGhpcy5wcm9wcyk7XG4gICAgICAgIHRoaXMuX3Bvc3RSZW5kZXIoKTtcbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLl9wcmVSZW5kZXIgPSBmdW5jdGlvbiBfcHJlUmVuZGVyICgpIHtcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5wcm9wcztcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmdsICYmIHByb3BzLmNvbnRleHQgJiYgIXByb3BzLnA1KSB7XG4gICAgICAgICAgICBwcm9wcy5jb250ZXh0LnNhdmUoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNjYWxlQ29udGV4dCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBwcm9wcy5jb250ZXh0LnNjYWxlKHByb3BzLnNjYWxlWCwgcHJvcHMuc2NhbGVZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwcm9wcy5wNSkge1xuICAgICAgICAgICAgcHJvcHMucDUuc2NhbGUocHJvcHMuc2NhbGVYIC8gcHJvcHMucGl4ZWxSYXRpbywgcHJvcHMuc2NhbGVZIC8gcHJvcHMucGl4ZWxSYXRpbyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLl9wb3N0UmVuZGVyID0gZnVuY3Rpb24gX3Bvc3RSZW5kZXIgKCkge1xuICAgICAgICB2YXIgcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMuZ2wgJiYgcHJvcHMuY29udGV4dCAmJiAhcHJvcHMucDUpIHtcbiAgICAgICAgICAgIHByb3BzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wcy5nbCAmJiB0aGlzLnNldHRpbmdzLmZsdXNoICE9PSBmYWxzZSAmJiAhcHJvcHMucDUpIHtcbiAgICAgICAgICAgIHByb3BzLmdsLmZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbiB0aWNrICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2tldGNoICYmIHR5cGVvZiB0aGlzLnNrZXRjaC50aWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLl9wcmVSZW5kZXIoKTtcbiAgICAgICAgICAgIHRoaXMuc2tldGNoLnRpY2sodGhpcy5wcm9wcyk7XG4gICAgICAgICAgICB0aGlzLl9wb3N0UmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlciAoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnA1KSB7XG4gICAgICAgICAgICB0aGlzLl9sYXN0UmVkcmF3UmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5wNS5yZWRyYXcoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYXN0UmVkcmF3UmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VibWl0RHJhd0NhbGwoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2tldGNoTWFuYWdlci5wcm90b3R5cGUuc3VibWl0RHJhd0NhbGwgPSBmdW5jdGlvbiBzdWJtaXREcmF3Q2FsbCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5za2V0Y2gpIFxuICAgICAgICAgICAgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5wcm9wcztcbiAgICAgICAgdGhpcy5fcHJlUmVuZGVyKCk7XG4gICAgICAgIHZhciBkcmF3UmVzdWx0O1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2tldGNoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBkcmF3UmVzdWx0ID0gdGhpcy5za2V0Y2gocHJvcHMpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLnNrZXRjaC5yZW5kZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGRyYXdSZXN1bHQgPSB0aGlzLnNrZXRjaC5yZW5kZXIocHJvcHMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Bvc3RSZW5kZXIoKTtcbiAgICAgICAgcmV0dXJuIGRyYXdSZXN1bHQ7XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKG9wdCkge1xuICAgICAgICAgICAgdmFyIHRoaXMkMSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoIG9wdCA9PT0gdm9pZCAwICkgb3B0ID0ge307XG5cbiAgICAgICAgdmFyIG5vdFlldFN1cHBvcnRlZCA9IFsnYW5pbWF0ZSddO1xuICAgICAgICBPYmplY3Qua2V5cyhvcHQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKG5vdFlldFN1cHBvcnRlZC5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJTb3JyeSwgdGhlIHsgXCIgKyBrZXkgKyBcIiB9IG9wdGlvbiBpcyBub3QgeWV0IHN1cHBvcnRlZCB3aXRoIHVwZGF0ZSgpLlwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgb2xkQ2FudmFzID0gdGhpcy5fc2V0dGluZ3MuY2FudmFzO1xuICAgICAgICB2YXIgb2xkQ29udGV4dCA9IHRoaXMuX3NldHRpbmdzLmNvbnRleHQ7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvcHQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG9wdFtrZXldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzJDEuX3NldHRpbmdzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgdGltZU9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9zZXR0aW5ncywgb3B0KTtcbiAgICAgICAgaWYgKCd0aW1lJyBpbiBvcHQgJiYgJ2ZyYW1lJyBpbiBvcHQpIFxuICAgICAgICAgICAgeyB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBzaG91bGQgc3BlY2lmeSB7IHRpbWUgfSBvciB7IGZyYW1lIH0gYnV0IG5vdCBib3RoJyk7IH1cbiAgICAgICAgIGVsc2UgaWYgKCd0aW1lJyBpbiBvcHQpIFxuICAgICAgICAgICAgeyBkZWxldGUgdGltZU9wdHMuZnJhbWU7IH1cbiAgICAgICAgIGVsc2UgaWYgKCdmcmFtZScgaW4gb3B0KSBcbiAgICAgICAgICAgIHsgZGVsZXRlIHRpbWVPcHRzLnRpbWU7IH1cbiAgICAgICAgaWYgKCdkdXJhdGlvbicgaW4gb3B0ICYmICd0b3RhbEZyYW1lcycgaW4gb3B0KSBcbiAgICAgICAgICAgIHsgdGhyb3cgbmV3IEVycm9yKCdZb3Ugc2hvdWxkIHNwZWNpZnkgeyBkdXJhdGlvbiB9IG9yIHsgdG90YWxGcmFtZXMgfSBidXQgbm90IGJvdGgnKTsgfVxuICAgICAgICAgZWxzZSBpZiAoJ2R1cmF0aW9uJyBpbiBvcHQpIFxuICAgICAgICAgICAgeyBkZWxldGUgdGltZU9wdHMudG90YWxGcmFtZXM7IH1cbiAgICAgICAgIGVsc2UgaWYgKCd0b3RhbEZyYW1lcycgaW4gb3B0KSBcbiAgICAgICAgICAgIHsgZGVsZXRlIHRpbWVPcHRzLmR1cmF0aW9uOyB9XG4gICAgICAgIHZhciB0aW1lUHJvcHMgPSB0aGlzLmdldFRpbWVQcm9wcyh0aW1lT3B0cyk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fcHJvcHMsIHRpbWVQcm9wcyk7XG4gICAgICAgIGlmIChvbGRDYW52YXMgIT09IHRoaXMuX3NldHRpbmdzLmNhbnZhcyB8fCBvbGRDb250ZXh0ICE9PSB0aGlzLl9zZXR0aW5ncy5jb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgcmVmID0gY3JlYXRlQ2FudmFzKHRoaXMuX3NldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gcmVmLmNhbnZhcztcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dCA9IHJlZi5jb250ZXh0O1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgdGhpcy5fc2V0dXBHTEtleSgpO1xuICAgICAgICAgICAgdGhpcy5fYXBwZW5kQ2FudmFzSWZOZWVkZWQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0LnA1ICYmIHR5cGVvZiBvcHQucDUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucDUgPSBvcHQucDU7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnA1LmRyYXcgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzJDEuX2lzUDVSZXNpemluZykgXG4gICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcyQxLl9sYXN0UmVkcmF3UmVzdWx0ID0gdGhpcyQxLnN1Ym1pdERyYXdDYWxsKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ3BsYXlpbmcnIGluIG9wdCkge1xuICAgICAgICAgICAgaWYgKG9wdC5wbGF5aW5nKSBcbiAgICAgICAgICAgICAgICB7IHRoaXMucGxheSgpOyB9XG4gICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICB7IHRoaXMucGF1c2UoKTsgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzO1xuICAgIH07XG4gICAgU2tldGNoTWFuYWdlci5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gcmVzaXplICgpIHtcbiAgICAgICAgdmFyIG9sZFNpemVzID0gdGhpcy5fZ2V0U2l6ZVByb3BzKCk7XG4gICAgICAgIHZhciBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3M7XG4gICAgICAgIHZhciBwcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgICAgIHZhciBuZXdQcm9wcyA9IHJlc2l6ZUNhbnZhcyhwcm9wcywgc2V0dGluZ3MpO1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX3Byb3BzLCBuZXdQcm9wcyk7XG4gICAgICAgIHZhciByZWYgPSB0aGlzLnByb3BzO1xuICAgICAgICAgICAgdmFyIHBpeGVsUmF0aW8gPSByZWYucGl4ZWxSYXRpbztcbiAgICAgICAgICAgIHZhciBjYW52YXNXaWR0aCA9IHJlZi5jYW52YXNXaWR0aDtcbiAgICAgICAgICAgIHZhciBjYW52YXNIZWlnaHQgPSByZWYuY2FudmFzSGVpZ2h0O1xuICAgICAgICAgICAgdmFyIHN0eWxlV2lkdGggPSByZWYuc3R5bGVXaWR0aDtcbiAgICAgICAgICAgIHZhciBzdHlsZUhlaWdodCA9IHJlZi5zdHlsZUhlaWdodDtcbiAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMucHJvcHMuY2FudmFzO1xuICAgICAgICBpZiAoY2FudmFzICYmIHNldHRpbmdzLnJlc2l6ZUNhbnZhcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmIChwcm9wcy5wNSkge1xuICAgICAgICAgICAgICAgIGlmIChjYW52YXMud2lkdGggIT09IGNhbnZhc1dpZHRoIHx8IGNhbnZhcy5oZWlnaHQgIT09IGNhbnZhc0hlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc1A1UmVzaXppbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBwcm9wcy5wNS5waXhlbERlbnNpdHkocGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzLnA1LnJlc2l6ZUNhbnZhcyhjYW52YXNXaWR0aCAvIHBpeGVsUmF0aW8sIGNhbnZhc0hlaWdodCAvIHBpeGVsUmF0aW8sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNQNVJlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FudmFzLndpZHRoICE9PSBjYW52YXNXaWR0aCkgXG4gICAgICAgICAgICAgICAgICAgIHsgY2FudmFzLndpZHRoID0gY2FudmFzV2lkdGg7IH1cbiAgICAgICAgICAgICAgICBpZiAoY2FudmFzLmhlaWdodCAhPT0gY2FudmFzSGVpZ2h0KSBcbiAgICAgICAgICAgICAgICAgICAgeyBjYW52YXMuaGVpZ2h0ID0gY2FudmFzSGVpZ2h0OyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNCcm93c2VyKCkgJiYgc2V0dGluZ3Muc3R5bGVDYW52YXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gc3R5bGVXaWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gc3R5bGVIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5ld1NpemVzID0gdGhpcy5fZ2V0U2l6ZVByb3BzKCk7XG4gICAgICAgIHZhciBjaGFuZ2VkID0gIWRlZXBFcXVhbF8xKG9sZFNpemVzLCBuZXdTaXplcyk7XG4gICAgICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9zaXplQ2hhbmdlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFuZ2VkO1xuICAgIH07XG4gICAgU2tldGNoTWFuYWdlci5wcm90b3R5cGUuX3NpemVDaGFuZ2VkID0gZnVuY3Rpb24gX3NpemVDaGFuZ2VkICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2tldGNoICYmIHR5cGVvZiB0aGlzLnNrZXRjaC5yZXNpemUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuc2tldGNoLnJlc2l6ZSh0aGlzLnByb3BzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2tldGNoTWFuYWdlci5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uIGFuaW1hdGUgKCkge1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMucGxheWluZykgXG4gICAgICAgICAgICB7IHJldHVybjsgfVxuICAgICAgICBpZiAoIWlzQnJvd3NlcigpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbY2FudmFzLXNrZXRjaF0gV0FSTjogQW5pbWF0aW9uIGluIE5vZGUuanMgaXMgbm90IHlldCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1hdGVIYW5kbGVyKTtcbiAgICAgICAgdmFyIG5vdyA9IGJyb3dzZXIoKTtcbiAgICAgICAgdmFyIGZwcyA9IHRoaXMucHJvcHMuZnBzO1xuICAgICAgICB2YXIgZnJhbWVJbnRlcnZhbE1TID0gMTAwMCAvIGZwcztcbiAgICAgICAgdmFyIGRlbHRhVGltZU1TID0gbm93IC0gdGhpcy5fbGFzdFRpbWU7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IHRoaXMucHJvcHMuZHVyYXRpb247XG4gICAgICAgIHZhciBoYXNEdXJhdGlvbiA9IHR5cGVvZiBkdXJhdGlvbiA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoZHVyYXRpb24pO1xuICAgICAgICB2YXIgaXNOZXdGcmFtZSA9IHRydWU7XG4gICAgICAgIHZhciBwbGF5YmFja1JhdGUgPSB0aGlzLnNldHRpbmdzLnBsYXliYWNrUmF0ZTtcbiAgICAgICAgaWYgKHBsYXliYWNrUmF0ZSA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgZGVsdGFUaW1lTVMgPSBmcmFtZUludGVydmFsTVM7XG4gICAgICAgIH0gZWxzZSBpZiAocGxheWJhY2tSYXRlID09PSAndGhyb3R0bGUnKSB7XG4gICAgICAgICAgICBpZiAoZGVsdGFUaW1lTVMgPiBmcmFtZUludGVydmFsTVMpIHtcbiAgICAgICAgICAgICAgICBub3cgPSBub3cgLSBkZWx0YVRpbWVNUyAlIGZyYW1lSW50ZXJ2YWxNUztcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VGltZSA9IG5vdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXNOZXdGcmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSBub3c7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlbHRhVGltZSA9IGRlbHRhVGltZU1TIC8gMTAwMDtcbiAgICAgICAgdmFyIG5ld1RpbWUgPSB0aGlzLnByb3BzLnRpbWUgKyBkZWx0YVRpbWUgKiB0aGlzLnByb3BzLnRpbWVTY2FsZTtcbiAgICAgICAgaWYgKG5ld1RpbWUgPCAwICYmIGhhc0R1cmF0aW9uKSB7XG4gICAgICAgICAgICBuZXdUaW1lID0gZHVyYXRpb24gKyBuZXdUaW1lO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpc0ZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBpc0xvb3BTdGFydCA9IGZhbHNlO1xuICAgICAgICB2YXIgbG9vcGluZyA9IHRoaXMuc2V0dGluZ3MubG9vcCAhPT0gZmFsc2U7XG4gICAgICAgIGlmIChoYXNEdXJhdGlvbiAmJiBuZXdUaW1lID49IGR1cmF0aW9uKSB7XG4gICAgICAgICAgICBpZiAobG9vcGluZykge1xuICAgICAgICAgICAgICAgIGlzTmV3RnJhbWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG5ld1RpbWUgPSBuZXdUaW1lICUgZHVyYXRpb247XG4gICAgICAgICAgICAgICAgaXNMb29wU3RhcnQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpc05ld0ZyYW1lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbmV3VGltZSA9IGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgIGlzRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc2lnbmFsRW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTmV3RnJhbWUpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZGVsdGFUaW1lID0gZGVsdGFUaW1lO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy50aW1lID0gbmV3VGltZTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucGxheWhlYWQgPSB0aGlzLl9jb21wdXRlUGxheWhlYWQobmV3VGltZSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgdmFyIGxhc3RGcmFtZSA9IHRoaXMucHJvcHMuZnJhbWU7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZyYW1lID0gdGhpcy5fY29tcHV0ZUN1cnJlbnRGcmFtZSgpO1xuICAgICAgICAgICAgaWYgKGlzTG9vcFN0YXJ0KSBcbiAgICAgICAgICAgICAgICB7IHRoaXMuX3NpZ25hbEJlZ2luKCk7IH1cbiAgICAgICAgICAgIGlmIChsYXN0RnJhbWUgIT09IHRoaXMucHJvcHMuZnJhbWUpIFxuICAgICAgICAgICAgICAgIHsgdGhpcy50aWNrKCk7IH1cbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmRlbHRhVGltZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRmluaXNoZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2tldGNoTWFuYWdlci5wcm90b3R5cGUuZGlzcGF0Y2ggPSBmdW5jdGlvbiBkaXNwYXRjaCAoY2IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykgXG4gICAgICAgICAgICB7IHRocm93IG5ldyBFcnJvcignbXVzdCBwYXNzIGZ1bmN0aW9uIGludG8gZGlzcGF0Y2goKScpOyB9XG4gICAgICAgIGNiKHRoaXMucHJvcHMpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH07XG4gICAgU2tldGNoTWFuYWdlci5wcm90b3R5cGUubW91bnQgPSBmdW5jdGlvbiBtb3VudCAoKSB7XG4gICAgICAgIHRoaXMuX2FwcGVuZENhbnZhc0lmTmVlZGVkKCk7XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS51bm1vdW50ID0gZnVuY3Rpb24gdW5tb3VudCAoKSB7XG4gICAgICAgIGlmIChpc0Jyb3dzZXIoKSkge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUhhbmRsZXIpO1xuICAgICAgICAgICAgdGhpcy5fa2V5Ym9hcmRTaG9ydGN1dHMuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvcHMuY2FudmFzLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FudmFzLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5wcm9wcy5jYW52YXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS5fYXBwZW5kQ2FudmFzSWZOZWVkZWQgPSBmdW5jdGlvbiBfYXBwZW5kQ2FudmFzSWZOZWVkZWQgKCkge1xuICAgICAgICBpZiAoIWlzQnJvd3NlcigpKSBcbiAgICAgICAgICAgIHsgcmV0dXJuOyB9XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnBhcmVudCAhPT0gZmFsc2UgJiYgKHRoaXMucHJvcHMuY2FudmFzICYmICF0aGlzLnByb3BzLmNhbnZhcy5wYXJlbnRFbGVtZW50KSkge1xuICAgICAgICAgICAgdmFyIGRlZmF1bHRQYXJlbnQgPSB0aGlzLnNldHRpbmdzLnBhcmVudCB8fCBkb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgZGVmYXVsdFBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLnByb3BzLmNhbnZhcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLl9zZXR1cEdMS2V5ID0gZnVuY3Rpb24gX3NldHVwR0xLZXkgKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5jb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoaXNXZWJHTENvbnRleHQodGhpcy5wcm9wcy5jb250ZXh0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb3BzLmdsID0gdGhpcy5wcm9wcy5jb250ZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJvcHMuZ2w7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLmdldFRpbWVQcm9wcyA9IGZ1bmN0aW9uIGdldFRpbWVQcm9wcyAoc2V0dGluZ3MpIHtcbiAgICAgICAgICAgIGlmICggc2V0dGluZ3MgPT09IHZvaWQgMCApIHNldHRpbmdzID0ge307XG5cbiAgICAgICAgdmFyIGR1cmF0aW9uID0gc2V0dGluZ3MuZHVyYXRpb247XG4gICAgICAgIHZhciB0b3RhbEZyYW1lcyA9IHNldHRpbmdzLnRvdGFsRnJhbWVzO1xuICAgICAgICB2YXIgdGltZVNjYWxlID0gZGVmaW5lZChzZXR0aW5ncy50aW1lU2NhbGUsIDEpO1xuICAgICAgICB2YXIgZnBzID0gZGVmaW5lZChzZXR0aW5ncy5mcHMsIDI0KTtcbiAgICAgICAgdmFyIGhhc0R1cmF0aW9uID0gdHlwZW9mIGR1cmF0aW9uID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShkdXJhdGlvbik7XG4gICAgICAgIHZhciBoYXNUb3RhbEZyYW1lcyA9IHR5cGVvZiB0b3RhbEZyYW1lcyA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodG90YWxGcmFtZXMpO1xuICAgICAgICB2YXIgdG90YWxGcmFtZXNGcm9tRHVyYXRpb24gPSBoYXNEdXJhdGlvbiA/IE1hdGguZmxvb3IoZnBzICogZHVyYXRpb24pIDogdW5kZWZpbmVkO1xuICAgICAgICB2YXIgZHVyYXRpb25Gcm9tVG90YWxGcmFtZXMgPSBoYXNUb3RhbEZyYW1lcyA/IHRvdGFsRnJhbWVzIC8gZnBzIDogdW5kZWZpbmVkO1xuICAgICAgICBpZiAoaGFzRHVyYXRpb24gJiYgaGFzVG90YWxGcmFtZXMgJiYgdG90YWxGcmFtZXNGcm9tRHVyYXRpb24gIT09IHRvdGFsRnJhbWVzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBzaG91bGQgc3BlY2lmeSBlaXRoZXIgZHVyYXRpb24gb3IgdG90YWxGcmFtZXMsIGJ1dCBub3QgYm90aC4gT3IsIHRoZXkgbXVzdCBtYXRjaCBleGFjdGx5LicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MuZGltZW5zaW9ucyA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHNldHRpbmdzLnVuaXRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiWW91J3ZlIHNwZWNpZmllZCBhIHsgdW5pdHMgfSBzZXR0aW5nIGJ1dCBubyB7IGRpbWVuc2lvbiB9LCBzbyB0aGUgdW5pdHMgd2lsbCBiZSBpZ25vcmVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0b3RhbEZyYW1lcyA9IGRlZmluZWQodG90YWxGcmFtZXMsIHRvdGFsRnJhbWVzRnJvbUR1cmF0aW9uLCBJbmZpbml0eSk7XG4gICAgICAgIGR1cmF0aW9uID0gZGVmaW5lZChkdXJhdGlvbiwgZHVyYXRpb25Gcm9tVG90YWxGcmFtZXMsIEluZmluaXR5KTtcbiAgICAgICAgdmFyIHN0YXJ0VGltZSA9IHNldHRpbmdzLnRpbWU7XG4gICAgICAgIHZhciBzdGFydEZyYW1lID0gc2V0dGluZ3MuZnJhbWU7XG4gICAgICAgIHZhciBoYXNTdGFydFRpbWUgPSB0eXBlb2Ygc3RhcnRUaW1lID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShzdGFydFRpbWUpO1xuICAgICAgICB2YXIgaGFzU3RhcnRGcmFtZSA9IHR5cGVvZiBzdGFydEZyYW1lID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShzdGFydEZyYW1lKTtcbiAgICAgICAgdmFyIHRpbWUgPSAwO1xuICAgICAgICB2YXIgZnJhbWUgPSAwO1xuICAgICAgICB2YXIgcGxheWhlYWQgPSAwO1xuICAgICAgICBpZiAoaGFzU3RhcnRUaW1lICYmIGhhc1N0YXJ0RnJhbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHNob3VsZCBzcGVjaWZ5IGVpdGhlciBzdGFydCBmcmFtZSBvciB0aW1lLCBidXQgbm90IGJvdGguJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaGFzU3RhcnRUaW1lKSB7XG4gICAgICAgICAgICB0aW1lID0gc3RhcnRUaW1lO1xuICAgICAgICAgICAgcGxheWhlYWQgPSB0aGlzLl9jb21wdXRlUGxheWhlYWQodGltZSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgZnJhbWUgPSB0aGlzLl9jb21wdXRlRnJhbWUocGxheWhlYWQsIHRpbWUsIHRvdGFsRnJhbWVzLCBmcHMpO1xuICAgICAgICB9IGVsc2UgaWYgKGhhc1N0YXJ0RnJhbWUpIHtcbiAgICAgICAgICAgIGZyYW1lID0gc3RhcnRGcmFtZTtcbiAgICAgICAgICAgIHRpbWUgPSBmcmFtZSAvIGZwcztcbiAgICAgICAgICAgIHBsYXloZWFkID0gdGhpcy5fY29tcHV0ZVBsYXloZWFkKHRpbWUsIGR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGxheWhlYWQ6IHBsYXloZWFkLFxuICAgICAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgICAgIGZyYW1lOiBmcmFtZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgIHRvdGFsRnJhbWVzOiB0b3RhbEZyYW1lcyxcbiAgICAgICAgICAgIGZwczogZnBzLFxuICAgICAgICAgICAgdGltZVNjYWxlOiB0aW1lU2NhbGVcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24gc2V0dXAgKHNldHRpbmdzLCBvdmVycmlkZXMpIHtcbiAgICAgICAgICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCBzZXR0aW5ncyA9PT0gdm9pZCAwICkgc2V0dGluZ3MgPSB7fTtcbiAgICAgICAgICAgIGlmICggb3ZlcnJpZGVzID09PSB2b2lkIDAgKSBvdmVycmlkZXMgPSB7fTtcblxuICAgICAgICBpZiAodGhpcy5za2V0Y2gpIFxuICAgICAgICAgICAgeyB0aHJvdyBuZXcgRXJyb3IoJ011bHRpcGxlIHNldHVwKCkgY2FsbHMgbm90IHlldCBzdXBwb3J0ZWQuJyk7IH1cbiAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBzZXR0aW5ncywgdGhpcy5fc2V0dGluZ3MpO1xuICAgICAgICB2YXIgcmVmID0gY3JlYXRlQ2FudmFzKHRoaXMuX3NldHRpbmdzKTtcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gcmVmLmNvbnRleHQ7XG4gICAgICAgICAgICB2YXIgY2FudmFzID0gcmVmLmNhbnZhcztcbiAgICAgICAgdmFyIHRpbWVQcm9wcyA9IHRoaXMuZ2V0VGltZVByb3BzKHRoaXMuX3NldHRpbmdzKTtcbiAgICAgICAgdGhpcy5fcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aW1lUHJvcHMsXG4gICAgICAgICAgICB7Y2FudmFzOiBjYW52YXMsXG4gICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgICAgICAgZGVsdGFUaW1lOiAwLFxuICAgICAgICAgICAgc3RhcnRlZDogZmFsc2UsXG4gICAgICAgICAgICBleHBvcnRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgcGxheWluZzogZmFsc2UsXG4gICAgICAgICAgICByZWNvcmRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHRoaXMuc2V0dGluZ3MsXG4gICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMkMS5yZW5kZXIoKTsgfSxcbiAgICAgICAgICAgIHRvZ2dsZVBsYXk6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMkMS50b2dnbGVQbGF5KCk7IH0sXG4gICAgICAgICAgICBkaXNwYXRjaDogZnVuY3Rpb24gKGNiKSB7IHJldHVybiB0aGlzJDEuZGlzcGF0Y2goY2IpOyB9LFxuICAgICAgICAgICAgdGljazogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcyQxLnRpY2soKTsgfSxcbiAgICAgICAgICAgIHJlc2l6ZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcyQxLnJlc2l6ZSgpOyB9LFxuICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAob3B0KSB7IHJldHVybiB0aGlzJDEudXBkYXRlKG9wdCk7IH0sXG4gICAgICAgICAgICBleHBvcnRGcmFtZTogZnVuY3Rpb24gKG9wdCkgeyByZXR1cm4gdGhpcyQxLmV4cG9ydEZyYW1lKG9wdCk7IH0sXG4gICAgICAgICAgICByZWNvcmQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMkMS5yZWNvcmQoKTsgfSxcbiAgICAgICAgICAgIHBsYXk6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMkMS5wbGF5KCk7IH0sXG4gICAgICAgICAgICBwYXVzZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcyQxLnBhdXNlKCk7IH0sXG4gICAgICAgICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzJDEuc3RvcCgpOyB9fSk7XG4gICAgICAgIHRoaXMuX3NldHVwR0xLZXkoKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLmxvYWRBbmRSdW4gPSBmdW5jdGlvbiBsb2FkQW5kUnVuIChjYW52YXNTa2V0Y2gsIG5ld1NldHRpbmdzKSB7XG4gICAgICAgICAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICAgICAgICByZXR1cm4gdGhpcy5sb2FkKGNhbnZhc1NrZXRjaCwgbmV3U2V0dGluZ3MpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcyQxLnJ1bigpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMkMTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZS51bmxvYWQgPSBmdW5jdGlvbiB1bmxvYWQgKCkge1xuICAgICAgICAgICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICBpZiAoIXRoaXMuc2tldGNoKSBcbiAgICAgICAgICAgIHsgcmV0dXJuOyB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5za2V0Y2gudW5sb2FkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLl93cmFwQ29udGV4dFNjYWxlKGZ1bmN0aW9uIChwcm9wcykgeyByZXR1cm4gdGhpcyQxLnNrZXRjaC51bmxvYWQocHJvcHMpOyB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9za2V0Y2ggPSBudWxsO1xuICAgIH07XG4gICAgU2tldGNoTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xuICAgICAgICB0aGlzLnVubG9hZCgpO1xuICAgICAgICB0aGlzLnVubW91bnQoKTtcbiAgICB9O1xuICAgIFNrZXRjaE1hbmFnZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiBsb2FkIChjcmVhdGVTa2V0Y2gsIG5ld1NldHRpbmdzKSB7XG4gICAgICAgICAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mIGNyZWF0ZVNrZXRjaCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZnVuY3Rpb24gbXVzdCB0YWtlIGluIGEgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IHBhcmFtZXRlci4gRXhhbXBsZTpcXG4gIGNhbnZhc1NrZXRjaGVyKCgpID0+IHsgLi4uIH0sIHNldHRpbmdzKScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNrZXRjaCkge1xuICAgICAgICAgICAgdGhpcy51bmxvYWQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIG5ld1NldHRpbmdzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGUobmV3U2V0dGluZ3MpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3ByZVJlbmRlcigpO1xuICAgICAgICB2YXIgcHJlbG9hZCA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5wNSkge1xuICAgICAgICAgICAgaWYgKCFpc0Jyb3dzZXIoKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignW2NhbnZhcy1za2V0Y2hdIEVSUk9SOiBVc2luZyBwNS5qcyBpbiBOb2RlLmpzIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByZWxvYWQgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBQNUNvbnN0cnVjdG9yID0gdGhpcyQxLnNldHRpbmdzLnA1O1xuICAgICAgICAgICAgICAgIHZhciBwcmVsb2FkO1xuICAgICAgICAgICAgICAgIGlmIChQNUNvbnN0cnVjdG9yLnA1KSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWxvYWQgPSBQNUNvbnN0cnVjdG9yLnByZWxvYWQ7XG4gICAgICAgICAgICAgICAgICAgIFA1Q29uc3RydWN0b3IgPSBQNUNvbnN0cnVjdG9yLnA1O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcDVTa2V0Y2ggPSBmdW5jdGlvbiAocDUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZWxvYWQpIFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBwNS5wcmVsb2FkID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHByZWxvYWQocDUpOyB9KTsgfVxuICAgICAgICAgICAgICAgICAgICBwNS5zZXR1cCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcHMgPSB0aGlzJDEucHJvcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNHTCA9IHRoaXMkMS5zZXR0aW5ncy5jb250ZXh0ID09PSAnd2ViZ2wnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gaXNHTCA/IHA1LldFQkdMIDogcDUuUDJEO1xuICAgICAgICAgICAgICAgICAgICAgICAgcDUubm9Mb29wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwNS5waXhlbERlbnNpdHkocHJvcHMucGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwNS5jcmVhdGVDYW52YXMocHJvcHMudmlld3BvcnRXaWR0aCwgcHJvcHMudmlld3BvcnRIZWlnaHQsIHJlbmRlcmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0dMICYmIHRoaXMkMS5zZXR0aW5ncy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcDUuc2V0QXR0cmlidXRlcyh0aGlzJDEuc2V0dGluZ3MuYXR0cmlidXRlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzJDEudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwNTogcDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzOiBwNS5jYW52YXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogcDUuX3JlbmRlcmVyLmRyYXdpbmdDb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFA1Q29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFA1Q29uc3RydWN0b3IocDVTa2V0Y2gpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93LmNyZWF0ZUNhbnZhcyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwieyBwNSB9IHNldHRpbmcgaXMgcGFzc2VkIGJ1dCBjYW4ndCBmaW5kIHA1LmpzIGluIGdsb2JhbCAod2luZG93KSBzY29wZS4gTWF5YmUgeW91IGRpZCBub3QgY3JlYXRlIGl0IGdsb2JhbGx5P1xcbm5ldyBwNSgpOyAvLyA8LS0gYXR0YWNoZXMgdG8gZ2xvYmFsIHNjb3BlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHA1U2tldGNoKHdpbmRvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByZWxvYWQudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbG9hZGVyID0gY3JlYXRlU2tldGNoKHRoaXMkMS5wcm9wcyk7XG4gICAgICAgICAgICBpZiAoIWlzUHJvbWlzZV8xKGxvYWRlcikpIHtcbiAgICAgICAgICAgICAgICBsb2FkZXIgPSBQcm9taXNlLnJlc29sdmUobG9hZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsb2FkZXI7XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHNrZXRjaCkge1xuICAgICAgICAgICAgaWYgKCFza2V0Y2gpIFxuICAgICAgICAgICAgICAgIHsgc2tldGNoID0ge307IH1cbiAgICAgICAgICAgIHRoaXMkMS5fc2tldGNoID0gc2tldGNoO1xuICAgICAgICAgICAgaWYgKGlzQnJvd3NlcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcyQxLl9rZXlib2FyZFNob3J0Y3V0cy5hdHRhY2goKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcyQxLl9yZXNpemVIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMkMS5fcG9zdFJlbmRlcigpO1xuICAgICAgICAgICAgdGhpcyQxLl9zaXplQ2hhbmdlZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMkMTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb3VsZCBub3Qgc3RhcnQgc2tldGNoLCB0aGUgYXN5bmMgbG9hZGluZyBmdW5jdGlvbiByZWplY3RlZCB3aXRoIGFuIGVycm9yOlxcbiAgICBFcnJvcjogJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBTa2V0Y2hNYW5hZ2VyLnByb3RvdHlwZSwgcHJvdG90eXBlQWNjZXNzb3JzICk7XG5cbiAgICB2YXIgQ0FDSEUgPSAnaG90LWlkLWNhY2hlJztcbiAgICB2YXIgcnVudGltZUNvbGxpc2lvbnMgPSBbXTtcbiAgICBmdW5jdGlvbiBpc0hvdFJlbG9hZCgpIHtcbiAgICAgICAgdmFyIGNsaWVudCA9IGdldENsaWVudEFQSSgpO1xuICAgICAgICByZXR1cm4gY2xpZW50ICYmIGNsaWVudC5ob3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FjaGVHZXQoaWQpIHtcbiAgICAgICAgdmFyIGNsaWVudCA9IGdldENsaWVudEFQSSgpO1xuICAgICAgICBpZiAoIWNsaWVudCkgXG4gICAgICAgICAgICB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICAgICAgY2xpZW50W0NBQ0hFXSA9IGNsaWVudFtDQUNIRV0gfHwge307XG4gICAgICAgIHJldHVybiBjbGllbnRbQ0FDSEVdW2lkXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWNoZVB1dChpZCwgZGF0YSkge1xuICAgICAgICB2YXIgY2xpZW50ID0gZ2V0Q2xpZW50QVBJKCk7XG4gICAgICAgIGlmICghY2xpZW50KSBcbiAgICAgICAgICAgIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgICAgICBjbGllbnRbQ0FDSEVdID0gY2xpZW50W0NBQ0hFXSB8fCB7fTtcbiAgICAgICAgY2xpZW50W0NBQ0hFXVtpZF0gPSBkYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRpbWVQcm9wKG9sZE1hbmFnZXIsIG5ld1NldHRpbmdzKSB7XG4gICAgICAgIHJldHVybiBuZXdTZXR0aW5ncy5hbmltYXRlID8ge1xuICAgICAgICAgICAgdGltZTogb2xkTWFuYWdlci5wcm9wcy50aW1lXG4gICAgICAgIH0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FudmFzU2tldGNoKHNrZXRjaCwgc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKCBzZXR0aW5ncyA9PT0gdm9pZCAwICkgc2V0dGluZ3MgPSB7fTtcblxuICAgICAgICBpZiAoc2V0dGluZ3MucDUpIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5jYW52YXMgfHwgc2V0dGluZ3MuY29udGV4dCAmJiB0eXBlb2Ygc2V0dGluZ3MuY29udGV4dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbiB7IHA1IH0gbW9kZSwgeW91IGNhbid0IHBhc3MgeW91ciBvd24gY2FudmFzIG9yIGNvbnRleHQsIHVubGVzcyB0aGUgY29udGV4dCBpcyBhIFxcXCJ3ZWJnbFxcXCIgb3IgXFxcIjJkXFxcIiBzdHJpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHR5cGVvZiBzZXR0aW5ncy5jb250ZXh0ID09PSAnc3RyaW5nJyA/IHNldHRpbmdzLmNvbnRleHQgOiBmYWxzZTtcbiAgICAgICAgICAgIHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgc2V0dGluZ3MsIHtcbiAgICAgICAgICAgICAgICBjYW52YXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpc0hvdCA9IGlzSG90UmVsb2FkKCk7XG4gICAgICAgIHZhciBob3RJRDtcbiAgICAgICAgaWYgKGlzSG90KSB7XG4gICAgICAgICAgICBob3RJRCA9IGRlZmluZWQoc2V0dGluZ3MuaWQsICckX19ERUZBVUxUX0NBTlZBU19TS0VUQ0hfSURfXyQnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXNJbmplY3RpbmcgPSBpc0hvdCAmJiB0eXBlb2YgaG90SUQgPT09ICdzdHJpbmcnO1xuICAgICAgICBpZiAoaXNJbmplY3RpbmcgJiYgcnVudGltZUNvbGxpc2lvbnMuaW5jbHVkZXMoaG90SUQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBZb3UgaGF2ZSBtdWx0aXBsZSBjYWxscyB0byBjYW52YXNTa2V0Y2goKSBpbiAtLWhvdCBtb2RlLiBZb3UgbXVzdCBwYXNzIHVuaXF1ZSB7IGlkIH0gc3RyaW5ncyBpbiBzZXR0aW5ncyB0byBlbmFibGUgaG90IHJlbG9hZCBhY3Jvc3MgbXVsdGlwbGUgc2tldGNoZXMuIFwiLCBob3RJRCk7XG4gICAgICAgICAgICBpc0luamVjdGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcmVsb2FkID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIGlmIChpc0luamVjdGluZykge1xuICAgICAgICAgICAgcnVudGltZUNvbGxpc2lvbnMucHVzaChob3RJRCk7XG4gICAgICAgICAgICB2YXIgcHJldmlvdXNEYXRhID0gY2FjaGVHZXQoaG90SUQpO1xuICAgICAgICAgICAgaWYgKHByZXZpb3VzRGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3UHJvcHMgPSBnZXRUaW1lUHJvcChwcmV2aW91c0RhdGEubWFuYWdlciwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0RhdGEubWFuYWdlci5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdQcm9wcztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHByZWxvYWQgPSBwcmV2aW91c0RhdGEubG9hZC50aGVuKG5leHQpLmNhdGNoKG5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmVsb2FkLnRoZW4oZnVuY3Rpb24gKG5ld1Byb3BzKSB7XG4gICAgICAgICAgICB2YXIgbWFuYWdlciA9IG5ldyBTa2V0Y2hNYW5hZ2VyKCk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgICAgaWYgKHNrZXRjaCkge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgc2V0dGluZ3MsIG5ld1Byb3BzKTtcbiAgICAgICAgICAgICAgICBtYW5hZ2VyLnNldHVwKHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICBtYW5hZ2VyLm1vdW50KCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbWFuYWdlci5sb2FkQW5kUnVuKHNrZXRjaCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFByb21pc2UucmVzb2x2ZShtYW5hZ2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc0luamVjdGluZykge1xuICAgICAgICAgICAgICAgIGNhY2hlUHV0KGhvdElELCB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgbWFuYWdlcjogbWFuYWdlclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2FudmFzU2tldGNoLmNhbnZhc1NrZXRjaCA9IGNhbnZhc1NrZXRjaDtcbiAgICBjYW52YXNTa2V0Y2guUGFwZXJTaXplcyA9IHBhcGVyU2l6ZXM7XG5cbiAgICByZXR1cm4gY2FudmFzU2tldGNoO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lZMkZ1ZG1GekxYTnJaWFJqYUM1MWJXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpNHVMMjV2WkdWZmJXOWtkV3hsY3k5a1pXWnBibVZrTDJsdVpHVjRMbXB6SWl3aUxpNHZibTlrWlY5dGIyUjFiR1Z6TDI5aWFtVmpkQzFoYzNOcFoyNHZhVzVrWlhndWFuTWlMQ0l1TGk5dWIyUmxYMjF2WkhWc1pYTXZjbWxuYUhRdGJtOTNMMkp5YjNkelpYSXVhbk1pTENJdUxpOXViMlJsWDIxdlpIVnNaWE12YVhNdGNISnZiV2x6WlM5cGJtUmxlQzVxY3lJc0lpNHVMMjV2WkdWZmJXOWtkV3hsY3k5cGN5MWtiMjB2YVc1a1pYZ3Vhbk1pTENJdUxpOXNhV0l2ZFhScGJDNXFjeUlzSWk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlrWldWd0xXVnhkV0ZzTDJ4cFlpOXJaWGx6TG1weklpd2lMaTR2Ym05a1pWOXRiMlIxYkdWekwyUmxaWEF0WlhGMVlXd3ZiR2xpTDJselgyRnlaM1Z0Wlc1MGN5NXFjeUlzSWk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlrWldWd0xXVnhkV0ZzTDJsdVpHVjRMbXB6SWl3aUxpNHZibTlrWlY5dGIyUjFiR1Z6TDJSaGRHVm1iM0p0WVhRdmJHbGlMMlJoZEdWbWIzSnRZWFF1YW5NaUxDSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmNtVndaV0YwTFhOMGNtbHVaeTlwYm1SbGVDNXFjeUlzSWk0dUwyNXZaR1ZmYlc5a2RXeGxjeTl3WVdRdGJHVm1kQzlwYm1SbGVDNXFjeUlzSWk0dUwyeHBZaTl6WVhabExtcHpJaXdpTGk0dmJHbGlMMk52Y21VdmEyVjVZbTloY21SVGFHOXlkR04xZEhNdWFuTWlMQ0l1TGk5c2FXSXZjR0Z3WlhJdGMybDZaWE11YW5NaUxDSXVMaTlzYVdJdlpHbHpkR0Z1WTJWekxtcHpJaXdpTGk0dmJHbGlMMk52Y21VdmNtVnphWHBsUTJGdWRtRnpMbXB6SWl3aUxpNHZibTlrWlY5dGIyUjFiR1Z6TDJkbGRDMWpZVzUyWVhNdFkyOXVkR1Y0ZEM5cGJtUmxlQzVxY3lJc0lpNHVMMnhwWWk5amIzSmxMMk55WldGMFpVTmhiblpoY3k1cWN5SXNJaTR1TDJ4cFlpOWpiM0psTDFOclpYUmphRTFoYm1GblpYSXVhbk1pTENJdUxpOXNhV0l2WTJGdWRtRnpMWE5yWlhSamFDNXFjeUpkTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCbWIzSWdLSFpoY2lCcElEMGdNRHNnYVNBOElHRnlaM1Z0Wlc1MGN5NXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnSUNCcFppQW9ZWEpuZFcxbGJuUnpXMmxkSUNFOVBTQjFibVJsWm1sdVpXUXBJSEpsZEhWeWJpQmhjbWQxYldWdWRITmJhVjA3WEc0Z0lDQWdmVnh1ZlR0Y2JpSXNJaThxWEc1dlltcGxZM1F0WVhOemFXZHVYRzRvWXlrZ1UybHVaSEpsSUZOdmNtaDFjMXh1UUd4cFkyVnVjMlVnVFVsVVhHNHFMMXh1WEc0bmRYTmxJSE4wY21samRDYzdYRzR2S2lCbGMyeHBiblF0WkdsellXSnNaU0J1YnkxMWJuVnpaV1F0ZG1GeWN5QXFMMXh1ZG1GeUlHZGxkRTkzYmxCeWIzQmxjblI1VTNsdFltOXNjeUE5SUU5aWFtVmpkQzVuWlhSUGQyNVFjbTl3WlhKMGVWTjViV0p2YkhNN1hHNTJZWElnYUdGelQzZHVVSEp2Y0dWeWRIa2dQU0JQWW1wbFkzUXVjSEp2ZEc5MGVYQmxMbWhoYzA5M2JsQnliM0JsY25SNU8xeHVkbUZ5SUhCeWIzQkpjMFZ1ZFcxbGNtRmliR1VnUFNCUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG5CeWIzQmxjblI1U1hORmJuVnRaWEpoWW14bE8xeHVYRzVtZFc1amRHbHZiaUIwYjA5aWFtVmpkQ2gyWVd3cElIdGNibHgwYVdZZ0tIWmhiQ0E5UFQwZ2JuVnNiQ0I4ZkNCMllXd2dQVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVYSFJjZEhSb2NtOTNJRzVsZHlCVWVYQmxSWEp5YjNJb0owOWlhbVZqZEM1aGMzTnBaMjRnWTJGdWJtOTBJR0psSUdOaGJHeGxaQ0IzYVhSb0lHNTFiR3dnYjNJZ2RXNWtaV1pwYm1Wa0p5azdYRzVjZEgxY2JseHVYSFJ5WlhSMWNtNGdUMkpxWldOMEtIWmhiQ2s3WEc1OVhHNWNibVoxYm1OMGFXOXVJSE5vYjNWc1pGVnpaVTVoZEdsMlpTZ3BJSHRjYmx4MGRISjVJSHRjYmx4MFhIUnBaaUFvSVU5aWFtVmpkQzVoYzNOcFoyNHBJSHRjYmx4MFhIUmNkSEpsZEhWeWJpQm1ZV3h6WlR0Y2JseDBYSFI5WEc1Y2JseDBYSFF2THlCRVpYUmxZM1FnWW5Wbloza2djSEp2Y0dWeWRIa2daVzUxYldWeVlYUnBiMjRnYjNKa1pYSWdhVzRnYjJ4a1pYSWdWamdnZG1WeWMybHZibk11WEc1Y2JseDBYSFF2THlCb2RIUndjem92TDJKMVozTXVZMmh5YjIxcGRXMHViM0puTDNBdmRqZ3ZhWE56ZFdWekwyUmxkR0ZwYkQ5cFpEMDBNVEU0WEc1Y2RGeDBkbUZ5SUhSbGMzUXhJRDBnYm1WM0lGTjBjbWx1WnlnbllXSmpKeWs3SUNBdkx5QmxjMnhwYm5RdFpHbHpZV0pzWlMxc2FXNWxJRzV2TFc1bGR5MTNjbUZ3Y0dWeWMxeHVYSFJjZEhSbGMzUXhXelZkSUQwZ0oyUmxKenRjYmx4MFhIUnBaaUFvVDJKcVpXTjBMbWRsZEU5M2JsQnliM0JsY25SNVRtRnRaWE1vZEdWemRERXBXekJkSUQwOVBTQW5OU2NwSUh0Y2JseDBYSFJjZEhKbGRIVnliaUJtWVd4elpUdGNibHgwWEhSOVhHNWNibHgwWEhRdkx5Qm9kSFJ3Y3pvdkwySjFaM011WTJoeWIyMXBkVzB1YjNKbkwzQXZkamd2YVhOemRXVnpMMlJsZEdGcGJEOXBaRDB6TURVMlhHNWNkRngwZG1GeUlIUmxjM1F5SUQwZ2UzMDdYRzVjZEZ4MFptOXlJQ2gyWVhJZ2FTQTlJREE3SUdrZ1BDQXhNRHNnYVNzcktTQjdYRzVjZEZ4MFhIUjBaWE4wTWxzblh5Y2dLeUJUZEhKcGJtY3Vabkp2YlVOb1lYSkRiMlJsS0drcFhTQTlJR2s3WEc1Y2RGeDBmVnh1WEhSY2RIWmhjaUJ2Y21SbGNqSWdQU0JQWW1wbFkzUXVaMlYwVDNkdVVISnZjR1Z5ZEhsT1lXMWxjeWgwWlhOME1pa3ViV0Z3S0daMWJtTjBhVzl1SUNodUtTQjdYRzVjZEZ4MFhIUnlaWFIxY200Z2RHVnpkREpiYmwwN1hHNWNkRngwZlNrN1hHNWNkRngwYVdZZ0tHOXlaR1Z5TWk1cWIybHVLQ2NuS1NBaFBUMGdKekF4TWpNME5UWTNPRGtuS1NCN1hHNWNkRngwWEhSeVpYUjFjbTRnWm1Gc2MyVTdYRzVjZEZ4MGZWeHVYRzVjZEZ4MEx5OGdhSFIwY0hNNkx5OWlkV2R6TG1Ob2NtOXRhWFZ0TG05eVp5OXdMM1k0TDJsemMzVmxjeTlrWlhSaGFXdy9hV1E5TXpBMU5seHVYSFJjZEhaaGNpQjBaWE4wTXlBOUlIdDlPMXh1WEhSY2RDZGhZbU5rWldabmFHbHFhMnh0Ym05d2NYSnpkQ2N1YzNCc2FYUW9KeWNwTG1admNrVmhZMmdvWm5WdVkzUnBiMjRnS0d4bGRIUmxjaWtnZTF4dVhIUmNkRngwZEdWemRETmJiR1YwZEdWeVhTQTlJR3hsZEhSbGNqdGNibHgwWEhSOUtUdGNibHgwWEhScFppQW9UMkpxWldOMExtdGxlWE1vVDJKcVpXTjBMbUZ6YzJsbmJpaDdmU3dnZEdWemRETXBLUzVxYjJsdUtDY25LU0FoUFQxY2JseDBYSFJjZEZ4MEoyRmlZMlJsWm1kb2FXcHJiRzF1YjNCeGNuTjBKeWtnZTF4dVhIUmNkRngwY21WMGRYSnVJR1poYkhObE8xeHVYSFJjZEgxY2JseHVYSFJjZEhKbGRIVnliaUIwY25WbE8xeHVYSFI5SUdOaGRHTm9JQ2hsY25JcElIdGNibHgwWEhRdkx5QlhaU0JrYjI0bmRDQmxlSEJsWTNRZ1lXNTVJRzltSUhSb1pTQmhZbTkyWlNCMGJ5QjBhSEp2ZHl3Z1luVjBJR0psZEhSbGNpQjBieUJpWlNCellXWmxMbHh1WEhSY2RISmxkSFZ5YmlCbVlXeHpaVHRjYmx4MGZWeHVmVnh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhOb2IzVnNaRlZ6WlU1aGRHbDJaU2dwSUQ4Z1QySnFaV04wTG1GemMybG5iaUE2SUdaMWJtTjBhVzl1SUNoMFlYSm5aWFFzSUhOdmRYSmpaU2tnZTF4dVhIUjJZWElnWm5KdmJUdGNibHgwZG1GeUlIUnZJRDBnZEc5UFltcGxZM1FvZEdGeVoyVjBLVHRjYmx4MGRtRnlJSE41YldKdmJITTdYRzVjYmx4MFptOXlJQ2gyWVhJZ2N5QTlJREU3SUhNZ1BDQmhjbWQxYldWdWRITXViR1Z1WjNSb095QnpLeXNwSUh0Y2JseDBYSFJtY205dElEMGdUMkpxWldOMEtHRnlaM1Z0Wlc1MGMxdHpYU2s3WEc1Y2JseDBYSFJtYjNJZ0tIWmhjaUJyWlhrZ2FXNGdabkp2YlNrZ2UxeHVYSFJjZEZ4MGFXWWdLR2hoYzA5M2JsQnliM0JsY25SNUxtTmhiR3dvWm5KdmJTd2dhMlY1S1NrZ2UxeHVYSFJjZEZ4MFhIUjBiMXRyWlhsZElEMGdabkp2YlZ0clpYbGRPMXh1WEhSY2RGeDBmVnh1WEhSY2RIMWNibHh1WEhSY2RHbG1JQ2huWlhSUGQyNVFjbTl3WlhKMGVWTjViV0p2YkhNcElIdGNibHgwWEhSY2RITjViV0p2YkhNZ1BTQm5aWFJQZDI1UWNtOXdaWEowZVZONWJXSnZiSE1vWm5KdmJTazdYRzVjZEZ4MFhIUm1iM0lnS0haaGNpQnBJRDBnTURzZ2FTQThJSE41YldKdmJITXViR1Z1WjNSb095QnBLeXNwSUh0Y2JseDBYSFJjZEZ4MGFXWWdLSEJ5YjNCSmMwVnVkVzFsY21GaWJHVXVZMkZzYkNobWNtOXRMQ0J6ZVcxaWIyeHpXMmxkS1NrZ2UxeHVYSFJjZEZ4MFhIUmNkSFJ2VzNONWJXSnZiSE5iYVYxZElEMGdabkp2YlZ0emVXMWliMnh6VzJsZFhUdGNibHgwWEhSY2RGeDBmVnh1WEhSY2RGeDBmVnh1WEhSY2RIMWNibHgwZlZ4dVhHNWNkSEpsZEhWeWJpQjBienRjYm4wN1hHNGlMQ0p0YjJSMWJHVXVaWGh3YjNKMGN5QTlYRzRnSUdkc2IySmhiQzV3WlhKbWIzSnRZVzVqWlNBbUpseHVJQ0JuYkc5aVlXd3VjR1Z5Wm05eWJXRnVZMlV1Ym05M0lEOGdablZ1WTNScGIyNGdibTkzS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUJ3WlhKbWIzSnRZVzVqWlM1dWIzY29LVnh1SUNCOUlEb2dSR0YwWlM1dWIzY2dmSHdnWm5WdVkzUnBiMjRnYm05M0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBcmJtVjNJRVJoZEdWY2JpQWdmVnh1SWl3aWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCcGMxQnliMjFwYzJVN1hHNWNibVoxYm1OMGFXOXVJR2x6VUhKdmJXbHpaU2h2WW1vcElIdGNiaUFnY21WMGRYSnVJQ0VoYjJKcUlDWW1JQ2gwZVhCbGIyWWdiMkpxSUQwOVBTQW5iMkpxWldOMEp5QjhmQ0IwZVhCbGIyWWdiMkpxSUQwOVBTQW5ablZ1WTNScGIyNG5LU0FtSmlCMGVYQmxiMllnYjJKcUxuUm9aVzRnUFQwOUlDZG1kVzVqZEdsdmJpYzdYRzU5WEc0aUxDSnRiMlIxYkdVdVpYaHdiM0owY3lBOUlHbHpUbTlrWlZ4dVhHNW1kVzVqZEdsdmJpQnBjMDV2WkdVZ0tIWmhiQ2tnZTF4dUlDQnlaWFIxY200Z0tDRjJZV3dnZkh3Z2RIbHdaVzltSUhaaGJDQWhQVDBnSjI5aWFtVmpkQ2NwWEc0Z0lDQWdQeUJtWVd4elpWeHVJQ0FnSURvZ0tIUjVjR1Z2WmlCM2FXNWtiM2NnUFQwOUlDZHZZbXBsWTNRbklDWW1JSFI1Y0dWdlppQjNhVzVrYjNjdVRtOWtaU0E5UFQwZ0oyOWlhbVZqZENjcFhHNGdJQ0FnSUNBL0lDaDJZV3dnYVc1emRHRnVZMlZ2WmlCM2FXNWtiM2N1VG05a1pTbGNiaUFnSUNBZ0lEb2dLSFI1Y0dWdlppQjJZV3d1Ym05a1pWUjVjR1VnUFQwOUlDZHVkVzFpWlhJbktTQW1KbHh1SUNBZ0lDQWdJQ0FvZEhsd1pXOW1JSFpoYkM1dWIyUmxUbUZ0WlNBOVBUMGdKM04wY21sdVp5Y3BYRzU5WEc0aUxDSXZMeUJVVDBSUE9pQlhaU0JqWVc0Z2NtVnRiM1psSUdFZ2FIVm5aU0JqYUhWdWF5QnZaaUJpZFc1a2JHVWdjMmw2WlNCaWVTQjFjMmx1WnlCaElITnRZV3hzWlhKY2JpOHZJSFYwYVd4cGRIa2diVzlrZFd4bElHWnZjaUJqYjI1MlpYSjBhVzVuSUhWdWFYUnpMbHh1YVcxd2IzSjBJR2x6UkU5TklHWnliMjBnSjJsekxXUnZiU2M3WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCblpYUkRiR2xsYm5SQlVFa2dLQ2tnZTF4dUlDQnlaWFIxY200Z2RIbHdaVzltSUhkcGJtUnZkeUFoUFQwZ0ozVnVaR1ZtYVc1bFpDY2dKaVlnZDJsdVpHOTNXeWRqWVc1MllYTXRjMnRsZEdOb0xXTnNhU2RkTzF4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdhWE5DY205M2MyVnlJQ2dwSUh0Y2JpQWdjbVYwZFhKdUlIUjVjR1Z2WmlCa2IyTjFiV1Z1ZENBaFBUMGdKM1Z1WkdWbWFXNWxaQ2M3WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnBjMWRsWWtkTVEyOXVkR1Y0ZENBb1kzUjRLU0I3WEc0Z0lISmxkSFZ5YmlCMGVYQmxiMllnWTNSNExtTnNaV0Z5SUQwOVBTQW5ablZ1WTNScGIyNG5JQ1ltSUhSNWNHVnZaaUJqZEhndVkyeGxZWEpEYjJ4dmNpQTlQVDBnSjJaMWJtTjBhVzl1SnlBbUppQjBlWEJsYjJZZ1kzUjRMbUoxWm1abGNrUmhkR0VnUFQwOUlDZG1kVzVqZEdsdmJpYzdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCcGMwTmhiblpoY3lBb1pXeGxiV1Z1ZENrZ2UxeHVJQ0J5WlhSMWNtNGdhWE5FVDAwb1pXeGxiV1Z1ZENrZ0ppWWdMMk5oYm5aaGN5OXBMblJsYzNRb1pXeGxiV1Z1ZEM1dWIyUmxUbUZ0WlNrZ0ppWWdkSGx3Wlc5bUlHVnNaVzFsYm5RdVoyVjBRMjl1ZEdWNGRDQTlQVDBnSjJaMWJtTjBhVzl1Snp0Y2JuMWNiaUlzSW1WNGNHOXlkSE1nUFNCdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhSNWNHVnZaaUJQWW1wbFkzUXVhMlY1Y3lBOVBUMGdKMloxYm1OMGFXOXVKMXh1SUNBL0lFOWlhbVZqZEM1clpYbHpJRG9nYzJocGJUdGNibHh1Wlhod2IzSjBjeTV6YUdsdElEMGdjMmhwYlR0Y2JtWjFibU4wYVc5dUlITm9hVzBnS0c5aWFpa2dlMXh1SUNCMllYSWdhMlY1Y3lBOUlGdGRPMXh1SUNCbWIzSWdLSFpoY2lCclpYa2dhVzRnYjJKcUtTQnJaWGx6TG5CMWMyZ29hMlY1S1R0Y2JpQWdjbVYwZFhKdUlHdGxlWE03WEc1OVhHNGlMQ0oyWVhJZ2MzVndjRzl5ZEhOQmNtZDFiV1Z1ZEhORGJHRnpjeUE5SUNobWRXNWpkR2x2YmlncGUxeHVJQ0J5WlhSMWNtNGdUMkpxWldOMExuQnliM1J2ZEhsd1pTNTBiMU4wY21sdVp5NWpZV3hzS0dGeVozVnRaVzUwY3lsY2JuMHBLQ2tnUFQwZ0oxdHZZbXBsWTNRZ1FYSm5kVzFsYm5SelhTYzdYRzVjYm1WNGNHOXlkSE1nUFNCdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhOMWNIQnZjblJ6UVhKbmRXMWxiblJ6UTJ4aGMzTWdQeUJ6ZFhCd2IzSjBaV1FnT2lCMWJuTjFjSEJ2Y25SbFpEdGNibHh1Wlhod2IzSjBjeTV6ZFhCd2IzSjBaV1FnUFNCemRYQndiM0owWldRN1hHNW1kVzVqZEdsdmJpQnpkWEJ3YjNKMFpXUW9iMkpxWldOMEtTQjdYRzRnSUhKbGRIVnliaUJQWW1wbFkzUXVjSEp2ZEc5MGVYQmxMblJ2VTNSeWFXNW5MbU5oYkd3b2IySnFaV04wS1NBOVBTQW5XMjlpYW1WamRDQkJjbWQxYldWdWRITmRKenRjYm4wN1hHNWNibVY0Y0c5eWRITXVkVzV6ZFhCd2IzSjBaV1FnUFNCMWJuTjFjSEJ2Y25SbFpEdGNibVoxYm1OMGFXOXVJSFZ1YzNWd2NHOXlkR1ZrS0c5aWFtVmpkQ2w3WEc0Z0lISmxkSFZ5YmlCdlltcGxZM1FnSmlaY2JpQWdJQ0IwZVhCbGIyWWdiMkpxWldOMElEMDlJQ2R2WW1wbFkzUW5JQ1ltWEc0Z0lDQWdkSGx3Wlc5bUlHOWlhbVZqZEM1c1pXNW5kR2dnUFQwZ0oyNTFiV0psY2ljZ0ppWmNiaUFnSUNCUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG1oaGMwOTNibEJ5YjNCbGNuUjVMbU5oYkd3b2IySnFaV04wTENBblkyRnNiR1ZsSnlrZ0ppWmNiaUFnSUNBaFQySnFaV04wTG5CeWIzUnZkSGx3WlM1d2NtOXdaWEowZVVselJXNTFiV1Z5WVdKc1pTNWpZV3hzS0c5aWFtVmpkQ3dnSjJOaGJHeGxaU2NwSUh4OFhHNGdJQ0FnWm1Gc2MyVTdYRzU5TzF4dUlpd2lkbUZ5SUhCVGJHbGpaU0E5SUVGeWNtRjVMbkJ5YjNSdmRIbHdaUzV6YkdsalpUdGNiblpoY2lCdlltcGxZM1JMWlhseklEMGdjbVZ4ZFdseVpTZ25MaTlzYVdJdmEyVjVjeTVxY3ljcE8xeHVkbUZ5SUdselFYSm5kVzFsYm5SeklEMGdjbVZ4ZFdseVpTZ25MaTlzYVdJdmFYTmZZWEpuZFcxbGJuUnpMbXB6SnlrN1hHNWNiblpoY2lCa1pXVndSWEYxWVd3Z1BTQnRiMlIxYkdVdVpYaHdiM0owY3lBOUlHWjFibU4wYVc5dUlDaGhZM1IxWVd3c0lHVjRjR1ZqZEdWa0xDQnZjSFJ6S1NCN1hHNGdJR2xtSUNnaGIzQjBjeWtnYjNCMGN5QTlJSHQ5TzF4dUlDQXZMeUEzTGpFdUlFRnNiQ0JwWkdWdWRHbGpZV3dnZG1Gc2RXVnpJR0Z5WlNCbGNYVnBkbUZzWlc1MExDQmhjeUJrWlhSbGNtMXBibVZrSUdKNUlEMDlQUzVjYmlBZ2FXWWdLR0ZqZEhWaGJDQTlQVDBnWlhod1pXTjBaV1FwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkSEoxWlR0Y2JseHVJQ0I5SUdWc2MyVWdhV1lnS0dGamRIVmhiQ0JwYm5OMFlXNWpaVzltSUVSaGRHVWdKaVlnWlhod1pXTjBaV1FnYVc1emRHRnVZMlZ2WmlCRVlYUmxLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHRmpkSFZoYkM1blpYUlVhVzFsS0NrZ1BUMDlJR1Y0Y0dWamRHVmtMbWRsZEZScGJXVW9LVHRjYmx4dUlDQXZMeUEzTGpNdUlFOTBhR1Z5SUhCaGFYSnpJSFJvWVhRZ1pHOGdibTkwSUdKdmRHZ2djR0Z6Y3lCMGVYQmxiMllnZG1Gc2RXVWdQVDBnSjI5aWFtVmpkQ2NzWEc0Z0lDOHZJR1Z4ZFdsMllXeGxibU5sSUdseklHUmxkR1Z5YldsdVpXUWdZbmtnUFQwdVhHNGdJSDBnWld4elpTQnBaaUFvSVdGamRIVmhiQ0I4ZkNBaFpYaHdaV04wWldRZ2ZId2dkSGx3Wlc5bUlHRmpkSFZoYkNBaFBTQW5iMkpxWldOMEp5QW1KaUIwZVhCbGIyWWdaWGh3WldOMFpXUWdJVDBnSjI5aWFtVmpkQ2NwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdiM0IwY3k1emRISnBZM1FnUHlCaFkzUjFZV3dnUFQwOUlHVjRjR1ZqZEdWa0lEb2dZV04wZFdGc0lEMDlJR1Y0Y0dWamRHVmtPMXh1WEc0Z0lDOHZJRGN1TkM0Z1JtOXlJR0ZzYkNCdmRHaGxjaUJQWW1wbFkzUWdjR0ZwY25Nc0lHbHVZMngxWkdsdVp5QkJjbkpoZVNCdlltcGxZM1J6TENCbGNYVnBkbUZzWlc1alpTQnBjMXh1SUNBdkx5QmtaWFJsY20xcGJtVmtJR0o1SUdoaGRtbHVaeUIwYUdVZ2MyRnRaU0J1ZFcxaVpYSWdiMllnYjNkdVpXUWdjSEp2Y0dWeWRHbGxjeUFvWVhNZ2RtVnlhV1pwWldSY2JpQWdMeThnZDJsMGFDQlBZbXBsWTNRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1TG1OaGJHd3BMQ0IwYUdVZ2MyRnRaU0J6WlhRZ2IyWWdhMlY1YzF4dUlDQXZMeUFvWVd4MGFHOTFaMmdnYm05MElHNWxZMlZ6YzJGeWFXeDVJSFJvWlNCellXMWxJRzl5WkdWeUtTd2daWEYxYVhaaGJHVnVkQ0IyWVd4MVpYTWdabTl5SUdWMlpYSjVYRzRnSUM4dklHTnZjbkpsYzNCdmJtUnBibWNnYTJWNUxDQmhibVFnWVc0Z2FXUmxiblJwWTJGc0lDZHdjbTkwYjNSNWNHVW5JSEJ5YjNCbGNuUjVMaUJPYjNSbE9pQjBhR2x6WEc0Z0lDOHZJR0ZqWTI5MWJuUnpJR1p2Y2lCaWIzUm9JRzVoYldWa0lHRnVaQ0JwYm1SbGVHVmtJSEJ5YjNCbGNuUnBaWE1nYjI0Z1FYSnlZWGx6TGx4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUhKbGRIVnliaUJ2WW1wRmNYVnBkaWhoWTNSMVlXd3NJR1Y0Y0dWamRHVmtMQ0J2Y0hSektUdGNiaUFnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUJwYzFWdVpHVm1hVzVsWkU5eVRuVnNiQ2gyWVd4MVpTa2dlMXh1SUNCeVpYUjFjbTRnZG1Gc2RXVWdQVDA5SUc1MWJHd2dmSHdnZG1Gc2RXVWdQVDA5SUhWdVpHVm1hVzVsWkR0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnYVhOQ2RXWm1aWElnS0hncElIdGNiaUFnYVdZZ0tDRjRJSHg4SUhSNWNHVnZaaUI0SUNFOVBTQW5iMkpxWldOMEp5QjhmQ0IwZVhCbGIyWWdlQzVzWlc1bmRHZ2dJVDA5SUNkdWRXMWlaWEluS1NCeVpYUjFjbTRnWm1Gc2MyVTdYRzRnSUdsbUlDaDBlWEJsYjJZZ2VDNWpiM0I1SUNFOVBTQW5ablZ1WTNScGIyNG5JSHg4SUhSNWNHVnZaaUI0TG5Oc2FXTmxJQ0U5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNCOVhHNGdJR2xtSUNoNExteGxibWQwYUNBK0lEQWdKaVlnZEhsd1pXOW1JSGhiTUYwZ0lUMDlJQ2R1ZFcxaVpYSW5LU0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJSEpsZEhWeWJpQjBjblZsTzF4dWZWeHVYRzVtZFc1amRHbHZiaUJ2WW1wRmNYVnBkaWhoTENCaUxDQnZjSFJ6S1NCN1hHNGdJSFpoY2lCcExDQnJaWGs3WEc0Z0lHbG1JQ2hwYzFWdVpHVm1hVzVsWkU5eVRuVnNiQ2hoS1NCOGZDQnBjMVZ1WkdWbWFXNWxaRTl5VG5Wc2JDaGlLU2xjYmlBZ0lDQnlaWFIxY200Z1ptRnNjMlU3WEc0Z0lDOHZJR0Z1SUdsa1pXNTBhV05oYkNBbmNISnZkRzkwZVhCbEp5QndjbTl3WlhKMGVTNWNiaUFnYVdZZ0tHRXVjSEp2ZEc5MGVYQmxJQ0U5UFNCaUxuQnliM1J2ZEhsd1pTa2djbVYwZFhKdUlHWmhiSE5sTzF4dUlDQXZMMzUrZmtrbmRtVWdiV0Z1WVdkbFpDQjBieUJpY21WaGF5QlBZbXBsWTNRdWEyVjVjeUIwYUhKdmRXZG9JSE5qY21WM2VTQmhjbWQxYldWdWRITWdjR0Z6YzJsdVp5NWNiaUFnTHk4Z0lDQkRiMjUyWlhKMGFXNW5JSFJ2SUdGeWNtRjVJSE52YkhabGN5QjBhR1VnY0hKdllteGxiUzVjYmlBZ2FXWWdLR2x6UVhKbmRXMWxiblJ6S0dFcEtTQjdYRzRnSUNBZ2FXWWdLQ0ZwYzBGeVozVnRaVzUwY3loaUtTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQWdJSDFjYmlBZ0lDQmhJRDBnY0ZOc2FXTmxMbU5oYkd3b1lTazdYRzRnSUNBZ1lpQTlJSEJUYkdsalpTNWpZV3hzS0dJcE8xeHVJQ0FnSUhKbGRIVnliaUJrWldWd1JYRjFZV3dvWVN3Z1lpd2diM0IwY3lrN1hHNGdJSDFjYmlBZ2FXWWdLR2x6UW5WbVptVnlLR0VwS1NCN1hHNGdJQ0FnYVdZZ0tDRnBjMEoxWm1abGNpaGlLU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0FnSUgxY2JpQWdJQ0JwWmlBb1lTNXNaVzVuZEdnZ0lUMDlJR0l1YkdWdVozUm9LU0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJQ0FnWm05eUlDaHBJRDBnTURzZ2FTQThJR0V1YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNBZ0lHbG1JQ2hoVzJsZElDRTlQU0JpVzJsZEtTQnlaWFIxY200Z1ptRnNjMlU3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCMGNuVmxPMXh1SUNCOVhHNGdJSFJ5ZVNCN1hHNGdJQ0FnZG1GeUlHdGhJRDBnYjJKcVpXTjBTMlY1Y3loaEtTeGNiaUFnSUNBZ0lDQWdhMklnUFNCdlltcGxZM1JMWlhsektHSXBPMXh1SUNCOUlHTmhkR05vSUNobEtTQjdMeTlvWVhCd1pXNXpJSGRvWlc0Z2IyNWxJR2x6SUdFZ2MzUnlhVzVuSUd4cGRHVnlZV3dnWVc1a0lIUm9aU0J2ZEdobGNpQnBjMjRuZEZ4dUlDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdmVnh1SUNBdkx5Qm9ZWFpwYm1jZ2RHaGxJSE5oYldVZ2JuVnRZbVZ5SUc5bUlHOTNibVZrSUhCeWIzQmxjblJwWlhNZ0tHdGxlWE1nYVc1amIzSndiM0poZEdWelhHNGdJQzh2SUdoaGMwOTNibEJ5YjNCbGNuUjVLVnh1SUNCcFppQW9hMkV1YkdWdVozUm9JQ0U5SUd0aUxteGxibWQwYUNsY2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJQzh2ZEdobElITmhiV1VnYzJWMElHOW1JR3RsZVhNZ0tHRnNkR2h2ZFdkb0lHNXZkQ0J1WldObGMzTmhjbWxzZVNCMGFHVWdjMkZ0WlNCdmNtUmxjaWtzWEc0Z0lHdGhMbk52Y25Rb0tUdGNiaUFnYTJJdWMyOXlkQ2dwTzF4dUlDQXZMMzUrZm1Ob1pXRndJR3RsZVNCMFpYTjBYRzRnSUdadmNpQW9hU0E5SUd0aExteGxibWQwYUNBdElERTdJR2tnUGowZ01Ec2dhUzB0S1NCN1hHNGdJQ0FnYVdZZ0tHdGhXMmxkSUNFOUlHdGlXMmxkS1Z4dUlDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0I5WEc0Z0lDOHZaWEYxYVhaaGJHVnVkQ0IyWVd4MVpYTWdabTl5SUdWMlpYSjVJR052Y25KbGMzQnZibVJwYm1jZ2EyVjVMQ0JoYm1SY2JpQWdMeTkrZm41d2IzTnphV0pzZVNCbGVIQmxibk5wZG1VZ1pHVmxjQ0IwWlhOMFhHNGdJR1p2Y2lBb2FTQTlJR3RoTG14bGJtZDBhQ0F0SURFN0lHa2dQajBnTURzZ2FTMHRLU0I3WEc0Z0lDQWdhMlY1SUQwZ2EyRmJhVjA3WEc0Z0lDQWdhV1lnS0NGa1pXVndSWEYxWVd3b1lWdHJaWGxkTENCaVcydGxlVjBzSUc5d2RITXBLU0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJSDFjYmlBZ2NtVjBkWEp1SUhSNWNHVnZaaUJoSUQwOVBTQjBlWEJsYjJZZ1lqdGNibjFjYmlJc0lpOHFYRzRnS2lCRVlYUmxJRVp2Y20xaGRDQXhMakl1TTF4dUlDb2dLR01wSURJd01EY3RNakF3T1NCVGRHVjJaVzRnVEdWMmFYUm9ZVzRnUEhOMFpYWmxibXhsZG1sMGFHRnVMbU52YlQ1Y2JpQXFJRTFKVkNCc2FXTmxibk5sWEc0Z0tseHVJQ29nU1c1amJIVmtaWE1nWlc1b1lXNWpaVzFsYm5SeklHSjVJRk5qYjNSMElGUnlaVzVrWVNBOGMyTnZkSFF1ZEhKbGJtUmhMbTVsZEQ1Y2JpQXFJR0Z1WkNCTGNtbHpJRXR2ZDJGc0lEeGphWGhoY2k1amIyMHZmbXR5YVhNdWEyOTNZV3d2UGx4dUlDcGNiaUFxSUVGalkyVndkSE1nWVNCa1lYUmxMQ0JoSUcxaGMyc3NJRzl5SUdFZ1pHRjBaU0JoYm1RZ1lTQnRZWE5yTGx4dUlDb2dVbVYwZFhKdWN5QmhJR1p2Y20xaGRIUmxaQ0IyWlhKemFXOXVJRzltSUhSb1pTQm5hWFpsYmlCa1lYUmxMbHh1SUNvZ1ZHaGxJR1JoZEdVZ1pHVm1ZWFZzZEhNZ2RHOGdkR2hsSUdOMWNuSmxiblFnWkdGMFpTOTBhVzFsTGx4dUlDb2dWR2hsSUcxaGMyc2daR1ZtWVhWc2RITWdkRzhnWkdGMFpVWnZjbTFoZEM1dFlYTnJjeTVrWldaaGRXeDBMbHh1SUNvdlhHNWNiaWhtZFc1amRHbHZiaWhuYkc5aVlXd3BJSHRjYmlBZ0ozVnpaU0J6ZEhKcFkzUW5PMXh1WEc0Z0lIWmhjaUJrWVhSbFJtOXliV0YwSUQwZ0tHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lDQWdkbUZ5SUhSdmEyVnVJRDBnTDJSN01TdzBmWHh0ZXpFc05IMThlWGtvUHpwNWVTay9mQ2hiU0doTmMxUjBYU2xjWERFL2ZGdE1iRzlUV2xkT1hYeGNJbHRlWENKZEtsd2lmQ2RiWGlkZEtpY3ZaenRjYmlBZ0lDQWdJSFpoY2lCMGFXMWxlbTl1WlNBOUlDOWNYR0lvUHpwYlVFMURSVUZkVzFORVVGMVVmQ2cvT2xCaFkybG1hV044VFc5MWJuUmhhVzU4UTJWdWRISmhiSHhGWVhOMFpYSnVmRUYwYkdGdWRHbGpLU0FvUHpwVGRHRnVaR0Z5Wkh4RVlYbHNhV2RvZEh4UWNtVjJZV2xzYVc1bktTQlVhVzFsZkNnL09rZE5WSHhWVkVNcEtEODZXeTByWFZ4Y1pIczBmU2svS1Z4Y1lpOW5PMXh1SUNBZ0lDQWdkbUZ5SUhScGJXVjZiMjVsUTJ4cGNDQTlJQzliWGkwclhGeGtRUzFhWFM5bk8xeHVJQ0JjYmlBZ0lDQWdJQzh2SUZKbFoyVjRaWE1nWVc1a0lITjFjSEJ2Y25ScGJtY2dablZ1WTNScGIyNXpJR0Z5WlNCallXTm9aV1FnZEdoeWIzVm5hQ0JqYkc5emRYSmxYRzRnSUNBZ0lDQnlaWFIxY200Z1puVnVZM1JwYjI0Z0tHUmhkR1VzSUcxaGMyc3NJSFYwWXl3Z1oyMTBLU0I3WEc0Z0lGeHVJQ0FnSUNBZ0lDQXZMeUJaYjNVZ1kyRnVKM1FnY0hKdmRtbGtaU0IxZEdNZ2FXWWdlVzkxSUhOcmFYQWdiM1JvWlhJZ1lYSm5jeUFvZFhObElIUm9aU0FuVlZSRE9pY2diV0Z6YXlCd2NtVm1hWGdwWEc0Z0lDQWdJQ0FnSUdsbUlDaGhjbWQxYldWdWRITXViR1Z1WjNSb0lEMDlQU0F4SUNZbUlHdHBibVJQWmloa1lYUmxLU0E5UFQwZ0ozTjBjbWx1WnljZ0ppWWdJUzljWEdRdkxuUmxjM1FvWkdGMFpTa3BJSHRjYmlBZ0lDQWdJQ0FnSUNCdFlYTnJJRDBnWkdGMFpUdGNiaUFnSUNBZ0lDQWdJQ0JrWVhSbElEMGdkVzVrWldacGJtVmtPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lGeHVJQ0FnSUNBZ0lDQmtZWFJsSUQwZ1pHRjBaU0I4ZkNCdVpYY2dSR0YwWlR0Y2JpQWdYRzRnSUNBZ0lDQWdJR2xtS0NFb1pHRjBaU0JwYm5OMFlXNWpaVzltSUVSaGRHVXBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1pHRjBaU0E5SUc1bGR5QkVZWFJsS0dSaGRHVXBPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lGeHVJQ0FnSUNBZ0lDQnBaaUFvYVhOT1lVNG9aR0YwWlNrcElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUhKdmR5QlVlWEJsUlhKeWIzSW9KMGx1ZG1Gc2FXUWdaR0YwWlNjcE8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUZ4dUlDQWdJQ0FnSUNCdFlYTnJJRDBnVTNSeWFXNW5LR1JoZEdWR2IzSnRZWFF1YldGemEzTmJiV0Z6YTEwZ2ZId2diV0Z6YXlCOGZDQmtZWFJsUm05eWJXRjBMbTFoYzJ0eld5ZGtaV1poZFd4MEoxMHBPMXh1SUNCY2JpQWdJQ0FnSUNBZ0x5OGdRV3hzYjNjZ2MyVjBkR2x1WnlCMGFHVWdkWFJqTDJkdGRDQmhjbWQxYldWdWRDQjJhV0VnZEdobElHMWhjMnRjYmlBZ0lDQWdJQ0FnZG1GeUlHMWhjMnRUYkdsalpTQTlJRzFoYzJzdWMyeHBZMlVvTUN3Z05DazdYRzRnSUNBZ0lDQWdJR2xtSUNodFlYTnJVMnhwWTJVZ1BUMDlJQ2RWVkVNNkp5QjhmQ0J0WVhOclUyeHBZMlVnUFQwOUlDZEhUVlE2SnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJRzFoYzJzZ1BTQnRZWE5yTG5Oc2FXTmxLRFFwTzF4dUlDQWdJQ0FnSUNBZ0lIVjBZeUE5SUhSeWRXVTdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHMWhjMnRUYkdsalpTQTlQVDBnSjBkTlZEb25LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQm5iWFFnUFNCMGNuVmxPMXh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0JjYmlBZ0lDQWdJQ0FnZG1GeUlGOGdQU0IxZEdNZ1B5QW5aMlYwVlZSREp5QTZJQ2RuWlhRbk8xeHVJQ0FnSUNBZ0lDQjJZWElnWkNBOUlHUmhkR1ZiWHlBcklDZEVZWFJsSjEwb0tUdGNiaUFnSUNBZ0lDQWdkbUZ5SUVRZ1BTQmtZWFJsVzE4Z0t5QW5SR0Y1SjEwb0tUdGNiaUFnSUNBZ0lDQWdkbUZ5SUcwZ1BTQmtZWFJsVzE4Z0t5QW5UVzl1ZEdnblhTZ3BPMXh1SUNBZ0lDQWdJQ0IyWVhJZ2VTQTlJR1JoZEdWYlh5QXJJQ2RHZFd4c1dXVmhjaWRkS0NrN1hHNGdJQ0FnSUNBZ0lIWmhjaUJJSUQwZ1pHRjBaVnRmSUNzZ0owaHZkWEp6SjEwb0tUdGNiaUFnSUNBZ0lDQWdkbUZ5SUUwZ1BTQmtZWFJsVzE4Z0t5QW5UV2x1ZFhSbGN5ZGRLQ2s3WEc0Z0lDQWdJQ0FnSUhaaGNpQnpJRDBnWkdGMFpWdGZJQ3NnSjFObFkyOXVaSE1uWFNncE8xeHVJQ0FnSUNBZ0lDQjJZWElnVENBOUlHUmhkR1ZiWHlBcklDZE5hV3hzYVhObFkyOXVaSE1uWFNncE8xeHVJQ0FnSUNBZ0lDQjJZWElnYnlBOUlIVjBZeUEvSURBZ09pQmtZWFJsTG1kbGRGUnBiV1Y2YjI1bFQyWm1jMlYwS0NrN1hHNGdJQ0FnSUNBZ0lIWmhjaUJYSUQwZ1oyVjBWMlZsYXloa1lYUmxLVHRjYmlBZ0lDQWdJQ0FnZG1GeUlFNGdQU0JuWlhSRVlYbFBabGRsWldzb1pHRjBaU2s3WEc0Z0lDQWdJQ0FnSUhaaGNpQm1iR0ZuY3lBOUlIdGNiaUFnSUNBZ0lDQWdJQ0JrT2lBZ0lDQmtMRnh1SUNBZ0lDQWdJQ0FnSUdSa09pQWdJSEJoWkNoa0tTeGNiaUFnSUNBZ0lDQWdJQ0JrWkdRNklDQmtZWFJsUm05eWJXRjBMbWt4T0c0dVpHRjVUbUZ0WlhOYlJGMHNYRzRnSUNBZ0lDQWdJQ0FnWkdSa1pEb2daR0YwWlVadmNtMWhkQzVwTVRodUxtUmhlVTVoYldWelcwUWdLeUEzWFN4Y2JpQWdJQ0FnSUNBZ0lDQnRPaUFnSUNCdElDc2dNU3hjYmlBZ0lDQWdJQ0FnSUNCdGJUb2dJQ0J3WVdRb2JTQXJJREVwTEZ4dUlDQWdJQ0FnSUNBZ0lHMXRiVG9nSUdSaGRHVkdiM0p0WVhRdWFURTRiaTV0YjI1MGFFNWhiV1Z6VzIxZExGeHVJQ0FnSUNBZ0lDQWdJRzF0YlcwNklHUmhkR1ZHYjNKdFlYUXVhVEU0Ymk1dGIyNTBhRTVoYldWelcyMGdLeUF4TWwwc1hHNGdJQ0FnSUNBZ0lDQWdlWGs2SUNBZ1UzUnlhVzVuS0hrcExuTnNhV05sS0RJcExGeHVJQ0FnSUNBZ0lDQWdJSGw1ZVhrNklIa3NYRzRnSUNBZ0lDQWdJQ0FnYURvZ0lDQWdTQ0FsSURFeUlIeDhJREV5TEZ4dUlDQWdJQ0FnSUNBZ0lHaG9PaUFnSUhCaFpDaElJQ1VnTVRJZ2ZId2dNVElwTEZ4dUlDQWdJQ0FnSUNBZ0lFZzZJQ0FnSUVnc1hHNGdJQ0FnSUNBZ0lDQWdTRWc2SUNBZ2NHRmtLRWdwTEZ4dUlDQWdJQ0FnSUNBZ0lFMDZJQ0FnSUUwc1hHNGdJQ0FnSUNBZ0lDQWdUVTA2SUNBZ2NHRmtLRTBwTEZ4dUlDQWdJQ0FnSUNBZ0lITTZJQ0FnSUhNc1hHNGdJQ0FnSUNBZ0lDQWdjM002SUNBZ2NHRmtLSE1wTEZ4dUlDQWdJQ0FnSUNBZ0lHdzZJQ0FnSUhCaFpDaE1MQ0F6S1N4Y2JpQWdJQ0FnSUNBZ0lDQk1PaUFnSUNCd1lXUW9UV0YwYUM1eWIzVnVaQ2hNSUM4Z01UQXBLU3hjYmlBZ0lDQWdJQ0FnSUNCME9pQWdJQ0JJSUR3Z01USWdQeUJrWVhSbFJtOXliV0YwTG1reE9HNHVkR2x0WlU1aGJXVnpXekJkSURvZ1pHRjBaVVp2Y20xaGRDNXBNVGh1TG5ScGJXVk9ZVzFsYzFzeFhTeGNiaUFnSUNBZ0lDQWdJQ0IwZERvZ0lDQklJRHdnTVRJZ1B5QmtZWFJsUm05eWJXRjBMbWt4T0c0dWRHbHRaVTVoYldWeld6SmRJRG9nWkdGMFpVWnZjbTFoZEM1cE1UaHVMblJwYldWT1lXMWxjMXN6WFN4Y2JpQWdJQ0FnSUNBZ0lDQlVPaUFnSUNCSUlEd2dNVElnUHlCa1lYUmxSbTl5YldGMExta3hPRzR1ZEdsdFpVNWhiV1Z6V3pSZElEb2daR0YwWlVadmNtMWhkQzVwTVRodUxuUnBiV1ZPWVcxbGMxczFYU3hjYmlBZ0lDQWdJQ0FnSUNCVVZEb2dJQ0JJSUR3Z01USWdQeUJrWVhSbFJtOXliV0YwTG1reE9HNHVkR2x0WlU1aGJXVnpXelpkSURvZ1pHRjBaVVp2Y20xaGRDNXBNVGh1TG5ScGJXVk9ZVzFsYzFzM1hTeGNiaUFnSUNBZ0lDQWdJQ0JhT2lBZ0lDQm5iWFFnUHlBblIwMVVKeUE2SUhWMFl5QS9JQ2RWVkVNbklEb2dLRk4wY21sdVp5aGtZWFJsS1M1dFlYUmphQ2gwYVcxbGVtOXVaU2tnZkh3Z1d5Y25YU2t1Y0c5d0tDa3VjbVZ3YkdGalpTaDBhVzFsZW05dVpVTnNhWEFzSUNjbktTeGNiaUFnSUNBZ0lDQWdJQ0J2T2lBZ0lDQW9ieUErSURBZ1B5QW5MU2NnT2lBbkt5Y3BJQ3NnY0dGa0tFMWhkR2d1Wm14dmIzSW9UV0YwYUM1aFluTW9ieWtnTHlBMk1Da2dLaUF4TURBZ0t5Qk5ZWFJvTG1GaWN5aHZLU0FsSURZd0xDQTBLU3hjYmlBZ0lDQWdJQ0FnSUNCVE9pQWdJQ0JiSjNSb0p5d2dKM04wSnl3Z0oyNWtKeXdnSjNKa0oxMWJaQ0FsSURFd0lENGdNeUEvSURBZ09pQW9aQ0FsSURFd01DQXRJR1FnSlNBeE1DQWhQU0F4TUNrZ0tpQmtJQ1VnTVRCZExGeHVJQ0FnSUNBZ0lDQWdJRmM2SUNBZ0lGY3NYRzRnSUNBZ0lDQWdJQ0FnVGpvZ0lDQWdUbHh1SUNBZ0lDQWdJQ0I5TzF4dUlDQmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHMWhjMnN1Y21Wd2JHRmpaU2gwYjJ0bGJpd2dablZ1WTNScGIyNGdLRzFoZEdOb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHMWhkR05vSUdsdUlHWnNZV2R6S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdabXhoWjNOYmJXRjBZMmhkTzF4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdiV0YwWTJndWMyeHBZMlVvTVN3Z2JXRjBZMmd1YkdWdVozUm9JQzBnTVNrN1hHNGdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdmVHRjYmlBZ0lDQjlLU2dwTzF4dVhHNGdJR1JoZEdWR2IzSnRZWFF1YldGemEzTWdQU0I3WEc0Z0lDQWdKMlJsWm1GMWJIUW5PaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDZGtaR1FnYlcxdElHUmtJSGw1ZVhrZ1NFZzZUVTA2YzNNbkxGeHVJQ0FnSUNkemFHOXlkRVJoZEdVbk9pQWdJQ0FnSUNBZ0lDQWdJQ0FuYlM5a0wzbDVKeXhjYmlBZ0lDQW5iV1ZrYVhWdFJHRjBaU2M2SUNBZ0lDQWdJQ0FnSUNBZ0oyMXRiU0JrTENCNWVYbDVKeXhjYmlBZ0lDQW5iRzl1WjBSaGRHVW5PaUFnSUNBZ0lDQWdJQ0FnSUNBZ0oyMXRiVzBnWkN3Z2VYbDVlU2NzWEc0Z0lDQWdKMloxYkd4RVlYUmxKem9nSUNBZ0lDQWdJQ0FnSUNBZ0lDZGtaR1JrTENCdGJXMXRJR1FzSUhsNWVYa25MRnh1SUNBZ0lDZHphRzl5ZEZScGJXVW5PaUFnSUNBZ0lDQWdJQ0FnSUNBbmFEcE5UU0JVVkNjc1hHNGdJQ0FnSjIxbFpHbDFiVlJwYldVbk9pQWdJQ0FnSUNBZ0lDQWdJQ2RvT2sxTk9uTnpJRlJVSnl4Y2JpQWdJQ0FuYkc5dVoxUnBiV1VuT2lBZ0lDQWdJQ0FnSUNBZ0lDQWdKMmc2VFUwNmMzTWdWRlFnV2ljc1hHNGdJQ0FnSjJsemIwUmhkR1VuT2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ2Q1ZVhsNUxXMXRMV1JrSnl4Y2JpQWdJQ0FuYVhOdlZHbHRaU2M2SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKMGhJT2sxTk9uTnpKeXhjYmlBZ0lDQW5hWE52UkdGMFpWUnBiV1VuT2lBZ0lDQWdJQ0FnSUNBZ0ozbDVlWGt0YlcwdFpHUmNYQ2RVWEZ3blNFZzZUVTA2YzNOdkp5eGNiaUFnSUNBbmFYTnZWWFJqUkdGMFpWUnBiV1VuT2lBZ0lDQWdJQ0FnSjFWVVF6cDVlWGw1TFcxdExXUmtYRnduVkZ4Y0owaElPazFOT25OelhGd25XbHhjSnljc1hHNGdJQ0FnSjJWNGNHbHlaWE5JWldGa1pYSkdiM0p0WVhRbk9pQWdJQ2RrWkdRc0lHUmtJRzF0YlNCNWVYbDVJRWhJT2sxTk9uTnpJRm9uWEc0Z0lIMDdYRzVjYmlBZ0x5OGdTVzUwWlhKdVlYUnBiMjVoYkdsNllYUnBiMjRnYzNSeWFXNW5jMXh1SUNCa1lYUmxSbTl5YldGMExta3hPRzRnUFNCN1hHNGdJQ0FnWkdGNVRtRnRaWE02SUZ0Y2JpQWdJQ0FnSUNkVGRXNG5MQ0FuVFc5dUp5d2dKMVIxWlNjc0lDZFhaV1FuTENBblZHaDFKeXdnSjBaeWFTY3NJQ2RUWVhRbkxGeHVJQ0FnSUNBZ0oxTjFibVJoZVNjc0lDZE5iMjVrWVhrbkxDQW5WSFZsYzJSaGVTY3NJQ2RYWldSdVpYTmtZWGtuTENBblZHaDFjbk5rWVhrbkxDQW5SbkpwWkdGNUp5d2dKMU5oZEhWeVpHRjVKMXh1SUNBZ0lGMHNYRzRnSUNBZ2JXOXVkR2hPWVcxbGN6b2dXMXh1SUNBZ0lDQWdKMHBoYmljc0lDZEdaV0luTENBblRXRnlKeXdnSjBGd2NpY3NJQ2ROWVhrbkxDQW5TblZ1Snl3Z0owcDFiQ2NzSUNkQmRXY25MQ0FuVTJWd0p5d2dKMDlqZENjc0lDZE9iM1luTENBblJHVmpKeXhjYmlBZ0lDQWdJQ2RLWVc1MVlYSjVKeXdnSjBabFluSjFZWEo1Snl3Z0owMWhjbU5vSnl3Z0owRndjbWxzSnl3Z0owMWhlU2NzSUNkS2RXNWxKeXdnSjBwMWJIa25MQ0FuUVhWbmRYTjBKeXdnSjFObGNIUmxiV0psY2ljc0lDZFBZM1J2WW1WeUp5d2dKMDV2ZG1WdFltVnlKeXdnSjBSbFkyVnRZbVZ5SjF4dUlDQWdJRjBzWEc0Z0lDQWdkR2x0WlU1aGJXVnpPaUJiWEc0Z0lDQWdJQ0FuWVNjc0lDZHdKeXdnSjJGdEp5d2dKM0J0Snl3Z0owRW5MQ0FuVUNjc0lDZEJUU2NzSUNkUVRTZGNiaUFnSUNCZFhHNGdJSDA3WEc1Y2JtWjFibU4wYVc5dUlIQmhaQ2gyWVd3c0lHeGxiaWtnZTF4dUlDQjJZV3dnUFNCVGRISnBibWNvZG1Gc0tUdGNiaUFnYkdWdUlEMGdiR1Z1SUh4OElESTdYRzRnSUhkb2FXeGxJQ2gyWVd3dWJHVnVaM1JvSUR3Z2JHVnVLU0I3WEc0Z0lDQWdkbUZzSUQwZ0p6QW5JQ3NnZG1Gc08xeHVJQ0I5WEc0Z0lISmxkSFZ5YmlCMllXdzdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1IyVjBJSFJvWlNCSlUwOGdPRFl3TVNCM1pXVnJJRzUxYldKbGNseHVJQ29nUW1GelpXUWdiMjRnWTI5dGJXVnVkSE1nWm5KdmJWeHVJQ29nYUhSMGNEb3ZMM1JsWTJoaWJHOW5MbkJ5YjJOMWNtbHZjeTV1YkM5ckwyNDJNVGd2Ym1WM2N5OTJhV1YzTHpNek56azJMekUwT0RZekwwTmhiR04xYkdGMFpTMUpVMDh0T0RZd01TMTNaV1ZyTFdGdVpDMTVaV0Z5TFdsdUxXcGhkbUZ6WTNKcGNIUXVhSFJ0YkZ4dUlDcGNiaUFxSUVCd1lYSmhiU0FnZTA5aWFtVmpkSDBnWUdSaGRHVmdYRzRnS2lCQWNtVjBkWEp1SUh0T2RXMWlaWEo5WEc0Z0tpOWNibVoxYm1OMGFXOXVJR2RsZEZkbFpXc29aR0YwWlNrZ2UxeHVJQ0F2THlCU1pXMXZkbVVnZEdsdFpTQmpiMjF3YjI1bGJuUnpJRzltSUdSaGRHVmNiaUFnZG1GeUlIUmhjbWRsZEZSb2RYSnpaR0Y1SUQwZ2JtVjNJRVJoZEdVb1pHRjBaUzVuWlhSR2RXeHNXV1ZoY2lncExDQmtZWFJsTG1kbGRFMXZiblJvS0Nrc0lHUmhkR1V1WjJWMFJHRjBaU2dwS1R0Y2JseHVJQ0F2THlCRGFHRnVaMlVnWkdGMFpTQjBieUJVYUhWeWMyUmhlU0J6WVcxbElIZGxaV3RjYmlBZ2RHRnlaMlYwVkdoMWNuTmtZWGt1YzJWMFJHRjBaU2gwWVhKblpYUlVhSFZ5YzJSaGVTNW5aWFJFWVhSbEtDa2dMU0FvS0hSaGNtZGxkRlJvZFhKelpHRjVMbWRsZEVSaGVTZ3BJQ3NnTmlrZ0pTQTNLU0FySURNcE8xeHVYRzRnSUM4dklGUmhhMlVnU21GdWRXRnllU0EwZEdnZ1lYTWdhWFFnYVhNZ1lXeDNZWGx6SUdsdUlIZGxaV3NnTVNBb2MyVmxJRWxUVHlBNE5qQXhLVnh1SUNCMllYSWdabWx5YzNSVWFIVnljMlJoZVNBOUlHNWxkeUJFWVhSbEtIUmhjbWRsZEZSb2RYSnpaR0Y1TG1kbGRFWjFiR3haWldGeUtDa3NJREFzSURRcE8xeHVYRzRnSUM4dklFTm9ZVzVuWlNCa1lYUmxJSFJ2SUZSb2RYSnpaR0Y1SUhOaGJXVWdkMlZsYTF4dUlDQm1hWEp6ZEZSb2RYSnpaR0Y1TG5ObGRFUmhkR1VvWm1seWMzUlVhSFZ5YzJSaGVTNW5aWFJFWVhSbEtDa2dMU0FvS0dacGNuTjBWR2gxY25Oa1lYa3VaMlYwUkdGNUtDa2dLeUEyS1NBbElEY3BJQ3NnTXlrN1hHNWNiaUFnTHk4Z1EyaGxZMnNnYVdZZ1pHRjViR2xuYUhRdGMyRjJhVzVuTFhScGJXVXRjM2RwZEdOb0lHOWpZM1Z5Y21Wa0lHRnVaQ0JqYjNKeVpXTjBJR1p2Y2lCcGRGeHVJQ0IyWVhJZ1pITWdQU0IwWVhKblpYUlVhSFZ5YzJSaGVTNW5aWFJVYVcxbGVtOXVaVTltWm5ObGRDZ3BJQzBnWm1seWMzUlVhSFZ5YzJSaGVTNW5aWFJVYVcxbGVtOXVaVTltWm5ObGRDZ3BPMXh1SUNCMFlYSm5aWFJVYUhWeWMyUmhlUzV6WlhSSWIzVnljeWgwWVhKblpYUlVhSFZ5YzJSaGVTNW5aWFJJYjNWeWN5Z3BJQzBnWkhNcE8xeHVYRzRnSUM4dklFNTFiV0psY2lCdlppQjNaV1ZyY3lCaVpYUjNaV1Z1SUhSaGNtZGxkQ0JVYUhWeWMyUmhlU0JoYm1RZ1ptbHljM1FnVkdoMWNuTmtZWGxjYmlBZ2RtRnlJSGRsWld0RWFXWm1JRDBnS0hSaGNtZGxkRlJvZFhKelpHRjVJQzBnWm1seWMzUlVhSFZ5YzJSaGVTa2dMeUFvT0RZME1EQXdNREFxTnlrN1hHNGdJSEpsZEhWeWJpQXhJQ3NnVFdGMGFDNW1iRzl2Y2loM1pXVnJSR2xtWmlrN1hHNTlYRzVjYmk4cUtseHVJQ29nUjJWMElFbFRUeTA0TmpBeElHNTFiV1Z5YVdNZ2NtVndjbVZ6Wlc1MFlYUnBiMjRnYjJZZ2RHaGxJR1JoZVNCdlppQjBhR1VnZDJWbGExeHVJQ29nTVNBb1ptOXlJRTF2Ym1SaGVTa2dkR2h5YjNWbmFDQTNJQ2htYjNJZ1UzVnVaR0Y1S1Z4dUlDb2dYRzRnS2lCQWNHRnlZVzBnSUh0UFltcGxZM1I5SUdCa1lYUmxZRnh1SUNvZ1FISmxkSFZ5YmlCN1RuVnRZbVZ5ZlZ4dUlDb3ZYRzVtZFc1amRHbHZiaUJuWlhSRVlYbFBabGRsWldzb1pHRjBaU2tnZTF4dUlDQjJZWElnWkc5M0lEMGdaR0YwWlM1blpYUkVZWGtvS1R0Y2JpQWdhV1lvWkc5M0lEMDlQU0F3S1NCN1hHNGdJQ0FnWkc5M0lEMGdOenRjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdaRzkzTzF4dWZWeHVYRzR2S2lwY2JpQXFJR3RwYm1RdGIyWWdjMmh2Y25SamRYUmNiaUFxSUVCd1lYSmhiU0FnZXlwOUlIWmhiRnh1SUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlZ4dUlDb3ZYRzVtZFc1amRHbHZiaUJyYVc1a1QyWW9kbUZzS1NCN1hHNGdJR2xtSUNoMllXd2dQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQnlaWFIxY200Z0oyNTFiR3duTzF4dUlDQjlYRzVjYmlBZ2FXWWdLSFpoYkNBOVBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdjbVYwZFhKdUlDZDFibVJsWm1sdVpXUW5PMXh1SUNCOVhHNWNiaUFnYVdZZ0tIUjVjR1Z2WmlCMllXd2dJVDA5SUNkdlltcGxZM1FuS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFI1Y0dWdlppQjJZV3c3WEc0Z0lIMWNibHh1SUNCcFppQW9RWEp5WVhrdWFYTkJjbkpoZVNoMllXd3BLU0I3WEc0Z0lDQWdjbVYwZFhKdUlDZGhjbkpoZVNjN1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z2UzMHVkRzlUZEhKcGJtY3VZMkZzYkNoMllXd3BYRzRnSUNBZ0xuTnNhV05sS0Rnc0lDMHhLUzUwYjB4dmQyVnlRMkZ6WlNncE8xeHVmVHRjYmx4dVhHNWNiaUFnYVdZZ0tIUjVjR1Z2WmlCa1pXWnBibVVnUFQwOUlDZG1kVzVqZEdsdmJpY2dKaVlnWkdWbWFXNWxMbUZ0WkNrZ2UxeHVJQ0FnSUdSbFptbHVaU2htZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWkdGMFpVWnZjbTFoZER0Y2JpQWdJQ0I5S1R0Y2JpQWdmU0JsYkhObElHbG1JQ2gwZVhCbGIyWWdaWGh3YjNKMGN5QTlQVDBnSjI5aWFtVmpkQ2NwSUh0Y2JpQWdJQ0J0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1JoZEdWR2IzSnRZWFE3WEc0Z0lIMGdaV3h6WlNCN1hHNGdJQ0FnWjJ4dlltRnNMbVJoZEdWR2IzSnRZWFFnUFNCa1lYUmxSbTl5YldGME8xeHVJQ0I5WEc1OUtTaDBhR2x6S1R0Y2JpSXNJaThxSVZ4dUlDb2djbVZ3WldGMExYTjBjbWx1WnlBOGFIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwycHZibk5qYUd4cGJtdGxjblF2Y21Wd1pXRjBMWE4wY21sdVp6NWNiaUFxWEc0Z0tpQkRiM0I1Y21sbmFIUWdLR01wSURJd01UUXRNakF4TlN3Z1NtOXVJRk5qYUd4cGJtdGxjblF1WEc0Z0tpQk1hV05sYm5ObFpDQjFibVJsY2lCMGFHVWdUVWxVSUV4cFkyVnVjMlV1WEc0Z0tpOWNibHh1SjNWelpTQnpkSEpwWTNRbk8xeHVYRzR2S2lwY2JpQXFJRkpsYzNWc2RITWdZMkZqYUdWY2JpQXFMMXh1WEc1MllYSWdjbVZ6SUQwZ0p5YzdYRzUyWVhJZ1kyRmphR1U3WEc1Y2JpOHFLbHh1SUNvZ1JYaHdiM05sSUdCeVpYQmxZWFJnWEc0Z0tpOWNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J5WlhCbFlYUTdYRzVjYmk4cUtseHVJQ29nVW1Wd1pXRjBJSFJvWlNCbmFYWmxiaUJnYzNSeWFXNW5ZQ0IwYUdVZ2MzQmxZMmxtYVdWa0lHQnVkVzFpWlhKZ1hHNGdLaUJ2WmlCMGFXMWxjeTVjYmlBcVhHNGdLaUFxS2tWNFlXMXdiR1U2S2lwY2JpQXFYRzRnS2lCZ1lHQnFjMXh1SUNvZ2RtRnlJSEpsY0dWaGRDQTlJSEpsY1hWcGNtVW9KM0psY0dWaGRDMXpkSEpwYm1jbktUdGNiaUFxSUhKbGNHVmhkQ2duUVNjc0lEVXBPMXh1SUNvZ0x5ODlQaUJCUVVGQlFWeHVJQ29nWUdCZ1hHNGdLbHh1SUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUdCemRISnBibWRnSUZSb1pTQnpkSEpwYm1jZ2RHOGdjbVZ3WldGMFhHNGdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdZRzUxYldKbGNtQWdWR2hsSUc1MWJXSmxjaUJ2WmlCMGFXMWxjeUIwYnlCeVpYQmxZWFFnZEdobElITjBjbWx1WjF4dUlDb2dRSEpsZEhWeWJpQjdVM1J5YVc1bmZTQlNaWEJsWVhSbFpDQnpkSEpwYm1kY2JpQXFJRUJoY0drZ2NIVmliR2xqWEc0Z0tpOWNibHh1Wm5WdVkzUnBiMjRnY21Wd1pXRjBLSE4wY2l3Z2JuVnRLU0I3WEc0Z0lHbG1JQ2gwZVhCbGIyWWdjM1J5SUNFOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lIUm9jbTkzSUc1bGR5QlVlWEJsUlhKeWIzSW9KMlY0Y0dWamRHVmtJR0VnYzNSeWFXNW5KeWs3WEc0Z0lIMWNibHh1SUNBdkx5QmpiM1psY2lCamIyMXRiMjRzSUhGMWFXTnJJSFZ6WlNCallYTmxjMXh1SUNCcFppQW9iblZ0SUQwOVBTQXhLU0J5WlhSMWNtNGdjM1J5TzF4dUlDQnBaaUFvYm5WdElEMDlQU0F5S1NCeVpYUjFjbTRnYzNSeUlDc2djM1J5TzF4dVhHNGdJSFpoY2lCdFlYZ2dQU0J6ZEhJdWJHVnVaM1JvSUNvZ2JuVnRPMXh1SUNCcFppQW9ZMkZqYUdVZ0lUMDlJSE4wY2lCOGZDQjBlWEJsYjJZZ1kyRmphR1VnUFQwOUlDZDFibVJsWm1sdVpXUW5LU0I3WEc0Z0lDQWdZMkZqYUdVZ1BTQnpkSEk3WEc0Z0lDQWdjbVZ6SUQwZ0p5YzdYRzRnSUgwZ1pXeHpaU0JwWmlBb2NtVnpMbXhsYm1kMGFDQStQU0J0WVhncElIdGNiaUFnSUNCeVpYUjFjbTRnY21WekxuTjFZbk4wY2lnd0xDQnRZWGdwTzF4dUlDQjlYRzVjYmlBZ2QyaHBiR1VnS0cxaGVDQStJSEpsY3k1c1pXNW5kR2dnSmlZZ2JuVnRJRDRnTVNrZ2UxeHVJQ0FnSUdsbUlDaHVkVzBnSmlBeEtTQjdYRzRnSUNBZ0lDQnlaWE1nS3owZ2MzUnlPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHNTFiU0ErUGowZ01UdGNiaUFnSUNCemRISWdLejBnYzNSeU8xeHVJQ0I5WEc1Y2JpQWdjbVZ6SUNzOUlITjBjanRjYmlBZ2NtVnpJRDBnY21WekxuTjFZbk4wY2lnd0xDQnRZWGdwTzF4dUlDQnlaWFIxY200Z2NtVnpPMXh1ZlZ4dUlpd2lMeW9oWEc0Z0tpQndZV1F0YkdWbWRDQThhSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMMnB2Ym5OamFHeHBibXRsY25RdmNHRmtMV3hsWm5RK1hHNGdLbHh1SUNvZ1EyOXdlWEpwWjJoMElDaGpLU0F5TURFMExUSXdNVFVzSUVwdmJpQlRZMmhzYVc1clpYSjBMbHh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnZEdobElFMUpWQ0JzYVdObGJuTmxMbHh1SUNvdlhHNWNiaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUhKbGNHVmhkQ0E5SUhKbGNYVnBjbVVvSjNKbGNHVmhkQzF6ZEhKcGJtY25LVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCbWRXNWpkR2x2YmlCd1lXUk1aV1owS0hOMGNpd2diblZ0TENCamFDa2dlMXh1SUNCemRISWdQU0J6ZEhJdWRHOVRkSEpwYm1jb0tUdGNibHh1SUNCcFppQW9kSGx3Wlc5bUlHNTFiU0E5UFQwZ0ozVnVaR1ZtYVc1bFpDY3BJSHRjYmlBZ0lDQnlaWFIxY200Z2MzUnlPMXh1SUNCOVhHNWNiaUFnYVdZZ0tHTm9JRDA5UFNBd0tTQjdYRzRnSUNBZ1kyZ2dQU0FuTUNjN1hHNGdJSDBnWld4elpTQnBaaUFvWTJncElIdGNiaUFnSUNCamFDQTlJR05vTG5SdlUzUnlhVzVuS0NrN1hHNGdJSDBnWld4elpTQjdYRzRnSUNBZ1kyZ2dQU0FuSUNjN1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z2NtVndaV0YwS0dOb0xDQnVkVzBnTFNCemRISXViR1Z1WjNSb0tTQXJJSE4wY2p0Y2JuMDdYRzRpTENKcGJYQnZjblFnWkdGMFpXWnZjbTFoZENCbWNtOXRJQ2RrWVhSbFptOXliV0YwSnp0Y2JtbHRjRzl5ZENCaGMzTnBaMjRnWm5KdmJTQW5iMkpxWldOMExXRnpjMmxuYmljN1hHNXBiWEJ2Y25RZ2NHRmtUR1ZtZENCbWNtOXRJQ2R3WVdRdGJHVm1kQ2M3WEc1cGJYQnZjblFnZXlCblpYUkRiR2xsYm5SQlVFa2dmU0JtY205dElDY3VMM1YwYVd3bk8xeHVYRzVqYjI1emRDQnViMjl3SUQwZ0tDa2dQVDRnZTMwN1hHNXNaWFFnYkdsdWF6dGNibHh1THk4Z1FXeDBaWEp1WVhScGRtVWdjMjlzZFhScGIyNGdabTl5SUhOaGRtbHVaeUJtYVd4bGN5eGNiaTh2SUdFZ1ltbDBJSE5zYjNkbGNpQmhibVFnWkc5bGN5QnViM1FnZDI5eWF5QnBiaUJUWVdaaGNtbGNiaTh2SUdaMWJtTjBhVzl1SUdabGRHTm9RbXh2WWtaeWIyMUVZWFJoVlZKTUlDaGtZWFJoVlZKTUtTQjdYRzR2THlBZ0lISmxkSFZ5YmlCM2FXNWtiM2N1Wm1WMFkyZ29aR0YwWVZWU1RDa3VkR2hsYmloeVpYTWdQVDRnY21WekxtSnNiMklvS1NrN1hHNHZMeUI5WEc1Y2JtTnZibk4wSUhOMWNIQnZjblJsWkVWdVkyOWthVzVuY3lBOUlGdGNiaUFnSjJsdFlXZGxMM0J1Wnljc1hHNGdJQ2RwYldGblpTOXFjR1ZuSnl4Y2JpQWdKMmx0WVdkbEwzZGxZbkFuWEc1ZE8xeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdaWGh3YjNKMFEyRnVkbUZ6SUNoallXNTJZWE1zSUc5d2RDQTlJSHQ5S1NCN1hHNGdJR052Ym5OMElHVnVZMjlrYVc1bklEMGdiM0IwTG1WdVkyOWthVzVuSUh4OElDZHBiV0ZuWlM5d2JtY25PMXh1SUNCcFppQW9JWE4xY0hCdmNuUmxaRVZ1WTI5a2FXNW5jeTVwYm1Oc2RXUmxjeWhsYm1OdlpHbHVaeWtwSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhnU1c1MllXeHBaQ0JqWVc1MllYTWdaVzVqYjJScGJtY2dKSHRsYm1OdlpHbHVaMzFnS1R0Y2JpQWdiR1YwSUdWNGRHVnVjMmx2YmlBOUlDaGxibU52WkdsdVp5NXpjR3hwZENnbkx5Y3BXekZkSUh4OElDY25LUzV5WlhCc1lXTmxLQzlxY0dWbkwya3NJQ2RxY0djbktUdGNiaUFnYVdZZ0tHVjRkR1Z1YzJsdmJpa2daWGgwWlc1emFXOXVJRDBnWUM0a2UyVjRkR1Z1YzJsdmJuMWdMblJ2VEc5M1pYSkRZWE5sS0NrN1hHNGdJSEpsZEhWeWJpQjdYRzRnSUNBZ1pYaDBaVzV6YVc5dUxGeHVJQ0FnSUhSNWNHVTZJR1Z1WTI5a2FXNW5MRnh1SUNBZ0lHUmhkR0ZWVWt3NklHTmhiblpoY3k1MGIwUmhkR0ZWVWt3b1pXNWpiMlJwYm1jc0lHOXdkQzVsYm1OdlpHbHVaMUYxWVd4cGRIa3BYRzRnSUgwN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUdOeVpXRjBaVUpzYjJKR2NtOXRSR0YwWVZWU1RDQW9aR0YwWVZWU1RDa2dlMXh1SUNCeVpYUjFjbTRnYm1WM0lGQnliMjFwYzJVb0tISmxjMjlzZG1VcElEMCtJSHRjYmlBZ0lDQmpiMjV6ZENCemNHeHBkRWx1WkdWNElEMGdaR0YwWVZWU1RDNXBibVJsZUU5bUtDY3NKeWs3WEc0Z0lDQWdhV1lnS0hOd2JHbDBTVzVrWlhnZ1BUMDlJQzB4S1NCN1hHNGdJQ0FnSUNCeVpYTnZiSFpsS0c1bGR5QjNhVzVrYjNjdVFteHZZaWdwS1R0Y2JpQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQjlYRzRnSUNBZ1kyOXVjM1FnWW1GelpUWTBJRDBnWkdGMFlWVlNUQzV6YkdsalpTaHpjR3hwZEVsdVpHVjRJQ3NnTVNrN1hHNGdJQ0FnWTI5dWMzUWdZbmwwWlZOMGNtbHVaeUE5SUhkcGJtUnZkeTVoZEc5aUtHSmhjMlUyTkNrN1hHNGdJQ0FnWTI5dWMzUWdiV2x0WlUxaGRHTm9JRDBnTDJSaGRHRTZLRnRlT3l0ZEtUc3ZMbVY0WldNb1pHRjBZVlZTVENrN1hHNGdJQ0FnWTI5dWMzUWdiV2x0WlNBOUlDaHRhVzFsVFdGMFkyZ2dQeUJ0YVcxbFRXRjBZMmhiTVYwZ09pQW5KeWtnZkh3Z2RXNWtaV1pwYm1Wa08xeHVJQ0FnSUdOdmJuTjBJR0ZpSUQwZ2JtVjNJRUZ5Y21GNVFuVm1abVZ5S0dKNWRHVlRkSEpwYm1jdWJHVnVaM1JvS1R0Y2JpQWdJQ0JqYjI1emRDQnBZU0E5SUc1bGR5QlZhVzUwT0VGeWNtRjVLR0ZpS1R0Y2JpQWdJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Ec2dhU0E4SUdKNWRHVlRkSEpwYm1jdWJHVnVaM1JvT3lCcEt5c3BJSHRjYmlBZ0lDQWdJR2xoVzJsZElEMGdZbmwwWlZOMGNtbHVaeTVqYUdGeVEyOWtaVUYwS0drcE8xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhOdmJIWmxLRzVsZHlCM2FXNWtiM2N1UW14dllpaGJJR0ZpSUYwc0lIc2dkSGx3WlRvZ2JXbHRaU0I5S1NrN1hHNGdJSDBwTzF4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdjMkYyWlVSaGRHRlZVa3dnS0dSaGRHRlZVa3dzSUc5d2RITWdQU0I3ZlNrZ2UxeHVJQ0J5WlhSMWNtNGdZM0psWVhSbFFteHZZa1p5YjIxRVlYUmhWVkpNS0dSaGRHRlZVa3dwWEc0Z0lDQWdMblJvWlc0b1lteHZZaUE5UGlCellYWmxRbXh2WWloaWJHOWlMQ0J2Y0hSektTazdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCellYWmxRbXh2WWlBb1lteHZZaXdnYjNCMGN5QTlJSHQ5S1NCN1hHNGdJSEpsZEhWeWJpQnVaWGNnVUhKdmJXbHpaU2h5WlhOdmJIWmxJRDArSUh0Y2JpQWdJQ0J2Y0hSeklEMGdZWE56YVdkdUtIc2daWGgwWlc1emFXOXVPaUFuSnl3Z2NISmxabWw0T2lBbkp5d2djM1ZtWm1sNE9pQW5KeUI5TENCdmNIUnpLVHRjYmlBZ0lDQmpiMjV6ZENCbWFXeGxibUZ0WlNBOUlISmxjMjlzZG1WR2FXeGxibUZ0WlNodmNIUnpLVHRjYmx4dUlDQWdJR052Ym5OMElHTnNhV1Z1ZENBOUlHZGxkRU5zYVdWdWRFRlFTU2dwTzF4dUlDQWdJR2xtSUNoamJHbGxiblFnSmlZZ2RIbHdaVzltSUdOc2FXVnVkQzV6WVhabFFteHZZaUE5UFQwZ0oyWjFibU4wYVc5dUp5QW1KaUJqYkdsbGJuUXViM1YwY0hWMEtTQjdYRzRnSUNBZ0lDQXZMeUJ1WVhScGRtVWdjMkYyYVc1bklIVnphVzVuSUdFZ1EweEpJSFJ2YjJ4Y2JpQWdJQ0FnSUhKbGRIVnliaUJqYkdsbGJuUXVjMkYyWlVKc2IySW9ZbXh2WWl3Z1lYTnphV2R1S0h0OUxDQnZjSFJ6TENCN0lHWnBiR1Z1WVcxbElIMHBLVnh1SUNBZ0lDQWdJQ0F1ZEdobGJpaGxkaUE5UGlCeVpYTnZiSFpsS0dWMktTazdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUM4dklHWnZjbU5sSUdSdmQyNXNiMkZrWEc0Z0lDQWdJQ0JwWmlBb0lXeHBibXNwSUh0Y2JpQWdJQ0FnSUNBZ2JHbHVheUE5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMkVuS1R0Y2JpQWdJQ0FnSUNBZ2JHbHVheTV6ZEhsc1pTNTJhWE5wWW1sc2FYUjVJRDBnSjJocFpHUmxiaWM3WEc0Z0lDQWdJQ0FnSUd4cGJtc3VkR0Z5WjJWMElEMGdKMTlpYkdGdWF5YzdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnNhVzVyTG1SdmQyNXNiMkZrSUQwZ1ptbHNaVzVoYldVN1hHNGdJQ0FnSUNCc2FXNXJMbWh5WldZZ1BTQjNhVzVrYjNjdVZWSk1MbU55WldGMFpVOWlhbVZqZEZWU1RDaGliRzlpS1R0Y2JpQWdJQ0FnSUdSdlkzVnRaVzUwTG1KdlpIa3VZWEJ3Wlc1a1EyaHBiR1FvYkdsdWF5azdYRzRnSUNBZ0lDQnNhVzVyTG05dVkyeHBZMnNnUFNBb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUd4cGJtc3ViMjVqYkdsamF5QTlJRzV2YjNBN1hHNGdJQ0FnSUNBZ0lITmxkRlJwYldWdmRYUW9LQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJSGRwYm1SdmR5NVZVa3d1Y21WMmIydGxUMkpxWldOMFZWSk1LR0pzYjJJcE8xeHVJQ0FnSUNBZ0lDQWdJR1J2WTNWdFpXNTBMbUp2WkhrdWNtVnRiM1psUTJocGJHUW9iR2x1YXlrN1hHNGdJQ0FnSUNBZ0lDQWdiR2x1YXk1eVpXMXZkbVZCZEhSeWFXSjFkR1VvSjJoeVpXWW5LVHRjYmlBZ0lDQWdJQ0FnSUNCeVpYTnZiSFpsS0hzZ1ptbHNaVzVoYldVc0lHTnNhV1Z1ZERvZ1ptRnNjMlVnZlNrN1hHNGdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdmVHRjYmlBZ0lDQWdJR3hwYm1zdVkyeHBZMnNvS1R0Y2JpQWdJQ0I5WEc0Z0lIMHBPMXh1ZlZ4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2MyRjJaVVpwYkdVZ0tHUmhkR0VzSUc5d2RITWdQU0I3ZlNrZ2UxeHVJQ0JqYjI1emRDQndZWEowY3lBOUlFRnljbUY1TG1selFYSnlZWGtvWkdGMFlTa2dQeUJrWVhSaElEb2dXeUJrWVhSaElGMDdYRzRnSUdOdmJuTjBJR0pzYjJJZ1BTQnVaWGNnZDJsdVpHOTNMa0pzYjJJb2NHRnlkSE1zSUhzZ2RIbHdaVG9nYjNCMGN5NTBlWEJsSUh4OElDY25JSDBwTzF4dUlDQnlaWFIxY200Z2MyRjJaVUpzYjJJb1lteHZZaXdnYjNCMGN5azdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCblpYUkdhV3hsVG1GdFpTQW9LU0I3WEc0Z0lHTnZibk4wSUdSaGRHVkdiM0p0WVhSVGRISWdQU0JnZVhsNWVTNXRiUzVrWkMxSVNDNU5UUzV6YzJBN1hHNGdJSEpsZEhWeWJpQmtZWFJsWm05eWJXRjBLRzVsZHlCRVlYUmxLQ2tzSUdSaGRHVkdiM0p0WVhSVGRISXBPMXh1ZlZ4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1oyVjBSR1ZtWVhWc2RFWnBiR1VnS0hCeVpXWnBlQ0E5SUNjbkxDQnpkV1ptYVhnZ1BTQW5KeXdnWlhoMEtTQjdYRzRnSUM4dklHTnZibk4wSUdSaGRHVkdiM0p0WVhSVGRISWdQU0JnZVhsNWVTNXRiUzVrWkMxSVNDNU5UUzV6YzJBN1hHNGdJR052Ym5OMElHUmhkR1ZHYjNKdFlYUlRkSElnUFNCZ2VYbDVlUzF0YlMxa1pDQW5ZWFFuSUdndVRVMHVjM01nVkZSZ08xeHVJQ0J5WlhSMWNtNGdZQ1I3Y0hKbFptbDRmU1I3WkdGMFpXWnZjbTFoZENodVpYY2dSR0YwWlNncExDQmtZWFJsUm05eWJXRjBVM1J5S1gwa2UzTjFabVpwZUgwa2UyVjRkSDFnTzF4dWZWeHVYRzVtZFc1amRHbHZiaUJ5WlhOdmJIWmxSbWxzWlc1aGJXVWdLRzl3ZENBOUlIdDlLU0I3WEc0Z0lHOXdkQ0E5SUdGemMybG5iaWg3ZlN3Z2IzQjBLVHRjYmx4dUlDQXZMeUJEZFhOMGIyMGdabWxzWlc1aGJXVWdablZ1WTNScGIyNWNiaUFnYVdZZ0tIUjVjR1Z2WmlCdmNIUXVabWxzWlNBOVBUMGdKMloxYm1OMGFXOXVKeWtnZTF4dUlDQWdJSEpsZEhWeWJpQnZjSFF1Wm1sc1pTaHZjSFFwTzF4dUlDQjlJR1ZzYzJVZ2FXWWdLRzl3ZEM1bWFXeGxLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHOXdkQzVtYVd4bE8xeHVJQ0I5WEc1Y2JpQWdiR1YwSUdaeVlXMWxJRDBnYm5Wc2JEdGNiaUFnYkdWMElHVjRkR1Z1YzJsdmJpQTlJQ2NuTzF4dUlDQnBaaUFvZEhsd1pXOW1JRzl3ZEM1bGVIUmxibk5wYjI0Z1BUMDlJQ2R6ZEhKcGJtY25LU0JsZUhSbGJuTnBiMjRnUFNCdmNIUXVaWGgwWlc1emFXOXVPMXh1WEc0Z0lHbG1JQ2gwZVhCbGIyWWdiM0IwTG1aeVlXMWxJRDA5UFNBbmJuVnRZbVZ5SnlrZ2UxeHVJQ0FnSUd4bGRDQjBiM1JoYkVaeVlXMWxjenRjYmlBZ0lDQnBaaUFvZEhsd1pXOW1JRzl3ZEM1MGIzUmhiRVp5WVcxbGN5QTlQVDBnSjI1MWJXSmxjaWNwSUh0Y2JpQWdJQ0FnSUhSdmRHRnNSbkpoYldWeklEMGdiM0IwTG5SdmRHRnNSbkpoYldWek8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0IwYjNSaGJFWnlZVzFsY3lBOUlFMWhkR2d1YldGNEtERXdNREFzSUc5d2RDNW1jbUZ0WlNrN1hHNGdJQ0FnZlZ4dUlDQWdJR1p5WVcxbElEMGdjR0ZrVEdWbWRDaFRkSEpwYm1jb2IzQjBMbVp5WVcxbEtTd2dVM1J5YVc1bktIUnZkR0ZzUm5KaGJXVnpLUzVzWlc1bmRHZ3NJQ2N3SnlrN1hHNGdJSDFjYmx4dUlDQmpiMjV6ZENCc1lYbGxjbE4wY2lBOUlHbHpSbWx1YVhSbEtHOXdkQzUwYjNSaGJFeGhlV1Z5Y3lrZ0ppWWdhWE5HYVc1cGRHVW9iM0IwTG14aGVXVnlLU0FtSmlCdmNIUXVkRzkwWVd4TVlYbGxjbk1nUGlBeElEOGdZQ1I3YjNCMExteGhlV1Z5ZldBZ09pQW5KenRjYmlBZ2FXWWdLR1p5WVcxbElDRTlJRzUxYkd3cElIdGNiaUFnSUNCeVpYUjFjbTRnV3lCc1lYbGxjbE4wY2l3Z1puSmhiV1VnWFM1bWFXeDBaWElvUW05dmJHVmhiaWt1YW05cGJpZ25MU2NwSUNzZ1pYaDBaVzV6YVc5dU8xeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lHTnZibk4wSUdSbFptRjFiSFJHYVd4bFRtRnRaU0E5SUc5d2RDNTBhVzFsVTNSaGJYQTdYRzRnSUNBZ2NtVjBkWEp1SUZzZ2IzQjBMbkJ5WldacGVDd2diM0IwTG01aGJXVWdmSHdnWkdWbVlYVnNkRVpwYkdWT1lXMWxMQ0JzWVhsbGNsTjBjaXdnYjNCMExtaGhjMmdzSUc5d2RDNXpkV1ptYVhnZ1hTNW1hV3gwWlhJb1FtOXZiR1ZoYmlrdWFtOXBiaWduTFNjcElDc2daWGgwWlc1emFXOXVPMXh1SUNCOVhHNTlYRzRpTENKcGJYQnZjblFnZXlCblpYUkRiR2xsYm5SQlVFa2dmU0JtY205dElDY3VMaTkxZEdsc0p6dGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdablZ1WTNScGIyNGdLRzl3ZENBOUlIdDlLU0I3WEc0Z0lHTnZibk4wSUdoaGJtUnNaWElnUFNCbGRpQTlQaUI3WEc0Z0lDQWdhV1lnS0NGdmNIUXVaVzVoWW14bFpDZ3BLU0J5WlhSMWNtNDdYRzVjYmlBZ0lDQmpiMjV6ZENCamJHbGxiblFnUFNCblpYUkRiR2xsYm5SQlVFa29LVHRjYmlBZ0lDQnBaaUFvWlhZdWEyVjVRMjlrWlNBOVBUMGdPRE1nSmlZZ0lXVjJMbUZzZEV0bGVTQW1KaUFvWlhZdWJXVjBZVXRsZVNCOGZDQmxkaTVqZEhKc1MyVjVLU2tnZTF4dUlDQWdJQ0FnTHk4Z1EyMWtJQ3NnVTF4dUlDQWdJQ0FnWlhZdWNISmxkbVZ1ZEVSbFptRjFiSFFvS1R0Y2JpQWdJQ0FnSUc5d2RDNXpZWFpsS0dWMktUdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tHVjJMbXRsZVVOdlpHVWdQVDA5SURNeUtTQjdYRzRnSUNBZ0lDQXZMeUJUY0dGalpWeHVJQ0FnSUNBZ0x5OGdWRTlFVHpvZ2QyaGhkQ0IwYnlCa2J5QjNhWFJvSUhSb2FYTS9JR3RsWlhBZ2FYUXNJRzl5SUhKbGJXOTJaU0JwZEQ5Y2JpQWdJQ0FnSUc5d2RDNTBiMmRuYkdWUWJHRjVLR1YyS1R0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0dOc2FXVnVkQ0FtSmlBaFpYWXVZV3gwUzJWNUlDWW1JR1YyTG10bGVVTnZaR1VnUFQwOUlEYzFJQ1ltSUNobGRpNXRaWFJoUzJWNUlIeDhJR1YyTG1OMGNteExaWGtwS1NCN1hHNGdJQ0FnSUNBdkx5QkRiV1FnS3lCTExDQnZibXg1SUhkb1pXNGdZMkZ1ZG1GekxYTnJaWFJqYUMxamJHa2dhWE1nZFhObFpGeHVJQ0FnSUNBZ1pYWXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNiaUFnSUNBZ0lHOXdkQzVqYjIxdGFYUW9aWFlwTzF4dUlDQWdJSDFjYmlBZ2ZUdGNibHh1SUNCamIyNXpkQ0JoZEhSaFkyZ2dQU0FvS1NBOVBpQjdYRzRnSUNBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJ0bGVXUnZkMjRuTENCb1lXNWtiR1Z5S1R0Y2JpQWdmVHRjYmx4dUlDQmpiMjV6ZENCa1pYUmhZMmdnUFNBb0tTQTlQaUI3WEc0Z0lDQWdkMmx1Wkc5M0xuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9KMnRsZVdSdmQyNG5MQ0JvWVc1a2JHVnlLVHRjYmlBZ2ZUdGNibHh1SUNCeVpYUjFjbTRnZTF4dUlDQWdJR0YwZEdGamFDeGNiaUFnSUNCa1pYUmhZMmhjYmlBZ2ZUdGNibjFjYmlJc0ltTnZibk4wSUdSbFptRjFiSFJWYm1sMGN5QTlJQ2R0YlNjN1hHNWNibU52Ym5OMElHUmhkR0VnUFNCYlhHNGdJQzh2SUVOdmJXMXZiaUJRWVhCbGNpQlRhWHBsYzF4dUlDQXZMeUFvVFc5emRHeDVJRTV2Y25Sb0xVRnRaWEpwWTJGdUlHSmhjMlZrS1Z4dUlDQmJJQ2R3YjNOMFkyRnlaQ2NzSURFd01TNDJMQ0F4TlRJdU5DQmRMRnh1SUNCYklDZHdiM04wWlhJdGMyMWhiR3duTENBeU9EQXNJRFF6TUNCZExGeHVJQ0JiSUNkd2IzTjBaWEluTENBME5qQXNJRFl4TUNCZExGeHVJQ0JiSUNkd2IzTjBaWEl0YkdGeVoyVW5MQ0EyTVRBc0lEa3hNQ0JkTEZ4dUlDQmJJQ2RpZFhOcGJtVnpjeTFqWVhKa0p5d2dOVEF1T0N3Z09EZ3VPU0JkTEZ4dVhHNGdJQzh2SUZOMFlXNWtZWEprSUZCaGNHVnlJRk5wZW1WelhHNGdJRnNnSjJFd0p5d2dPRFF4TENBeE1UZzVJRjBzWEc0Z0lGc2dKMkV4Snl3Z05UazBMQ0E0TkRFZ1hTeGNiaUFnV3lBbllUSW5MQ0EwTWpBc0lEVTVOQ0JkTEZ4dUlDQmJJQ2RoTXljc0lESTVOeXdnTkRJd0lGMHNYRzRnSUZzZ0oyRTBKeXdnTWpFd0xDQXlPVGNnWFN4Y2JpQWdXeUFuWVRVbkxDQXhORGdzSURJeE1DQmRMRnh1SUNCYklDZGhOaWNzSURFd05Td2dNVFE0SUYwc1hHNGdJRnNnSjJFM0p5d2dOelFzSURFd05TQmRMRnh1SUNCYklDZGhPQ2NzSURVeUxDQTNOQ0JkTEZ4dUlDQmJJQ2RoT1Njc0lETTNMQ0ExTWlCZExGeHVJQ0JiSUNkaE1UQW5MQ0F5Tml3Z016Y2dYU3hjYmlBZ1d5QW5NbUV3Snl3Z01URTRPU3dnTVRZNE1pQmRMRnh1SUNCYklDYzBZVEFuTENBeE5qZ3lMQ0F5TXpjNElGMHNYRzRnSUZzZ0oySXdKeXdnTVRBd01Dd2dNVFF4TkNCZExGeHVJQ0JiSUNkaU1TY3NJRGN3Tnl3Z01UQXdNQ0JkTEZ4dUlDQmJJQ2RpTVNzbkxDQTNNakFzSURFd01qQWdYU3hjYmlBZ1d5QW5ZakluTENBMU1EQXNJRGN3TnlCZExGeHVJQ0JiSUNkaU1pc25MQ0ExTWpBc0lEY3lNQ0JkTEZ4dUlDQmJJQ2RpTXljc0lETTFNeXdnTlRBd0lGMHNYRzRnSUZzZ0oySTBKeXdnTWpVd0xDQXpOVE1nWFN4Y2JpQWdXeUFuWWpVbkxDQXhOellzSURJMU1DQmRMRnh1SUNCYklDZGlOaWNzSURFeU5Td2dNVGMySUYwc1hHNGdJRnNnSjJJM0p5d2dPRGdzSURFeU5TQmRMRnh1SUNCYklDZGlPQ2NzSURZeUxDQTRPQ0JkTEZ4dUlDQmJJQ2RpT1Njc0lEUTBMQ0EyTWlCZExGeHVJQ0JiSUNkaU1UQW5MQ0F6TVN3Z05EUWdYU3hjYmlBZ1d5QW5ZakV4Snl3Z01qSXNJRE15SUYwc1hHNGdJRnNnSjJJeE1pY3NJREUyTENBeU1pQmRMRnh1SUNCYklDZGpNQ2NzSURreE55d2dNVEk1TnlCZExGeHVJQ0JiSUNkak1TY3NJRFkwT0N3Z09URTNJRjBzWEc0Z0lGc2dKMk15Snl3Z05EVTRMQ0EyTkRnZ1hTeGNiaUFnV3lBbll6TW5MQ0F6TWpRc0lEUTFPQ0JkTEZ4dUlDQmJJQ2RqTkNjc0lESXlPU3dnTXpJMElGMHNYRzRnSUZzZ0oyTTFKeXdnTVRZeUxDQXlNamtnWFN4Y2JpQWdXeUFuWXpZbkxDQXhNVFFzSURFMk1pQmRMRnh1SUNCYklDZGpOeWNzSURneExDQXhNVFFnWFN4Y2JpQWdXeUFuWXpnbkxDQTFOeXdnT0RFZ1hTeGNiaUFnV3lBbll6a25MQ0EwTUN3Z05UY2dYU3hjYmlBZ1d5QW5ZekV3Snl3Z01qZ3NJRFF3SUYwc1hHNGdJRnNnSjJNeE1TY3NJREl5TENBek1pQmRMRnh1SUNCYklDZGpNVEluTENBeE5pd2dNaklnWFN4Y2JseHVJQ0F2THlCVmMyVWdhVzVqYUdWeklHWnZjaUJPYjNKMGFDQkJiV1Z5YVdOaGJpQnphWHBsY3l4Y2JpQWdMeThnWVhNZ2FYUWdjSEp2WkhWalpYTWdiR1Z6Y3lCbWJHOWhkQ0J3Y21WamFYTnBiMjRnWlhKeWIzSnpYRzRnSUZzZ0oyaGhiR1l0YkdWMGRHVnlKeXdnTlM0MUxDQTRMalVzSUNkcGJpY2dYU3hjYmlBZ1d5QW5iR1YwZEdWeUp5d2dPQzQxTENBeE1Td2dKMmx1SnlCZExGeHVJQ0JiSUNkc1pXZGhiQ2NzSURndU5Td2dNVFFzSUNkcGJpY2dYU3hjYmlBZ1d5QW5hblZ1YVc5eUxXeGxaMkZzSnl3Z05Td2dPQ3dnSjJsdUp5QmRMRnh1SUNCYklDZHNaV1JuWlhJbkxDQXhNU3dnTVRjc0lDZHBiaWNnWFN4Y2JpQWdXeUFuZEdGaWJHOXBaQ2NzSURFeExDQXhOeXdnSjJsdUp5QmRMRnh1SUNCYklDZGhibk5wTFdFbkxDQTRMalVzSURFeExqQXNJQ2RwYmljZ1hTeGNiaUFnV3lBbllXNXphUzFpSnl3Z01URXVNQ3dnTVRjdU1Dd2dKMmx1SnlCZExGeHVJQ0JiSUNkaGJuTnBMV01uTENBeE55NHdMQ0F5TWk0d0xDQW5hVzRuSUYwc1hHNGdJRnNnSjJGdWMya3RaQ2NzSURJeUxqQXNJRE0wTGpBc0lDZHBiaWNnWFN4Y2JpQWdXeUFuWVc1emFTMWxKeXdnTXpRdU1Dd2dORFF1TUN3Z0oybHVKeUJkTEZ4dUlDQmJJQ2RoY21Ob0xXRW5MQ0E1TENBeE1pd2dKMmx1SnlCZExGeHVJQ0JiSUNkaGNtTm9MV0luTENBeE1pd2dNVGdzSUNkcGJpY2dYU3hjYmlBZ1d5QW5ZWEpqYUMxakp5d2dNVGdzSURJMExDQW5hVzRuSUYwc1hHNGdJRnNnSjJGeVkyZ3RaQ2NzSURJMExDQXpOaXdnSjJsdUp5QmRMRnh1SUNCYklDZGhjbU5vTFdVbkxDQXpOaXdnTkRnc0lDZHBiaWNnWFN4Y2JpQWdXeUFuWVhKamFDMWxNU2NzSURNd0xDQTBNaXdnSjJsdUp5QmRMRnh1SUNCYklDZGhjbU5vTFdVeUp5d2dNallzSURNNExDQW5hVzRuSUYwc1hHNGdJRnNnSjJGeVkyZ3RaVE1uTENBeU55d2dNemtzSUNkcGJpY2dYVnh1WFR0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1pHRjBZUzV5WldSMVkyVW9LR1JwWTNRc0lIQnlaWE5sZENrZ1BUNGdlMXh1SUNCamIyNXpkQ0JwZEdWdElEMGdlMXh1SUNBZ0lIVnVhWFJ6T2lCd2NtVnpaWFJiTTEwZ2ZId2daR1ZtWVhWc2RGVnVhWFJ6TEZ4dUlDQWdJR1JwYldWdWMybHZibk02SUZzZ2NISmxjMlYwV3pGZExDQndjbVZ6WlhSYk1sMGdYVnh1SUNCOU8xeHVJQ0JrYVdOMFczQnlaWE5sZEZzd1hWMGdQU0JwZEdWdE8xeHVJQ0JrYVdOMFczQnlaWE5sZEZzd1hTNXlaWEJzWVdObEtDOHRMMmNzSUNjZ0p5bGRJRDBnYVhSbGJUdGNiaUFnY21WMGRYSnVJR1JwWTNRN1hHNTlMQ0I3ZlNrN1hHNGlMQ0pwYlhCdmNuUWdjR0Z3WlhKVGFYcGxjeUJtY205dElDY3VMM0JoY0dWeUxYTnBlbVZ6Snp0Y2JtbHRjRzl5ZENCamIyNTJaWEowVEdWdVozUm9JR1p5YjIwZ0oyTnZiblpsY25RdGJHVnVaM1JvSnp0Y2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHZGxkRVJwYldWdWMybHZibk5HY205dFVISmxjMlYwSUNoa2FXMWxibk5wYjI1ekxDQjFibWwwYzFSdklEMGdKM0I0Snl3Z2NHbDRaV3h6VUdWeVNXNWphQ0E5SURjeUtTQjdYRzRnSUdsbUlDaDBlWEJsYjJZZ1pHbHRaVzV6YVc5dWN5QTlQVDBnSjNOMGNtbHVaeWNwSUh0Y2JpQWdJQ0JqYjI1emRDQnJaWGtnUFNCa2FXMWxibk5wYjI1ekxuUnZURzkzWlhKRFlYTmxLQ2s3WEc0Z0lDQWdhV1lnS0NFb2EyVjVJR2x1SUhCaGNHVnlVMmw2WlhNcEtTQjdYRzRnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lGUm9aU0JrYVcxbGJuTnBiMjRnY0hKbGMyVjBJRndpSkh0a2FXMWxibk5wYjI1emZWd2lJR2x6SUc1dmRDQnpkWEJ3YjNKMFpXUWdiM0lnWTI5MWJHUWdibTkwSUdKbElHWnZkVzVrT3lCMGNua2dkWE5wYm1jZ1lUUXNJR0V6TENCd2IzTjBZMkZ5WkN3Z2JHVjBkR1Z5TENCbGRHTXVZQ2xjYmlBZ0lDQjlYRzRnSUNBZ1kyOXVjM1FnY0hKbGMyVjBJRDBnY0dGd1pYSlRhWHBsYzF0clpYbGRPMXh1SUNBZ0lISmxkSFZ5YmlCd2NtVnpaWFF1WkdsdFpXNXphVzl1Y3k1dFlYQW9aQ0E5UGlCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWTI5dWRtVnlkRVJwYzNSaGJtTmxLR1FzSUhCeVpYTmxkQzUxYm1sMGN5d2dkVzVwZEhOVWJ5d2djR2w0Wld4elVHVnlTVzVqYUNrN1hHNGdJQ0FnZlNrN1hHNGdJSDBnWld4elpTQjdYRzRnSUNBZ2NtVjBkWEp1SUdScGJXVnVjMmx2Ym5NN1hHNGdJSDFjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHTnZiblpsY25SRWFYTjBZVzVqWlNBb1pHbHRaVzV6YVc5dUxDQjFibWwwYzBaeWIyMGdQU0FuY0hnbkxDQjFibWwwYzFSdklEMGdKM0I0Snl3Z2NHbDRaV3h6VUdWeVNXNWphQ0E5SURjeUtTQjdYRzRnSUhKbGRIVnliaUJqYjI1MlpYSjBUR1Z1WjNSb0tHUnBiV1Z1YzJsdmJpd2dkVzVwZEhOR2NtOXRMQ0IxYm1sMGMxUnZMQ0I3WEc0Z0lDQWdjR2w0Wld4elVHVnlTVzVqYUN4Y2JpQWdJQ0J3Y21WamFYTnBiMjQ2SURRc1hHNGdJQ0FnY205MWJtUlFhWGhsYkRvZ2RISjFaVnh1SUNCOUtUdGNibjFjYmlJc0ltbHRjRzl5ZENCa1pXWnBibVZrSUdaeWIyMGdKMlJsWm1sdVpXUW5PMXh1YVcxd2IzSjBJSHNnWjJWMFJHbHRaVzV6YVc5dWMwWnliMjFRY21WelpYUXNJR052Ym5abGNuUkVhWE4wWVc1alpTQjlJR1p5YjIwZ0p5NHVMMlJwYzNSaGJtTmxjeWM3WEc1cGJYQnZjblFnZXlCcGMwSnliM2R6WlhJZ2ZTQm1jbTl0SUNjdUxpOTFkR2xzSnp0Y2JseHVablZ1WTNScGIyNGdZMmhsWTJ0SlpraGhjMFJwYldWdWMybHZibk1nS0hObGRIUnBibWR6S1NCN1hHNGdJR2xtSUNnaGMyVjBkR2x1WjNNdVpHbHRaVzV6YVc5dWN5a2djbVYwZFhKdUlHWmhiSE5sTzF4dUlDQnBaaUFvZEhsd1pXOW1JSE5sZEhScGJtZHpMbVJwYldWdWMybHZibk1nUFQwOUlDZHpkSEpwYm1jbktTQnlaWFIxY200Z2RISjFaVHRjYmlBZ2FXWWdLRUZ5Y21GNUxtbHpRWEp5WVhrb2MyVjBkR2x1WjNNdVpHbHRaVzV6YVc5dWN5a2dKaVlnYzJWMGRHbHVaM011WkdsdFpXNXphVzl1Y3k1c1pXNW5kR2dnUGowZ01pa2djbVYwZFhKdUlIUnlkV1U3WEc0Z0lISmxkSFZ5YmlCbVlXeHpaVHRjYm4xY2JseHVablZ1WTNScGIyNGdaMlYwVUdGeVpXNTBVMmw2WlNBb2NISnZjSE1zSUhObGRIUnBibWR6S1NCN1hHNGdJQzh2SUZkb1pXNGdibThnZXlCa2FXMWxibk5wYjI0Z2ZTQnBjeUJ3WVhOelpXUWdhVzRnYm05a1pTd2dkMlVnWkdWbVlYVnNkQ0IwYnlCSVZFMU1JR05oYm5aaGN5QnphWHBsWEc0Z0lHbG1JQ2doYVhOQ2NtOTNjMlZ5S1NCN1hHNGdJQ0FnY21WMGRYSnVJRnNnTXpBd0xDQXhOVEFnWFR0Y2JpQWdmVnh1WEc0Z0lHeGxkQ0JsYkdWdFpXNTBJRDBnYzJWMGRHbHVaM011Y0dGeVpXNTBJSHg4SUhkcGJtUnZkenRjYmx4dUlDQnBaaUFvWld4bGJXVnVkQ0E5UFQwZ2QybHVaRzkzSUh4OFhHNGdJQ0FnSUNCbGJHVnRaVzUwSUQwOVBTQmtiMk4xYldWdWRDQjhmRnh1SUNBZ0lDQWdaV3hsYldWdWRDQTlQVDBnWkc5amRXMWxiblF1WW05a2VTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCYklIZHBibVJ2ZHk1cGJtNWxjbGRwWkhSb0xDQjNhVzVrYjNjdWFXNXVaWEpJWldsbmFIUWdYVHRjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0JqYjI1emRDQjdJSGRwWkhSb0xDQm9aV2xuYUhRZ2ZTQTlJR1ZzWlcxbGJuUXVaMlYwUW05MWJtUnBibWREYkdsbGJuUlNaV04wS0NrN1hHNGdJQ0FnY21WMGRYSnVJRnNnZDJsa2RHZ3NJR2hsYVdkb2RDQmRPMXh1SUNCOVhHNTlYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR1oxYm1OMGFXOXVJSEpsYzJsNlpVTmhiblpoY3lBb2NISnZjSE1zSUhObGRIUnBibWR6S1NCN1hHNGdJR3hsZENCM2FXUjBhQ3dnYUdWcFoyaDBPMXh1SUNCc1pYUWdjM1I1YkdWWGFXUjBhQ3dnYzNSNWJHVklaV2xuYUhRN1hHNGdJR3hsZENCallXNTJZWE5YYVdSMGFDd2dZMkZ1ZG1GelNHVnBaMmgwTzF4dVhHNGdJR052Ym5OMElHUnBiV1Z1YzJsdmJuTWdQU0J6WlhSMGFXNW5jeTVrYVcxbGJuTnBiMjV6TzF4dUlDQmpiMjV6ZENCb1lYTkVhVzFsYm5OcGIyNXpJRDBnWTJobFkydEpaa2hoYzBScGJXVnVjMmx2Ym5Nb2MyVjBkR2x1WjNNcE8xeHVJQ0JqYjI1emRDQmxlSEJ2Y25ScGJtY2dQU0J3Y205d2N5NWxlSEJ2Y25ScGJtYzdYRzRnSUdOdmJuTjBJSE5qWVd4bFZHOUdhWFFnUFNCb1lYTkVhVzFsYm5OcGIyNXpJRDhnYzJWMGRHbHVaM011YzJOaGJHVlViMFpwZENBaFBUMGdabUZzYzJVZ09pQm1ZV3h6WlR0Y2JpQWdZMjl1YzNRZ2MyTmhiR1ZVYjFacFpYY2dQU0FvSVdWNGNHOXlkR2x1WnlBbUppQm9ZWE5FYVcxbGJuTnBiMjV6S1NBL0lITmxkSFJwYm1kekxuTmpZV3hsVkc5V2FXVjNJRG9nZEhKMVpUdGNiaUFnWTI5dWMzUWdkVzVwZEhNZ1BTQnpaWFIwYVc1bmN5NTFibWwwY3p0Y2JpQWdZMjl1YzNRZ2NHbDRaV3h6VUdWeVNXNWphQ0E5SUNoMGVYQmxiMllnYzJWMGRHbHVaM011Y0dsNFpXeHpVR1Z5U1c1amFDQTlQVDBnSjI1MWJXSmxjaWNnSmlZZ2FYTkdhVzVwZEdVb2MyVjBkR2x1WjNNdWNHbDRaV3h6VUdWeVNXNWphQ2twSUQ4Z2MyVjBkR2x1WjNNdWNHbDRaV3h6VUdWeVNXNWphQ0E2SURjeU8xeHVJQ0JqYjI1emRDQmliR1ZsWkNBOUlHUmxabWx1WldRb2MyVjBkR2x1WjNNdVlteGxaV1FzSURBcE8xeHVYRzRnSUdOdmJuTjBJR1JsZG1salpWQnBlR1ZzVW1GMGFXOGdQU0JwYzBKeWIzZHpaWElvS1NBL0lIZHBibVJ2ZHk1a1pYWnBZMlZRYVhobGJGSmhkR2x2SURvZ01UdGNiaUFnWTI5dWMzUWdZbUZ6WlZCcGVHVnNVbUYwYVc4Z1BTQnpZMkZzWlZSdlZtbGxkeUEvSUdSbGRtbGpaVkJwZUdWc1VtRjBhVzhnT2lBeE8xeHVYRzRnSUd4bGRDQndhWGhsYkZKaGRHbHZMQ0JsZUhCdmNuUlFhWGhsYkZKaGRHbHZPMXh1WEc0Z0lDOHZJRWxtSUdFZ2NHbDRaV3dnY21GMGFXOGdhWE1nYzNCbFkybG1hV1ZrTENCM1pTQjNhV3hzSUhWelpTQnBkQzVjYmlBZ0x5OGdUM1JvWlhKM2FYTmxPbHh1SUNBdkx5QWdMVDRnU1dZZ1pHbHRaVzV6YVc5dUlHbHpJSE53WldOcFptbGxaQ3dnZFhObElHSmhjMlVnY21GMGFXOGdLR2t1WlM0Z2MybDZaU0JtYjNJZ1pYaHdiM0owS1Z4dUlDQXZMeUFnTFQ0Z1NXWWdibThnWkdsdFpXNXphVzl1SUdseklITndaV05wWm1sbFpDd2dkWE5sSUdSbGRtbGpaU0J5WVhScGJ5QW9hUzVsTGlCemFYcGxJR1p2Y2lCelkzSmxaVzRwWEc0Z0lHbG1JQ2gwZVhCbGIyWWdjMlYwZEdsdVozTXVjR2w0Wld4U1lYUnBieUE5UFQwZ0oyNTFiV0psY2ljZ0ppWWdhWE5HYVc1cGRHVW9jMlYwZEdsdVozTXVjR2w0Wld4U1lYUnBieWtwSUh0Y2JpQWdJQ0F2THlCWGFHVnVJSHNnY0dsNFpXeFNZWFJwYnlCOUlHbHpJSE53WldOcFptbGxaQ3dnYVhRbmN5QmhiSE52SUhWelpXUWdZWE1nWkdWbVlYVnNkQ0JsZUhCdmNuUlFhWGhsYkZKaGRHbHZMbHh1SUNBZ0lIQnBlR1ZzVW1GMGFXOGdQU0J6WlhSMGFXNW5jeTV3YVhobGJGSmhkR2x2TzF4dUlDQWdJR1Y0Y0c5eWRGQnBlR1ZzVW1GMGFXOGdQU0JrWldacGJtVmtLSE5sZEhScGJtZHpMbVY0Y0c5eWRGQnBlR1ZzVW1GMGFXOHNJSEJwZUdWc1VtRjBhVzhwTzF4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUdsbUlDaG9ZWE5FYVcxbGJuTnBiMjV6S1NCN1hHNGdJQ0FnSUNBdkx5QlhhR1Z1SUdFZ1pHbHRaVzV6YVc5dUlHbHpJSE53WldOcFptbGxaQ3dnZFhObElIUm9aU0JpWVhObElISmhkR2x2SUhKaGRHaGxjaUIwYUdGdUlITmpjbVZsYmlCeVlYUnBiMXh1SUNBZ0lDQWdjR2w0Wld4U1lYUnBieUE5SUdKaGMyVlFhWGhsYkZKaGRHbHZPMXh1SUNBZ0lDQWdMeThnUkdWbVlYVnNkQ0IwYnlCaElIQnBlR1ZzSUhKaGRHbHZJRzltSURFZ2MyOGdkR2hoZENCNWIzVWdaVzVrSUhWd0lIZHBkR2dnZEdobElITmhiV1VnWkdsdFpXNXphVzl1WEc0Z0lDQWdJQ0F2THlCNWIzVWdjM0JsWTJsbWFXVmtMQ0JwTG1VdUlGc2dOVEF3TENBMU1EQWdYU0JwY3lCbGVIQnZjblJsWkNCaGN5QTFNREI0TlRBd0lIQjRYRzRnSUNBZ0lDQmxlSEJ2Y25SUWFYaGxiRkpoZEdsdklEMGdaR1ZtYVc1bFpDaHpaWFIwYVc1bmN5NWxlSEJ2Y25SUWFYaGxiRkpoZEdsdkxDQXhLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0x5OGdUbThnWkdsdFpXNXphVzl1SUdseklITndaV05wWm1sbFpDd2dZWE56ZFcxbElHWjFiR3d0YzJOeVpXVnVJSE5wZW1sdVoxeHVJQ0FnSUNBZ2NHbDRaV3hTWVhScGJ5QTlJR1JsZG1salpWQnBlR1ZzVW1GMGFXODdYRzRnSUNBZ0lDQXZMeUJFWldaaGRXeDBJSFJ2SUhOamNtVmxiaUJ3YVhobGJDQnlZWFJwYnl3Z2MyOGdkR2hoZENCcGRDZHpJR3hwYTJVZ2RHRnJhVzVuSUdFZ1pHVjJhV05sSUhOamNtVmxibk5vYjNSY2JpQWdJQ0FnSUdWNGNHOXlkRkJwZUdWc1VtRjBhVzhnUFNCa1pXWnBibVZrS0hObGRIUnBibWR6TG1WNGNHOXlkRkJwZUdWc1VtRjBhVzhzSUhCcGVHVnNVbUYwYVc4cE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHZJRU5zWVcxd0lIQnBlR1ZzSUhKaGRHbHZYRzRnSUdsbUlDaDBlWEJsYjJZZ2MyVjBkR2x1WjNNdWJXRjRVR2w0Wld4U1lYUnBieUE5UFQwZ0oyNTFiV0psY2ljZ0ppWWdhWE5HYVc1cGRHVW9jMlYwZEdsdVozTXViV0Y0VUdsNFpXeFNZWFJwYnlrcElIdGNiaUFnSUNCd2FYaGxiRkpoZEdsdklEMGdUV0YwYUM1dGFXNG9jMlYwZEdsdVozTXViV0Y0VUdsNFpXeFNZWFJwYnl3Z2NHbDRaV3hTWVhScGJ5azdYRzRnSUNBZ1pYaHdiM0owVUdsNFpXeFNZWFJwYnlBOUlFMWhkR2d1YldsdUtITmxkSFJwYm1kekxtMWhlRkJwZUdWc1VtRjBhVzhzSUdWNGNHOXlkRkJwZUdWc1VtRjBhVzhwTzF4dUlDQjlYRzVjYmlBZ0x5OGdTR0Z1Wkd4bElHVjRjRzl5ZENCd2FYaGxiQ0J5WVhScGIxeHVJQ0JwWmlBb1pYaHdiM0owYVc1bktTQjdYRzRnSUNBZ2NHbDRaV3hTWVhScGJ5QTlJR1Y0Y0c5eWRGQnBlR1ZzVW1GMGFXODdYRzRnSUgxY2JseHVJQ0F2THlCd1lYSmxiblJYYVdSMGFDQTlJSFI1Y0dWdlppQndZWEpsYm5SWGFXUjBhQ0E5UFQwZ0ozVnVaR1ZtYVc1bFpDY2dQeUJrWldaaGRXeDBUbTlrWlZOcGVtVmJNRjBnT2lCd1lYSmxiblJYYVdSMGFEdGNiaUFnTHk4Z2NHRnlaVzUwU0dWcFoyaDBJRDBnZEhsd1pXOW1JSEJoY21WdWRFaGxhV2RvZENBOVBUMGdKM1Z1WkdWbWFXNWxaQ2NnUHlCa1pXWmhkV3gwVG05a1pWTnBlbVZiTVYwZ09pQndZWEpsYm5SSVpXbG5hSFE3WEc1Y2JpQWdiR1YwSUZzZ2NHRnlaVzUwVjJsa2RHZ3NJSEJoY21WdWRFaGxhV2RvZENCZElEMGdaMlYwVUdGeVpXNTBVMmw2WlNod2NtOXdjeXdnYzJWMGRHbHVaM01wTzF4dUlDQnNaWFFnZEhKcGJWZHBaSFJvTENCMGNtbHRTR1ZwWjJoME8xeHVYRzRnSUM4dklGbHZkU0JqWVc0Z2MzQmxZMmxtZVNCaElHUnBiV1Z1YzJsdmJuTWdhVzRnY0dsNFpXeHpJRzl5SUdOdEwyMHZhVzR2WlhSalhHNGdJR2xtSUNob1lYTkVhVzFsYm5OcGIyNXpLU0I3WEc0Z0lDQWdZMjl1YzNRZ2NtVnpkV3gwSUQwZ1oyVjBSR2x0Wlc1emFXOXVjMFp5YjIxUWNtVnpaWFFvWkdsdFpXNXphVzl1Y3l3Z2RXNXBkSE1zSUhCcGVHVnNjMUJsY2tsdVkyZ3BPMXh1SUNBZ0lHTnZibk4wSUdocFoyaGxjM1FnUFNCTllYUm9MbTFoZUNoeVpYTjFiSFJiTUYwc0lISmxjM1ZzZEZzeFhTazdYRzRnSUNBZ1kyOXVjM1FnYkc5M1pYTjBJRDBnVFdGMGFDNXRhVzRvY21WemRXeDBXekJkTENCeVpYTjFiSFJiTVYwcE8xeHVJQ0FnSUdsbUlDaHpaWFIwYVc1bmN5NXZjbWxsYm5SaGRHbHZiaWtnZTF4dUlDQWdJQ0FnWTI5dWMzUWdiR0Z1WkhOallYQmxJRDBnYzJWMGRHbHVaM011YjNKcFpXNTBZWFJwYjI0Z1BUMDlJQ2RzWVc1a2MyTmhjR1VuTzF4dUlDQWdJQ0FnZDJsa2RHZ2dQU0JzWVc1a2MyTmhjR1VnUHlCb2FXZG9aWE4wSURvZ2JHOTNaWE4wTzF4dUlDQWdJQ0FnYUdWcFoyaDBJRDBnYkdGdVpITmpZWEJsSUQ4Z2JHOTNaWE4wSURvZ2FHbG5hR1Z6ZER0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdkMmxrZEdnZ1BTQnlaWE4xYkhSYk1GMDdYRzRnSUNBZ0lDQm9aV2xuYUhRZ1BTQnlaWE4xYkhSYk1WMDdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RISnBiVmRwWkhSb0lEMGdkMmxrZEdnN1hHNGdJQ0FnZEhKcGJVaGxhV2RvZENBOUlHaGxhV2RvZER0Y2JseHVJQ0FnSUM4dklFRndjR3g1SUdKc1pXVmtJSGRvYVdOb0lHbHpJR0Z6YzNWdFpXUWdkRzhnWW1VZ2FXNGdkR2hsSUhOaGJXVWdkVzVwZEhOY2JpQWdJQ0IzYVdSMGFDQXJQU0JpYkdWbFpDQXFJREk3WEc0Z0lDQWdhR1ZwWjJoMElDczlJR0pzWldWa0lDb2dNanRjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0IzYVdSMGFDQTlJSEJoY21WdWRGZHBaSFJvTzF4dUlDQWdJR2hsYVdkb2RDQTlJSEJoY21WdWRFaGxhV2RvZER0Y2JpQWdJQ0IwY21sdFYybGtkR2dnUFNCM2FXUjBhRHRjYmlBZ0lDQjBjbWx0U0dWcFoyaDBJRDBnYUdWcFoyaDBPMXh1SUNCOVhHNWNiaUFnTHk4Z1VtVmhiQ0J6YVhwbElHbHVJSEJwZUdWc2N5QmhablJsY2lCUVVFa2dhWE1nZEdGclpXNGdhVzUwYnlCaFkyTnZkVzUwWEc0Z0lHeGxkQ0J5WldGc1YybGtkR2dnUFNCM2FXUjBhRHRjYmlBZ2JHVjBJSEpsWVd4SVpXbG5hSFFnUFNCb1pXbG5hSFE3WEc0Z0lHbG1JQ2hvWVhORWFXMWxibk5wYjI1eklDWW1JSFZ1YVhSektTQjdYRzRnSUNBZ0x5OGdRMjl1ZG1WeWRDQjBieUJrYVdkcGRHRnNMM0JwZUdWc0lIVnVhWFJ6SUdsbUlHNWxZMlZ6YzJGeWVWeHVJQ0FnSUhKbFlXeFhhV1IwYUNBOUlHTnZiblpsY25SRWFYTjBZVzVqWlNoM2FXUjBhQ3dnZFc1cGRITXNJQ2R3ZUNjc0lIQnBlR1ZzYzFCbGNrbHVZMmdwTzF4dUlDQWdJSEpsWVd4SVpXbG5hSFFnUFNCamIyNTJaWEowUkdsemRHRnVZMlVvYUdWcFoyaDBMQ0IxYm1sMGN5d2dKM0I0Snl3Z2NHbDRaV3h6VUdWeVNXNWphQ2s3WEc0Z0lIMWNibHh1SUNBdkx5QkliM2NnWW1sbklIUnZJSE5sZENCMGFHVWdKM1pwWlhjbklHOW1JSFJvWlNCallXNTJZWE1nYVc0Z2RHaGxJR0p5YjNkelpYSWdLR2t1WlM0Z2MzUjViR1VwWEc0Z0lITjBlV3hsVjJsa2RHZ2dQU0JOWVhSb0xuSnZkVzVrS0hKbFlXeFhhV1IwYUNrN1hHNGdJSE4wZVd4bFNHVnBaMmgwSUQwZ1RXRjBhQzV5YjNWdVpDaHlaV0ZzU0dWcFoyaDBLVHRjYmx4dUlDQXZMeUJKWmlCM1pTQjNhWE5vSUhSdklITmpZV3hsSUhSb1pTQjJhV1YzSUhSdklIUm9aU0JpY205M2MyVnlJSGRwYm1SdmQxeHVJQ0JwWmlBb2MyTmhiR1ZVYjBacGRDQW1KaUFoWlhod2IzSjBhVzVuSUNZbUlHaGhjMFJwYldWdWMybHZibk1wSUh0Y2JpQWdJQ0JqYjI1emRDQmhjM0JsWTNRZ1BTQjNhV1IwYUNBdklHaGxhV2RvZER0Y2JpQWdJQ0JqYjI1emRDQjNhVzVrYjNkQmMzQmxZM1FnUFNCd1lYSmxiblJYYVdSMGFDQXZJSEJoY21WdWRFaGxhV2RvZER0Y2JpQWdJQ0JqYjI1emRDQnpZMkZzWlZSdlJtbDBVR0ZrWkdsdVp5QTlJR1JsWm1sdVpXUW9jMlYwZEdsdVozTXVjMk5oYkdWVWIwWnBkRkJoWkdScGJtY3NJRFF3S1R0Y2JpQWdJQ0JqYjI1emRDQnRZWGhYYVdSMGFDQTlJRTFoZEdndWNtOTFibVFvY0dGeVpXNTBWMmxrZEdnZ0xTQnpZMkZzWlZSdlJtbDBVR0ZrWkdsdVp5QXFJRElwTzF4dUlDQWdJR052Ym5OMElHMWhlRWhsYVdkb2RDQTlJRTFoZEdndWNtOTFibVFvY0dGeVpXNTBTR1ZwWjJoMElDMGdjMk5oYkdWVWIwWnBkRkJoWkdScGJtY2dLaUF5S1R0Y2JpQWdJQ0JwWmlBb2MzUjViR1ZYYVdSMGFDQStJRzFoZUZkcFpIUm9JSHg4SUhOMGVXeGxTR1ZwWjJoMElENGdiV0Y0U0dWcFoyaDBLU0I3WEc0Z0lDQWdJQ0JwWmlBb2QybHVaRzkzUVhOd1pXTjBJRDRnWVhOd1pXTjBLU0I3WEc0Z0lDQWdJQ0FnSUhOMGVXeGxTR1ZwWjJoMElEMGdiV0Y0U0dWcFoyaDBPMXh1SUNBZ0lDQWdJQ0J6ZEhsc1pWZHBaSFJvSUQwZ1RXRjBhQzV5YjNWdVpDaHpkSGxzWlVobGFXZG9kQ0FxSUdGemNHVmpkQ2s3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0J6ZEhsc1pWZHBaSFJvSUQwZ2JXRjRWMmxrZEdnN1hHNGdJQ0FnSUNBZ0lITjBlV3hsU0dWcFoyaDBJRDBnVFdGMGFDNXliM1Z1WkNoemRIbHNaVmRwWkhSb0lDOGdZWE53WldOMEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQmpZVzUyWVhOWGFXUjBhQ0E5SUhOallXeGxWRzlXYVdWM0lEOGdUV0YwYUM1eWIzVnVaQ2h3YVhobGJGSmhkR2x2SUNvZ2MzUjViR1ZYYVdSMGFDa2dPaUJOWVhSb0xuSnZkVzVrS0dWNGNHOXlkRkJwZUdWc1VtRjBhVzhnS2lCeVpXRnNWMmxrZEdncE8xeHVJQ0JqWVc1MllYTklaV2xuYUhRZ1BTQnpZMkZzWlZSdlZtbGxkeUEvSUUxaGRHZ3VjbTkxYm1Rb2NHbDRaV3hTWVhScGJ5QXFJSE4wZVd4bFNHVnBaMmgwS1NBNklFMWhkR2d1Y205MWJtUW9aWGh3YjNKMFVHbDRaV3hTWVhScGJ5QXFJSEpsWVd4SVpXbG5hSFFwTzF4dVhHNGdJR052Ym5OMElIWnBaWGR3YjNKMFYybGtkR2dnUFNCelkyRnNaVlJ2Vm1sbGR5QS9JRTFoZEdndWNtOTFibVFvYzNSNWJHVlhhV1IwYUNrZ09pQk5ZWFJvTG5KdmRXNWtLSEpsWVd4WGFXUjBhQ2s3WEc0Z0lHTnZibk4wSUhacFpYZHdiM0owU0dWcFoyaDBJRDBnYzJOaGJHVlViMVpwWlhjZ1B5Qk5ZWFJvTG5KdmRXNWtLSE4wZVd4bFNHVnBaMmgwS1NBNklFMWhkR2d1Y205MWJtUW9jbVZoYkVobGFXZG9kQ2s3WEc1Y2JpQWdZMjl1YzNRZ2MyTmhiR1ZZSUQwZ1kyRnVkbUZ6VjJsa2RHZ2dMeUIzYVdSMGFEdGNiaUFnWTI5dWMzUWdjMk5oYkdWWklEMGdZMkZ1ZG1GelNHVnBaMmgwSUM4Z2FHVnBaMmgwTzF4dVhHNGdJQzh2SUVGemMybG5iaUIwYnlCamRYSnlaVzUwSUhCeWIzQnpYRzRnSUhKbGRIVnliaUI3WEc0Z0lDQWdZbXhsWldRc1hHNGdJQ0FnY0dsNFpXeFNZWFJwYnl4Y2JpQWdJQ0IzYVdSMGFDeGNiaUFnSUNCb1pXbG5hSFFzWEc0Z0lDQWdaR2x0Wlc1emFXOXVjem9nV3lCM2FXUjBhQ3dnYUdWcFoyaDBJRjBzWEc0Z0lDQWdkVzVwZEhNNklIVnVhWFJ6SUh4OElDZHdlQ2NzWEc0Z0lDQWdjMk5oYkdWWUxGeHVJQ0FnSUhOallXeGxXU3hjYmlBZ0lDQjJhV1YzY0c5eWRGZHBaSFJvTEZ4dUlDQWdJSFpwWlhkd2IzSjBTR1ZwWjJoMExGeHVJQ0FnSUdOaGJuWmhjMWRwWkhSb0xGeHVJQ0FnSUdOaGJuWmhjMGhsYVdkb2RDeGNiaUFnSUNCMGNtbHRWMmxrZEdnc1hHNGdJQ0FnZEhKcGJVaGxhV2RvZEN4Y2JpQWdJQ0J6ZEhsc1pWZHBaSFJvTEZ4dUlDQWdJSE4wZVd4bFNHVnBaMmgwWEc0Z0lIMDdYRzU5WEc0aUxDSnRiMlIxYkdVdVpYaHdiM0owY3lBOUlHZGxkRU5oYm5aaGMwTnZiblJsZUhSY2JtWjFibU4wYVc5dUlHZGxkRU5oYm5aaGMwTnZiblJsZUhRZ0tIUjVjR1VzSUc5d2RITXBJSHRjYmlBZ2FXWWdLSFI1Y0dWdlppQjBlWEJsSUNFOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lIUm9jbTkzSUc1bGR5QlVlWEJsUlhKeWIzSW9KMjExYzNRZ2MzQmxZMmxtZVNCMGVYQmxJSE4wY21sdVp5Y3BYRzRnSUgxY2JseHVJQ0J2Y0hSeklEMGdiM0IwY3lCOGZDQjdmVnh1WEc0Z0lHbG1JQ2gwZVhCbGIyWWdaRzlqZFcxbGJuUWdQVDA5SUNkMWJtUmxabWx1WldRbklDWW1JQ0Z2Y0hSekxtTmhiblpoY3lrZ2UxeHVJQ0FnSUhKbGRIVnliaUJ1ZFd4c0lDOHZJR05vWldOcklHWnZjaUJPYjJSbFhHNGdJSDFjYmx4dUlDQjJZWElnWTJGdWRtRnpJRDBnYjNCMGN5NWpZVzUyWVhNZ2ZId2daRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnblkyRnVkbUZ6SnlsY2JpQWdhV1lnS0hSNWNHVnZaaUJ2Y0hSekxuZHBaSFJvSUQwOVBTQW5iblZ0WW1WeUp5a2dlMXh1SUNBZ0lHTmhiblpoY3k1M2FXUjBhQ0E5SUc5d2RITXVkMmxrZEdoY2JpQWdmVnh1SUNCcFppQW9kSGx3Wlc5bUlHOXdkSE11YUdWcFoyaDBJRDA5UFNBbmJuVnRZbVZ5SnlrZ2UxeHVJQ0FnSUdOaGJuWmhjeTVvWldsbmFIUWdQU0J2Y0hSekxtaGxhV2RvZEZ4dUlDQjlYRzVjYmlBZ2RtRnlJR0YwZEhKcFluTWdQU0J2Y0hSelhHNGdJSFpoY2lCbmJGeHVJQ0IwY25rZ2UxeHVJQ0FnSUhaaGNpQnVZVzFsY3lBOUlGc2dkSGx3WlNCZFhHNGdJQ0FnTHk4Z2NISmxabWw0SUVkTUlHTnZiblJsZUhSelhHNGdJQ0FnYVdZZ0tIUjVjR1V1YVc1a1pYaFBaaWduZDJWaVoyd25LU0E5UFQwZ01Da2dlMXh1SUNBZ0lDQWdibUZ0WlhNdWNIVnphQ2duWlhod1pYSnBiV1Z1ZEdGc0xTY2dLeUIwZVhCbEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUdadmNpQW9kbUZ5SUdrZ1BTQXdPeUJwSUR3Z2JtRnRaWE11YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNBZ0lHZHNJRDBnWTJGdWRtRnpMbWRsZEVOdmJuUmxlSFFvYm1GdFpYTmJhVjBzSUdGMGRISnBZbk1wWEc0Z0lDQWdJQ0JwWmlBb1oyd3BJSEpsZEhWeWJpQm5iRnh1SUNBZ0lIMWNiaUFnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUdkc0lEMGdiblZzYkZ4dUlDQjlYRzRnSUhKbGRIVnliaUFvWjJ3Z2ZId2diblZzYkNrZ0x5OGdaVzV6ZFhKbElHNTFiR3dnYjI0Z1ptRnBiRnh1ZlZ4dUlpd2lhVzF3YjNKMElHRnpjMmxuYmlCbWNtOXRJQ2R2WW1wbFkzUXRZWE56YVdkdUp6dGNibWx0Y0c5eWRDQm5aWFJEWVc1MllYTkRiMjUwWlhoMElHWnliMjBnSjJkbGRDMWpZVzUyWVhNdFkyOXVkR1Y0ZENjN1hHNXBiWEJ2Y25RZ2V5QnBjMEp5YjNkelpYSWdmU0JtY205dElDY3VMaTkxZEdsc0p6dGNibHh1Wm5WdVkzUnBiMjRnWTNKbFlYUmxRMkZ1ZG1GelJXeGxiV1Z1ZENBb0tTQjdYRzRnSUdsbUlDZ2hhWE5DY205M2MyVnlLQ2twSUh0Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KMGwwSUdGd2NHVmhjbk1nZVc5MUlHRnlaU0J5ZFc1cGJtY2dabkp2YlNCT2IyUmxMbXB6SUc5eUlHRWdibTl1TFdKeWIzZHpaWElnWlc1MmFYSnZibTFsYm5RdUlGUnllU0J3WVhOemFXNW5JR2x1SUdGdUlHVjRhWE4wYVc1bklIc2dZMkZ1ZG1GeklIMGdhVzUwWlhKbVlXTmxJR2x1YzNSbFlXUXVKeWs3WEc0Z0lIMWNiaUFnY21WMGRYSnVJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5Rb0oyTmhiblpoY3ljcE8xeHVmVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JtZFc1amRHbHZiaUJqY21WaGRHVkRZVzUyWVhNZ0tITmxkSFJwYm1keklEMGdlMzBwSUh0Y2JpQWdiR1YwSUdOdmJuUmxlSFFzSUdOaGJuWmhjenRjYmlBZ2JHVjBJRzkzYm5ORFlXNTJZWE1nUFNCbVlXeHpaVHRjYmlBZ2FXWWdLSE5sZEhScGJtZHpMbU5oYm5aaGN5QWhQVDBnWm1Gc2MyVXBJSHRjYmlBZ0lDQXZMeUJFWlhSbGNtMXBibVVnZEdobElHTmhiblpoY3lCaGJtUWdZMjl1ZEdWNGRDQjBieUJqY21WaGRHVmNiaUFnSUNCamIyNTBaWGgwSUQwZ2MyVjBkR2x1WjNNdVkyOXVkR1Y0ZER0Y2JpQWdJQ0JwWmlBb0lXTnZiblJsZUhRZ2ZId2dkSGx3Wlc5bUlHTnZiblJsZUhRZ1BUMDlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdJQ0JzWlhRZ2JtVjNRMkZ1ZG1GeklEMGdjMlYwZEdsdVozTXVZMkZ1ZG1Gek8xeHVJQ0FnSUNBZ2FXWWdLQ0Z1WlhkRFlXNTJZWE1wSUh0Y2JpQWdJQ0FnSUNBZ2JtVjNRMkZ1ZG1GeklEMGdZM0psWVhSbFEyRnVkbUZ6Uld4bGJXVnVkQ2dwTzF4dUlDQWdJQ0FnSUNCdmQyNXpRMkZ1ZG1GeklEMGdkSEoxWlR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUdOdmJuTjBJSFI1Y0dVZ1BTQmpiMjUwWlhoMElIeDhJQ2N5WkNjN1hHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlHNWxkME5oYm5aaGN5NW5aWFJEYjI1MFpYaDBJQ0U5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdWR2hsSUhOd1pXTnBabWxsWkNCN0lHTmhiblpoY3lCOUlHVnNaVzFsYm5RZ1pHOWxjeUJ1YjNRZ2FHRjJaU0JoSUdkbGRFTnZiblJsZUhRb0tTQm1kVzVqZEdsdmJpd2diV0Y1WW1VZ2FYUWdhWE1nYm05MElHRWdQR05oYm5aaGN6NGdkR0ZuUDJBcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ1kyOXVkR1Y0ZENBOUlHZGxkRU5oYm5aaGMwTnZiblJsZUhRb2RIbHdaU3dnWVhOemFXZHVLSHQ5TENCelpYUjBhVzVuY3k1aGRIUnlhV0oxZEdWekxDQjdJR05oYm5aaGN6b2dibVYzUTJGdWRtRnpJSDBwS1R0Y2JpQWdJQ0FnSUdsbUlDZ2hZMjl1ZEdWNGRDa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZRVpoYVd4bFpDQmhkQ0JqWVc1MllYTXVaMlYwUTI5dWRHVjRkQ2duSkh0MGVYQmxmU2NwSUMwZ2RHaGxJR0p5YjNkelpYSWdiV0Y1SUc1dmRDQnpkWEJ3YjNKMElIUm9hWE1nWTI5dWRHVjRkQ3dnYjNJZ1lTQmthV1ptWlhKbGJuUWdZMjl1ZEdWNGRDQnRZWGtnWVd4eVpXRmtlU0JpWlNCcGJpQjFjMlVnZDJsMGFDQjBhR2x6SUdOaGJuWmhjeTVnS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JqWVc1MllYTWdQU0JqYjI1MFpYaDBMbU5oYm5aaGN6dGNiaUFnSUNBdkx5QkZibk4xY21VZ1kyOXVkR1Y0ZENCdFlYUmphR1Z6SUhWelpYSW5jeUJqWVc1MllYTWdaWGh3WldOMFlYUnBiMjV6WEc0Z0lDQWdhV1lnS0hObGRIUnBibWR6TG1OaGJuWmhjeUFtSmlCallXNTJZWE1nSVQwOUlITmxkSFJwYm1kekxtTmhiblpoY3lrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkVWFHVWdleUJqWVc1MllYTWdmU0JoYm1RZ2V5QmpiMjUwWlhoMElIMGdjMlYwZEdsdVozTWdiWFZ6ZENCd2IybHVkQ0IwYnlCMGFHVWdjMkZ0WlNCMWJtUmxjbXg1YVc1bklHTmhiblpoY3lCbGJHVnRaVzUwSnlrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1FYQndiSGtnY0dsNFpXeGhkR2x2YmlCMGJ5QmpZVzUyWVhNZ2FXWWdibVZqWlhOellYSjVMQ0IwYUdseklHbHpJRzF2YzNSc2VTQmhJR052Ym5abGJtbGxibU5sSUhWMGFXeHBkSGxjYmlBZ0lDQnBaaUFvYzJWMGRHbHVaM011Y0dsNFpXeGhkR1ZrS1NCN1hHNGdJQ0FnSUNCamIyNTBaWGgwTG1sdFlXZGxVMjF2YjNSb2FXNW5SVzVoWW14bFpDQTlJR1poYkhObE8xeHVJQ0FnSUNBZ1kyOXVkR1Y0ZEM1dGIzcEpiV0ZuWlZOdGIyOTBhR2x1WjBWdVlXSnNaV1FnUFNCbVlXeHpaVHRjYmlBZ0lDQWdJR052Ym5SbGVIUXViMGx0WVdkbFUyMXZiM1JvYVc1blJXNWhZbXhsWkNBOUlHWmhiSE5sTzF4dUlDQWdJQ0FnWTI5dWRHVjRkQzUzWldKcmFYUkpiV0ZuWlZOdGIyOTBhR2x1WjBWdVlXSnNaV1FnUFNCbVlXeHpaVHRjYmlBZ0lDQWdJR052Ym5SbGVIUXViWE5KYldGblpWTnRiMjkwYUdsdVowVnVZV0pzWldRZ1BTQm1ZV3h6WlR0Y2JpQWdJQ0FnSUdOaGJuWmhjeTV6ZEhsc1pWc25hVzFoWjJVdGNtVnVaR1Z5YVc1bkoxMGdQU0FuY0dsNFpXeGhkR1ZrSnp0Y2JpQWdJQ0I5WEc0Z0lIMWNiaUFnY21WMGRYSnVJSHNnWTJGdWRtRnpMQ0JqYjI1MFpYaDBMQ0J2ZDI1elEyRnVkbUZ6SUgwN1hHNTlYRzRpTENKcGJYQnZjblFnWkdWbWFXNWxaQ0JtY205dElDZGtaV1pwYm1Wa0p6dGNibWx0Y0c5eWRDQmhjM05wWjI0Z1puSnZiU0FuYjJKcVpXTjBMV0Z6YzJsbmJpYzdYRzVwYlhCdmNuUWdjbWxuYUhST2IzY2dabkp2YlNBbmNtbG5hSFF0Ym05M0p6dGNibWx0Y0c5eWRDQnBjMUJ5YjIxcGMyVWdabkp2YlNBbmFYTXRjSEp2YldselpTYzdYRzVwYlhCdmNuUWdleUJwYzBKeWIzZHpaWElzSUdselYyVmlSMHhEYjI1MFpYaDBMQ0JwYzBOaGJuWmhjeXdnWjJWMFEyeHBaVzUwUVZCSklIMGdabkp2YlNBbkxpNHZkWFJwYkNjN1hHNXBiWEJ2Y25RZ1pHVmxjRVZ4ZFdGc0lHWnliMjBnSjJSbFpYQXRaWEYxWVd3bk8xeHVhVzF3YjNKMElIc2djMkYyWlVacGJHVXNJSE5oZG1WRVlYUmhWVkpNTENCblpYUkdhV3hsVG1GdFpTd2daWGh3YjNKMFEyRnVkbUZ6SUgwZ1puSnZiU0FuTGk0dmMyRjJaU2M3WEc1Y2JtbHRjRzl5ZENCclpYbGliMkZ5WkZOb2IzSjBZM1YwY3lCbWNtOXRJQ2N1TDJ0bGVXSnZZWEprVTJodmNuUmpkWFJ6Snp0Y2JtbHRjRzl5ZENCeVpYTnBlbVZEWVc1MllYTWdabkp2YlNBbkxpOXlaWE5wZW1WRFlXNTJZWE1uTzF4dWFXMXdiM0owSUdOeVpXRjBaVU5oYm5aaGN5Qm1jbTl0SUNjdUwyTnlaV0YwWlVOaGJuWmhjeWM3WEc1Y2JtTnNZWE56SUZOclpYUmphRTFoYm1GblpYSWdlMXh1SUNCamIyNXpkSEoxWTNSdmNpQW9LU0I3WEc0Z0lDQWdkR2hwY3k1ZmMyVjBkR2x1WjNNZ1BTQjdmVHRjYmlBZ0lDQjBhR2x6TGw5d2NtOXdjeUE5SUh0OU8xeHVJQ0FnSUhSb2FYTXVYM05yWlhSamFDQTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQjBhR2x6TGw5eVlXWWdQU0J1ZFd4c08xeHVYRzRnSUNBZ0x5OGdVMjl0WlNCb1lXTnJlU0IwYUdsdVozTWdjbVZ4ZFdseVpXUWdkRzhnWjJWMElHRnliM1Z1WkNCd05TNXFjeUJ6ZEhKMVkzUjFjbVZjYmlBZ0lDQjBhR2x6TGw5c1lYTjBVbVZrY21GM1VtVnpkV3gwSUQwZ2RXNWtaV1pwYm1Wa08xeHVJQ0FnSUhSb2FYTXVYMmx6VURWU1pYTnBlbWx1WnlBOUlHWmhiSE5sTzF4dVhHNGdJQ0FnZEdocGN5NWZhMlY1WW05aGNtUlRhRzl5ZEdOMWRITWdQU0JyWlhsaWIyRnlaRk5vYjNKMFkzVjBjeWg3WEc0Z0lDQWdJQ0JsYm1GaWJHVmtPaUFvS1NBOVBpQjBhR2x6TG5ObGRIUnBibWR6TG1odmRHdGxlWE1nSVQwOUlHWmhiSE5sTEZ4dUlDQWdJQ0FnYzJGMlpUb2dLR1YyS1NBOVBpQjdYRzRnSUNBZ0lDQWdJR2xtSUNobGRpNXphR2xtZEV0bGVTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbkpsWTI5eVpHbHVaeWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1bGJtUlNaV052Y21Rb0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjblZ1S0NrN1hHNGdJQ0FnSUNBZ0lDQWdmU0JsYkhObElIUm9hWE11Y21WamIzSmtLQ2s3WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0IwYUdsekxtVjRjRzl5ZEVaeVlXMWxLQ2s3WEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnZEc5bloyeGxVR3hoZVRvZ0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTV3YkdGNWFXNW5LU0IwYUdsekxuQmhkWE5sS0NrN1hHNGdJQ0FnSUNBZ0lHVnNjMlVnZEdocGN5NXdiR0Y1S0NrN1hHNGdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ1kyOXRiV2wwT2lBb1pYWXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVsZUhCdmNuUkdjbUZ0WlNoN0lHTnZiVzFwZERvZ2RISjFaU0I5S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1R0Y2JseHVJQ0FnSUhSb2FYTXVYMkZ1YVcxaGRHVklZVzVrYkdWeUlEMGdLQ2tnUFQ0Z2RHaHBjeTVoYm1sdFlYUmxLQ2s3WEc1Y2JpQWdJQ0IwYUdsekxsOXlaWE5wZW1WSVlXNWtiR1Z5SUQwZ0tDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMmhoYm1kbFpDQTlJSFJvYVhNdWNtVnphWHBsS0NrN1hHNGdJQ0FnSUNBdkx5QlBibXg1SUhKbExYSmxibVJsY2lCM2FHVnVJSE5wZW1VZ1lXTjBkV0ZzYkhrZ1kyaGhibWRsYzF4dUlDQWdJQ0FnYVdZZ0tHTm9ZVzVuWldRcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1eVpXNWtaWElvS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5TzF4dUlDQjlYRzVjYmlBZ1oyVjBJSE5yWlhSamFDQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDNOclpYUmphRHRjYmlBZ2ZWeHVYRzRnSUdkbGRDQnpaWFIwYVc1bmN5QW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDNObGRIUnBibWR6TzF4dUlDQjlYRzVjYmlBZ1oyVjBJSEJ5YjNCeklDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVmY0hKdmNITTdYRzRnSUgxY2JseHVJQ0JmWTI5dGNIVjBaVkJzWVhsb1pXRmtJQ2hqZFhKeVpXNTBWR2x0WlN3Z1pIVnlZWFJwYjI0cElIdGNiaUFnSUNCamIyNXpkQ0JvWVhORWRYSmhkR2x2YmlBOUlIUjVjR1Z2WmlCa2RYSmhkR2x2YmlBOVBUMGdKMjUxYldKbGNpY2dKaVlnYVhOR2FXNXBkR1VvWkhWeVlYUnBiMjRwTzF4dUlDQWdJSEpsZEhWeWJpQm9ZWE5FZFhKaGRHbHZiaUEvSUdOMWNuSmxiblJVYVcxbElDOGdaSFZ5WVhScGIyNGdPaUF3TzF4dUlDQjlYRzVjYmlBZ1gyTnZiWEIxZEdWR2NtRnRaU0FvY0d4aGVXaGxZV1FzSUhScGJXVXNJSFJ2ZEdGc1JuSmhiV1Z6TENCbWNITXBJSHRjYmlBZ0lDQnlaWFIxY200Z0tHbHpSbWx1YVhSbEtIUnZkR0ZzUm5KaGJXVnpLU0FtSmlCMGIzUmhiRVp5WVcxbGN5QStJREVwWEc0Z0lDQWdJQ0EvSUUxaGRHZ3VabXh2YjNJb2NHeGhlV2hsWVdRZ0tpQW9kRzkwWVd4R2NtRnRaWE1nTFNBeEtTbGNiaUFnSUNBZ0lEb2dUV0YwYUM1bWJHOXZjaWhtY0hNZ0tpQjBhVzFsS1R0Y2JpQWdmVnh1WEc0Z0lGOWpiMjF3ZFhSbFEzVnljbVZ1ZEVaeVlXMWxJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlkyOXRjSFYwWlVaeVlXMWxLRnh1SUNBZ0lDQWdkR2hwY3k1d2NtOXdjeTV3YkdGNWFHVmhaQ3dnZEdocGN5NXdjbTl3Y3k1MGFXMWxMRnh1SUNBZ0lDQWdkR2hwY3k1d2NtOXdjeTUwYjNSaGJFWnlZVzFsY3l3Z2RHaHBjeTV3Y205d2N5NW1jSE5jYmlBZ0lDQXBPMXh1SUNCOVhHNWNiaUFnWDJkbGRGTnBlbVZRY205d2N5QW9LU0I3WEc0Z0lDQWdZMjl1YzNRZ2NISnZjSE1nUFNCMGFHbHpMbkJ5YjNCek8xeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0IzYVdSMGFEb2djSEp2Y0hNdWQybGtkR2dzWEc0Z0lDQWdJQ0JvWldsbmFIUTZJSEJ5YjNCekxtaGxhV2RvZEN4Y2JpQWdJQ0FnSUhCcGVHVnNVbUYwYVc4NklIQnliM0J6TG5CcGVHVnNVbUYwYVc4c1hHNGdJQ0FnSUNCallXNTJZWE5YYVdSMGFEb2djSEp2Y0hNdVkyRnVkbUZ6VjJsa2RHZ3NYRzRnSUNBZ0lDQmpZVzUyWVhOSVpXbG5hSFE2SUhCeWIzQnpMbU5oYm5aaGMwaGxhV2RvZEN4Y2JpQWdJQ0FnSUhacFpYZHdiM0owVjJsa2RHZzZJSEJ5YjNCekxuWnBaWGR3YjNKMFYybGtkR2dzWEc0Z0lDQWdJQ0IyYVdWM2NHOXlkRWhsYVdkb2REb2djSEp2Y0hNdWRtbGxkM0J2Y25SSVpXbG5hSFJjYmlBZ0lDQjlPMXh1SUNCOVhHNWNiaUFnY25WdUlDZ3BJSHRjYmlBZ0lDQnBaaUFvSVhSb2FYTXVjMnRsZEdOb0tTQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0ozTm9iM1ZzWkNCM1lXbDBJSFZ1ZEdsc0lITnJaWFJqYUNCcGN5QnNiMkZrWldRZ1ltVm1iM0psSUhSeWVXbHVaeUIwYnlCd2JHRjVLQ2tuS1R0Y2JseHVJQ0FnSUM4dklGTjBZWEowSUdGdUlHRnVhVzFoZEdsdmJpQm1jbUZ0WlNCc2IyOXdJR2xtSUc1bFkyVnpjMkZ5ZVZ4dUlDQWdJR2xtSUNoMGFHbHpMbk5sZEhScGJtZHpMbkJzWVhscGJtY2dJVDA5SUdaaGJITmxLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuQnNZWGtvS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCTVpYUW5jeUJzWlhRZ2RHaHBjeUIzWVhKdWFXNW5JR2hoYm1jZ1lYSnZkVzVrSUdadmNpQmhJR1psZHlCMlpYSnphVzl1Y3k0dUxseHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV6YTJWMFkyZ3VaR2x6Y0c5elpTQTlQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHVJQ0FnSUNBZ1kyOXVjMjlzWlM1M1lYSnVLQ2RKYmlCallXNTJZWE10YzJ0bGRHTm9RREF1TUM0eU15QjBhR1VnWkdsemNHOXpaU2dwSUdWMlpXNTBJR2hoY3lCaVpXVnVJSEpsYm1GdFpXUWdkRzhnZFc1c2IyRmtLQ2tuS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCSmJpQmpZWE5sSUhkbElHRnlaVzRuZENCd2JHRjVhVzVuSUc5eUlHRnVhVzFoZEdWa0xDQnRZV3RsSUhOMWNtVWdkMlVnYzNScGJHd2dkSEpwWjJkbGNpQmlaV2RwYmlCdFpYTnpZV2RsTGk0dVhHNGdJQ0FnYVdZZ0tDRjBhR2x6TG5CeWIzQnpMbk4wWVhKMFpXUXBJSHRjYmlBZ0lDQWdJSFJvYVhNdVgzTnBaMjVoYkVKbFoybHVLQ2s3WEc0Z0lDQWdJQ0IwYUdsekxuQnliM0J6TG5OMFlYSjBaV1FnUFNCMGNuVmxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJRkpsYm1SbGNpQmhiaUJwYm1sMGFXRnNJR1p5WVcxbFhHNGdJQ0FnZEdocGN5NTBhV05yS0NrN1hHNGdJQ0FnZEdocGN5NXlaVzVrWlhJb0tUdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN6dGNiaUFnZlZ4dVhHNGdJSEJzWVhrZ0tDa2dlMXh1SUNBZ0lHeGxkQ0JoYm1sdFlYUmxJRDBnZEdocGN5NXpaWFIwYVc1bmN5NWhibWx0WVhSbE8xeHVJQ0FnSUdsbUlDZ25ZVzVwYldGMGFXOXVKeUJwYmlCMGFHbHpMbk5sZEhScGJtZHpLU0I3WEc0Z0lDQWdJQ0JoYm1sdFlYUmxJRDBnZEhKMVpUdGNiaUFnSUNBZ0lHTnZibk52YkdVdWQyRnliaWduVzJOaGJuWmhjeTF6YTJWMFkyaGRJSHNnWVc1cGJXRjBhVzl1SUgwZ2FHRnpJR0psWlc0Z2NtVnVZVzFsWkNCMGJ5QjdJR0Z1YVcxaGRHVWdmU2NwTzF4dUlDQWdJSDFjYmlBZ0lDQnBaaUFvSVdGdWFXMWhkR1VwSUhKbGRIVnlianRjYmlBZ0lDQnBaaUFvSVdselFuSnZkM05sY2lncEtTQjdYRzRnSUNBZ0lDQmpiMjV6YjJ4bExtVnljbTl5S0NkYlkyRnVkbUZ6TFhOclpYUmphRjBnVjBGU1Rqb2dWWE5wYm1jZ2V5QmhibWx0WVhSbElIMGdhVzRnVG05a1pTNXFjeUJwY3lCdWIzUWdlV1YwSUhOMWNIQnZjblJsWkNjcE8xeHVJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJSDFjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1d2JHRjVhVzVuS1NCeVpYUjFjbTQ3WEc0Z0lDQWdhV1lnS0NGMGFHbHpMbkJ5YjNCekxuTjBZWEowWldRcElIdGNiaUFnSUNBZ0lIUm9hWE11WDNOcFoyNWhiRUpsWjJsdUtDazdYRzRnSUNBZ0lDQjBhR2x6TG5CeWIzQnpMbk4wWVhKMFpXUWdQU0IwY25WbE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklHTnZibk52YkdVdWJHOW5LQ2R3YkdGNUp5d2dkR2hwY3k1d2NtOXdjeTUwYVcxbEtWeHVYRzRnSUNBZ0x5OGdVM1JoY25RZ1lTQnlaVzVrWlhJZ2JHOXZjRnh1SUNBZ0lIUm9hWE11Y0hKdmNITXVjR3hoZVdsdVp5QTlJSFJ5ZFdVN1hHNGdJQ0FnYVdZZ0tIUm9hWE11WDNKaFppQWhQU0J1ZFd4c0tTQjNhVzVrYjNjdVkyRnVZMlZzUVc1cGJXRjBhVzl1Um5KaGJXVW9kR2hwY3k1ZmNtRm1LVHRjYmlBZ0lDQjBhR2x6TGw5c1lYTjBWR2x0WlNBOUlISnBaMmgwVG05M0tDazdYRzRnSUNBZ2RHaHBjeTVmY21GbUlEMGdkMmx1Wkc5M0xuSmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU2gwYUdsekxsOWhibWx0WVhSbFNHRnVaR3hsY2lrN1hHNGdJSDFjYmx4dUlDQndZWFZ6WlNBb0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11Y21WamIzSmthVzVuS1NCMGFHbHpMbVZ1WkZKbFkyOXlaQ2dwTzF4dUlDQWdJSFJvYVhNdWNISnZjSE11Y0d4aGVXbHVaeUE5SUdaaGJITmxPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVYM0poWmlBaFBTQnVkV3hzSUNZbUlHbHpRbkp2ZDNObGNpZ3BLU0I3WEc0Z0lDQWdJQ0IzYVc1a2IzY3VZMkZ1WTJWc1FXNXBiV0YwYVc5dVJuSmhiV1VvZEdocGN5NWZjbUZtS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCMGIyZG5iR1ZRYkdGNUlDZ3BJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1d2JHRjVhVzVuS1NCMGFHbHpMbkJoZFhObEtDazdYRzRnSUNBZ1pXeHpaU0IwYUdsekxuQnNZWGtvS1R0Y2JpQWdmVnh1WEc0Z0lDOHZJRk4wYjNBZ1lXNWtJSEpsYzJWMElIUnZJR1p5WVcxbElIcGxjbTljYmlBZ2MzUnZjQ0FvS1NCN1hHNGdJQ0FnZEdocGN5NXdZWFZ6WlNncE8xeHVJQ0FnSUhSb2FYTXVjSEp2Y0hNdVpuSmhiV1VnUFNBd08xeHVJQ0FnSUhSb2FYTXVjSEp2Y0hNdWNHeGhlV2hsWVdRZ1BTQXdPMXh1SUNBZ0lIUm9hWE11Y0hKdmNITXVkR2x0WlNBOUlEQTdYRzRnSUNBZ2RHaHBjeTV3Y205d2N5NWtaV3gwWVZScGJXVWdQU0F3TzF4dUlDQWdJSFJvYVhNdWNISnZjSE11YzNSaGNuUmxaQ0E5SUdaaGJITmxPMXh1SUNBZ0lIUm9hWE11Y21WdVpHVnlLQ2s3WEc0Z0lIMWNibHh1SUNCeVpXTnZjbVFnS0NrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbkpsWTI5eVpHbHVaeWtnY21WMGRYSnVPMXh1SUNBZ0lHbG1JQ2doYVhOQ2NtOTNjMlZ5S0NrcElIdGNiaUFnSUNBZ0lHTnZibk52YkdVdVpYSnliM0lvSjF0allXNTJZWE10YzJ0bGRHTm9YU0JYUVZKT09pQlNaV052Y21ScGJtY2dabkp2YlNCT2IyUmxMbXB6SUdseklHNXZkQ0I1WlhRZ2MzVndjRzl5ZEdWa0p5azdYRzRnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NXpkRzl3S0NrN1hHNGdJQ0FnZEdocGN5NXdjbTl3Y3k1d2JHRjVhVzVuSUQwZ2RISjFaVHRjYmlBZ0lDQjBhR2x6TG5CeWIzQnpMbkpsWTI5eVpHbHVaeUE5SUhSeWRXVTdYRzVjYmlBZ0lDQmpiMjV6ZENCbWNtRnRaVWx1ZEdWeWRtRnNJRDBnTVNBdklIUm9hWE11Y0hKdmNITXVabkJ6TzF4dUlDQWdJQzh2SUZKbGJtUmxjaUJsWVdOb0lHWnlZVzFsSUdsdUlIUm9aU0J6WlhGMVpXNWpaVnh1SUNBZ0lHbG1JQ2gwYUdsekxsOXlZV1lnSVQwZ2JuVnNiQ2tnZDJsdVpHOTNMbU5oYm1ObGJFRnVhVzFoZEdsdmJrWnlZVzFsS0hSb2FYTXVYM0poWmlrN1hHNGdJQ0FnWTI5dWMzUWdkR2xqYXlBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1d2NtOXdjeTV5WldOdmNtUnBibWNwSUhKbGRIVnliaUJRY205dGFYTmxMbkpsYzI5c2RtVW9LVHRjYmlBZ0lDQWdJSFJvYVhNdWNISnZjSE11WkdWc2RHRlVhVzFsSUQwZ1puSmhiV1ZKYm5SbGNuWmhiRHRjYmlBZ0lDQWdJSFJvYVhNdWRHbGpheWdwTzF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVpYaHdiM0owUm5KaGJXVW9leUJ6WlhGMVpXNWpaVG9nZEhKMVpTQjlLVnh1SUNBZ0lDQWdJQ0F1ZEdobGJpZ29LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0NGMGFHbHpMbkJ5YjNCekxuSmxZMjl5WkdsdVp5a2djbVYwZFhKdU95QXZMeUIzWVhNZ1kyRnVZMlZzYkdWa0lHSmxabTl5WlZ4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11Y0hKdmNITXVaR1ZzZEdGVWFXMWxJRDBnTUR0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5CeWIzQnpMbVp5WVcxbEt5czdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVabkpoYldVZ1BDQjBhR2x6TG5CeWIzQnpMblJ2ZEdGc1JuSmhiV1Z6S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxuQnliM0J6TG5ScGJXVWdLejBnWm5KaGJXVkpiblJsY25aaGJEdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjSEp2Y0hNdWNHeGhlV2hsWVdRZ1BTQjBhR2x6TGw5amIyMXdkWFJsVUd4aGVXaGxZV1FvZEdocGN5NXdjbTl3Y3k1MGFXMWxMQ0IwYUdsekxuQnliM0J6TG1SMWNtRjBhVzl1S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgzSmhaaUE5SUhkcGJtUnZkeTV5WlhGMVpYTjBRVzVwYldGMGFXOXVSbkpoYldVb2RHbGpheWs3WEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR052Ym5OdmJHVXViRzluS0NkR2FXNXBjMmhsWkNCeVpXTnZjbVJwYm1jbktUdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYM05wWjI1aGJFVnVaQ2dwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1bGJtUlNaV052Y21Rb0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjM1J2Y0NncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXlkVzRvS1R0Y2JpQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJSDA3WEc1Y2JpQWdJQ0F2THlCVWNtbG5aMlZ5SUdFZ2MzUmhjblFnWlhabGJuUWdZbVZtYjNKbElIZGxJR0psWjJsdUlISmxZMjl5WkdsdVoxeHVJQ0FnSUdsbUlDZ2hkR2hwY3k1d2NtOXdjeTV6ZEdGeWRHVmtLU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOXphV2R1WVd4Q1pXZHBiaWdwTzF4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1emRHRnlkR1ZrSUQwZ2RISjFaVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TGw5eVlXWWdQU0IzYVc1a2IzY3VjbVZ4ZFdWemRFRnVhVzFoZEdsdmJrWnlZVzFsS0hScFkyc3BPMXh1SUNCOVhHNWNiaUFnWDNOcFoyNWhiRUpsWjJsdUlDZ3BJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NXphMlYwWTJnZ0ppWWdkSGx3Wlc5bUlIUm9hWE11YzJ0bGRHTm9MbUpsWjJsdUlEMDlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbDkzY21Gd1EyOXVkR1Y0ZEZOallXeGxLSEJ5YjNCeklEMCtJSFJvYVhNdWMydGxkR05vTG1KbFoybHVLSEJ5YjNCektTazdYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdYM05wWjI1aGJFVnVaQ0FvS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11YzJ0bGRHTm9JQ1ltSUhSNWNHVnZaaUIwYUdsekxuTnJaWFJqYUM1bGJtUWdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lIUm9hWE11WDNkeVlYQkRiMjUwWlhoMFUyTmhiR1VvY0hKdmNITWdQVDRnZEdocGN5NXphMlYwWTJndVpXNWtLSEJ5YjNCektTazdYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdaVzVrVW1WamIzSmtJQ2dwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTVmY21GbUlDRTlJRzUxYkd3Z0ppWWdhWE5DY205M2MyVnlLQ2twSUhkcGJtUnZkeTVqWVc1alpXeEJibWx0WVhScGIyNUdjbUZ0WlNoMGFHbHpMbDl5WVdZcE8xeHVJQ0FnSUhSb2FYTXVjSEp2Y0hNdWNtVmpiM0prYVc1bklEMGdabUZzYzJVN1hHNGdJQ0FnZEdocGN5NXdjbTl3Y3k1a1pXeDBZVlJwYldVZ1BTQXdPMXh1SUNBZ0lIUm9hWE11Y0hKdmNITXVjR3hoZVdsdVp5QTlJR1poYkhObE8xeHVJQ0I5WEc1Y2JpQWdaWGh3YjNKMFJuSmhiV1VnS0c5d2RDQTlJSHQ5S1NCN1hHNGdJQ0FnYVdZZ0tDRjBhR2x6TG5OclpYUmphQ2tnY21WMGRYSnVJRkJ5YjIxcGMyVXVZV3hzS0Z0ZEtUdGNiaUFnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YzJ0bGRHTm9MbkJ5WlVWNGNHOXlkQ0E5UFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdkR2hwY3k1emEyVjBZMmd1Y0hKbFJYaHdiM0owS0NrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1QzQjBhVzl1Y3lCbWIzSWdaWGh3YjNKMElHWjFibU4wYVc5dVhHNGdJQ0FnYkdWMElHVjRjRzl5ZEU5d2RITWdQU0JoYzNOcFoyNG9lMXh1SUNBZ0lDQWdjMlZ4ZFdWdVkyVTZJRzl3ZEM1elpYRjFaVzVqWlN4Y2JpQWdJQ0FnSUdaeVlXMWxPaUJ2Y0hRdWMyVnhkV1Z1WTJVZ1B5QjBhR2x6TG5CeWIzQnpMbVp5WVcxbElEb2dkVzVrWldacGJtVmtMRnh1SUNBZ0lDQWdabWxzWlRvZ2RHaHBjeTV6WlhSMGFXNW5jeTVtYVd4bExGeHVJQ0FnSUNBZ2JtRnRaVG9nZEdocGN5NXpaWFIwYVc1bmN5NXVZVzFsTEZ4dUlDQWdJQ0FnY0hKbFptbDRPaUIwYUdsekxuTmxkSFJwYm1kekxuQnlaV1pwZUN4Y2JpQWdJQ0FnSUhOMVptWnBlRG9nZEdocGN5NXpaWFIwYVc1bmN5NXpkV1ptYVhnc1hHNGdJQ0FnSUNCbGJtTnZaR2x1WnpvZ2RHaHBjeTV6WlhSMGFXNW5jeTVsYm1OdlpHbHVaeXhjYmlBZ0lDQWdJR1Z1WTI5a2FXNW5VWFZoYkdsMGVUb2dkR2hwY3k1elpYUjBhVzVuY3k1bGJtTnZaR2x1WjFGMVlXeHBkSGtzWEc0Z0lDQWdJQ0IwYVcxbFUzUmhiWEE2SUdkbGRFWnBiR1ZPWVcxbEtDa3NYRzRnSUNBZ0lDQjBiM1JoYkVaeVlXMWxjem9nYVhOR2FXNXBkR1VvZEdocGN5NXdjbTl3Y3k1MGIzUmhiRVp5WVcxbGN5a2dQeUJOWVhSb0xtMWhlQ2d4TURBc0lIUm9hWE11Y0hKdmNITXVkRzkwWVd4R2NtRnRaWE1wSURvZ01UQXdNRnh1SUNBZ0lIMHBPMXh1WEc0Z0lDQWdZMjl1YzNRZ1kyeHBaVzUwSUQwZ1oyVjBRMnhwWlc1MFFWQkpLQ2s3WEc0Z0lDQWdiR1YwSUhBZ1BTQlFjbTl0YVhObExuSmxjMjlzZG1Vb0tUdGNiaUFnSUNCcFppQW9ZMnhwWlc1MElDWW1JRzl3ZEM1amIyMXRhWFFnSmlZZ2RIbHdaVzltSUdOc2FXVnVkQzVqYjIxdGFYUWdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lHTnZibk4wSUdOdmJXMXBkRTl3ZEhNZ1BTQmhjM05wWjI0b2UzMHNJR1Y0Y0c5eWRFOXdkSE1wTzF4dUlDQWdJQ0FnWTI5dWMzUWdhR0Z6YUNBOUlHTnNhV1Z1ZEM1amIyMXRhWFFvWTI5dGJXbDBUM0IwY3lrN1hHNGdJQ0FnSUNCcFppQW9hWE5RY205dGFYTmxLR2hoYzJncEtTQndJRDBnYUdGemFEdGNiaUFnSUNBZ0lHVnNjMlVnY0NBOUlGQnliMjFwYzJVdWNtVnpiMngyWlNob1lYTm9LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z2NDNTBhR1Z1S0doaGMyZ2dQVDRnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVgyUnZSWGh3YjNKMFJuSmhiV1VvWVhOemFXZHVLSHQ5TENCbGVIQnZjblJQY0hSekxDQjdJR2hoYzJnNklHaGhjMmdnZkh3Z0p5Y2dmU2twTzF4dUlDQWdJSDBwTzF4dUlDQjlYRzVjYmlBZ1gyUnZSWGh3YjNKMFJuSmhiV1VnS0dWNGNHOXlkRTl3ZEhNZ1BTQjdmU2tnZTF4dUlDQWdJSFJvYVhNdVgzQnliM0J6TG1WNGNHOXlkR2x1WnlBOUlIUnlkV1U3WEc1Y2JpQWdJQ0F2THlCU1pYTnBlbVVnZEc4Z2IzVjBjSFYwSUhKbGMyOXNkWFJwYjI1Y2JpQWdJQ0IwYUdsekxuSmxjMmw2WlNncE8xeHVYRzRnSUNBZ0x5OGdSSEpoZHlCaGRDQjBhR2x6SUc5MWRIQjFkQ0J5WlhOdmJIVjBhVzl1WEc0Z0lDQWdiR1YwSUdSeVlYZFNaWE4xYkhRZ1BTQjBhR2x6TG5KbGJtUmxjaWdwTzF4dVhHNGdJQ0FnTHk4Z1ZHaGxJSE5sYkdZZ2IzZHVaV1FnWTJGdWRtRnpJQ2h0WVhrZ1ltVWdkVzVrWldacGJtVmtMaTR1SVNsY2JpQWdJQ0JqYjI1emRDQmpZVzUyWVhNZ1BTQjBhR2x6TG5CeWIzQnpMbU5oYm5aaGN6dGNibHh1SUNBZ0lDOHZJRWRsZENCc2FYTjBJRzltSUhKbGMzVnNkSE1nWm5KdmJTQnlaVzVrWlhKY2JpQWdJQ0JwWmlBb2RIbHdaVzltSUdSeVlYZFNaWE4xYkhRZ1BUMDlJQ2QxYm1SbFptbHVaV1FuS1NCN1hHNGdJQ0FnSUNCa2NtRjNVbVZ6ZFd4MElEMGdXeUJqWVc1MllYTWdYVHRjYmlBZ0lDQjlYRzRnSUNBZ1pISmhkMUpsYzNWc2RDQTlJRnRkTG1OdmJtTmhkQ2hrY21GM1VtVnpkV3gwS1M1bWFXeDBaWElvUW05dmJHVmhiaWs3WEc1Y2JpQWdJQ0F2THlCVWNtRnVjMlp2Y20wZ2RHaGxJR05oYm5aaGN5OW1hV3hsSUdSbGMyTnlhWEIwYjNKeklHbHVkRzhnWVNCamIyNXphWE4wWlc1MElHWnZjbTFoZEN4Y2JpQWdJQ0F2THlCaGJtUWdjSFZzYkNCdmRYUWdZVzU1SUdSaGRHRWdWVkpNY3lCbWNtOXRJR05oYm5aaGN5QmxiR1Z0Wlc1MGMxeHVJQ0FnSUdSeVlYZFNaWE4xYkhRZ1BTQmtjbUYzVW1WemRXeDBMbTFoY0NoeVpYTjFiSFFnUFQ0Z2UxeHVJQ0FnSUNBZ1kyOXVjM1FnYUdGelJHRjBZVTlpYW1WamRDQTlJSFI1Y0dWdlppQnlaWE4xYkhRZ1BUMDlJQ2R2WW1wbFkzUW5JQ1ltSUhKbGMzVnNkQ0FtSmlBb0oyUmhkR0VuSUdsdUlISmxjM1ZzZENCOGZDQW5aR0YwWVZWU1RDY2dhVzRnY21WemRXeDBLVHRjYmlBZ0lDQWdJR052Ym5OMElHUmhkR0VnUFNCb1lYTkVZWFJoVDJKcVpXTjBJRDhnY21WemRXeDBMbVJoZEdFZ09pQnlaWE4xYkhRN1hHNGdJQ0FnSUNCamIyNXpkQ0J2Y0hSeklEMGdhR0Z6UkdGMFlVOWlhbVZqZENBL0lHRnpjMmxuYmloN2ZTd2djbVZ6ZFd4MExDQjdJR1JoZEdFZ2ZTa2dPaUI3SUdSaGRHRWdmVHRjYmlBZ0lDQWdJR2xtSUNocGMwTmhiblpoY3loa1lYUmhLU2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JsYm1OdlpHbHVaeUE5SUc5d2RITXVaVzVqYjJScGJtY2dmSHdnWlhod2IzSjBUM0IwY3k1bGJtTnZaR2x1Wnp0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWlc1amIyUnBibWRSZFdGc2FYUjVJRDBnWkdWbWFXNWxaQ2h2Y0hSekxtVnVZMjlrYVc1blVYVmhiR2wwZVN3Z1pYaHdiM0owVDNCMGN5NWxibU52WkdsdVoxRjFZV3hwZEhrc0lEQXVPVFVwTzF4dUlDQWdJQ0FnSUNCamIyNXpkQ0I3SUdSaGRHRlZVa3dzSUdWNGRHVnVjMmx2Yml3Z2RIbHdaU0I5SUQwZ1pYaHdiM0owUTJGdWRtRnpLR1JoZEdFc0lIc2daVzVqYjJScGJtY3NJR1Z1WTI5a2FXNW5VWFZoYkdsMGVTQjlLVHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRTlpYW1WamRDNWhjM05wWjI0b2IzQjBjeXdnZXlCa1lYUmhWVkpNTENCbGVIUmxibk5wYjI0c0lIUjVjR1VnZlNrN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYjNCMGN6dGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtUdGNibHh1SUNBZ0lDOHZJRTV2ZHlCeVpYUjFjbTRnZEc4Z2NtVm5kV3hoY2lCeVpXNWtaWEpwYm1jZ2JXOWtaVnh1SUNBZ0lIUm9hWE11WDNCeWIzQnpMbVY0Y0c5eWRHbHVaeUE5SUdaaGJITmxPMXh1SUNBZ0lIUm9hWE11Y21WemFYcGxLQ2s3WEc0Z0lDQWdkR2hwY3k1eVpXNWtaWElvS1R0Y2JseHVJQ0FnSUM4dklFRnVaQ0J1YjNjZ2QyVWdZMkZ1SUhOaGRtVWdaV0ZqYUNCeVpYTjFiSFJjYmlBZ0lDQnlaWFIxY200Z1VISnZiV2x6WlM1aGJHd29aSEpoZDFKbGMzVnNkQzV0WVhBb0tISmxjM1ZzZEN3Z2FTd2diR0Y1WlhKTWFYTjBLU0E5UGlCN1hHNGdJQ0FnSUNBdkx5QkNlU0JrWldaaGRXeDBMQ0JwWmlCeVpXNWtaWEpwYm1jZ2JYVnNkR2x3YkdVZ2JHRjVaWEp6SUhkbElIZHBiR3dnWjJsMlpTQjBhR1Z0SUdsdVpHbGpaWE5jYmlBZ0lDQWdJR052Ym5OMElHTjFjazl3ZENBOUlHRnpjMmxuYmloN2ZTd2daWGh3YjNKMFQzQjBjeXdnY21WemRXeDBMQ0I3SUd4aGVXVnlPaUJwTENCMGIzUmhiRXhoZVdWeWN6b2diR0Y1WlhKTWFYTjBMbXhsYm1kMGFDQjlLVHRjYmlBZ0lDQWdJR052Ym5OMElHUmhkR0VnUFNCeVpYTjFiSFF1WkdGMFlUdGNiaUFnSUNBZ0lHbG1JQ2h5WlhOMWJIUXVaR0YwWVZWU1RDa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQmtZWFJoVlZKTUlEMGdjbVZ6ZFd4MExtUmhkR0ZWVWt3N1hHNGdJQ0FnSUNBZ0lHUmxiR1YwWlNCamRYSlBjSFF1WkdGMFlWVlNURHNnTHk4Z1lYWnZhV1FnYzJWdVpHbHVaeUJsYm5ScGNtVWdZbUZ6WlRZMElHUmhkR0VnWVhKdmRXNWtYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnpZWFpsUkdGMFlWVlNUQ2hrWVhSaFZWSk1MQ0JqZFhKUGNIUXBPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlITmhkbVZHYVd4bEtHUmhkR0VzSUdOMWNrOXdkQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2twTG5Sb1pXNG9aWFlnUFQ0Z2UxeHVJQ0FnSUNBZ2FXWWdLR1YyTG14bGJtZDBhQ0ErSURBcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1pYWmxiblJYYVhSb1QzVjBjSFYwSUQwZ1pYWXVabWx1WkNobElEMCtJR1V1YjNWMGNIVjBUbUZ0WlNrN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdselEyeHBaVzUwSUQwZ1pYWXVjMjl0WlNobElEMCtJR1V1WTJ4cFpXNTBLVHRjYmlBZ0lDQWdJQ0FnYkdWMElHbDBaVzA3WEc0Z0lDQWdJQ0FnSUM4dklHMWhibmtnWm1sc1pYTXNJR3AxYzNRZ2JHOW5JR2h2ZHlCdFlXNTVJSGRsY21VZ1pYaHdiM0owWldSY2JpQWdJQ0FnSUNBZ2FXWWdLR1YyTG14bGJtZDBhQ0ErSURFcElHbDBaVzBnUFNCbGRpNXNaVzVuZEdnN1hHNGdJQ0FnSUNBZ0lDOHZJR2x1SUVOTVNTd2dkMlVnYTI1dmR5QmxlR0ZqZENCd1lYUm9JR1JwY201aGJXVmNiaUFnSUNBZ0lDQWdaV3h6WlNCcFppQW9aWFpsYm5SWGFYUm9UM1YwY0hWMEtTQnBkR1Z0SUQwZ1lDUjdaWFpsYm5SWGFYUm9UM1YwY0hWMExtOTFkSEIxZEU1aGJXVjlMeVI3WlhaYk1GMHVabWxzWlc1aGJXVjlZRHRjYmlBZ0lDQWdJQ0FnTHk4Z2FXNGdZbkp2ZDNObGNpd2dkMlVnWTJGdUlHOXViSGtnYTI1dmR5QnBkQ0IzWlc1MElIUnZJRndpWW5KdmQzTmxjaUJrYjNkdWJHOWhaQ0JtYjJ4a1pYSmNJbHh1SUNBZ0lDQWdJQ0JsYkhObElHbDBaVzBnUFNCZ0pIdGxkbHN3WFM1bWFXeGxibUZ0WlgxZ08xeHVJQ0FnSUNBZ0lDQnNaWFFnYjJaVFpYRWdQU0FuSnp0Y2JpQWdJQ0FnSUNBZ2FXWWdLR1Y0Y0c5eWRFOXdkSE11YzJWeGRXVnVZMlVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCb1lYTlViM1JoYkVaeVlXMWxjeUE5SUdselJtbHVhWFJsS0hSb2FYTXVjSEp2Y0hNdWRHOTBZV3hHY21GdFpYTXBPMXh1SUNBZ0lDQWdJQ0FnSUc5bVUyVnhJRDBnYUdGelZHOTBZV3hHY21GdFpYTWdQeUJnSUNobWNtRnRaU0FrZTJWNGNHOXlkRTl3ZEhNdVpuSmhiV1VnS3lBeGZTQXZJQ1I3ZEdocGN5NXdjbTl3Y3k1MGIzUmhiRVp5WVcxbGMzMHBZQ0E2SUdBZ0tHWnlZVzFsSUNSN1pYaHdiM0owVDNCMGN5NW1jbUZ0WlgwcFlEdGNiaUFnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2hsZGk1c1pXNW5kR2dnUGlBeEtTQjdYRzRnSUNBZ0lDQWdJQ0FnYjJaVFpYRWdQU0JnSUdacGJHVnpZRHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCamIyNXpkQ0JqYkdsbGJuUWdQU0JwYzBOc2FXVnVkQ0EvSUNkallXNTJZWE10YzJ0bGRHTm9MV05zYVNjZ09pQW5ZMkZ1ZG1GekxYTnJaWFJqYUNjN1hHNGdJQ0FnSUNBZ0lHTnZibk52YkdVdWJHOW5LR0FsWTFza2UyTnNhV1Z1ZEgxZEpXTWdSWGh3YjNKMFpXUWdKV01rZTJsMFpXMTlKV01rZTI5bVUyVnhmV0FzSUNkamIyeHZjam9nSXpobE9HVTRaVHNuTENBblkyOXNiM0k2SUdsdWFYUnBZV3c3Snl3Z0oyWnZiblF0ZDJWcFoyaDBPaUJpYjJ4a095Y3NJQ2RtYjI1MExYZGxhV2RvZERvZ2FXNXBkR2xoYkRzbktUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1emEyVjBZMmd1Y0c5emRFVjRjRzl5ZENBOVBUMGdKMloxYm1OMGFXOXVKeWtnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbk5yWlhSamFDNXdiM04wUlhod2IzSjBLQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2s3WEc0Z0lIMWNibHh1SUNCZmQzSmhjRU52Ym5SbGVIUlRZMkZzWlNBb1kySXBJSHRjYmlBZ0lDQjBhR2x6TGw5d2NtVlNaVzVrWlhJb0tUdGNiaUFnSUNCallpaDBhR2x6TG5CeWIzQnpLVHRjYmlBZ0lDQjBhR2x6TGw5d2IzTjBVbVZ1WkdWeUtDazdYRzRnSUgxY2JseHVJQ0JmY0hKbFVtVnVaR1Z5SUNncElIdGNiaUFnSUNCamIyNXpkQ0J3Y205d2N5QTlJSFJvYVhNdWNISnZjSE03WEc1Y2JpQWdJQ0F2THlCVFkyRnNaU0JqYjI1MFpYaDBJR1p2Y2lCMWJtbDBJSE5wZW1sdVoxeHVJQ0FnSUdsbUlDZ2hkR2hwY3k1d2NtOXdjeTVuYkNBbUppQndjbTl3Y3k1amIyNTBaWGgwSUNZbUlDRndjbTl3Y3k1d05Ta2dlMXh1SUNBZ0lDQWdjSEp2Y0hNdVkyOXVkR1Y0ZEM1ellYWmxLQ2s3WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV6WlhSMGFXNW5jeTV6WTJGc1pVTnZiblJsZUhRZ0lUMDlJR1poYkhObEtTQjdYRzRnSUNBZ0lDQWdJSEJ5YjNCekxtTnZiblJsZUhRdWMyTmhiR1VvY0hKdmNITXVjMk5oYkdWWUxDQndjbTl3Y3k1elkyRnNaVmtwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBnWld4elpTQnBaaUFvY0hKdmNITXVjRFVwSUh0Y2JpQWdJQ0FnSUhCeWIzQnpMbkExTG5OallXeGxLSEJ5YjNCekxuTmpZV3hsV0NBdklIQnliM0J6TG5CcGVHVnNVbUYwYVc4c0lIQnliM0J6TG5OallXeGxXU0F2SUhCeWIzQnpMbkJwZUdWc1VtRjBhVzhwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUY5d2IzTjBVbVZ1WkdWeUlDZ3BJSHRjYmlBZ0lDQmpiMjV6ZENCd2NtOXdjeUE5SUhSb2FYTXVjSEp2Y0hNN1hHNWNiaUFnSUNCcFppQW9JWFJvYVhNdWNISnZjSE11WjJ3Z0ppWWdjSEp2Y0hNdVkyOXVkR1Y0ZENBbUppQWhjSEp2Y0hNdWNEVXBJSHRjYmlBZ0lDQWdJSEJ5YjNCekxtTnZiblJsZUhRdWNtVnpkRzl5WlNncE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklFWnNkWE5vSUdKNUlHUmxabUYxYkhRc0lIUm9hWE1nYldGNUlHSmxJSEpsZG1semFYUmxaQ0JoZENCaElHeGhkR1Z5SUhCdmFXNTBMbHh1SUNBZ0lDOHZJRmRsSUdSdklIUm9hWE1nZEc4Z1pXNXpkWEpsSUhSdlJHRjBZVlZTVENCallXNGdZbVVnWTJGc2JHVmtJR2x0YldWa2FXRjBaV3g1SUdGbWRHVnlMbHh1SUNBZ0lDOHZJRTF2YzNRZ2JHbHJaV3g1SUdKeWIzZHpaWEp6SUdGc2NtVmhaSGtnYUdGdVpHeGxJSFJvYVhNc0lITnZJSGRsSUcxaGVTQnlaWFpwYzJsMElIUm9hWE1nWVc1a1hHNGdJQ0FnTHk4Z2NtVnRiM1psSUdsMElHbG1JR2wwSUdsdGNISnZkbVZ6SUhCbGNtWnZjbTFoYm1ObElIZHBkR2h2ZFhRZ1lXNTVJSFZ6WVdKcGJHbDBlU0JwYzNOMVpYTXVYRzRnSUNBZ2FXWWdLSEJ5YjNCekxtZHNJQ1ltSUhSb2FYTXVjMlYwZEdsdVozTXVabXgxYzJnZ0lUMDlJR1poYkhObElDWW1JQ0Z3Y205d2N5NXdOU2tnZTF4dUlDQWdJQ0FnY0hKdmNITXVaMnd1Wm14MWMyZ29LVHRjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0IwYVdOcklDZ3BJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NXphMlYwWTJnZ0ppWWdkSGx3Wlc5bUlIUm9hWE11YzJ0bGRHTm9MblJwWTJzZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYM0J5WlZKbGJtUmxjaWdwTzF4dUlDQWdJQ0FnZEdocGN5NXphMlYwWTJndWRHbGpheWgwYUdsekxuQnliM0J6S1R0Y2JpQWdJQ0FnSUhSb2FYTXVYM0J2YzNSU1pXNWtaWElvS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpXNWtaWElnS0NrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbkExS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbDlzWVhOMFVtVmtjbUYzVW1WemRXeDBJRDBnZFc1a1pXWnBibVZrTzF4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1d05TNXlaV1J5WVhjb0tUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlzWVhOMFVtVmtjbUYzVW1WemRXeDBPMXh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXpkV0p0YVhSRWNtRjNRMkZzYkNncE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lITjFZbTFwZEVSeVlYZERZV3hzSUNncElIdGNiaUFnSUNCcFppQW9JWFJvYVhNdWMydGxkR05vS1NCeVpYUjFjbTQ3WEc1Y2JpQWdJQ0JqYjI1emRDQndjbTl3Y3lBOUlIUm9hWE11Y0hKdmNITTdYRzRnSUNBZ2RHaHBjeTVmY0hKbFVtVnVaR1Z5S0NrN1hHNWNiaUFnSUNCc1pYUWdaSEpoZDFKbGMzVnNkRHRjYmx4dUlDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXphMlYwWTJnZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUdSeVlYZFNaWE4xYkhRZ1BTQjBhR2x6TG5OclpYUmphQ2h3Y205d2N5azdYRzRnSUNBZ2ZTQmxiSE5sSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV6YTJWMFkyZ3VjbVZ1WkdWeUlEMDlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNCa2NtRjNVbVZ6ZFd4MElEMGdkR2hwY3k1emEyVjBZMmd1Y21WdVpHVnlLSEJ5YjNCektUdGNiaUFnSUNCOVhHNWNiaUFnSUNCMGFHbHpMbDl3YjNOMFVtVnVaR1Z5S0NrN1hHNWNiaUFnSUNCeVpYUjFjbTRnWkhKaGQxSmxjM1ZzZER0Y2JpQWdmVnh1WEc0Z0lIVndaR0YwWlNBb2IzQjBJRDBnZTMwcElIdGNiaUFnSUNBdkx5QkRkWEp5Wlc1MGJIa2dkWEJrWVhSbEtDa2dhWE1nYjI1c2VTQm1iMk4xYzJWa0lHOXVJSEpsYzJsNmFXNW5MRnh1SUNBZ0lDOHZJR0oxZENCc1lYUmxjaUIzWlNCM2FXeHNJSE4xY0hCdmNuUWdiM1JvWlhJZ2IzQjBhVzl1Y3lCc2FXdGxJSE4zYVhSamFHbHVaMXh1SUNBZ0lDOHZJR1p5WVcxbGN5QmhibVFnYzNWamFDNWNiaUFnSUNCamIyNXpkQ0J1YjNSWlpYUlRkWEJ3YjNKMFpXUWdQU0JiWEc0Z0lDQWdJQ0FuWVc1cGJXRjBaU2RjYmlBZ0lDQmRPMXh1WEc0Z0lDQWdUMkpxWldOMExtdGxlWE1vYjNCMEtTNW1iM0pGWVdOb0tHdGxlU0E5UGlCN1hHNGdJQ0FnSUNCcFppQW9ibTkwV1dWMFUzVndjRzl5ZEdWa0xtbHVaR1Y0VDJZb2EyVjVLU0ErUFNBd0tTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdVMjl5Y25rc0lIUm9aU0I3SUNSN2EyVjVmU0I5SUc5d2RHbHZiaUJwY3lCdWIzUWdlV1YwSUhOMWNIQnZjblJsWkNCM2FYUm9JSFZ3WkdGMFpTZ3BMbUFwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBwTzF4dVhHNGdJQ0FnWTI5dWMzUWdiMnhrUTJGdWRtRnpJRDBnZEdocGN5NWZjMlYwZEdsdVozTXVZMkZ1ZG1Gek8xeHVJQ0FnSUdOdmJuTjBJRzlzWkVOdmJuUmxlSFFnUFNCMGFHbHpMbDl6WlhSMGFXNW5jeTVqYjI1MFpYaDBPMXh1WEc0Z0lDQWdMeThnVFdWeVoyVWdibVYzSUc5d2RHbHZibk1nYVc1MGJ5QnpaWFIwYVc1bmMxeHVJQ0FnSUdadmNpQW9iR1YwSUd0bGVTQnBiaUJ2Y0hRcElIdGNiaUFnSUNBZ0lHTnZibk4wSUhaaGJIVmxJRDBnYjNCMFcydGxlVjA3WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhaaGJIVmxJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5a2dleUF2THlCcFoyNXZjbVVnZFc1a1pXWnBibVZrWEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM05sZEhScGJtZHpXMnRsZVYwZ1BTQjJZV3gxWlR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCTlpYSm5aU0JwYmlCMGFXMWxJSEJ5YjNCelhHNGdJQ0FnWTI5dWMzUWdkR2x0WlU5d2RITWdQU0JQWW1wbFkzUXVZWE56YVdkdUtIdDlMQ0IwYUdsekxsOXpaWFIwYVc1bmN5d2diM0IwS1R0Y2JpQWdJQ0JwWmlBb0ozUnBiV1VuSUdsdUlHOXdkQ0FtSmlBblpuSmhiV1VuSUdsdUlHOXdkQ2tnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RaYjNVZ2MyaHZkV3hrSUhOd1pXTnBabmtnZXlCMGFXMWxJSDBnYjNJZ2V5Qm1jbUZ0WlNCOUlHSjFkQ0J1YjNRZ1ltOTBhQ2NwTzF4dUlDQWdJR1ZzYzJVZ2FXWWdLQ2QwYVcxbEp5QnBiaUJ2Y0hRcElHUmxiR1YwWlNCMGFXMWxUM0IwY3k1bWNtRnRaVHRjYmlBZ0lDQmxiSE5sSUdsbUlDZ25abkpoYldVbklHbHVJRzl3ZENrZ1pHVnNaWFJsSUhScGJXVlBjSFJ6TG5ScGJXVTdYRzRnSUNBZ2FXWWdLQ2RrZFhKaGRHbHZiaWNnYVc0Z2IzQjBJQ1ltSUNkMGIzUmhiRVp5WVcxbGN5Y2dhVzRnYjNCMEtTQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0oxbHZkU0J6YUc5MWJHUWdjM0JsWTJsbWVTQjdJR1IxY21GMGFXOXVJSDBnYjNJZ2V5QjBiM1JoYkVaeVlXMWxjeUI5SUdKMWRDQnViM1FnWW05MGFDY3BPMXh1SUNBZ0lHVnNjMlVnYVdZZ0tDZGtkWEpoZEdsdmJpY2dhVzRnYjNCMEtTQmtaV3hsZEdVZ2RHbHRaVTl3ZEhNdWRHOTBZV3hHY21GdFpYTTdYRzRnSUNBZ1pXeHpaU0JwWmlBb0ozUnZkR0ZzUm5KaGJXVnpKeUJwYmlCdmNIUXBJR1JsYkdWMFpTQjBhVzFsVDNCMGN5NWtkWEpoZEdsdmJqdGNibHh1SUNBZ0lHTnZibk4wSUhScGJXVlFjbTl3Y3lBOUlIUm9hWE11WjJWMFZHbHRaVkJ5YjNCektIUnBiV1ZQY0hSektUdGNiaUFnSUNCUFltcGxZM1F1WVhOemFXZHVLSFJvYVhNdVgzQnliM0J6TENCMGFXMWxVSEp2Y0hNcE8xeHVYRzRnSUNBZ0x5OGdTV1lnWldsMGFHVnlJR05oYm5aaGN5QnZjaUJqYjI1MFpYaDBJR2x6SUdOb1lXNW5aV1FzSUhkbElITm9iM1ZzWkNCeVpTMTFjR1JoZEdWY2JpQWdJQ0JwWmlBb2IyeGtRMkZ1ZG1GeklDRTlQU0IwYUdsekxsOXpaWFIwYVc1bmN5NWpZVzUyWVhNZ2ZId2diMnhrUTI5dWRHVjRkQ0FoUFQwZ2RHaHBjeTVmYzJWMGRHbHVaM011WTI5dWRHVjRkQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdleUJqWVc1MllYTXNJR052Ym5SbGVIUWdmU0E5SUdOeVpXRjBaVU5oYm5aaGN5aDBhR2x6TGw5elpYUjBhVzVuY3lrN1hHNWNiaUFnSUNBZ0lIUm9hWE11Y0hKdmNITXVZMkZ1ZG1GeklEMGdZMkZ1ZG1Gek8xeHVJQ0FnSUNBZ2RHaHBjeTV3Y205d2N5NWpiMjUwWlhoMElEMGdZMjl1ZEdWNGREdGNibHh1SUNBZ0lDQWdMeThnUkdWc1pYUmxJRzl5SUdGa1pDQmhJQ2RuYkNjZ2NISnZjQ0JtYjNJZ1kyOXVkbVZ1YVdWdVkyVmNiaUFnSUNBZ0lIUm9hWE11WDNObGRIVndSMHhMWlhrb0tUdGNibHh1SUNBZ0lDQWdMeThnVW1VdGJXOTFiblFnZEdobElHNWxkeUJqWVc1MllYTWdhV1lnYVhRZ2FHRnpJRzV2SUhCaGNtVnVkRnh1SUNBZ0lDQWdkR2hwY3k1ZllYQndaVzVrUTJGdWRtRnpTV1pPWldWa1pXUW9LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJUY0dWamFXRnNJR05oYzJVZ2RHOGdjM1Z3Y0c5eWRDQlFOUzVxYzF4dUlDQWdJR2xtSUNodmNIUXVjRFVnSmlZZ2RIbHdaVzltSUc5d2RDNXdOU0FoUFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdkR2hwY3k1d2NtOXdjeTV3TlNBOUlHOXdkQzV3TlR0Y2JpQWdJQ0FnSUhSb2FYTXVjSEp2Y0hNdWNEVXVaSEpoZHlBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVgybHpVRFZTWlhOcGVtbHVaeWtnY21WMGRYSnVPMXh1SUNBZ0lDQWdJQ0IwYUdsekxsOXNZWE4wVW1Wa2NtRjNVbVZ6ZFd4MElEMGdkR2hwY3k1emRXSnRhWFJFY21GM1EyRnNiQ2dwTzF4dUlDQWdJQ0FnZlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCVmNHUmhkR1VnY0d4aGVXbHVaeUJ6ZEdGMFpTQnBaaUJ1WldObGMzTmhjbmxjYmlBZ0lDQnBaaUFvSjNCc1lYbHBibWNuSUdsdUlHOXdkQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tHOXdkQzV3YkdGNWFXNW5LU0IwYUdsekxuQnNZWGtvS1R0Y2JpQWdJQ0FnSUdWc2MyVWdkR2hwY3k1d1lYVnpaU2dwTzF4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUVSeVlYY2dibVYzSUdaeVlXMWxYRzRnSUNBZ2RHaHBjeTV5WlhOcGVtVW9LVHRjYmlBZ0lDQjBhR2x6TG5KbGJtUmxjaWdwTzF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG5CeWIzQnpPMXh1SUNCOVhHNWNiaUFnY21WemFYcGxJQ2dwSUh0Y2JpQWdJQ0JqYjI1emRDQnZiR1JUYVhwbGN5QTlJSFJvYVhNdVgyZGxkRk5wZW1WUWNtOXdjeWdwTzF4dVhHNGdJQ0FnWTI5dWMzUWdjMlYwZEdsdVozTWdQU0IwYUdsekxuTmxkSFJwYm1kek8xeHVJQ0FnSUdOdmJuTjBJSEJ5YjNCeklEMGdkR2hwY3k1d2NtOXdjenRjYmx4dUlDQWdJQzh2SUZKbFkyOXRjSFYwWlNCdVpYY2djSEp2Y0dWeWRHbGxjeUJpWVhObFpDQnZiaUJqZFhKeVpXNTBJSE5sZEhWd1hHNGdJQ0FnWTI5dWMzUWdibVYzVUhKdmNITWdQU0J5WlhOcGVtVkRZVzUyWVhNb2NISnZjSE1zSUhObGRIUnBibWR6S1R0Y2JseHVJQ0FnSUM4dklFRnpjMmxuYmlCMGJ5QmpkWEp5Wlc1MElIQnliM0J6WEc0Z0lDQWdUMkpxWldOMExtRnpjMmxuYmloMGFHbHpMbDl3Y205d2N5d2dibVYzVUhKdmNITXBPMXh1WEc0Z0lDQWdMeThnVG05M0lIZGxJR0ZqZEhWaGJHeDVJSFZ3WkdGMFpTQjBhR1VnWTJGdWRtRnpJSGRwWkhSb0wyaGxhV2RvZENCaGJtUWdjM1I1YkdVZ2NISnZjSE5jYmlBZ0lDQmpiMjV6ZENCN1hHNGdJQ0FnSUNCd2FYaGxiRkpoZEdsdkxGeHVJQ0FnSUNBZ1kyRnVkbUZ6VjJsa2RHZ3NYRzRnSUNBZ0lDQmpZVzUyWVhOSVpXbG5hSFFzWEc0Z0lDQWdJQ0J6ZEhsc1pWZHBaSFJvTEZ4dUlDQWdJQ0FnYzNSNWJHVklaV2xuYUhSY2JpQWdJQ0I5SUQwZ2RHaHBjeTV3Y205d2N6dGNibHh1SUNBZ0lDOHZJRlZ3WkdGMFpTQmpZVzUyWVhNZ2MyVjBkR2x1WjNOY2JpQWdJQ0JqYjI1emRDQmpZVzUyWVhNZ1BTQjBhR2x6TG5CeWIzQnpMbU5oYm5aaGN6dGNiaUFnSUNCcFppQW9ZMkZ1ZG1GeklDWW1JSE5sZEhScGJtZHpMbkpsYzJsNlpVTmhiblpoY3lBaFBUMGdabUZzYzJVcElIdGNiaUFnSUNBZ0lHbG1JQ2h3Y205d2N5NXdOU2tnZTF4dUlDQWdJQ0FnSUNBdkx5QlFOUzVxY3lCemNHVmphV1pwWXlCbFpHZGxJR05oYzJWY2JpQWdJQ0FnSUNBZ2FXWWdLR05oYm5aaGN5NTNhV1IwYUNBaFBUMGdZMkZ1ZG1GelYybGtkR2dnZkh3Z1kyRnVkbUZ6TG1obGFXZG9kQ0FoUFQwZ1kyRnVkbUZ6U0dWcFoyaDBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTVmYVhOUU5WSmxjMmw2YVc1bklEMGdkSEoxWlR0Y2JpQWdJQ0FnSUNBZ0lDQXZMeUJVYUdseklHTmhkWE5sY3lCaElISmxMV1J5WVhjZ09seGNJSE52SUhkbElHbG5ibTl5WlNCa2NtRjNjeUJwYmlCMGFHVWdiV1ZoYmlCMGFXMWxMaTR1SUhOdmNuUmhJR2hoWTJ0NVhHNGdJQ0FnSUNBZ0lDQWdjSEp2Y0hNdWNEVXVjR2w0Wld4RVpXNXphWFI1S0hCcGVHVnNVbUYwYVc4cE8xeHVJQ0FnSUNBZ0lDQWdJSEJ5YjNCekxuQTFMbkpsYzJsNlpVTmhiblpoY3loallXNTJZWE5YYVdSMGFDQXZJSEJwZUdWc1VtRjBhVzhzSUdOaGJuWmhjMGhsYVdkb2RDQXZJSEJwZUdWc1VtRjBhVzhzSUdaaGJITmxLVHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbDlwYzFBMVVtVnphWHBwYm1jZ1BTQm1ZV3h6WlR0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0x5OGdSbTl5WTJVZ1kyRnVkbUZ6SUhOcGVtVmNiaUFnSUNBZ0lDQWdhV1lnS0dOaGJuWmhjeTUzYVdSMGFDQWhQVDBnWTJGdWRtRnpWMmxrZEdncElHTmhiblpoY3k1M2FXUjBhQ0E5SUdOaGJuWmhjMWRwWkhSb08xeHVJQ0FnSUNBZ0lDQnBaaUFvWTJGdWRtRnpMbWhsYVdkb2RDQWhQVDBnWTJGdWRtRnpTR1ZwWjJoMEtTQmpZVzUyWVhNdWFHVnBaMmgwSUQwZ1kyRnVkbUZ6U0dWcFoyaDBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdMeThnVlhCa1lYUmxJR05oYm5aaGN5QnpkSGxzWlZ4dUlDQWdJQ0FnYVdZZ0tHbHpRbkp2ZDNObGNpZ3BJQ1ltSUhObGRIUnBibWR6TG5OMGVXeGxRMkZ1ZG1GeklDRTlQU0JtWVd4elpTa2dlMXh1SUNBZ0lDQWdJQ0JqWVc1MllYTXVjM1I1YkdVdWQybGtkR2dnUFNCZ0pIdHpkSGxzWlZkcFpIUm9mWEI0WUR0Y2JpQWdJQ0FnSUNBZ1kyRnVkbUZ6TG5OMGVXeGxMbWhsYVdkb2RDQTlJR0FrZTNOMGVXeGxTR1ZwWjJoMGZYQjRZRHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQmpiMjV6ZENCdVpYZFRhWHBsY3lBOUlIUm9hWE11WDJkbGRGTnBlbVZRY205d2N5Z3BPMXh1SUNBZ0lHeGxkQ0JqYUdGdVoyVmtJRDBnSVdSbFpYQkZjWFZoYkNodmJHUlRhWHBsY3l3Z2JtVjNVMmw2WlhNcE8xeHVJQ0FnSUdsbUlDaGphR0Z1WjJWa0tTQjdYRzRnSUNBZ0lDQjBhR2x6TGw5emFYcGxRMmhoYm1kbFpDZ3BPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnWTJoaGJtZGxaRHRjYmlBZ2ZWeHVYRzRnSUY5emFYcGxRMmhoYm1kbFpDQW9LU0I3WEc0Z0lDQWdMeThnVTJWdVpDQnlaWE5wZW1VZ1pYWmxiblFnZEc4Z2MydGxkR05vWEc0Z0lDQWdhV1lnS0hSb2FYTXVjMnRsZEdOb0lDWW1JSFI1Y0dWdlppQjBhR2x6TG5OclpYUmphQzV5WlhOcGVtVWdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lIUm9hWE11YzJ0bGRHTm9MbkpsYzJsNlpTaDBhR2x6TG5CeWIzQnpLVHRjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0JoYm1sdFlYUmxJQ2dwSUh0Y2JpQWdJQ0JwWmlBb0lYUm9hWE11Y0hKdmNITXVjR3hoZVdsdVp5a2djbVYwZFhKdU8xeHVJQ0FnSUdsbUlDZ2hhWE5DY205M2MyVnlLQ2twSUh0Y2JpQWdJQ0FnSUdOdmJuTnZiR1V1WlhKeWIzSW9KMXRqWVc1MllYTXRjMnRsZEdOb1hTQlhRVkpPT2lCQmJtbHRZWFJwYjI0Z2FXNGdUbTlrWlM1cWN5QnBjeUJ1YjNRZ2VXVjBJSE4xY0hCdmNuUmxaQ2NwTzF4dUlDQWdJQ0FnY21WMGRYSnVPMXh1SUNBZ0lIMWNiaUFnSUNCMGFHbHpMbDl5WVdZZ1BTQjNhVzVrYjNjdWNtVnhkV1Z6ZEVGdWFXMWhkR2x2YmtaeVlXMWxLSFJvYVhNdVgyRnVhVzFoZEdWSVlXNWtiR1Z5S1R0Y2JseHVJQ0FnSUd4bGRDQnViM2NnUFNCeWFXZG9kRTV2ZHlncE8xeHVYRzRnSUNBZ1kyOXVjM1FnWm5CeklEMGdkR2hwY3k1d2NtOXdjeTVtY0hNN1hHNGdJQ0FnWTI5dWMzUWdabkpoYldWSmJuUmxjblpoYkUxVElEMGdNVEF3TUNBdklHWndjenRjYmlBZ0lDQnNaWFFnWkdWc2RHRlVhVzFsVFZNZ1BTQnViM2NnTFNCMGFHbHpMbDlzWVhOMFZHbHRaVHRjYmx4dUlDQWdJR052Ym5OMElHUjFjbUYwYVc5dUlEMGdkR2hwY3k1d2NtOXdjeTVrZFhKaGRHbHZianRjYmlBZ0lDQmpiMjV6ZENCb1lYTkVkWEpoZEdsdmJpQTlJSFI1Y0dWdlppQmtkWEpoZEdsdmJpQTlQVDBnSjI1MWJXSmxjaWNnSmlZZ2FYTkdhVzVwZEdVb1pIVnlZWFJwYjI0cE8xeHVYRzRnSUNBZ2JHVjBJR2x6VG1WM1JuSmhiV1VnUFNCMGNuVmxPMXh1SUNBZ0lHTnZibk4wSUhCc1lYbGlZV05yVW1GMFpTQTlJSFJvYVhNdWMyVjBkR2x1WjNNdWNHeGhlV0poWTJ0U1lYUmxPMXh1SUNBZ0lHbG1JQ2h3YkdGNVltRmphMUpoZEdVZ1BUMDlJQ2RtYVhobFpDY3BJSHRjYmlBZ0lDQWdJR1JsYkhSaFZHbHRaVTFUSUQwZ1puSmhiV1ZKYm5SbGNuWmhiRTFUTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvY0d4aGVXSmhZMnRTWVhSbElEMDlQU0FuZEdoeWIzUjBiR1VuS1NCN1hHNGdJQ0FnSUNCcFppQW9aR1ZzZEdGVWFXMWxUVk1nUGlCbWNtRnRaVWx1ZEdWeWRtRnNUVk1wSUh0Y2JpQWdJQ0FnSUNBZ2JtOTNJRDBnYm05M0lDMGdLR1JsYkhSaFZHbHRaVTFUSUNVZ1puSmhiV1ZKYm5SbGNuWmhiRTFUS1R0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVmYkdGemRGUnBiV1VnUFNCdWIzYzdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQnBjMDVsZDBaeVlXMWxJRDBnWm1Gc2MyVTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYMnhoYzNSVWFXMWxJRDBnYm05M08xeHVJQ0FnSUgxY2JseHVJQ0FnSUdOdmJuTjBJR1JsYkhSaFZHbHRaU0E5SUdSbGJIUmhWR2x0WlUxVElDOGdNVEF3TUR0Y2JpQWdJQ0JzWlhRZ2JtVjNWR2x0WlNBOUlIUm9hWE11Y0hKdmNITXVkR2x0WlNBcklHUmxiSFJoVkdsdFpTQXFJSFJvYVhNdWNISnZjSE11ZEdsdFpWTmpZV3hsTzF4dVhHNGdJQ0FnTHk4Z1NHRnVaR3hsSUhKbGRtVnljMlVnZEdsdFpTQnpZMkZzWlZ4dUlDQWdJR2xtSUNodVpYZFVhVzFsSUR3Z01DQW1KaUJvWVhORWRYSmhkR2x2YmlrZ2UxeHVJQ0FnSUNBZ2JtVjNWR2x0WlNBOUlHUjFjbUYwYVc5dUlDc2dibVYzVkdsdFpUdGNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QlNaUzF6ZEdGeWRDQmhibWx0WVhScGIyNWNiaUFnSUNCc1pYUWdhWE5HYVc1cGMyaGxaQ0E5SUdaaGJITmxPMXh1SUNBZ0lHeGxkQ0JwYzB4dmIzQlRkR0Z5ZENBOUlHWmhiSE5sTzF4dVhHNGdJQ0FnWTI5dWMzUWdiRzl2Y0dsdVp5QTlJSFJvYVhNdWMyVjBkR2x1WjNNdWJHOXZjQ0FoUFQwZ1ptRnNjMlU3WEc1Y2JpQWdJQ0JwWmlBb2FHRnpSSFZ5WVhScGIyNGdKaVlnYm1WM1ZHbHRaU0ErUFNCa2RYSmhkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0x5OGdVbVV0YzNSaGNuUWdZVzVwYldGMGFXOXVYRzRnSUNBZ0lDQnBaaUFvYkc5dmNHbHVaeWtnZTF4dUlDQWdJQ0FnSUNCcGMwNWxkMFp5WVcxbElEMGdkSEoxWlR0Y2JpQWdJQ0FnSUNBZ2JtVjNWR2x0WlNBOUlHNWxkMVJwYldVZ0pTQmtkWEpoZEdsdmJqdGNiaUFnSUNBZ0lDQWdhWE5NYjI5d1UzUmhjblFnUFNCMGNuVmxPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdhWE5PWlhkR2NtRnRaU0E5SUdaaGJITmxPMXh1SUNBZ0lDQWdJQ0J1WlhkVWFXMWxJRDBnWkhWeVlYUnBiMjQ3WEc0Z0lDQWdJQ0FnSUdselJtbHVhWE5vWldRZ1BTQjBjblZsTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbDl6YVdkdVlXeEZibVFvS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2FYTk9aWGRHY21GdFpTa2dlMXh1SUNBZ0lDQWdkR2hwY3k1d2NtOXdjeTVrWld4MFlWUnBiV1VnUFNCa1pXeDBZVlJwYldVN1hHNGdJQ0FnSUNCMGFHbHpMbkJ5YjNCekxuUnBiV1VnUFNCdVpYZFVhVzFsTzF4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1d2JHRjVhR1ZoWkNBOUlIUm9hWE11WDJOdmJYQjFkR1ZRYkdGNWFHVmhaQ2h1WlhkVWFXMWxMQ0JrZFhKaGRHbHZiaWs3WEc0Z0lDQWdJQ0JqYjI1emRDQnNZWE4wUm5KaGJXVWdQU0IwYUdsekxuQnliM0J6TG1aeVlXMWxPMXh1SUNBZ0lDQWdkR2hwY3k1d2NtOXdjeTVtY21GdFpTQTlJSFJvYVhNdVgyTnZiWEIxZEdWRGRYSnlaVzUwUm5KaGJXVW9LVHRjYmlBZ0lDQWdJR2xtSUNocGMweHZiM0JUZEdGeWRDa2dkR2hwY3k1ZmMybG5ibUZzUW1WbmFXNG9LVHRjYmlBZ0lDQWdJR2xtSUNoc1lYTjBSbkpoYldVZ0lUMDlJSFJvYVhNdWNISnZjSE11Wm5KaGJXVXBJSFJvYVhNdWRHbGpheWdwTzF4dUlDQWdJQ0FnZEdocGN5NXlaVzVrWlhJb0tUdGNiaUFnSUNBZ0lIUm9hWE11Y0hKdmNITXVaR1ZzZEdGVWFXMWxJRDBnTUR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2FYTkdhVzVwYzJobFpDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1d1lYVnpaU2dwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUdScGMzQmhkR05vSUNoallpa2dlMXh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdZMklnSVQwOUlDZG1kVzVqZEdsdmJpY3BJSFJvY205M0lHNWxkeUJGY25KdmNpZ25iWFZ6ZENCd1lYTnpJR1oxYm1OMGFXOXVJR2x1ZEc4Z1pHbHpjR0YwWTJnb0tTY3BPMXh1SUNBZ0lHTmlLSFJvYVhNdWNISnZjSE1wTzF4dUlDQWdJSFJvYVhNdWNtVnVaR1Z5S0NrN1hHNGdJSDFjYmx4dUlDQnRiM1Z1ZENBb0tTQjdYRzRnSUNBZ2RHaHBjeTVmWVhCd1pXNWtRMkZ1ZG1GelNXWk9aV1ZrWldRb0tUdGNiaUFnZlZ4dVhHNGdJSFZ1Ylc5MWJuUWdLQ2tnZTF4dUlDQWdJR2xtSUNocGMwSnliM2R6WlhJb0tTa2dlMXh1SUNBZ0lDQWdkMmx1Wkc5M0xuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9KM0psYzJsNlpTY3NJSFJvYVhNdVgzSmxjMmw2WlVoaGJtUnNaWElwTzF4dUlDQWdJQ0FnZEdocGN5NWZhMlY1WW05aGNtUlRhRzl5ZEdOMWRITXVaR1YwWVdOb0tDazdYRzRnSUNBZ2ZWeHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbU5oYm5aaGN5NXdZWEpsYm5SRmJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbkJ5YjNCekxtTmhiblpoY3k1d1lYSmxiblJGYkdWdFpXNTBMbkpsYlc5MlpVTm9hV3hrS0hSb2FYTXVjSEp2Y0hNdVkyRnVkbUZ6S1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCZllYQndaVzVrUTJGdWRtRnpTV1pPWldWa1pXUWdLQ2tnZTF4dUlDQWdJR2xtSUNnaGFYTkNjbTkzYzJWeUtDa3BJSEpsZEhWeWJqdGNiaUFnSUNCcFppQW9kR2hwY3k1elpYUjBhVzVuY3k1d1lYSmxiblFnSVQwOUlHWmhiSE5sSUNZbUlDaDBhR2x6TG5CeWIzQnpMbU5oYm5aaGN5QW1KaUFoZEdocGN5NXdjbTl3Y3k1allXNTJZWE11Y0dGeVpXNTBSV3hsYldWdWRDa3BJSHRjYmlBZ0lDQWdJR052Ym5OMElHUmxabUYxYkhSUVlYSmxiblFnUFNCMGFHbHpMbk5sZEhScGJtZHpMbkJoY21WdWRDQjhmQ0JrYjJOMWJXVnVkQzVpYjJSNU8xeHVJQ0FnSUNBZ1pHVm1ZWFZzZEZCaGNtVnVkQzVoY0hCbGJtUkRhR2xzWkNoMGFHbHpMbkJ5YjNCekxtTmhiblpoY3lrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ1gzTmxkSFZ3UjB4TFpYa2dLQ2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtTnZiblJsZUhRcElIdGNiaUFnSUNBZ0lHbG1JQ2hwYzFkbFlrZE1RMjl1ZEdWNGRDaDBhR2x6TG5CeWIzQnpMbU52Ym5SbGVIUXBLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM0J5YjNCekxtZHNJRDBnZEdocGN5NXdjbTl3Y3k1amIyNTBaWGgwTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnWkdWc1pYUmxJSFJvYVhNdVgzQnliM0J6TG1kc08xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lHZGxkRlJwYldWUWNtOXdjeUFvYzJWMGRHbHVaM01nUFNCN2ZTa2dlMXh1SUNBZ0lDOHZJRWRsZENCMGFXMXBibWNnWkdGMFlWeHVJQ0FnSUd4bGRDQmtkWEpoZEdsdmJpQTlJSE5sZEhScGJtZHpMbVIxY21GMGFXOXVPMXh1SUNBZ0lHeGxkQ0IwYjNSaGJFWnlZVzFsY3lBOUlITmxkSFJwYm1kekxuUnZkR0ZzUm5KaGJXVnpPMXh1SUNBZ0lHTnZibk4wSUhScGJXVlRZMkZzWlNBOUlHUmxabWx1WldRb2MyVjBkR2x1WjNNdWRHbHRaVk5qWVd4bExDQXhLVHRjYmlBZ0lDQmpiMjV6ZENCbWNITWdQU0JrWldacGJtVmtLSE5sZEhScGJtZHpMbVp3Y3l3Z01qUXBPMXh1SUNBZ0lHTnZibk4wSUdoaGMwUjFjbUYwYVc5dUlEMGdkSGx3Wlc5bUlHUjFjbUYwYVc5dUlEMDlQU0FuYm5WdFltVnlKeUFtSmlCcGMwWnBibWwwWlNoa2RYSmhkR2x2YmlrN1hHNGdJQ0FnWTI5dWMzUWdhR0Z6Vkc5MFlXeEdjbUZ0WlhNZ1BTQjBlWEJsYjJZZ2RHOTBZV3hHY21GdFpYTWdQVDA5SUNkdWRXMWlaWEluSUNZbUlHbHpSbWx1YVhSbEtIUnZkR0ZzUm5KaGJXVnpLVHRjYmx4dUlDQWdJR052Ym5OMElIUnZkR0ZzUm5KaGJXVnpSbkp2YlVSMWNtRjBhVzl1SUQwZ2FHRnpSSFZ5WVhScGIyNGdQeUJOWVhSb0xtWnNiMjl5S0dad2N5QXFJR1IxY21GMGFXOXVLU0E2SUhWdVpHVm1hVzVsWkR0Y2JpQWdJQ0JqYjI1emRDQmtkWEpoZEdsdmJrWnliMjFVYjNSaGJFWnlZVzFsY3lBOUlHaGhjMVJ2ZEdGc1JuSmhiV1Z6SUQ4Z0tIUnZkR0ZzUm5KaGJXVnpJQzhnWm5CektTQTZJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQnBaaUFvYUdGelJIVnlZWFJwYjI0Z0ppWWdhR0Z6Vkc5MFlXeEdjbUZ0WlhNZ0ppWWdkRzkwWVd4R2NtRnRaWE5HY205dFJIVnlZWFJwYjI0Z0lUMDlJSFJ2ZEdGc1JuSmhiV1Z6S1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjFsdmRTQnphRzkxYkdRZ2MzQmxZMmxtZVNCbGFYUm9aWElnWkhWeVlYUnBiMjRnYjNJZ2RHOTBZV3hHY21GdFpYTXNJR0oxZENCdWIzUWdZbTkwYUM0Z1QzSXNJSFJvWlhrZ2JYVnpkQ0J0WVhSamFDQmxlR0ZqZEd4NUxpY3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdjMlYwZEdsdVozTXVaR2x0Wlc1emFXOXVjeUE5UFQwZ0ozVnVaR1ZtYVc1bFpDY2dKaVlnZEhsd1pXOW1JSE5sZEhScGJtZHpMblZ1YVhSeklDRTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUNBZ1kyOXVjMjlzWlM1M1lYSnVLR0JaYjNVbmRtVWdjM0JsWTJsbWFXVmtJR0VnZXlCMWJtbDBjeUI5SUhObGRIUnBibWNnWW5WMElHNXZJSHNnWkdsdFpXNXphVzl1SUgwc0lITnZJSFJvWlNCMWJtbDBjeUIzYVd4c0lHSmxJR2xuYm05eVpXUXVZQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkRzkwWVd4R2NtRnRaWE1nUFNCa1pXWnBibVZrS0hSdmRHRnNSbkpoYldWekxDQjBiM1JoYkVaeVlXMWxjMFp5YjIxRWRYSmhkR2x2Yml3Z1NXNW1hVzVwZEhrcE8xeHVJQ0FnSUdSMWNtRjBhVzl1SUQwZ1pHVm1hVzVsWkNoa2RYSmhkR2x2Yml3Z1pIVnlZWFJwYjI1R2NtOXRWRzkwWVd4R2NtRnRaWE1zSUVsdVptbHVhWFI1S1R0Y2JseHVJQ0FnSUdOdmJuTjBJSE4wWVhKMFZHbHRaU0E5SUhObGRIUnBibWR6TG5ScGJXVTdYRzRnSUNBZ1kyOXVjM1FnYzNSaGNuUkdjbUZ0WlNBOUlITmxkSFJwYm1kekxtWnlZVzFsTzF4dUlDQWdJR052Ym5OMElHaGhjMU4wWVhKMFZHbHRaU0E5SUhSNWNHVnZaaUJ6ZEdGeWRGUnBiV1VnUFQwOUlDZHVkVzFpWlhJbklDWW1JR2x6Um1sdWFYUmxLSE4wWVhKMFZHbHRaU2s3WEc0Z0lDQWdZMjl1YzNRZ2FHRnpVM1JoY25SR2NtRnRaU0E5SUhSNWNHVnZaaUJ6ZEdGeWRFWnlZVzFsSUQwOVBTQW5iblZ0WW1WeUp5QW1KaUJwYzBacGJtbDBaU2h6ZEdGeWRFWnlZVzFsS1R0Y2JseHVJQ0FnSUM4dklITjBZWEowSUdGMElIcGxjbThnZFc1c1pYTnpJSFZ6WlhJZ2MzQmxZMmxtYVdWeklHWnlZVzFsSUc5eUlIUnBiV1VnS0dKMWRDQnViM1FnWW05MGFDQnRhWE50WVhSamFHVmtLVnh1SUNBZ0lHeGxkQ0IwYVcxbElEMGdNRHRjYmlBZ0lDQnNaWFFnWm5KaGJXVWdQU0F3TzF4dUlDQWdJR3hsZENCd2JHRjVhR1ZoWkNBOUlEQTdYRzRnSUNBZ2FXWWdLR2hoYzFOMFlYSjBWR2x0WlNBbUppQm9ZWE5UZEdGeWRFWnlZVzFsS1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjFsdmRTQnphRzkxYkdRZ2MzQmxZMmxtZVNCbGFYUm9aWElnYzNSaGNuUWdabkpoYldVZ2IzSWdkR2x0WlN3Z1luVjBJRzV2ZENCaWIzUm9MaWNwTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvYUdGelUzUmhjblJVYVcxbEtTQjdYRzRnSUNBZ0lDQXZMeUJWYzJWeUlITndaV05wWm1sbGN5QjBhVzFsTENCM1pTQnBibVpsY2lCbWNtRnRaWE1nWm5KdmJTQkdVRk5jYmlBZ0lDQWdJSFJwYldVZ1BTQnpkR0Z5ZEZScGJXVTdYRzRnSUNBZ0lDQndiR0Y1YUdWaFpDQTlJSFJvYVhNdVgyTnZiWEIxZEdWUWJHRjVhR1ZoWkNoMGFXMWxMQ0JrZFhKaGRHbHZiaWs3WEc0Z0lDQWdJQ0JtY21GdFpTQTlJSFJvYVhNdVgyTnZiWEIxZEdWR2NtRnRaU2hjYmlBZ0lDQWdJQ0FnY0d4aGVXaGxZV1FzSUhScGJXVXNYRzRnSUNBZ0lDQWdJSFJ2ZEdGc1JuSmhiV1Z6TENCbWNITmNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZTQmxiSE5sSUdsbUlDaG9ZWE5UZEdGeWRFWnlZVzFsS1NCN1hHNGdJQ0FnSUNBdkx5QlZjMlZ5SUhOd1pXTnBabWxsY3lCbWNtRnRaU0J1ZFcxaVpYSXNJSGRsSUdsdVptVnlJSFJwYldVZ1puSnZiU0JHVUZOY2JpQWdJQ0FnSUdaeVlXMWxJRDBnYzNSaGNuUkdjbUZ0WlR0Y2JpQWdJQ0FnSUhScGJXVWdQU0JtY21GdFpTQXZJR1p3Y3p0Y2JpQWdJQ0FnSUhCc1lYbG9aV0ZrSUQwZ2RHaHBjeTVmWTI5dGNIVjBaVkJzWVhsb1pXRmtLSFJwYldVc0lHUjFjbUYwYVc5dUtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnY0d4aGVXaGxZV1FzWEc0Z0lDQWdJQ0IwYVcxbExGeHVJQ0FnSUNBZ1puSmhiV1VzWEc0Z0lDQWdJQ0JrZFhKaGRHbHZiaXhjYmlBZ0lDQWdJSFJ2ZEdGc1JuSmhiV1Z6TEZ4dUlDQWdJQ0FnWm5CekxGeHVJQ0FnSUNBZ2RHbHRaVk5qWVd4bFhHNGdJQ0FnZlR0Y2JpQWdmVnh1WEc0Z0lITmxkSFZ3SUNoelpYUjBhVzVuY3lBOUlIdDlMQ0J2ZG1WeWNtbGtaWE1nUFNCN2ZTa2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxuTnJaWFJqYUNrZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkTmRXeDBhWEJzWlNCelpYUjFjQ2dwSUdOaGJHeHpJRzV2ZENCNVpYUWdjM1Z3Y0c5eWRHVmtMaWNwTzF4dVhHNGdJQ0FnZEdocGN5NWZjMlYwZEdsdVozTWdQU0JQWW1wbFkzUXVZWE56YVdkdUtIdDlMQ0J6WlhSMGFXNW5jeXdnZEdocGN5NWZjMlYwZEdsdVozTXBPMXh1WEc0Z0lDQWdMeThnUjJWMElHbHVhWFJwWVd3Z1kyRnVkbUZ6SUNZZ1kyOXVkR1Y0ZEZ4dUlDQWdJR052Ym5OMElIc2dZMjl1ZEdWNGRDd2dZMkZ1ZG1GeklIMGdQU0JqY21WaGRHVkRZVzUyWVhNb2RHaHBjeTVmYzJWMGRHbHVaM01wTzF4dVhHNGdJQ0FnWTI5dWMzUWdkR2x0WlZCeWIzQnpJRDBnZEdocGN5NW5aWFJVYVcxbFVISnZjSE1vZEdocGN5NWZjMlYwZEdsdVozTXBPMXh1WEc0Z0lDQWdMeThnU1c1cGRHbGhiQ0J5Wlc1a1pYSWdjM1JoZEdVZ1ptVmhkSFZ5WlhOY2JpQWdJQ0IwYUdsekxsOXdjbTl3Y3lBOUlIdGNiaUFnSUNBZ0lDNHVMblJwYldWUWNtOXdjeXhjYmlBZ0lDQWdJR05oYm5aaGN5eGNiaUFnSUNBZ0lHTnZiblJsZUhRc1hHNGdJQ0FnSUNCa1pXeDBZVlJwYldVNklEQXNYRzRnSUNBZ0lDQnpkR0Z5ZEdWa09pQm1ZV3h6WlN4Y2JpQWdJQ0FnSUdWNGNHOXlkR2x1WnpvZ1ptRnNjMlVzWEc0Z0lDQWdJQ0J3YkdGNWFXNW5PaUJtWVd4elpTeGNiaUFnSUNBZ0lISmxZMjl5WkdsdVp6b2dabUZzYzJVc1hHNGdJQ0FnSUNCelpYUjBhVzVuY3pvZ2RHaHBjeTV6WlhSMGFXNW5jeXhjYmx4dUlDQWdJQ0FnTHk4Z1JYaHdiM0owSUhOdmJXVWdjM0JsWTJsbWFXTWdZV04wYVc5dWN5QjBieUIwYUdVZ2MydGxkR05vWEc0Z0lDQWdJQ0J5Wlc1a1pYSTZJQ2dwSUQwK0lIUm9hWE11Y21WdVpHVnlLQ2tzWEc0Z0lDQWdJQ0IwYjJkbmJHVlFiR0Y1T2lBb0tTQTlQaUIwYUdsekxuUnZaMmRzWlZCc1lYa29LU3hjYmlBZ0lDQWdJR1JwYzNCaGRHTm9PaUFvWTJJcElEMCtJSFJvYVhNdVpHbHpjR0YwWTJnb1kySXBMRnh1SUNBZ0lDQWdkR2xqYXpvZ0tDa2dQVDRnZEdocGN5NTBhV05yS0Nrc1hHNGdJQ0FnSUNCeVpYTnBlbVU2SUNncElEMCtJSFJvYVhNdWNtVnphWHBsS0Nrc1hHNGdJQ0FnSUNCMWNHUmhkR1U2SUNodmNIUXBJRDArSUhSb2FYTXVkWEJrWVhSbEtHOXdkQ2tzWEc0Z0lDQWdJQ0JsZUhCdmNuUkdjbUZ0WlRvZ2IzQjBJRDArSUhSb2FYTXVaWGh3YjNKMFJuSmhiV1VvYjNCMEtTeGNiaUFnSUNBZ0lISmxZMjl5WkRvZ0tDa2dQVDRnZEdocGN5NXlaV052Y21Rb0tTeGNiaUFnSUNBZ0lIQnNZWGs2SUNncElEMCtJSFJvYVhNdWNHeGhlU2dwTEZ4dUlDQWdJQ0FnY0dGMWMyVTZJQ2dwSUQwK0lIUm9hWE11Y0dGMWMyVW9LU3hjYmlBZ0lDQWdJSE4wYjNBNklDZ3BJRDArSUhSb2FYTXVjM1J2Y0NncFhHNGdJQ0FnZlR0Y2JseHVJQ0FnSUM4dklFWnZjaUJYWldKSFRDQnphMlYwWTJobGN5d2dZU0JuYkNCMllYSnBZV0pzWlNCeVpXRmtjeUJoSUdKcGRDQmlaWFIwWlhKY2JpQWdJQ0IwYUdsekxsOXpaWFIxY0VkTVMyVjVLQ2s3WEc1Y2JpQWdJQ0F2THlCVWNtbG5aMlZ5SUdsdWFYUnBZV3dnY21WemFYcGxJRzV2ZHlCemJ5QjBhR0YwSUdOaGJuWmhjeUJwY3lCaGJISmxZV1I1SUhOcGVtVmtYRzRnSUNBZ0x5OGdZbmtnZEdobElIUnBiV1VnZDJVZ2JHOWhaQ0IwYUdVZ2MydGxkR05vWEc0Z0lDQWdkR2hwY3k1eVpYTnBlbVVvS1R0Y2JpQWdmVnh1WEc0Z0lHeHZZV1JCYm1SU2RXNGdLR05oYm5aaGMxTnJaWFJqYUN3Z2JtVjNVMlYwZEdsdVozTXBJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVzYjJGa0tHTmhiblpoYzFOclpYUmphQ3dnYm1WM1UyVjBkR2x1WjNNcExuUm9aVzRvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdkR2hwY3k1eWRXNG9LVHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TzF4dUlDQWdJSDBwTzF4dUlDQjlYRzVjYmlBZ2RXNXNiMkZrSUNncElIdGNiaUFnSUNCMGFHbHpMbkJoZFhObEtDazdYRzRnSUNBZ2FXWWdLQ0YwYUdsekxuTnJaWFJqYUNrZ2NtVjBkWEp1TzF4dUlDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXphMlYwWTJndWRXNXNiMkZrSUQwOVBTQW5ablZ1WTNScGIyNG5LU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOTNjbUZ3UTI5dWRHVjRkRk5qWVd4bEtIQnliM0J6SUQwK0lIUm9hWE11YzJ0bGRHTm9MblZ1Ykc5aFpDaHdjbTl3Y3lrcE8xeHVJQ0FnSUgxY2JpQWdJQ0IwYUdsekxsOXphMlYwWTJnZ1BTQnVkV3hzTzF4dUlDQjlYRzVjYmlBZ1pHVnpkSEp2ZVNBb0tTQjdYRzRnSUNBZ2RHaHBjeTUxYm14dllXUW9LVHRjYmlBZ0lDQjBhR2x6TG5WdWJXOTFiblFvS1R0Y2JpQWdmVnh1WEc0Z0lHeHZZV1FnS0dOeVpXRjBaVk5yWlhSamFDd2dibVYzVTJWMGRHbHVaM01wSUh0Y2JpQWdJQ0F2THlCVmMyVnlJR1JwWkc0bmRDQnpjR1ZqYVdaNUlHRWdablZ1WTNScGIyNWNiaUFnSUNCcFppQW9kSGx3Wlc5bUlHTnlaV0YwWlZOclpYUmphQ0FoUFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZFVhR1VnWm5WdVkzUnBiMjRnYlhWemRDQjBZV3RsSUdsdUlHRWdablZ1WTNScGIyNGdZWE1nZEdobElHWnBjbk4wSUhCaGNtRnRaWFJsY2k0Z1JYaGhiWEJzWlRwY1hHNGdJR05oYm5aaGMxTnJaWFJqYUdWeUtDZ3BJRDArSUhzZ0xpNHVJSDBzSUhObGRIUnBibWR6S1NjcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5OclpYUmphQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NTFibXh2WVdRb0tUdGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9kSGx3Wlc5bUlHNWxkMU5sZEhScGJtZHpJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5a2dlMXh1SUNBZ0lDQWdkR2hwY3k1MWNHUmhkR1VvYm1WM1UyVjBkR2x1WjNNcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklGUm9hWE1nYVhNZ1lTQmlhWFFnYjJZZ1lTQjBjbWxqYTNrZ1kyRnpaVHNnZDJVZ2MyVjBJSFZ3SUhSb1pTQmhkWFJ2TFhOallXeHBibWNnYUdWeVpWeHVJQ0FnSUM4dklHbHVJR05oYzJVZ2RHaGxJSFZ6WlhJZ1pHVmphV1JsY3lCMGJ5QnlaVzVrWlhJZ1lXNTVkR2hwYm1jZ2RHOGdkR2hsSUdOdmJuUmxlSFFnS21KbFptOXlaU29nZEdobFhHNGdJQ0FnTHk4Z2NtVnVaR1Z5S0NrZ1puVnVZM1JwYjI0dUxpNGdTRzkzWlhabGNpd2dkWE5sY25NZ2MyaHZkV3hrSUdsdWMzUmxZV1FnZFhObElHSmxaMmx1S0NrZ1puVnVZM1JwYjI0Z1ptOXlJSFJvWVhRdVhHNGdJQ0FnZEdocGN5NWZjSEpsVW1WdVpHVnlLQ2s3WEc1Y2JpQWdJQ0JzWlhRZ2NISmxiRzloWkNBOUlGQnliMjFwYzJVdWNtVnpiMngyWlNncE8xeHVYRzRnSUNBZ0x5OGdRbVZqWVhWelpTQnZaaUJRTlM1cWN5ZHpJSFZ1ZFhOMVlXd2djM1J5ZFdOMGRYSmxMQ0IzWlNCb1lYWmxJSFJ2SUdSdklHRWdZbWwwSUc5bVhHNGdJQ0FnTHk4Z2JHbGljbUZ5ZVMxemNHVmphV1pwWXlCamFHRnVaMlZ6SUhSdklITjFjSEJ2Y25RZ2FYUWdjSEp2Y0dWeWJIa3VYRzRnSUNBZ2FXWWdLSFJvYVhNdWMyVjBkR2x1WjNNdWNEVXBJSHRjYmlBZ0lDQWdJR2xtSUNnaGFYTkNjbTkzYzJWeUtDa3BJSHRjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RiWTJGdWRtRnpMWE5yWlhSamFGMGdSVkpTVDFJNklGVnphVzVuSUhBMUxtcHpJR2x1SUU1dlpHVXVhbk1nYVhNZ2JtOTBJSE4xY0hCdmNuUmxaQ2NwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnY0hKbGJHOWhaQ0E5SUc1bGR5QlFjbTl0YVhObEtISmxjMjlzZG1VZ1BUNGdlMXh1SUNBZ0lDQWdJQ0JzWlhRZ1VEVkRiMjV6ZEhKMVkzUnZjaUE5SUhSb2FYTXVjMlYwZEdsdVozTXVjRFU3WEc0Z0lDQWdJQ0FnSUd4bGRDQndjbVZzYjJGa08xeHVJQ0FnSUNBZ0lDQnBaaUFvVURWRGIyNXpkSEoxWTNSdmNpNXdOU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIQnlaV3h2WVdRZ1BTQlFOVU52Ym5OMGNuVmpkRzl5TG5CeVpXeHZZV1E3WEc0Z0lDQWdJQ0FnSUNBZ1VEVkRiMjV6ZEhKMVkzUnZjaUE5SUZBMVEyOXVjM1J5ZFdOMGIzSXVjRFU3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZMeUJVYUdVZ2MydGxkR05vSUhObGRIVndPeUJrYVhOaFlteGxJR3h2YjNBc0lITmxkQ0J6YVhwcGJtY3NJR1YwWXk1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnY0RWVGEyVjBZMmdnUFNCd05TQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ0x5OGdTRzl2YXlCcGJpQndjbVZzYjJGa0lHbG1JRzVsWTJWemMyRnllVnh1SUNBZ0lDQWdJQ0FnSUdsbUlDaHdjbVZzYjJGa0tTQndOUzV3Y21Wc2IyRmtJRDBnS0NrZ1BUNGdjSEpsYkc5aFpDaHdOU2s3WEc0Z0lDQWdJQ0FnSUNBZ2NEVXVjMlYwZFhBZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1emRDQndjbTl3Y3lBOUlIUm9hWE11Y0hKdmNITTdYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JwYzBkTUlEMGdkR2hwY3k1elpYUjBhVzVuY3k1amIyNTBaWGgwSUQwOVBTQW5kMlZpWjJ3bk8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdjbVZ1WkdWeVpYSWdQU0JwYzBkTUlEOGdjRFV1VjBWQ1Iwd2dPaUJ3TlM1UU1rUTdYRzRnSUNBZ0lDQWdJQ0FnSUNCd05TNXViMHh2YjNBb0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUhBMUxuQnBlR1ZzUkdWdWMybDBlU2h3Y205d2N5NXdhWGhsYkZKaGRHbHZLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIQTFMbU55WldGMFpVTmhiblpoY3lod2NtOXdjeTUyYVdWM2NHOXlkRmRwWkhSb0xDQndjbTl3Y3k1MmFXVjNjRzl5ZEVobGFXZG9kQ3dnY21WdVpHVnlaWElwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dselIwd2dKaVlnZEdocGN5NXpaWFIwYVc1bmN5NWhkSFJ5YVdKMWRHVnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEExTG5ObGRFRjBkSEpwWW5WMFpYTW9kR2hwY3k1elpYUjBhVzVuY3k1aGRIUnlhV0oxZEdWektUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NTFjR1JoZEdVb2V5QndOU3dnWTJGdWRtRnpPaUJ3TlM1allXNTJZWE1zSUdOdmJuUmxlSFE2SUhBMUxsOXlaVzVrWlhKbGNpNWtjbUYzYVc1blEyOXVkR1Y0ZENCOUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGMyOXNkbVVvS1R0Y2JpQWdJQ0FnSUNBZ0lDQjlPMXh1SUNBZ0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRk4xY0hCdmNuUWdaMnh2WW1Gc0lHRnVaQ0JwYm5OMFlXNWpaU0JRTlM1cWN5QnRiMlJsYzF4dUlDQWdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlGQTFRMjl1YzNSeWRXTjBiM0lnUFQwOUlDZG1kVzVqZEdsdmJpY3BJSHRjYmlBZ0lDQWdJQ0FnSUNCdVpYY2dVRFZEYjI1emRISjFZM1J2Y2lod05WTnJaWFJqYUNrN1hHNGdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUIzYVc1a2IzY3VZM0psWVhSbFEyRnVkbUZ6SUNFOVBTQW5ablZ1WTNScGIyNG5LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1hDSjdJSEExSUgwZ2MyVjBkR2x1WnlCcGN5QndZWE56WldRZ1luVjBJR05oYmlkMElHWnBibVFnY0RVdWFuTWdhVzRnWjJ4dlltRnNJQ2gzYVc1a2IzY3BJSE5qYjNCbExpQk5ZWGxpWlNCNWIzVWdaR2xrSUc1dmRDQmpjbVZoZEdVZ2FYUWdaMnh2WW1Gc2JIay9YRnh1Ym1WM0lIQTFLQ2s3SUM4dklEd3RMU0JoZEhSaFkyaGxjeUIwYnlCbmJHOWlZV3dnYzJOdmNHVmNJaWs3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSEExVTJ0bGRHTm9LSGRwYm1SdmR5azdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQndjbVZzYjJGa0xuUm9aVzRvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdMeThnVEc5aFpDQjBhR1VnZFhObGNpZHpJSE5yWlhSamFGeHVJQ0FnSUNBZ2JHVjBJR3h2WVdSbGNpQTlJR055WldGMFpWTnJaWFJqYUNoMGFHbHpMbkJ5YjNCektUdGNiaUFnSUNBZ0lHbG1JQ2doYVhOUWNtOXRhWE5sS0d4dllXUmxjaWtwSUh0Y2JpQWdJQ0FnSUNBZ2JHOWhaR1Z5SUQwZ1VISnZiV2x6WlM1eVpYTnZiSFpsS0d4dllXUmxjaWs3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdiRzloWkdWeU8xeHVJQ0FnSUgwcExuUm9aVzRvYzJ0bGRHTm9JRDArSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hjMnRsZEdOb0tTQnphMlYwWTJnZ1BTQjdmVHRjYmlBZ0lDQWdJSFJvYVhNdVgzTnJaWFJqYUNBOUlITnJaWFJqYUR0Y2JseHVJQ0FnSUNBZ0x5OGdUMjVqWlNCMGFHVWdjMnRsZEdOb0lHbHpJR3h2WVdSbFpDQjNaU0JqWVc0Z1lXUmtJSFJvWlNCbGRtVnVkSE5jYmlBZ0lDQWdJR2xtSUNocGMwSnliM2R6WlhJb0tTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxsOXJaWGxpYjJGeVpGTm9iM0owWTNWMGN5NWhkSFJoWTJnb0tUdGNiaUFnSUNBZ0lDQWdkMmx1Wkc5M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozSmxjMmw2WlNjc0lIUm9hWE11WDNKbGMybDZaVWhoYm1Sc1pYSXBPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxsOXdiM04wVW1WdVpHVnlLQ2s3WEc1Y2JpQWdJQ0FnSUM4dklGUm9aU0JwYm1sMGFXRnNJSEpsYzJsNlpTZ3BJR2x1SUhSb1pTQmpiMjV6ZEhKMVkzUnZjaUIzYVd4c0lHNXZkQ0JvWVhabFhHNGdJQ0FnSUNBdkx5QjBjbWxuWjJWeVpXUWdZU0J5WlhOcGVtVW9LU0JsZG1WdWRDQnZiaUIwYUdVZ2MydGxkR05vTENCemFXNWpaU0JwZENCM1lYTWdZbVZtYjNKbFhHNGdJQ0FnSUNBdkx5QjBhR1VnYzJ0bGRHTm9JSGRoY3lCc2IyRmtaV1F1SUZOdklIZGxJSE5sYm1RZ2RHaGxJSE5wWjI1aGJDQm9aWEpsTENCaGJHeHZkMmx1WjF4dUlDQWdJQ0FnTHk4Z2RYTmxjbk1nZEc4Z2NtVmhZM1FnZEc4Z2RHaGxJR2x1YVhScFlXd2djMmw2WlNCaVpXWnZjbVVnWm1seWMzUWdjbVZ1WkdWeUxseHVJQ0FnSUNBZ2RHaHBjeTVmYzJsNlpVTm9ZVzVuWldRb0tUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpPMXh1SUNBZ0lIMHBMbU5oZEdOb0tHVnljaUE5UGlCN1hHNGdJQ0FnSUNCamIyNXpiMnhsTG5kaGNtNG9KME52ZFd4a0lHNXZkQ0J6ZEdGeWRDQnphMlYwWTJnc0lIUm9aU0JoYzNsdVl5QnNiMkZrYVc1bklHWjFibU4wYVc5dUlISmxhbVZqZEdWa0lIZHBkR2dnWVc0Z1pYSnliM0k2WEZ4dUlDQWdJRVZ5Y205eU9pQW5JQ3NnWlhKeUxtMWxjM05oWjJVcE8xeHVJQ0FnSUNBZ2RHaHliM2NnWlhKeU8xeHVJQ0FnSUgwcE8xeHVJQ0I5WEc1OVhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElGTnJaWFJqYUUxaGJtRm5aWEk3WEc0aUxDSnBiWEJ2Y25RZ1UydGxkR05vVFdGdVlXZGxjaUJtY205dElDY3VMMk52Y21VdlUydGxkR05vVFdGdVlXZGxjaWM3WEc1cGJYQnZjblFnVUdGd1pYSlRhWHBsY3lCbWNtOXRJQ2N1TDNCaGNHVnlMWE5wZW1Wekp6dGNibWx0Y0c5eWRDQjdJR2RsZEVOc2FXVnVkRUZRU1NCOUlHWnliMjBnSnk0dmRYUnBiQ2M3WEc1cGJYQnZjblFnWkdWbWFXNWxaQ0JtY205dElDZGtaV1pwYm1Wa0p6dGNibHh1WTI5dWMzUWdRMEZEU0VVZ1BTQW5hRzkwTFdsa0xXTmhZMmhsSnp0Y2JtTnZibk4wSUhKMWJuUnBiV1ZEYjJ4c2FYTnBiMjV6SUQwZ1cxMDdYRzVjYm1aMWJtTjBhVzl1SUdselNHOTBVbVZzYjJGa0lDZ3BJSHRjYmlBZ1kyOXVjM1FnWTJ4cFpXNTBJRDBnWjJWMFEyeHBaVzUwUVZCSktDazdYRzRnSUhKbGRIVnliaUJqYkdsbGJuUWdKaVlnWTJ4cFpXNTBMbWh2ZER0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnWTJGamFHVkhaWFFnS0dsa0tTQjdYRzRnSUdOdmJuTjBJR05zYVdWdWRDQTlJR2RsZEVOc2FXVnVkRUZRU1NncE8xeHVJQ0JwWmlBb0lXTnNhV1Z1ZENrZ2NtVjBkWEp1SUhWdVpHVm1hVzVsWkR0Y2JpQWdZMnhwWlc1MFcwTkJRMGhGWFNBOUlHTnNhV1Z1ZEZ0RFFVTklSVjBnZkh3Z2UzMDdYRzRnSUhKbGRIVnliaUJqYkdsbGJuUmJRMEZEU0VWZFcybGtYVHRjYm4xY2JseHVablZ1WTNScGIyNGdZMkZqYUdWUWRYUWdLR2xrTENCa1lYUmhLU0I3WEc0Z0lHTnZibk4wSUdOc2FXVnVkQ0E5SUdkbGRFTnNhV1Z1ZEVGUVNTZ3BPMXh1SUNCcFppQW9JV05zYVdWdWRDa2djbVYwZFhKdUlIVnVaR1ZtYVc1bFpEdGNiaUFnWTJ4cFpXNTBXME5CUTBoRlhTQTlJR05zYVdWdWRGdERRVU5JUlYwZ2ZId2dlMzA3WEc0Z0lHTnNhV1Z1ZEZ0RFFVTklSVjFiYVdSZElEMGdaR0YwWVR0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnWjJWMFZHbHRaVkJ5YjNBZ0tHOXNaRTFoYm1GblpYSXNJRzVsZDFObGRIUnBibWR6S1NCN1hHNGdJQzh2SUZOMFlYUnBZeUJ6YTJWMFkyaGxjeUJwWjI1dmNtVWdkR2hsSUhScGJXVWdjR1Z5YzJsemRHVnVZM2xjYmlBZ2NtVjBkWEp1SUc1bGQxTmxkSFJwYm1kekxtRnVhVzFoZEdVZ1B5QjdJSFJwYldVNklHOXNaRTFoYm1GblpYSXVjSEp2Y0hNdWRHbHRaU0I5SURvZ2RXNWtaV1pwYm1Wa08xeHVmVnh1WEc1bWRXNWpkR2x2YmlCallXNTJZWE5UYTJWMFkyZ2dLSE5yWlhSamFDd2djMlYwZEdsdVozTWdQU0I3ZlNrZ2UxeHVJQ0JwWmlBb2MyVjBkR2x1WjNNdWNEVXBJSHRjYmlBZ0lDQnBaaUFvYzJWMGRHbHVaM011WTJGdWRtRnpJSHg4SUNoelpYUjBhVzVuY3k1amIyNTBaWGgwSUNZbUlIUjVjR1Z2WmlCelpYUjBhVzVuY3k1amIyNTBaWGgwSUNFOVBTQW5jM1J5YVc1bkp5a3BJSHRjYmlBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdTVzRnZXlCd05TQjlJRzF2WkdVc0lIbHZkU0JqWVc0bmRDQndZWE56SUhsdmRYSWdiM2R1SUdOaGJuWmhjeUJ2Y2lCamIyNTBaWGgwTENCMWJteGxjM01nZEdobElHTnZiblJsZUhRZ2FYTWdZU0JjSW5kbFltZHNYQ0lnYjNJZ1hDSXlaRndpSUhOMGNtbHVaMkFwTzF4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUVSdklHNXZkQ0JqY21WaGRHVWdZU0JqWVc1MllYTWdiMjRnYzNSaGNuUjFjQ3dnYzJsdVkyVWdVRFV1YW5NZ1pHOWxjeUIwYUdGMElHWnZjaUIxYzF4dUlDQWdJR052Ym5OMElHTnZiblJsZUhRZ1BTQjBlWEJsYjJZZ2MyVjBkR2x1WjNNdVkyOXVkR1Y0ZENBOVBUMGdKM04wY21sdVp5Y2dQeUJ6WlhSMGFXNW5jeTVqYjI1MFpYaDBJRG9nWm1Gc2MyVTdYRzRnSUNBZ2MyVjBkR2x1WjNNZ1BTQlBZbXBsWTNRdVlYTnphV2R1S0h0OUxDQnpaWFIwYVc1bmN5d2dleUJqWVc1MllYTTZJR1poYkhObExDQmpiMjUwWlhoMElIMHBPMXh1SUNCOVhHNWNiaUFnWTI5dWMzUWdhWE5JYjNRZ1BTQnBjMGh2ZEZKbGJHOWhaQ2dwTzF4dUlDQnNaWFFnYUc5MFNVUTdYRzRnSUdsbUlDaHBjMGh2ZENrZ2UxeHVJQ0FnSUM4dklGVnpaU0JoSUcxaFoybGpJRzVoYldVZ1lua2daR1ZtWVhWc2RDd2dabTl5WTJVZ2RYTmxjaUIwYnlCa1pXWnBibVVnWldGamFDQnphMlYwWTJnZ2FXWWdkR2hsZVZ4dUlDQWdJQzh2SUhKbGNYVnBjbVVnYlc5eVpTQjBhR0Z1SUc5dVpTQnBiaUJoYmlCaGNIQnNhV05oZEdsdmJpNGdUM0JsYmlCMGJ5QnZkR2hsY2lCcFpHVmhjeUJ2YmlCb2IzY2dkRzhnZEdGamEyeGxYRzRnSUNBZ0x5OGdkR2hwY3lCaGN5QjNaV3hzTGk0dVhHNGdJQ0FnYUc5MFNVUWdQU0JrWldacGJtVmtLSE5sZEhScGJtZHpMbWxrTENBbkpGOWZSRVZHUVZWTVZGOURRVTVXUVZOZlUwdEZWRU5JWDBsRVgxOGtKeWs3WEc0Z0lIMWNiaUFnYkdWMElHbHpTVzVxWldOMGFXNW5JRDBnYVhOSWIzUWdKaVlnZEhsd1pXOW1JR2h2ZEVsRUlEMDlQU0FuYzNSeWFXNW5KenRjYmx4dUlDQnBaaUFvYVhOSmJtcGxZM1JwYm1jZ0ppWWdjblZ1ZEdsdFpVTnZiR3hwYzJsdmJuTXVhVzVqYkhWa1pYTW9hRzkwU1VRcEtTQjdYRzRnSUNBZ1kyOXVjMjlzWlM1M1lYSnVLR0JYWVhKdWFXNW5PaUJaYjNVZ2FHRjJaU0J0ZFd4MGFYQnNaU0JqWVd4c2N5QjBieUJqWVc1MllYTlRhMlYwWTJnb0tTQnBiaUF0TFdodmRDQnRiMlJsTGlCWmIzVWdiWFZ6ZENCd1lYTnpJSFZ1YVhGMVpTQjdJR2xrSUgwZ2MzUnlhVzVuY3lCcGJpQnpaWFIwYVc1bmN5QjBieUJsYm1GaWJHVWdhRzkwSUhKbGJHOWhaQ0JoWTNKdmMzTWdiWFZzZEdsd2JHVWdjMnRsZEdOb1pYTXVJR0FzSUdodmRFbEVLVHRjYmlBZ0lDQnBjMGx1YW1WamRHbHVaeUE5SUdaaGJITmxPMXh1SUNCOVhHNWNiaUFnYkdWMElIQnlaV3h2WVdRZ1BTQlFjbTl0YVhObExuSmxjMjlzZG1Vb0tUdGNibHh1SUNCcFppQW9hWE5KYm1wbFkzUnBibWNwSUh0Y2JpQWdJQ0F2THlCTllYSnJJSFJvYVhNZ1lYTWdZV3h5WldGa2VTQnpjRzkwZEdWa0lHbHVJSFJvYVhNZ2NuVnVkR2x0WlNCcGJuTjBZVzVqWlZ4dUlDQWdJSEoxYm5ScGJXVkRiMnhzYVhOcGIyNXpMbkIxYzJnb2FHOTBTVVFwTzF4dVhHNGdJQ0FnWTI5dWMzUWdjSEpsZG1sdmRYTkVZWFJoSUQwZ1kyRmphR1ZIWlhRb2FHOTBTVVFwTzF4dUlDQWdJR2xtSUNod2NtVjJhVzkxYzBSaGRHRXBJSHRjYmlBZ0lDQWdJR052Ym5OMElHNWxlSFFnUFNBb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUM4dklFZHlZV0lnYm1WM0lIQnliM0J6SUdaeWIyMGdiMnhrSUhOclpYUmphQ0JwYm5OMFlXNWpaVnh1SUNBZ0lDQWdJQ0JqYjI1emRDQnVaWGRRY205d2N5QTlJR2RsZEZScGJXVlFjbTl3S0hCeVpYWnBiM1Z6UkdGMFlTNXRZVzVoWjJWeUxDQnpaWFIwYVc1bmN5azdYRzRnSUNBZ0lDQWdJQzh2SUVSbGMzUnliM2tnZEdobElHOXNaQ0JwYm5OMFlXNWpaVnh1SUNBZ0lDQWdJQ0J3Y21WMmFXOTFjMFJoZEdFdWJXRnVZV2RsY2k1a1pYTjBjbTk1S0NrN1hHNGdJQ0FnSUNBZ0lDOHZJRkJoYzNNZ1lXeHZibWNnYm1WM0lIQnliM0J6WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ1WlhkUWNtOXdjenRjYmlBZ0lDQWdJSDA3WEc1Y2JpQWdJQ0FnSUM4dklFMXZkbVVnWVd4dmJtY2dkR2hsSUc1bGVIUWdaR0YwWVM0dUxseHVJQ0FnSUNBZ2NISmxiRzloWkNBOUlIQnlaWFpwYjNWelJHRjBZUzVzYjJGa0xuUm9aVzRvYm1WNGRDa3VZMkYwWTJnb2JtVjRkQ2s3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSEJ5Wld4dllXUXVkR2hsYmlodVpYZFFjbTl3Y3lBOVBpQjdYRzRnSUNBZ1kyOXVjM1FnYldGdVlXZGxjaUE5SUc1bGR5QlRhMlYwWTJoTllXNWhaMlZ5S0NrN1hHNGdJQ0FnYkdWMElISmxjM1ZzZER0Y2JpQWdJQ0JwWmlBb2MydGxkR05vS1NCN1hHNGdJQ0FnSUNBdkx5Qk5aWEpuWlNCM2FYUm9JR2x1WTI5dGFXNW5JR1JoZEdGY2JpQWdJQ0FnSUhObGRIUnBibWR6SUQwZ1QySnFaV04wTG1GemMybG5iaWg3ZlN3Z2MyVjBkR2x1WjNNc0lHNWxkMUJ5YjNCektUdGNibHh1SUNBZ0lDQWdMeThnUVhCd2JIa2djMlYwZEdsdVozTWdZVzVrSUdOeVpXRjBaU0JoSUdOaGJuWmhjMXh1SUNBZ0lDQWdiV0Z1WVdkbGNpNXpaWFIxY0NoelpYUjBhVzVuY3lrN1hHNWNiaUFnSUNBZ0lDOHZJRTF2ZFc1MElIUnZJRVJQVFZ4dUlDQWdJQ0FnYldGdVlXZGxjaTV0YjNWdWRDZ3BPMXh1WEc0Z0lDQWdJQ0F2THlCc2IyRmtJSFJvWlNCemEyVjBZMmdnWm1seWMzUmNiaUFnSUNBZ0lISmxjM1ZzZENBOUlHMWhibUZuWlhJdWJHOWhaRUZ1WkZKMWJpaHphMlYwWTJncE8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0J5WlhOMWJIUWdQU0JRY205dGFYTmxMbkpsYzI5c2RtVW9iV0Z1WVdkbGNpazdYRzRnSUNBZ2ZWeHVJQ0FnSUdsbUlDaHBjMGx1YW1WamRHbHVaeWtnZTF4dUlDQWdJQ0FnWTJGamFHVlFkWFFvYUc5MFNVUXNJSHNnYkc5aFpEb2djbVZ6ZFd4MExDQnRZVzVoWjJWeUlIMHBPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNCOUtUdGNibjFjYmx4dUx5OGdWRTlFVHpvZ1JtbG5kWEpsSUc5MWRDQmhJRzVwWTJVZ2QyRjVJSFJ2SUdWNGNHOXlkQ0IwYUdsdVozTXVYRzVqWVc1MllYTlRhMlYwWTJndVkyRnVkbUZ6VTJ0bGRHTm9JRDBnWTJGdWRtRnpVMnRsZEdOb08xeHVZMkZ1ZG1GelUydGxkR05vTGxCaGNHVnlVMmw2WlhNZ1BTQlFZWEJsY2xOcGVtVnpPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JqWVc1MllYTlRhMlYwWTJnN1hHNGlYU3dpYm1GdFpYTWlPbHNpWjJ4dlltRnNJaXdpYVhORVQwMGlMQ0pwYzBGeVozVnRaVzUwY3lJc0ltOWlhbVZqZEV0bGVYTWlMQ0prWldacGJtVWlMQ0owYUdseklpd2ljbVZ3WldGMElpd2lZMjl1YzNRaUxDSnNaWFFpTENKaGMzTnBaMjRpTENKblpYUkRZVzUyWVhORGIyNTBaWGgwSWl3aWNtbG5hSFJPYjNjaUxDSnBjMUJ5YjIxcGMyVWlMQ0prWldWd1JYRjFZV3dpTENKUVlYQmxjbE5wZW1WeklsMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenRKUVVGQkxGZEJRV01zUjBGQlJ5eFpRVUZaTzFGQlEzcENMRXRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4VFFVRlRMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzFsQlEzWkRMRWxCUVVrc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEZOQlFWTXNSVUZCUlN4UFFVRlBMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFRRVU4yUkR0TFFVTktMRU5CUVVNN08wbERTa1k3T3pzN096dEpRVkZCTEVsQlFVa3NjVUpCUVhGQ0xFZEJRVWNzVFVGQlRTeERRVUZETEhGQ1FVRnhRaXhEUVVGRE8wbEJRM3BFTEVsQlFVa3NZMEZCWXl4SFFVRkhMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zWTBGQll5eERRVUZETzBsQlEzSkVMRWxCUVVrc1owSkJRV2RDTEVkQlFVY3NUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXh2UWtGQmIwSXNRMEZCUXpzN1NVRkZOMFFzVTBGQlV5eFJRVUZSTEVOQlFVTXNSMEZCUnl4RlFVRkZPMHRCUTNSQ0xFbEJRVWtzUjBGQlJ5eExRVUZMTEVsQlFVa3NTVUZCU1N4SFFVRkhMRXRCUVVzc1UwRkJVeXhGUVVGRk8wMUJRM1JETEUxQlFVMHNTVUZCU1N4VFFVRlRMRU5CUVVNc2RVUkJRWFZFTEVOQlFVTXNRMEZCUXp0TlFVTTNSVHM3UzBGRlJDeFBRVUZQTEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRMUVVOdVFqczdTVUZGUkN4VFFVRlRMR1ZCUVdVc1IwRkJSenRMUVVNeFFpeEpRVUZKTzAxQlEwZ3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFVkJRVVU3VDBGRGJrSXNUMEZCVHl4TFFVRkxMRU5CUVVNN1QwRkRZanM3T3pzN1RVRkxSQ3hKUVVGSkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenROUVVNNVFpeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE8wMUJRMmhDTEVsQlFVa3NUVUZCVFN4RFFVRkRMRzFDUVVGdFFpeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFZEJRVWNzUlVGQlJUdFBRVU5xUkN4UFFVRlBMRXRCUVVzc1EwRkJRenRQUVVOaU96czdUVUZIUkN4SlFVRkpMRXRCUVVzc1IwRkJSeXhGUVVGRkxFTkJRVU03VFVGRFppeExRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzUlVGQlJTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMDlCUXpWQ0xFdEJRVXNzUTBGQlF5eEhRVUZITEVkQlFVY3NUVUZCVFN4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0UFFVTjRRenROUVVORUxFbEJRVWtzVFVGQlRTeEhRVUZITEUxQlFVMHNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hEUVVGRExFVkJRVVU3VDBGREwwUXNUMEZCVHl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VDBGRGFFSXNRMEZCUXl4RFFVRkRPMDFCUTBnc1NVRkJTU3hOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4TFFVRkxMRmxCUVZrc1JVRkJSVHRQUVVOeVF5eFBRVUZQTEV0QlFVc3NRMEZCUXp0UFFVTmlPenM3VFVGSFJDeEpRVUZKTEV0QlFVc3NSMEZCUnl4RlFVRkZMRU5CUVVNN1RVRkRaaXh6UWtGQmMwSXNRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEZWQlFWVXNUVUZCVFN4RlFVRkZPMDlCUXpGRUxFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4TlFVRk5MRU5CUVVNN1QwRkRka0lzUTBGQlF5eERRVUZETzAxQlEwZ3NTVUZCU1N4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNSVUZCUlN4RlFVRkZMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXp0UlFVTm9SQ3h6UWtGQmMwSXNSVUZCUlR0UFFVTjZRaXhQUVVGUExFdEJRVXNzUTBGQlF6dFBRVU5pT3p0TlFVVkVMRTlCUVU4c1NVRkJTU3hEUVVGRE8wMUJRMW9zUTBGQlF5eFBRVUZQTEVkQlFVY3NSVUZCUlRzN1RVRkZZaXhQUVVGUExFdEJRVXNzUTBGQlF6dE5RVU5pTzB0QlEwUTdPMGxCUlVRc1owSkJRV01zUjBGQlJ5eGxRVUZsTEVWQlFVVXNSMEZCUnl4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExGVkJRVlVzVFVGQlRTeEZRVUZGTEUxQlFVMHNSVUZCUlR0TFFVTTVSU3hKUVVGSkxFbEJRVWtzUTBGQlF6dExRVU5VTEVsQlFVa3NSVUZCUlN4SFFVRkhMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dExRVU14UWl4SlFVRkpMRTlCUVU4c1EwRkJRenM3UzBGRldpeExRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzVTBGQlV5eERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHROUVVNeFF5eEpRVUZKTEVkQlFVY3NUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZET3p0TlFVVTFRaXhMUVVGTExFbEJRVWtzUjBGQlJ5eEpRVUZKTEVsQlFVa3NSVUZCUlR0UFFVTnlRaXhKUVVGSkxHTkJRV01zUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRWRCUVVjc1EwRkJReXhGUVVGRk8xRkJRMjVETEVWQlFVVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdVVUZEY0VJN1QwRkRSRHM3VFVGRlJDeEpRVUZKTEhGQ1FVRnhRaXhGUVVGRk8wOUJRekZDTEU5QlFVOHNSMEZCUnl4eFFrRkJjVUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0UFFVTjBReXhMUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0UlFVTjRReXhKUVVGSkxHZENRVUZuUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVN1UwRkROVU1zUlVGQlJTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRUUVVOc1F6dFJRVU5FTzA5QlEwUTdUVUZEUkRzN1MwRkZSQ3hQUVVGUExFVkJRVVVzUTBGQlF6dExRVU5XTEVOQlFVTTdPenM3T3pzN08wbERla1pHTEZkQlFXTTdUVUZEV2tFc1kwRkJUU3hEUVVGRExGZEJRVmM3VFVGRGJFSkJMR05CUVUwc1EwRkJReXhYUVVGWExFTkJRVU1zUjBGQlJ5eEhRVUZITEZOQlFWTXNSMEZCUnl4SFFVRkhPMUZCUTNSRExFOUJRVThzVjBGQlZ5eERRVUZETEVkQlFVY3NSVUZCUlR0UFFVTjZRaXhIUVVGSExFbEJRVWtzUTBGQlF5eEhRVUZITEVsQlFVa3NVMEZCVXl4SFFVRkhMRWRCUVVjN1VVRkROMElzVDBGQlR5eERRVUZETEVsQlFVa3NTVUZCU1R0UFFVTnFRanM3U1VOT1NDeGxRVUZqTEVkQlFVY3NVMEZCVXl4RFFVRkRPenRKUVVVelFpeFRRVUZUTEZOQlFWTXNRMEZCUXl4SFFVRkhMRVZCUVVVN1RVRkRkRUlzVDBGQlR5eERRVUZETEVOQlFVTXNSMEZCUnl4TFFVRkxMRTlCUVU4c1IwRkJSeXhMUVVGTExGRkJRVkVzU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4VlFVRlZMRU5CUVVNc1NVRkJTU3hQUVVGUExFZEJRVWNzUTBGQlF5eEpRVUZKTEV0QlFVc3NWVUZCVlN4RFFVRkRPMHRCUXpGSE96dEpRMHBFTEZOQlFXTXNSMEZCUnl4UFFVRk5PenRKUVVWMlFpeFRRVUZUTEUxQlFVMHNSVUZCUlN4SFFVRkhMRVZCUVVVN1RVRkRjRUlzVDBGQlR5eERRVUZETEVOQlFVTXNSMEZCUnl4SlFVRkpMRTlCUVU4c1IwRkJSeXhMUVVGTExGRkJRVkU3VlVGRGJrTXNTMEZCU3p0VlFVTk1MRU5CUVVNc1QwRkJUeXhOUVVGTkxFdEJRVXNzVVVGQlVTeEpRVUZKTEU5QlFVOHNUVUZCVFN4RFFVRkRMRWxCUVVrc1MwRkJTeXhSUVVGUk8yRkJRek5FTEVkQlFVY3NXVUZCV1N4TlFVRk5MRU5CUVVNc1NVRkJTVHRaUVVNelFpeERRVUZETEU5QlFVOHNSMEZCUnl4RFFVRkRMRkZCUVZFc1MwRkJTeXhSUVVGUk8yRkJRMmhETEU5QlFVOHNSMEZCUnl4RFFVRkRMRkZCUVZFc1MwRkJTeXhSUVVGUkxFTkJRVU03UzBGRGVrTTdPMGxEVEUwc1UwRkJVeXhsUVVGblFqdFJRVU01UWl4UFFVRlBMRTlCUVU4c1RVRkJVQ3hMUVVGclFpeFhRVUZzUWl4SlFVRnBReXhOUVVGQkxFTkJRVTg3T3p0QlFVZHFSQ3hKUVVGUExGTkJRVk1zV1VGQllUdFJRVU16UWl4UFFVRlBMRTlCUVU4c1VVRkJVQ3hMUVVGdlFqczdPMEZCUnpkQ0xFbEJRVThzVTBGQlV5eGxRVUZuUWl4TFFVRkxPMUZCUTI1RExFOUJRVThzVDBGQlR5eEhRVUZCTEVOQlFVa3NTMEZCV0N4TFFVRnhRaXhWUVVGeVFpeEpRVUZ0UXl4UFFVRlBMRWRCUVVFc1EwRkJTU3hWUVVGWUxFdEJRVEJDTEZWQlFUZEVMRWxCUVRKRkxFOUJRVThzUjBGQlFTeERRVUZKTEZWQlFWZ3NTMEZCTUVJN096dEJRVWM1Unl4SlFVRlBMRk5CUVZNc1UwRkJWU3hUUVVGVE8xRkJRMnBETEU5QlFVOURMRXRCUVVFc1EwRkJUU3hSUVVGT0xFbEJRV3RDTEZOQlFVRXNRMEZCVlN4SlFVRldMRU5CUVdVc1QwRkJRU3hEUVVGUkxGTkJRWHBETEVsQlFYTkVMRTlCUVU4c1QwRkJRU3hEUVVGUkxGVkJRV1lzUzBGQk9FSTdPenM3U1VOcVFqZEdMRTlCUVU4c1IwRkJSeXhqUVVGakxFZEJRVWNzVDBGQlR5eE5RVUZOTEVOQlFVTXNTVUZCU1N4TFFVRkxMRlZCUVZVN1VVRkRlRVFzVFVGQlRTeERRVUZETEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNN08wbEJSWFpDTEZsQlFWa3NSMEZCUnl4SlFVRkpMRU5CUVVNN1NVRkRjRUlzVTBGQlV5eEpRVUZKTEVWQlFVVXNSMEZCUnl4RlFVRkZPMDFCUTJ4Q0xFbEJRVWtzU1VGQlNTeEhRVUZITEVWQlFVVXNRMEZCUXp0TlFVTmtMRXRCUVVzc1NVRkJTU3hIUVVGSExFbEJRVWtzUjBGQlJ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03VFVGRGNFTXNUMEZCVHl4SlFVRkpMRU5CUVVNN1MwRkRZanM3T3pzN1NVTlNSQ3hKUVVGSkxITkNRVUZ6UWl4SFFVRkhMRU5CUVVNc1ZVRkJWVHROUVVOMFF5eFBRVUZQTEUxQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTTdTMEZEYWtRc1IwRkJSeXhKUVVGSkxHOUNRVUZ2UWl4RFFVRkRPenRKUVVVM1FpeFBRVUZQTEVkQlFVY3NZMEZCWXl4SFFVRkhMSE5DUVVGelFpeEhRVUZITEZOQlFWTXNSMEZCUnl4WFFVRlhMRU5CUVVNN08wbEJSVFZGTEdsQ1FVRnBRaXhIUVVGSExGTkJRVk1zUTBGQlF6dEpRVU01UWl4VFFVRlRMRk5CUVZNc1EwRkJReXhOUVVGTkxFVkJRVVU3VFVGRGVrSXNUMEZCVHl4TlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVrc2IwSkJRVzlDTEVOQlFVTTdTMEZEZGtVN1NVRkZSQ3h0UWtGQmJVSXNSMEZCUnl4WFFVRlhMRU5CUVVNN1NVRkRiRU1zVTBGQlV5eFhRVUZYTEVOQlFVTXNUVUZCVFN4RFFVRkRPMDFCUXpGQ0xFOUJRVThzVFVGQlRUdFJRVU5ZTEU5QlFVOHNUVUZCVFN4SlFVRkpMRkZCUVZFN1VVRkRla0lzVDBGQlR5eE5RVUZOTEVOQlFVTXNUVUZCVFN4SlFVRkpMRkZCUVZFN1VVRkRhRU1zVFVGQlRTeERRVUZETEZOQlFWTXNRMEZCUXl4alFVRmpMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeFJRVUZSTEVOQlFVTTdVVUZEZEVRc1EwRkJReXhOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEc5Q1FVRnZRaXhEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNVVUZCVVN4RFFVRkRPMUZCUXpkRUxFdEJRVXNzUTBGQlF6dExRVU5VT3pzN096dEpRMjVDUkN4SlFVRkpMRTFCUVUwc1IwRkJSeXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXpzN096dEpRVWx1UXl4SlFVRkpMRk5CUVZNc1IwRkJSeXhqUVVGakxFZEJRVWNzVlVGQlZTeE5RVUZOTEVWQlFVVXNVVUZCVVN4RlFVRkZMRWxCUVVrc1JVRkJSVHROUVVOcVJTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1IwRkJSeXhGUVVGRkxFTkJRVU03TzAxQlJYSkNMRWxCUVVrc1RVRkJUU3hMUVVGTExGRkJRVkVzUlVGQlJUdFJRVU4yUWl4UFFVRlBMRWxCUVVrc1EwRkJRenM3VDBGRllpeE5RVUZOTEVsQlFVa3NUVUZCVFN4WlFVRlpMRWxCUVVrc1NVRkJTU3hSUVVGUkxGbEJRVmtzU1VGQlNTeEZRVUZGTzFGQlF6ZEVMRTlCUVU4c1RVRkJUU3hEUVVGRExFOUJRVThzUlVGQlJTeExRVUZMTEZGQlFWRXNRMEZCUXl4UFFVRlBMRVZCUVVVc1EwRkJRenM3T3p0UFFVbG9SQ3hOUVVGTkxFbEJRVWtzUTBGQlF5eE5RVUZOTEVsQlFVa3NRMEZCUXl4UlFVRlJMRWxCUVVrc1QwRkJUeXhOUVVGTkxFbEJRVWtzVVVGQlVTeEpRVUZKTEU5QlFVOHNVVUZCVVN4SlFVRkpMRkZCUVZFc1JVRkJSVHRSUVVNelJpeFBRVUZQTEVsQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1RVRkJUU3hMUVVGTExGRkJRVkVzUjBGQlJ5eE5RVUZOTEVsQlFVa3NVVUZCVVN4RFFVRkRPenM3T3pzN096dFBRVkV2UkN4TlFVRk5PMUZCUTB3c1QwRkJUeXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTEZGQlFWRXNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRQUVVONlF6dE5RVU5HT3p0SlFVVkVMRk5CUVZNc2FVSkJRV2xDTEVOQlFVTXNTMEZCU3l4RlFVRkZPMDFCUTJoRExFOUJRVThzUzBGQlN5eExRVUZMTEVsQlFVa3NTVUZCU1N4TFFVRkxMRXRCUVVzc1UwRkJVeXhEUVVGRE8wdEJRemxET3p0SlFVVkVMRk5CUVZNc1VVRkJVU3hGUVVGRkxFTkJRVU1zUlVGQlJUdE5RVU53UWl4SlFVRkpMRU5CUVVNc1EwRkJReXhKUVVGSkxFOUJRVThzUTBGQlF5eExRVUZMTEZGQlFWRXNTVUZCU1N4UFFVRlBMRU5CUVVNc1EwRkJReXhOUVVGTkxFdEJRVXNzVVVGQlVTeEZRVUZGTEU5QlFVOHNTMEZCU3l4RFFVRkRPMDFCUXpsRkxFbEJRVWtzVDBGQlR5eERRVUZETEVOQlFVTXNTVUZCU1N4TFFVRkxMRlZCUVZVc1NVRkJTU3hQUVVGUExFTkJRVU1zUTBGQlF5eExRVUZMTEV0QlFVc3NWVUZCVlN4RlFVRkZPMUZCUTJwRkxFOUJRVThzUzBGQlN5eERRVUZETzA5QlEyUTdUVUZEUkN4SlFVRkpMRU5CUVVNc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEpRVUZKTEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExGRkJRVkVzUlVGQlJTeFBRVUZQTEV0QlFVc3NRMEZCUXp0TlFVTXpSQ3hQUVVGUExFbEJRVWtzUTBGQlF6dExRVU5pT3p0SlFVVkVMRk5CUVZNc1VVRkJVU3hEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETEVWQlFVVXNTVUZCU1N4RlFVRkZPMDFCUXpWQ0xFbEJRVWtzUTBGQlF5eEZRVUZGTEVkQlFVY3NRMEZCUXp0TlFVTllMRWxCUVVrc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUXpsRExFOUJRVThzUzBGQlN5eERRVUZET3p0TlFVVm1MRWxCUVVrc1EwRkJReXhEUVVGRExGTkJRVk1zUzBGQlN5eERRVUZETEVOQlFVTXNVMEZCVXl4RlFVRkZMRTlCUVU4c1MwRkJTeXhEUVVGRE96czdUVUZIT1VNc1NVRkJTVU1zV1VGQlZ5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZPMUZCUTJ4Q0xFbEJRVWtzUTBGQlEwRXNXVUZCVnl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk8xVkJRMjVDTEU5QlFVOHNTMEZCU3l4RFFVRkRPMU5CUTJRN1VVRkRSQ3hEUVVGRExFZEJRVWNzVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOdVFpeERRVUZETEVkQlFVY3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU51UWl4UFFVRlBMRk5CUVZNc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMDlCUXpsQ08wMUJRMFFzU1VGQlNTeFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVN1VVRkRaaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZPMVZCUTJoQ0xFOUJRVThzUzBGQlN5eERRVUZETzFOQlEyUTdVVUZEUkN4SlFVRkpMRU5CUVVNc1EwRkJReXhOUVVGTkxFdEJRVXNzUTBGQlF5eERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRXRCUVVzc1EwRkJRenRSUVVONFF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1ZVRkROMElzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEU5QlFVOHNTMEZCU3l4RFFVRkRPMU5CUTJwRE8xRkJRMFFzVDBGQlR5eEpRVUZKTEVOQlFVTTdUMEZEWWp0TlFVTkVMRWxCUVVrN1VVRkRSaXhKUVVGSkxFVkJRVVVzUjBGQlIwTXNTVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVOc1FpeEZRVUZGTEVkQlFVZEJMRWxCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFBRVU40UWl4RFFVRkRMRTlCUVU4c1EwRkJReXhGUVVGRk8xRkJRMVlzVDBGQlR5eExRVUZMTEVOQlFVTTdUMEZEWkRzN08wMUJSMFFzU1VGQlNTeEZRVUZGTEVOQlFVTXNUVUZCVFN4SlFVRkpMRVZCUVVVc1EwRkJReXhOUVVGTk8xRkJRM2hDTEU5QlFVOHNTMEZCU3l4RFFVRkRPenROUVVWbUxFVkJRVVVzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXp0TlFVTldMRVZCUVVVc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF6czdUVUZGVml4TFFVRkxMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzFGQlEyNURMRWxCUVVrc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1ZVRkRhRUlzVDBGQlR5eExRVUZMTEVOQlFVTTdUMEZEYUVJN096dE5RVWRFTEV0QlFVc3NRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3VVVGRGJrTXNSMEZCUnl4SFFVRkhMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5hTEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hKUVVGSkxFTkJRVU1zUlVGQlJTeFBRVUZQTEV0QlFVc3NRMEZCUXp0UFFVTndSRHROUVVORUxFOUJRVThzVDBGQlR5eERRVUZETEV0QlFVc3NUMEZCVHl4RFFVRkRMRU5CUVVNN1MwRkRPVUk3T3pzN1NVTTNSa1E3T3pzN096czdPenM3T3pzN08wbEJZMEVzUTBGQlF5eFRRVUZUTEUxQlFVMHNSVUZCUlRzN1RVRkhhRUlzU1VGQlNTeFZRVUZWTEVkQlFVY3NRMEZCUXl4WFFVRlhPMVZCUTNwQ0xFbEJRVWtzUzBGQlN5eEhRVUZITEd0RlFVRnJSU3hEUVVGRE8xVkJReTlGTEVsQlFVa3NVVUZCVVN4SFFVRkhMSE5KUVVGelNTeERRVUZETzFWQlEzUktMRWxCUVVrc1dVRkJXU3hIUVVGSExHRkJRV0VzUTBGQlF6czdPMVZCUjJwRExFOUJRVThzVlVGQlZTeEpRVUZKTEVWQlFVVXNTVUZCU1N4RlFVRkZMRWRCUVVjc1JVRkJSU3hIUVVGSExFVkJRVVU3T3p0WlFVZHlReXhKUVVGSkxGTkJRVk1zUTBGQlF5eE5RVUZOTEV0QlFVc3NRMEZCUXl4SlFVRkpMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eFJRVUZSTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEZRVUZGTzJOQlF6TkZMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU03WTBGRFdpeEpRVUZKTEVkQlFVY3NVMEZCVXl4RFFVRkRPMkZCUTJ4Q096dFpRVVZFTEVsQlFVa3NSMEZCUnl4SlFVRkpMRWxCUVVrc1NVRkJTU3hKUVVGSkxFTkJRVU03TzFsQlJYaENMRWRCUVVjc1JVRkJSU3hKUVVGSkxGbEJRVmtzU1VGQlNTeERRVUZETEVWQlFVVTdZMEZETVVJc1NVRkJTU3hIUVVGSExFbEJRVWtzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMkZCUTNaQ096dFpRVVZFTEVsQlFVa3NTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRk8yTkJRMllzVFVGQlRTeFRRVUZUTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1lVRkRha003TzFsQlJVUXNTVUZCU1N4SFFVRkhMRTFCUVUwc1EwRkJReXhWUVVGVkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRWxCUVVrc1NVRkJTU3hWUVVGVkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNN096dFpRVWMzUlN4SlFVRkpMRk5CUVZNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVOcVF5eEpRVUZKTEZOQlFWTXNTMEZCU3l4TlFVRk5MRWxCUVVrc1UwRkJVeXhMUVVGTExFMUJRVTBzUlVGQlJUdGpRVU5vUkN4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0alFVTnlRaXhIUVVGSExFZEJRVWNzU1VGQlNTeERRVUZETzJOQlExZ3NTVUZCU1N4VFFVRlRMRXRCUVVzc1RVRkJUU3hGUVVGRk8yZENRVU40UWl4SFFVRkhMRWRCUVVjc1NVRkJTU3hEUVVGRE8yVkJRMW83WVVGRFJqczdXVUZGUkN4SlFVRkpMRU5CUVVNc1IwRkJSeXhIUVVGSExFZEJRVWNzVVVGQlVTeEhRVUZITEV0QlFVc3NRMEZCUXp0WlFVTXZRaXhKUVVGSkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNRMEZCUXl4SFFVRkhMRTFCUVUwc1EwRkJReXhGUVVGRkxFTkJRVU03V1VGRE0wSXNTVUZCU1N4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExFTkJRVU1zUjBGQlJ5eExRVUZMTEVOQlFVTXNSVUZCUlN4RFFVRkRPMWxCUXpGQ0xFbEJRVWtzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExFVkJRVVVzUTBGQlF6dFpRVU0xUWl4SlFVRkpMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUTBGQlF5eEhRVUZITEZWQlFWVXNRMEZCUXl4RlFVRkZMRU5CUVVNN1dVRkRMMElzU1VGQlNTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zUlVGQlJTeERRVUZETzFsQlF6VkNMRWxCUVVrc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF5eERRVUZETEVkQlFVY3NVMEZCVXl4RFFVRkRMRVZCUVVVc1EwRkJRenRaUVVNNVFpeEpRVUZKTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1EwRkJReXhIUVVGSExGTkJRVk1zUTBGQlF5eEZRVUZGTEVOQlFVTTdXVUZET1VJc1NVRkJTU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEVOQlFVTXNSMEZCUnl4alFVRmpMRU5CUVVNc1JVRkJSU3hEUVVGRE8xbEJRMjVETEVsQlFVa3NRMEZCUXl4SFFVRkhMRWRCUVVjc1IwRkJSeXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhGUVVGRkxFTkJRVU03V1VGRE0wTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzFsQlEzUkNMRWxCUVVrc1EwRkJReXhIUVVGSExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0WlFVTXpRaXhKUVVGSkxFdEJRVXNzUjBGQlJ6dGpRVU5XTEVOQlFVTXNTMEZCU3l4RFFVRkRPMk5CUTFBc1JVRkJSU3hKUVVGSkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdZMEZEV2l4SFFVRkhMRWRCUVVjc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRPMk5CUTJwRExFbEJRVWtzUlVGQlJTeFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzJOQlEzSkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF6dGpRVU5ZTEVWQlFVVXNTVUZCU1N4SFFVRkhMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dGpRVU5vUWl4SFFVRkhMRWRCUVVjc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRPMk5CUTI1RExFbEJRVWtzUlVGQlJTeFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzJOQlEzaERMRVZCUVVVc1NVRkJTU3hOUVVGTkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJRenRqUVVONFFpeEpRVUZKTEVWQlFVVXNRMEZCUXp0alFVTlFMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUlVGQlJTeEpRVUZKTEVWQlFVVTdZMEZEYkVJc1JVRkJSU3hKUVVGSkxFZEJRVWNzUTBGQlF5eERRVUZETEVkQlFVY3NSVUZCUlN4SlFVRkpMRVZCUVVVc1EwRkJRenRqUVVOMlFpeERRVUZETEV0QlFVc3NRMEZCUXp0alFVTlFMRVZCUVVVc1NVRkJTU3hIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzJOQlExb3NRMEZCUXl4TFFVRkxMRU5CUVVNN1kwRkRVQ3hGUVVGRkxFbEJRVWtzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXp0alFVTmFMRU5CUVVNc1MwRkJTeXhEUVVGRE8yTkJRMUFzUlVGQlJTeEpRVUZKTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1kwRkRXaXhEUVVGRExFdEJRVXNzUjBGQlJ5eERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1kwRkRaaXhEUVVGRExFdEJRVXNzUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF5eERRVUZETzJOQlF6ZENMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUlVGQlJTeEhRVUZITEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF6dGpRVU14UlN4RlFVRkZMRWxCUVVrc1EwRkJReXhIUVVGSExFVkJRVVVzUjBGQlJ5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU03WTBGRE1VVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhGUVVGRkxFZEJRVWNzVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRE8yTkJRekZGTEVWQlFVVXNTVUZCU1N4RFFVRkRMRWRCUVVjc1JVRkJSU3hIUVVGSExGVkJRVlVzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExGVkJRVlVzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1EwRkJRenRqUVVNeFJTeERRVUZETEV0QlFVc3NSMEZCUnl4SFFVRkhMRXRCUVVzc1IwRkJSeXhIUVVGSExFZEJRVWNzUzBGQlN5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhGUVVGRkxFZEJRVWNzUlVGQlJTeERRVUZETEU5QlFVOHNRMEZCUXl4WlFVRlpMRVZCUVVVc1JVRkJSU3hEUVVGRE8yTkJRM2hITEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUjBGQlJ5eEhRVUZITEVkQlFVY3NTVUZCU1N4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF5eEhRVUZITEVkQlFVY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVNN1kwRkRla1lzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRVZCUVVVc1IwRkJSeXhEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4SFFVRkhMRWRCUVVjc1IwRkJSeXhEUVVGRExFZEJRVWNzUlVGQlJTeEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRWRCUVVjc1JVRkJSU3hEUVVGRE8yTkJRMnhHTEVOQlFVTXNTMEZCU3l4RFFVRkRPMk5CUTFBc1EwRkJReXhMUVVGTExFTkJRVU03WVVGRFVpeERRVUZET3p0WlFVVkdMRTlCUVU4c1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVWQlFVVXNWVUZCVlN4TFFVRkxMRVZCUVVVN1kwRkRNVU1zU1VGQlNTeExRVUZMTEVsQlFVa3NTMEZCU3l4RlFVRkZPMmRDUVVOc1FpeFBRVUZQTEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRsUVVOeVFqdGpRVU5FTEU5QlFVOHNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFVkJRVVVzUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRoUVVONlF5eERRVUZETEVOQlFVTTdWMEZEU2l4RFFVRkRPMU5CUTBnc1IwRkJSeXhEUVVGRE96dE5RVVZRTEZWQlFWVXNRMEZCUXl4TFFVRkxMRWRCUVVjN1VVRkRha0lzVTBGQlV5eG5Ra0ZCWjBJc01FSkJRVEJDTzFGQlEyNUVMRmRCUVZjc1kwRkJZeXhSUVVGUk8xRkJRMnBETEZsQlFWa3NZVUZCWVN4aFFVRmhPMUZCUTNSRExGVkJRVlVzWlVGQlpTeGpRVUZqTzFGQlEzWkRMRlZCUVZVc1pVRkJaU3h2UWtGQmIwSTdVVUZETjBNc1YwRkJWeXhqUVVGakxGTkJRVk03VVVGRGJFTXNXVUZCV1N4aFFVRmhMRmxCUVZrN1VVRkRja01zVlVGQlZTeGxRVUZsTEdOQlFXTTdVVUZEZGtNc1UwRkJVeXhuUWtGQlowSXNXVUZCV1R0UlFVTnlReXhUUVVGVExHZENRVUZuUWl4VlFVRlZPMUZCUTI1RExHRkJRV0VzV1VGQldTd3dRa0ZCTUVJN1VVRkRia1FzWjBKQlFXZENMRk5CUVZNc2EwTkJRV3RETzFGQlF6TkVMSEZDUVVGeFFpeEpRVUZKTERaQ1FVRTJRanRQUVVOMlJDeERRVUZET3pzN1RVRkhSaXhWUVVGVkxFTkJRVU1zU1VGQlNTeEhRVUZITzFGQlEyaENMRkZCUVZFc1JVRkJSVHRWUVVOU0xFdEJRVXNzUlVGQlJTeExRVUZMTEVWQlFVVXNTMEZCU3l4RlFVRkZMRXRCUVVzc1JVRkJSU3hMUVVGTExFVkJRVVVzUzBGQlN5eEZRVUZGTEV0QlFVczdWVUZETDBNc1VVRkJVU3hGUVVGRkxGRkJRVkVzUlVGQlJTeFRRVUZUTEVWQlFVVXNWMEZCVnl4RlFVRkZMRlZCUVZVc1JVRkJSU3hSUVVGUkxFVkJRVVVzVlVGQlZUdFRRVU0zUlR0UlFVTkVMRlZCUVZVc1JVRkJSVHRWUVVOV0xFdEJRVXNzUlVGQlJTeExRVUZMTEVWQlFVVXNTMEZCU3l4RlFVRkZMRXRCUVVzc1JVRkJSU3hMUVVGTExFVkJRVVVzUzBGQlN5eEZRVUZGTEV0QlFVc3NSVUZCUlN4TFFVRkxMRVZCUVVVc1MwRkJTeXhGUVVGRkxFdEJRVXNzUlVGQlJTeExRVUZMTEVWQlFVVXNTMEZCU3p0VlFVTnNSaXhUUVVGVExFVkJRVVVzVlVGQlZTeEZRVUZGTEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVc1MwRkJTeXhGUVVGRkxFMUJRVTBzUlVGQlJTeE5RVUZOTEVWQlFVVXNVVUZCVVN4RlFVRkZMRmRCUVZjc1JVRkJSU3hUUVVGVExFVkJRVVVzVlVGQlZTeEZRVUZGTEZWQlFWVTdVMEZEZWtnN1VVRkRSQ3hUUVVGVExFVkJRVVU3VlVGRFZDeEhRVUZITEVWQlFVVXNSMEZCUnl4RlFVRkZMRWxCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVVzUjBGQlJ5eEZRVUZGTEVkQlFVY3NSVUZCUlN4SlFVRkpMRVZCUVVVc1NVRkJTVHRUUVVNelF6dFBRVU5HTEVOQlFVTTdPMGxCUlVvc1UwRkJVeXhIUVVGSExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVkQlFVY3NSVUZCUlR0TlFVTnlRaXhIUVVGSExFZEJRVWNzVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMDFCUTJ4Q0xFZEJRVWNzUjBGQlJ5eEhRVUZITEVsQlFVa3NRMEZCUXl4RFFVRkRPMDFCUTJZc1QwRkJUeXhIUVVGSExFTkJRVU1zVFVGQlRTeEhRVUZITEVkQlFVY3NSVUZCUlR0UlFVTjJRaXhIUVVGSExFZEJRVWNzUjBGQlJ5eEhRVUZITEVkQlFVY3NRMEZCUXp0UFFVTnFRanROUVVORUxFOUJRVThzUjBGQlJ5eERRVUZETzB0QlExbzdPenM3T3pzN096czdTVUZWUkN4VFFVRlRMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVU3TzAxQlJYSkNMRWxCUVVrc1kwRkJZeXhIUVVGSExFbEJRVWtzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVc1JVRkJSU3hKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTEVWQlFVVXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSU3hEUVVGRExFTkJRVU03T3p0TlFVZHVSaXhqUVVGakxFTkJRVU1zVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eE5RVUZOTEVWQlFVVXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdPenROUVVjelJpeEpRVUZKTEdGQlFXRXNSMEZCUnl4SlFVRkpMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVWQlFVVXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE96czdUVUZIYWtVc1lVRkJZU3hEUVVGRExFOUJRVThzUTBGQlF5eGhRVUZoTEVOQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zVFVGQlRTeEZRVUZGTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZET3pzN1RVRkhlRVlzU1VGQlNTeEZRVUZGTEVkQlFVY3NZMEZCWXl4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTEVkQlFVY3NZVUZCWVN4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTEVOQlFVTTdUVUZEYUVZc1kwRkJZeXhEUVVGRExGRkJRVkVzUTBGQlF5eGpRVUZqTEVOQlFVTXNVVUZCVVN4RlFVRkZMRWRCUVVjc1JVRkJSU3hEUVVGRExFTkJRVU03T3p0TlFVZDRSQ3hKUVVGSkxGRkJRVkVzUjBGQlJ5eERRVUZETEdOQlFXTXNSMEZCUnl4aFFVRmhMRXRCUVVzc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzAxQlF5OUVMRTlCUVU4c1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1MwRkRha003T3pzN096czdPenRKUVZORUxGTkJRVk1zV1VGQldTeERRVUZETEVsQlFVa3NSVUZCUlR0TlFVTXhRaXhKUVVGSkxFZEJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNN1RVRkRlRUlzUjBGQlJ5eEhRVUZITEV0QlFVc3NRMEZCUXl4RlFVRkZPMUZCUTFvc1IwRkJSeXhIUVVGSExFTkJRVU1zUTBGQlF6dFBRVU5VTzAxQlEwUXNUMEZCVHl4SFFVRkhMRU5CUVVNN1MwRkRXanM3T3pzN096dEpRVTlFTEZOQlFWTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1JVRkJSVHROUVVOdVFpeEpRVUZKTEVkQlFVY3NTMEZCU3l4SlFVRkpMRVZCUVVVN1VVRkRhRUlzVDBGQlR5eE5RVUZOTEVOQlFVTTdUMEZEWmpzN1RVRkZSQ3hKUVVGSkxFZEJRVWNzUzBGQlN5eFRRVUZUTEVWQlFVVTdVVUZEY2tJc1QwRkJUeXhYUVVGWExFTkJRVU03VDBGRGNFSTdPMDFCUlVRc1NVRkJTU3hQUVVGUExFZEJRVWNzUzBGQlN5eFJRVUZSTEVWQlFVVTdVVUZETTBJc1QwRkJUeXhQUVVGUExFZEJRVWNzUTBGQlF6dFBRVU51UWpzN1RVRkZSQ3hKUVVGSkxFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVN1VVRkRkRUlzVDBGQlR5eFBRVUZQTEVOQlFVTTdUMEZEYUVJN08wMUJSVVFzVDBGQlR5eEZRVUZGTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU03VTBGRGVrSXNTMEZCU3l4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRPMHRCUXk5Q096czdUVUZKUXl4SlFVRkpMRTlCUVU5RExGTkJRVTBzUzBGQlN5eFZRVUZWTEVsQlFVbEJMRk5CUVUwc1EwRkJReXhIUVVGSExFVkJRVVU3VVVGRE9VTkJMRk5CUVUwc1EwRkJReXhaUVVGWk8xVkJRMnBDTEU5QlFVOHNWVUZCVlN4RFFVRkRPMU5CUTI1Q0xFTkJRVU1zUTBGQlF6dFBRVU5LTEUxQlFVMHNRVUZCYVVNN1VVRkRkRU1zWTBGQll5eEhRVUZITEZWQlFWVXNRMEZCUXp0UFFVTTNRaXhCUVVWQk8wdEJRMFlzUlVGQlJVTXNZMEZCU1N4RFFVRkRMRU5CUVVNN096dEpRM0JQVkRzN096czdPenM3T3pzN1NVRmhRU3hKUVVGSkxFZEJRVWNzUjBGQlJ5eEZRVUZGTEVOQlFVTTdTVUZEWWl4SlFVRkpMRXRCUVVzc1EwRkJRenM3T3pzN08wbEJUVllzWjBKQlFXTXNSMEZCUnl4TlFVRk5MRU5CUVVNN096czdPenM3T3pzN096czdPenM3T3pzN08wbEJiMEo0UWl4VFFVRlRMRTFCUVUwc1EwRkJReXhIUVVGSExFVkJRVVVzUjBGQlJ5eEZRVUZGTzAxQlEzaENMRWxCUVVrc1QwRkJUeXhIUVVGSExFdEJRVXNzVVVGQlVTeEZRVUZGTzFGQlF6TkNMRTFCUVUwc1NVRkJTU3hUUVVGVExFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1EwRkJRenRQUVVNeFF6czdPMDFCUjBRc1NVRkJTU3hIUVVGSExFdEJRVXNzUTBGQlF5eEZRVUZGTEU5QlFVOHNSMEZCUnl4RFFVRkRPMDFCUXpGQ0xFbEJRVWtzUjBGQlJ5eExRVUZMTEVOQlFVTXNSVUZCUlN4UFFVRlBMRWRCUVVjc1IwRkJSeXhIUVVGSExFTkJRVU03TzAxQlJXaERMRWxCUVVrc1IwRkJSeXhIUVVGSExFZEJRVWNzUTBGQlF5eE5RVUZOTEVkQlFVY3NSMEZCUnl4RFFVRkRPMDFCUXpOQ0xFbEJRVWtzUzBGQlN5eExRVUZMTEVkQlFVY3NTVUZCU1N4UFFVRlBMRXRCUVVzc1MwRkJTeXhYUVVGWExFVkJRVVU3VVVGRGFrUXNTMEZCU3l4SFFVRkhMRWRCUVVjc1EwRkJRenRSUVVOYUxFZEJRVWNzUjBGQlJ5eEZRVUZGTEVOQlFVTTdUMEZEVml4TlFVRk5MRWxCUVVrc1IwRkJSeXhEUVVGRExFMUJRVTBzU1VGQlNTeEhRVUZITEVWQlFVVTdVVUZETlVJc1QwRkJUeXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNSVUZCUlN4SFFVRkhMRU5CUVVNc1EwRkJRenRQUVVNelFqczdUVUZGUkN4UFFVRlBMRWRCUVVjc1IwRkJSeXhIUVVGSExFTkJRVU1zVFVGQlRTeEpRVUZKTEVkQlFVY3NSMEZCUnl4RFFVRkRMRVZCUVVVN1VVRkRiRU1zU1VGQlNTeEhRVUZITEVkQlFVY3NRMEZCUXl4RlFVRkZPMVZCUTFnc1IwRkJSeXhKUVVGSkxFZEJRVWNzUTBGQlF6dFRRVU5hT3p0UlFVVkVMRWRCUVVjc1MwRkJTeXhEUVVGRExFTkJRVU03VVVGRFZpeEhRVUZITEVsQlFVa3NSMEZCUnl4RFFVRkRPMDlCUTFvN08wMUJSVVFzUjBGQlJ5eEpRVUZKTEVkQlFVY3NRMEZCUXp0TlFVTllMRWRCUVVjc1IwRkJSeXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNSVUZCUlN4SFFVRkhMRU5CUVVNc1EwRkJRenROUVVONlFpeFBRVUZQTEVkQlFVY3NRMEZCUXp0TFFVTmFPenRKUXpGRVJDeFhRVUZqTEVkQlFVY3NVMEZCVXl4UFFVRlBMRU5CUVVNc1IwRkJSeXhGUVVGRkxFZEJRVWNzUlVGQlJTeEZRVUZGTEVWQlFVVTdUVUZET1VNc1IwRkJSeXhIUVVGSExFZEJRVWNzUTBGQlF5eFJRVUZSTEVWQlFVVXNRMEZCUXpzN1RVRkZja0lzU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4WFFVRlhMRVZCUVVVN1VVRkRPVUlzVDBGQlR5eEhRVUZITEVOQlFVTTdUMEZEV2pzN1RVRkZSQ3hKUVVGSkxFVkJRVVVzUzBGQlN5eERRVUZETEVWQlFVVTdVVUZEV2l4RlFVRkZMRWRCUVVjc1IwRkJSeXhEUVVGRE8wOUJRMVlzVFVGQlRTeEpRVUZKTEVWQlFVVXNSVUZCUlR0UlFVTmlMRVZCUVVVc1IwRkJSeXhGUVVGRkxFTkJRVU1zVVVGQlVTeEZRVUZGTEVOQlFVTTdUMEZEY0VJc1RVRkJUVHRSUVVOTUxFVkJRVVVzUjBGQlJ5eEhRVUZITEVOQlFVTTdUMEZEVmpzN1RVRkZSQ3hQUVVGUFF5eFpRVUZOTEVOQlFVTXNSVUZCUlN4RlFVRkZMRWRCUVVjc1IwRkJSeXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NSMEZCUnl4RFFVRkRPMHRCUXpORExFTkJRVU03TzBsRGRFSkdReXhKUVVGTkxHMUNRVUZQTzBsQlEySkRMRWxCUVVrN1NVRlJTa1FzU1VGQlRTeHhRa0ZCY1VJc1EwRkRla0lzV1VGRFFTeGhRVU5CTzBGQlIwWXNTVUZCVHl4VFFVRlRMR0ZCUVdNc1RVRkJVU3hGUVVGQkxFdEJRVlU3YVVOQlFWWXNSMEZCVFRzN1VVRkRNVU5CTEVsQlFVMHNWMEZCVnl4SFFVRkJMRU5CUVVrc1VVRkJTaXhKUVVGblFqdFJRVU5xUXl4SlFVRkpMRU5CUVVNc2EwSkJRVUVzUTBGQmJVSXNVVUZCYmtJc1EwRkJORUk3WTBGQlZ5eE5RVUZOTEVsQlFVa3NTMEZCU2l3clFrRkJjVU03VVVGRGRrWkRMRWxCUVVrc1lVRkJZU3hSUVVGQkxFTkJRVk1zUzBGQlZDeERRVUZsTEVsQlFXWXNRMEZCYjBJc1JVRkJjRUlzU1VGQk1FSXNTVUZCU1N4UFFVRXZRaXhEUVVGMVF5eFRRVUZUTzFGQlEyaEZMRWxCUVVrN1kwRkJWeXhUUVVGQkxFZEJRVmtzVDBGQlNTeFhRVUZaTEZkQlFXaENPMUZCUXpOQ0xFOUJRVTg3ZFVKQlEwd3NVMEZFU3p0WlFVVk1MRTFCUVUwc1VVRkdSRHRaUVVkTUxGTkJRVk1zVFVGQlFTeERRVUZQTEZOQlFWQXNRMEZCYVVJc1ZVRkJWU3hIUVVGQkxFTkJRVWs3T3pzN1NVRkpOVU1zVTBGQlV5eHpRa0ZCZFVJc1UwRkJVenRSUVVOMlF5eFBRVUZQTEVsQlFVa3NUMEZCU2l4WFFVRmhPMWxCUTJ4Q1JDeEpRVUZOTEdGQlFXRXNUMEZCUVN4RFFVRlJMRTlCUVZJc1EwRkJaMEk3V1VGRGJrTXNTVUZCU1N4VlFVRkJMRXRCUVdVc1EwRkJReXhIUVVGSE8yZENRVU55UWl4UFFVRkJMRU5CUVZFc1NVRkJTU3hOUVVGQkxFTkJRVThzU1VGQldEdG5Ra0ZEVWpzN1dVRkZSa0VzU1VGQlRTeFRRVUZUTEU5QlFVRXNRMEZCVVN4TFFVRlNMRU5CUVdNc1ZVRkJRU3hIUVVGaE8xbEJRekZEUVN4SlFVRk5MR0ZCUVdFc1RVRkJRU3hEUVVGUExFbEJRVkFzUTBGQldUdFpRVU12UWtFc1NVRkJUU3haUVVGWkxHVkJRVUVzUTBGQlowSXNTVUZCYUVJc1EwRkJjVUk3V1VGRGRrTkJMRWxCUVUwc1VVRkJVU3hUUVVGQkxFZEJRVmtzVTBGQlFTeERRVUZWTEV0QlFVc3NUMEZCVHp0WlFVTm9SRUVzU1VGQlRTeExRVUZMTEVsQlFVa3NWMEZCU2l4RFFVRm5RaXhWUVVGQkxFTkJRVmM3V1VGRGRFTkJMRWxCUVUwc1MwRkJTeXhKUVVGSkxGVkJRVW9zUTBGQlpUdFpRVU14UWl4TFFVRkxMRWxCUVVrc1NVRkJTU3hGUVVGSExFTkJRVUVzUjBGQlNTeFZRVUZCTEVOQlFWY3NVVUZCVVN4RFFVRkJMRWxCUVVzN1owSkJRekZETEVWQlFVRXNRMEZCUnl4RlFVRklMRWRCUVZFc1ZVRkJRU3hEUVVGWExGVkJRVmdzUTBGQmMwSTdPMWxCUldoRExFOUJRVUVzUTBGQlVTeEpRVUZKTEUxQlFVRXNRMEZCVHl4SlFVRllMRU5CUVdkQ0xFTkJRVVVzUzBGQlRUdG5Ra0ZCUlN4TlFVRk5PenM3T3p0QlFVazFReXhKUVVGUExGTkJRVk1zV1VGQllTeFBRVUZUTEVWQlFVRXNUVUZCVnp0dFEwRkJXQ3hIUVVGUE96dFJRVU16UXl4UFFVRlBMSEZDUVVGQkxFTkJRWE5DTEZGQlFYUkNMRU5CUTBvc1NVRkVTU3hYUVVORExHVkJRVkVzVVVGQlFTeERRVUZUTEUxQlFVMDdPenRCUVVkcVF5eEpRVUZQTEZOQlFWTXNVMEZCVlN4SlFVRk5MRVZCUVVFc1RVRkJWenR0UTBGQldDeEhRVUZQT3p0UlFVTnlReXhQUVVGUExFbEJRVWtzVDBGQlNpeFhRVUZaTzFsQlEycENMRWxCUVVFc1IwRkJUMFVzV1VGQlFTeERRVUZQTzJkQ1FVRkZMRmRCUVZjc1JVRkJZanRuUWtGQmFVSXNVVUZCVVN4RlFVRjZRanRuUWtGQk5rSXNVVUZCVVR0bFFVRk5PMWxCUTNwRVJpeEpRVUZOTEZkQlFWY3NaVUZCUVN4RFFVRm5RanRaUVVWcVEwRXNTVUZCVFN4VFFVRlRMRmxCUVVFN1dVRkRaaXhKUVVGSkxFMUJRVUVzU1VGQlZTeFBRVUZQTEUxQlFVRXNRMEZCVHl4UlFVRmtMRXRCUVRKQ0xGVkJRWEpETEVsQlFXMUVMRTFCUVVFc1EwRkJUeXhSUVVGUk8yZENRVVZ3UlN4UFFVRlBMRTFCUVVFc1EwRkJUeXhSUVVGUUxFTkJRV2RDTEUxQlFVMUZMRmxCUVVFc1EwRkJUeXhKUVVGSkxFMUJRVTA3T0VKQlFVVTdiVUpCUVhwRExFTkJRMG9zU1VGRVNTeFhRVU5ETEdGQlFVMHNUMEZCUVN4RFFVRlJPMjFDUVVOcVFqdG5Ra0ZGVEN4SlFVRkpMRU5CUVVNc1RVRkJUVHR2UWtGRFZDeEpRVUZCTEVkQlFVOHNVVUZCUVN4RFFVRlRMR0ZCUVZRc1EwRkJkVUk3YjBKQlF6bENMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmNzVlVGQldDeEhRVUYzUWp0dlFrRkRlRUlzU1VGQlFTeERRVUZMTEUxQlFVd3NSMEZCWXpzN1owSkJSV2hDTEVsQlFVRXNRMEZCU3l4UlFVRk1MRWRCUVdkQ08yZENRVU5vUWl4SlFVRkJMRU5CUVVzc1NVRkJUQ3hIUVVGWkxFMUJRVUVzUTBGQlR5eEhRVUZRTEVOQlFWY3NaVUZCV0N4RFFVRXlRanRuUWtGRGRrTXNVVUZCUVN4RFFVRlRMRWxCUVZRc1EwRkJZeXhYUVVGa0xFTkJRVEJDTzJkQ1FVTXhRaXhKUVVGQkxFTkJRVXNzVDBGQlRDeG5Ra0ZCWlR0dlFrRkRZaXhKUVVGQkxFTkJRVXNzVDBGQlRDeEhRVUZsTzI5Q1FVTm1MRlZCUVVFc1lVRkJWenQzUWtGRFZDeE5RVUZCTEVOQlFVOHNSMEZCVUN4RFFVRlhMR1ZCUVZnc1EwRkJNa0k3ZDBKQlF6TkNMRkZCUVVFc1EwRkJVeXhKUVVGVUxFTkJRV01zVjBGQlpDeERRVUV3UWp0M1FrRkRNVUlzU1VGQlFTeERRVUZMTEdWQlFVd3NRMEZCY1VJN2QwSkJRM0pDTEU5QlFVRXNRMEZCVVR0elEwRkJSU3hSUVVGR096UkNRVUZaTEZGQlFWRTdPenM3WjBKQlIyaERMRWxCUVVFc1EwRkJTeXhMUVVGTU96czdPenRCUVV0T0xFbEJRVThzVTBGQlV5eFRRVUZWTEVsQlFVMHNSVUZCUVN4TlFVRlhPMjFEUVVGWUxFZEJRVTg3TzFGQlEzSkRSaXhKUVVGTkxGRkJRVkVzUzBGQlFTeERRVUZOTEU5QlFVNHNRMEZCWXl4TFFVRmtMRWRCUVhOQ0xFOUJRVThzUTBGQlJUdFJRVU0zUTBFc1NVRkJUU3hQUVVGUExFbEJRVWtzVFVGQlFTeERRVUZQTEVsQlFWZ3NRMEZCWjBJc1QwRkJUenRaUVVGRkxFMUJRVTBzU1VGQlFTeERRVUZMTEVsQlFVd3NTVUZCWVRzN1VVRkRla1FzVDBGQlR5eFJRVUZCTEVOQlFWTXNUVUZCVFRzN08wRkJSM2hDTEVsQlFVOHNVMEZCVXl4alFVRmxPMUZCUXpkQ1FTeEpRVUZOTEdkQ1FVRm5RanRSUVVOMFFpeFBRVUZQTEZWQlFVRXNRMEZCVnl4SlFVRkpMRWxCUVVvc1NVRkJXVHM3TzBsQlUyaERMRk5CUVZNc1owSkJRV2xDTEV0QlFWVTdhVU5CUVZZc1IwRkJUVHM3VVVGRE9VSXNSMEZCUVN4SFFVRk5SU3haUVVGQkxFTkJRVThzU1VGQlNUdFJRVWRxUWl4SlFVRkpMRTlCUVU4c1IwRkJRU3hEUVVGSkxFbEJRVmdzUzBGQmIwSXNXVUZCV1R0WlFVTnNReXhQUVVGUExFZEJRVUVzUTBGQlNTeEpRVUZLTEVOQlFWTTdaVUZEV0N4SlFVRkpMRWRCUVVFc1EwRkJTU3hOUVVGTk8xbEJRMjVDTEU5QlFVOHNSMEZCUVN4RFFVRkpPenRSUVVkaVJDeEpRVUZKTEZGQlFWRTdVVUZEV2tFc1NVRkJTU3haUVVGWk8xRkJRMmhDTEVsQlFVa3NUMEZCVHl4SFFVRkJMRU5CUVVrc1UwRkJXQ3hMUVVGNVFqdGpRVUZWTEZOQlFVRXNSMEZCV1N4SFFVRkJMRU5CUVVrN1VVRkZka1FzU1VGQlNTeFBRVUZQTEVkQlFVRXNRMEZCU1N4TFFVRllMRXRCUVhGQ0xGVkJRVlU3V1VGRGFrTkJMRWxCUVVrN1dVRkRTaXhKUVVGSkxFOUJRVThzUjBGQlFTeERRVUZKTEZkQlFWZ3NTMEZCTWtJc1ZVRkJWVHRuUWtGRGRrTXNWMEZCUVN4SFFVRmpMRWRCUVVFc1EwRkJTVHR0UWtGRFlqdG5Ra0ZEVEN4WFFVRkJMRWRCUVdNc1NVRkJRU3hEUVVGTExFZEJRVXdzUTBGQlV5eE5RVUZOTEVkQlFVRXNRMEZCU1RzN1dVRkZia01zUzBGQlFTeEhRVUZSTEU5QlFVRXNRMEZCVVN4TlFVRkJMRU5CUVU4c1IwRkJRU3hEUVVGSkxGRkJRVkVzVFVGQlFTeERRVUZQTEZsQlFWQXNRMEZCYjBJc1VVRkJVVHM3VVVGSGFrVkVMRWxCUVUwc1YwRkJWeXhSUVVGQkxFTkJRVk1zUjBGQlFTeERRVUZKTEZsQlFXSXNTVUZCTmtJc1VVRkJRU3hEUVVGVExFZEJRVUVzUTBGQlNTeE5RVUV4UXl4SlFVRnZSQ3hIUVVGQkxFTkJRVWtzVjBGQlNpeEhRVUZyUWl4RFFVRjBSU3hWUVVFMlJTeEhRVUZCTEVOQlFVa3NWVUZCVlR0UlFVTTFSeXhKUVVGSkxFdEJRVUVzU1VGQlV5eE5RVUZOTzFsQlEycENMRTlCUVU4c1EwRkJSU3hUUVVGVkxFMUJRVm9zUTBGQmIwSXNUVUZCY0VJc1EwRkJNa0lzVVVGQk0wSXNRMEZCYjBNc1NVRkJjRU1zUTBGQmVVTXNTVUZCZWtNc1IwRkJaMFE3WlVGRGJFUTdXVUZEVEVFc1NVRkJUU3hyUWtGQmEwSXNSMEZCUVN4RFFVRkpPMWxCUXpWQ0xFOUJRVThzUTBGQlJTeEhRVUZCTEVOQlFVa3NUMEZCVVN4SFFVRkJMRU5CUVVrc1NVRkJTaXhKUVVGWkxHZENRVUZwUWl4VFFVRlZMRWRCUVVFc1EwRkJTU3hMUVVGTkxFZEJRVUVzUTBGQlNTeFBRVUZ1UlN4RFFVRTBSU3hOUVVFMVJTeERRVUZ0Uml4UlFVRnVSaXhEUVVFMFJpeEpRVUUxUml4RFFVRnBSeXhKUVVGcVJ5eEhRVUYzUnpzN096dEpRM1pKY0Vjc05FSkJRVlVzUzBGQlZUdHBRMEZCVml4SFFVRk5PenRSUVVNM1FrRXNTVUZCVFN4dlFrRkJWVHRaUVVOa0xFbEJRVWtzUTBGQlF5eEhRVUZCTEVOQlFVa3NUMEZCU2p0clFrRkJaVHRaUVVWd1FrRXNTVUZCVFN4VFFVRlRMRmxCUVVFN1dVRkRaaXhKUVVGSkxFVkJRVUVzUTBGQlJ5eFBRVUZJTEV0QlFXVXNSVUZCWml4SlFVRnhRaXhEUVVGRExFVkJRVUVzUTBGQlJ5eE5RVUY2UWl4TFFVRnZReXhGUVVGQkxFTkJRVWNzVDBGQlNDeEpRVUZqTEVWQlFVRXNRMEZCUnl4VlFVRlZPMmRDUVVWcVJTeEZRVUZCTEVOQlFVY3NZMEZCU0R0blFrRkRRU3hIUVVGQkxFTkJRVWtzU1VGQlNpeERRVUZUTzIxQ1FVTktMRWxCUVVrc1JVRkJRU3hEUVVGSExFOUJRVWdzUzBGQlpTeEpRVUZKTzJkQ1FVYzFRaXhIUVVGQkxFTkJRVWtzVlVGQlNpeERRVUZsTzIxQ1FVTldMRWxCUVVrc1RVRkJRU3hKUVVGVkxFTkJRVU1zUlVGQlFTeERRVUZITEUxQlFXUXNTVUZCZDBJc1JVRkJRU3hEUVVGSExFOUJRVWdzUzBGQlpTeEZRVUYyUXl4TFFVRTRReXhGUVVGQkxFTkJRVWNzVDBGQlNDeEpRVUZqTEVWQlFVRXNRMEZCUnl4VlFVRlZPMmRDUVVWc1JpeEZRVUZCTEVOQlFVY3NZMEZCU0R0blFrRkRRU3hIUVVGQkxFTkJRVWtzVFVGQlNpeERRVUZYT3pzN1VVRkpaa0VzU1VGQlRTeHhRa0ZCVXp0WlFVTmlMRTFCUVVFc1EwRkJUeXhuUWtGQlVDeERRVUYzUWl4WFFVRlhPenRSUVVkeVEwRXNTVUZCVFN4eFFrRkJVenRaUVVOaUxFMUJRVUVzUTBGQlR5eHRRa0ZCVUN4RFFVRXlRaXhYUVVGWE96dFJRVWQ0UXl4UFFVRlBPMjlDUVVOTUxFMUJSRXM3YjBKQlJVdzdPenM3U1VOb1EwcEJMRWxCUVUwc1pVRkJaVHRKUVVWeVFrRXNTVUZCVFN4UFFVRlBMRU5CUjFnc1EwRkJSU3hYUVVGWkxFMUJRVThzVDBGRGNrSXNRMEZCUlN4bFFVRm5RaXhKUVVGTExFdEJRM1pDTEVOQlFVVXNVMEZCVlN4SlFVRkxPMUZCUTJwQ0xFTkJRVVVzWlVGQlowSXNTVUZCU3l4TFFVTjJRaXhEUVVGRkxHZENRVUZwUWl4TFFVRk5MRTFCUjNwQ0xFTkJRVVVzUzBGQlRTeEpRVUZMTEUxQlEySXNRMEZCUlN4TFFVRk5PMUZCUVVzc1MwRkRZaXhEUVVGRkxFdEJRVTBzU1VGQlN5eExRVU5pTEVOQlFVVXNTMEZCVFN4SlFVRkxMRXRCUTJJc1EwRkJSU3hMUVVGTkxFbEJRVXNzUzBGRFlpeERRVUZGTEV0QlFVMHNTVUZCU3l4TFFVTmlMRU5CUVVVc1MwRkJUU3hKUVVGTE8xRkJRMklzUTBGQlJTeExRVUZOTEVkQlFVa3NTMEZEV2l4RFFVRkZMRXRCUVUwc1IwRkJTU3hKUVVOYUxFTkJRVVVzUzBGQlRTeEhRVUZKTEVsQlExb3NRMEZCUlN4TlFVRlBMRWRCUVVrc1NVRkRZaXhEUVVGRkxFMUJRVThzUzBGQlRTeE5RVU5tTEVOQlFVVTdVVUZCVHl4TFFVRk5MRTFCUTJZc1EwRkJSU3hMUVVGTkxFdEJRVTBzVFVGRFpDeERRVUZGTEV0QlFVMHNTVUZCU3l4TlFVTmlMRU5CUVVVc1RVRkJUeXhKUVVGTExFMUJRMlFzUTBGQlJTeExRVUZOTEVsQlFVc3NTMEZEWWl4RFFVRkZPMUZCUVU4c1NVRkJTeXhMUVVOa0xFTkJRVVVzUzBGQlRTeEpRVUZMTEV0QlEySXNRMEZCUlN4TFFVRk5MRWxCUVVzc1MwRkRZaXhEUVVGRkxFdEJRVTBzU1VGQlN5eExRVU5pTEVOQlFVVXNTMEZCVFN4SlFVRkxMRXRCUTJJc1EwRkJSU3hMUVVGTk8xRkJRVWtzUzBGRFdpeERRVUZGTEV0QlFVMHNSMEZCU1N4SlFVTmFMRU5CUVVVc1MwRkJUU3hIUVVGSkxFbEJRMW9zUTBGQlJTeE5RVUZQTEVkQlFVa3NTVUZEWWl4RFFVRkZMRTFCUVU4c1IwRkJTU3hKUVVOaUxFTkJRVVVzVFVGQlR5eEhRVUZKTEVsQlEySXNRMEZCUlR0UlFVRk5MRWxCUVVzc1RVRkRZaXhEUVVGRkxFdEJRVTBzU1VGQlN5eExRVU5pTEVOQlFVVXNTMEZCVFN4SlFVRkxMRXRCUTJJc1EwRkJSU3hMUVVGTkxFbEJRVXNzUzBGRFlpeERRVUZGTEV0QlFVMHNTVUZCU3l4TFFVTmlMRU5CUVVVc1MwRkJUVHRSUVVGTExFdEJRMklzUTBGQlJTeExRVUZOTEVsQlFVc3NTMEZEWWl4RFFVRkZMRXRCUVUwc1IwRkJTU3hMUVVOYUxFTkJRVVVzUzBGQlRTeEhRVUZKTEVsQlExb3NRMEZCUlN4TFFVRk5MRWRCUVVrc1NVRkRXaXhEUVVGRkxFMUJRVThzUjBGQlNTeEpRVU5pTEVOQlFVVTdVVUZCVHl4SFFVRkpMRWxCUTJJc1EwRkJSU3hOUVVGUExFZEJRVWtzU1VGSllpeERRVUZGTEdOQlFXVXNTVUZCU3l4SlFVRkxMRTFCUXpOQ0xFTkJRVVVzVTBGQlZTeEpRVUZMTEVkQlFVa3NUVUZEY2tJc1EwRkJSVHRSUVVGVExFbEJRVXNzUjBGQlNTeE5RVU53UWl4RFFVRkZMR1ZCUVdkQ0xFVkJRVWNzUlVGQlJ5eE5RVU40UWl4RFFVRkZMRk5CUVZVc1IwRkJTU3hIUVVGSkxFMUJRM0JDTEVOQlFVVXNWVUZCVnl4SFFVRkpPMUZCUVVrc1RVRkRja0lzUTBGQlJTeFRRVUZWTEVsQlFVc3NTMEZCVFN4TlFVTjJRaXhEUVVGRkxGTkJRVlVzUzBGQlRTeExRVUZOTEUxQlEzaENMRU5CUVVVc1UwRkJWU3hMUVVGTk8xRkJRVTBzVFVGRGVFSXNRMEZCUlN4VFFVRlZMRXRCUVUwc1MwRkJUU3hOUVVONFFpeERRVUZGTEZOQlFWVXNTMEZCVFN4TFFVRk5MRTFCUTNoQ0xFTkJRVVVzVTBGQlZTeEZRVUZITEVkQlFVazdVVUZEYmtJc1EwRkJSU3hUUVVGVkxFZEJRVWtzUjBGQlNTeE5RVU53UWl4RFFVRkZMRk5CUVZVc1IwRkJTU3hIUVVGSkxFMUJRM0JDTEVOQlFVVXNVMEZCVlN4SFFVRkpMRWRCUVVrc1RVRkRjRUlzUTBGQlJTeFRRVUZWTzFGQlFVa3NSMEZCU1N4TlFVTndRaXhEUVVGRkxGVkJRVmNzUjBGQlNTeEhRVUZKTEUxQlEzSkNMRU5CUVVVc1ZVRkJWeXhIUVVGSkxFZEJRVWtzVFVGRGNrSXNRMEZCUlN4VlFVRlhMRWRCUVVrc1IwRkJTVHRCUVVkMlFpeHhRa0ZCWlN4SlFVRkJMRU5CUVVzc1RVRkJUQ3hYUVVGaExFbEJRVTBzUlVGQlFTeFJRVUZRTzFGQlEzcENRU3hKUVVGTkxFOUJRVTg3V1VGRFdDeFBRVUZQTEUxQlFVRXNRMEZCVHl4RlFVRlFMRWxCUVdFc1dVRkVWRHRaUVVWWUxGbEJRVmtzUTBGQlJTeE5RVUZCTEVOQlFVOHNSMEZCU1N4TlFVRkJMRU5CUVU4N08xRkJSV3hETEVsQlFVRXNRMEZCU3l4TlFVRkJMRU5CUVU4c1IwRkJXaXhIUVVGclFqdFJRVU5zUWl4SlFVRkJMRU5CUVVzc1RVRkJRU3hEUVVGUExFVkJRVkFzUTBGQlZTeFBRVUZXTEVOQlFXdENMRTFCUVUwc1MwRkJOMElzUjBGQmNVTTdVVUZEY2tNc1QwRkJUenRQUVVOT096dEpRMnhHU1N4VFFVRlRMSGRDUVVGNVFpeFZRVUZaTEVWQlFVRXNUMEZCWjBJc1JVRkJRU3hsUVVGdlFqdDVRMEZCY0VNc1IwRkJWVHR4UkVGQlRTeEhRVUZuUWpzN1VVRkRia1lzU1VGQlNTeFBRVUZQTEZWQlFWQXNTMEZCYzBJc1ZVRkJWVHRaUVVOc1EwRXNTVUZCVFN4TlFVRk5MRlZCUVVFc1EwRkJWeXhYUVVGWU8xbEJRMW9zU1VGQlNTeEZRVUZGTEVkQlFVRXNTVUZCVHl4aFFVRmhPMmRDUVVONFFpeE5RVUZOTEVsQlFVa3NTMEZCU2l3NFFrRkJiVU03TzFsQlJUTkRRU3hKUVVGTkxGTkJRVk1zVlVGQlFTeERRVUZYTzFsQlF6RkNMRTlCUVU4c1RVRkJRU3hEUVVGUExGVkJRVkFzUTBGQmEwSXNSMEZCYkVJc1YwRkJjMElzV1VGRGNFSXNaVUZCUVN4RFFVRm5RaXhIUVVGSExFMUJRVUVzUTBGQlR5eFBRVUZQTEZOQlFWTTdaVUZGT1VNN1dVRkRUQ3hQUVVGUE96czdPMEZCU1Znc1NVRkJUeXhUUVVGVExHZENRVUZwUWl4VFFVRlhMRVZCUVVFc1UwRkJhMElzUlVGQlFTeFBRVUZuUWl4RlFVRkJMR1ZCUVc5Q096WkRRVUYwUkN4SFFVRlpPM2xEUVVGTkxFZEJRVlU3Y1VSQlFVMHNSMEZCWjBJN08xRkJRelZHTEU5QlFVOHNZVUZCUVN4RFFVRmpMRmRCUVZjc1YwRkJWeXhUUVVGVE96SkNRVU5zUkN4aFFVUnJSRHRaUVVWc1JDeFhRVUZYTEVOQlJuVkRPMWxCUjJ4RUxGbEJRVms3T3pzN1NVTnNRbWhDTEZOQlFWTXNjVUpCUVhOQ0xGVkJRVlU3VVVGRGRrTXNTVUZCU1N4RFFVRkRMRkZCUVVFc1EwRkJVenRqUVVGWkxFOUJRVTg3VVVGRGFrTXNTVUZCU1N4UFFVRlBMRkZCUVVFc1EwRkJVeXhWUVVGb1FpeExRVUVyUWp0alFVRlZMRTlCUVU4N1VVRkRjRVFzU1VGQlNTeExRVUZCTEVOQlFVMHNUMEZCVGl4RFFVRmpMRkZCUVVFc1EwRkJVeXhYUVVGMlFpeEpRVUZ6UXl4UlFVRkJMRU5CUVZNc1ZVRkJWQ3hEUVVGdlFpeE5RVUZ3UWl4SlFVRTRRanRqUVVGSExFOUJRVTg3VVVGRGJFWXNUMEZCVHpzN08wbEJSMVFzVTBGQlV5eGpRVUZsTEV0QlFVOHNSVUZCUVN4VlFVRlZPMUZCUlhaRExFbEJRVWtzUTBGQlF5eFhRVUZYTzFsQlEyUXNUMEZCVHl4RFFVRkZMRWxCUVVzN08xRkJSMmhDUXl4SlFVRkpMRlZCUVZVc1VVRkJRU3hEUVVGVExFMUJRVlFzU1VGQmJVSTdVVUZGYWtNc1NVRkJTU3hQUVVGQkxFdEJRVmtzVFVGQldpeEpRVU5CTEU5QlFVRXNTMEZCV1N4UlFVUmFMRWxCUlVFc1QwRkJRU3hMUVVGWkxGRkJRVUVzUTBGQlV5eE5RVUZOTzFsQlF6ZENMRTlCUVU4c1EwRkJSU3hOUVVGQkxFTkJRVThzVjBGQldTeE5RVUZCTEVOQlFVODdaVUZET1VJN1dVRkRUQ3hWUVVFd1FpeFBRVUZCTEVOQlFWRXNjVUpCUVZJN1dVRkJiRUk3V1VGQlR6dFpRVU5tTEU5QlFVOHNRMEZCUlN4TlFVRlBPenM3TzBGQlNYQkNMRWxCUVdVc1UwRkJVeXhoUVVGakxFdEJRVThzUlVGQlFTeFZRVUZWTzFGQlEzSkVRU3hKUVVGSkxFOUJRVTg3VVVGRFdFRXNTVUZCU1N4WlFVRlpPMUZCUTJoQ1FTeEpRVUZKTEdGQlFXRTdVVUZGYWtKRUxFbEJRVTBzWVVGQllTeFJRVUZCTEVOQlFWTTdVVUZETlVKQkxFbEJRVTBzWjBKQlFXZENMRzlDUVVGQkxFTkJRWEZDTzFGQlF6TkRRU3hKUVVGTkxGbEJRVmtzUzBGQlFTeERRVUZOTzFGQlEzaENRU3hKUVVGTkxHRkJRV0VzWVVGQlFTeEhRVUZuUWl4UlFVRkJMRU5CUVZNc1ZVRkJWQ3hMUVVGM1FpeFJRVUZSTzFGQlEyNUZRU3hKUVVGTkxHTkJRV1VzUTBGQlF5eFRRVUZFTEVsQlFXTXNZVUZCWml4SFFVRm5ReXhSUVVGQkxFTkJRVk1zWTBGQll6dFJRVU16UlVFc1NVRkJUU3hSUVVGUkxGRkJRVUVzUTBGQlV6dFJRVU4yUWtFc1NVRkJUU3huUWtGQmFVSXNUMEZCVHl4UlFVRkJMRU5CUVZNc1lVRkJhRUlzUzBGQmEwTXNVVUZCYkVNc1NVRkJPRU1zVVVGQlFTeERRVUZUTEZGQlFVRXNRMEZCVXl4alFVRnFSU3hIUVVGdFJpeFJRVUZCTEVOQlFWTXNaMEpCUVdkQ08xRkJRMnhKUVN4SlFVRk5MRkZCUVZFc1QwRkJRU3hEUVVGUkxGRkJRVUVzUTBGQlV5eFBRVUZQTzFGQlJYUkRRU3hKUVVGTkxHMUNRVUZ0UWl4VFFVRkJMRVZCUVVFc1IwRkJZeXhOUVVGQkxFTkJRVThzYlVKQlFXMUNPMUZCUTJwRlFTeEpRVUZOTEdsQ1FVRnBRaXhYUVVGQkxFZEJRV01zYlVKQlFXMUNPMUZCUlhoRVF5eEpRVUZKTEZsQlFWazdVVUZOYUVJc1NVRkJTU3hQUVVGUExGRkJRVUVzUTBGQlV5eFZRVUZvUWl4TFFVRXJRaXhSUVVFdlFpeEpRVUV5UXl4UlFVRkJMRU5CUVZNc1VVRkJRU3hEUVVGVExHRkJRV0U3V1VGRk5VVXNWVUZCUVN4SFFVRmhMRkZCUVVFc1EwRkJVenRaUVVOMFFpeG5Ra0ZCUVN4SFFVRnRRaXhQUVVGQkxFTkJRVkVzVVVGQlFTeERRVUZUTEd0Q1FVRnJRanRsUVVOcVJEdFpRVU5NTEVsQlFVa3NaVUZCWlR0blFrRkZha0lzVlVGQlFTeEhRVUZoTzJkQ1FVZGlMR2RDUVVGQkxFZEJRVzFDTEU5QlFVRXNRMEZCVVN4UlFVRkJMRU5CUVZNc2EwSkJRV3RDTzIxQ1FVTnFSRHRuUWtGRlRDeFZRVUZCTEVkQlFXRTdaMEpCUldJc1owSkJRVUVzUjBGQmJVSXNUMEZCUVN4RFFVRlJMRkZCUVVFc1EwRkJVeXhyUWtGQmEwSTdPenRSUVVzeFJDeEpRVUZKTEU5QlFVOHNVVUZCUVN4RFFVRlRMR0ZCUVdoQ0xFdEJRV3RETEZGQlFXeERMRWxCUVRoRExGRkJRVUVzUTBGQlV5eFJRVUZCTEVOQlFWTXNaMEpCUVdkQ08xbEJRMnhHTEZWQlFVRXNSMEZCWVN4SlFVRkJMRU5CUVVzc1IwRkJUQ3hEUVVGVExGRkJRVUVzUTBGQlV5eGxRVUZsTzFsQlF6bERMR2RDUVVGQkxFZEJRVzFDTEVsQlFVRXNRMEZCU3l4SFFVRk1MRU5CUVZNc1VVRkJRU3hEUVVGVExHVkJRV1U3TzFGQlNYUkVMRWxCUVVrc1YwRkJWenRaUVVOaUxGVkJRVUVzUjBGQllUczdVVUZOWml4VlFVRnZReXhoUVVGQkxFTkJRV01zVDBGQlR6dFJRVUZ1UkR0UlFVRmhPMUZCUTI1Q1FTeEpRVUZKTEZkQlFWYzdVVUZIWml4SlFVRkpMR1ZCUVdVN1dVRkRha0pFTEVsQlFVMHNVMEZCVXl4MVFrRkJRU3hEUVVGM1FpeFpRVUZaTEU5QlFVODdXVUZETVVSQkxFbEJRVTBzVlVGQlZTeEpRVUZCTEVOQlFVc3NSMEZCVEN4RFFVRlRMRTFCUVVFc1EwRkJUeXhKUVVGSkxFMUJRVUVzUTBGQlR6dFpRVU16UTBFc1NVRkJUU3hUUVVGVExFbEJRVUVzUTBGQlN5eEhRVUZNTEVOQlFWTXNUVUZCUVN4RFFVRlBMRWxCUVVrc1RVRkJRU3hEUVVGUE8xbEJRekZETEVsQlFVa3NVVUZCUVN4RFFVRlRMR0ZCUVdFN1owSkJRM2hDUVN4SlFVRk5MRmxCUVZrc1VVRkJRU3hEUVVGVExGZEJRVlFzUzBGQmVVSTdaMEpCUXpORExFdEJRVUVzUjBGQlVTeFRRVUZCTEVkQlFWa3NWVUZCVlR0blFrRkRPVUlzVFVGQlFTeEhRVUZUTEZOQlFVRXNSMEZCV1N4VFFVRlRPMjFDUVVONlFqdG5Ra0ZEVEN4TFFVRkJMRWRCUVZFc1RVRkJRU3hEUVVGUE8yZENRVU5tTEUxQlFVRXNSMEZCVXl4TlFVRkJMRU5CUVU4N08xbEJSMnhDTEZOQlFVRXNSMEZCV1R0WlFVTmFMRlZCUVVFc1IwRkJZVHRaUVVkaUxFdEJRVUVzU1VGQlV5eExRVUZCTEVkQlFWRTdXVUZEYWtJc1RVRkJRU3hKUVVGVkxFdEJRVUVzUjBGQlVUdGxRVU5pTzFsQlEwd3NTMEZCUVN4SFFVRlJPMWxCUTFJc1RVRkJRU3hIUVVGVE8xbEJRMVFzVTBGQlFTeEhRVUZaTzFsQlExb3NWVUZCUVN4SFFVRmhPenRSUVVsbVF5eEpRVUZKTEZsQlFWazdVVUZEYUVKQkxFbEJRVWtzWVVGQllUdFJRVU5xUWl4SlFVRkpMR0ZCUVVFc1NVRkJhVUlzVDBGQlR6dFpRVVV4UWl4VFFVRkJMRWRCUVZrc1pVRkJRU3hEUVVGblFpeFBRVUZQTEU5QlFVOHNUVUZCVFR0WlFVTm9SQ3hWUVVGQkxFZEJRV0VzWlVGQlFTeERRVUZuUWl4UlFVRlJMRTlCUVU4c1RVRkJUVHM3VVVGSmNFUXNWVUZCUVN4SFFVRmhMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmM3VVVGRGVFSXNWMEZCUVN4SFFVRmpMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmM3VVVGSGVrSXNTVUZCU1N4VlFVRkJMRWxCUVdNc1EwRkJReXhUUVVGbUxFbEJRVFJDTEdWQlFXVTdXVUZETjBORUxFbEJRVTBzVTBGQlV5eExRVUZCTEVkQlFWRTdXVUZEZGtKQkxFbEJRVTBzWlVGQlpTeFhRVUZCTEVkQlFXTTdXVUZEYmtOQkxFbEJRVTBzYjBKQlFXOUNMRTlCUVVFc1EwRkJVU3hSUVVGQkxFTkJRVk1zYlVKQlFXMUNPMWxCUXpsRVFTeEpRVUZOTEZkQlFWY3NTVUZCUVN4RFFVRkxMRXRCUVV3c1EwRkJWeXhYUVVGQkxFZEJRV01zYVVKQlFVRXNSMEZCYjBJN1dVRkRPVVJCTEVsQlFVMHNXVUZCV1N4SlFVRkJMRU5CUVVzc1MwRkJUQ3hEUVVGWExGbEJRVUVzUjBGQlpTeHBRa0ZCUVN4SFFVRnZRanRaUVVOb1JTeEpRVUZKTEZWQlFVRXNSMEZCWVN4UlFVRmlMRWxCUVhsQ0xGZEJRVUVzUjBGQll5eFhRVUZYTzJkQ1FVTndSQ3hKUVVGSkxGbEJRVUVzUjBGQlpTeFJRVUZSTzI5Q1FVTjZRaXhYUVVGQkxFZEJRV003YjBKQlEyUXNWVUZCUVN4SFFVRmhMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmNzVjBGQlFTeEhRVUZqTzNWQ1FVTnFRenR2UWtGRFRDeFZRVUZCTEVkQlFXRTdiMEpCUTJJc1YwRkJRU3hIUVVGakxFbEJRVUVzUTBGQlN5eExRVUZNTEVOQlFWY3NWVUZCUVN4SFFVRmhPenM3TzFGQlN6VkRMRmRCUVVFc1IwRkJZeXhYUVVGQkxFZEJRV01zU1VGQlFTeERRVUZMTEV0QlFVd3NRMEZCVnl4VlFVRkJMRWRCUVdFc1kwRkJZeXhKUVVGQkxFTkJRVXNzUzBGQlRDeERRVUZYTEdkQ1FVRkJMRWRCUVcxQ08xRkJRMmhITEZsQlFVRXNSMEZCWlN4WFFVRkJMRWRCUVdNc1NVRkJRU3hEUVVGTExFdEJRVXdzUTBGQlZ5eFZRVUZCTEVkQlFXRXNaVUZCWlN4SlFVRkJMRU5CUVVzc1MwRkJUQ3hEUVVGWExHZENRVUZCTEVkQlFXMUNPMUZCUld4SFFTeEpRVUZOTEdkQ1FVRm5RaXhYUVVGQkxFZEJRV01zU1VGQlFTeERRVUZMTEV0QlFVd3NRMEZCVnl4alFVRmpMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmM3VVVGRGVFVkJMRWxCUVUwc2FVSkJRV2xDTEZkQlFVRXNSMEZCWXl4SlFVRkJMRU5CUVVzc1MwRkJUQ3hEUVVGWExHVkJRV1VzU1VGQlFTeERRVUZMTEV0QlFVd3NRMEZCVnp0UlFVVXhSVUVzU1VGQlRTeFRRVUZUTEZkQlFVRXNSMEZCWXp0UlFVTTNRa0VzU1VGQlRTeFRRVUZUTEZsQlFVRXNSMEZCWlR0UlFVYzVRaXhQUVVGUE8yMUNRVU5NTEV0QlJFczdkMEpCUlV3c1ZVRkdTenR0UWtGSFRDeExRVWhMTzI5Q1FVbE1MRTFCU2tzN1dVRkxUQ3haUVVGWkxFTkJRVVVzVFVGQlR5eFBRVXhvUWp0WlFVMU1MRTlCUVU4c1MwRkJRU3hKUVVGVExFbEJUbGc3YjBKQlQwd3NUVUZRU3p0dlFrRlJUQ3hOUVZKTE96SkNRVk5NTEdGQlZFczdORUpCVlV3c1kwRldTenQ1UWtGWFRDeFhRVmhMT3pCQ1FWbE1MRmxCV2tzN2RVSkJZVXdzVTBGaVN6dDNRa0ZqVEN4VlFXUkxPM2RDUVdWTUxGVkJaa3M3ZVVKQlowSk1PenM3TzBsRE5VdEtMSE5DUVVGakxFZEJRVWNzYVVKQlFXZENPMGxCUTJwRExGTkJRVk1zWjBKQlFXZENMRVZCUVVVc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJUdE5RVU55UXl4SlFVRkpMRTlCUVU4c1NVRkJTU3hMUVVGTExGRkJRVkVzUlVGQlJUdFJRVU0xUWl4TlFVRk5MRWxCUVVrc1UwRkJVeXhEUVVGRExEQkNRVUV3UWl4RFFVRkRPMDlCUTJoRU96dE5RVVZFTEVsQlFVa3NSMEZCUnl4SlFVRkpMRWxCUVVrc1IwRkJSVHM3VFVGRmFrSXNTVUZCU1N4UFFVRlBMRkZCUVZFc1MwRkJTeXhYUVVGWExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZPMUZCUTI1RUxFOUJRVThzU1VGQlNUdFBRVU5hT3p0TlFVVkVMRWxCUVVrc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVsQlFVa3NVVUZCVVN4RFFVRkRMR0ZCUVdFc1EwRkJReXhSUVVGUkxFVkJRVU03VFVGRE5VUXNTVUZCU1N4UFFVRlBMRWxCUVVrc1EwRkJReXhMUVVGTExFdEJRVXNzVVVGQlVTeEZRVUZGTzFGQlEyeERMRTFCUVUwc1EwRkJReXhMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVczdUMEZETVVJN1RVRkRSQ3hKUVVGSkxFOUJRVThzU1VGQlNTeERRVUZETEUxQlFVMHNTMEZCU3l4UlFVRlJMRVZCUVVVN1VVRkRia01zVFVGQlRTeERRVUZETEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUVHRQUVVNMVFqczdUVUZGUkN4SlFVRkpMRTlCUVU4c1IwRkJSeXhMUVVGSk8wMUJRMnhDTEVsQlFVa3NSMEZCUlR0TlFVTk9MRWxCUVVrN1VVRkRSaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eEZRVUZGTEVsQlFVa3NSMEZCUlRzN1VVRkZjRUlzU1VGQlNTeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUlVGQlJUdFZRVU12UWl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExHVkJRV1VzUjBGQlJ5eEpRVUZKTEVWQlFVTTdVMEZEYmtNN08xRkJSVVFzUzBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExFdEJRVXNzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1ZVRkRja01zUlVGQlJTeEhRVUZITEUxQlFVMHNRMEZCUXl4VlFVRlZMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEU5QlFVOHNSVUZCUXp0VlFVTjZReXhKUVVGSkxFVkJRVVVzUlVGQlJTeFBRVUZQTEVWQlFVVTdVMEZEYkVJN1QwRkRSaXhEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGTzFGQlExWXNSVUZCUlN4SFFVRkhMRXRCUVVrN1QwRkRWanROUVVORUxGRkJRVkVzUlVGQlJTeEpRVUZKTEVsQlFVa3NRMEZCUXp0TFFVTndRanM3U1VOcVEwUXNVMEZCVXl4elFrRkJkVUk3VVVGRE9VSXNTVUZCU1N4RFFVRkRMRk5CUVVFc1NVRkJZVHRaUVVOb1FpeE5RVUZOTEVsQlFVa3NTMEZCU2l4RFFVRlZPenRSUVVWc1FpeFBRVUZQTEZGQlFVRXNRMEZCVXl4aFFVRlVMRU5CUVhWQ096czdRVUZIYUVNc1NVRkJaU3hUUVVGVExHRkJRV01zVlVGQlpUc3lRMEZCWml4SFFVRlhPenRSUVVNdlEwTXNTVUZCU1N4VFFVRlRPMUZCUTJKQkxFbEJRVWtzWVVGQllUdFJRVU5xUWl4SlFVRkpMRkZCUVVFc1EwRkJVeXhOUVVGVUxFdEJRVzlDTEU5QlFVODdXVUZGTjBJc1QwRkJRU3hIUVVGVkxGRkJRVUVzUTBGQlV6dFpRVU51UWl4SlFVRkpMRU5CUVVNc1QwRkJSQ3hKUVVGWkxFOUJRVThzVDBGQlVDeExRVUZ0UWl4VlFVRlZPMmRDUVVNelEwRXNTVUZCU1N4WlFVRlpMRkZCUVVFc1EwRkJVenRuUWtGRGVrSXNTVUZCU1N4RFFVRkRMRmRCUVZjN2IwSkJRMlFzVTBGQlFTeEhRVUZaTEcxQ1FVRkJPMjlDUVVOYUxGVkJRVUVzUjBGQllUczdaMEpCUldaRUxFbEJRVTBzVDBGQlR5eFBRVUZCTEVsQlFWYzdaMEpCUTNoQ0xFbEJRVWtzVDBGQlR5eFRRVUZCTEVOQlFWVXNWVUZCYWtJc1MwRkJaME1zV1VGQldUdHZRa0ZET1VNc1RVRkJUU3hKUVVGSkxFdEJRVW9zUTBGQlZUczdaMEpCUld4Q0xFOUJRVUVzUjBGQlZVY3NhMEpCUVVFc1EwRkJhVUlzVFVGQlRVUXNXVUZCUVN4RFFVRlBMRWxCUVVrc1VVRkJRU3hEUVVGVExGbEJRVms3YjBKQlFVVXNVVUZCVVRzN1owSkJRek5GTEVsQlFVa3NRMEZCUXl4VFFVRlRPMjlDUVVOYUxFMUJRVTBzU1VGQlNTeExRVUZLTEc5RFFVRXdRenM3TzFsQlNYQkVMRTFCUVVFc1IwRkJVeXhQUVVGQkxFTkJRVkU3V1VGRmFrSXNTVUZCU1N4UlFVRkJMRU5CUVZNc1RVRkJWQ3hKUVVGdFFpeE5RVUZCTEV0QlFWY3NVVUZCUVN4RFFVRlRMRkZCUVZFN1owSkJRMnBFTEUxQlFVMHNTVUZCU1N4TFFVRktMRU5CUVZVN08xbEJTV3hDTEVsQlFVa3NVVUZCUVN4RFFVRlRMRmRCUVZjN1owSkJRM1JDTEU5QlFVRXNRMEZCVVN4eFFrRkJVaXhIUVVGblF6dG5Ra0ZEYUVNc1QwRkJRU3hEUVVGUkxIZENRVUZTTEVkQlFXMURPMmRDUVVOdVF5eFBRVUZCTEVOQlFWRXNjMEpCUVZJc1IwRkJhVU03WjBKQlEycERMRTlCUVVFc1EwRkJVU3d5UWtGQlVpeEhRVUZ6UXp0blFrRkRkRU1zVDBGQlFTeERRVUZSTEhWQ1FVRlNMRWRCUVd0RE8yZENRVU5zUXl4TlFVRkJMRU5CUVU4c1MwRkJVQ3hEUVVGaExHdENRVUZpTEVkQlFXdERPenM3VVVGSGRFTXNUMEZCVHp0dlFrRkJSU3hOUVVGR08zRkNRVUZWTEU5QlFWWTdkMEpCUVcxQ096czdPMGxEY2tNMVFpeEpRVUZOTEdkQ1FVTktMSGxDUVVGbE96czdXVUZEWWl4RFFVRkxMRk5CUVV3c1IwRkJhVUk3V1VGRGFrSXNRMEZCU3l4TlFVRk1MRWRCUVdNN1dVRkRaQ3hEUVVGTExFOUJRVXdzUjBGQlpUdFpRVU5tTEVOQlFVc3NTVUZCVEN4SFFVRlpPMWxCUjFvc1EwRkJTeXhwUWtGQlRDeEhRVUY1UWp0WlFVTjZRaXhEUVVGTExHRkJRVXdzUjBGQmNVSTdXVUZGY2tJc1EwRkJTeXhyUWtGQlRDeEhRVUV3UWl4cFFrRkJRU3hEUVVGclFqdHBRMEZEYWtNc1UwRkJUVW9zVFVGQlFTeERRVUZMTEZGQlFVd3NRMEZCWXl4UFFVRmtMRXRCUVRCQ0xGRkJSRU03TkVKQlJXNURPMjlDUVVORUxFVkJRVUVzUTBGQlJ5eFZRVUZWTzNkQ1FVTllRU3hOUVVGQkxFTkJRVXNzUzBGQlRDeERRVUZYTEZkQlFWYzdPRUpCUTNoQ0xFTkJRVXNzVTBGQlREczRRa0ZEUVN4RFFVRkxMRWRCUVV3N096QkNRVU5MUVN4TlFVRkJMRU5CUVVzc1RVRkJURHM3YzBKQlEwWkJMRTFCUVVFc1EwRkJTeXhYUVVGTU8yRkJVbWxETzI5RFFWVTVRanR2UWtGRFRrRXNUVUZCUVN4RFFVRkxMRXRCUVV3c1EwRkJWenR6UWtGQlUwRXNUVUZCUVN4RFFVRkxMRXRCUVV3N08zTkNRVU51UWtFc1RVRkJRU3hEUVVGTExFbEJRVXc3WVVGYWJVTTdPRUpCWTJwRE8zTkNRVU5RTEVOQlFVc3NWMEZCVEN4RFFVRnBRanMwUWtGQlZUczdPenRaUVVrdlFpeERRVUZMTEdWQlFVd3NaMEpCUVhWQ0xGTkJRVTFCTEUxQlFVRXNRMEZCU3l4UFFVRk1PMWxCUlRkQ0xFTkJRVXNzWTBGQlRDeG5Ra0ZCYzBJN1owSkJRMlFzVlVGQlZVRXNUVUZCUVN4RFFVRkxMRTFCUVV3N1owSkJSVm9zVTBGQlV6dHpRa0ZEV0N4RFFVRkxMRTFCUVV3N096czdPenQxUWtGTFJpeDVRa0ZCVlR0bFFVTk1MRWxCUVVFc1EwRkJTenM3ZFVKQlIxWXNNa0pCUVZrN1pVRkRVQ3hKUVVGQkxFTkJRVXM3TzNWQ1FVZFdMSGRDUVVGVE8yVkJRMG9zU1VGQlFTeERRVUZMT3pzMFFrRkhaQ3c0UTBGQmEwSXNWMEZCWVN4RlFVRkJMRlZCUVZVN1dVRkRha01zWTBGQll5eFBRVUZQTEZGQlFWQXNTMEZCYjBJc1VVRkJjRUlzU1VGQlowTXNVVUZCUVN4RFFVRlRPMlZCUTNSRUxGZEJRVUVzUjBGQll5eFhRVUZCTEVkQlFXTXNWMEZCVnpzN05FSkJSMmhFTEhkRFFVRmxMRkZCUVZVc1JVRkJRU3hKUVVGTkxFVkJRVUVzVjBGQllTeEZRVUZCTEV0QlFVczdaVUZEZGtNc1VVRkJRU3hEUVVGVExGbEJRVlFzU1VGQmVVSXNWMEZCUVN4SFFVRmpMRU5CUVhoRExFZEJRMGdzU1VGQlFTeERRVUZMTEV0QlFVd3NRMEZCVnl4UlFVRkJMRWxCUVZrc1YwRkJRU3hIUVVGakxFMUJRM0pETEVsQlFVRXNRMEZCU3l4TFFVRk1MRU5CUVZjc1IwRkJRU3hIUVVGTk96czBRa0ZIZGtJc2QwUkJRWGRDTzJWQlEyWXNTVUZCUVN4RFFVRkxMR0ZCUVV3c1EwRkRUQ3hKUVVGQkxFTkJRVXNzUzBGQlRDeERRVUZYTEZWQlFWVXNTVUZCUVN4RFFVRkxMRXRCUVV3c1EwRkJWeXhOUVVOb1F5eEpRVUZCTEVOQlFVc3NTMEZCVEN4RFFVRlhMR0ZCUVdFc1NVRkJRU3hEUVVGTExFdEJRVXdzUTBGQlZ6czdORUpCU1haRExEQkRRVUZwUWp0WlFVTlVMRkZCUVZFc1NVRkJRU3hEUVVGTE8yVkJRMW83YlVKQlEwVXNTMEZCUVN4RFFVRk5MRXRCUkZJN2IwSkJSVWNzUzBGQlFTeERRVUZOTEUxQlJsUTdkMEpCUjA4c1MwRkJRU3hEUVVGTkxGVkJTR0k3ZVVKQlNWRXNTMEZCUVN4RFFVRk5MRmRCU21RN01FSkJTMU1zUzBGQlFTeERRVUZOTEZsQlRHWTdNa0pCVFZVc1MwRkJRU3hEUVVGTkxHRkJUbWhDT3pSQ1FVOVhMRXRCUVVFc1EwRkJUVHM3T3pSQ1FVa3hRaXh6UWtGQlR6dFpRVU5FTEVOQlFVTXNTVUZCUVN4RFFVRkxPMk5CUVZFc1RVRkJUU3hKUVVGSkxFdEJRVW9zUTBGQlZUdFpRVWM1UWl4SlFVRkJMRU5CUVVzc1VVRkJUQ3hEUVVGakxFOUJRV1FzUzBGQk1FSXNUMEZCVHp0blFrRkRia01zUTBGQlN5eEpRVUZNT3p0WlFVbEZMRTlCUVU4c1NVRkJRU3hEUVVGTExFMUJRVXdzUTBGQldTeFBRVUZ1UWl4TFFVRXJRaXhaUVVGWk8yMUNRVU0zUXl4RFFVRlJMRWxCUVZJc1EwRkJZVHM3V1VGSldDeERRVUZETEVsQlFVRXNRMEZCU3l4TFFVRk1MRU5CUVZjc1UwRkJVenRuUWtGRGRrSXNRMEZCU3l4WlFVRk1PMmRDUVVOQkxFTkJRVXNzUzBGQlRDeERRVUZYTEU5QlFWZ3NSMEZCY1VJN08xbEJTWFpDTEVOQlFVc3NTVUZCVER0WlFVTkJMRU5CUVVzc1RVRkJURHRsUVVOUE96czBRa0ZIVkN4M1FrRkJVVHRaUVVOR0xGVkJRVlVzU1VGQlFTeERRVUZMTEZGQlFVd3NRMEZCWXp0WlFVTjRRaXhYUVVGQkxFbEJRV1VzU1VGQlFTeERRVUZMTEZWQlFWVTdiVUpCUTJoRExFZEJRVlU3YlVKQlExWXNRMEZCVVN4SlFVRlNMRU5CUVdFN08xbEJSVmdzUTBGQlF6dGpRVUZUTzFsQlExWXNRMEZCUXl4VFFVRkJMRWxCUVdFN2JVSkJRMmhDTEVOQlFWRXNTMEZCVWl4RFFVRmpPenM3V1VGSFdpeEpRVUZCTEVOQlFVc3NTMEZCVEN4RFFVRlhPMk5CUVZNN1dVRkRjRUlzUTBGQlF5eEpRVUZCTEVOQlFVc3NTMEZCVEN4RFFVRlhMRk5CUVZNN1owSkJRM1pDTEVOQlFVc3NXVUZCVER0blFrRkRRU3hEUVVGTExFdEJRVXdzUTBGQlZ5eFBRVUZZTEVkQlFYRkNPenRaUVUxMlFpeERRVUZMTEV0QlFVd3NRMEZCVnl4UFFVRllMRWRCUVhGQ08xbEJRMnBDTEVsQlFVRXNRMEZCU3l4SlFVRk1MRWxCUVdFN1kwRkJUU3hOUVVGQkxFTkJRVThzYjBKQlFWQXNRMEZCTkVJc1NVRkJRU3hEUVVGTE8xbEJRM2hFTEVOQlFVc3NVMEZCVEN4SFFVRnBRazBzVDBGQlFUdFpRVU5xUWl4RFFVRkxMRWxCUVV3c1IwRkJXU3hOUVVGQkxFTkJRVThzY1VKQlFWQXNRMEZCTmtJc1NVRkJRU3hEUVVGTE96czBRa0ZIYUVRc01FSkJRVk03V1VGRFNDeEpRVUZCTEVOQlFVc3NTMEZCVEN4RFFVRlhPMk5CUVZjc1NVRkJRU3hEUVVGTExGTkJRVXc3V1VGRE1VSXNRMEZCU3l4TFFVRk1MRU5CUVZjc1QwRkJXQ3hIUVVGeFFqdFpRVVZxUWl4SlFVRkJMRU5CUVVzc1NVRkJUQ3hKUVVGaExFbEJRV0lzU1VGQmNVSXNVMEZCUVN4SlFVRmhPMnRDUVVOd1F5eERRVUZQTEc5Q1FVRlFMRU5CUVRSQ0xFbEJRVUVzUTBGQlN6czdPelJDUVVseVF5eHZRMEZCWXp0WlFVTlNMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmM3WTBGQlV5eEpRVUZCTEVOQlFVc3NTMEZCVERzN1kwRkRia0lzU1VGQlFTeERRVUZMTEVsQlFVdzdPelJDUVVsUUxIZENRVUZSTzFsQlEwNHNRMEZCU3l4TFFVRk1PMWxCUTBFc1EwRkJTeXhMUVVGTUxFTkJRVmNzUzBGQldDeEhRVUZ0UWp0WlFVTnVRaXhEUVVGTExFdEJRVXdzUTBGQlZ5eFJRVUZZTEVkQlFYTkNPMWxCUTNSQ0xFTkJRVXNzUzBGQlRDeERRVUZYTEVsQlFWZ3NSMEZCYTBJN1dVRkRiRUlzUTBGQlN5eExRVUZNTEVOQlFWY3NVMEZCV0N4SFFVRjFRanRaUVVOMlFpeERRVUZMTEV0QlFVd3NRMEZCVnl4UFFVRllMRWRCUVhGQ08xbEJRM0pDTEVOQlFVc3NUVUZCVERzN05FSkJSMFlzTkVKQlFWVTdPenRaUVVOS0xFbEJRVUVzUTBGQlN5eExRVUZNTEVOQlFWYzdZMEZCVnp0WlFVTjBRaXhEUVVGRExGTkJRVUVzU1VGQllUdHRRa0ZEYUVJc1EwRkJVU3hMUVVGU0xFTkJRV003T3p0WlFVbG9RaXhEUVVGTExFbEJRVXc3V1VGRFFTeERRVUZMTEV0QlFVd3NRMEZCVnl4UFFVRllMRWRCUVhGQ08xbEJRM0pDTEVOQlFVc3NTMEZCVEN4RFFVRlhMRk5CUVZnc1IwRkJkVUk3V1VGRmFrSXNaMEpCUVdkQ0xFTkJRVUVzUjBGQlNTeEpRVUZCTEVOQlFVc3NTMEZCVEN4RFFVRlhPMWxCUldwRExFbEJRVUVzUTBGQlN5eEpRVUZNTEVsQlFXRTdZMEZCVFN4TlFVRkJMRU5CUVU4c2IwSkJRVkFzUTBGQk5FSXNTVUZCUVN4RFFVRkxPMWxCUTJ4RUxHMUNRVUZQTzJkQ1FVTlFMRU5CUVVOT0xFMUJRVUVzUTBGQlN5eExRVUZNTEVOQlFWYzdhMEpCUVZjc1QwRkJUeXhQUVVGQkxFTkJRVkVzVDBGQlVqdHJRa0ZEYkVNc1EwRkJTeXhMUVVGTUxFTkJRVmNzVTBGQldDeEhRVUYxUWp0clFrRkRka0lzUTBGQlN5eEpRVUZNTzIxQ1FVTlBRU3hOUVVGQkxFTkJRVXNzVjBGQlRDeERRVUZwUWpzd1FrRkJXVHRqUVVFM1FpeERRVU5LTEVsQlJFa3NZVUZEUXp0dlFrRkRRU3hEUVVGRFFTeE5RVUZCTEVOQlFVc3NTMEZCVEN4RFFVRlhPM05DUVVGWE8zTkNRVU16UWl4RFFVRkxMRXRCUVV3c1EwRkJWeXhUUVVGWUxFZEJRWFZDTzNOQ1FVTjJRaXhEUVVGTExFdEJRVXdzUTBGQlZ5eExRVUZZTzI5Q1FVTkpRU3hOUVVGQkxFTkJRVXNzUzBGQlRDeERRVUZYTEV0QlFWZ3NSMEZCYlVKQkxFMUJRVUVzUTBGQlN5eExRVUZNTEVOQlFWY3NZVUZCWVRzd1FrRkROME1zUTBGQlN5eExRVUZNTEVOQlFWY3NTVUZCV0N4SlFVRnRRanN3UWtGRGJrSXNRMEZCU3l4TFFVRk1MRU5CUVZjc1VVRkJXQ3hIUVVGelFrRXNUVUZCUVN4RFFVRkxMR2RDUVVGTUxFTkJRWE5DUVN4TlFVRkJMRU5CUVVzc1MwRkJUQ3hEUVVGWExFMUJRVTFCTEUxQlFVRXNRMEZCU3l4TFFVRk1MRU5CUVZjN01FSkJRM2hGTEVOQlFVc3NTVUZCVEN4SFFVRlpMRTFCUVVFc1EwRkJUeXh4UWtGQlVDeERRVUUyUWp0MVFrRkRjRU03TWtKQlEwd3NRMEZCVVN4SFFVRlNMRU5CUVZrN01FSkJRMW9zUTBGQlN5eFZRVUZNT3pCQ1FVTkJMRU5CUVVzc1UwRkJURHN3UWtGRFFTeERRVUZMTEVsQlFVdzdNRUpCUTBFc1EwRkJTeXhIUVVGTU96czdPMWxCVFVvc1EwRkJReXhKUVVGQkxFTkJRVXNzUzBGQlRDeERRVUZYTEZOQlFWTTdaMEpCUTNaQ0xFTkJRVXNzV1VGQlREdG5Ra0ZEUVN4RFFVRkxMRXRCUVV3c1EwRkJWeXhQUVVGWUxFZEJRWEZDT3p0WlFVZDJRaXhEUVVGTExFbEJRVXdzUjBGQldTeE5RVUZCTEVOQlFVOHNjVUpCUVZBc1EwRkJOa0k3T3pSQ1FVY3pReXgzUTBGQlowSTdPenRaUVVOV0xFbEJRVUVzUTBGQlN5eE5RVUZNTEVsQlFXVXNUMEZCVHl4SlFVRkJMRU5CUVVzc1RVRkJUQ3hEUVVGWkxFdEJRVzVDTEV0QlFUWkNMRmxCUVZrN1owSkJRekZFTEVOQlFVc3NhVUpCUVV3c1YwRkJkVUlzWjBKQlFWTkJMRTFCUVVFc1EwRkJTeXhOUVVGTUxFTkJRVmtzUzBGQldpeERRVUZyUWpzN096UkNRVWwwUkN4dlEwRkJZenM3TzFsQlExSXNTVUZCUVN4RFFVRkxMRTFCUVV3c1NVRkJaU3hQUVVGUExFbEJRVUVzUTBGQlN5eE5RVUZNTEVOQlFWa3NSMEZCYmtJc1MwRkJNa0lzV1VGQldUdG5Ra0ZEZUVRc1EwRkJTeXhwUWtGQlRDeFhRVUYxUWl4blFrRkJVMEVzVFVGQlFTeERRVUZMTEUxQlFVd3NRMEZCV1N4SFFVRmFMRU5CUVdkQ096czdORUpCU1hCRUxHdERRVUZoTzFsQlExQXNTVUZCUVN4RFFVRkxMRWxCUVV3c1NVRkJZU3hKUVVGaUxFbEJRWEZDTEZOQlFVRTdZMEZCWVN4TlFVRkJMRU5CUVU4c2IwSkJRVkFzUTBGQk5FSXNTVUZCUVN4RFFVRkxPMWxCUTNaRkxFTkJRVXNzUzBGQlRDeERRVUZYTEZOQlFWZ3NSMEZCZFVJN1dVRkRka0lzUTBGQlN5eExRVUZNTEVOQlFWY3NVMEZCV0N4SFFVRjFRanRaUVVOMlFpeERRVUZMTEV0QlFVd3NRMEZCVnl4UFFVRllMRWRCUVhGQ096czBRa0ZIZGtJc2IwTkJRV0VzUzBGQlZUczdjVU5CUVZZc1IwRkJUVHM3V1VGRFlpeERRVUZETEVsQlFVRXNRMEZCU3p0alFVRlJMRTlCUVU4c1QwRkJRU3hEUVVGUkxFZEJRVklzUTBGQldUdFpRVU5xUXl4UFFVRlBMRWxCUVVFc1EwRkJTeXhOUVVGTUxFTkJRVmtzVTBGQmJrSXNTMEZCYVVNc1dVRkJXVHRuUWtGREwwTXNRMEZCU3l4TlFVRk1MRU5CUVZrc1UwRkJXanM3V1VGSlJTeGhRVUZoU1N4WlFVRkJMRU5CUVU4N2MwSkJRMW9zUjBGQlFTeERRVUZKTEZGQlJGRTdiVUpCUldZc1IwRkJRU3hEUVVGSkxGRkJRVW9zUjBGQlpTeEpRVUZCTEVOQlFVc3NTMEZCVEN4RFFVRlhMRkZCUVZFc1UwRkdia0k3YTBKQlIyaENMRWxCUVVFc1EwRkJTeXhSUVVGTUxFTkJRV01zU1VGSVJUdHJRa0ZKYUVJc1NVRkJRU3hEUVVGTExGRkJRVXdzUTBGQll5eEpRVXBGTzI5Q1FVdGtMRWxCUVVFc1EwRkJTeXhSUVVGTUxFTkJRV01zVFVGTVFUdHZRa0ZOWkN4SlFVRkJMRU5CUVVzc1VVRkJUQ3hEUVVGakxFMUJUa0U3YzBKQlQxb3NTVUZCUVN4RFFVRkxMRkZCUVV3c1EwRkJZeXhSUVZCR096WkNRVkZNTEVsQlFVRXNRMEZCU3l4UlFVRk1MRU5CUVdNc1pVRlNWRHQxUWtGVFdDeFhRVUZCTEVWQlZGYzdlVUpCVlZRc1VVRkJRU3hEUVVGVExFbEJRVUVzUTBGQlN5eExRVUZNTEVOQlFWY3NXVUZCY0VJc1IwRkJiVU1zU1VGQlFTeERRVUZMTEVkQlFVd3NRMEZCVXl4TFFVRkxMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmNzWlVGQlpUczdXVUZIY0VZc1UwRkJVeXhaUVVGQk8xbEJRMWdzU1VGQlNTeFBRVUZCTEVOQlFWRXNUMEZCVWp0WlFVTktMRTFCUVVFc1NVRkJWU3hIUVVGQkxFTkJRVWtzVFVGQlpDeEpRVUYzUWl4UFFVRlBMRTFCUVVFc1EwRkJUeXhOUVVGa0xFdEJRWGxDTEZsQlFWazdaMEpCUTNwRUxHRkJRV0ZCTEZsQlFVRXNRMEZCVHl4SlFVRkpPMmRDUVVONFFpeFBRVUZQTEUxQlFVRXNRMEZCVHl4TlFVRlFMRU5CUVdNN1owSkJRM1pDUnl4WFFVRkJMRU5CUVZVN2EwSkJRVThzUTBGQlFTeEhRVUZKT3p0clFrRkRjRUlzUTBGQlFTeEhRVUZKTEU5QlFVRXNRMEZCVVN4UFFVRlNMRU5CUVdkQ096dGxRVWR3UWl4RFFVRkJMRU5CUVVVc1NVRkJSaXhYUVVGUExHVkJRMHhRTEUxQlFVRXNRMEZCU3l4alFVRk1MRU5CUVc5Q1NTeFpRVUZCTEVOQlFVOHNTVUZCU1N4WlFVRlpPMnRDUVVGUkxFbEJRVUVzU1VGQlVUczdPelJDUVVsMFJTd3dRMEZCWjBJc1dVRkJhVUk3TzIxRVFVRnFRaXhIUVVGaE96dFpRVU16UWl4RFFVRkxMRTFCUVV3c1EwRkJXU3hUUVVGYUxFZEJRWGRDTzFsQlIzaENMRU5CUVVzc1RVRkJURHRaUVVkSkxHRkJRV0VzU1VGQlFTeERRVUZMTEUxQlFVdzdXVUZIV0N4VFFVRlRMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmM3V1VGSGRFSXNUMEZCVHl4VlFVRlFMRXRCUVhOQ0xHRkJRV0U3YzBKQlEzSkRMRWRCUVdFc1EwRkJSVHM3YTBKQlJXcENMRWRCUVdFc1JVRkJRU3hEUVVGSExFMUJRVWdzUTBGQlZTeFhRVUZXTEVOQlFYTkNMRTFCUVhSQ0xFTkJRVFpDTzJ0Q1FVa3hReXhIUVVGaExGVkJRVUVzUTBGQlZ5eEhRVUZZTEZkQlFXVTdaMEpCUTNCQ0xHZENRVUZuUWl4UFFVRlBMRTFCUVZBc1MwRkJhMElzVVVGQmJFSXNTVUZCT0VJc1RVRkJPVUlzUzBGQmVVTXNUVUZCUVN4SlFVRlZMRTFCUVZZc1NVRkJiMElzVTBGQlFTeEpRVUZoTzJkQ1FVTXhSaXhQUVVGUExHRkJRVUVzUjBGQlowSXNUVUZCUVN4RFFVRlBMRTlCUVU4N1owSkJRM0pETEU5QlFVOHNZVUZCUVN4SFFVRm5Ra0VzV1VGQlFTeERRVUZQTEVsQlFVa3NVVUZCVVR0elFrRkJSVHRwUWtGQlZUdHpRa0ZCUlRzN1owSkJRekZFTEZGQlFVRXNRMEZCVXl4UFFVRlBPMjlDUVVOYUxGZEJRVmNzU1VGQlFTeERRVUZMTEZGQlFVd3NTVUZCYVVJc1ZVRkJRU3hEUVVGWE8yOUNRVU4yUXl4clFrRkJhMElzVDBGQlFTeERRVUZSTEVsQlFVRXNRMEZCU3l4cFFrRkJhVUlzVlVGQlFTeERRVUZYTEdsQ1FVRnBRanN3UWtGRE4wTXNXVUZCUVN4RFFVRmhMRTFCUVUwN09FSkJRVVVzVVVGQlJqdHhRMEZCV1RzN2IwSkJRVFZFTzI5Q1FVRlRPMjlDUVVGWE8zVkNRVU55UWl4TlFVRkJMRU5CUVU4c1RVRkJVQ3hEUVVGakxFMUJRVTA3TmtKQlFVVXNUMEZCUmpzclFrRkJWeXhUUVVGWU96QkNRVUZ6UWpzN2JVSkJRelZETzNWQ1FVTkZPenM3V1VGTFdDeERRVUZMTEUxQlFVd3NRMEZCV1N4VFFVRmFMRWRCUVhkQ08xbEJRM2hDTEVOQlFVc3NUVUZCVER0WlFVTkJMRU5CUVVzc1RVRkJURHRsUVVkUExFOUJRVUVzUTBGQlVTeEhRVUZTTEVOQlFWa3NWVUZCUVN4RFFVRlhMRWRCUVZnc1YwRkJaMElzVFVGQlVTeEZRVUZCTEVOQlFVY3NSVUZCUVN4WFFVRmFPMmRDUVVVeFFpeFRRVUZUUVN4WlFVRkJMRU5CUVU4c1NVRkJTU3haUVVGWkxGRkJRVkU3ZFVKQlFWTXNRMEZCVkRzMlFrRkJlVUlzVTBGQlFTeERRVUZWT3p0blFrRkRNMFVzVDBGQlR5eE5RVUZCTEVOQlFVODdaMEpCUTJoQ0xFMUJRVUVzUTBGQlR5eFRRVUZUTzI5Q1FVTmFMRlZCUVZVc1RVRkJRU3hEUVVGUE8zVkNRVU5vUWl4TlFVRkJMRU5CUVU4N2RVSkJRMUFzVjBGQlFTeERRVUZaTEZOQlFWTTdiVUpCUTNaQ08zVkNRVU5GTEZGQlFVRXNRMEZCVXl4TlFVRk5PenRYUVZSdVFpeERRVmRJTEVsQldFY3NWMEZYUlR0blFrRkRTQ3hGUVVGQkxFTkJRVWNzVFVGQlNDeEhRVUZaTEVkQlFVYzdiMEpCUTFnc2EwSkJRV3RDTEVWQlFVRXNRMEZCUnl4SlFVRklMRmRCUVZFc1dVRkJTeXhEUVVGQkxFTkJRVVU3YjBKQlEycERMRmRCUVZjc1JVRkJRU3hEUVVGSExFbEJRVWdzVjBGQlVTeFpRVUZMTEVOQlFVRXNRMEZCUlR0dlFrRkROVUk3YjBKQlJVRXNSVUZCUVN4RFFVRkhMRTFCUVVnc1IwRkJXVHR6UWtGQlJ5eEpRVUZCTEVkQlFVOHNSVUZCUVN4RFFVRkhPM05DUVVWNFFpeEpRVUZKTzNOQ1FVRnBRaXhKUVVGQkxFZEJRVThzUTBGQlJ5eGxRVUZCTEVOQlFXZENMSEZDUVVGakxFVkJRVUVzUTBGQlJ5eEZRVUZJTEVOQlFVMDdPM05DUVVWdVJTeEpRVUZCTEVkQlFVOHNUVUZCUnl4RlFVRkJMRU5CUVVjc1JVRkJTQ3hEUVVGTk8yOUNRVU5xUWl4UlFVRlJPMjlDUVVOU0xGVkJRVUVzUTBGQlZ5eFZRVUZWTzNkQ1FVTnFRaXhwUWtGQmFVSXNVVUZCUVN4RFFVRlRTaXhOUVVGQkxFTkJRVXNzUzBGQlRDeERRVUZYTzNsQ1FVTXpReXhIUVVGUkxHTkJRVUVzYTBKQlFUUkNMRlZCUVVFc1EwRkJWeXhMUVVGWUxFZEJRVzFDTEdOQlFVOUJMRTFCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmNzY1VOQlFUUkNMRlZCUVVFc1EwRkJWenQxUWtGRE0wY3NTVUZCU1N4RlFVRkJMRU5CUVVjc1RVRkJTQ3hIUVVGWkxFZEJRVWM3ZVVKQlEzaENMRWRCUVZFN08yOUNRVVZLTEZOQlFWTXNVVUZCUVN4SFFVRlhMSE5DUVVGelFqdDFRa0ZEYUVRc1EwRkJVU3hIUVVGU0xGVkJRV3RDTERaQ1FVRjNRaXhqUVVGVExGRkJRVk1zYlVKQlFXMUNMRzFDUVVGdFFpeHpRa0ZCYzBJN08yZENRVVYwU0N4UFFVRlBRU3hOUVVGQkxFTkJRVXNzVFVGQlRDeERRVUZaTEZWQlFXNUNMRXRCUVd0RExGbEJRVms3YzBKQlEyaEVMRU5CUVVzc1RVRkJUQ3hEUVVGWkxGVkJRVm83T3pzN05FSkJTMDRzWjBSQlFXMUNMRWxCUVVrN1dVRkRja0lzUTBGQlN5eFZRVUZNTzFWQlEwRXNRMEZCUnl4SlFVRkJMRU5CUVVzN1dVRkRVaXhEUVVGTExGZEJRVXc3T3pSQ1FVZEdMRzlEUVVGak8xbEJRMDRzVVVGQlVTeEpRVUZCTEVOQlFVczdXVUZIWml4RFFVRkRMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmNzUlVGQldpeEpRVUZyUWl4TFFVRkJMRU5CUVUwc1QwRkJlRUlzU1VGQmJVTXNRMEZCUXl4TFFVRkJMRU5CUVUwc1NVRkJTVHRwUWtGRGFFUXNRMEZCVFN4UFFVRk9MRU5CUVdNc1NVRkJaRHRuUWtGRFNTeEpRVUZCTEVOQlFVc3NVVUZCVEN4RFFVRmpMRmxCUVdRc1MwRkJLMElzVDBGQlR6dHhRa0ZEZUVNc1EwRkJUU3hQUVVGT0xFTkJRV01zUzBGQlpDeERRVUZ2UWl4TFFVRkJMRU5CUVUwc1VVRkJVU3hMUVVGQkxFTkJRVTA3TzJWQlJYSkRMRWxCUVVrc1MwRkJRU3hEUVVGTkxFbEJRVWs3YVVKQlEyNUNMRU5CUVUwc1JVRkJUaXhEUVVGVExFdEJRVlFzUTBGQlpTeExRVUZCTEVOQlFVMHNUVUZCVGl4SFFVRmxMRXRCUVVFc1EwRkJUU3haUVVGWkxFdEJRVUVzUTBGQlRTeE5RVUZPTEVkQlFXVXNTMEZCUVN4RFFVRk5PenM3TkVKQlNYcEZMSE5EUVVGbE8xbEJRMUFzVVVGQlVTeEpRVUZCTEVOQlFVczdXVUZGWml4RFFVRkRMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmNzUlVGQldpeEpRVUZyUWl4TFFVRkJMRU5CUVUwc1QwRkJlRUlzU1VGQmJVTXNRMEZCUXl4TFFVRkJMRU5CUVUwc1NVRkJTVHRwUWtGRGFFUXNRMEZCVFN4UFFVRk9MRU5CUVdNc1QwRkJaRHM3V1VGUFJTeExRVUZCTEVOQlFVMHNSVUZCVGl4SlFVRlpMRWxCUVVFc1EwRkJTeXhSUVVGTUxFTkJRV01zUzBGQlpDeExRVUYzUWl4TFFVRndReXhKUVVFMlF5eERRVUZETEV0QlFVRXNRMEZCVFN4SlFVRkpPMmxDUVVNeFJDeERRVUZOTEVWQlFVNHNRMEZCVXl4TFFVRlVPenM3TkVKQlNVb3NkMEpCUVZFN1dVRkRSaXhKUVVGQkxFTkJRVXNzVFVGQlRDeEpRVUZsTEU5QlFVOHNTVUZCUVN4RFFVRkxMRTFCUVV3c1EwRkJXU3hKUVVGdVFpeExRVUUwUWl4WlFVRlpPMmRDUVVONlJDeERRVUZMTEZWQlFVdzdaMEpCUTBFc1EwRkJTeXhOUVVGTUxFTkJRVmtzU1VGQldpeERRVUZwUWl4SlFVRkJMRU5CUVVzN1owSkJRM1JDTEVOQlFVc3NWMEZCVERzN096UkNRVWxLTERSQ1FVRlZPMWxCUTBvc1NVRkJRU3hEUVVGTExFdEJRVXdzUTBGQlZ5eEpRVUZKTzJkQ1FVTnFRaXhEUVVGTExHbENRVUZNTEVkQlFYbENPMmRDUVVONlFpeERRVUZMTEV0QlFVd3NRMEZCVnl4RlFVRllMRU5CUVdNc1RVRkJaRHR0UWtGRFR5eEpRVUZCTEVOQlFVczdaVUZEVUR0dFFrRkRSU3hKUVVGQkxFTkJRVXNzWTBGQlREczdPelJDUVVsWUxEUkRRVUZyUWp0WlFVTmFMRU5CUVVNc1NVRkJRU3hEUVVGTE8yTkJRVkU3V1VGRldpeFJRVUZSTEVsQlFVRXNRMEZCU3p0WlFVTnVRaXhEUVVGTExGVkJRVXc3V1VGRlNUdFpRVVZCTEU5QlFVOHNTVUZCUVN4RFFVRkxMRTFCUVZvc1MwRkJkVUlzV1VGQldUdHpRa0ZEY2tNc1IwRkJZU3hKUVVGQkxFTkJRVXNzVFVGQlRDeERRVUZaTzJWQlEzQkNMRWxCUVVrc1QwRkJUeXhKUVVGQkxFTkJRVXNzVFVGQlRDeERRVUZaTEUxQlFXNUNMRXRCUVRoQ0xGbEJRVms3YzBKQlEyNUVMRWRCUVdFc1NVRkJRU3hEUVVGTExFMUJRVXdzUTBGQldTeE5RVUZhTEVOQlFXMUNPenRaUVVkc1F5eERRVUZMTEZkQlFVdzdaVUZGVHpzN05FSkJSMVFzTUVKQlFWRXNTMEZCVlRzN2NVTkJRVllzUjBGQlRUczdXVUZKVGl4clFrRkJhMElzUTBGRGRFSTdZMEZIUml4RFFVRlBMRWxCUVZBc1EwRkJXU3hKUVVGYUxFTkJRV2xDTEU5QlFXcENMRmRCUVhsQ08yZENRVU51UWl4bFFVRkJMRU5CUVdkQ0xFOUJRV2hDTEVOQlFYZENMRWxCUVhoQ0xFbEJRV2RETEVkQlFVYzdjMEpCUXk5Q0xFbEJRVWtzUzBGQlNpeHZRa0ZCTUVJN096dFpRVWs1UWl4WlFVRlpMRWxCUVVFc1EwRkJTeXhUUVVGTUxFTkJRV1U3V1VGRE0wSXNZVUZCWVN4SlFVRkJMRU5CUVVzc1UwRkJUQ3hEUVVGbE8yRkJSemRDUnl4SlFVRkpMRTlCUVU4c1MwRkJTenRuUWtGRFlpeFJRVUZSTEVkQlFVRXNRMEZCU1R0blFrRkRaQ3hQUVVGUExFdEJRVkFzUzBGQmFVSXNZVUZCWVR0elFrRkRhRU1zUTBGQlN5eFRRVUZNTEVOQlFXVXNTVUZCWml4SFFVRnpRanM3TzFsQlMzQkNMRmRCUVZjc1RVRkJRU3hEUVVGUExFMUJRVkFzUTBGQll5eEpRVUZKTEVsQlFVRXNRMEZCU3l4WFFVRlhPMWxCUXk5RExFMUJRVUVzU1VGQlZTeEhRVUZXTEVsQlFXbENMRTlCUVVFc1NVRkJWenRqUVVGTExFMUJRVTBzU1VGQlNTeExRVUZLTEVOQlFWVTdZMEZEYUVRc1NVRkJTU3hOUVVGQkxFbEJRVlU3WTBGQlN5eFBRVUZQTEZGQlFVRXNRMEZCVXp0alFVTnVReXhKUVVGSkxFOUJRVUVzU1VGQlZ6dGpRVUZMTEU5QlFVOHNVVUZCUVN4RFFVRlRPMWxCUTNKRExGVkJRVUVzU1VGQll5eEhRVUZrTEVsQlFYRkNMR0ZCUVVFc1NVRkJhVUk3WTBGQlN5eE5RVUZOTEVsQlFVa3NTMEZCU2l4RFFVRlZPMk5CUXpGRUxFbEJRVWtzVlVGQlFTeEpRVUZqTzJOQlFVc3NUMEZCVHl4UlFVRkJMRU5CUVZNN1kwRkRka01zU1VGQlNTeGhRVUZCTEVsQlFXbENPMk5CUVVzc1QwRkJUeXhSUVVGQkxFTkJRVk03V1VGRmVrTXNXVUZCV1N4SlFVRkJMRU5CUVVzc1dVRkJUQ3hEUVVGclFqdGpRVU53UXl4RFFVRlBMRTFCUVZBc1EwRkJZeXhKUVVGQkxFTkJRVXNzVVVGQlVUdFpRVWQyUWl4VFFVRkJMRXRCUVdNc1NVRkJRU3hEUVVGTExGTkJRVXdzUTBGQlpTeE5RVUUzUWl4SlFVRjFReXhWUVVGQkxFdEJRV1VzU1VGQlFTeERRVUZMTEZOQlFVd3NRMEZCWlN4VFFVRlRPM05DUVVOd1JDeFpRVUZCTEVOQlFXRXNTVUZCUVN4RFFVRkxPMmRDUVVGMFF6dG5Ra0ZCVVR0blFrRkZhRUlzUTBGQlN5eExRVUZNTEVOQlFWY3NUVUZCV0N4SFFVRnZRanRuUWtGRGNFSXNRMEZCU3l4TFFVRk1MRU5CUVZjc1QwRkJXQ3hIUVVGeFFqdG5Ra0ZIY2tJc1EwRkJTeXhYUVVGTU8yZENRVWRCTEVOQlFVc3NjVUpCUVV3N08xbEJTVVVzUjBGQlFTeERRVUZKTEVWQlFVb3NTVUZCVlN4UFFVRlBMRWRCUVVFc1EwRkJTU3hGUVVGWUxFdEJRV3RDTEZsQlFWazdaMEpCUXpGRExFTkJRVXNzUzBGQlRDeERRVUZYTEVWQlFWZ3NSMEZCWjBJc1IwRkJRU3hEUVVGSk8yZENRVU53UWl4RFFVRkxMRXRCUVV3c1EwRkJWeXhGUVVGWUxFTkJRV01zU1VGQlpDeG5Ra0ZCY1VJN2IwSkJRMlpJTEUxQlFVRXNRMEZCU3p0elFrRkJaVHR6UWtGRGVFSXNRMEZCU3l4cFFrRkJUQ3hIUVVGNVFrRXNUVUZCUVN4RFFVRkxMR05CUVV3N096dFpRVXQ2UWl4VFFVRkJMRWxCUVdFc1MwRkJTenRuUWtGRGFFSXNSMEZCUVN4RFFVRkpPMnRDUVVGVExFbEJRVUVzUTBGQlN5eEpRVUZNT3p0clFrRkRXaXhKUVVGQkxFTkJRVXNzUzBGQlREczdXVUZKVUN4RFFVRkxMRTFCUVV3N1dVRkRRU3hEUVVGTExFMUJRVXc3WlVGRFR5eEpRVUZCTEVOQlFVczdPelJDUVVka0xEUkNRVUZWTzFsQlEwWXNWMEZCVnl4SlFVRkJMRU5CUVVzc1lVRkJURHRaUVVWWUxGZEJRVmNzU1VGQlFTeERRVUZMTzFsQlEyaENMRkZCUVZFc1NVRkJRU3hEUVVGTE8xbEJSMklzVjBGQlZ5eFpRVUZCTEVOQlFXRXNUMEZCVHp0alFVZHlReXhEUVVGUExFMUJRVkFzUTBGQll5eEpRVUZCTEVOQlFVc3NVVUZCVVR0clFrRlRka0lzU1VGQlFTeERRVUZMTzFsQlRGQTdXVUZEUVR0WlFVTkJPMWxCUTBFN1dVRkRRVHRaUVVsSkxGTkJRVk1zU1VGQlFTeERRVUZMTEV0QlFVd3NRMEZCVnp0WlFVTjBRaXhOUVVGQkxFbEJRVlVzVVVGQlFTeERRVUZUTEZsQlFWUXNTMEZCTUVJc1QwRkJUenRuUWtGRGVrTXNTMEZCUVN4RFFVRk5MRWxCUVVrN2IwSkJSVklzVFVGQlFTeERRVUZQTEV0QlFWQXNTMEZCYVVJc1YwRkJha0lzU1VGQlowTXNUVUZCUVN4RFFVRlBMRTFCUVZBc1MwRkJhMElzWTBGQll6dDNRa0ZEYkVVc1EwRkJTeXhoUVVGTUxFZEJRWEZDTzNsQ1FVVnlRaXhEUVVGTkxFVkJRVTRzUTBGQlV5eFpRVUZVTEVOQlFYTkNPM2xDUVVOMFFpeERRVUZOTEVWQlFVNHNRMEZCVXl4WlFVRlVMRU5CUVhOQ0xGZEJRVUVzUjBGQll5eFpRVUZaTEZsQlFVRXNSMEZCWlN4WlFVRlpPM2RDUVVNelJTeERRVUZMTEdGQlFVd3NSMEZCY1VJN08yMUNRVVZzUWp0dlFrRkZSQ3hOUVVGQkxFTkJRVThzUzBGQlVDeExRVUZwUWp0elFrRkJZU3hOUVVGQkxFTkJRVThzUzBGQlVDeEhRVUZsTzI5Q1FVTTNReXhOUVVGQkxFTkJRVThzVFVGQlVDeExRVUZyUWp0elFrRkJZeXhOUVVGQkxFTkJRVThzVFVGQlVDeEhRVUZuUWpzN1owSkJSMnhFTEZOQlFVRXNSVUZCUVN4SlFVRmxMRkZCUVVFc1EwRkJVeXhYUVVGVUxFdEJRWGxDTEU5QlFVODdjMEpCUTJwRUxFTkJRVThzUzBGQlVDeERRVUZoTEV0QlFXSXNSMEZCY1VJN2MwSkJRM0pDTEVOQlFVOHNTMEZCVUN4RFFVRmhMRTFCUVdJc1IwRkJjMEk3T3p0WlFVbHdRaXhYUVVGWExFbEJRVUVzUTBGQlN5eGhRVUZNTzFsQlEySXNWVUZCVlN4RFFVRkRVU3hYUVVGQkxFTkJRVlVzVlVGQlZUdFpRVU12UWl4VFFVRlRPMmRDUVVOWUxFTkJRVXNzV1VGQlREczdaVUZGU3pzN05FSkJSMVFzZDBOQlFXZENPMWxCUlZZc1NVRkJRU3hEUVVGTExFMUJRVXdzU1VGQlpTeFBRVUZQTEVsQlFVRXNRMEZCU3l4TlFVRk1MRU5CUVZrc1RVRkJia0lzUzBGQk9FSXNXVUZCV1R0blFrRkRNMFFzUTBGQlN5eE5RVUZNTEVOQlFWa3NUVUZCV2l4RFFVRnRRaXhKUVVGQkxFTkJRVXM3T3pzMFFrRkpOVUlzT0VKQlFWYzdXVUZEVEN4RFFVRkRMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmM3WTBGQlV6dFpRVU55UWl4RFFVRkRMRk5CUVVFc1NVRkJZVHR0UWtGRGFFSXNRMEZCVVN4TFFVRlNMRU5CUVdNN096dFpRVWRvUWl4RFFVRkxMRWxCUVV3c1IwRkJXU3hOUVVGQkxFTkJRVThzY1VKQlFWQXNRMEZCTmtJc1NVRkJRU3hEUVVGTE8xbEJSVEZETEUxQlFVMUdMRTlCUVVFN1dVRkZTaXhOUVVGTkxFbEJRVUVzUTBGQlN5eExRVUZNTEVOQlFWYzdXVUZEYWtJc2EwSkJRV3RDTEVsQlFVRXNSMEZCVHp0WlFVTXpRaXhqUVVGakxFZEJRVUVzUjBGQlRTeEpRVUZCTEVOQlFVczdXVUZGZGtJc1YwRkJWeXhKUVVGQkxFTkJRVXNzUzBGQlRDeERRVUZYTzFsQlEzUkNMR05CUVdNc1QwRkJUeXhSUVVGUUxFdEJRVzlDTEZGQlFYQkNMRWxCUVdkRExGRkJRVUVzUTBGQlV6dFpRVVY2UkN4aFFVRmhPMWxCUTFnc1pVRkJaU3hKUVVGQkxFTkJRVXNzVVVGQlRDeERRVUZqTzFsQlF5OUNMRmxCUVVFc1MwRkJhVUlzVTBGQlV6dDFRa0ZETlVJc1IwRkJZenRsUVVOVUxFbEJRVWtzV1VGQlFTeExRVUZwUWl4WlFVRlpPMmRDUVVOc1F5eFhRVUZCTEVkQlFXTXNhVUpCUVdsQ08yMUNRVU5xUXl4SFFVRk5MRWRCUVVFc1IwRkJUeXhYUVVGQkxFZEJRV003YjBKQlF6TkNMRU5CUVVzc1UwRkJUQ3hIUVVGcFFqdHRRa0ZEV2pzd1FrRkRUQ3hIUVVGaE96dGxRVVZXTzJkQ1FVTk1MRU5CUVVzc1UwRkJUQ3hIUVVGcFFqczdXVUZIWWl4WlFVRlpMRmRCUVVFc1IwRkJZenRaUVVNMVFpeFZRVUZWTEVsQlFVRXNRMEZCU3l4TFFVRk1MRU5CUVZjc1NVRkJXQ3hIUVVGclFpeFRRVUZCTEVkQlFWa3NTVUZCUVN4RFFVRkxMRXRCUVV3c1EwRkJWenRaUVVkdVJDeFBRVUZCTEVkQlFWVXNRMEZCVml4SlFVRmxMR0ZCUVdFN2JVSkJRemxDTEVkQlFWVXNVVUZCUVN4SFFVRlhPenRaUVVsdVFpeGhRVUZoTzFsQlEySXNZMEZCWXp0WlFVVmFMRlZCUVZVc1NVRkJRU3hEUVVGTExGRkJRVXdzUTBGQll5eEpRVUZrTEV0QlFYVkNPMWxCUlc1RExGZEJRVUVzU1VGQlpTeFBRVUZCTEVsQlFWY3NWVUZCVlR0blFrRkZiRU1zVTBGQlV6c3dRa0ZEV0N4SFFVRmhPM1ZDUVVOaUxFZEJRVlVzVDBGQlFTeEhRVUZWT3pKQ1FVTndRaXhIUVVGak8yMUNRVU5VT3pCQ1FVTk1MRWRCUVdFN2RVSkJRMklzUjBGQlZUc3dRa0ZEVml4SFFVRmhPenRuUWtGSFppeERRVUZMTEZWQlFVdzdPMWxCUjBVc1dVRkJXVHRuUWtGRFpDeERRVUZMTEV0QlFVd3NRMEZCVnl4VFFVRllMRWRCUVhWQ08yZENRVU4yUWl4RFFVRkxMRXRCUVV3c1EwRkJWeXhKUVVGWUxFZEJRV3RDTzJkQ1FVTnNRaXhEUVVGTExFdEJRVXdzUTBGQlZ5eFJRVUZZTEVkQlFYTkNMRWxCUVVFc1EwRkJTeXhuUWtGQlRDeERRVUZ6UWl4VFFVRlRPMmRDUVVNdlF5eFpRVUZaTEVsQlFVRXNRMEZCU3l4TFFVRk1MRU5CUVZjN1owSkJRemRDTEVOQlFVc3NTMEZCVEN4RFFVRlhMRXRCUVZnc1IwRkJiVUlzU1VGQlFTeERRVUZMTEc5Q1FVRk1PMmRDUVVObU8ydENRVUZoTEVsQlFVRXNRMEZCU3l4WlFVRk1PMmRDUVVOaUxGTkJRVUVzUzBGQll5eEpRVUZCTEVOQlFVc3NTMEZCVEN4RFFVRlhPMnRDUVVGUExFbEJRVUVzUTBGQlN5eEpRVUZNTzJkQ1FVTndReXhEUVVGTExFMUJRVXc3WjBKQlEwRXNRMEZCU3l4TFFVRk1MRU5CUVZjc1UwRkJXQ3hIUVVGMVFqczdXVUZIY2tJc1dVRkJXVHRuUWtGRFpDeERRVUZMTEV0QlFVdzdPenMwUWtGSlNpdzRRa0ZCVlN4SlFVRkpPMWxCUTFJc1QwRkJUeXhGUVVGUUxFdEJRV003WTBGQldTeE5RVUZOTEVsQlFVa3NTMEZCU2l4RFFVRlZPMVZCUXpsRExFTkJRVWNzU1VGQlFTeERRVUZMTzFsQlExSXNRMEZCU3l4TlFVRk1PenMwUWtGSFJpd3dRa0ZCVXp0WlFVTlFMRU5CUVVzc2NVSkJRVXc3T3pSQ1FVZEdMRGhDUVVGWE8xbEJRMHdzVTBGQlFTeEpRVUZoTzJ0Q1FVTm1MRU5CUVU4c2JVSkJRVkFzUTBGQk1rSXNWVUZCVlN4SlFVRkJMRU5CUVVzN1owSkJRekZETEVOQlFVc3NhMEpCUVV3c1EwRkJkMElzVFVGQmVFSTdPMWxCUlVVc1NVRkJRU3hEUVVGTExFdEJRVXdzUTBGQlZ5eE5RVUZZTEVOQlFXdENMR1ZCUVdVN1owSkJRMjVETEVOQlFVc3NTMEZCVEN4RFFVRlhMRTFCUVZnc1EwRkJhMElzWVVGQmJFSXNRMEZCWjBNc1YwRkJhRU1zUTBGQk5FTXNTVUZCUVN4RFFVRkxMRXRCUVV3c1EwRkJWenM3T3pSQ1FVa3pSQ3d3UkVGQmVVSTdXVUZEYmtJc1EwRkJReXhUUVVGQk8yTkJRV0U3V1VGRFpDeEpRVUZCTEVOQlFVc3NVVUZCVEN4RFFVRmpMRTFCUVdRc1MwRkJlVUlzUzBGQmVrSXNTMEZCYlVNc1NVRkJRU3hEUVVGTExFdEJRVXdzUTBGQlZ5eE5RVUZZTEVsQlFYRkNMRU5CUVVNc1NVRkJRU3hEUVVGTExFdEJRVXdzUTBGQlZ5eE5RVUZZTEVOQlFXdENMR2RDUVVGblFqdG5Ra0ZEZGtZc1owSkJRV2RDTEVsQlFVRXNRMEZCU3l4UlFVRk1MRU5CUVdNc1RVRkJaQ3hKUVVGM1FpeFJRVUZCTEVOQlFWTTdlVUpCUTNaRUxFTkJRV01zVjBGQlpDeERRVUV3UWl4SlFVRkJMRU5CUVVzc1MwRkJUQ3hEUVVGWE96czdORUpCU1hwRExITkRRVUZsTzFsQlExUXNTVUZCUVN4RFFVRkxMRXRCUVV3c1EwRkJWeXhUUVVGVE8yZENRVU5zUWl4alFVRkJMRU5CUVdVc1NVRkJRU3hEUVVGTExFdEJRVXdzUTBGQlZ5eFZRVUZWTzI5Q1FVTjBReXhEUVVGTExFMUJRVXdzUTBGQldTeEZRVUZhTEVkQlFXbENMRWxCUVVFc1EwRkJTeXhMUVVGTUxFTkJRVmM3YlVKQlEzWkNPM1ZDUVVORkxFbEJRVUVzUTBGQlN5eE5RVUZNTEVOQlFWazdPenM3TkVKQlMzcENMSE5EUVVGakxGVkJRV1U3SzBOQlFXWXNSMEZCVnpzN1dVRkZia0lzVjBGQlZ5eFJRVUZCTEVOQlFWTTdXVUZEY0VJc1kwRkJZeXhSUVVGQkxFTkJRVk03V1VGRGNrSXNXVUZCV1N4UFFVRkJMRU5CUVZFc1VVRkJRU3hEUVVGVExGZEJRVmM3V1VGRGVFTXNUVUZCVFN4UFFVRkJMRU5CUVZFc1VVRkJRU3hEUVVGVExFdEJRVXM3V1VGRE5VSXNZMEZCWXl4UFFVRlBMRkZCUVZBc1MwRkJiMElzVVVGQmNFSXNTVUZCWjBNc1VVRkJRU3hEUVVGVE8xbEJRM1pFTEdsQ1FVRnBRaXhQUVVGUExGZEJRVkFzUzBGQmRVSXNVVUZCZGtJc1NVRkJiVU1zVVVGQlFTeERRVUZUTzFsQlJUZEVMREJDUVVFd1FpeFhRVUZCTEVkQlFXTXNTVUZCUVN4RFFVRkxMRXRCUVV3c1EwRkJWeXhIUVVGQkxFZEJRVTBzV1VGQldUdFpRVU55UlN3d1FrRkJNRUlzWTBGQlFTeEhRVUZyUWl4WFFVRkJMRWRCUVdNc1RVRkJUenRaUVVOdVJTeFhRVUZCTEVsQlFXVXNZMEZCWml4SlFVRnBReXgxUWtGQlFTeExRVUUwUWl4aFFVRmhPMnRDUVVOMFJTeEpRVUZKTEV0QlFVb3NRMEZCVlRzN1dVRkhaQ3hQUVVGUExGRkJRVUVzUTBGQlV5eFZRVUZvUWl4TFFVRXJRaXhYUVVFdlFpeEpRVUU0UXl4UFFVRlBMRkZCUVVFc1EwRkJVeXhMUVVGb1FpeExRVUV3UWl4aFFVRmhPMjFDUVVOMlJpeERRVUZSTEVsQlFWSXNRMEZCWVRzN2JVSkJSMllzUjBGQll5eFBRVUZCTEVOQlFWRXNZVUZCWVN4NVFrRkJlVUk3WjBKQlF6VkVMRWRCUVZjc1QwRkJRU3hEUVVGUkxGVkJRVlVzZVVKQlFYbENPMWxCUldoRUxGbEJRVmtzVVVGQlFTeERRVUZUTzFsQlEzSkNMR0ZCUVdFc1VVRkJRU3hEUVVGVE8xbEJRM1JDTEdWQlFXVXNUMEZCVHl4VFFVRlFMRXRCUVhGQ0xGRkJRWEpDTEVsQlFXbERMRkZCUVVFc1EwRkJVenRaUVVONlJDeG5Ra0ZCWjBJc1QwRkJUeXhWUVVGUUxFdEJRWE5DTEZGQlFYUkNMRWxCUVd0RExGRkJRVUVzUTBGQlV6dFpRVWMzUkN4UFFVRlBPMWxCUTFBc1VVRkJVVHRaUVVOU0xGZEJRVmM3V1VGRFdDeFpRVUZCTEVsQlFXZENMR1ZCUVdVN2EwSkJRek5DTEVsQlFVa3NTMEZCU2l4RFFVRlZPMlZCUTFnc1NVRkJTU3hqUVVGak8yZENRVVYyUWl4SFFVRlBPMjlDUVVOUUxFZEJRVmNzU1VGQlFTeERRVUZMTEdkQ1FVRk1MRU5CUVhOQ0xFMUJRVTA3YVVKQlEzWkRMRWRCUVZFc1NVRkJRU3hEUVVGTExHRkJRVXdzUTBGRFRpeFZRVUZWTEUxQlExWXNZVUZCWVR0bFFVVldMRWxCUVVrc1pVRkJaVHRwUWtGRmVFSXNSMEZCVVR0blFrRkRVaXhIUVVGUExFdEJRVUVzUjBGQlVUdHZRa0ZEWml4SFFVRlhMRWxCUVVFc1EwRkJTeXhuUWtGQlRDeERRVUZ6UWl4TlFVRk5PenRsUVVkc1F6dHpRa0ZEVEN4UlFVUkxPMnRDUVVWTUxFbEJSa3M3YlVKQlIwd3NTMEZJU3p0elFrRkpUQ3hSUVVwTE8zbENRVXRNTEZkQlRFczdhVUpCVFV3c1IwRk9TenQxUWtGUFREczdPelJDUVVsS0xIZENRVUZQTEZGQlFXVXNSVUZCUVN4WFFVRm5RanM3SzBOQlFTOUNMRWRCUVZjN2FVUkJRVWtzUjBGQldUczdXVUZETlVJc1NVRkJRU3hEUVVGTE8yTkJRVkVzVFVGQlRTeEpRVUZKTEV0QlFVb3NRMEZCVlR0WlFVVnFReXhEUVVGTExGTkJRVXdzUjBGQmFVSXNUVUZCUVN4RFFVRlBMRTFCUVZBc1EwRkJZeXhKUVVGSkxGVkJRVlVzU1VGQlFTeERRVUZMTzJ0Q1FVZDBRaXhaUVVGQkxFTkJRV0VzU1VGQlFTeERRVUZMTzFsQlFYUkRPMWxCUVZNN1dVRkZXQ3haUVVGWkxFbEJRVUVzUTBGQlN5eFpRVUZNTEVOQlFXdENMRWxCUVVFc1EwRkJTenRaUVVkNlF5eERRVUZMTEUxQlFVd3NSMEZCWXl4clFrRkRWQ3hUUVVSVE8zRkNRVVZhTEUxQlJsazdjVUpCUjFvc1QwRklXVHQxUWtGSlJDeERRVXBETzNGQ1FVdElMRXRCVEVjN2RVSkJUVVFzUzBGT1F6dHhRa0ZQU0N4TFFWQkhPM1ZDUVZGRUxFdEJVa003YzBKQlUwWXNTVUZCUVN4RFFVRkxMRkZCVkVnN1owTkJXVW9zVTBGQlRVNHNUVUZCUVN4RFFVRkxMRTFCUVV3c1MwRmFSanR2UTBGaFFTeFRRVUZOUVN4TlFVRkJMRU5CUVVzc1ZVRkJUQ3hMUVdKT08yZERRV05FTEdGQlFVOUJMRTFCUVVFc1EwRkJTeXhSUVVGTUxFTkJRV01zVFVGa2NFSTdPRUpCWlU0c1UwRkJUVUVzVFVGQlFTeERRVUZMTEVsQlFVd3NTMEZtUVR0blEwRm5Ra29zVTBGQlRVRXNUVUZCUVN4RFFVRkxMRTFCUVV3c1MwRm9Ra1k3T0VKQmFVSklMR05CUVZGQkxFMUJRVUVzUTBGQlN5eE5RVUZNTEVOQlFWa3NUMEZxUW1wQ08yMURRV3RDUXl4alFVRlBRU3hOUVVGQkxFTkJRVXNzVjBGQlRDeERRVUZwUWl4UFFXeENla0k3WjBOQmJVSktMRk5CUVUxQkxFMUJRVUVzUTBGQlN5eE5RVUZNTEV0QmJrSkdPemhDUVc5Q1RpeFRRVUZOUVN4TlFVRkJMRU5CUVVzc1NVRkJUQ3hMUVhCQ1FUc3JRa0Z4UWt3c1UwRkJUVUVzVFVGQlFTeERRVUZMTEV0QlFVd3NTMEZ5UWtRN09FSkJjMEpPTEZOQlFVMUJMRTFCUVVFc1EwRkJTeXhKUVVGTU8xbEJTV1FzUTBGQlN5eFhRVUZNTzFsQlNVRXNRMEZCU3l4TlFVRk1PenMwUWtGSFJpeHJRMEZCV1N4WlFVRmpMRVZCUVVFc1lVRkJZVHM3TzJWQlF6bENMRWxCUVVFc1EwRkJTeXhKUVVGTUxFTkJRVlVzWTBGQll5eFpRVUY0UWl4RFFVRnhReXhKUVVGeVF5eGhRVUV3UXp0clFrRkRMME1zUTBGQlN5eEhRVUZNTzIxQ1FVTlBRVHM3T3pSQ1FVbFlMRFJDUVVGVk96czdXVUZEVWl4RFFVRkxMRXRCUVV3N1dVRkRTU3hEUVVGRExFbEJRVUVzUTBGQlN6dGpRVUZSTzFsQlEyUXNUMEZCVHl4SlFVRkJMRU5CUVVzc1RVRkJUQ3hEUVVGWkxFMUJRVzVDTEV0QlFUaENMRmxCUVZrN1owSkJRelZETEVOQlFVc3NhVUpCUVV3c1YwRkJkVUlzWjBKQlFWTkJMRTFCUVVFc1EwRkJTeXhOUVVGTUxFTkJRVmtzVFVGQldpeERRVUZ0UWpzN1dVRkZja1FzUTBGQlN5eFBRVUZNTEVkQlFXVTdPelJDUVVkcVFpdzRRa0ZCVnp0WlFVTlVMRU5CUVVzc1RVRkJURHRaUVVOQkxFTkJRVXNzVDBGQlREczdORUpCUjBZc2MwSkJRVTBzV1VGQll5eEZRVUZCTEdGQlFXRTdPenRaUVVVelFpeFBRVUZQTEZsQlFWQXNTMEZCZDBJc1dVRkJXVHRyUWtGRGFFTXNTVUZCU1N4TFFVRktMRU5CUVZVN08xbEJSMlFzU1VGQlFTeERRVUZMTEZGQlFWRTdaMEpCUTJZc1EwRkJTeXhOUVVGTU96dFpRVWRGTEU5QlFVOHNWMEZCVUN4TFFVRjFRaXhoUVVGaE8yZENRVU4wUXl4RFFVRkxMRTFCUVV3c1EwRkJXVHM3V1VGTlpDeERRVUZMTEZWQlFVdzdXVUZGU1N4VlFVRlZMRTlCUVVFc1EwRkJVU3hQUVVGU08xbEJTVllzU1VGQlFTeERRVUZMTEZGQlFVd3NRMEZCWXl4SlFVRkpPMmRDUVVOb1FpeERRVUZETEZOQlFVRXNTVUZCWVR0elFrRkRWaXhKUVVGSkxFdEJRVW9zUTBGQlZUczdiVUpCUld4Q0xFZEJRVlVzU1VGQlNTeFBRVUZLTEZkQlFWazdiMEpCUTJoQ0xHZENRVUZuUWtFc1RVRkJRU3hEUVVGTExGRkJRVXdzUTBGQll6dHZRa0ZET1VJN2IwSkJRMEVzWVVGQlFTeERRVUZqTEVsQlFVazdNa0pCUTNCQ0xFZEJRVlVzWVVGQlFTeERRVUZqTzJsRFFVTjRRaXhIUVVGblFpeGhRVUZCTEVOQlFXTTdPMjlDUVVreFFpeHhRa0ZCVnp0M1FrRkZXRHN3UWtGQlV5eEZRVUZCTEVOQlFVY3NUMEZCU0N4blFrRkJZU3hUUVVGTkxFOUJRVUVzUTBGQlVUdHpRa0ZEZUVNc1EwRkJSeXhMUVVGSUxHZENRVUZYT3pSQ1FVTklMRkZCUVZGQkxFMUJRVUVzUTBGQlN6czBRa0ZEWWl4UFFVRlBRU3hOUVVGQkxFTkJRVXNzVVVGQlRDeERRVUZqTEU5QlFXUXNTMEZCTUVJN05FSkJRMnBETEZkQlFWY3NTVUZCUVN4SFFVRlBMRVZCUVVFc1EwRkJSeXhSUVVGUkxFVkJRVUVzUTBGQlJ6c3dRa0ZEZEVNc1EwRkJSeXhOUVVGSU96QkNRVU5CTEVOQlFVY3NXVUZCU0N4RFFVRm5RaXhMUVVGQkxFTkJRVTA3TUVKQlEzUkNMRU5CUVVjc1dVRkJTQ3hEUVVGblFpeExRVUZCTEVOQlFVMHNaVUZCWlN4TFFVRkJMRU5CUVUwc1owSkJRV2RDT3pSQ1FVTjJSQ3hKUVVGQkxFbEJRVkZCTEUxQlFVRXNRMEZCU3l4UlFVRk1MRU5CUVdNc1dVRkJXVHM0UWtGRGNFTXNRMEZCUnl4aFFVRklMRU5CUVdsQ1FTeE5RVUZCTEVOQlFVc3NVVUZCVEN4RFFVRmpPenM0UWtGSGFrTXNRMEZCU3l4TlFVRk1MRU5CUVZrN1owTkJRVVVzUlVGQlJqdHZRMEZCWXl4RlFVRkJMRU5CUVVjc1RVRkJha0k3Y1VOQlFXdERMRVZCUVVFc1EwRkJSeXhUUVVGSUxFTkJRV0U3T3l0Q1FVTXpSRHM3TzI5Q1FVdEJMRTlCUVU4c1lVRkJVQ3hMUVVGNVFpeFpRVUZaTzNkQ1FVTnVReXhoUVVGS0xFTkJRV3RDTzNWQ1FVTmlPM2RDUVVORUxFOUJRVThzVFVGQlFTeERRVUZQTEZsQlFXUXNTMEZCSzBJc1dVRkJXVHM0UWtGRGRrTXNTVUZCU1N4TFFVRktMRU5CUVZVN096UkNRVVZzUWl4RFFVRlRPenM3TzJWQlMxSXNUMEZCUVN4RFFVRlJMRWxCUVZJc1lVRkJZVHRuUWtGRlpDeFRRVUZUTEZsQlFVRXNRMEZCWVVFc1RVRkJRU3hEUVVGTE8yZENRVU16UWl4RFFVRkRUeXhYUVVGQkxFTkJRVlVzVTBGQlV6dHpRa0ZEZEVJc1IwRkJVeXhQUVVGQkxFTkJRVkVzVDBGQlVpeERRVUZuUWpzN2JVSkJSWEJDTzFWQlRrWXNRMEZQU2l4SlFWQkpMRmRCVDBNN1owSkJRMFlzUTBGQlF6dHJRa0ZCVVN4TlFVRkJMRWRCUVZNN2EwSkJRM1JDTEVOQlFVc3NUMEZCVEN4SFFVRmxPMmRDUVVkWUxGTkJRVUVzU1VGQllUdHpRa0ZEWml4RFFVRkxMR3RDUVVGTUxFTkJRWGRDTEUxQlFYaENPM05DUVVOQkxFTkJRVThzWjBKQlFWQXNRMEZCZDBJc1ZVRkJWVkFzVFVGQlFTeERRVUZMT3p0clFrRkhla01zUTBGQlN5eFhRVUZNTzJ0Q1FVMUJMRU5CUVVzc1dVRkJURHR0UWtGRFQwRTdWVUY0UWtZc1EwRjVRa29zUzBGNlFra3NWMEY1UWtVN2JVSkJRMUFzUTBGQlVTeEpRVUZTTEVOQlFXRXNlVVpCUVVFc1IwRkJORVlzUjBGQlFTeERRVUZKTzJ0Q1FVTjJSenM3T3pzN08wbERiak5DV2tVc1NVRkJUU3hSUVVGUk8wbEJRMlJCTEVsQlFVMHNiMEpCUVc5Q08wbEJSVEZDTEZOQlFWTXNZMEZCWlR0UlFVTjBRa0VzU1VGQlRTeFRRVUZUTEZsQlFVRTdVVUZEWml4UFFVRlBMRTFCUVVFc1NVRkJWU3hOUVVGQkxFTkJRVTg3T3p0SlFVY3hRaXhUUVVGVExGTkJRVlVzU1VGQlNUdFJRVU55UWtFc1NVRkJUU3hUUVVGVExGbEJRVUU3VVVGRFppeEpRVUZKTEVOQlFVTTdZMEZCVVN4UFFVRlBPMUZCUTNCQ0xFMUJRVUVzUTBGQlR5eE5RVUZRTEVkQlFXZENMRTFCUVVFc1EwRkJUeXhOUVVGUUxFbEJRV2xDTzFGQlEycERMRTlCUVU4c1RVRkJRU3hEUVVGUExFMUJRVkFzUTBGQll6czdPMGxCUjNaQ0xGTkJRVk1zVTBGQlZTeEZRVUZKTEVWQlFVRXNUVUZCVFR0UlFVTXpRa0VzU1VGQlRTeFRRVUZUTEZsQlFVRTdVVUZEWml4SlFVRkpMRU5CUVVNN1kwRkJVU3hQUVVGUE8xRkJRM0JDTEUxQlFVRXNRMEZCVHl4TlFVRlFMRWRCUVdkQ0xFMUJRVUVzUTBGQlR5eE5RVUZRTEVsQlFXbENPMUZCUTJwRExFMUJRVUVzUTBGQlR5eE5RVUZRTEVOQlFXTXNSMEZCWkN4SFFVRnZRanM3TzBsQlIzUkNMRk5CUVZNc1dVRkJZU3hWUVVGWkxFVkJRVUVzWVVGQllUdFJRVVUzUXl4UFFVRlBMRmRCUVVFc1EwRkJXU3hQUVVGYUxFZEJRWE5DTzFsQlFVVXNUVUZCVFN4VlFVRkJMRU5CUVZjc1MwRkJXQ3hEUVVGcFFqdFpRVUZUT3pzN1NVRkhha1VzVTBGQlV5eGhRVUZqTEUxQlFWRXNSVUZCUVN4VlFVRmxPekpEUVVGbUxFZEJRVmM3TzFGQlEzaERMRWxCUVVrc1VVRkJRU3hEUVVGVExFbEJRVWs3V1VGRFppeEpRVUZKTEZGQlFVRXNRMEZCVXl4TlFVRlVMRWxCUVc5Q0xGRkJRVUVzUTBGQlV5eFBRVUZVTEVsQlFXOUNMRTlCUVU4c1VVRkJRU3hEUVVGVExFOUJRV2hDTEV0QlFUUkNMRlZCUVZjN1owSkJRMnBHTEUxQlFVMHNTVUZCU1N4TFFVRktMRU5CUVZVN08xbEJTV3hDUVN4SlFVRk5MRlZCUVZVc1QwRkJUeXhSUVVGQkxFTkJRVk1zVDBGQmFFSXNTMEZCTkVJc1VVRkJOVUlzUjBGQmRVTXNVVUZCUVN4RFFVRlRMRlZCUVZVN1dVRkRNVVVzVVVGQlFTeEhRVUZYTEUxQlFVRXNRMEZCVHl4TlFVRlFMRU5CUVdNc1NVRkJTU3hWUVVGVk8yZENRVUZGTEZGQlFWRXNTMEZCVmp0NVFrRkJhVUk3T3p0UlFVY3hSRUVzU1VGQlRTeFJRVUZSTEZkQlFVRTdVVUZEWkVNc1NVRkJTVHRSUVVOS0xFbEJRVWtzVDBGQlR6dFpRVWxVTEV0QlFVRXNSMEZCVVN4UFFVRkJMRU5CUVZFc1VVRkJRU3hEUVVGVExFbEJRVWs3TzFGQlJTOUNRU3hKUVVGSkxHTkJRV01zUzBGQlFTeEpRVUZUTEU5QlFVOHNTMEZCVUN4TFFVRnBRanRSUVVVMVF5eEpRVUZKTEZkQlFVRXNTVUZCWlN4cFFrRkJRU3hEUVVGclFpeFJRVUZzUWl4RFFVRXlRaXhSUVVGUk8xbEJRM0JFTEU5QlFVRXNRMEZCVVN4SlFVRlNMRU5CUVdFc2NVdEJRWEZMTzFsQlEyeE1MRmRCUVVFc1IwRkJZenM3VVVGSGFFSkJMRWxCUVVrc1ZVRkJWU3hQUVVGQkxFTkJRVkVzVDBGQlVqdFJRVVZrTEVsQlFVa3NZVUZCWVR0WlFVVm1MR2xDUVVGQkxFTkJRV3RDTEVsQlFXeENMRU5CUVhWQ08xbEJSWFpDUkN4SlFVRk5MR1ZCUVdVc1VVRkJRU3hEUVVGVE8xbEJRemxDTEVsQlFVa3NZMEZCWXp0blFrRkRhRUpCTEVsQlFVMHNiVUpCUVU4N2IwSkJSVmhCTEVsQlFVMHNWMEZCVnl4WFFVRkJMRU5CUVZrc1dVRkJRU3hEUVVGaExGTkJRVk03YjBKQlJXNUVMRmxCUVVFc1EwRkJZU3hQUVVGaUxFTkJRWEZDTEU5QlFYSkNPMjlDUVVWQkxFOUJRVTg3TzJkQ1FVbFVMRTlCUVVFc1IwRkJWU3haUVVGQkxFTkJRV0VzU1VGQllpeERRVUZyUWl4SlFVRnNRaXhEUVVGMVFpeExRVUYyUWl4RFFVRTJRaXhMUVVFM1FpeERRVUZ0UXpzN08xRkJTV3BFTEU5QlFVOHNUMEZCUVN4RFFVRlJMRWxCUVZJc1YwRkJZVHRaUVVOc1FrRXNTVUZCVFN4VlFVRlZMRWxCUVVrc1lVRkJTanRaUVVOb1FrTXNTVUZCU1R0WlFVTktMRWxCUVVrc1VVRkJVVHRuUWtGRlZpeFJRVUZCTEVkQlFWY3NUVUZCUVN4RFFVRlBMRTFCUVZBc1EwRkJZeXhKUVVGSkxGVkJRVlU3WjBKQlIzWkRMRTlCUVVFc1EwRkJVU3hMUVVGU0xFTkJRV003WjBKQlIyUXNUMEZCUVN4RFFVRlJMRXRCUVZJN1owSkJSMEVzVFVGQlFTeEhRVUZUTEU5QlFVRXNRMEZCVVN4VlFVRlNMRU5CUVcxQ08yMUNRVU4yUWp0blFrRkRUQ3hOUVVGQkxFZEJRVk1zVDBGQlFTeERRVUZSTEU5QlFWSXNRMEZCWjBJN08xbEJSVE5DTEVsQlFVa3NZVUZCWVR0blFrRkRaaXhSUVVGQkxFTkJRVk1zVDBGQlR6dHZRa0ZCUlN4TlFVRk5MRTFCUVZJN05rSkJRV2RDT3pzN1dVRkZiRU1zVDBGQlR6czdPenRKUVV0WUxGbEJRVUVzUTBGQllTeFpRVUZpTEVkQlFUUkNPMGxCUXpWQ0xGbEJRVUVzUTBGQllTeFZRVUZpTEVkQlFUQkNUVHM3T3pzN096czdJbjA9XG4iLCJ2YXIgZGVmaW5lZCA9IHJlcXVpcmUoJ2RlZmluZWQnKTtcbnZhciB1bml0cyA9IFsgJ21tJywgJ2NtJywgJ20nLCAncGMnLCAncHQnLCAnaW4nLCAnZnQnLCAncHgnIF07XG5cbnZhciBjb252ZXJzaW9ucyA9IHtcbiAgLy8gbWV0cmljXG4gIG06IHtcbiAgICBzeXN0ZW06ICdtZXRyaWMnLFxuICAgIGZhY3RvcjogMVxuICB9LFxuICBjbToge1xuICAgIHN5c3RlbTogJ21ldHJpYycsXG4gICAgZmFjdG9yOiAxIC8gMTAwXG4gIH0sXG4gIG1tOiB7XG4gICAgc3lzdGVtOiAnbWV0cmljJyxcbiAgICBmYWN0b3I6IDEgLyAxMDAwXG4gIH0sXG4gIC8vIGltcGVyaWFsXG4gIHB0OiB7XG4gICAgc3lzdGVtOiAnaW1wZXJpYWwnLFxuICAgIGZhY3RvcjogMSAvIDcyXG4gIH0sXG4gIHBjOiB7XG4gICAgc3lzdGVtOiAnaW1wZXJpYWwnLFxuICAgIGZhY3RvcjogMSAvIDZcbiAgfSxcbiAgaW46IHtcbiAgICBzeXN0ZW06ICdpbXBlcmlhbCcsXG4gICAgZmFjdG9yOiAxXG4gIH0sXG4gIGZ0OiB7XG4gICAgc3lzdGVtOiAnaW1wZXJpYWwnLFxuICAgIGZhY3RvcjogMTJcbiAgfVxufTtcblxuY29uc3QgYW5jaG9ycyA9IHtcbiAgbWV0cmljOiB7XG4gICAgdW5pdDogJ20nLFxuICAgIHJhdGlvOiAxIC8gMC4wMjU0XG4gIH0sXG4gIGltcGVyaWFsOiB7XG4gICAgdW5pdDogJ2luJyxcbiAgICByYXRpbzogMC4wMjU0XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJvdW5kICh2YWx1ZSwgZGVjaW1hbHMpIHtcbiAgcmV0dXJuIE51bWJlcihNYXRoLnJvdW5kKHZhbHVlICsgJ2UnICsgZGVjaW1hbHMpICsgJ2UtJyArIGRlY2ltYWxzKTtcbn1cblxuZnVuY3Rpb24gY29udmVydERpc3RhbmNlICh2YWx1ZSwgZnJvbVVuaXQsIHRvVW5pdCwgb3B0cykge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCAhaXNGaW5pdGUodmFsdWUpKSB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIG11c3QgYmUgYSBmaW5pdGUgbnVtYmVyJyk7XG4gIGlmICghZnJvbVVuaXQgfHwgIXRvVW5pdCkgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHNwZWNpZnkgZnJvbSBhbmQgdG8gdW5pdHMnKTtcblxuICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgdmFyIHBpeGVsc1BlckluY2ggPSBkZWZpbmVkKG9wdHMucGl4ZWxzUGVySW5jaCwgOTYpO1xuICB2YXIgcHJlY2lzaW9uID0gb3B0cy5wcmVjaXNpb247XG4gIHZhciByb3VuZFBpeGVsID0gb3B0cy5yb3VuZFBpeGVsICE9PSBmYWxzZTtcblxuICBmcm9tVW5pdCA9IGZyb21Vbml0LnRvTG93ZXJDYXNlKCk7XG4gIHRvVW5pdCA9IHRvVW5pdC50b0xvd2VyQ2FzZSgpO1xuXG4gIGlmICh1bml0cy5pbmRleE9mKGZyb21Vbml0KSA9PT0gLTEpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBmcm9tIHVuaXQgXCInICsgZnJvbVVuaXQgKyAnXCIsIG11c3QgYmUgb25lIG9mOiAnICsgdW5pdHMuam9pbignLCAnKSk7XG4gIGlmICh1bml0cy5pbmRleE9mKHRvVW5pdCkgPT09IC0xKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZnJvbSB1bml0IFwiJyArIHRvVW5pdCArICdcIiwgbXVzdCBiZSBvbmUgb2Y6ICcgKyB1bml0cy5qb2luKCcsICcpKTtcblxuICBpZiAoZnJvbVVuaXQgPT09IHRvVW5pdCkge1xuICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gY29udmVydCBmcm9tIEEgdG8gQiBzaW5jZSB0aGV5IGFyZSB0aGUgc2FtZSBhbHJlYWR5XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgdmFyIHRvRmFjdG9yID0gMTtcbiAgdmFyIGZyb21GYWN0b3IgPSAxO1xuICB2YXIgaXNUb1BpeGVsID0gZmFsc2U7XG5cbiAgaWYgKGZyb21Vbml0ID09PSAncHgnKSB7XG4gICAgZnJvbUZhY3RvciA9IDEgLyBwaXhlbHNQZXJJbmNoO1xuICAgIGZyb21Vbml0ID0gJ2luJztcbiAgfVxuICBpZiAodG9Vbml0ID09PSAncHgnKSB7XG4gICAgaXNUb1BpeGVsID0gdHJ1ZTtcbiAgICB0b0ZhY3RvciA9IHBpeGVsc1BlckluY2g7XG4gICAgdG9Vbml0ID0gJ2luJztcbiAgfVxuXG4gIHZhciBmcm9tVW5pdERhdGEgPSBjb252ZXJzaW9uc1tmcm9tVW5pdF07XG4gIHZhciB0b1VuaXREYXRhID0gY29udmVyc2lvbnNbdG9Vbml0XTtcblxuICAvLyBzb3VyY2UgdG8gYW5jaG9yIGluc2lkZSBzb3VyY2UncyBzeXN0ZW1cbiAgdmFyIGFuY2hvciA9IHZhbHVlICogZnJvbVVuaXREYXRhLmZhY3RvciAqIGZyb21GYWN0b3I7XG5cbiAgLy8gaWYgc3lzdGVtcyBkaWZmZXIsIGNvbnZlcnQgb25lIHRvIGFub3RoZXJcbiAgaWYgKGZyb21Vbml0RGF0YS5zeXN0ZW0gIT09IHRvVW5pdERhdGEuc3lzdGVtKSB7XG4gICAgLy8gcmVndWxhciAnbScgdG8gJ2luJyBhbmQgc28gZm9ydGhcbiAgICBhbmNob3IgKj0gYW5jaG9yc1tmcm9tVW5pdERhdGEuc3lzdGVtXS5yYXRpbztcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBhbmNob3IgLyB0b1VuaXREYXRhLmZhY3RvciAqIHRvRmFjdG9yO1xuICBpZiAoaXNUb1BpeGVsICYmIHJvdW5kUGl4ZWwpIHtcbiAgICByZXN1bHQgPSBNYXRoLnJvdW5kKHJlc3VsdCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByZWNpc2lvbiA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUocHJlY2lzaW9uKSkge1xuICAgIHJlc3VsdCA9IHJvdW5kKHJlc3VsdCwgcHJlY2lzaW9uKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnZlcnREaXN0YW5jZTtcbm1vZHVsZS5leHBvcnRzLnVuaXRzID0gdW5pdHM7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXJndW1lbnRzW2ldICE9PSB1bmRlZmluZWQpIHJldHVybiBhcmd1bWVudHNbaV07XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB3aWR0aCA9IDI1NjsvLyBlYWNoIFJDNCBvdXRwdXQgaXMgMCA8PSB4IDwgMjU2XHJcbnZhciBjaHVua3MgPSA2Oy8vIGF0IGxlYXN0IHNpeCBSQzQgb3V0cHV0cyBmb3IgZWFjaCBkb3VibGVcclxudmFyIGRpZ2l0cyA9IDUyOy8vIHRoZXJlIGFyZSA1MiBzaWduaWZpY2FudCBkaWdpdHMgaW4gYSBkb3VibGVcclxudmFyIHBvb2wgPSBbXTsvLyBwb29sOiBlbnRyb3B5IHBvb2wgc3RhcnRzIGVtcHR5XHJcbnZhciBHTE9CQUwgPSB0eXBlb2YgZ2xvYmFsID09PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbDtcclxuXHJcbi8vXHJcbi8vIFRoZSBmb2xsb3dpbmcgY29uc3RhbnRzIGFyZSByZWxhdGVkIHRvIElFRUUgNzU0IGxpbWl0cy5cclxuLy9cclxudmFyIHN0YXJ0ZGVub20gPSBNYXRoLnBvdyh3aWR0aCwgY2h1bmtzKSxcclxuICAgIHNpZ25pZmljYW5jZSA9IE1hdGgucG93KDIsIGRpZ2l0cyksXHJcbiAgICBvdmVyZmxvdyA9IHNpZ25pZmljYW5jZSAqIDIsXHJcbiAgICBtYXNrID0gd2lkdGggLSAxO1xyXG5cclxuXHJcbnZhciBvbGRSYW5kb20gPSBNYXRoLnJhbmRvbTtcclxuXHJcbi8vXHJcbi8vIHNlZWRyYW5kb20oKVxyXG4vLyBUaGlzIGlzIHRoZSBzZWVkcmFuZG9tIGZ1bmN0aW9uIGRlc2NyaWJlZCBhYm92ZS5cclxuLy9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWVkLCBvcHRpb25zKSB7XHJcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5nbG9iYWwgPT09IHRydWUpIHtcclxuICAgIG9wdGlvbnMuZ2xvYmFsID0gZmFsc2U7XHJcbiAgICBNYXRoLnJhbmRvbSA9IG1vZHVsZS5leHBvcnRzKHNlZWQsIG9wdGlvbnMpO1xyXG4gICAgb3B0aW9ucy5nbG9iYWwgPSB0cnVlO1xyXG4gICAgcmV0dXJuIE1hdGgucmFuZG9tO1xyXG4gIH1cclxuICB2YXIgdXNlX2VudHJvcHkgPSAob3B0aW9ucyAmJiBvcHRpb25zLmVudHJvcHkpIHx8IGZhbHNlO1xyXG4gIHZhciBrZXkgPSBbXTtcclxuXHJcbiAgLy8gRmxhdHRlbiB0aGUgc2VlZCBzdHJpbmcgb3IgYnVpbGQgb25lIGZyb20gbG9jYWwgZW50cm9weSBpZiBuZWVkZWQuXHJcbiAgdmFyIHNob3J0c2VlZCA9IG1peGtleShmbGF0dGVuKFxyXG4gICAgdXNlX2VudHJvcHkgPyBbc2VlZCwgdG9zdHJpbmcocG9vbCldIDpcclxuICAgIDAgaW4gYXJndW1lbnRzID8gc2VlZCA6IGF1dG9zZWVkKCksIDMpLCBrZXkpO1xyXG5cclxuICAvLyBVc2UgdGhlIHNlZWQgdG8gaW5pdGlhbGl6ZSBhbiBBUkM0IGdlbmVyYXRvci5cclxuICB2YXIgYXJjNCA9IG5ldyBBUkM0KGtleSk7XHJcblxyXG4gIC8vIE1peCB0aGUgcmFuZG9tbmVzcyBpbnRvIGFjY3VtdWxhdGVkIGVudHJvcHkuXHJcbiAgbWl4a2V5KHRvc3RyaW5nKGFyYzQuUyksIHBvb2wpO1xyXG5cclxuICAvLyBPdmVycmlkZSBNYXRoLnJhbmRvbVxyXG5cclxuICAvLyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSByYW5kb20gZG91YmxlIGluIFswLCAxKSB0aGF0IGNvbnRhaW5zXHJcbiAgLy8gcmFuZG9tbmVzcyBpbiBldmVyeSBiaXQgb2YgdGhlIG1hbnRpc3NhIG9mIHRoZSBJRUVFIDc1NCB2YWx1ZS5cclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkgeyAgICAgICAgIC8vIENsb3N1cmUgdG8gcmV0dXJuIGEgcmFuZG9tIGRvdWJsZTpcclxuICAgIHZhciBuID0gYXJjNC5nKGNodW5rcyksICAgICAgICAgICAgIC8vIFN0YXJ0IHdpdGggYSBudW1lcmF0b3IgbiA8IDIgXiA0OFxyXG4gICAgICAgIGQgPSBzdGFydGRlbm9tLCAgICAgICAgICAgICAgICAgLy8gICBhbmQgZGVub21pbmF0b3IgZCA9IDIgXiA0OC5cclxuICAgICAgICB4ID0gMDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgYW5kIG5vICdleHRyYSBsYXN0IGJ5dGUnLlxyXG4gICAgd2hpbGUgKG4gPCBzaWduaWZpY2FuY2UpIHsgICAgICAgICAgLy8gRmlsbCB1cCBhbGwgc2lnbmlmaWNhbnQgZGlnaXRzIGJ5XHJcbiAgICAgIG4gPSAobiArIHgpICogd2lkdGg7ICAgICAgICAgICAgICAvLyAgIHNoaWZ0aW5nIG51bWVyYXRvciBhbmRcclxuICAgICAgZCAqPSB3aWR0aDsgICAgICAgICAgICAgICAgICAgICAgIC8vICAgZGVub21pbmF0b3IgYW5kIGdlbmVyYXRpbmcgYVxyXG4gICAgICB4ID0gYXJjNC5nKDEpOyAgICAgICAgICAgICAgICAgICAgLy8gICBuZXcgbGVhc3Qtc2lnbmlmaWNhbnQtYnl0ZS5cclxuICAgIH1cclxuICAgIHdoaWxlIChuID49IG92ZXJmbG93KSB7ICAgICAgICAgICAgIC8vIFRvIGF2b2lkIHJvdW5kaW5nIHVwLCBiZWZvcmUgYWRkaW5nXHJcbiAgICAgIG4gLz0gMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGxhc3QgYnl0ZSwgc2hpZnQgZXZlcnl0aGluZ1xyXG4gICAgICBkIC89IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICByaWdodCB1c2luZyBpbnRlZ2VyIE1hdGggdW50aWxcclxuICAgICAgeCA+Pj49IDE7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgd2UgaGF2ZSBleGFjdGx5IHRoZSBkZXNpcmVkIGJpdHMuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gKG4gKyB4KSAvIGQ7ICAgICAgICAgICAgICAgICAvLyBGb3JtIHRoZSBudW1iZXIgd2l0aGluIFswLCAxKS5cclxuICB9O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMucmVzZXRHbG9iYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgTWF0aC5yYW5kb20gPSBvbGRSYW5kb207XHJcbn07XHJcblxyXG4vL1xyXG4vLyBBUkM0XHJcbi8vXHJcbi8vIEFuIEFSQzQgaW1wbGVtZW50YXRpb24uICBUaGUgY29uc3RydWN0b3IgdGFrZXMgYSBrZXkgaW4gdGhlIGZvcm0gb2ZcclxuLy8gYW4gYXJyYXkgb2YgYXQgbW9zdCAod2lkdGgpIGludGVnZXJzIHRoYXQgc2hvdWxkIGJlIDAgPD0geCA8ICh3aWR0aCkuXHJcbi8vXHJcbi8vIFRoZSBnKGNvdW50KSBtZXRob2QgcmV0dXJucyBhIHBzZXVkb3JhbmRvbSBpbnRlZ2VyIHRoYXQgY29uY2F0ZW5hdGVzXHJcbi8vIHRoZSBuZXh0IChjb3VudCkgb3V0cHV0cyBmcm9tIEFSQzQuICBJdHMgcmV0dXJuIHZhbHVlIGlzIGEgbnVtYmVyIHhcclxuLy8gdGhhdCBpcyBpbiB0aGUgcmFuZ2UgMCA8PSB4IDwgKHdpZHRoIF4gY291bnQpLlxyXG4vL1xyXG4vKiogQGNvbnN0cnVjdG9yICovXHJcbmZ1bmN0aW9uIEFSQzQoa2V5KSB7XHJcbiAgdmFyIHQsIGtleWxlbiA9IGtleS5sZW5ndGgsXHJcbiAgICAgIG1lID0gdGhpcywgaSA9IDAsIGogPSBtZS5pID0gbWUuaiA9IDAsIHMgPSBtZS5TID0gW107XHJcblxyXG4gIC8vIFRoZSBlbXB0eSBrZXkgW10gaXMgdHJlYXRlZCBhcyBbMF0uXHJcbiAgaWYgKCFrZXlsZW4pIHsga2V5ID0gW2tleWxlbisrXTsgfVxyXG5cclxuICAvLyBTZXQgdXAgUyB1c2luZyB0aGUgc3RhbmRhcmQga2V5IHNjaGVkdWxpbmcgYWxnb3JpdGhtLlxyXG4gIHdoaWxlIChpIDwgd2lkdGgpIHtcclxuICAgIHNbaV0gPSBpKys7XHJcbiAgfVxyXG4gIGZvciAoaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XHJcbiAgICBzW2ldID0gc1tqID0gbWFzayAmIChqICsga2V5W2kgJSBrZXlsZW5dICsgKHQgPSBzW2ldKSldO1xyXG4gICAgc1tqXSA9IHQ7XHJcbiAgfVxyXG5cclxuICAvLyBUaGUgXCJnXCIgbWV0aG9kIHJldHVybnMgdGhlIG5leHQgKGNvdW50KSBvdXRwdXRzIGFzIG9uZSBudW1iZXIuXHJcbiAgKG1lLmcgPSBmdW5jdGlvbihjb3VudCkge1xyXG4gICAgLy8gVXNpbmcgaW5zdGFuY2UgbWVtYmVycyBpbnN0ZWFkIG9mIGNsb3N1cmUgc3RhdGUgbmVhcmx5IGRvdWJsZXMgc3BlZWQuXHJcbiAgICB2YXIgdCwgciA9IDAsXHJcbiAgICAgICAgaSA9IG1lLmksIGogPSBtZS5qLCBzID0gbWUuUztcclxuICAgIHdoaWxlIChjb3VudC0tKSB7XHJcbiAgICAgIHQgPSBzW2kgPSBtYXNrICYgKGkgKyAxKV07XHJcbiAgICAgIHIgPSByICogd2lkdGggKyBzW21hc2sgJiAoKHNbaV0gPSBzW2ogPSBtYXNrICYgKGogKyB0KV0pICsgKHNbal0gPSB0KSldO1xyXG4gICAgfVxyXG4gICAgbWUuaSA9IGk7IG1lLmogPSBqO1xyXG4gICAgcmV0dXJuIHI7XHJcbiAgICAvLyBGb3Igcm9idXN0IHVucHJlZGljdGFiaWxpdHkgZGlzY2FyZCBhbiBpbml0aWFsIGJhdGNoIG9mIHZhbHVlcy5cclxuICAgIC8vIFNlZSBodHRwOi8vd3d3LnJzYS5jb20vcnNhbGFicy9ub2RlLmFzcD9pZD0yMDA5XHJcbiAgfSkod2lkdGgpO1xyXG59XHJcblxyXG4vL1xyXG4vLyBmbGF0dGVuKClcclxuLy8gQ29udmVydHMgYW4gb2JqZWN0IHRyZWUgdG8gbmVzdGVkIGFycmF5cyBvZiBzdHJpbmdzLlxyXG4vL1xyXG5mdW5jdGlvbiBmbGF0dGVuKG9iaiwgZGVwdGgpIHtcclxuICB2YXIgcmVzdWx0ID0gW10sIHR5cCA9ICh0eXBlb2Ygb2JqKVswXSwgcHJvcDtcclxuICBpZiAoZGVwdGggJiYgdHlwID09ICdvJykge1xyXG4gICAgZm9yIChwcm9wIGluIG9iaikge1xyXG4gICAgICB0cnkgeyByZXN1bHQucHVzaChmbGF0dGVuKG9ialtwcm9wXSwgZGVwdGggLSAxKSk7IH0gY2F0Y2ggKGUpIHt9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAocmVzdWx0Lmxlbmd0aCA/IHJlc3VsdCA6IHR5cCA9PSAncycgPyBvYmogOiBvYmogKyAnXFwwJyk7XHJcbn1cclxuXHJcbi8vXHJcbi8vIG1peGtleSgpXHJcbi8vIE1peGVzIGEgc3RyaW5nIHNlZWQgaW50byBhIGtleSB0aGF0IGlzIGFuIGFycmF5IG9mIGludGVnZXJzLCBhbmRcclxuLy8gcmV0dXJucyBhIHNob3J0ZW5lZCBzdHJpbmcgc2VlZCB0aGF0IGlzIGVxdWl2YWxlbnQgdG8gdGhlIHJlc3VsdCBrZXkuXHJcbi8vXHJcbmZ1bmN0aW9uIG1peGtleShzZWVkLCBrZXkpIHtcclxuICB2YXIgc3RyaW5nc2VlZCA9IHNlZWQgKyAnJywgc21lYXIsIGogPSAwO1xyXG4gIHdoaWxlIChqIDwgc3RyaW5nc2VlZC5sZW5ndGgpIHtcclxuICAgIGtleVttYXNrICYgal0gPVxyXG4gICAgICBtYXNrICYgKChzbWVhciBePSBrZXlbbWFzayAmIGpdICogMTkpICsgc3RyaW5nc2VlZC5jaGFyQ29kZUF0KGorKykpO1xyXG4gIH1cclxuICByZXR1cm4gdG9zdHJpbmcoa2V5KTtcclxufVxyXG5cclxuLy9cclxuLy8gYXV0b3NlZWQoKVxyXG4vLyBSZXR1cm5zIGFuIG9iamVjdCBmb3IgYXV0b3NlZWRpbmcsIHVzaW5nIHdpbmRvdy5jcnlwdG8gaWYgYXZhaWxhYmxlLlxyXG4vL1xyXG4vKiogQHBhcmFtIHtVaW50OEFycmF5PX0gc2VlZCAqL1xyXG5mdW5jdGlvbiBhdXRvc2VlZChzZWVkKSB7XHJcbiAgdHJ5IHtcclxuICAgIEdMT0JBTC5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHNlZWQgPSBuZXcgVWludDhBcnJheSh3aWR0aCkpO1xyXG4gICAgcmV0dXJuIHRvc3RyaW5nKHNlZWQpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJldHVybiBbK25ldyBEYXRlLCBHTE9CQUwsIEdMT0JBTC5uYXZpZ2F0b3IgJiYgR0xPQkFMLm5hdmlnYXRvci5wbHVnaW5zLFxyXG4gICAgICAgICAgICBHTE9CQUwuc2NyZWVuLCB0b3N0cmluZyhwb29sKV07XHJcbiAgfVxyXG59XHJcblxyXG4vL1xyXG4vLyB0b3N0cmluZygpXHJcbi8vIENvbnZlcnRzIGFuIGFycmF5IG9mIGNoYXJjb2RlcyB0byBhIHN0cmluZ1xyXG4vL1xyXG5mdW5jdGlvbiB0b3N0cmluZyhhKSB7XHJcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoMCwgYSk7XHJcbn1cclxuXHJcbi8vXHJcbi8vIFdoZW4gc2VlZHJhbmRvbS5qcyBpcyBsb2FkZWQsIHdlIGltbWVkaWF0ZWx5IG1peCBhIGZldyBiaXRzXHJcbi8vIGZyb20gdGhlIGJ1aWx0LWluIFJORyBpbnRvIHRoZSBlbnRyb3B5IHBvb2wuICBCZWNhdXNlIHdlIGRvXHJcbi8vIG5vdCB3YW50IHRvIGludGVmZXJlIHdpdGggZGV0ZXJtaW5zdGljIFBSTkcgc3RhdGUgbGF0ZXIsXHJcbi8vIHNlZWRyYW5kb20gd2lsbCBub3QgY2FsbCBNYXRoLnJhbmRvbSBvbiBpdHMgb3duIGFnYWluIGFmdGVyXHJcbi8vIGluaXRpYWxpemF0aW9uLlxyXG4vL1xyXG5taXhrZXkoTWF0aC5yYW5kb20oKSwgcG9vbCk7XHJcbiIsIi8qXG4gKiBBIGZhc3QgamF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBzaW1wbGV4IG5vaXNlIGJ5IEpvbmFzIFdhZ25lclxuXG5CYXNlZCBvbiBhIHNwZWVkLWltcHJvdmVkIHNpbXBsZXggbm9pc2UgYWxnb3JpdGhtIGZvciAyRCwgM0QgYW5kIDREIGluIEphdmEuXG5XaGljaCBpcyBiYXNlZCBvbiBleGFtcGxlIGNvZGUgYnkgU3RlZmFuIEd1c3RhdnNvbiAoc3RlZ3VAaXRuLmxpdS5zZSkuXG5XaXRoIE9wdGltaXNhdGlvbnMgYnkgUGV0ZXIgRWFzdG1hbiAocGVhc3RtYW5AZHJpenpsZS5zdGFuZm9yZC5lZHUpLlxuQmV0dGVyIHJhbmsgb3JkZXJpbmcgbWV0aG9kIGJ5IFN0ZWZhbiBHdXN0YXZzb24gaW4gMjAxMi5cblxuXG4gQ29weXJpZ2h0IChjKSAyMDE4IEpvbmFzIFdhZ25lclxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gU09GVFdBUkUuXG4gKi9cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBGMiA9IDAuNSAqIChNYXRoLnNxcnQoMy4wKSAtIDEuMCk7XG4gIHZhciBHMiA9ICgzLjAgLSBNYXRoLnNxcnQoMy4wKSkgLyA2LjA7XG4gIHZhciBGMyA9IDEuMCAvIDMuMDtcbiAgdmFyIEczID0gMS4wIC8gNi4wO1xuICB2YXIgRjQgPSAoTWF0aC5zcXJ0KDUuMCkgLSAxLjApIC8gNC4wO1xuICB2YXIgRzQgPSAoNS4wIC0gTWF0aC5zcXJ0KDUuMCkpIC8gMjAuMDtcblxuICBmdW5jdGlvbiBTaW1wbGV4Tm9pc2UocmFuZG9tT3JTZWVkKSB7XG4gICAgdmFyIHJhbmRvbTtcbiAgICBpZiAodHlwZW9mIHJhbmRvbU9yU2VlZCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByYW5kb20gPSByYW5kb21PclNlZWQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHJhbmRvbU9yU2VlZCkge1xuICAgICAgcmFuZG9tID0gYWxlYShyYW5kb21PclNlZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYW5kb20gPSBNYXRoLnJhbmRvbTtcbiAgICB9XG4gICAgdGhpcy5wID0gYnVpbGRQZXJtdXRhdGlvblRhYmxlKHJhbmRvbSk7XG4gICAgdGhpcy5wZXJtID0gbmV3IFVpbnQ4QXJyYXkoNTEyKTtcbiAgICB0aGlzLnBlcm1Nb2QxMiA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1MTI7IGkrKykge1xuICAgICAgdGhpcy5wZXJtW2ldID0gdGhpcy5wW2kgJiAyNTVdO1xuICAgICAgdGhpcy5wZXJtTW9kMTJbaV0gPSB0aGlzLnBlcm1baV0gJSAxMjtcbiAgICB9XG5cbiAgfVxuICBTaW1wbGV4Tm9pc2UucHJvdG90eXBlID0ge1xuICAgIGdyYWQzOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAxLCAwLFxuICAgICAgLTEsIDEsIDAsXG4gICAgICAxLCAtMSwgMCxcblxuICAgICAgLTEsIC0xLCAwLFxuICAgICAgMSwgMCwgMSxcbiAgICAgIC0xLCAwLCAxLFxuXG4gICAgICAxLCAwLCAtMSxcbiAgICAgIC0xLCAwLCAtMSxcbiAgICAgIDAsIDEsIDEsXG5cbiAgICAgIDAsIC0xLCAxLFxuICAgICAgMCwgMSwgLTEsXG4gICAgICAwLCAtMSwgLTFdKSxcbiAgICBncmFkNDogbmV3IEZsb2F0MzJBcnJheShbMCwgMSwgMSwgMSwgMCwgMSwgMSwgLTEsIDAsIDEsIC0xLCAxLCAwLCAxLCAtMSwgLTEsXG4gICAgICAwLCAtMSwgMSwgMSwgMCwgLTEsIDEsIC0xLCAwLCAtMSwgLTEsIDEsIDAsIC0xLCAtMSwgLTEsXG4gICAgICAxLCAwLCAxLCAxLCAxLCAwLCAxLCAtMSwgMSwgMCwgLTEsIDEsIDEsIDAsIC0xLCAtMSxcbiAgICAgIC0xLCAwLCAxLCAxLCAtMSwgMCwgMSwgLTEsIC0xLCAwLCAtMSwgMSwgLTEsIDAsIC0xLCAtMSxcbiAgICAgIDEsIDEsIDAsIDEsIDEsIDEsIDAsIC0xLCAxLCAtMSwgMCwgMSwgMSwgLTEsIDAsIC0xLFxuICAgICAgLTEsIDEsIDAsIDEsIC0xLCAxLCAwLCAtMSwgLTEsIC0xLCAwLCAxLCAtMSwgLTEsIDAsIC0xLFxuICAgICAgMSwgMSwgMSwgMCwgMSwgMSwgLTEsIDAsIDEsIC0xLCAxLCAwLCAxLCAtMSwgLTEsIDAsXG4gICAgICAtMSwgMSwgMSwgMCwgLTEsIDEsIC0xLCAwLCAtMSwgLTEsIDEsIDAsIC0xLCAtMSwgLTEsIDBdKSxcbiAgICBub2lzZTJEOiBmdW5jdGlvbih4aW4sIHlpbikge1xuICAgICAgdmFyIHBlcm1Nb2QxMiA9IHRoaXMucGVybU1vZDEyO1xuICAgICAgdmFyIHBlcm0gPSB0aGlzLnBlcm07XG4gICAgICB2YXIgZ3JhZDMgPSB0aGlzLmdyYWQzO1xuICAgICAgdmFyIG4wID0gMDsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG4gICAgICB2YXIgbjEgPSAwO1xuICAgICAgdmFyIG4yID0gMDtcbiAgICAgIC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cbiAgICAgIHZhciBzID0gKHhpbiArIHlpbikgKiBGMjsgLy8gSGFpcnkgZmFjdG9yIGZvciAyRFxuICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xuICAgICAgdmFyIGogPSBNYXRoLmZsb29yKHlpbiArIHMpO1xuICAgICAgdmFyIHQgPSAoaSArIGopICogRzI7XG4gICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkpIHNwYWNlXG4gICAgICB2YXIgWTAgPSBqIC0gdDtcbiAgICAgIHZhciB4MCA9IHhpbiAtIFgwOyAvLyBUaGUgeCx5IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgdmFyIHkwID0geWluIC0gWTA7XG4gICAgICAvLyBGb3IgdGhlIDJEIGNhc2UsIHRoZSBzaW1wbGV4IHNoYXBlIGlzIGFuIGVxdWlsYXRlcmFsIHRyaWFuZ2xlLlxuICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxuICAgICAgdmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xuICAgICAgaWYgKHgwID4geTApIHtcbiAgICAgICAgaTEgPSAxO1xuICAgICAgICBqMSA9IDA7XG4gICAgICB9IC8vIGxvd2VyIHRyaWFuZ2xlLCBYWSBvcmRlcjogKDAsMCktPigxLDApLT4oMSwxKVxuICAgICAgZWxzZSB7XG4gICAgICAgIGkxID0gMDtcbiAgICAgICAgajEgPSAxO1xuICAgICAgfSAvLyB1cHBlciB0cmlhbmdsZSwgWVggb3JkZXI6ICgwLDApLT4oMCwxKS0+KDEsMSlcbiAgICAgIC8vIEEgc3RlcCBvZiAoMSwwKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKDEtYywtYykgaW4gKHgseSksIGFuZFxuICAgICAgLy8gYSBzdGVwIG9mICgwLDEpIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jKSBpbiAoeCx5KSwgd2hlcmVcbiAgICAgIC8vIGMgPSAoMy1zcXJ0KDMpKS82XG4gICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzI7IC8vIE9mZnNldHMgZm9yIG1pZGRsZSBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXG4gICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzI7XG4gICAgICB2YXIgeDIgPSB4MCAtIDEuMCArIDIuMCAqIEcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgIHZhciB5MiA9IHkwIC0gMS4wICsgMi4wICogRzI7XG4gICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIHRocmVlIHNpbXBsZXggY29ybmVyc1xuICAgICAgdmFyIGlpID0gaSAmIDI1NTtcbiAgICAgIHZhciBqaiA9IGogJiAyNTU7XG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG4gICAgICB2YXIgdDAgPSAwLjUgLSB4MCAqIHgwIC0geTAgKiB5MDtcbiAgICAgIGlmICh0MCA+PSAwKSB7XG4gICAgICAgIHZhciBnaTAgPSBwZXJtTW9kMTJbaWkgKyBwZXJtW2pqXV0gKiAzO1xuICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQzW2dpMF0gKiB4MCArIGdyYWQzW2dpMCArIDFdICogeTApOyAvLyAoeCx5KSBvZiBncmFkMyB1c2VkIGZvciAyRCBncmFkaWVudFxuICAgICAgfVxuICAgICAgdmFyIHQxID0gMC41IC0geDEgKiB4MSAtIHkxICogeTE7XG4gICAgICBpZiAodDEgPj0gMCkge1xuICAgICAgICB2YXIgZ2kxID0gcGVybU1vZDEyW2lpICsgaTEgKyBwZXJtW2pqICsgajFdXSAqIDM7XG4gICAgICAgIHQxICo9IHQxO1xuICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDNbZ2kxXSAqIHgxICsgZ3JhZDNbZ2kxICsgMV0gKiB5MSk7XG4gICAgICB9XG4gICAgICB2YXIgdDIgPSAwLjUgLSB4MiAqIHgyIC0geTIgKiB5MjtcbiAgICAgIGlmICh0MiA+PSAwKSB7XG4gICAgICAgIHZhciBnaTIgPSBwZXJtTW9kMTJbaWkgKyAxICsgcGVybVtqaiArIDFdXSAqIDM7XG4gICAgICAgIHQyICo9IHQyO1xuICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDNbZ2kyXSAqIHgyICsgZ3JhZDNbZ2kyICsgMV0gKiB5Mik7XG4gICAgICB9XG4gICAgICAvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXG4gICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXG4gICAgICByZXR1cm4gNzAuMCAqIChuMCArIG4xICsgbjIpO1xuICAgIH0sXG4gICAgLy8gM0Qgc2ltcGxleCBub2lzZVxuICAgIG5vaXNlM0Q6IGZ1bmN0aW9uKHhpbiwgeWluLCB6aW4pIHtcbiAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMjtcbiAgICAgIHZhciBwZXJtID0gdGhpcy5wZXJtO1xuICAgICAgdmFyIGdyYWQzID0gdGhpcy5ncmFkMztcbiAgICAgIHZhciBuMCwgbjEsIG4yLCBuMzsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSBmb3VyIGNvcm5lcnNcbiAgICAgIC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cbiAgICAgIHZhciBzID0gKHhpbiArIHlpbiArIHppbikgKiBGMzsgLy8gVmVyeSBuaWNlIGFuZCBzaW1wbGUgc2tldyBmYWN0b3IgZm9yIDNEXG4gICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XG4gICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XG4gICAgICB2YXIgayA9IE1hdGguZmxvb3IoemluICsgcyk7XG4gICAgICB2YXIgdCA9IChpICsgaiArIGspICogRzM7XG4gICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseikgc3BhY2VcbiAgICAgIHZhciBZMCA9IGogLSB0O1xuICAgICAgdmFyIFowID0gayAtIHQ7XG4gICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSx6IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgdmFyIHkwID0geWluIC0gWTA7XG4gICAgICB2YXIgejAgPSB6aW4gLSBaMDtcbiAgICAgIC8vIEZvciB0aGUgM0QgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYSBzbGlnaHRseSBpcnJlZ3VsYXIgdGV0cmFoZWRyb24uXG4gICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggc2ltcGxleCB3ZSBhcmUgaW4uXG4gICAgICB2YXIgaTEsIGoxLCBrMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGosaykgY29vcmRzXG4gICAgICB2YXIgaTIsIGoyLCBrMjsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaixrKSBjb29yZHNcbiAgICAgIGlmICh4MCA+PSB5MCkge1xuICAgICAgICBpZiAoeTAgPj0gejApIHtcbiAgICAgICAgICBpMSA9IDE7XG4gICAgICAgICAgajEgPSAwO1xuICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgajIgPSAxO1xuICAgICAgICAgIGsyID0gMDtcbiAgICAgICAgfSAvLyBYIFkgWiBvcmRlclxuICAgICAgICBlbHNlIGlmICh4MCA+PSB6MCkge1xuICAgICAgICAgIGkxID0gMTtcbiAgICAgICAgICBqMSA9IDA7XG4gICAgICAgICAgazEgPSAwO1xuICAgICAgICAgIGkyID0gMTtcbiAgICAgICAgICBqMiA9IDA7XG4gICAgICAgICAgazIgPSAxO1xuICAgICAgICB9IC8vIFggWiBZIG9yZGVyXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICBqMSA9IDA7XG4gICAgICAgICAgazEgPSAxO1xuICAgICAgICAgIGkyID0gMTtcbiAgICAgICAgICBqMiA9IDA7XG4gICAgICAgICAgazIgPSAxO1xuICAgICAgICB9IC8vIFogWCBZIG9yZGVyXG4gICAgICB9XG4gICAgICBlbHNlIHsgLy8geDA8eTBcbiAgICAgICAgaWYgKHkwIDwgejApIHtcbiAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgajEgPSAwO1xuICAgICAgICAgIGsxID0gMTtcbiAgICAgICAgICBpMiA9IDA7XG4gICAgICAgICAgajIgPSAxO1xuICAgICAgICAgIGsyID0gMTtcbiAgICAgICAgfSAvLyBaIFkgWCBvcmRlclxuICAgICAgICBlbHNlIGlmICh4MCA8IHowKSB7XG4gICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgaTIgPSAwO1xuICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICBrMiA9IDE7XG4gICAgICAgIH0gLy8gWSBaIFggb3JkZXJcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgaTIgPSAxO1xuICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICBrMiA9IDA7XG4gICAgICAgIH0gLy8gWSBYIFogb3JkZXJcbiAgICAgIH1cbiAgICAgIC8vIEEgc3RlcCBvZiAoMSwwLDApIGluIChpLGosaykgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMsLWMpIGluICh4LHkseiksXG4gICAgICAvLyBhIHN0ZXAgb2YgKDAsMSwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jLC1jKSBpbiAoeCx5LHopLCBhbmRcbiAgICAgIC8vIGEgc3RlcCBvZiAoMCwwLDEpIGluIChpLGosaykgbWVhbnMgYSBzdGVwIG9mICgtYywtYywxLWMpIGluICh4LHkseiksIHdoZXJlXG4gICAgICAvLyBjID0gMS82LlxuICAgICAgdmFyIHgxID0geDAgLSBpMSArIEczOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseikgY29vcmRzXG4gICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzM7XG4gICAgICB2YXIgejEgPSB6MCAtIGsxICsgRzM7XG4gICAgICB2YXIgeDIgPSB4MCAtIGkyICsgMi4wICogRzM7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xuICAgICAgdmFyIHkyID0geTAgLSBqMiArIDIuMCAqIEczO1xuICAgICAgdmFyIHoyID0gejAgLSBrMiArIDIuMCAqIEczO1xuICAgICAgdmFyIHgzID0geDAgLSAxLjAgKyAzLjAgKiBHMzsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcbiAgICAgIHZhciB5MyA9IHkwIC0gMS4wICsgMy4wICogRzM7XG4gICAgICB2YXIgejMgPSB6MCAtIDEuMCArIDMuMCAqIEczO1xuICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSBmb3VyIHNpbXBsZXggY29ybmVyc1xuICAgICAgdmFyIGlpID0gaSAmIDI1NTtcbiAgICAgIHZhciBqaiA9IGogJiAyNTU7XG4gICAgICB2YXIga2sgPSBrICYgMjU1O1xuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgZm91ciBjb3JuZXJzXG4gICAgICB2YXIgdDAgPSAwLjYgLSB4MCAqIHgwIC0geTAgKiB5MCAtIHowICogejA7XG4gICAgICBpZiAodDAgPCAwKSBuMCA9IDAuMDtcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgZ2kwID0gcGVybU1vZDEyW2lpICsgcGVybVtqaiArIHBlcm1ba2tdXV0gKiAzO1xuICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQzW2dpMF0gKiB4MCArIGdyYWQzW2dpMCArIDFdICogeTAgKyBncmFkM1tnaTAgKyAyXSAqIHowKTtcbiAgICAgIH1cbiAgICAgIHZhciB0MSA9IDAuNiAtIHgxICogeDEgLSB5MSAqIHkxIC0gejEgKiB6MTtcbiAgICAgIGlmICh0MSA8IDApIG4xID0gMC4wO1xuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBnaTEgPSBwZXJtTW9kMTJbaWkgKyBpMSArIHBlcm1bamogKyBqMSArIHBlcm1ba2sgKyBrMV1dXSAqIDM7XG4gICAgICAgIHQxICo9IHQxO1xuICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDNbZ2kxXSAqIHgxICsgZ3JhZDNbZ2kxICsgMV0gKiB5MSArIGdyYWQzW2dpMSArIDJdICogejEpO1xuICAgICAgfVxuICAgICAgdmFyIHQyID0gMC42IC0geDIgKiB4MiAtIHkyICogeTIgLSB6MiAqIHoyO1xuICAgICAgaWYgKHQyIDwgMCkgbjIgPSAwLjA7XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIGdpMiA9IHBlcm1Nb2QxMltpaSArIGkyICsgcGVybVtqaiArIGoyICsgcGVybVtrayArIGsyXV1dICogMztcbiAgICAgICAgdDIgKj0gdDI7XG4gICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkM1tnaTJdICogeDIgKyBncmFkM1tnaTIgKyAxXSAqIHkyICsgZ3JhZDNbZ2kyICsgMl0gKiB6Mik7XG4gICAgICB9XG4gICAgICB2YXIgdDMgPSAwLjYgLSB4MyAqIHgzIC0geTMgKiB5MyAtIHozICogejM7XG4gICAgICBpZiAodDMgPCAwKSBuMyA9IDAuMDtcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgZ2kzID0gcGVybU1vZDEyW2lpICsgMSArIHBlcm1bamogKyAxICsgcGVybVtrayArIDFdXV0gKiAzO1xuICAgICAgICB0MyAqPSB0MztcbiAgICAgICAgbjMgPSB0MyAqIHQzICogKGdyYWQzW2dpM10gKiB4MyArIGdyYWQzW2dpMyArIDFdICogeTMgKyBncmFkM1tnaTMgKyAyXSAqIHozKTtcbiAgICAgIH1cbiAgICAgIC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cbiAgICAgIC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHN0YXkganVzdCBpbnNpZGUgWy0xLDFdXG4gICAgICByZXR1cm4gMzIuMCAqIChuMCArIG4xICsgbjIgKyBuMyk7XG4gICAgfSxcbiAgICAvLyA0RCBzaW1wbGV4IG5vaXNlLCBiZXR0ZXIgc2ltcGxleCByYW5rIG9yZGVyaW5nIG1ldGhvZCAyMDEyLTAzLTA5XG4gICAgbm9pc2U0RDogZnVuY3Rpb24oeCwgeSwgeiwgdykge1xuICAgICAgdmFyIHBlcm0gPSB0aGlzLnBlcm07XG4gICAgICB2YXIgZ3JhZDQgPSB0aGlzLmdyYWQ0O1xuXG4gICAgICB2YXIgbjAsIG4xLCBuMiwgbjMsIG40OyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIGZpdmUgY29ybmVyc1xuICAgICAgLy8gU2tldyB0aGUgKHgseSx6LHcpIHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBjZWxsIG9mIDI0IHNpbXBsaWNlcyB3ZSdyZSBpblxuICAgICAgdmFyIHMgPSAoeCArIHkgKyB6ICsgdykgKiBGNDsgLy8gRmFjdG9yIGZvciA0RCBza2V3aW5nXG4gICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeCArIHMpO1xuICAgICAgdmFyIGogPSBNYXRoLmZsb29yKHkgKyBzKTtcbiAgICAgIHZhciBrID0gTWF0aC5mbG9vcih6ICsgcyk7XG4gICAgICB2YXIgbCA9IE1hdGguZmxvb3IodyArIHMpO1xuICAgICAgdmFyIHQgPSAoaSArIGogKyBrICsgbCkgKiBHNDsgLy8gRmFjdG9yIGZvciA0RCB1bnNrZXdpbmdcbiAgICAgIHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSx6LHcpIHNwYWNlXG4gICAgICB2YXIgWTAgPSBqIC0gdDtcbiAgICAgIHZhciBaMCA9IGsgLSB0O1xuICAgICAgdmFyIFcwID0gbCAtIHQ7XG4gICAgICB2YXIgeDAgPSB4IC0gWDA7IC8vIFRoZSB4LHkseix3IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgdmFyIHkwID0geSAtIFkwO1xuICAgICAgdmFyIHowID0geiAtIFowO1xuICAgICAgdmFyIHcwID0gdyAtIFcwO1xuICAgICAgLy8gRm9yIHRoZSA0RCBjYXNlLCB0aGUgc2ltcGxleCBpcyBhIDREIHNoYXBlIEkgd29uJ3QgZXZlbiB0cnkgdG8gZGVzY3JpYmUuXG4gICAgICAvLyBUbyBmaW5kIG91dCB3aGljaCBvZiB0aGUgMjQgcG9zc2libGUgc2ltcGxpY2VzIHdlJ3JlIGluLCB3ZSBuZWVkIHRvXG4gICAgICAvLyBkZXRlcm1pbmUgdGhlIG1hZ25pdHVkZSBvcmRlcmluZyBvZiB4MCwgeTAsIHowIGFuZCB3MC5cbiAgICAgIC8vIFNpeCBwYWlyLXdpc2UgY29tcGFyaXNvbnMgYXJlIHBlcmZvcm1lZCBiZXR3ZWVuIGVhY2ggcG9zc2libGUgcGFpclxuICAgICAgLy8gb2YgdGhlIGZvdXIgY29vcmRpbmF0ZXMsIGFuZCB0aGUgcmVzdWx0cyBhcmUgdXNlZCB0byByYW5rIHRoZSBudW1iZXJzLlxuICAgICAgdmFyIHJhbmt4ID0gMDtcbiAgICAgIHZhciByYW5reSA9IDA7XG4gICAgICB2YXIgcmFua3ogPSAwO1xuICAgICAgdmFyIHJhbmt3ID0gMDtcbiAgICAgIGlmICh4MCA+IHkwKSByYW5reCsrO1xuICAgICAgZWxzZSByYW5reSsrO1xuICAgICAgaWYgKHgwID4gejApIHJhbmt4Kys7XG4gICAgICBlbHNlIHJhbmt6Kys7XG4gICAgICBpZiAoeDAgPiB3MCkgcmFua3grKztcbiAgICAgIGVsc2UgcmFua3crKztcbiAgICAgIGlmICh5MCA+IHowKSByYW5reSsrO1xuICAgICAgZWxzZSByYW5reisrO1xuICAgICAgaWYgKHkwID4gdzApIHJhbmt5Kys7XG4gICAgICBlbHNlIHJhbmt3Kys7XG4gICAgICBpZiAoejAgPiB3MCkgcmFua3orKztcbiAgICAgIGVsc2UgcmFua3crKztcbiAgICAgIHZhciBpMSwgajEsIGsxLCBsMTsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIHNlY29uZCBzaW1wbGV4IGNvcm5lclxuICAgICAgdmFyIGkyLCBqMiwgazIsIGwyOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgdGhpcmQgc2ltcGxleCBjb3JuZXJcbiAgICAgIHZhciBpMywgajMsIGszLCBsMzsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIGZvdXJ0aCBzaW1wbGV4IGNvcm5lclxuICAgICAgLy8gc2ltcGxleFtjXSBpcyBhIDQtdmVjdG9yIHdpdGggdGhlIG51bWJlcnMgMCwgMSwgMiBhbmQgMyBpbiBzb21lIG9yZGVyLlxuICAgICAgLy8gTWFueSB2YWx1ZXMgb2YgYyB3aWxsIG5ldmVyIG9jY3VyLCBzaW5jZSBlLmcuIHg+eT56PncgbWFrZXMgeDx6LCB5PHcgYW5kIHg8d1xuICAgICAgLy8gaW1wb3NzaWJsZS4gT25seSB0aGUgMjQgaW5kaWNlcyB3aGljaCBoYXZlIG5vbi16ZXJvIGVudHJpZXMgbWFrZSBhbnkgc2Vuc2UuXG4gICAgICAvLyBXZSB1c2UgYSB0aHJlc2hvbGRpbmcgdG8gc2V0IHRoZSBjb29yZGluYXRlcyBpbiB0dXJuIGZyb20gdGhlIGxhcmdlc3QgbWFnbml0dWRlLlxuICAgICAgLy8gUmFuayAzIGRlbm90ZXMgdGhlIGxhcmdlc3QgY29vcmRpbmF0ZS5cbiAgICAgIGkxID0gcmFua3ggPj0gMyA/IDEgOiAwO1xuICAgICAgajEgPSByYW5reSA+PSAzID8gMSA6IDA7XG4gICAgICBrMSA9IHJhbmt6ID49IDMgPyAxIDogMDtcbiAgICAgIGwxID0gcmFua3cgPj0gMyA/IDEgOiAwO1xuICAgICAgLy8gUmFuayAyIGRlbm90ZXMgdGhlIHNlY29uZCBsYXJnZXN0IGNvb3JkaW5hdGUuXG4gICAgICBpMiA9IHJhbmt4ID49IDIgPyAxIDogMDtcbiAgICAgIGoyID0gcmFua3kgPj0gMiA/IDEgOiAwO1xuICAgICAgazIgPSByYW5reiA+PSAyID8gMSA6IDA7XG4gICAgICBsMiA9IHJhbmt3ID49IDIgPyAxIDogMDtcbiAgICAgIC8vIFJhbmsgMSBkZW5vdGVzIHRoZSBzZWNvbmQgc21hbGxlc3QgY29vcmRpbmF0ZS5cbiAgICAgIGkzID0gcmFua3ggPj0gMSA/IDEgOiAwO1xuICAgICAgajMgPSByYW5reSA+PSAxID8gMSA6IDA7XG4gICAgICBrMyA9IHJhbmt6ID49IDEgPyAxIDogMDtcbiAgICAgIGwzID0gcmFua3cgPj0gMSA/IDEgOiAwO1xuICAgICAgLy8gVGhlIGZpZnRoIGNvcm5lciBoYXMgYWxsIGNvb3JkaW5hdGUgb2Zmc2V0cyA9IDEsIHNvIG5vIG5lZWQgdG8gY29tcHV0ZSB0aGF0LlxuICAgICAgdmFyIHgxID0geDAgLSBpMSArIEc0OyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHNDtcbiAgICAgIHZhciB6MSA9IHowIC0gazEgKyBHNDtcbiAgICAgIHZhciB3MSA9IHcwIC0gbDEgKyBHNDtcbiAgICAgIHZhciB4MiA9IHgwIC0gaTIgKyAyLjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgIHZhciB5MiA9IHkwIC0gajIgKyAyLjAgKiBHNDtcbiAgICAgIHZhciB6MiA9IHowIC0gazIgKyAyLjAgKiBHNDtcbiAgICAgIHZhciB3MiA9IHcwIC0gbDIgKyAyLjAgKiBHNDtcbiAgICAgIHZhciB4MyA9IHgwIC0gaTMgKyAzLjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgZm91cnRoIGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICB2YXIgeTMgPSB5MCAtIGozICsgMy4wICogRzQ7XG4gICAgICB2YXIgejMgPSB6MCAtIGszICsgMy4wICogRzQ7XG4gICAgICB2YXIgdzMgPSB3MCAtIGwzICsgMy4wICogRzQ7XG4gICAgICB2YXIgeDQgPSB4MCAtIDEuMCArIDQuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICB2YXIgeTQgPSB5MCAtIDEuMCArIDQuMCAqIEc0O1xuICAgICAgdmFyIHo0ID0gejAgLSAxLjAgKyA0LjAgKiBHNDtcbiAgICAgIHZhciB3NCA9IHcwIC0gMS4wICsgNC4wICogRzQ7XG4gICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIGZpdmUgc2ltcGxleCBjb3JuZXJzXG4gICAgICB2YXIgaWkgPSBpICYgMjU1O1xuICAgICAgdmFyIGpqID0gaiAmIDI1NTtcbiAgICAgIHZhciBrayA9IGsgJiAyNTU7XG4gICAgICB2YXIgbGwgPSBsICYgMjU1O1xuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgZml2ZSBjb3JuZXJzXG4gICAgICB2YXIgdDAgPSAwLjYgLSB4MCAqIHgwIC0geTAgKiB5MCAtIHowICogejAgLSB3MCAqIHcwO1xuICAgICAgaWYgKHQwIDwgMCkgbjAgPSAwLjA7XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIGdpMCA9IChwZXJtW2lpICsgcGVybVtqaiArIHBlcm1ba2sgKyBwZXJtW2xsXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgIHQwICo9IHQwO1xuICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDRbZ2kwXSAqIHgwICsgZ3JhZDRbZ2kwICsgMV0gKiB5MCArIGdyYWQ0W2dpMCArIDJdICogejAgKyBncmFkNFtnaTAgKyAzXSAqIHcwKTtcbiAgICAgIH1cbiAgICAgIHZhciB0MSA9IDAuNiAtIHgxICogeDEgLSB5MSAqIHkxIC0gejEgKiB6MSAtIHcxICogdzE7XG4gICAgICBpZiAodDEgPCAwKSBuMSA9IDAuMDtcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgZ2kxID0gKHBlcm1baWkgKyBpMSArIHBlcm1bamogKyBqMSArIHBlcm1ba2sgKyBrMSArIHBlcm1bbGwgKyBsMV1dXV0gJSAzMikgKiA0O1xuICAgICAgICB0MSAqPSB0MTtcbiAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQ0W2dpMV0gKiB4MSArIGdyYWQ0W2dpMSArIDFdICogeTEgKyBncmFkNFtnaTEgKyAyXSAqIHoxICsgZ3JhZDRbZ2kxICsgM10gKiB3MSk7XG4gICAgICB9XG4gICAgICB2YXIgdDIgPSAwLjYgLSB4MiAqIHgyIC0geTIgKiB5MiAtIHoyICogejIgLSB3MiAqIHcyO1xuICAgICAgaWYgKHQyIDwgMCkgbjIgPSAwLjA7XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIGdpMiA9IChwZXJtW2lpICsgaTIgKyBwZXJtW2pqICsgajIgKyBwZXJtW2trICsgazIgKyBwZXJtW2xsICsgbDJdXV1dICUgMzIpICogNDtcbiAgICAgICAgdDIgKj0gdDI7XG4gICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkNFtnaTJdICogeDIgKyBncmFkNFtnaTIgKyAxXSAqIHkyICsgZ3JhZDRbZ2kyICsgMl0gKiB6MiArIGdyYWQ0W2dpMiArIDNdICogdzIpO1xuICAgICAgfVxuICAgICAgdmFyIHQzID0gMC42IC0geDMgKiB4MyAtIHkzICogeTMgLSB6MyAqIHozIC0gdzMgKiB3MztcbiAgICAgIGlmICh0MyA8IDApIG4zID0gMC4wO1xuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBnaTMgPSAocGVybVtpaSArIGkzICsgcGVybVtqaiArIGozICsgcGVybVtrayArIGszICsgcGVybVtsbCArIGwzXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgIHQzICo9IHQzO1xuICAgICAgICBuMyA9IHQzICogdDMgKiAoZ3JhZDRbZ2kzXSAqIHgzICsgZ3JhZDRbZ2kzICsgMV0gKiB5MyArIGdyYWQ0W2dpMyArIDJdICogejMgKyBncmFkNFtnaTMgKyAzXSAqIHczKTtcbiAgICAgIH1cbiAgICAgIHZhciB0NCA9IDAuNiAtIHg0ICogeDQgLSB5NCAqIHk0IC0gejQgKiB6NCAtIHc0ICogdzQ7XG4gICAgICBpZiAodDQgPCAwKSBuNCA9IDAuMDtcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgZ2k0ID0gKHBlcm1baWkgKyAxICsgcGVybVtqaiArIDEgKyBwZXJtW2trICsgMSArIHBlcm1bbGwgKyAxXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgIHQ0ICo9IHQ0O1xuICAgICAgICBuNCA9IHQ0ICogdDQgKiAoZ3JhZDRbZ2k0XSAqIHg0ICsgZ3JhZDRbZ2k0ICsgMV0gKiB5NCArIGdyYWQ0W2dpNCArIDJdICogejQgKyBncmFkNFtnaTQgKyAzXSAqIHc0KTtcbiAgICAgIH1cbiAgICAgIC8vIFN1bSB1cCBhbmQgc2NhbGUgdGhlIHJlc3VsdCB0byBjb3ZlciB0aGUgcmFuZ2UgWy0xLDFdXG4gICAgICByZXR1cm4gMjcuMCAqIChuMCArIG4xICsgbjIgKyBuMyArIG40KTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gYnVpbGRQZXJtdXRhdGlvblRhYmxlKHJhbmRvbSkge1xuICAgIHZhciBpO1xuICAgIHZhciBwID0gbmV3IFVpbnQ4QXJyYXkoMjU2KTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgIHBbaV0gPSBpO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgMjU1OyBpKyspIHtcbiAgICAgIHZhciByID0gaSArIH5+KHJhbmRvbSgpICogKDI1NiAtIGkpKTtcbiAgICAgIHZhciBhdXggPSBwW2ldO1xuICAgICAgcFtpXSA9IHBbcl07XG4gICAgICBwW3JdID0gYXV4O1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfVxuICBTaW1wbGV4Tm9pc2UuX2J1aWxkUGVybXV0YXRpb25UYWJsZSA9IGJ1aWxkUGVybXV0YXRpb25UYWJsZTtcblxuICBmdW5jdGlvbiBhbGVhKCkge1xuICAgIC8vIEpvaGFubmVzIEJhYWfDuGUgPGJhYWdvZUBiYWFnb2UuY29tPiwgMjAxMFxuICAgIHZhciBzMCA9IDA7XG4gICAgdmFyIHMxID0gMDtcbiAgICB2YXIgczIgPSAwO1xuICAgIHZhciBjID0gMTtcblxuICAgIHZhciBtYXNoID0gbWFzaGVyKCk7XG4gICAgczAgPSBtYXNoKCcgJyk7XG4gICAgczEgPSBtYXNoKCcgJyk7XG4gICAgczIgPSBtYXNoKCcgJyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgczAgLT0gbWFzaChhcmd1bWVudHNbaV0pO1xuICAgICAgaWYgKHMwIDwgMCkge1xuICAgICAgICBzMCArPSAxO1xuICAgICAgfVxuICAgICAgczEgLT0gbWFzaChhcmd1bWVudHNbaV0pO1xuICAgICAgaWYgKHMxIDwgMCkge1xuICAgICAgICBzMSArPSAxO1xuICAgICAgfVxuICAgICAgczIgLT0gbWFzaChhcmd1bWVudHNbaV0pO1xuICAgICAgaWYgKHMyIDwgMCkge1xuICAgICAgICBzMiArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXNoID0gbnVsbDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdCA9IDIwOTE2MzkgKiBzMCArIGMgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuICAgICAgczAgPSBzMTtcbiAgICAgIHMxID0gczI7XG4gICAgICByZXR1cm4gczIgPSB0IC0gKGMgPSB0IHwgMCk7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBtYXNoZXIoKSB7XG4gICAgdmFyIG4gPSAweGVmYzgyNDlkO1xuICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG4gKz0gZGF0YS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB2YXIgaCA9IDAuMDI1MTk2MDMyODI0MTY5MzggKiBuO1xuICAgICAgICBuID0gaCA+Pj4gMDtcbiAgICAgICAgaCAtPSBuO1xuICAgICAgICBoICo9IG47XG4gICAgICAgIG4gPSBoID4+PiAwO1xuICAgICAgICBoIC09IG47XG4gICAgICAgIG4gKz0gaCAqIDB4MTAwMDAwMDAwOyAvLyAyXjMyXG4gICAgICB9XG4gICAgICByZXR1cm4gKG4gPj4+IDApICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcbiAgICB9O1xuICB9XG5cbiAgLy8gYW1kXG4gIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIFNpbXBsZXhOb2lzZTt9KTtcbiAgLy8gY29tbW9uIGpzXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIGV4cG9ydHMuU2ltcGxleE5vaXNlID0gU2ltcGxleE5vaXNlO1xuICAvLyBicm93c2VyXG4gIGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB3aW5kb3cuU2ltcGxleE5vaXNlID0gU2ltcGxleE5vaXNlO1xuICAvLyBub2RlanNcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTaW1wbGV4Tm9pc2U7XG4gIH1cblxufSkoKTtcbiIsImltcG9ydCBjYW52YXNTa2V0Y2ggZnJvbSBcImNhbnZhcy1za2V0Y2hcIjtcbmltcG9ydCBSYW5kb20gZnJvbSBcImNhbnZhcy1za2V0Y2gtdXRpbC9yYW5kb21cIjtcbmltcG9ydCB7IGxpbnNwYWNlIH0gZnJvbSBcImNhbnZhcy1za2V0Y2gtdXRpbC9tYXRoXCI7XG5cbi8vIFlvdSBjYW4gZm9yY2UgYSBzcGVjaWZpYyBzZWVkIGJ5IHJlcGxhY2luZyB0aGlzIHdpdGggYSBzdHJpbmcgdmFsdWVcbmNvbnN0IGRlZmF1bHRTZWVkID0gXCJcIjtcblxuLy8gU2V0IGEgcmFuZG9tIHNlZWQgc28gd2UgY2FuIHJlcHJvZHVjZSB0aGlzIHByaW50IGxhdGVyXG5SYW5kb20uc2V0U2VlZChkZWZhdWx0U2VlZCB8fCBSYW5kb20uZ2V0UmFuZG9tU2VlZCgpKTtcblxuLy8gUHJpbnQgdG8gY29uc29sZSBzbyB3ZSBjYW4gc2VlIHdoaWNoIHNlZWQgaXMgYmVpbmcgdXNlZCBhbmQgY29weSBpdCBpZiBkZXNpcmVkXG5jb25zb2xlLmxvZyhcIlJhbmRvbSBTZWVkOlwiLCBSYW5kb20uZ2V0U2VlZCgpKTtcblxuZnVuY3Rpb24gcGVyYzJjb2xvcihwZXJjKSB7XG4gIHZhciByLFxuICAgIGcsXG4gICAgYiA9IDA7XG4gIGlmIChwZXJjIDwgNTApIHtcbiAgICByID0gMjU1O1xuICAgIGcgPSBNYXRoLnJvdW5kKDUuMSAqIHBlcmMpO1xuICB9IGVsc2Uge1xuICAgIGcgPSAyNTU7XG4gICAgciA9IE1hdGgucm91bmQoNTEwIC0gNS4xICogcGVyYyk7XG4gIH1cbiAgdmFyIGggPSByICogMHgxMDAwMCArIGcgKiAweDEwMCArIGIgKiAweDE7XG4gIHJldHVybiBcIiNcIiArIChcIjAwMDAwMFwiICsgaC50b1N0cmluZygxNikpLnNsaWNlKC02KTtcbn1cblxuY29uc3Qgc2V0dGluZ3MgPSB7XG4gIGhvdGtleXM6IGZhbHNlLFxuICBzdWZmaXg6IFJhbmRvbS5nZXRTZWVkKCksXG4gIGRpbWVuc2lvbnM6IFsxMDAwLCAxMDAwXSxcbn07XG5cbmNvbnN0IHNrZXRjaCA9ICh7IHdpZHRoLCBoZWlnaHQgfSkgPT4ge1xuICBjb25zdCBwYWdlU2l6ZSA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQpO1xuXG4gIC8vIHBhZ2Ugc2V0dGluZ3NcbiAgY29uc3QgbWFyZ2luID0gMDtcbiAgY29uc3QgZ3JpZFNpemUgPSA1MDtcbiAgY29uc3QgYmFja2dyb3VuZCA9IFwiYmxhY2tcIjtcblxuICAvLyBzZWdtZW50IHNldHRpbmdzXG4gIGNvbnN0IGZyZXF1ZW5jeSA9IDAuNzU7XG4gIGNvbnN0IGFscGhhID0gMTtcblxuICAvLyBDcmVhdGUgc29tZSBmbGF0IGRhdGEgc3RydWN0dXJlIHdvcnRoIG9mIHBvaW50c1xuICBjb25zdCBjZWxscyA9IGxpbnNwYWNlKGdyaWRTaXplLCB0cnVlKVxuICAgIC5tYXAoKHYpID0+IHtcbiAgICAgIHJldHVybiBsaW5zcGFjZShncmlkU2l6ZSwgdHJ1ZSkubWFwKCh1KSA9PiB7XG4gICAgICAgIHJldHVybiBbdSwgdl07XG4gICAgICB9KTtcbiAgICB9KVxuICAgIC5mbGF0KCk7XG5cbiAgcmV0dXJuICh7IGNvbnRleHQsIGZyYW1lLCBwbGF5aGVhZCB9KSA9PiB7XG4gICAgLy8gRmlsbCB0aGUgY2FudmFzXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kO1xuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSAxO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAvLyBkcmF3IGdyaWRcbiAgICBjb25zdCBpbm5lclNpemUgPSBwYWdlU2l6ZSAtIG1hcmdpbiAqIDE7XG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY29uc3QgW3UsIHZdID0gY2VsbDtcblxuICAgICAgY29uc3QgbiA9IFJhbmRvbS5ub2lzZTJEKHUgKiAyLCB2ICogMiwgZnJlcXVlbmN5KTtcbiAgICAgIGNvbnN0IHNpemUgPSBNYXRoLmFicyhuKSAqIDE1O1xuXG4gICAgICAvLyBzY2FsZSB0byBpbm5lciBzaXplXG4gICAgICBsZXQgeCA9IHUgKiBpbm5lclNpemU7XG4gICAgICBsZXQgeSA9IHYgKiBpbm5lclNpemU7XG5cbiAgICAgIC8vIGNlbnRlciBvbiBwYWdlXG4gICAgICB4ICs9ICh3aWR0aCAtIGlubmVyU2l6ZSkgLyAyO1xuICAgICAgeSArPSAoaGVpZ2h0IC0gaW5uZXJTaXplKSAvIDI7XG5cbiAgICAgIC8vIGRyYXcgY2VsbFxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IGFscGhhO1xuICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgIGRvdChjb250ZXh0LCB4LCB5LCBzaXplKTtcbiAgICB9KTtcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGRvdChjb250ZXh0LCB4LCB5LCBzaXplKSB7XG4gIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gIGNvbnRleHQuYXJjKHgsIHksIHNpemUsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgY29udGV4dC5zdHJva2UoKTtcbn1cblxuY2FudmFzU2tldGNoKHNrZXRjaCwgc2V0dGluZ3MpO1xuIiwiaW1wb3J0IGNhbnZhc1NrZXRjaCBmcm9tIFwiY2FudmFzLXNrZXRjaFwiO1xuaW1wb3J0IFJhbmRvbSBmcm9tIFwiY2FudmFzLXNrZXRjaC11dGlsL3JhbmRvbVwiO1xuaW1wb3J0IHsgbGluc3BhY2UgfSBmcm9tIFwiY2FudmFzLXNrZXRjaC11dGlsL21hdGhcIjtcblxuY29uc3QgZGVmYXVsdFNlZWQgPSBcIlwiO1xuXG5SYW5kb20uc2V0U2VlZChkZWZhdWx0U2VlZCB8fCBSYW5kb20uZ2V0UmFuZG9tU2VlZCgpKTtcblxuY29uc3Qgc2V0dGluZ3MgPSB7XG4gIGRpbWVuc2lvbnM6IFsyMDQ4LCAyMDQ4XSxcbn07XG5cbmNvbnN0IHBvaW50Q291bnQgPSA0MDtcbmNvbnN0IGxpbmVDb3VudCA9IDEwMDA7XG5jb25zdCBmcmVxdWVuY3kgPSAwLjc1O1xuY29uc3QgYW1wbGl0dWRlID0gMTgwO1xuXG5jb25zdCBza2V0Y2ggPSAoeyB3aWR0aCwgaGVpZ2h0IH0pID0+IHtcbiAgcmV0dXJuICh7IGNvbnRleHQgfSkgPT4ge1xuICAgIGNvbnN0IHBvaW50cyA9IGxpbnNwYWNlKHBvaW50Q291bnQsIHRydWUpLm1hcCgodSkgPT4ge1xuICAgICAgcmV0dXJuIGxpbnNwYWNlKGxpbmVDb3VudCwgdHJ1ZSkubWFwKCh2KSA9PiB7XG4gICAgICAgIGNvbnN0IG4gPSBSYW5kb20ubm9pc2UyRCh1ICogMiwgdiAqIDIsIGZyZXF1ZW5jeSwgYW1wbGl0dWRlKTtcbiAgICAgICAgY29uc3QgeCA9IHUgKiAod2lkdGggLyAyKSArIG4gKyB3aWR0aCAvIDQ7XG4gICAgICAgIGNvbnN0IHkgPSB2ICogaGVpZ2h0O1xuXG4gICAgICAgIHJldHVybiBbeCwgeSwgbl07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJibGFja1wiO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgY29udGV4dC5saW5lQ2FwID0gXCJyb3VuZFwiO1xuICAgIGNvbnRleHQubGluZUpvaW4gPSBcInJvdW5kXCI7XG5cbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IFwiNFwiO1xuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XG5cbiAgICBwb2ludHMubWFwKChsaW5lKSA9PiB7XG4gICAgICBsaW5lLm1hcCgoW3gsIHksIG5dLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAobGluZVtpbmRleCAtIDFdKSB7XG4gICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhsaW5lW2luZGV4IC0gMV1bMF0sIGxpbmVbaW5kZXggLSAxXVsxXSk7XG4gICAgICAgICAgY29udGV4dC5saW5lVG8oeCwgeSk7XG4gICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGBoc2woJHtNYXRoLmFicyhcbiAgICAgICAgICAgIChuIC8gYW1wbGl0dWRlKSAqIDM2MFxuICAgICAgICAgICl9LCA4MCUsICR7TWF0aC5hYnMoKG4gLyAyMDApICogMTAwKX0lKWA7XG4gICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59O1xuXG5jYW52YXNTa2V0Y2goc2tldGNoLCBzZXR0aW5ncyk7XG4iLCJpbXBvcnQgY2FudmFzU2tldGNoIGZyb20gXCJjYW52YXMtc2tldGNoXCI7XG5pbXBvcnQgUmFuZG9tIGZyb20gXCJjYW52YXMtc2tldGNoLXV0aWwvcmFuZG9tXCI7XG5pbXBvcnQgeyBsaW5zcGFjZSB9IGZyb20gXCJjYW52YXMtc2tldGNoLXV0aWwvbWF0aFwiO1xuXG4vLyBZb3UgY2FuIGZvcmNlIGEgc3BlY2lmaWMgc2VlZCBieSByZXBsYWNpbmcgdGhpcyB3aXRoIGEgc3RyaW5nIHZhbHVlXG5jb25zdCBkZWZhdWx0U2VlZCA9IFwiXCI7XG5cbi8vIFNldCBhIHJhbmRvbSBzZWVkIHNvIHdlIGNhbiByZXByb2R1Y2UgdGhpcyBwcmludCBsYXRlclxuUmFuZG9tLnNldFNlZWQoZGVmYXVsdFNlZWQgfHwgUmFuZG9tLmdldFJhbmRvbVNlZWQoKSk7XG5cbi8vIFByaW50IHRvIGNvbnNvbGUgc28gd2UgY2FuIHNlZSB3aGljaCBzZWVkIGlzIGJlaW5nIHVzZWQgYW5kIGNvcHkgaXQgaWYgZGVzaXJlZFxuY29uc29sZS5sb2coXCJSYW5kb20gU2VlZDpcIiwgUmFuZG9tLmdldFNlZWQoKSk7XG5cbmNvbnN0IHNldHRpbmdzID0ge1xuICBob3RrZXlzOiBmYWxzZSxcbiAgc3VmZml4OiBSYW5kb20uZ2V0U2VlZCgpLFxuICBhbmltYXRlOiB0cnVlLFxuICBkdXJhdGlvbjogNSxcbiAgZGltZW5zaW9uczogWzEwMDAsIDEwMDBdLFxuICBmcHM6IDMwLFxufTtcblxuY29uc3Qgc2tldGNoID0gKHsgd2lkdGgsIGhlaWdodCB9KSA9PiB7XG4gIGNvbnN0IHBhZ2VTaXplID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCk7XG5cbiAgLy8gcGFnZSBzZXR0aW5nc1xuICBjb25zdCBtYXJnaW4gPSAwO1xuICBjb25zdCBncmlkU2l6ZSA9IDUwO1xuICBjb25zdCBiYWNrZ3JvdW5kID0gXCJibGFja1wiO1xuXG4gIC8vIHNlZ21lbnQgc2V0dGluZ3NcbiAgY29uc3QgbGVuZ3RoID0gcGFnZVNpemUgKiAwLjE7XG4gIGNvbnN0IGxpbmVXaWR0aCA9IHBhZ2VTaXplICogMC4wMDE3NTtcbiAgY29uc3QgZnJlcXVlbmN5ID0gMC43NTtcbiAgY29uc3QgYWxwaGEgPSAxO1xuXG4gIC8vIENyZWF0ZSBzb21lIGZsYXQgZGF0YSBzdHJ1Y3R1cmUgd29ydGggb2YgcG9pbnRzXG4gIGNvbnN0IGNlbGxzID0gbGluc3BhY2UoZ3JpZFNpemUsIHRydWUpXG4gICAgLm1hcCgodikgPT4ge1xuICAgICAgcmV0dXJuIGxpbnNwYWNlKGdyaWRTaXplLCB0cnVlKS5tYXAoKHUpID0+IHtcbiAgICAgICAgcmV0dXJuIFt1LCB2XTtcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgLmZsYXQoKTtcblxuICByZXR1cm4gKHsgY29udGV4dCwgZnJhbWUsIHBsYXloZWFkIH0pID0+IHtcbiAgICAvLyBGaWxsIHRoZSBjYW52YXNcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGJhY2tncm91bmQ7XG4gICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IDE7XG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIC8vIGRyYXcgZ3JpZFxuICAgIGNvbnN0IGlubmVyU2l6ZSA9IHBhZ2VTaXplIC0gbWFyZ2luICogMTtcbiAgICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjb25zdCBbdSwgdl0gPSBjZWxsO1xuXG4gICAgICAvLyBzY2FsZSB0byBpbm5lciBzaXplXG4gICAgICBsZXQgeCA9IHUgKiBpbm5lclNpemU7XG4gICAgICBsZXQgeSA9IHYgKiBpbm5lclNpemU7XG5cbiAgICAgIC8vIGNlbnRlciBvbiBwYWdlXG4gICAgICB4ICs9ICh3aWR0aCAtIGlubmVyU2l6ZSkgLyAyO1xuICAgICAgeSArPSAoaGVpZ2h0IC0gaW5uZXJTaXplKSAvIDI7XG5cbiAgICAgIC8vIGdldCBhIHJhbmRvbSBhbmdsZSBmcm9tIG5vaXNlXG4gICAgICBjb25zdCBuID0gUmFuZG9tLm5vaXNlMkQodSAqIDIgLSAxLCB2ICogMiAtIDEsIGZyZXF1ZW5jeSk7XG4gICAgICAvLyBjb25zdCBhbmdsZSA9IG4gKiBNYXRoLlBJICogMjtcbiAgICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5QSSAqIHBsYXloZWFkICsgbiAqIDU7XG5cbiAgICAgIC8vIGRyYXcgY2VsbFxuICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IGFscGhhO1xuICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9XG4gICAgICAgIG4gPCAwLjEgPyBcInRyYW5zcGFyZW50XCIgOiBgaHNsKDQwLCAxMDAlLCAke24gKiAxMDB9JSlgO1xuXG4gICAgICBzZWdtZW50KGNvbnRleHQsIHgsIHksIGFuZ2xlLCBsZW5ndGgsIGxpbmVXaWR0aCk7XG4gICAgfSk7XG4gIH07XG59O1xuXG5mdW5jdGlvbiBzZWdtZW50KGNvbnRleHQsIHgsIHksIGFuZ2xlID0gMCwgbGVuZ3RoID0gMSwgbGluZVdpZHRoID0gMSkge1xuICBjb25zdCBoYWxmTGVuZ3RoID0gbGVuZ3RoIC8gMjtcbiAgY29uc3QgdSA9IE1hdGguY29zKGFuZ2xlKSAqIGhhbGZMZW5ndGg7XG4gIGNvbnN0IHYgPSBNYXRoLnNpbihhbmdsZSkgKiBoYWxmTGVuZ3RoO1xuXG4gIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gIGNvbnRleHQubW92ZVRvKHggLSB1LCB5IC0gdik7XG4gIGNvbnRleHQubGluZVRvKHggKyB1LCB5ICsgdik7XG4gIGNvbnRleHQubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICBjb250ZXh0LnN0cm9rZSgpO1xufVxuXG5jYW52YXNTa2V0Y2goc2tldGNoLCBzZXR0aW5ncyk7XG4iLCJ2YXIgbWFwID0ge1xuXHRcIi4vZG90cy5qc1wiOiBcIi4vc3JjL3NrZXRjaGVzL2RvdHMuanNcIixcblx0XCIuL2xpbmVzLmpzXCI6IFwiLi9zcmMvc2tldGNoZXMvbGluZXMuanNcIixcblx0XCIuL3dhdmVzLmpzXCI6IFwiLi9zcmMvc2tldGNoZXMvd2F2ZXMuanNcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvc2tldGNoZXMgc3luYyByZWN1cnNpdmUgXFxcXC5qcyRcIjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiZnVuY3Rpb24gcmVxdWlyZUFsbChyKSB7XG4gIHIua2V5cygpLmZvckVhY2gocik7XG59XG5cbmNvbnN0IGFwcCA9IHtcbiAgaW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmZpbGVzKTtcbiAgfSxcbiAgZmlsZXM6IHJlcXVpcmVBbGwocmVxdWlyZS5jb250ZXh0KFwiLi9za2V0Y2hlcy9cIiwgdHJ1ZSwgL1xcLmpzJC8pKSxcbn07XG5cbmFwcC5pbml0KCk7XG4iXSwic291cmNlUm9vdCI6IiJ9