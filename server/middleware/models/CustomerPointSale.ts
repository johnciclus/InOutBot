import Parse from '../parse'
import { setCustomerPointSale } from '../actions/index';


const CustomerPointSale = Parse.Object.extend('CustomerPointSale', {
  initialize: function (attrs, options) {

  }
},{
  setCustomerPointSale: function(store, recipientId, id){
    return store.dispatch(setCustomerPointSale(recipientId, id))
  }
});

export default CustomerPointSale
