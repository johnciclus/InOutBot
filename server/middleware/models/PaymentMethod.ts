import Parse from '../parse'
import { loadPaymentMethods, setPaymentMethod } from '../actions/index';

const PaymentMethod = Parse.Object.extend('PaymentMethod', {
  initialize: function (attrs, options) {

  }
}, {
    loadInStore: function(store, recipientId, senderId){
      return store.dispatch(loadPaymentMethods(recipientId, senderId))
    },
    setPaymentMethod: function(store, recipientId, senderId){
      return store.dispatch(setPaymentMethod(recipientId, senderId))
    },
});

export default PaymentMethod
