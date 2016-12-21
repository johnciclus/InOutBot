"use strict";
var parse_1 = require("../parse");
var index_1 = require("../actions/index");
var Consumer_1 = require("./Consumer");
var rp = require("request-promise");
var config = require("config");
var objectAssign = require("object-assign");
var FACEBOOK_GRAPH = config.get('FACEBOOK_GRAPH');
var User = parse_1.default.Object.extend('User', {
    initialize: function (attrs, options) {
        //console.log('new user');
        //console.log();
        //console.log(options);
    },
    signUpWithFacebookData: function (data) {
        var facebookId = this.get('facebookId');
        return this.signUp(objectAssign(data, {
            username: facebookId.toString(),
            password: facebookId.toString()
        })).fail(function (error) {
            console.log('Error code: ' + error.message);
        });
    },
    registered: function () {
        return new parse_1.default.Query('User').equalTo('facebookId', this.get('facebookId')).first().fail(function (error) {
            console.log('Error code: ' + error.message);
        });
    },
    createConsumer: function (store, recipientId, senderId, conversationToken) {
        var consumer = new Consumer_1.default({ recipientId: parseInt(recipientId), senderId: parseInt(senderId), conversationToken: conversationToken });
        consumer.setUser(this);
        return consumer.save().then(function () {
            return consumer.saveInStore(store, recipientId);
        });
    },
    saveInStore: function (store, recipientId) {
        return store.dispatch(index_1.setUser(recipientId, this)).fail(function (error) {
            console.log('Error code: ' + error.message);
        });
    }
}, {
    loadInStore: function (store, recipientId) {
        return store.dispatch(index_1.loadUser(recipientId)).fail(function (error) {
            console.log('Error code: ' + error.message);
        });
    },
    getFacebookUserData: function (facebookId, conversationToken) {
        console.log('getFacebookUserData');
        return rp({
            uri: FACEBOOK_GRAPH + facebookId,
            qs: { access_token: conversationToken, fields: 'first_name,last_name,locale,timezone,gender' },
            method: 'GET'
        }).then(function (body) {
            return JSON.parse(body);
        }).catch(function (error) {
            console.log('error');
            console.log(error);
        });
    },
    createUser: function (store, recipientId, facebookId, conversationToken) {
        console.log('createUser');
        var user = new User({ facebookId: parseInt(facebookId) });
        console.log(user);
        return User.getFacebookUserData(facebookId, conversationToken).then(function (data) {
            delete data.id;
            console.log(data);
            return user.signUpWithFacebookData(data).then(function () {
                return user.saveInStore(store, recipientId);
            });
        });
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = User;
