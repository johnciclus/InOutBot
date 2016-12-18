"use strict";
/* @flow */
var LatLng = (function () {
    function LatLng(lat, lng) {
        this.lat = 0;
        this.lng = 0;
        this.lat = lat;
        this.lng = lng;
    }
    LatLng.prototype.isValid = function () {
        return (this.lat != null && this.lat !== 0 && this.lng != null && this.lng !== 0);
    };
    return LatLng;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LatLng;
