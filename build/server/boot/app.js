"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var parse_1 = require("../middleware/parse");
var redux_thunk_1 = require("redux-thunk");
var request_promise_1 = require("request-promise");
var geocoder = require("geocoder");
var dateformat_1 = require("dateformat");
var datetime_converter_nodejs_1 = require("datetime-converter-nodejs");
var Map = require("es6-map");
var config = require("config");
var redux = require("redux");
var Promise = require("promise");
var objectAssign = require("object-assign");
var bot = require("../middleware/bot");
var types = require("../middleware/constants/actionTypes");
var Actions = require("../middleware/actions/index");
var parseUtils_1 = require("../middleware/parseUtils");
var ParseModels_1 = require("../middleware/models/ParseModels");
var SERVER_URL = config.get('SERVER_URL');
var PARSE_APP_ID = config.get('PARSE_APP_ID');
var PARSE_SERVER_URL = config.get('PARSE_SERVER_URL');
var PARSE_CLIENT_KEY = config.get('PARSE_CLIENT_KEY');
var FACEBOOK_APP_ID = config.get('FACEBOOK_APP_ID');
var GOOGLE_MAPS_URL = config.get('GOOGLE_MAPS_URL');
var GOOGLE_MAPS_KEY = config.get('GOOGLE_MAPS_KEY');
var initialState = {
    userData: {},
    paymentTypes: {
        'Nn0joKC5VK': sendCash,
        'UdK0Ifc4IF': sendCash,
        'CHzoYrEtiY': sendRegisteredCreditCards
    },
    creditCardImages: {
        'VISA': 'assets/images/visaCard.jpg',
        'MASTERCARD': 'assets/images/masterCard.jpg',
        'AMERICAN': 'assets/images/americanCard.jpg',
        'DINERS': 'assets/images/dinersCard.jpg',
        'DEFAULT': 'assets/images/creditCards.jpg'
    }
};
var reducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    console.log('ACTION');
    console.log(action);
    var data = action.data;
    if (data && data.hasOwnProperty('recipientId')) {
        if (typeof state.userData[data.recipientId] == 'undefined') {
            state.userData[data.recipientId] = {};
        }
    }
    switch (action.type) {
        case types.CUSTOMER_LOADED: {
            var customer = parseUtils_1.extractParseAttributes(data.customer);
            objectAssign(state.userData[data.recipientId], { customer: customer });
            return __assign({}, state);
        }
        case types.CONSUMER_LOADED: {
            var consumer = parseUtils_1.extractParseAttributes(data.consumer);
            objectAssign(state.userData[data.recipientId], { consumer: consumer });
            return __assign({}, state);
        }
        case types.USER_LOADED: {
            var user = parseUtils_1.extractParseAttributes(data.user);
            objectAssign(state.userData[data.recipientId], { user: user });
            return __assign({}, state);
        }
        case types.CONSUMER_ADDRESSES_LOADED: {
            var addresses = data.addresses.map(function (a) { return parseUtils_1.extractParseAttributes(a); });
            objectAssign(state.userData[data.recipientId], { addresses: addresses });
            return __assign({}, state);
        }
        case types.SET_CURRENT_ADDRESS: {
            var address = parseUtils_1.extractParseAttributes(data.address);
            objectAssign(state.userData[data.recipientId], { address: address });
            return __assign({}, state);
        }
        case types.PAYMENT_METHODS_LOADED: {
            var paymentMethods = data.paymentMethods.map(function (p) { return parseUtils_1.extractParseAttributes(p); });
            objectAssign(state.userData[data.recipientId], { paymentMethods: paymentMethods });
            return __assign({}, state);
        }
        case types.SET_PAYMENT_METHOD: {
            var paymentMethod = parseUtils_1.extractParseAttributes(data.paymentMethod);
            objectAssign(state.userData[data.recipientId], { paymentMethod: paymentMethod });
            return __assign({}, state);
        }
        case types.SET_ORDERS: {
            var ongoing = data.orders.ongoing.map(function (a) { return parseUtils_1.extractParseAttributes(a); });
            var delivered = data.orders.delivered.map(function (a) { return parseUtils_1.extractParseAttributes(a); });
            objectAssign(state.userData[data.recipientId], { orders: { ongoing: ongoing, delivered: delivered } });
            return __assign({}, state);
        }
        case types.CONSUMER_UPDATED: {
            return __assign({}, state);
        }
        case types.CONSUMER_NOT_FOUND: {
            return __assign({}, state);
        }
        case types.CONSUMER_ORDERS_LOADED: {
            var orders = data.orders.map(function (a) { return parseUtils_1.extractParseAttributes(a); });
            objectAssign(state.userData[data.recipientId], { orders: orders });
            return __assign({}, state);
        }
        case types.USER_CREDITCARDS_LOADED: {
            var creditCards = data.creditCards.map(function (a) { return parseUtils_1.extractParseAttributes(a); });
            objectAssign(state.userData[data.recipientId], { creditCards: creditCards });
            return __assign({}, state);
        }
        case types.SET_CUSTOMER_POINT_SALE: {
            var pointSale = parseUtils_1.extractParseAttributes(data.pointSale);
            objectAssign(state.userData[data.recipientId], { pointSale: pointSale });
            return __assign({}, state);
        }
        case types.SET_ORDER: {
            var order = parseUtils_1.extractParseAttributes(data.order);
            objectAssign(state.userData[data.recipientId], { order: order });
            return __assign({}, state);
        }
        case types.SET_USER: {
            var user = parseUtils_1.extractParseAttributes(data.user);
            objectAssign(state.userData[data.recipientId], { user: user });
            return __assign({}, state);
        }
        case types.SET_CONSUMER: {
            var consumer = parseUtils_1.extractParseAttributes(data.consumer);
            objectAssign(state.userData[data.recipientId], { consumer: consumer });
            return __assign({}, state);
        }
        case types.SET_CUSTOMER: {
            var customer = parseUtils_1.extractParseAttributes(data.customer);
            objectAssign(state.userData[data.recipientId], { customer: customer });
            return __assign({}, state);
        }
        case types.SET_ORDER_STATE: {
            var orderState = parseUtils_1.extractParseAttributes(data.orderState);
            objectAssign(state.userData[data.recipientId], { orderState: orderState });
            return __assign({}, state);
        }
        default:
            return state;
    }
};
var store = redux.createStore(reducer, redux.applyMiddleware(redux_thunk_1.default));
store.subscribe(function () {
    return console.log('\n');
});
bot.rules.set('hola', sendMenu);
bot.rules.set('iniciar', sendMenu);
bot.rules.set('empezar', sendMenu);
bot.rules.set('comenzar', sendMenu);
bot.rules.set('buenos dias', sendMenu);
bot.rules.set('buenas tardes', sendMenu);
bot.rules.set('menú', sendMenu);
bot.rules.set('pedir domicilio', sendAddressesWithTitle);
bot.rules.set('carrito', sendCart);
bot.rules.set('cuenta', sendCart);
bot.rules.set('mi orden', sendOrders);
bot.rules.set('mis órdenes', sendOrders);
bot.rules.set('mi dirección', sendAddresses);
bot.rules.set('mis direcciones', sendAddresses);
bot.rules.set('nueva dirección', newAddress);
bot.rules.set('agregar dirección', newAddress);
bot.rules.set('mi cuenta', sendAccount);
bot.rules.set('mi tarjeta', sendCreditCards);
bot.rules.set('mis tarjetas', sendCreditCards);
bot.rules.set('nueva tarjeta', registerCreditCard);
bot.rules.set('agregar tarjeta', registerCreditCard);
bot.rules.set('ayuda', sendHelp);
bot.rules.set('help', sendHelp);
bot.rules.set('ok', sendYouAreWelcome);
bot.rules.set('gracias', sendYouAreWelcome);
bot.payloadRules.set('Greeting', sendMenu);
bot.payloadRules.set('SendAddressesWithTitle', sendAddressesWithTitle);
bot.payloadRules.set('SendAddresses', sendAddresses);
bot.payloadRules.set('NewAddress', newAddress);
bot.payloadRules.set('SetAddressComplement', setAddressComplement);
bot.payloadRules.set('ConfirmAddress', confirmAddress);
bot.payloadRules.set('SetAddress', setAddress);
bot.payloadRules.set('EditAddress', editAddress);
bot.payloadRules.set('RemoveAddress', removeAddress);
bot.payloadRules.set('SendCategories', sendCategories);
bot.payloadRules.set('SendProducts', sendProducts);
bot.payloadRules.set('AddProduct', addProduct);
bot.payloadRules.set('AddModifier', addModifier);
bot.payloadRules.set('RemoveProduct', removeProduct);
bot.payloadRules.set('IncreaseOneProduct', increaseOneProduct);
bot.payloadRules.set('DecreaseOneProduct', decreaseOneProduct);
bot.payloadRules.set('SendProductDescription', sendProductDescription);
bot.payloadRules.set('SendContinueOrder', sendContinueOrder);
bot.payloadRules.set('Search', searchProducts);
bot.payloadRules.set('SendCart', sendCart);
bot.payloadRules.set('SendCartDetails', sendCartDetails);
bot.payloadRules.set('EditCart', editCart);
bot.payloadRules.set('ClearCart', clearCart);
bot.payloadRules.set('ClearAndSendCart', clearAndSendCart);
bot.payloadRules.set('SendPurchaseOptions', sendPurchaseOptions);
bot.payloadRules.set('Checkout', checkout);
bot.payloadRules.set('CheckPayment', checkPayment);
bot.payloadRules.set('CheckAddress', checkAddress);
bot.payloadRules.set('CheckOrder', checkOrder);
bot.payloadRules.set('RegisterCreditCard', registerCreditCard);
bot.payloadRules.set('RegisterCreditCardAndPay', registerCreditCardAndPay);
bot.payloadRules.set('SendRegisteredCreditCards', sendRegisteredCreditCards);
bot.payloadRules.set('CancelRegisterCreditCard', cancelRegisterCreditCard);
bot.payloadRules.set('PayWithCreditCard', payWithCreditCard);
bot.payloadRules.set('SendOrders', sendOrders);
bot.payloadRules.set('SendOrder', sendOrder);
bot.payloadRules.set('NewOrder', newOrder);
bot.payloadRules.set('CancelOrder', cancelOrder);
bot.payloadRules.set('SendCreditCards', sendCreditCards);
bot.payloadRules.set('RemoveCreditCard', removeCreditCard);
bot.payloadRules.set('SetScore', setScore);
bot.payloadRules.set('SendAccount', sendAccount);
bot.payloadRules.set('SendHelp', sendHelp);
bot.payloadRules.set('CustomerService', sendHelp);
function createLocalStore(reducer) {
}
function getUserData(recipientId) {
    if (typeof recipientId !== 'undefined' && typeof store !== 'undefined' && typeof store.getState() !== 'undefined') {
        var state = store.getState();
        var data = state.userData;
        return data[recipientId];
    }
}
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
function signUp(recipientId, senderId, facebookId, conversationToken) {
    return ParseModels_1.User.createUser(store, recipientId, facebookId, conversationToken).then(function () {
        var userObject = getData(recipientId, 'user');
        var user = userObject.rawParseObject;
        return user.createConsumer(store, recipientId, senderId, conversationToken).then(function (consumer) {
            return new Promise(function (resolve, reject) {
                resolve(userObject);
            });
        });
    });
}
function login(username, password) {
    return parse_1.default.User.logIn(username, password, {
        success: function (user) {
            //let val = JSON.stringify({sessionToken: user.getSessionToken()});
            //console.log(val);
            return user;
        },
        error: function (user, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
}
function authentication(recipientId, senderId) {
    return getCustomer(recipientId, senderId).then(function (customer) {
        return getUser(recipientId).then(function (user) {
            if (typeof user == 'undefined') {
                return ParseModels_1.User.createUser(store, recipientId, recipientId, customer.fanpageToken).then(function () {
                    var userObject = getData(recipientId, 'user');
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
    var customer = getData(recipientId, 'customer');
    if (typeof customer == 'undefined') {
        return Actions.getCustomerByFanpage(senderId).then(function (customer) {
            return ParseModels_1.Customer.loadInStore(store, recipientId, customer.businessId).then(function () {
                return getData(recipientId, 'customer');
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
    var userObj = getData(recipientId, 'user');
    if (typeof userObj == 'undefined') {
        return ParseModels_1.User.loadInStore(store, recipientId).then(function () {
            return getData(recipientId, 'user');
        });
    }
    else {
        return new Promise(function (resolve, reject) {
            resolve(userObj);
        });
    }
}
function getConsumer(recipientId, user) {
    var consumerObj = getData(recipientId, 'consumer');
    if (typeof consumerObj == 'undefined') {
        return ParseModels_1.Consumer.loadInStore(store, recipientId, user).then(function () {
            consumerObj = getData(recipientId, 'consumer');
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
function sendSignUp(recipientId, senderId) {
    var image_url = SERVER_URL + "assets/images/love.jpg";
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendGenericMessage(recipientId, senderId, [{
                    "title": "Hola, soy un Bot",
                    "subtitle": "Soy tu asistente virtual. Quieres registrarte en nuestro sistema?",
                    "image_url": image_url,
                    "buttons": [
                        {
                            "type": "web_url",
                            "url": SERVER_URL + "login?psid=" + recipientId,
                            "title": "Registrarme",
                            "webview_height_ratio": "full",
                            "messenger_extensions": true
                        }
                    ]
                }]);
        });
    });
}
;
function sendMenu(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        authentication(recipientId, senderId).then(function () {
            bot.clearListener(recipientId);
            var customer = getData(recipientId, 'customer');
            var user = getData(recipientId, 'user');
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
function sendAddressesWithTitle(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, "A cual dirección vas hacer tu pedido?\n\nPuedes escoger entre agregar una nueva dirección o seleccionar una de tus direcciones guardadas").then(function () {
                sendAddresses(recipientId, senderId);
            });
        });
    });
}
function sendAddresses(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        authentication(recipientId, senderId).then(function () {
            bot.clearListener(recipientId);
            var consumer = getData(recipientId, 'consumer');
            ParseModels_1.ConsumerAddress.loadInStore(store, recipientId, consumer).then(function () {
                var addresses = getData(recipientId, 'addresses');
                var elements = [];
                elements.push({
                    "title": "Nueva dirección",
                    "subtitle": "Puedes agregar una nueva dirección",
                    "image_url": SERVER_URL + "assets/images/addAddress.jpg",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Nueva dirección",
                            "payload": "NewAddress"
                        }
                    ]
                });
                for (var _i = 0, addresses_1 = addresses; _i < addresses_1.length; _i++) {
                    var address = addresses_1[_i];
                    if (elements.length < bot.limit) {
                        elements.push({
                            "title": address.name,
                            "subtitle": address.address + ", " + address.description + ", " + address.city + ", " + address.state,
                            "image_url": GOOGLE_MAPS_URL + "?center=" + address.location.lat + "," + address.location.lng + "&zoom=16&size=400x400&markers=color:red%7C" + address.location.lat + "," + address.location.lng + "&key=" + GOOGLE_MAPS_KEY,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Seleccionar",
                                    "payload": "SetAddress-" + address.objectId
                                },
                                {
                                    "type": "postback",
                                    "title": "Modificar",
                                    "payload": "EditAddress-" + address.objectId
                                },
                                {
                                    "type": "postback",
                                    "title": "Quitar",
                                    "payload": "RemoveAddress-" + address.objectId
                                }
                            ]
                        });
                    }
                }
                return bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendGenericMessage(recipientId, senderId, elements);
                });
            });
        });
    });
}
function sendCreditCards(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        authentication(recipientId, senderId).then(function () {
            bot.clearListener(recipientId);
            var state = store.getState();
            var user = getData(recipientId, 'user');
            var creditCardsImages = state['creditCardImages'];
            ParseModels_1.CreditCard.loadInStore(store, recipientId, user).then(function () {
                var creditCards = getData(recipientId, 'creditCards');
                var userBuffer = bot.buffer[recipientId];
                var creditCardImage;
                var elements = [];
                if (typeof userBuffer != 'undefined' && userBuffer.hasOwnProperty('creditCardPayload')) {
                    delete userBuffer.creditCardPayload;
                }
                elements.push({
                    "title": "Registro de tarjeta",
                    "subtitle": "Puedes agregar una tarjeta",
                    "image_url": SERVER_URL + "assets/images/creditCards.jpg",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Nueva tarjeta",
                            "payload": "RegisterCreditCard"
                        }
                    ]
                });
                for (var _i = 0, creditCards_1 = creditCards; _i < creditCards_1.length; _i++) {
                    var creditCard = creditCards_1[_i];
                    if (elements.length < bot.limit) {
                        creditCardImage = creditCardsImages.hasOwnProperty(creditCard.type) ? creditCardsImages[creditCard.type] : creditCardsImages['DEFAULT'];
                        elements.push({
                            "title": creditCard.type + ' ' + creditCard.lastFour,
                            "subtitle": creditCard.cardHolderName,
                            "image_url": SERVER_URL + creditCardImage,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Quitar",
                                    "payload": "RemoveCreditCard-" + creditCard.objectId
                                }
                            ]
                        });
                    }
                }
                return bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendGenericMessage(recipientId, senderId, elements);
                });
            });
        });
    });
}
function newAddress(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            bot.setDataBuffer(recipientId, 'addressPayload', 'NewAddress');
            writeAddress(recipientId, senderId);
        });
    });
}
function writeAddress(recipientId, senderId) {
    bot.setListener(recipientId, 'address', 'text', addressCheck);
    bot.setListener(recipientId, 'location', 'attachment', setLocationCheck);
    return bot.sendQuickReplyMessage(recipientId, senderId, "Puedes escribir o compartir tu ubicación actual?\n\nEjemplo: Calle 67 #52-20, Medellín.\n\nNo olvides escribir la ciudad al final de la dirección.", [{
            "content_type": "location",
            "title": "Enviar ubicación"
        }]);
}
function sendNullMapMessage(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, "La dirección no ha sido encontrada en Google Maps, por favor intenta de nuevo");
        });
    });
}
function sendMap(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        var userBuffer = bot.buffer[recipientId];
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendImageMessage(recipientId, senderId, GOOGLE_MAPS_URL + "?center=" + userBuffer.location.lat + "," + userBuffer.location.lng + "&zoom=16&size=400x400&markers=color:red%7C" + userBuffer.location.lat + "," + userBuffer.location.lng + "&key=" + GOOGLE_MAPS_KEY).then(function () {
                sendMapConfirmation(recipientId, senderId);
            });
        });
    });
}
function sendMapConfirmation(recipientId, senderId) {
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendQuickReplyMessage(recipientId, senderId, "Es correcta?", [
            {
                "content_type": "text",
                "title": "Si",
                "payload": "SetAddressComplement"
            },
            {
                "content_type": "text",
                "title": "No",
                "payload": "NewAddress"
            }
        ]);
    });
}
function addressCheck(recipientId, senderId) {
    var userBuffer = bot.buffer[recipientId];
    geocoder.geocode(userBuffer.address, function (error, data) {
        if (!error && data.status == 'OK') {
            setAddressComponetsInBuffer(recipientId, senderId, data.results[0]);
        }
        else {
            console.log('Geocode not found');
            console.log(error);
            sendNullMapMessage(recipientId, senderId).then(function () {
                newAddress(recipientId, senderId);
            });
        }
    });
}
function setAddressComponetsInBuffer(recipientId, senderId, data) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        var userBuffer = bot.buffer[recipientId];
        userBuffer.address = data.formatted_address;
        userBuffer.location = data.geometry.location;
        for (var _i = 0, _a = data.address_components; _i < _a.length; _i++) {
            var component = _a[_i];
            if (component.types.includes('route')) {
                userBuffer.route = component.long_name;
            }
            else if (component.types.includes('street_number')) {
                userBuffer.street_number = component.short_name;
            }
            else if (component.types.includes('locality')) {
                userBuffer.locality = component.short_name;
            }
            else if (component.types.includes('administrative_area_level_1')) {
                userBuffer.state = component.short_name;
            }
            else if (component.types.includes('administrative_area_level_2')) {
                userBuffer.administrative_area = component.short_name;
            }
            else if (component.types.includes('country')) {
                userBuffer.country = component.long_name;
                userBuffer.country_code = component.short_name;
            }
            else if (component.types.includes('postal_code')) {
                userBuffer.postal_code = component.short_name;
            }
        }
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, "Encontré esta dirección en Google Maps:\n\n" + userBuffer.address).then(function () {
                sendMap(recipientId, senderId);
            });
        });
    });
}
function setAddressComplement(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        bot.setListener(recipientId, 'complement', 'text', confirmAddress);
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, "Por favor escribe el complemento de tu dirección actual.\n\nEjemplo: Apto 303, edificio el palmar.\n\nNo olvides colocar el nombre del edificio o del barrio");
        });
    });
}
function confirmAddress(recipientId, senderId) {
    var userBuffer = bot.buffer[recipientId];
    var addressPayload = userBuffer['addressPayload'];
    if (addressPayload == 'NewAddress') {
        return bot.sendTypingOn(recipientId, senderId).then(function () {
            bot.setListener(recipientId, 'address_name', 'text', saveAddress);
            return bot.sendTypingOff(recipientId, senderId).then(function () {
                return bot.sendTextMessage(recipientId, senderId, "Por favor coloca un nombre a esta dirección para guardarla. \n\nEjemplo: casa, apartamento o oficina");
            });
        });
    }
    else if (addressPayload.startsWith('EditAddress')) {
        return bot.sendTypingOn(recipientId, senderId).then(function () {
            var data = addressPayload.split('-');
            var location = new parse_1.default.GeoPoint({ latitude: parseFloat(userBuffer.location.lat), longitude: parseFloat(userBuffer.location.lng) });
            new parse_1.default.Query(ParseModels_1.ConsumerAddress).get(data[1]).then(function (consumerAddress) {
                consumerAddress.set('address', userBuffer.route + " # " + userBuffer.street_number);
                consumerAddress.set('location', location);
                consumerAddress.set('country', userBuffer.country);
                consumerAddress.set('countryCode', userBuffer.country_code);
                consumerAddress.set('postalCode', userBuffer.postal_code);
                consumerAddress.set('state', userBuffer.state);
                consumerAddress.set('description', userBuffer.complement);
                consumerAddress.save(undefined, {
                    success: function (address) {
                        delete userBuffer.address;
                        delete userBuffer.location;
                        delete userBuffer.complement;
                        return bot.sendTypingOff(recipientId, senderId).then(function () {
                            return bot.sendTextMessage(recipientId, senderId, "La dirección ha sido actualizada.").then(function () {
                                setAddress(recipientId, senderId, address.id);
                            });
                        });
                    },
                    error: function (user, error) {
                        console.log('Failed to create new object, with error code: ' + error.message);
                    }
                });
            });
        });
    }
}
function saveAddress(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        var consumer = getData(recipientId, 'consumer');
        var userBuffer = bot.buffer[recipientId];
        var location = new parse_1.default.GeoPoint({ latitude: parseFloat(userBuffer.location.lat), longitude: parseFloat(userBuffer.location.lng) });
        var consumerAddress = new ParseModels_1.ConsumerAddress();
        consumerAddress.set('name', userBuffer.address_name);
        consumerAddress.set('address', userBuffer.route + " # " + userBuffer.street_number);
        consumerAddress.set('consumer', {
            __type: "Pointer",
            className: "Consumer",
            objectId: consumer.objectId
        });
        consumerAddress.set('location', location);
        consumerAddress.set('city', userBuffer.locality);
        consumerAddress.set('country', userBuffer.country);
        consumerAddress.set('countryCode', userBuffer.country_code);
        consumerAddress.set('postalCode', userBuffer.postal_code);
        consumerAddress.set('state', userBuffer.state);
        consumerAddress.set('description', userBuffer.complement);
        consumerAddress.save(undefined, {
            success: function (result) {
                delete userBuffer.address;
                delete userBuffer.location;
                delete userBuffer.complement;
                delete userBuffer['address_name'];
                return bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendTextMessage(recipientId, senderId, "La dirección ha sido almacenada.").then(function () {
                        setAddress(recipientId, senderId, result.id);
                    });
                });
            },
            error: function (user, error) {
                console.log('Failed to create new object, with error code: ' + error.message);
            }
        });
    });
}
function setEmail(recipientId, senderId) {
    bot.setListener(recipientId, 'email', 'text', setEmailCheck);
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendTextMessage(recipientId, senderId, "Por favor escribe tu email:");
    });
}
function setEmailCheck(recipientId, senderId) {
    var userBuffer = bot.buffer[recipientId];
    var consumer = getData(recipientId, 'consumer').rawParseObject;
    consumer.setEmail(userBuffer.email);
    consumer.saveInStore(store, recipientId).then(function () {
        delete userBuffer.email;
        checkOrder(recipientId, senderId);
    });
}
function setTelephone(recipientId, senderId) {
    bot.setListener(recipientId, 'telephone', 'text', setTelephoneCheck);
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendTextMessage(recipientId, senderId, "Por favor escribe tu número telefónico:");
    });
}
function setTelephoneCheck(recipientId, senderId) {
    var userBuffer = bot.buffer[recipientId];
    var consumer = getData(recipientId, 'consumer').rawParseObject;
    consumer.setPhone(userBuffer.telephone);
    consumer.saveInStore(store, recipientId).then(function () {
        delete userBuffer.telephone;
        checkOrder(recipientId, senderId);
    });
}
function setLocationCheck(recipientId, senderId) {
    var userBuffer = bot.buffer[recipientId];
    geocoder.reverseGeocode(userBuffer.location.lat, userBuffer.location.lng, function (error, data) {
        if (!error && data.status == 'OK') {
            setAddressComponetsInBuffer(recipientId, senderId, data.results[0]);
        }
        else {
            console.log('Geocode not found');
            console.log(error);
            sendNullMapMessage(recipientId, senderId).then(function () {
                newAddress(recipientId, senderId);
            });
        }
    });
}
function setAddress(recipientId, senderId, id) {
    var customer = getData(recipientId, 'customer');
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        ParseModels_1.ConsumerAddress.setAddress(store, recipientId, id).then(function () {
            var address = getData(recipientId, 'address');
            parse_1.default.Cloud.run('getProducts', { businessId: customer.businessId, lat: address.location.lat, lng: address.location.lng }).then(function (result) {
                var pointSale = result.pointSale;
                ParseModels_1.CustomerPointSale.setCustomerPointSale(store, recipientId, pointSale.id);
            }).then(function () {
                return bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendTextMessage(recipientId, senderId, "Perfecto, ya seleccioné tu dirección para este pedido").then(function () {
                        sendCategories(recipientId, senderId, 0);
                    });
                });
            });
        }, function (error) {
            if (error.code == '141') {
                return bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendTextMessage(recipientId, senderId, "La dirección seleccionada no está dentro de la cobertura de nuestras sedes, por favor intenta con otra dirección").then(function () {
                        sendAddressesWithTitle(recipientId, senderId);
                    });
                });
            }
            else {
                console.log('error');
                console.log(error);
            }
        });
    });
}
;
function editAddress(recipientId, senderId, id) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            bot.setDataBuffer(recipientId, 'addressPayload', 'EditAddress-' + id);
            writeAddress(recipientId, senderId);
        });
    });
}
function removeAddress(recipientId, senderId, id) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        new parse_1.default.Query(ParseModels_1.ConsumerAddress).get(id).then(function (consumerAddress) {
            consumerAddress.destroy().then(function () {
                return bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendTextMessage(recipientId, senderId, "La dirección ha sido eliminada.").then(function () {
                        sendAddresses(recipientId, senderId);
                    });
                });
            });
        });
    });
}
function removeCreditCard(recipientId, senderId, id) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        new parse_1.default.Query(ParseModels_1.CreditCard).get(id).then(function (creditCard) {
            creditCard.destroy().then(function () {
                return bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendTextMessage(recipientId, senderId, "La tarjeta de credito ha sido eliminada.").then(function () {
                        sendCreditCards(recipientId, senderId);
                    });
                });
            });
        });
    });
}
function sendCategories(recipientId, senderId, index) {
    var customer = getData(recipientId, 'customer');
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        authentication(recipientId, senderId).then(function () {
            bot.clearListener(recipientId);
            parse_1.default.Cloud.run('getProducts', { businessId: customer.businessId }).then(function (result) {
                if (result.pointSaleIsOpen) {
                    if (typeof index == 'undefined')
                        index = 0;
                    else if (typeof index == 'string')
                        index = parseInt(index);
                    if (index == 0) {
                        bot.sendTypingOff(recipientId, senderId).then(function () {
                            bot.sendTextMessage(recipientId, senderId, "A continuación te presentamos las categorías de productos disponibles.").then(function () {
                                sendCategoriesDetail(recipientId, senderId, result.categories, index);
                            });
                        });
                    }
                    else {
                        bot.sendTypingOff(recipientId, senderId).then(function () {
                            sendCategoriesDetail(recipientId, senderId, result.categories, index);
                        });
                    }
                }
                else {
                    sendScheduleRestriction(recipientId, senderId, result.pointSaleSchedules);
                }
            }, function (error) {
                console.log('error');
                console.log(error);
            });
        });
    });
}
function splitCategories(recipientId, categories, index) {
    var customer = getData(recipientId, 'customer');
    var image_url;
    var idx = 0;
    var elements = [];
    categories.forEach(function (item) {
        if (item && item.get('name')) {
            if (idx >= (index) * bot.limit && idx < (index + 1) * bot.limit) {
                var image = item.get('image');
                image_url = (typeof image != 'undefined') ? image.url() : customer.image.url;
                elements.push({
                    title: item.get('name'),
                    image_url: image_url,
                    buttons: [{
                            type: "postback",
                            title: 'Ver categoría',
                            payload: "SendProducts-" + item.id + "-0",
                        }]
                });
            }
            idx = idx + 1;
        }
    });
    return elements;
}
function sendCategoriesDetail(recipientId, senderId, categories, index) {
    var elements = splitCategories(recipientId, categories, index);
    var idx = Object.keys(categories).length;
    var buttons = [];
    var catIni = (index + 1) * bot.limit;
    var catFin = (idx > catIni + bot.limit) ? catIni + bot.limit : idx;
    if (idx > (index + 1) * bot.limit) {
        buttons.push({
            type: "postback",
            title: "Categorías " + (catIni + 1) + "-" + catFin,
            payload: "SendCategories-" + (index + 1),
        });
        elements.push({
            title: "Ver más categorias ",
            subtitle: "Categorías disponibles",
            buttons: buttons
        });
    }
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendGenericMessage(recipientId, senderId, elements);
    });
}
function sendProducts(recipientId, senderId, categoryId, proIdx) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        bot.clearListener(recipientId);
        proIdx = parseInt(proIdx);
        if (proIdx == 0) {
            new parse_1.default.Query(ParseModels_1.Category).get(categoryId).then(function (category) {
                return bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendTextMessage(recipientId, senderId, "Selecciona " + category.get('name') + ":").then(function () {
                        getProducts(recipientId, senderId, categoryId, proIdx);
                    });
                });
            }, function (object, error) {
                console.log(error);
            });
        }
        else {
            getProducts(recipientId, senderId, categoryId, proIdx);
        }
    });
}
function getProducts(recipientId, senderId, categoryId, proIdx) {
    var customer = getData(recipientId, 'customer');
    parse_1.default.Cloud.run('getProducts', { businessId: customer.businessId, category: categoryId }).then(function (result) {
        if (result.hasOwnProperty('categories')) {
            sendCategoriesDetail(recipientId, senderId, result.categories, 0);
        }
        else {
            if (result.products.length == 0) {
                bot.sendTypingOff(recipientId, senderId).then(function () {
                    bot.sendQuickReplyMessage(recipientId, senderId, "No existen productos en esta categoría", [{
                            "content_type": "text",
                            "title": "Seguir pidiendo",
                            "payload": "SendContinueOrder"
                        },
                        {
                            "content_type": "text",
                            "title": "Ver carrito",
                            "payload": "SendCart"
                        }]);
                });
            }
            else {
                sendProductsDetail(recipientId, senderId, categoryId, result.products, proIdx);
            }
        }
    }, function (error) {
        console.log('error');
        console.log(error);
    });
}
function splitProducts(recipientId, products, proIdx) {
    var customer = getData(recipientId, 'customer');
    var image_url;
    var idx = 0;
    var elements = [];
    products.forEach(function (product) {
        if (product && product.get('name')) {
            if (idx >= (proIdx) * bot.limit && idx < (proIdx + 1) * bot.limit) {
                var image = product.get('image');
                image_url = (typeof image != 'undefined') ? image.url() : customer.image.url;
                elements.push({
                    title: product.get('name') + ": $" + product.get('priceDefault'),
                    subtitle: product.get('description'),
                    image_url: image_url,
                    buttons: [{
                            type: "postback",
                            title: "Agregar",
                            payload: "AddProduct-" + product.id,
                        },
                        {
                            type: "postback",
                            title: 'Ver descripción',
                            payload: "SendProductDescription-" + product.id,
                        }]
                });
            }
            idx = idx + 1;
        }
    });
    return elements;
}
function sendProductsDetail(recipientId, senderId, categoryId, products, index) {
    var elements = splitProducts(recipientId, products, index);
    var idx = Object.keys(products).length;
    var buttons = [];
    var catIni = (index + 1) * bot.limit;
    var catFin = (idx > catIni + bot.limit) ? catIni + bot.limit : idx;
    if (idx > (index + 1) * bot.limit) {
        buttons.push({
            type: "postback",
            title: "Productos " + (catIni + 1) + "-" + catFin,
            payload: "SendProducts-" + categoryId + "-" + (index + 1),
        });
        elements.push({
            title: "Ver más productos ",
            subtitle: "Productos disponibles",
            buttons: buttons
        });
    }
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendGenericMessage(recipientId, senderId, elements);
    });
}
function createCart(recipientId) {
    var userData = getUserData(recipientId);
    objectAssign(userData, { 'cart': { items: new Map() } });
    return userData.cart;
}
function addProduct(recipientId, senderId, productId) {
    var cart = getData(recipientId, 'cart');
    if (typeof cart == 'undefined') {
        cart = createCart(recipientId);
    }
    var items = cart.items;
    new parse_1.default.Query(ParseModels_1.Product).get(productId).then(function (product) {
        var productObject = parseUtils_1.extractParseAttributes(product);
        var item = items.get(productId);
        var promises = [];
        if (typeof item == 'undefined') {
            items.set(productId, { quantity: 1, price: productObject.priceDefault });
            item = items.get(productId);
        }
        else {
            item.quantity += 1;
        }
        if (typeof item.modifiers == 'undefined') {
            item.modifiers = [];
        }
        if (typeof productObject.modifiers != 'undefined') {
            productObject.modifiers.forEach(function (obj, index, array) {
                promises.push(new parse_1.default.Query(ParseModels_1.Modifier).get(obj.objectId).then(function (modifier) {
                    return parseUtils_1.extractParseAttributes(modifier);
                }));
            });
        }
        parse_1.default.Promise.when(promises).then(function (modifiers) {
            var undefinedModifiers = checkModifiers(recipientId, productId, modifiers);
            //checkModifiersComplete(recipientId, productId, modifiers).then(result =>{
            //    console.log('result: '+result);
            //});
            if (undefinedModifiers.length > 0) {
                //Show multiples modifiers
                promises = [];
                undefinedModifiers[0].items.forEach(function (modifierItem) {
                    promises.push(new parse_1.default.Query(ParseModels_1.ModifierItem).get(modifierItem.objectId).then(function (modifierItem) {
                        return parseUtils_1.extractParseAttributes(modifierItem);
                    }));
                });
                parse_1.default.Promise.when(promises).then(function (modifierItems) {
                    sendModifierMenu(recipientId, senderId, productId, undefinedModifiers[0], modifierItems);
                });
            }
            else {
                saveCart(recipientId);
                sendAddProductNenu(recipientId, senderId, productId);
            }
        });
    }, function (object, error) {
        console.log(error);
    });
}
function sendAddProductNenu(recipientId, senderId, productId) {
    return new parse_1.default.Query(ParseModels_1.Product).get(productId).then(function (product) {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendQuickReplyMessage(recipientId, senderId, "El producto " + product.get('name') + " ha sido agregado.\n\nDeseas seguir pidiendo o ver tu carrito?", [
                {
                    "content_type": "text",
                    "title": "Seguir pidiendo",
                    "payload": "SendContinueOrder"
                },
                {
                    "content_type": "text",
                    "title": "Ver carrito",
                    "payload": "SendCart"
                }
            ]);
        });
    }, function (object, error) {
        console.log(error);
    });
}
function sendContinueOrder(recipientId, senderId) {
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        bot.sendTextMessage(recipientId, senderId, "Puedes escribir el nombre de un producto, ej: Ensalada mediterranea, o seleccionarlo en el siguiente menú:").then(function () {
            sendCategories(recipientId, senderId, 0);
        });
    });
}
function sendModifierMenu(recipientId, senderId, productId, modifier, items) {
    var quick_replies = [];
    items.forEach(function (item) {
        if (quick_replies.length <= bot.limit) {
            quick_replies.push({
                "content_type": "text",
                "title": item.name,
                "payload": "AddModifier-" + productId + "-" + modifier.objectId + "-" + item.objectId
            });
        }
    });
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendQuickReplyMessage(recipientId, senderId, "Escoge " + modifier.name + ":", quick_replies);
    });
}
function addModifier(recipientId, senderId, productId, modifierId, itemId) {
    var cart = getData(recipientId, 'cart');
    var items = cart.items;
    var item = items.get(productId);
    var orderItemModifier = new ParseModels_1.OrderItemModifier();
    orderItemModifier.set('modifier', {
        __type: "Pointer",
        className: "Modifier",
        objectId: modifierId
    });
    orderItemModifier.set('modifierItem', {
        __type: "Pointer",
        className: "ModifierItem",
        objectId: itemId
    });
    //orderItemModifier.set('price', itemId.price)
    orderItemModifier.save(undefined, {
        success: function (result) {
            item.modifiers.push({
                __type: "Pointer",
                className: "OrderItemModifier",
                objectId: result.id
            });
            saveCart(recipientId);
            sendAddProductNenu(recipientId, senderId, productId);
        },
        error: function (user, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
}
function checkModifiers(recipientId, productId, modifiers) {
    var cart = getData(recipientId, 'cart');
    var items = cart.items;
    var item = items.get(productId);
    var exist = false;
    var result = [];
    modifiers.forEach(function (modifier) {
        exist = false;
        item.modifiers.forEach(function (itemModifier) {
            console.log(itemModifier.objectId);
            //exist true
        });
        if (!exist) {
            result.push(modifier);
        }
    });
    return result;
}
function checkModifiersComplete(recipientId, senderId, productId, modifiers) {
    var cart = getData(recipientId, 'cart');
    var items = cart.items;
    var item = items.get(productId);
    var promises = [];
    console.log(modifiers);
    console.log(modifiers.length);
    console.log(cart.items);
    console.log(item);
    console.log(item.modifiers.length);
    if (modifiers.length != item.modifiers.length) {
        promises = [];
        modifiers.forEach(function (modifier) {
            modifier.items.forEach(function (modifierItem) {
                promises.push(new parse_1.default.Query(ParseModels_1.ModifierItem).get(modifierItem.objectId).then(function (modifierItem) {
                    return parseUtils_1.extractParseAttributes(modifierItem);
                }));
            });
            return parse_1.default.Promise.when(promises).then(function (elements) {
                sendModifierMenu(recipientId, senderId, productId, modifier, elements);
                return true;
            });
        });
    }
}
function removeProduct(recipientId, senderId, productId) {
    var cart = getData(recipientId, 'cart');
    if (cart == undefined) {
        cart = createCart(recipientId);
    }
    var items = cart.items;
    var item = items.get(productId);
    new parse_1.default.Query(ParseModels_1.OrderItem).get(item.id, {
        success: function (orderItem) {
            orderItem.destroy({});
            items.delete(productId);
            var itemsPointers = [];
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var _a = items_1[_i], key = _a[0], value = _a[1];
                itemsPointers.push({ "__type": "Pointer", "className": "OrderItem", "objectId": value.id });
            }
            cart.itemsPointers = itemsPointers;
            if (items.size == 0) {
                sendCart(recipientId, senderId);
            }
            else {
                sendCartDetails(recipientId, senderId);
            }
        },
        error: function (orderItem, error) {
            console.log('error');
            console.log(error);
        }
    });
}
function increaseOneProduct(recipientId, senderId, productId) {
    var cart = getData(recipientId, 'cart');
    if (cart == undefined) {
        cart = createCart(recipientId);
    }
    var items = cart.items;
    var item = items.get(productId);
    item.quantity++;
    new parse_1.default.Query(ParseModels_1.OrderItem).get(item.id, {
        success: function (orderItem) {
            orderItem.set('amount', item.quantity);
            orderItem.save();
            sendCartDetails(recipientId, senderId);
        },
        error: function (orderItem, error) {
            console.log('error');
            console.log(error);
        }
    });
}
function decreaseOneProduct(recipientId, senderId, productId) {
    var cart = getData(recipientId, 'cart');
    if (cart == undefined) {
        cart = createCart(recipientId);
    }
    var items = cart.items;
    var item = items.get(productId);
    item.quantity--;
    if (item.quantity > 0) {
        new parse_1.default.Query(ParseModels_1.OrderItem).get(item.id, {
            success: function (orderItem) {
                orderItem.set('amount', item.quantity);
                orderItem.save();
                sendCartDetails(recipientId, senderId);
            },
            error: function (orderItem, error) {
                console.log('error');
                console.log(error);
            }
        });
    }
    else {
        removeProduct(recipientId, senderId, productId);
    }
}
function sendProductDescription(recipientId, senderId, productId) {
    var product = new ParseModels_1.Product();
    new parse_1.default.Query(product).get(productId).then(function (product) {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendQuickReplyMessage(recipientId, senderId, product.get('name') + ": " + product.get('description'), [
                {
                    "content_type": "text",
                    "title": "Agregar",
                    "payload": "AddProduct-" + productId
                },
                {
                    "content_type": "text",
                    "title": "Seguir pidiendo",
                    "payload": "SendContinueOrder"
                },
                {
                    "content_type": "text",
                    "title": "Ver carrito",
                    "payload": "SendCart"
                }
            ]);
        });
    }, function (object, error) {
        console.log(error);
    });
}
function saveCart(recipientId) {
    var consumerCart = new ParseModels_1.Cart();
    var consumer = getData(recipientId, 'consumer');
    var address = getData(recipientId, 'address');
    var cart = getData(recipientId, 'cart');
    var paymentMethod = getData(recipientId, 'paymentMethod');
    var items = [];
    var item;
    for (var _i = 0, _a = cart.items; _i < _a.length; _i++) {
        var _b = _a[_i], id = _b[0], properties = _b[1];
        item = new ParseModels_1.OrderItem();
        if (properties.hasOwnProperty('id')) {
            item.set('id', properties.id);
        }
        item.set('product', {
            __type: "Pointer",
            className: "Product",
            objectId: id
        });
        item.set('price', properties.price);
        item.set('amount', properties.quantity);
        item.set('modifiers', properties.modifiers);
        item.set('modifiersGroups', []);
        items.push(item);
    }
    parse_1.default.Object.saveAll(items, {
        success: function (result) {
            var itemsPointers = [];
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var item_1 = result_1[_i];
                var itemId = item_1.get('product').objectId;
                cart.items.get(itemId).id = item_1.id;
                itemsPointers.push({ "__type": "Pointer", "className": "OrderItem", "objectId": item_1.id });
            }
            if (cart.hasOwnProperty('id')) {
                consumerCart.set('id', cart.id);
            }
            if (typeof paymentMethod != 'undefined') {
                consumerCart.set('paymentMethod', paymentMethod.method);
            }
            consumerCart.set('consumerAddress', {
                __type: "Pointer",
                className: "ConsumerAddress",
                objectId: address.objectId
            });
            consumerCart.set('consumer', {
                __type: "Pointer",
                className: "Consumer",
                objectId: consumer.objectId
            });
            consumerCart.set('items', itemsPointers);
            consumerCart.save(undefined, {
                success: function (result) {
                    cart['id'] = result.id;
                    cart['rawParseObject'] = result;
                    cart['itemsPointers'] = itemsPointers;
                },
                error: function (user, error) {
                    console.log('Failed to create new object, with error code: ' + error.message);
                }
            });
        },
        error: function (user, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
}
function saveOrder(recipientId, senderId) {
    getOrderState(0).then(function (state) {
        var order = new ParseModels_1.Order();
        var consumer = getData(recipientId, 'consumer');
        var customer = getData(recipientId, 'customer');
        var cart = getData(recipientId, 'cart');
        var address = getData(recipientId, 'address');
        var paymentMethod = getData(recipientId, 'paymentMethod');
        var pointSale = getData(recipientId, 'pointSale');
        var total = 0;
        cart.items.forEach(function (value, key) {
            total += value.quantity * value.price;
        });
        order.set('consumer', { __type: 'Pointer', className: 'Consumer', objectId: consumer.objectId });
        order.set('consumerAddress', { __type: 'Pointer', className: 'ConsumerAddress', objectId: address.objectId });
        order.set('pointSale', { __type: 'Pointer', className: 'CustomerPointSale', objectId: pointSale.objectId });
        order.set('state', { __type: 'Pointer', className: 'OrderState', objectId: state.objectId });
        order.set('items', cart.itemsPointers);
        order.set('deliveryCost', pointSale.deliveryCost);
        order.set('total', total);
        order.set('paymentMethod', paymentMethod.method);
        order.set('name', consumer.name);
        order.set('email', consumer.email);
        order.set('phone', consumer.phone);
        order.set('platform', 'Bot');
        order.save(undefined, {
            success: function (order) {
                ParseModels_1.Order.setOrder(recipientId, order).then(function () {
                    clearCart(recipientId);
                });
            },
            error: function (user, error) {
                console.log('Failed to create new object, with error code: ' + error.message);
                console.log(error);
            }
        });
    });
}
function sendPurchaseOptions(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendQuickReplyMessage(recipientId, senderId, "Tenemos las siguientes opciones disponibles:", [
                {
                    "content_type": "text",
                    "title": "Ver categorias",
                    "payload": "SendCategories-0"
                },
                {
                    "content_type": "text",
                    "title": "Ver carrito",
                    "payload": "SendCart"
                }
            ]);
        });
    });
}
function sendEmptyCartOptions(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendQuickReplyMessage(recipientId, senderId, "Tenemos las siguientes opciones disponibles:", [
                {
                    "content_type": "text",
                    "title": "Ver categorias",
                    "payload": "SendCategories-0"
                },
                {
                    "content_type": "text",
                    "title": "Mis órdenes",
                    "payload": "SendOrders"
                }
            ]);
        });
    });
}
function sendCart(recipientId, senderId) {
    bot.sendTypingOn(recipientId, senderId).then(function () {
        authentication(recipientId, senderId).then(function () {
            bot.clearListener(recipientId);
            var user = getData(recipientId, 'user');
            var customer = getData(recipientId, 'customer');
            var cart = getData(recipientId, 'cart');
            var customer_image_url;
            if (typeof customer != 'undefined') {
                customer_image_url = customer.image.url;
            }
            if (cart == undefined) {
                cart = createCart(recipientId);
            }
            var items = cart.items;
            var elements = [];
            var element = {};
            var total = 0;
            var orderLimit = items.size;
            var ind = 0;
            var image;
            var image_url;
            if (orderLimit == 0) {
                bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendTextMessage(recipientId, senderId, "Tu carrito de compras está vacío.").then(function () {
                        sendEmptyCartOptions(recipientId, senderId);
                    });
                });
            }
            else {
                items.forEach(function (value, key) {
                    var product = new parse_1.default.Query(ParseModels_1.Product);
                    product.get(key, {
                        success: function (item) {
                            image = item.get('image');
                            image_url = customer_image_url;
                            if (image) {
                                image_url = image.url();
                            }
                            element = {};
                            element['title'] = item.get('name');
                            element['subtitle'] = item.get('description');
                            element['quantity'] = value.quantity;
                            element['price'] = parseInt(item.get('priceDefault'));
                            element['currency'] = "COP";
                            element['image_url'] = image_url;
                            elements.push(element);
                            total += element['quantity'] * element['price'];
                            ind++;
                            if (ind == orderLimit) {
                                sendCartReceipt(recipientId, senderId, cart.id, elements, total);
                            }
                        },
                        error: function (error) {
                            alert("Error: " + error.code + " " + error.message);
                        }
                    });
                });
            }
        });
    });
}
function sendCartReceipt(recipientId, senderId, cartId, elements, total) {
    var user = getData(recipientId, 'user');
    var consumer = getData(recipientId, 'consumer');
    var address = getData(recipientId, 'address');
    var pointSale = getData(recipientId, 'pointSale');
    var payment_method = getData(recipientId, 'payment_method');
    var addressData = undefined;
    if (typeof pointSale == 'undefined') {
        bot.sendTextMessage(recipientId, senderId, "No has registrado una dirección correcta, por favor registrala para visualizar el carrito").then(function () {
            sendAddresses(recipientId, senderId);
        });
    }
    else {
        if (typeof address != 'undefined') {
            addressData = {
                street_1: address.address ? address.address : 'Dirección no definida',
                street_2: address.description ? address.description : 'Sin complemento',
                city: address.city ? address.city : 'No definida',
                postal_code: address.postalCode ? address.postalCode : 'No definido',
                state: address.state ? address.state : 'No definido',
                country: address.countryCode ? address.countryCode : 'No definido'
            };
        }
        if (typeof payment_method == 'undefined') {
            payment_method = { name: 'Sin definir' };
        }
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendReceiptMessage(recipientId, senderId, {
                template_type: "receipt",
                recipient_name: user.first_name + " " + user.last_name,
                order_number: cartId,
                currency: "COP",
                payment_method: payment_method.name,
                timestamp: Math.trunc(Date.now() / 1000).toString(),
                elements: elements,
                address: addressData,
                summary: {
                    subtotal: total,
                    shipping_cost: pointSale.deliveryCost,
                    total_cost: total + pointSale.deliveryCost
                }
            }, [
                {
                    "content_type": "text",
                    "title": "Finalizar pedido",
                    "payload": "CheckOrder"
                },
                {
                    "content_type": "text",
                    "title": "Seguir Pidiendo",
                    "payload": "SendContinueOrder"
                },
                {
                    "content_type": "text",
                    "title": "Modificar carrito",
                    "payload": "SendCartDetails"
                },
                {
                    "content_type": "text",
                    "title": "Borrar carrito",
                    "payload": "ClearAndSendCart"
                }
            ]);
        });
    }
}
function sendCartDetails(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        var cart = getData(recipientId, 'cart');
        var customer = getData(recipientId, 'customer');
        var consumer = getData(recipientId, 'consumer');
        var image_url = customer.image.url;
        var items = cart.items;
        var promises = [];
        items.forEach(function (value, key) {
            if (promises.length <= bot.limit) {
                promises.push(new parse_1.default.Query(ParseModels_1.Product).get(key).then(function (product) {
                    var image = product.get('image');
                    if (image) {
                        image_url = image.url();
                    }
                    return {
                        "title": product.get('name') + ": $" + value.price,
                        "subtitle": "Cantidad solicitada: " + value.quantity,
                        "image_url": image_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Quitar",
                                "payload": "RemoveProduct-" + key
                            },
                            {
                                "type": "postback",
                                "title": "Aumentar 1",
                                "payload": "IncreaseOneProduct-" + key
                            },
                            {
                                "type": "postback",
                                "title": "Disminuir 1",
                                "payload": "DecreaseOneProduct-" + key
                            }
                        ]
                    };
                }));
            }
        });
        return parse_1.default.Promise.when(promises).then(function (elements) {
            return bot.sendTypingOff(recipientId, senderId).then(function () {
                return bot.sendGenericMessage(recipientId, senderId, elements).then(function () {
                    sendEditCartOptions(recipientId, senderId);
                });
            });
        });
    });
}
function sendEditCartOptions(recipientId, senderId) {
    return bot.sendQuickReplyMessage(recipientId, senderId, "Opciones del carrito:", [
        {
            "content_type": "text",
            "title": "Finalizar pedido",
            "payload": "CheckOrder"
        },
        {
            "content_type": "text",
            "title": "Seguir pidiendo",
            "payload": "SendContinueOrder"
        }
    ]);
}
function editCart(recipientId, senderId) {
    var cart = getData(recipientId, 'cart');
    bot.sendTypingOn(recipientId, senderId);
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendGenericMessage(recipientId, senderId, [
            {
                "title": "Opciones",
                "image_url": SERVER_URL + "assets/thinking.jpg",
                "buttons": [
                    {
                        "type": "web_url",
                        "url": SERVER_URL + "cart?" + cart.id,
                        "title": "Remover producto",
                        "webview_height_ratio": "full",
                        "messenger_extensions": true
                    }
                ]
            }
        ]);
    });
}
function clearCart(recipientId) {
    var cart = getData(recipientId, 'cart');
    if (typeof cart != 'undefined') {
        var items_2 = cart.items;
        cart.itemsPointers = [];
        items_2.forEach(function (value, key) {
            items_2.delete(key);
        });
    }
    return new Promise(function (resolve, reject) {
        resolve();
    });
}
function clearAndSendCart(recipientId, senderId) {
    clearCart(recipientId).then(function () {
        sendCart(recipientId, senderId);
    });
}
function checkOrder(recipientId, senderId) {
    var cart = getData(recipientId, 'cart');
    var consumer = getData(recipientId, 'consumer');
    var pointSale = getData(recipientId, 'pointSale');
    var total = 0;
    console.log('checkOrder');
    if (typeof cart != 'undefined') {
        cart.items.forEach(function (value, key) {
            total += value.quantity * value.price;
        });
    }
    else {
        cart = createCart(recipientId);
    }
    if (typeof pointSale == 'undefined') {
        bot.sendTextMessage(recipientId, senderId, "No has registrado una dirección correcta, por favor registrala para visualizar el carrito").then(function () {
            sendAddresses(recipientId, senderId);
        });
    }
    else {
        if (pointSale.minOrderPrice && pointSale.minOrderPrice > total) {
            sendMinOrderPriceRestriction(recipientId, senderId);
        }
        else if (typeof consumer.phone == 'undefined' || consumer.phone == '') {
            setTelephone(recipientId, senderId);
        }
        else if (typeof consumer.email == 'undefined' || consumer.email == '') {
            setEmail(recipientId, senderId);
        }
        else {
            checkPayment(recipientId, senderId);
        }
    }
}
function checkAddress(recipientId, senderId) {
}
function checkPayment(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        ParseModels_1.PaymentMethod.loadInStore(store, recipientId, senderId).then(function () {
            var paymentMethods = getData(recipientId, 'paymentMethods');
            var quick_replies = [];
            for (var i in paymentMethods) {
                quick_replies.push({
                    "content_type": "text",
                    "title": paymentMethods[i].name.substring(0, 20),
                    "payload": "Checkout-" + paymentMethods[i].objectId
                });
            }
            return bot.sendTypingOff(recipientId, senderId).then(function () {
                return bot.sendQuickReplyMessage(recipientId, senderId, "Como vas a pagar tu pedido? (Tu pedido se cobra cuando lo recibes)", quick_replies);
            });
        });
    });
}
function checkout(recipientId, senderId, id) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        ParseModels_1.PaymentMethod.setPaymentMethod(store, recipientId, id).then(function () {
            var state = store.getState();
            var paymentTypes = state['paymentTypes'];
            var paymentMethod = getData(recipientId, 'paymentMethod');
            var paymentFunction = paymentTypes[paymentMethod.method.objectId];
            paymentFunction(recipientId, senderId);
        });
    });
}
function sendMinOrderPriceRestriction(recipientId, senderId) {
    var pointSale = getData(recipientId, 'pointSale');
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendTextMessage(recipientId, senderId, "El valor minimo de una orden con domicilio es " + pointSale.minOrderPrice + ", \npor favor modifica tu pedido para cumplir este requisito").then(function () {
            sendPurchaseOptions(recipientId, senderId);
        });
    });
}
function sendScheduleRestriction(recipientId, senderId, pointSaleSchedules) {
    var pointSale = getData(recipientId, 'pointSale');
    var days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    var text = 'En este momento nuestros puntos de venta estan cerrados, \npor favor solicita tu domicilio en los siguientes horarios:\n\n';
    for (var _i = 0, pointSaleSchedules_1 = pointSaleSchedules; _i < pointSaleSchedules_1.length; _i++) {
        var pointSaleSchedule = pointSaleSchedules_1[_i];
        var daysActive = pointSaleSchedule.get('daysActive');
        var allDay = pointSaleSchedule.get('allDay');
        for (var dayID in daysActive) {
            var ID = parseInt(dayID);
            if ((daysActive.length - 1) != ID) {
                text += days[daysActive[dayID] - 1] + ", ";
            }
            else {
                text += "y " + days[daysActive[dayID] - 1] + " ";
            }
        }
        if (allDay) {
            text += 'las 24 horas\n';
        }
        else {
            text += "desde las " + pointSaleSchedule.get('hourStart') + " ";
            text += "hasta las " + pointSaleSchedule.get('hourEnd');
        }
        text += "\n";
    }
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendTextMessage(recipientId, senderId, text).then(function () {
            sendMenu(recipientId, senderId);
        });
    });
}
function sendCash(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        var paymentMethod = getData(recipientId, 'paymentMethod');
        saveCart(recipientId);
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, "Se ha registrado el pago con " + paymentMethod.name).then(function () {
                orderConfirmation(recipientId, senderId);
            });
        });
    });
}
function registerCreditCard(recipientId, senderId) {
    bot.sendTypingOn(recipientId, senderId);
    authentication(recipientId, senderId).then(function () {
        var consumer = getData(recipientId, 'consumer');
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendGenericMessage(recipientId, senderId, [{
                    "title": "Registro de tarjeta de credito y finalización de tu pedido.\n\nEstas de acuerdo?",
                    "image_url": SERVER_URL + "assets/images/creditCards.jpg",
                    "subtitle": "Por razones de seguridad te redireccionaremos a una página web segura.",
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Si",
                            "url": SERVER_URL + "creditCard?id=" + consumer.objectId,
                            "webview_height_ratio": "full",
                            "messenger_extensions": true
                        },
                        {
                            "type": "postback",
                            "title": "No",
                            "payload": "CancelRegisterCreditCard"
                        }
                    ]
                }]);
        });
    });
}
function registerCreditCardAndPay(recipientId, senderId) {
    bot.setDataBuffer(recipientId, 'creditCardPayload', 'SendCreditCards');
    registerCreditCard(recipientId, senderId);
}
function cancelRegisterCreditCard(recipientId, senderId) {
    bot.sendTypingOn(recipientId, senderId).then(function () {
        var userBuffer = bot.buffer[recipientId];
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, "Si no ingresas los datos de tu tarjeta en nuestro sitio seguro, no podras comprar con tarjeta online").then(function () {
                if (typeof userBuffer != 'undefined' && userBuffer.hasOwnProperty('creditCardPayload')) {
                    checkPayment(recipientId, senderId);
                }
                else {
                    sendAccount(recipientId, senderId);
                }
            });
        });
    });
}
function sendRegisteredCreditCards(recipientId, senderId) {
    bot.sendTypingOn(recipientId, senderId).then(function () {
        var user = getData(recipientId, 'user');
        var consumer = getData(recipientId, 'consumer');
        ParseModels_1.CreditCard.loadInStore(store, recipientId, user).then(function () {
            var creditCards = getData(recipientId, 'creditCards');
            if (creditCards.length == 0) {
                return bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendQuickReplyMessage(recipientId, senderId, "Aun no tienes tarjetas registradas, deseas registrar una tarjeta?", [
                        {
                            "content_type": "text",
                            "title": "Si",
                            "payload": "RegisterCreditCardAndPay"
                        },
                        {
                            "content_type": "text",
                            "title": "No",
                            "payload": "CheckPayment"
                        }
                    ]);
                });
            }
            else {
                var creditCards_2 = getData(recipientId, 'creditCards');
                var quick_replies_1 = [];
                quick_replies_1.push({
                    "content_type": "text",
                    "title": "Agregar tarjeta",
                    "payload": "RegisterCreditCardAndPay"
                });
                for (var _i = 0, creditCards_3 = creditCards_2; _i < creditCards_3.length; _i++) {
                    var card = creditCards_3[_i];
                    if (quick_replies_1.length < bot.limit) {
                        quick_replies_1.push({
                            "content_type": "text",
                            "title": card.type + " " + card.lastFour,
                            "payload": "PayWithCreditCard-" + card.lastFour
                        });
                    }
                }
                return bot.sendTypingOff(recipientId, senderId).then(function () {
                    return bot.sendQuickReplyMessage(recipientId, senderId, "Con cual tarjeta quieres pagar?", quick_replies_1);
                });
            }
        });
    });
}
function payWithCreditCard(recipientId, senderId, creditCardId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        orderConfirmation(recipientId, senderId);
    });
}
function orderConfirmation(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        saveOrder(recipientId, senderId);
        getOrderState(0).then(function (state) {
            return bot.sendTypingOff(recipientId, senderId).then(function () {
                return bot.sendTextMessage(recipientId, senderId, state.messagePush + "\n\nEn un momento te estaremos dando información en tiempo real sobre tu pedido");
            });
        });
    });
}
function sendorderMapState(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, "Buenas noticias, Tu pedido ha sido Enviado. \n\nHaz click en el mapa para vel tu pedido").then(function () {
                sendserviceRating(recipientId, senderId);
            });
        });
    });
}
function sendOrderState(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        var orderState = getData(recipientId, 'orderState');
        var pointSale = getData(recipientId, 'pointSale');
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            switch (orderState.order) {
                case 1:
                    return bot.sendTextMessage(recipientId, senderId, "Tu pedido ha sido Aceptado. \n\nLo estan preparando en nuestra sede y te lo enviaremos en aproximadamente " + pointSale.deliveryTime + " minutos");
                case 5:
                    return bot.sendTextMessage(recipientId, senderId, orderState.messagePush).then(function () {
                        sendserviceRating(recipientId, senderId);
                    });
                case 6:
                    return new Promise(function (resolve, reject) {
                        resolve();
                    });
                case 8:
                    return bot.sendTextMessage(recipientId, senderId, orderState.messagePush).then(function () {
                        sendOrders(recipientId, senderId);
                    });
                default:
                    return bot.sendTypingOff(recipientId, senderId).then(function () {
                        return bot.sendTextMessage(recipientId, senderId, orderState.messagePush);
                    });
            }
        });
    });
}
function sendserviceRating(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendQuickReplyMessage(recipientId, senderId, "Califica tu experiencia para ayudarnos a mejorar. \n\nDe 1 a 5 cuantas extrellas merece nuestro servicio?", [
                {
                    "content_type": "text",
                    "title": "5 (Excelente)",
                    "payload": "SetScore-5"
                },
                {
                    "content_type": "text",
                    "title": "4 (Bien)",
                    "payload": "SetScore-4"
                },
                {
                    "content_type": "text",
                    "title": "3 (Regular)",
                    "payload": "SetScore-3"
                },
                {
                    "content_type": "text",
                    "title": "2 (Mal)",
                    "payload": "SetScore-2"
                },
                {
                    "content_type": "text",
                    "title": "2 (Muy mal)",
                    "payload": "SetScore-1"
                },
            ]);
        });
    });
}
function setScore(recipientId, senderId, score) {
    var order = getData(recipientId, 'order');
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        parse_1.default.Cloud.run('rateOrder', { orderId: order.objectId, score: Number(score), comment: '' }).then(function (result) {
            return bot.sendTypingOff(recipientId, senderId).then(function () {
                thank(recipientId, senderId);
            });
        }, function (error) {
            console.log('error');
            console.log(error);
        });
    });
}
function thank(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, "Gracias, esperamos tener el gusto de atenderle nuevamente");
        });
    });
}
function searchProducts(recipientId, senderId, query, index) {
    var customer = getData(recipientId, 'customer');
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        parse_1.default.Cloud.run('search', { businessId: customer.businessId, q: query }).then(function (result) {
            if (result.length == 0) {
                renderSearchEmpty(recipientId, senderId);
            }
            else if (result.length == 1 && result[0].type == 'Category') {
                sendProducts(recipientId, senderId, result[0].id, 0);
            }
            else {
                if (index == undefined)
                    index = 0;
                else if (typeof index == 'string')
                    index = parseInt(index);
                if (index == 0) {
                    renderSearchInitial(recipientId, senderId);
                }
                splitSearchResult(recipientId, result, index).then(function (elements) {
                    var idx = Object.keys(result).length;
                    var buttons = [];
                    var catIni = (index + 1) * bot.limit;
                    var catFin = (idx > catIni + bot.limit) ? catIni + bot.limit : idx;
                    if (idx > (index + 1) * bot.limit) {
                        buttons.push({
                            type: "postback",
                            title: "Productos " + (catIni + 1) + "-" + catFin,
                            payload: "Search-" + (index + 1),
                        });
                        elements.push({
                            title: "Ver más productos ",
                            subtitle: "Productos disponibles",
                            buttons: buttons
                        });
                    }
                    return bot.sendTypingOff(recipientId, senderId).then(function () {
                        return bot.sendGenericMessage(recipientId, senderId, elements);
                    });
                });
            }
        }, function (error) {
            console.log('error');
            console.log(error);
        });
    });
}
function renderSearchInitial(recipientId, senderId) {
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendTextMessage(recipientId, senderId, "Se han encontrado los siguientes productos:");
    });
}
function renderSearchEmpty(recipientId, senderId) {
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendTextMessage(recipientId, senderId, "No se han encontrado productos que coincidan");
    });
}
function splitSearchResult(recipientId, products, index) {
    var customer = getData(recipientId, 'customer');
    var image_url;
    var idx = 0;
    var elements = [];
    var promises = [];
    products.forEach(function (item) {
        if (item && item.name && item.type == 'Product') {
            if (idx >= (index) * bot.limit && idx < (index + 1) * bot.limit) {
                promises.push(new parse_1.default.Query(ParseModels_1.Product).get(item.id).then(function (product) {
                    return parseUtils_1.extractParseAttributes(product);
                }));
                idx = idx + 1;
            }
        }
    });
    return parse_1.default.Promise.when(promises).then(function (productObjects) {
        productObjects.forEach(function (product) {
            var image = product.image;
            image_url = (typeof image != 'undefined') ? image.url : customer.image.url;
            elements.push({
                title: product.name + ": $" + product.priceDefault,
                subtitle: product.description,
                image_url: image_url,
                buttons: [{
                        type: "postback",
                        title: 'Agregar',
                        payload: "AddProduct-" + product.objectId,
                    },
                    {
                        type: "postback",
                        title: 'Ver descripción',
                        payload: "SendProductDescription-" + product.objectId,
                    }]
            });
        });
        return elements;
    });
    //    subtitle: item.get('description'),
}
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
function sendOrders(recipientId, senderId) {
    var customer = getData(recipientId, 'customer');
    bot.sendTypingOn(recipientId, senderId).then(function () {
        authentication(recipientId, senderId).then(function () {
            bot.clearListener(recipientId);
            var consumer = getData(recipientId, 'consumer');
            parse_1.default.Cloud.run('ordersBot', { businessId: customer.businessId, consumerId: consumer.objectId }).then(function (orders) {
                ParseModels_1.Order.setOrders(store, recipientId, orders).then(function () {
                    renderOrders(recipientId, senderId);
                });
            }).fail(function (error) {
                console.log('error');
                console.log(error);
            });
        });
    });
}
function renderOrders(recipientId, senderId) {
    var customer = getData(recipientId, 'customer');
    var orders = getData(recipientId, 'orders');
    var elements = [];
    elements.push({
        "title": "Nueva orden",
        "subtitle": "Puedes realizar una orden",
        "image_url": SERVER_URL + "assets/images/newOrden.jpg",
        "buttons": [
            {
                "type": "postback",
                "title": "Nueva orden",
                "payload": "NewOrder"
            }
        ]
    });
    for (var _i = 0, _a = orders.ongoing; _i < _a.length; _i++) {
        var order = _a[_i];
        var pointSale = order.pointSale;
        if (elements.length < bot.limit) {
            var datetime = datetime_converter_nodejs_1.default.dateString(order.createdAt);
            var image_url = customer.image.url;
            var title = (order.orderNumber) ? 'Orden: ' + order.orderNumber : 'Orden: ' + dateformat_1.default(datetime, "h:MM:ss TT dd/mm/yyyy");
            elements.push({
                "title": title,
                "subtitle": 'Estado: ' + order.state.name + ', Valor: $' + (order.total + pointSale.deliveryCost),
                "image_url": image_url,
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Ver orden",
                        "payload": "SendOrder-" + order.objectId
                    },
                    {
                        "type": "postback",
                        "title": "Cancelar orden",
                        "payload": "CancelOrder-" + order.objectId
                    }
                ]
            });
        }
    }
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendGenericMessage(recipientId, senderId, elements);
    });
}
function sendOrder(recipientId, senderId, id) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        authentication(recipientId, senderId).then(function () {
            var orders = getData(recipientId, 'orders');
            var customer = getData(recipientId, 'customer');
            var customer_image_url = customer.image.url;
            var currentOrder;
            var elements = [];
            var element;
            var image_url;
            var product;
            for (var _i = 0, _a = orders.ongoing; _i < _a.length; _i++) {
                var order = _a[_i];
                if (order.objectId == id) {
                    currentOrder = order;
                }
            }
            for (var _b = 0, _c = currentOrder.items; _b < _c.length; _b++) {
                var item = _c[_b];
                product = item.product;
                image_url = customer_image_url;
                if (product.image) {
                    image_url = product.image.url;
                }
                element = {};
                element['title'] = product.name;
                element['quantity'] = item.amount;
                element['price'] = item.price;
                element['currency'] = "COP";
                element['image_url'] = image_url;
                elements.push(element);
            }
            renderOrder(recipientId, senderId, currentOrder, elements);
        });
    });
}
function renderOrder(recipientId, senderId, order, elements) {
    var user = getData(recipientId, 'user');
    var consumer = getData(recipientId, 'consumer');
    var address = order.consumerAddress;
    var pointSale = order.pointSale;
    var payment_method = order.paymentMethod;
    var addressData = undefined;
    if (typeof payment_method == 'undefined') {
        payment_method = { name: 'Sin definir' };
    }
    if (typeof address != 'undefined') {
        addressData = {
            street_1: address.address ? address.address : 'Dirección no definida',
            street_2: address.description ? address.description : 'Sin complemento',
            city: address.city ? address.city : 'No definida',
            postal_code: address.postalCode ? address.postalCode : 'No definido',
            state: address.state ? address.state : 'No definido',
            country: address.countryCode ? address.countryCode : 'No definido'
        };
    }
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendReceiptMessage(recipientId, senderId, {
            template_type: "receipt",
            recipient_name: user.first_name + " " + user.last_name,
            order_number: order.objectId,
            currency: "COP",
            payment_method: payment_method.name,
            timestamp: Math.trunc(Date.now() / 1000).toString(),
            elements: elements,
            address: addressData,
            summary: {
                subtotal: order.total,
                shipping_cost: pointSale.deliveryCost,
                total_cost: order.total + pointSale.deliveryCost
            }
        }, [
            {
                "content_type": "text",
                "title": "Nueva orden",
                "payload": "NewOrder"
            },
            {
                "content_type": "text",
                "title": "Ver órdenes",
                "payload": "SendOrders"
            },
            {
                "content_type": "text",
                "title": "Cancelar orden",
                "payload": "CancelOrder-" + order.objectId
            }
        ]);
    });
}
function newOrder(recipientId, senderId) {
    clearCart(recipientId).then(function () {
        sendAddressesWithTitle(recipientId, senderId);
    });
}
function cancelOrder(recipientId, senderId, id) {
    parse_1.default.Cloud.run('changeStatusOrder', { status: "canceledByUser", orderId: id }).then(function () {
    }).fail(function (error) {
        console.log('error');
        console.log(error);
    });
}
function sendAccount(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        authentication(recipientId, senderId).then(function () {
            bot.clearListener(recipientId);
            renderAccount(recipientId, senderId);
        });
    });
}
function renderAccount(recipientId, senderId) {
    var user = getData(recipientId, 'user');
    var consumer = getData(recipientId, 'consumer');
    var elements = [{
            "title": 'Ver direcciones',
            "subtitle": 'Editar y eliminar direcciones',
            "image_url": SERVER_URL + "assets/images/addresses.jpg",
            "buttons": [
                {
                    "type": "postback",
                    "title": 'Ver direcciones',
                    "payload": "SendAddresses"
                }
            ]
        }, {
            "title": 'Ver tarjetas de credito',
            "subtitle": 'Editar y eliminar tarjetas de credito',
            "image_url": SERVER_URL + "assets/images/creditCards.jpg",
            "buttons": [
                {
                    "type": "postback",
                    "title": 'Ver tarjetas',
                    "payload": "SendCreditCards"
                }
            ]
        }];
    return bot.sendTypingOff(recipientId, senderId).then(function () {
        return bot.sendGenericMessage(recipientId, senderId, elements);
    });
}
function sendYouAreWelcome(recipientId, senderId) {
    return bot.sendTypingOn(recipientId, senderId).then(function () {
        return bot.sendTypingOff(recipientId, senderId).then(function () {
            return bot.sendTextMessage(recipientId, senderId, "De nada, gracias por usar nuestros servicios");
        });
    });
}
function addCreditCard(recipientId, senderId, token, data) {
    var customer = getData(recipientId, 'customer');
    var expiration = data['expiry'].replace(/\s+/g, "").split('/');
    return request_promise_1.default({
        uri: PARSE_SERVER_URL + '/functions/addCreditCard',
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
            'X-Parse-Application-Id': PARSE_APP_ID,
            'X-Parse-Session-Token': token
        },
        method: 'POST',
        json: {
            "businessId": customer.businessId,
            "number": data['number'].replace(/\s+/g, ""),
            "holderName": data['holderName'],
            "verificationNumber": data['cvc'],
            "expirationMonth": expiration[0],
            "expirationYear": expiration[1]
        }
    }).then(function (body) {
        request_promise_1.default({
            uri: SERVER_URL + 'creditCardRegistered',
            method: 'POST',
            json: { "recipientId": recipientId, "senderId": senderId }
        });
    }).catch(function (error) {
        console.log('error');
        console.log(error);
        var response = error.response;
        //console.log(JSON.stringify(error, null, 1));
        console.log(JSON.stringify(response.body, null, 1));
    });
}
function getOrderState(orderStateNumber) {
    return new parse_1.default.Query(ParseModels_1.OrderState).equalTo('order', orderStateNumber).find().then(function (state) {
        return parseUtils_1.extractParseAttributes(state[0]);
    }, function (object, error) {
        console.log(error);
    });
}
function app(server) {
    /*
    let router = server.loopback.Router();
    server.use(router);
    server.get('/', (req, res) =>{
      res.status(200).send('Speedy Bot!');
    });
    */
    server.get('/authorize', bot.authorize);
    server.get('/webhook', bot.verifyToken);
    server.post('/webhook', bot.router);
}
exports.app = app;
;
createLocalStore(reducer);
module.exports = app;
