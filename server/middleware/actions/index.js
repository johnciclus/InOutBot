"use strict";
var parse_1 = require("../parse");
var types = require("../constants/actionTypes");
var GetProductsParams_1 = require("../models/GetProductsParams");
var ParseModels_1 = require("../models/ParseModels");
var parseUtils_1 = require("../parseUtils");
/**
 * Load Consumer of given user
 */ loadConsumerCreditCards;
function loadCustomer(recipientId, businessId) {
    if (businessId == null)
        return;
    return function (dispatch) {
        return new parse_1.default.Query(ParseModels_1.Customer).contains('businessId', businessId).limit(1).first().then(function (customer) {
            dispatch({ type: types.CUSTOMER_LOADED, data: { recipientId: recipientId, customer: customer } });
        }).fail(function (e) {
            dispatch({ type: types.CUSTOMER_NOT_FOUND, data: { recipientId: recipientId, businessId: businessId } });
        });
    };
}
exports.loadCustomer = loadCustomer;
function getCustomerByFanpage(senderId) {
    return new parse_1.default.Query(ParseModels_1.Customer).equalTo('fanpageId', senderId).first().then(function (customer) {
        return parseUtils_1.extractParseAttributes(customer);
    }).fail(function (e) {
        console.log('error: ' + e);
    });
}
exports.getCustomerByFanpage = getCustomerByFanpage;
function setCustomer(recipientId, customer) {
    return function (dispatch) {
        return parse_1.default.Promise.as().then(function () {
            dispatch({ type: types.SET_CUSTOMER, data: { recipientId: recipientId, customer: customer } });
        });
    };
}
exports.setCustomer = setCustomer;
/**
 * Load Consumer of given user
 */
function loadUser(recipientId) {
    return function (dispatch) {
        return new parse_1.default.Query(ParseModels_1.Consumer).equalTo('recipientId', parseInt(recipientId)).first().then(function (consumer) {
            if (consumer) {
                return new parse_1.default.Query(ParseModels_1.User).get(consumer.get('user').id).then(function (user) {
                    dispatch({ type: types.USER_LOADED, data: { recipientId: recipientId, user: user } });
                }).fail(function (e) {
                    dispatch({ type: types.USER_NOT_FOUND, data: {} });
                });
            }
        }).fail(function (e) {
            dispatch({ type: types.CONSUMER_NOT_FOUND, data: {} });
        });
        /*
         return new Parse.Query(User).equalTo('facebookId', recipientId).first().then(user => {
         if (user) {
         dispatch({type: types.USER_LOADED, data: {recipientId, user}})
         }
         })
         * */
    };
}
exports.loadUser = loadUser;
/**
 * Load Consumer of given user
 */
function loadConsumer(recipientId, user) {
    if (user == null)
        return;
    return function (dispatch) {
        return new parse_1.default.Query(ParseModels_1.Consumer).equalTo('user', user).first().then(function (consumer) {
            if (consumer) {
                dispatch({ type: types.CONSUMER_LOADED, data: { recipientId: recipientId, consumer: consumer } });
            }
            else {
                dispatch({ type: types.CONSUMER_NOT_FOUND, data: { user: user } });
            }
        }).fail(function (e) {
            dispatch({ type: types.CONSUMER_NOT_FOUND, data: { user: user } });
        });
    };
}
exports.loadConsumer = loadConsumer;
/**
 * Load Consumer Addresses and dispatch action with the results.
 */
function loadConsumerAddresses(recipientId, consumer) {
    if (consumer == null)
        return;
    return function (dispatch) {
        return new parse_1.default.Query(ParseModels_1.ConsumerAddress).equalTo('consumer', consumer).find().then(function (addresses) {
            dispatch({ type: types.CONSUMER_ADDRESSES_LOADED, data: { recipientId: recipientId, addresses: addresses } });
        }).fail(function (error) {
            console.log('Error ' + error);
            //TODO dispatch action with error
        });
    };
}
exports.loadConsumerAddresses = loadConsumerAddresses;
/**
 * Load Consumer Addresses and dispatch action with the results.
 */
function loadConsumerCreditCards(recipientId, user) {
    if (user == null)
        return;
    return function (dispatch) {
        return new parse_1.default.Query(ParseModels_1.CreditCard).equalTo('consumer', user).find().then(function (creditCards) {
            dispatch({ type: types.CONSUMER_CREDITCARDS_LOADED, data: { recipientId: recipientId, creditCards: creditCards } });
        }).fail(function (error) {
            console.log('Error ' + error);
            //TODO dispatch action with error
        });
    };
}
exports.loadConsumerCreditCards = loadConsumerCreditCards;
function loadOrders(recipientId, orders) {
    if (orders == undefined)
        return;
    return function (dispatch) {
    };
}
exports.loadOrders = loadOrders;
/**
 * SET_CURRENT_ADDRESS action
 */
