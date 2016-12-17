"use strict";
var bot = require("../middleware/bot");
var Actions = require("../middleware/actions/index");
var localStore_1 = require("../middleware/localStore");
var User_1 = require("../middleware/models/User");
function app(server) {
    //let router = server.loopback.Router();
    server.get('/', function (req, res) {
        res.status(200).send('Speedy Bot!');
    });
    server.get('/authorize', bot.authorize);
    server.get('/webhook', bot.verifyToken);
    server.post('/webhook', bot.router);
    //server.use(router);
}
exports.app = app;
;
bot.rules.set('hola', sendMenu);
bot.rules.set('ayuda', sendHelp);
bot.rules.set('help', sendHelp);
bot.rules.set('ok', sendYouAreWelcome);
bot.rules.set('gracias', sendYouAreWelcome);
bot.payloadRules.set('Search', searchProducts);
function authentication(recipientId, senderId) {
    return getCustomer(recipientId, senderId).then(function (customer) {
        return getUser(recipientId).then(function (user) {
            if (typeof user == 'undefined') {
                return User_1.default.createUser(store, recipientId, recipientId, customer.fanpageToken).then(function () {
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
        return User_1.default.loadInStore(store, recipientId).then(function () {
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
function sendHelp(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            bot.clearListener(recipientId);
            return bot.sendTextMessage(recipientId, senderId, "InOut Bot.\n\nTe permite visualizar las opciones de productos, agregarlos al carrito y realizar tu compra por medio del chat de facebook.\n\nFuncionalidades disponibles: \n\n'Hola', para iniciar la conversación\n'Pedir Domicilio', si quieres realizar un domicilio\n'Carrito', para ver el estado actual de tu carrito").then(function () {
                sendContactUs(recipientId, senderId);
            });
        });
    });
}
function sendContactUs(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, " Para mayor información puedes contactarnos en:\n\n Web: http://www.inoutdelivery.com/\n\n Email: soporte@inoutdelivery.com");
        });
    });
}
function sendYouAreWelcome(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, "De nada, gracias por usar nuestros servicios");
        });
    });
}
function sendTest(recipientId, senderId) {
    bot.sendTextMessage(recipientId, senderId, 'test');
}
module.exports = app;
