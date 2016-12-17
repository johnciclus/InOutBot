"use strict";
var parse_1 = require("../parse");
var index_1 = require("../actions/index");
var Consumer = parse_1.default.Object.extend('Consumer', {
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
    setUser: function (user) {
        this.set('name', user.get('first_name') + " " + user.get('last_name'));
        this.set('email', user.get('email'));
        this.set('user', {
            __type: "Pointer",
            className: "_User",
            objectId: user.id
        });
    },
    setEmail: function (email) {
        this.set('email', email);
        this.save();
    },
    setPhone: function (phone) {
        this.set('phone', phone);
        this.save();
    },
    saveInStore: function (store, recipientId) {
        return store.dispatch(index_1.setConsumer(recipientId, this)).fail(function (error) {
            console.log('Error code: ' + error.message);
        });
    }
}, {
    loadInStore: function (store, recipientId, user) {
        return store.dispatch(index_1.loadConsumer(recipientId, user)).fail(function (error) {
            console.log('Error code: ' + error.message);
        });
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Consumer;
