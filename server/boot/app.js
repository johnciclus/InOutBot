"use strict";
var bot = require("../middleware/bot");
var bodyParser = require("body-parser");
var localStore_1 = require("../middleware/localStore");
function app(server) {
    var router = server.loopback.Router();
    router.get('/webhook', bot.verifyToken);
    router.get('/authorize', bot.authorize);
    router.post('/webhook', bot.router);
    server.use(bodyParser.json({ verify: bot.verifyRequestSignature }));
    server.use(router);
}
exports.app = app;
;
bot.rules.set('hola', sendTest);
bot.payloadRules.set('Search', searchProducts);
function authentication(recipientId, senderId) {
    return getCustomer(recipientId, senderId).then(function (customer) {
        return getUser(recipientId).then(function (user) {
            if (typeof user == 'undefined') {
                return User.createUser(store, recipientId, recipientId, customer.fanpageToken).then(function () {
                    var userObject = localStore_1.getData(recipientId, 'user');
                    var user = userObject.rawParseObject;
                    return user.createConsumer(store, recipientId, senderId, customer.fanpageToken).then(function (consumer) {
                        return new Promise(function (resolve, reject) {
                            resolve(userObject);
                        });
                    });
                });
            }
            else {
                return getConsumer(recipientId, user.rawParseObject).then(function (consumer) {
                    return new Promise(function (resolve, reject) {
                        resolve(user);
                    });
                });
            }
        });
    });
}
function getCustomer(recipientId, senderId) {
    var customer = localStore_1.getData(recipientId, 'customer');
    if (typeof customer == 'undefined') {
        return Actions.getCustomerByFanpage(senderId).then(function (customer) {
            return Customer.loadInStore(store, recipientId, customer.businessId).then(function () {
                return localStore_1.getData(recipientId, 'customer');
            });
        });
    }
    else {
        return new Promise(function (resolve, reject) {
            resolve(customer);
        });
    }
}
function getUser(recipientId) {
    var userObj = localStore_1.getData(recipientId, 'user');
    if (typeof userObj == 'undefined') {
        return User.loadInStore(store, recipientId).then(function () {
            return localStore_1.getData(recipientId, 'user');
        });
    }
    else {
        return new Promise(function (resolve, reject) {
            resolve(userObj);
        });
    }
}
function getConsumer(recipientId, user) {
    var consumerObj = localStore_1.getData(recipientId, 'consumer');
    if (typeof consumerObj == 'undefined') {
        return Consumer.loadInStore(store, recipientId, user).then(function () {
            consumerObj = localStore_1.getData(recipientId, 'consumer');
            if (typeof consumerObj != 'undefined') {
                return new Promise(function (resolve, reject) {
                    resolve(consumerObj);
                });
            }
            else {
                console.log('create consumer');
            }
        });
    }
    else {
        return new Promise(function (resolve, reject) {
            resolve(consumerObj);
        });
    }
}
function sendMenu(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        authentication(recipientId, senderId).then(function () {
            bot.clearListener(recipientId);
            var customer = localStore_1.getData(recipientId, 'customer');
            var user = localStore_1.getData(recipientId, 'user');
            var image_url = customer.image.url;
            return bot.sendTypingOff(recipientId, senderId).then(function () {
                return bot.sendGenericMessage(recipientId, senderId, [{
                        "title": "Hola " + user.first_name + ", Bienvenido a " + customer.name,
                        "subtitle": "Aquí puedes pedir un domicilio, escribe o selecciona alguna de las opciones:",
                        "image_url": image_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Pedir domicilio",
                                "payload": "SendAddressesWithTitle"
                            },
                            {
                                "type": "postback",
                                "title": "Servicio al cliente",
                                "payload": "CustomerService"
                            }
                        ]
                    }]);
            });
        });
    });
}
function searchProducts(recipientId, senderId, query, index) {
    console.log('searchProducts');
}
;
function sendTest(recipientId, senderId) {
    bot.sendTextMessage(recipientId, senderId, 'test');
}
module.exports = app;