function setAddress(recipientId, id) {
    return function (dispatch) {
        return new parse_1.default.Query(ParseModels_1.ConsumerAddress).get(id).then(function (address) {
            dispatch({ type: types.SET_CURRENT_ADDRESS, data: { recipientId: recipientId, address: address } });
        }).fail(function (error) {
            console.log('Error ' + error);
            //TODO dispatch action with error
        });
    };
}
exports.setAddress = setAddress;
/**
 * Load Payment Methods.
 */
function loadPaymentMethods(recipientId, senderId) {
    console.log(recipientId);
    return getCustomerByFanpage(senderId).then(function (customer) {
        console.log(customer);
        return function (dispatch) {
            return new parse_1.default.Cloud.run('paymentMethods', {
                languageCode: 'es',
                businessId: customer.businessId
            }).then(function (paymentMethods) {
                dispatch({ type: types.PAYMENT_METHODS_LOADED, data: { recipientId: recipientId, paymentMethods: paymentMethods } });
            });
        };
    });
}
exports.loadPaymentMethods = loadPaymentMethods;
function setPaymentMethod(recipientId, id) {
    return function (dispatch) {
        return new parse_1.default.Query(ParseModels_1.PaymentMethodLanguage).get(id).then(function (paymentMethod) {
            dispatch({ type: types.SET_PAYMENT_METHOD, data: { recipientId: recipientId, paymentMethod: paymentMethod } });
        }).fail(function (error) {
            console.log('Error ' + error);
            //TODO dispatch action with error
        });
    };
}
exports.setPaymentMethod = setPaymentMethod;
function getConsumerAndAddresses(user) {
    return function (dispatch, getState) {
        return dispatch(recipientId, loadConsumer(user)).then(function () {
            return dispatch(loadConsumerAddresses(getState().consumer.rawParseObject));
        });
    };
}
exports.getConsumerAndAddresses = getConsumerAndAddresses;
/**
 * Address Saved
 */
function addressSaved(address) {
    return {
        type: types.ADDRESS_SAVED,
        data: address
    };
}
exports.addressSaved = addressSaved;
/**
 * HIDE_ADDRESS_FORM action
 */
function hideAddressForm() {
    return { type: types.HIDE_ADDRESS_FORM };
}
exports.hideAddressForm = hideAddressForm;
/**
 * Address Saved Error
 */
function addressSaveError() { return { type: types.ADDRESS_SAVE_ERROR }; }
exports.addressSaveError = addressSaveError;
/**
 * Save ConsumerAddress on Parse.
 */
