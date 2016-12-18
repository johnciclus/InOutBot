"use strict";
var parse_1 = require("../parse");
var index_1 = require("../actions/index");
var ConsumerAddress = parse_1.default.Object.extend('ConsumerAddress', {
    initialize: function (attrs, options) {
        /*
         id = '';
         location = new LatLng(0, 0);
         address = '';
         description = '';
         name = '';
         consumer = {};
    
         set location(value) {
         this._location = new LatLng(value.lat, value.lng)
         }
    
         get location () { return this._location }
    
         super('ConsumerAddress', attributes, options);
         if (attributes && attributes.location)  {
         this.location = new LatLng(attributes.location.lat, attributes.location.lat)
         }
         * */
    }
}, {
    loadInStore: function (store, recipientId, consumer) {
        return store.dispatch(index_1.loadConsumerAddresses(recipientId, consumer.rawParseObject));
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConsumerAddress;
