import * as _ from 'underscore';
import * as crypto from 'crypto';
import * as Map from 'es6-map';
import * as config from 'config';
import * as rp from 'request-promise';


const APP_SECRET = config.get('APP_SECRET');

const VALIDATION_TOKEN = config.get('VALIDATION_TOKEN');

const SERVER_URL = config.get('SERVER_URL');

const FACEBOOK_GRAPH = config.get('FACEBOOK_GRAPH');

export const limit = 9;

let Business = undefined;

console.log(VALIDATION_TOKEN);

if (!(APP_SECRET && VALIDATION_TOKEN && SERVER_URL)) {
  console.error("Missing config values");
  process.exit(1);
}

export let listener = {};
export let buffer = {};
export let rules = new Map();
export let payloadRules = new Map();

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
export function verifyRequestSignature(req, res, buf) {
  let signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    let elements = signature.split('=');
    let method = elements[0];
    let signatureHash = elements[1];

    //console.log(signature);

    let expectedHash = crypto.createHmac('sha1', APP_SECRET)
      .update(buf)
      .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

export function verifyToken(req, res){
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }

};

export function router(req, res) {
  let data = req.body;
  let server = req.app;

  if(typeof Business == 'undefined'){
    const models = server.models;
    Business = models.Business;
  }


  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function (pageEntry) {
      let pageID = pageEntry.id;
      let timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function (messagingEvent) {
        //console.log(messagingEvent);
        if (messagingEvent.optin) {
          receivedAuthentication(messagingEvent, server);
        } else if (messagingEvent.message) {
          receivedMessage(messagingEvent, server);
        } else if (messagingEvent.delivery) {
          receivedDeliveryConfirmation(messagingEvent, server);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent, server);
        } else if (messagingEvent.read) {
          receivedMessageRead(messagingEvent, server);
        } else if (messagingEvent.account_linking) {
          receivedAccountLink(messagingEvent, server);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
};

export function authorize(req, res) {
  let accountLinkingToken = req.query['account_linking_token'];
  let redirectURI = req.query['redirect_uri'];

  // Authorization Code should be generated per user by the developer. This will
  // be passed to the Account Linking callback.
  let authCode = "1234567890";

  // Redirect users to this URI on successful login
  let redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

  res.render('authorize', {
    accountLinkingToken: accountLinkingToken,
    redirectURI: redirectURI,
    redirectURISuccess: redirectURISuccess
  });
};

export function defaultSearch(recipientId, senderId, query){
  console.log('defaultSearch');
  //console.log(search);
  let search = payloadRules.get('Search');

  if(search){
    search(recipientId, senderId, query);
  }
};

/*
 * Turn typing indicator on
 *
 */
export function sendTypingOn(recipientId, senderId) {
  //console.log("Turning typing indicator on");

  let messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };

  return callSendAPI(messageData, senderId);
}

/*
 * Turn typing indicator off
 *
 */
export function sendTypingOff(recipientId, senderId) {
  //console.log("Turning typing indicator off");

  let messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };

  return callSendAPI(messageData, senderId);
}

/*
 * Send a text message using the Send API.
 *
 */
export function sendTextMessage(recipientId, senderId,  messageText) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
      //metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  return callSendAPI(messageData, senderId);
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
export function sendGenericMessage(recipientId, senderId, elements) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: elements
        }
      }
    }
  };

  return callSendAPI(messageData, senderId);
}

export function clearListener(recipientId){
  let userListener = listener[recipientId];
  if(typeof userListener != 'undefined'){
    listener[recipientId] = {};
  }
}