function saveConsumerAddress(consumerAddress, dispatch, pendingOrder, cart) {
    var ConsumerAddress = parse_1.default.Object.extend('ConsumerAddress');
    var parseConsumerAddress = new ConsumerAddress();
    if (!consumerAddress.consumer) {
        return;
    }
    if (consumerAddress.objectId) {
        parseConsumerAddress.objectId = consumerAddress.objectId;
    }
    var consumer = consumerAddress.consumer.rawParseObject;
    var location = consumerAddress.location;
    var parseGeoPoint = new parse_1.default.GeoPoint(location.lat, location.lng);
    parseConsumerAddress.set('location', parseGeoPoint);
    parseConsumerAddress.set('consumer', consumer);
    parseConsumerAddress.set('address', consumerAddress.address);
    parseConsumerAddress.set('name', consumerAddress.name);
    parseConsumerAddress.set('description', consumerAddress.description);
    parseConsumerAddress.save().then(function (consumerAddress) {
        dispatch(addressSaved(consumerAddress));
        dispatch(loadConsumerAddresses(consumer, dispatch));
        dispatch(hideAddressForm());
    }).fail(function (e) {
        dispatch(addressSaveError());
    });
}
function loadUserCreditCards(recipientId, user) {
    if (user == null)
        return;
    return function (dispatch) {
        return new parse_1.default.Query(ParseModels_1.CreditCard).equalTo('user', user).find().then(function (creditCards) {
            dispatch({ type: types.USER_CREDITCARDS_LOADED, data: { recipientId: recipientId, creditCards: creditCards } });
        }).fail(function (error) {
            console.log('Error ' + error);
            //TODO dispatch action with error
        });
    };
}
exports.loadUserCreditCards = loadUserCreditCards;
function setCustomerPointSale(recipientId, id) {
    return function (dispatch) {
        return new parse_1.default.Query(ParseModels_1.CustomerPointSale).get(id).then(function (pointSale) {
            dispatch({ type: types.SET_CUSTOMER_POINT_SALE, data: { recipientId: recipientId, pointSale: pointSale } });
        }).fail(function (error) {
            console.log('Error ' + error);
            //TODO dispatch action with error
        });
    };
}
exports.setCustomerPointSale = setCustomerPointSale;
function setOrder(recipientId, order) {
    return function (dispatch) {
        return parse_1.default.Promise.as().then(function () {
            dispatch({ type: types.SET_ORDER, data: { recipientId: recipientId, order: order } });
        });
    };
}
exports.setOrder = setOrder;
function setUser(recipientId, user) {
    return function (dispatch) {
        return parse_1.default.Promise.as().then(function () {
            dispatch({ type: types.SET_USER, data: { recipientId: recipientId, user: user } });
        });
    };
}
exports.setUser = setUser;
function setConsumer(recipientId, consumer) {
    return function (dispatch) {
        return parse_1.default.Promise.as().then(function () {
            dispatch({ type: types.SET_CONSUMER, data: { recipientId: recipientId, consumer: consumer } });
        });
    };
}
exports.setConsumer = setConsumer;
function setOrderState(recipientId, orderState) {
    return function (dispatch) {
        return parse_1.default.Promise.as().then(function () {
            dispatch({ type: types.SET_ORDER_STATE, data: { recipientId: recipientId, orderState: orderState } });
        });
    };
}
exports.setOrderState = setOrderState;
function setOrders(recipientId, orders) {
    return function (dispatch) {
        return parse_1.default.Promise.as().then(function () {
            dispatch({ type: types.SET_ORDERS, data: { recipientId: recipientId, orders: orders } });
        });
    };
}
exports.setOrders = setOrders;
/**
 * Load Orders from Parse calling 'orders' cloud function.
 * It will dispatch CONSUMER_ORDERS_LOADED with ongoing and delivered orders.
 */
function loadConsumerOrders(recipientId, consumer) {
    if (consumer == null)
        return;
    return function (dispatch) {
        /*
         return Parse.Cloud.run('orders').then((orders) => {
         console.log(orders);
         })
         */
        return new parse_1.default.Query(ParseModels_1.Order).equalTo('consumer', consumer).find().then(function (orders) {
            console.log(orders);
            dispatch({ type: types.CONSUMER_ORDERS_LOADED, data: { recipientId: recipientId, orders: orders } });
        }).fail(function (error) {
            console.log('Error ' + error);
        });
    };
    /*return dispatch => {
     Parse.Cloud.run('orders', { businessId: BUSINESS[senderId].BUSINESS_ID }).then(orders => {
     dispatch({
     type: types.CONSUMER_ORDERS_LOADED,
     data: orders
     })
  
     const ordersObjectId = orders.ongoing.map(o => o.id)
     const ordersQuery = new Parse.Query(Order)
     ordersQuery.containedIn('objectId', ordersObjectId)
     ordersQuery.find().then(function (o) { console.log(o) })
     const subscription = ordersQuery.subscribe()
     subscription.on('open', () => { console.log('Opened') })
     subscription.on('create', () => { console.log('created', arguments) })
     subscription.on('enter', () => { console.log('entered', arguments) })
     subscription.on('leave', () => { console.log('left', arguments) })
     subscription.on('update', (orders) => {
     console.log('Orders Updated', orders)
     dispatch({
     type: types.CONSUMER_ORDERS_LOADED,
     data: orders
     })
     })
     }).fail(e => {
     })
     }*/
}
exports.loadConsumerOrders = loadConsumerOrders;
/**
 * Load products from Parse.
 */
