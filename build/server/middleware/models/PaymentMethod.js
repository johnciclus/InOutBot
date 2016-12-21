"use strict";
var parse_1 = require("../parse");
var index_1 = require("../actions/index");
var PaymentMethod = parse_1.default.Object.extend('PaymentMethod', {
    initialize: function (attrs, options) {
    }
}, {
    loadInStore: function (store, recipientId, senderId) {
        return store.dispatch(index_1.loadPaymentMethods(recipientId, senderId));
    },
    setPaymentMethod: function (store, recipientId, senderId) {
        return store.dispatch(index_1.setPaymentMethod(recipientId, senderId));
    },
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaymentMethod;
