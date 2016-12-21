"use strict";
var parse_1 = require("./parse");
var objectAssign = require("object-assign");
function extractParseAttributes(object) {
    if (!(object instanceof parse_1.default.Object)) {
        return object;
    }
    var attributes = object.toJSON();
    var result = {};
    objectAssign(result, { id: object.objectId }, attributes);
    Object.keys(attributes).forEach(function (key) {
        if (result[key] && result[key].length && result[key] instanceof Array) {
            result[key] = result[key].map(function (o) { return extractParseAttributes(o); });
        }
        if (result[key] instanceof parse_1.default.Object && key != 'rawParseObject') {
            var parseObject = result[key];
            result[key] = extractParseAttributes(result[key]);
            result[key].rawParseObject = parseObject;
        }
        if (result[key] instanceof parse_1.default.GeoPoint
            || (result[key] && result[key].__type == "GeoPoint")) {
            result[key] = {
                lat: result[key].latitude,
                lng: result[key].longitude
            };
        }
    });
    result['rawParseObject'] = object;
    return result;
}
exports.extractParseAttributes = extractParseAttributes;
function unsetRawParseObjects(object) {
    if (!(object instanceof parse_1.default.Object)) {
        return object;
    }
    object.unset('rawParseObject');
    Object.keys(object.attributes).forEach(function (key) {
        if (object.get(key) instanceof Array) {
            var items = object.get(key);
            object.set(key, []);
            items.forEach(function (o) {
                unsetRawParseObjects(o);
                object.add(key, o);
            });
        }
        if (object.get(key) && object.get(key).rawParseObject) {
            object.set(key, object.get(key).rawParseObject);
            unsetRawParseObjects(object.get(key));
        }
    });
}
exports.unsetRawParseObjects = unsetRawParseObjects;