function loadProducts(senderId, lat, lng, category, pointSale) {
    return getCustomerByFanpage(senderId).then(function (customer) {
        return function (dispatch, getState) {
            var params = new GetProductsParams_1.default(customer.businessId);
            if (lat && lng) {
                params.lat = lat;
                params.lng = lng;
            }
            var currentCategory = getState().routing.locationBeforeTransitions.query.category;
            if (category) {
                params.category = category;
            }
            else if (currentCategory) {
                params.category = currentCategory;
            }
            if (pointSale) {
                params.pointSale = pointSale;
            }
            dispatch({ type: types.LOADING_PRODUCTS });
            parse_1.default.Cloud.run('getProducts', params).then(function (results) {
                dispatch({
                    type: types.PRODUCTS_LOADED,
                    data: results
                });
            }).fail(function (e) {
                dispatch({ type: types.PRODUCTS_LOAD_ERROR });
                try {
                    if (e.message.code === 1001) {
                        dispatch({ type: types.OUT_OF_COVERAGE, data: { lat: lat, lng: lng } });
                        dispatch(loadPointSales());
                    }
                }
                catch (e) {
                }
            });
        };
    });
}
exports.loadProducts = loadProducts;
/**
 * Filter products by given category
 */
function filterProductsByCategory(category) {
    return {
        type: types.FILTER_PRODUCTS_BY_CATEGORY,
        data: category
    };
}
exports.filterProductsByCategory = filterProductsByCategory;
/**
 * Add Product to cart action
 */
function addProductToCart(cartItem) {
    return function (dispatch, getState) {
        var cart = getState().cart;
        if (cart.consumerAddress.location.isValid()) {
            dispatch({
                type: types.ADD_TO_CART,
                data: cartItem
            });
        }
        else {
            dispatch(showAddressSearchModal());
        }
    };
}
exports.addProductToCart = addProductToCart;
/**
 * Empty cart action
 */
function emptyCart() {
    return { type: types.EMPTY_CART };
}
exports.emptyCart = emptyCart;
/**
 * Load User's Facebook data.
 */
function loadFacebookUserData(accessToken, dispatch) {
    FB.api('/me', {
        fields: 'email, first_name, last_name',
        access_token: accessToken
    }, function (res) {
        if (!res.error) {
            dispatch(facebookDataLoaded(res));
        }
        else {
        }
    });
}
/**
 * Facebook Data Loaded
 */
function facebookDataLoaded(data) {
    return { type: types.FACEBOOK_USER_DATA_LOADED, data: data };
}
exports.facebookDataLoaded = facebookDataLoaded;
/**
 * Create Consumer
 */
function createConsumer(consumerData, mainDispatch) {
    return function (dispatch) {
        var consumer = new ParseModels_1.Consumer();
        consumer.save(consumerData).then(function (consumer) {
            dispatch({ type: types.CONSUMER_CREATED, data: {
                    user: consumerData.user, consumer: consumer
                } });
            dispatch({ type: types.CONSUMER_LOADED, data: { consumer: consumer } });
            mainDispatch(push('/'));
        }).fail(function (e) {
            dispatch({ type: types.CONSUMER_NOT_FOUND, data: { user: consumerData.user } });
        });
    };
}
exports.createConsumer = createConsumer;
/**
 * Update Consumer.
 * Update consumer's user in success callback.
 * It only dispatches CONSUMER_UPDATED if Consumer and ParseUser were
 * saved successfully.
 */
function updateConsumer(senderId, consumerData) {
    return getCustomerByFanpage(senderId).then(function (customer) {
        return function (dispatch) {
            dispatch({ type: types.UPDATE_CONSUMER, data: consumerData });
            var consumer = new ParseModels_1.Consumer();
            consumer.objectId = consumerData.objectId;
            consumer.save(consumerData).then(function (consumer) {
                var username = consumer.get('email') + customer.businessId;
                consumer.get('user').save({ username: username }).then(function (u) {
                    dispatch({ type: types.CONSUMER_UPDATED, data: { consumer: consumer } });
                    dispatch({ type: types.HIDE_PROFILE });
                }).fail(function (e) {
                    dispatch({ type: types.CONSUMER_UPDATE_ERROR, data: { consumer: consumer } });
                });
            }).fail(function (e) {
                dispatch({ type: types.CONSUMER_UPDATE_ERROR, data: { consumer: consumer } });
            });
        };
    });
}
exports.updateConsumer = updateConsumer;
/**
 * Facebook Login Success
 */
function facebookLogin(mainDispatch) {
    return function (dispatch) {
        parse_1.default.FacebookUtils.logIn(null, {
            success: function (user) {
                if (!user.existed()) {
                    dispatch({ type: types.FACEBOOK_REGISTER_SUCCESS });
                }
                else {
                    dispatch({ type: types.FACEBOOK_LOGIN_SUCCESS, data: user });
                }
                mainDispatch(push('/'));
                dispatch(loadConsumer(user, mainDispatch));
            },
            error: function (user, error) {
                alert("Login cancelado.");
            }
        });
    };
}
exports.facebookLogin = facebookLogin;
/**
 * Logout
 */
