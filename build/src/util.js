"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stringify = require("json-stable-stringify");
var vega_util_1 = require("vega-util");
var logical_1 = require("./logical");
var vega_util_2 = require("vega-util");
exports.isArray = vega_util_2.isArray;
exports.isObject = vega_util_2.isObject;
exports.isNumber = vega_util_2.isNumber;
exports.isString = vega_util_2.isString;
exports.truncate = vega_util_2.truncate;
exports.toSet = vega_util_2.toSet;
exports.stringValue = vega_util_2.stringValue;
/**
 * Creates an object composed of the picked object properties.
 *
 * Example:  (from lodash)
 *
 * var object = {'a': 1, 'b': '2', 'c': 3};
 * pick(object, ['a', 'c']);
 * // → {'a': 1, 'c': 3}
 *
 */
function pick(obj, props) {
    var copy = {};
    props.forEach(function (prop) {
        if (obj.hasOwnProperty(prop)) {
            copy[prop] = obj[prop];
        }
    });
    return copy;
}
exports.pick = pick;
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
function omit(obj, props) {
    var copy = duplicate(obj);
    props.forEach(function (prop) {
        delete copy[prop];
    });
    return copy;
}
exports.omit = omit;
function hash(a) {
    if (vega_util_1.isString(a) || vega_util_1.isNumber(a) || isBoolean(a)) {
        return String(a);
    }
    return stringify(a);
}
exports.hash = hash;
function contains(array, item) {
    return array.indexOf(item) > -1;
}
exports.contains = contains;
/** Returns the array without the elements in item */
function without(array, excludedItems) {
    return array.filter(function (item) { return !contains(excludedItems, item); });
}
exports.without = without;
function union(array, other) {
    return array.concat(without(other, array));
}
exports.union = union;
/**
 * Returns true if any item returns true.
 */
function some(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
exports.some = some;
/**
 * Returns true if all items return true.
 */
function every(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
function flatten(arrays) {
    return [].concat.apply([], arrays);
}
exports.flatten = flatten;
/**
 * recursively merges src into dest
 */
function mergeDeep(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    for (var _a = 0, src_1 = src; _a < src_1.length; _a++) {
        var s = src_1[_a];
        dest = deepMerge_(dest, s);
    }
    return dest;
}
exports.mergeDeep = mergeDeep;
// recursively merges src into dest
function deepMerge_(dest, src) {
    if (typeof src !== 'object' || src === null) {
        return dest;
    }
    for (var p in src) {
        if (!src.hasOwnProperty(p)) {
            continue;
        }
        if (src[p] === undefined) {
            continue;
        }
        if (typeof src[p] !== 'object' || vega_util_1.isArray(src[p]) || src[p] === null) {
            dest[p] = src[p];
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = mergeDeep(vega_util_1.isArray(src[p].constructor) ? [] : {}, src[p]);
        }
        else {
            mergeDeep(dest[p], src[p]);
        }
    }
    return dest;
}
function unique(values, f) {
    var results = [];
    var u = {};
    var v;
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var val = values_1[_i];
        v = f(val);
        if (v in u) {
            continue;
        }
        u[v] = 1;
        results.push(val);
    }
    return results;
}
exports.unique = unique;
/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
function differ(dict, other) {
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            if (other[key] && dict[key] && other[key] !== dict[key]) {
                return true;
            }
        }
    }
    return false;
}
exports.differ = differ;
function hasIntersection(a, b) {
    for (var key in a) {
        if (key in b) {
            return true;
        }
    }
    return false;
}
exports.hasIntersection = hasIntersection;
function differArray(array, other) {
    if (array.length !== other.length) {
        return true;
    }
    array.sort();
    other.sort();
    for (var i = 0; i < array.length; i++) {
        if (other[i] !== array[i]) {
            return true;
        }
    }
    return false;
}
exports.differArray = differArray;
exports.keys = Object.keys;
function vals(x) {
    var _vals = [];
    for (var k in x) {
        if (x.hasOwnProperty(k)) {
            _vals.push(x[k]);
        }
    }
    return _vals;
}
exports.vals = vals;
function flagKeys(f) {
    return exports.keys(f);
}
exports.flagKeys = flagKeys;
function duplicate(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.duplicate = duplicate;
function isBoolean(b) {
    return b === true || b === false;
}
exports.isBoolean = isBoolean;
/**
 * Convert a string into a valid variable name
 */
function varName(s) {
    // Replace non-alphanumeric characters (anything besides a-zA-Z0-9_) with _
    var alphanumericS = s.replace(/\W/g, '_');
    // Add _ if the string has leading numbers.
    return (s.match(/^\d+/) ? '_' : '') + alphanumericS;
}
exports.varName = varName;
function logicalExpr(op, cb) {
    if (logical_1.isLogicalNot(op)) {
        return '!(' + logicalExpr(op.not, cb) + ')';
    }
    else if (logical_1.isLogicalAnd(op)) {
        return '(' + op.and.map(function (and) { return logicalExpr(and, cb); }).join(') && (') + ')';
    }
    else if (logical_1.isLogicalOr(op)) {
        return '(' + op.or.map(function (or) { return logicalExpr(or, cb); }).join(') || (') + ')';
    }
    else {
        return cb(op);
    }
}
exports.logicalExpr = logicalExpr;
/**
 * Delete nested property of an object, and delete the ancestors of the property if they become empty.
 */
function deleteNestedProperty(obj, orderedProps) {
    var isEmpty = true;
    while (orderedProps.length > 0 && isEmpty) {
        var o = obj;
        for (var i = 0; i < orderedProps.length - 1; i++) {
            o = o[orderedProps[i]];
        }
        delete o[orderedProps.pop()];
        if (exports.keys(o).length !== 0) {
            isEmpty = false;
        }
    }
}
exports.deleteNestedProperty = deleteNestedProperty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQW1EO0FBQ25ELHVDQUFzRDtBQUN0RCxxQ0FBa0Y7QUFHbEYsdUNBQThGO0FBQXRGLDhCQUFBLE9BQU8sQ0FBQTtBQUFFLCtCQUFBLFFBQVEsQ0FBQTtBQUFFLCtCQUFBLFFBQVEsQ0FBQTtBQUFFLCtCQUFBLFFBQVEsQ0FBQTtBQUFFLCtCQUFBLFFBQVEsQ0FBQTtBQUFFLDRCQUFBLEtBQUssQ0FBQTtBQUFFLGtDQUFBLFdBQVcsQ0FBQTtBQUUzRTs7Ozs7Ozs7O0dBU0c7QUFDSCxjQUFxQixHQUFXLEVBQUUsS0FBZTtJQUMvQyxJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7UUFDakIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVJELG9CQVFDO0FBRUQ7OztHQUdHO0FBQ0gsY0FBcUIsR0FBVyxFQUFFLEtBQWU7SUFDL0MsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFORCxvQkFNQztBQUVELGNBQXFCLENBQU07SUFDekIsRUFBRSxDQUFDLENBQUMsb0JBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxv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