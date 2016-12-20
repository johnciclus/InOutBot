import Parse from '../parse'
import { setOrder, setOrders} from '../actions/index';


const Order = Parse.Object.extend('Order', {
  initialize: function (attrs, options) {

  }
},{
  setOrder: function(store, recipientId, id){
    return store.dispatch(setOrder(recipientId, id))
  },
  setOrders(store, recipientId, orders){
    return store.dispatch(setOrders(recipientId, orders))
  }
});

export default Order