function logout(mainDispatch) {
    return function (dispatch) {
        if (parse_1.default.User.current()) {
            parse_1.default.User.logOut();
        }
        mainDispatch(push('/'));
        window.location = "/";
        dispatch({ type: types.LOGOUT });
    };
}
exports.logout = logout;
/**
 * Email Login Action
 */
function emailLogin(senderId, userData, mainDispatch) {
    return getCustomerByFanpage(senderId).then(function (customer) {
        mainDispatch({ type: types.EMAIL_LOGIN });
        return function (dispatch) {
            parse_1.default.User.logIn(userData.email + customer.businessId, userData.password).then(function (user) {
                dispatch({
                    type: types.EMAIL_LOGIN_SUCCESS,
                    data: user
                });
                mainDispatch(push('/'));
                dispatch(loadConsumer(user, mainDispatch));
            }).fail(function (e) {
                dispatch({
                    type: types.EMAIL_LOGIN_ERROR,
                    data: e
                });
            });
        };
    });
}
exports.emailLogin = emailLogin;
/**
 * Email Login Action
 */
function emailRegister(senderId, userData, mainDispatch) {
    return getCustomerByFanpage(senderId).then(function (customer) {
        mainDispatch({ type: types.EMAIL_REGISTER });
        return function (dispatch) {
            parse_1.default.User.signUp(userData.email + customer.businessId, userData.password).then(function (user) {
                dispatch({
                    type: types.EMAIL_REGISTER_SUCCESS,
                    data: { user: user, userData: userData }
                });
                delete userData.password;
                delete userData.passwordConfirmation;
                userData.user = user;
                dispatch(createConsumer(userData, mainDispatch));
            }).fail(function (e) {
                dispatch({
                    type: types.EMAIL_REGISTER_ERROR,
                    data: e
                });
            });
        };
    });
}
exports.emailRegister = emailRegister;
/**
 * Geolocation Position Acquired action.
 */
function geolocationPositionAcquired(ll, mainDispatch) {
    geocodeLocation(ll, mainDispatch, true);
    return {
        type: types.GEOLOCATION_POSITION_ACQUIRED,
        data: ll
    };
}
exports.geolocationPositionAcquired = geolocationPositionAcquired;
/**
 * Map Address Changed
 */
function mapAddressChanged(address) {
    return {
        type: types.MAP_ADDRESS_CHANGED,
        data: address
    };
}
exports.mapAddressChanged = mapAddressChanged;
/**
 * Geocode Given Location and dispatch MAP_ADDRESS_CHANGED action.
 */
function geocodeLocation(location, mainDispatch, fromGeoLocation) {
    geocoder.geocode({ location: location }, function (results, status) {
        if (status === "OK") {
            var place = results[0];
            var address = {};
            var isBetweenAddress = -1;
            isBetweenAddress = place.formatted_address.indexOf(" a ");
            if (isBetweenAddress === -1) {
                address.address = place.formatted_address;
            }
            else {
                var street = place.formatted_address.substr(0, isBetweenAddress);
                var city_1 = "";
                place.address_components.forEach(function (component) {
                    if (component.types.indexOf("locality") !== -1)
                        city_1 = component.short_name;
                });
                address.address = street + ", " + city_1;
            }
            address.location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            address.fromGeoLocation = fromGeoLocation;
            mainDispatch(mapAddressChanged(address));
        }
    });
}
/**
 * Map Location Changed, geocode and send MAP_ADDRESS_CHANGED with geocoded result
 */
function mapBoundsChanged(mapBounds, mainDispatch) {
    mainDispatch({
        type: types.MAP_BOUNDS_CHANGED,
        data: mapBounds.bounds
    });
    return function (dispatch) {
        geocodeLocation(mapBounds.center, mainDispatch);
    };
}
exports.mapBoundsChanged = mapBoundsChanged;
/**
 * Address Text Changed
 */
function addressTextChanged(address) {
    return {
        type: types.ADDRESS_TEXT_CHANGED,
        data: address
    };
}
exports.addressTextChanged = addressTextChanged;
/**
 * SHOW_MAP_ADDRESS action
 */
function showMapAddress() {
    return { type: types.SHOW_MAP_ADDRESS };
}
exports.showMapAddress = showMapAddress;
/**
 * HIDE_MAP_ADDRESS action
 */
function hideMapAddress() {
    return { type: types.HIDE_MAP_ADDRESS };
}
exports.hideMapAddress = hideMapAddress;
/**
 * SHOW_ADDRESS_FORM action
 */
