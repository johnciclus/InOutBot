"use strict";
var redux_1 = require("redux");
var redux_thunk_1 = require("redux-thunk");
var store;
function createLocalStore(reducer) {
    store = redux_1.createStore(reducer, redux_1.applyMiddleware(redux_thunk_1.default));
    store.subscribe(function () {
        return console.log('\n');
    });
}
exports.createLocalStore = createLocalStore;
function getData(recipientId, property) {
    if (typeof recipientId !== 'undefined' && typeof store !== 'undefined' && typeof store.getState() !== 'undefined') {
        var state = store.getState();
        var data = state.userData;
        var userData = data[recipientId];
        if (typeof userData == 'undefined') {
            data[recipientId] = {};
            userData = data[recipientId];
        }
        if (typeof property == 'undefined')
            return userData;
        else {
            if (userData.hasOwnProperty(property)) {
                return userData[property];
            }
            else
                return undefined;
        }
    }
    else
        return undefined;
}
exports.getData = getData;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = store;
