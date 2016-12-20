"use strict";
var parse_1 = require("../parse");
var index_1 = require("../actions/index");
var Customer = parse_1.default.Object.extend('Customer', {
    initialize: function (attrs, options) {
        /*let user = attrs.user;
         console.log('Consumer user param');
         console.log(user);
         this.set('name', user.get('first_name')+" "+user.get('last_name'));
         this.set('user', {
         __type: "Pointer",
         className: "User",
         objectId: user.id
         });
         console.log(this.get('user'))*/
    },
    saveInStore: function (store, recipientId) {
        return store.dispatch(index_1.setCustomer(recipientId, this)).fail(function (error) {
            console.log('Error code: ' + error.message);
        });
    }
}, {
    loadInStore: function (store, recipientId, BUSINESS_ID) {
        return store.dispatch(index_1.loadCustomer(recipientId, BUSINESS_ID));
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Customer;