function showAddressForm() {
    return { type: types.SHOW_ADDRESS_FORM };
}
exports.showAddressForm = showAddressForm;
/**
 * CONSUMER_ADDRESS_CHANGED action
 */
function consumerAddressChanged(consumerAddress, dispatch, pendingOrder, cart) {
    saveConsumerAddress(consumerAddress, dispatch, pendingOrder, cart);
    return {
        type: types.CONSUMER_ADDRESS_CHANGED,
        data: consumerAddress
    };
}
exports.consumerAddressChanged = consumerAddressChanged;
/**
 * CONSUMER ADDRESS LOADED action
 */
function consumerAddressesLoaded(consumerAddresses) {
    return {
        type: types.CONSUMER_ADDRESSES_LOADED,
        data: consumerAddresses
    };
}
exports.consumerAddressesLoaded = consumerAddressesLoaded;
/**
 * SHOW_ADDRESS_LIST action
 */
function showAddressList() { return { type: types.SHOW_ADDRESS_LIST }; }
exports.showAddressList = showAddressList;
/**
 * HIDE_ADDRESS_LIST action
 */
function hideAddressList() { return { type: types.HIDE_ADDRESS_LIST }; }
exports.hideAddressList = hideAddressList;
/**
 * Select Payment Method action
 */
function selectPaymentMethod(paymentMethod) {
    return {
        type: types.SELECT_PAYMENT_METHOD,
        data: paymentMethod
    };
}
exports.selectPaymentMethod = selectPaymentMethod;
/**
 * Create New Address action
 */
function createNewAddress() { return { type: types.CREATE_NEW_ADDRESS }; }
exports.createNewAddress = createNewAddress;
/**
 * Get Geolocation
 */
function getGeoLocation(dispatch) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var ll = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            dispatch(geolocationPositionAcquired(ll, dispatch));
        });
    }
}
exports.getGeoLocation = getGeoLocation;
/**
 * Convert Cart to Order
 */
function cartToOrder(cart, items) {
    return {
        items: items,
        comment: cart.comment,
        consumer: cart.consumer.rawParseObject,
        pointSale: cart.pointSale.rawParseObject,
        paymentMethod: cart.paymentMethod,
        consumerAddress: cart.consumerAddress.rawParseObject,
        total: cart.total,
        deliveryCost: cart.pointSale.deliveryCost,
        email: cart.consumer.email,
        name: cart.consumer.name,
        phone: cart.consumer.phone
    };
}
/**
 * Create Order Action
 */
