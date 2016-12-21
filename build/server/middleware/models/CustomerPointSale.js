"use strict";
var parse_1 = require("../parse");
var index_1 = require("../actions/index");
var CustomerPointSale = parse_1.default.Object.extend('CustomerPointSale', {
    initialize: function (attrs, options) {
    }
}, {
    setCustomerPointSale: function (store, recipientId, id) {
        return store.dispatch(index_1.setCustomerPointSale(recipientId, id));
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomerPointSale;
