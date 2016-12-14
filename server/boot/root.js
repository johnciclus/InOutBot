'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', require('../middleware/webhook')())
  //router.get('/', server.loopback.status());
  /*router.get('/webhook', function (req, res, next){
    res.status(200).send('hello world')
  });*/
  server.use(router);
};