/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to
 * Messenger" plugin, it is the 'data-ref' field. Read more at
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
function receivedAuthentication(event, server) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let timeOfAuth = event.timestamp;

  // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
  // The developer can set this to an arbitrary value to associate the
  // authentication callback with the 'Send to Messenger' click event. This is
  // a way to do account linking when the user clicks the 'Send to Messenger'
  // plugin.

  senderID = parseInt(senderID);
  recipientID = parseInt(recipientID);
  let passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderID, recipientID, passThroughParam,
    timeOfAuth);

  // When an authentication is received, we'll send a message back to the sender
  // to let them know it was successful.
  sendTextMessage(senderID, recipientID, "Authentication successful");
}

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can lety depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
function receivedMessage(event, server) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let timeOfMessage = event.timestamp;
  let message = event.message;

  //console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
  //console.log(JSON.stringify(message));

  let isEcho = message.is_echo;
  let messageId = message.mid;
  let appId = message.app_id;
  let metadata = message.metadata;

  // You may get a text or attachment but not both
  let messageText = message.text;
  let messageAttachments = message.attachments;
  let quickReply = message.quick_reply;

  senderID = parseInt(senderID);
  recipientID = parseInt(recipientID);

  if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s",
      messageId, appId, metadata);
    return;
  }
  else if (quickReply) {
    let quickReplyPayload = quickReply.payload;
    //console.log("Quick reply for message %s with payload %s", messageId, quickReplyPayload);
    let payloadFunction;

    if(quickReplyPayload.includes('-')){
      let params = quickReplyPayload.split('-');
      payloadFunction = payloadRules.get(params[0]);
      //console.log(senderID);
      //console.log(typeof senderID);
      if(typeof payloadFunction == 'function'){
        if(params.length == 4) {
          payloadFunction(senderID, recipientID, params[1], params[2], params[3]);
        }
        else if(params.length == 3) {
          payloadFunction(senderID, recipientID, params[1], params[2]);
        }
        else{
          payloadFunction(senderID, recipientID, params[1]);
        }
      }
    }else{
      payloadFunction = payloadRules.get(quickReplyPayload)

      if(payloadFunction){
        payloadFunction(senderID, recipientID);
      }
    }
  }
  else if (messageText) {
    let userListeners = listener[senderID];
    let existRule = false;
    let ruleFunction = undefined;

    messageText = messageText.toLowerCase()

    rules.forEach(function (func, key){
      if(messageText.includes(key)){
        ruleFunction =  func;
        existRule = true;
      }
    });

    if(existRule){
      ruleFunction(senderID, recipientID);
    }else{
      if(!_.isEmpty(userListeners)){
        if(!buffer[senderID]){
          buffer[senderID] = {}
        }
        let keys = Object.keys(userListeners);
        let key = keys.shift();

        while(key){
          if(userListeners[key].type == 'text'){
            buffer[senderID][key] = messageText;
            userListeners[key].callback(senderID, recipientID);
            existRule = true;
          }
          delete userListeners[key];
          key = keys.shift();
        }
      }
      else{
        defaultSearch(senderID, recipientID, messageText);
      }
    }
  }
  else if (messageAttachments) {
    if(messageAttachments[0].type == 'location'){
      let location = messageAttachments[0].payload.coordinates;
      let userListeners = listener[senderID];
      //console.log(senderID);
      //console.log(typeof senderID);
      if(!_.isEmpty(userListeners)){
        if(!buffer[senderID]){
          buffer[senderID] = {}
        }
        let keys = Object.keys(userListeners);
        let key = keys.shift();

        while(key){
          //console.log(key);
          if(userListeners[key].type == 'attachment'){
            buffer[senderID][key] = {lat: location.lat, lng: location.long};
            userListeners[key].callback(senderID, recipientID);
          }
          delete userListeners[key]
          key = keys.shift();
        }
      }
    }
    //sendTextMessage(senderID, "Message with attachment received");
  }

}

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation(event, server) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let delivery = event.delivery;
  let messageIDs = delivery.mids;
  let watermark = delivery.watermark;
  let sequenceNumber = delivery.seq;

  senderID = parseInt(senderID);
  recipientID = parseInt(recipientID);

  if (messageIDs) {
    messageIDs.forEach(function(messageID) {
      //console.log("Received delivery confirmation for message ID: %s", messageID);
    });
  }

  //console.log("All message before %d were delivered.", watermark);
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event, server) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  let payload = event.postback.payload;

  //console.log("Received postback for user %d and page %d with payload '%s' " + "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful

  let payloadFunction;

  let params = payload.split('-');

  payloadFunction = payloadRules.get(params[0]);
  senderID = parseInt(senderID);
  recipientID = parseInt(recipientID);

  //console.log(senderID);
  //console.log(typeof senderID);

  if(payloadFunction){
    switch (params.length){
      case 1:
        payloadFunction(senderID, recipientID);
        break;
      case 2:
        payloadFunction(senderID, recipientID, params[1]);
        break;
      case 3:
        payloadFunction(senderID, recipientID, params[1], params[2]);
        break;
      default:
        console.log('Payload not found: '+params)
    }
  }

  /*
   if(payload == 'Greeting'){
   sendMenuMessage(senderID);
   }
   else if(payload == 'Delivery'){
   sendMenuMessage(senderID);
   }
   else if(payload.startsWith("ListCategories")){
   let params = payload.split("-");
   console.log("List Categories");
   console.log(params);
   listCategories(senderID, parseInt(params[1]));
   }
   else if(payload.startsWith("ListProducts")){
   let params = payload.split("-");
   listProducts(senderID, params[1], parseInt(params[2]));
   }
   else if(payload.startsWith("Add")){
   let params = payload.split("-");
   addProduct(params[1]);
   }
   else if(payload.startsWith("ShoppingCart")){
   sendBillMessage(senderID);
   }
   else{
   sendTextMessage(senderID, "Postback called "+payload);
   }
   */
}

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 *
 */
