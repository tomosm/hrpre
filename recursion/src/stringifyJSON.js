// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here
  var stringifyObject = function (obj) {
    var str = "";
    for (var key in obj) {
      var string = stringify(obj[key]);
      if (string !== undefined) str += (",\"" + key + "\":" + string);
    }
    return "{" + str.slice(1) + "}";
  }

  var stringifyArray = function (array) {
    var str = "";
    for (var i = 0, l = array.length; i < l; i++) {
      var string = stringify(array[i]);
      if (string !== undefined) str += ("," + string);
    }
    return "[" + str.slice(1) + "]";
  }

  var stringifyFunction = function (func) {
    return undefined;
  }

  var stringifyString = function (val) {
    return "\"" + val + "\"";
  }

  var stringifyOthers = function (val) {
    if (isString(val)) return stringifyString(val);
    return String(val);
  }

  var isString = function (val) {
    return typeof val === "string";
  }

  var isFunction = function (val) {
    return typeof val === "function";
  }

  var isObject = function (val) {
    return val !== null && typeof val === "object";
  }

  var stringify = function (val) {
    if (val === undefined || isFunction(val)) {
      return undefined;
    }

    if (Array.isArray(val)) {
      return stringifyArray(val);
    } else if (isObject(val)) {
      return stringifyObject(val);
    } else if (isString(val)) {
      return stringifyString(val);
    } else {
      return stringifyOthers(val);
    }
  }

  return stringify(obj);
};
