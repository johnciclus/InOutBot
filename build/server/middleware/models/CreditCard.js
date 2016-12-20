"use strict";
var parse_1 = require("../parse");
var index_1 = require("../actions/index");
var CreditCard = parse_1.default.Object.extend('CreditCard', {
    initialize: function (attrs, options) {
    }
}, {
    loadInStore: function (store, recipientId, user) {
        return store.dispatch(index_1.loadUserCreditCards(recipientId, user.rawParseObject)).fail(function (error) {
            console.log('Error code: ' + error.message);
        });
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreditCard;