function receivedMessageRead(event, server) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;

  // All messages before watermark (a timestamp) or sequence have been seen.
  let watermark = event.read.watermark;
  let sequenceNumber = event.read.seq;

  senderID = parseInt(senderID);
  recipientID = parseInt(recipientID);

  console.log("Received message read event for watermark %d and sequence " +
    "number %d", watermark, sequenceNumber);
}

/*
 * Account Link Event
 *
 * This event is called when the Link Account or UnLink Account action has been
 * tapped.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
 *
 */
function receivedAccountLink(event, server) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;

  let status = event.account_linking.status;
  let authCode = event.account_linking.authorization_code;

  senderID = parseInt(senderID);
  recipientID = parseInt(recipientID);

  console.log("Received account link event with for user %d with status %s " +
    "and auth code %s ", senderID, status, authCode);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData, senderId) {
    return Business.findOne({where: {fanpageId: senderId}}).then((business)=> {
      if (typeof business != 'undefined') {
        return rp({
          uri: FACEBOOK_GRAPH + 'me/messages',
          qs: {access_token: business.fanpageToken},
          method: 'POST',
          json: messageData
        }).catch(error => {
          console.log('error');
          console.log(error);
        });
      }
      else {
        console.log('Error: senderId not found: ' + senderId)
        console.log(messageData);
      }
    })
}

function testAPI(senderId){
    return Business.findOne({where: {fanpageId: senderId}}).then((business)=> {

      return rp({
        uri: FACEBOOK_GRAPH + 'me?fields=name,email,age_range,birthday,is_verified,location',
        qs: {access_token: business.fanpageToken},
        method: 'GET'
      }).then(response => {
        console.log('Successful login for: ' + response.name);
        console.log('Thanks for logging in, ' + response.email + '!');
        console.log(response);
      }).catch(error => {
        console.log('error');
        console.log(error);
      });
    });
}

/*
 * Send an image using the Send API.
 *
 */
export function sendImageMessage(recipientId, senderId, imageUrl) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: imageUrl
        }
      }
    }
  };

  return callSendAPI(messageData, senderId);
}

/*
 * Send a Gif using the Send API.
 *
 */
function sendGifMessage(recipientId, senderId, gifUrl) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + gifUrl
        }
      }
    }
  };

  return callSendAPI(messageData, senderId);
}

/*
 * Send audio using the Send API.
 *
 */
function sendAudioMessage(recipientId, senderId, audioUrl) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "audio",
        payload: {
          url: SERVER_URL + audioUrl
        }
      }
    }
  };

  return callSendAPI(messageData, senderId);
}

/*
 * Send a video using the Send API.
 *
 */
function sendVideoMessage(recipientId, senderId, videoUrl) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "video",
        payload: {
          url: SERVER_URL + videoUrl
        }
      }
    }
  };

  return callSendAPI(messageData, senderId);
}

/*
 * Send a video using the Send API.
 *
 */
function sendFileMessage(recipientId, senderId, fileUrl) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "file",
        payload: {
          url: SERVER_URL + fileUrl
        }
      }
    }
  };

  return callSendAPI(messageData, senderId);
}

