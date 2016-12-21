/* @flow */
"use strict";
var GetProductsParams = (function () {
    function GetProductsParams(businessId) {
        this.businessId = 0;
        this.lat = 0;
        this.lng = 0;
        this.category = '';
        this.pointSale = '';
        this.businessId = businessId;
    }
    return GetProductsParams;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GetProductsParams;