function createOrder(cart, mainDispatch) {
    mainDispatch(push('/'));
    mainDispatch({ type: types.CREATE_ORDER });
    var consumer = cart.consumerAddress.consumer;
    //Go to Login route if cart has no consumer
    if (!consumer.objectId) {
        mainDispatch({ type: types.HIDE_CART });
        mainDispatch({ type: types.CREATE_ORDER_ERROR });
        return mainDispatch(push('/login'));
    }
    //Check that cart has at least 1 item.
    if (cart.items.length === 0) {
        mainDispatch({ type: types.CREATE_ORDER_ERROR });
        return mainDispatch(showEmptyCartModal());
    }
    //If payment method isn't set, dispatch action to show payment method modal
    if (!cart.paymentMethod) {
        mainDispatch({ type: types.CREATE_ORDER_ERROR });
        return mainDispatch(showPaymentNotSelectedModal());
    }
    //If cart total price is below point of sale minimum price dispatch action
    //to show minimum price modal
    if (cart.total < cart.pointSale.minOrderPrice) {
        mainDispatch({ type: types.CREATE_ORDER_ERROR });
        return mainDispatch(cartTotalIsBelowMinimumPrice());
    }
    //If cart hasn't consumer address show list of address.
    if (!cart.consumerAddress.objectId) {
        mainDispatch({ type: types.CREATE_ORDER_ERROR });
        return mainDispatch(showAddressList());
    }
    //Check if Point of Sale is open
    if (!cart.pointSaleIsOpen) {
        mainDispatch({ type: types.CREATE_ORDER_ERROR });
        return mainDispatch(showPointSaleClosedModal());
    }
    //Check if is inside coverage
    if (cart.outOfCoverage) {
        mainDispatch({ type: types.CREATE_ORDER_ERROR });
        return mainDispatch(showOufOfCoverageModal());
    }
    var items = [];
    cart.items.forEach(function (item) {
        var orderItem = new ParseModels_1.OrderItem();
        orderItem.set('modifiers', []);
        orderItem.set('modifiersGroups', []);
        orderItem.set('product', item.product.rawParseObject);
        orderItem.set('amount', item.amount);
        orderItem.set('price', item.price);
        //Set OrderItemModifiers
        item.modifiers.forEach(function (modifierItem) {
            var m = new ParseModels_1.Modifier();
            m.id = modifierItem.modifier.objectId;
            var i = new ParseModels_1.ModifierItem();
            i.id = modifierItem.modifierItem.objectId;
            var orderItemModifier = new ParseModels_1.OrderItemModifier({
                modifier: m,
                modifierItem: i,
                price: modifierItem.price
            });
            orderItem.add('modifiers', orderItemModifier);
        });
        //Set Modifiers Group
        item.modifiersGroups.forEach(function (modifierGroupItem) {
            var g = new ModifierGroup();
            g.id = modifierGroupItem.group.objectId;
            var orderItemModifierGroup = new OrderItemModifierGroup({
                group: g,
                items: []
            });
            modifierGroupItem.items.forEach(function (modifierItem) {
                var m = new ParseModels_1.Modifier();
                m.id = modifierItem.modifier.objectId;
                var i = new ParseModels_1.ModifierItem();
                i.id = modifierItem.modifierItem.objectId;
                orderItemModifierGroup.add('items', new ParseModels_1.OrderItemModifier({
                    modifier: m,
                    modifierItem: i,
                    price: modifierItem.price
                }));
            });
            orderItem.add('modifiersGroups', orderItemModifierGroup);
        });
        items.push(orderItem);
    });
    var newOrder = new ParseModels_1.Order();
    newOrder.set(cartToOrder(cart, items));
    parse_1.default.Object.saveAll(items).then(function () {
        return newOrder.save();
    }).then(function (order) {
        mainDispatch({ type: types.ORDER_CREATED, data: order });
        mainDispatch(emptyCart());
        mainDispatch(loadConsumerOrders());
        mainDispatch(toggleCart(false));
    }).fail(function (e) {
        alert('Hubo un error al crear su pedido, por favor intenta nuevamente.');
    });
}
exports.createOrder = createOrder;
/**
 * Change Cart Comment Action
 */
function changeCartComment(comment) {
    return {
        type: types.CHANGE_CART_COMMENT,
        data: comment
    };
}
exports.changeCartComment = changeCartComment;
/**
 * Show Payment not selected Modal action
 */
function showPaymentNotSelectedModal() {
    return { type: types.PAYMENT_NOT_SELECTED };
}
exports.showPaymentNotSelectedModal = showPaymentNotSelectedModal;
/**
 * Show Cart is Empty Modal
 */
function showEmptyCartModal() {
    return { type: types.SHOW_EMPTY_CART_MODAL };
}
exports.showEmptyCartModal = showEmptyCartModal;
/**
 * Hide Cart is Empty Modal
 */
function closeCartIsEmptyModal() {
    return { type: types.HIDE_EMPTY_CART_MODAL };
}
exports.closeCartIsEmptyModal = closeCartIsEmptyModal;
/**
 * Hide Payment not selected Modal action
 */
function hidePaymentNotSelectedModal() {
    return { type: types.PAYMENT_SELECTED };
}
exports.hidePaymentNotSelectedModal = hidePaymentNotSelectedModal;
/**
 * Action to show cart minimum price modal
 */
function cartTotalIsBelowMinimumPrice() {
    return { type: types.CART_TOTAL_IS_BELOW_MIN_PRICE };
}
exports.cartTotalIsBelowMinimumPrice = cartTotalIsBelowMinimumPrice;
/**
 * Action to hide cart minimum price modal
 */
function hideOrderMinimumPriceModal() {
    return { type: types.CART_TOTAL_IS_ABOVE_MIN_PRICE };
}
exports.hideOrderMinimumPriceModal = hideOrderMinimumPriceModal;
/**
 * Order Created Action
 */
function orderCreated(order) {
    return {
        type: types.ORDER_CREATED,
        data: order
    };
}
exports.orderCreated = orderCreated;
function unsetCurrentOrder() {
    return { type: types.UNSET_CURRENT_ORDER };
}
exports.unsetCurrentOrder = unsetCurrentOrder;
/**
 * Set current order action
 */
function setCurrentOrder(order) {
    return {
        type: types.SET_CURRENT_ORDER,
        data: order
    };
}
exports.setCurrentOrder = setCurrentOrder;
/**
 * Load Cart by Id.
 */