/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId, senderId, text, buttons) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: text,
          buttons: buttons
        }
      }
    }
  };

  /*
   {
   type: "web_url",
   url: "https://www.oculus.com/en-us/rift/",
   title: "Open Web URL"
   }, {
   type: "postback",
   title: "Trigger Postback",
   payload: "DEVELOPED_DEFINED_PAYLOAD"
   }, {
   type: "phone_number",
   title: "Call Phone Number",
   payload: "+16505551234"
   }

   * */

  return callSendAPI(messageData, senderId);
}

/*
 * Send a receipt message using the Send API.
 *
 */
export function sendReceiptMessage(recipientId, senderId, payload, quick_replies) {
  // Generate a random receipt ID as the API requires a unique ID
  let receiptId = "order" + Math.floor(Math.random()*1000);

  let messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      attachment: {
        type: "template",
        payload: payload
      },
      quick_replies: quick_replies
    }
  };
  /*
   * {
   template_type: "receipt",
   recipient_name: "Peter Chang",
   order_number: receiptId,
   currency: "COP",
   payment_method: "Visa 1234",
   timestamp: "1428444852",
   elements: [{
   title: "Oculus Rift",
   subtitle: "Includes: headset, sensor, remote",
   quantity: 1,
   price: 599.00,
   currency: "USD",
   image_url: SERVER_URL + "/assets/riftsq.png"
   }, {
   title: "Samsung Gear VR",
   subtitle: "Frost White",
   quantity: 1,
   price: 99.99,
   currency: "USD",
   image_url: SERVER_URL + "/assets/gearvrsq.png"
   }],
   address: {
   street_1: "1 Hacker Way",
   street_2: "",
   city: "Menlo Park",
   postal_code: "94025",
   state: "CA",
   country: "US"
   },
   summary: {
   subtotal: 698.99,
   shipping_cost: 20.00,
   total_tax: 57.67,
   total_cost: 626.66
   },
   adjustments: [{
   name: "New Customer Discount",
   amount: -50
   }, {
   name: "$100 Off Coupon",
   amount: -100
   }]
   }
   *
   * */
  return callSendAPI(messageData, senderId);
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
export function sendQuickReplyMessage(recipientId, senderId, text, quick_replies) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text,
      //metadata: "DEVELOPER_DEFINED_METADATA",
      quick_replies: quick_replies
    }
  };

  /*

   [
   {
   "content_type":"text",
   "title":"Action",
   "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
   },
   {
   "content_type":"text",
   "title":"Comedy",
   "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
   },
   {
   "content_type":"text",
   "title":"Drama",
   "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
   }
   ]

   * */

  return callSendAPI(messageData, senderId);
}

/*
 * Send a read receipt to indicate the message has been read
 *
 */
function sendReadReceipt(recipientId, senderId) {
  console.log("Sending a read receipt to mark message as seen");

  let messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "mark_seen"
  };

  return callSendAPI(messageData, senderId);
}

/*
 * Send a message with the account linking call-to-action
 *
 */
function sendAccountLinking(recipientId, senderId, payload) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: payload
      }
    }
  };

  /*

   {
   template_type: "button",
   text: "Welcome. Link your account.",
   buttons:[{
   type: "account_link",
   url: SERVER_URL + "/authorize"
   }]
   }

   * */

  return callSendAPI(messageData, senderId);
}

function findKeyStartsWith(map, str){
  for (let [key, value] of map) {
    if(key.startsWith(str))
      return value;
  }
  return undefined;
}

export function setListener(recipientId, dataId, type, callback){
  if(typeof listener[recipientId] == 'undefined'){
    listener[recipientId] = {};
  }

  listener[recipientId][dataId] = {callback: callback, type: type};
}

function getListener(recipientId, dataId){
  if(typeof listener[recipientId] == 'undefined'){
    return undefined
  }

  return listener[recipientId][dataId];
}

function deleteListener(recipientId, dataId){
  if(!listener[recipientId]){
    return false
  }

  delete listener[recipientId][dataId];
  return true

}

export function setDataBuffer(recipientId, key, value){
  if(!buffer[recipientId]){
    buffer[recipientId] = {}
  }
  buffer[recipientId][key] = value;
}





