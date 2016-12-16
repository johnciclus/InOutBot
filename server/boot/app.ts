import * as bot from '../middleware/bot';
import * as bodyParser from 'body-parser'
import * as Parse from '../middleware/parse'

import { createLocalStore, getData } from '../middleware/localStore';

export function app(server) {
  let router = server.loopback.Router();

  router.get('/webhook', bot.verifyToken);
  router.get('/authorize', bot.authorize);
  router.post('/webhook', bot.router);

  server.use(bodyParser.json({ verify: bot.verifyRequestSignature }));
  server.use(router);
};

bot.rules.set('hola', sendTest);

bot.payloadRules.set('Search', searchProducts);

function authentication(recipientId, senderId){
  return getCustomer(recipientId, senderId).then(customer => {
    return getUser(recipientId).then(user => {
      if(typeof user == 'undefined'){
        return User.createUser(store, recipientId, recipientId, customer.fanpageToken).then(()=>{
          let userObject = getData(recipientId, 'user');
          let user = userObject.rawParseObject;

          return user.createConsumer(store, recipientId, senderId, customer.fanpageToken).then(consumer => {
            return new Promise((resolve, reject) => {
              resolve(userObject)
            });
          });
        })
      }
      else{
        return getConsumer(recipientId, user.rawParseObject).then(consumer => {
          return new Promise((resolve, reject) => {
            resolve(user)
          });
        });
      }
    });
  });
}

function getCustomer(recipientId, senderId){
  let customer = getData(recipientId, 'customer');
  if(typeof customer == 'undefined'){
    return Actions.getCustomerByFanpage(senderId).then(customer => {
      return Customer.loadInStore(store, recipientId, customer.businessId).then(()=>{
        return getData(recipientId, 'customer');
      });
    });
  }
  else{
    return new Promise((resolve, reject) => {
      resolve(customer)
    });
  }
}

function getUser(recipientId){
  let userObj = getData(recipientId, 'user');
  if(typeof userObj == 'undefined'){
    return User.loadInStore(store, recipientId).then(()=>{
      return getData(recipientId, 'user');
    });
  }
  else{
    return new Promise((resolve, reject) => {
      resolve(userObj)
    });
  }
}

function getConsumer(recipientId, user){
  let consumerObj = getData(recipientId, 'consumer');

  if(typeof consumerObj == 'undefined'){
    return Consumer.loadInStore(store, recipientId, user).then(()=>{
      consumerObj = getData(recipientId, 'consumer');

      if(typeof consumerObj != 'undefined'){
        return new Promise((resolve, reject) => {
          resolve(consumerObj)
        });
      }else{
        console.log('create consumer');
      }
    });
  }
  else{
    return new Promise((resolve, reject) => {
      resolve(consumerObj)
    });
  }
}

function sendMenu(recipientId, senderId) {
  return bot.sendTypingOn(recipientId, senderId).then(()=>{
    authentication(recipientId, senderId).then(() =>{
      bot.clearListener(recipientId);
      let customer = getData(recipientId, 'customer');
      let user = getData(recipientId, 'user');
      let image_url = customer.image.url;
      return bot.sendTypingOff(recipientId, senderId).then(()=>{
        return bot.sendGenericMessage(recipientId, senderId, [{
          "title":     "Hola "+user.first_name+", Bienvenido a "+customer.name,
          "subtitle":  "Aquí puedes pedir un domicilio, escribe o selecciona alguna de las opciones:",
          "image_url": image_url,
          "buttons":[
            {
              "type":"postback",
              "title":"Pedir domicilio",
              "payload": "SendAddressesWithTitle"
            },
            {
              "type":"postback",
              "title":"Servicio al cliente",
              "payload": "CustomerService"
            }
          ]
        }]);
      });
    });
  });
}

function searchProducts(recipientId, senderId, query, index){
  console.log('searchProducts')
};

function sendTest(recipientId, senderId) {
  bot.sendTextMessage(recipientId, senderId, 'test');
}

module.exports = app;
