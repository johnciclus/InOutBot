"use strict";
var parse_1 = require("../parse");
var index_1 = require("../actions/index");
var Order = parse_1.default.Object.extend('Order', {
    initialize: function (attrs, options) {
    }
}, {
    setOrder: function (store, recipientId, id) {
        return store.dispatch(index_1.setOrder(recipientId, id));
    },
    setOrders: function (store, recipientId, orders) {
        return store.dispatch(index_1.setOrders(recipientId, orders));
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Order;
