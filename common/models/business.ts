'use strict';

module.exports = function(Business) {
  Business.status = (cb) => {
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    let OPEN_HOUR = 6;
    let CLOSE_HOUR = 20;
    console.log('Current hour is %d', currentHour);
    let response;
    if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
      response = 'We are open for business.';
    } else {
      response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
    }
    cb(null, response);
  };

  Business.remoteMethod('status', {
      http: {
        path: '/status',
        verb: 'get'
      },
      returns: {
        arg: 'status',
        type: 'string'
      }
    }
  );
};