function loadCart(cartId) {
    return { type: 'NOTHING' };
    /* * /
     //Disabled due to malfunction.
     return dispatch => {
     new Parse.Query(Cart).include(["consumer", "pointSale",
     "consumerAddress.consumer", "items.product",
     "items.modifiers.modifier.items", "items.modifiers.modifierItem",
     "items.modifiersGroups.group.modifiers.items",
     "items.modifiersGroups.items.modifier.items",
     "items.modifiersGroups.items.modifierItem"
     ]).get(cartId).then(cart => {dispatch({
     type: types.CART_LOADED,
     data: cart
     })
     })
     }
     /* */
}
exports.loadCart = loadCart;
/**
 * Close Point Sale Closed Modal
 */
function hidePointSaleClosedModal() {
    return { type: types.HIDE_POINT_SALE_CLOSED_MODAL };
}
exports.hidePointSaleClosedModal = hidePointSaleClosedModal;
/**
 * Open Point Sale Closed Modal
 */
function showPointSaleClosedModal() {
    return { type: types.SHOW_POINT_SALE_CLOSED_MODAL };
}
exports.showPointSaleClosedModal = showPointSaleClosedModal;
function hideProfile() {
    return { type: types.HIDE_PROFILE };
}
exports.hideProfile = hideProfile;
function showProfile() {
    return { type: types.SHOW_PROFILE };
}
exports.showProfile = showProfile;
function closeOutOfCoverageModal() {
    return { type: types.HIDE_OUT_OF_COVERAGE_MODAL };
}
exports.closeOutOfCoverageModal = closeOutOfCoverageModal;
function showOufOfCoverageModal() {
    return { type: types.SHOW_OUT_OF_COVERAGE_MODAL };
}
exports.showOufOfCoverageModal = showOufOfCoverageModal;
function removeItem(item) {
    return { type: types.CART_ITEM_REMOVE, data: item };
}
exports.removeItem = removeItem;
function increaseItem(item) {
    return { type: types.CART_ITEM_INCREASE_AMOUNT, data: item };
}
exports.increaseItem = increaseItem;
function decreaseItem(item) {
    return { type: types.CART_ITEM_DECREASE_AMOUNT, data: item };
}
exports.decreaseItem = decreaseItem;
function toggleCart(isOpen) {
    return { type: types.TOGGLE_CART, data: isOpen };
}
exports.toggleCart = toggleCart;
function rateOrder(orderId, score, comment) {
    return function (dispatch) {
        dispatch({ type: types.RATING_ORDER });
        parse_1.default.Cloud.run('rateOrder', { orderId: orderId, score: score, comment: comment }).then(function () {
            dispatch({ type: types.RATE_ORDER_SUCCESS });
            return dispatch(loadConsumerOrders());
        }).fail(function (e) {
            return { type: types.RATE_ORDER_ERROR, data: e };
        });
    };
}
exports.rateOrder = rateOrder;
function showSiteMap() {
    return { type: types.SHOW_SITEMAP };
}
exports.showSiteMap = showSiteMap;
function hideSiteMap() {
    return { type: types.HIDE_SITEMAP };
}
exports.hideSiteMap = hideSiteMap;
function hideOutOfCoverageModal() {
    return { type: types.HIDE_OUT_OF_COVERAGE_MODAL };
}
exports.hideOutOfCoverageModal = hideOutOfCoverageModal;
/**
 * Load Point of Sales of given businessId.
 */
function loadPointSales(senderId) {
    return getCustomerByFanpage(senderId).then(function (customer) {
        var params = { businessId: customer.businessId };
        return function (dispatch) {
            parse_1.default.Cloud.run('getPointSales', params).then(function (results) {
                dispatch({ type: types.POINT_OF_SALES_LOADED, data: results });
            });
        };
    });
}
exports.loadPointSales = loadPointSales;
/**
 * Geolocation error.
 */
function geolocationError() {
    return { type: types.GEOLOCATION_ERROR };
}
exports.geolocationError = geolocationError;
/**
 * Hide Geolocation Error Modal.
 */
function hideAddressSearchModal() {
    return { type: types.HIDE_GEOLOCATION_ERROR_MODAL };
}
exports.hideAddressSearchModal = hideAddressSearchModal;
/**
 * Show Address Search Modal.
 */
function showAddressSearchModal() {
    return { type: types.SHOW_ADDRESS_SEARCH_MODAL };
}
exports.showAddressSearchModal = showAddressSearchModal;
function renderMenu() {
    return { type: types.RENDER_MENU };
}
