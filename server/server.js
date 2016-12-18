"use strict";
var loopback = require("loopback");
var bodyParser = require("body-parser");
var boot = require("loopback-boot");
var bot_1 = require("./middleware/bot");
var app = module.exports = loopback();
app.use(bodyParser.json({ verify: bot_1.verifyRequestSignature }));
app.start = function () {
    return app.listen(function () {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s\n', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
        }
    });
};
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
    if (err)
        throw err;
    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();
});
/*app.get('/', (req,res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname+'/client/index.html'));
})*/
app.get('remoting').errorHandler = {
    handler: function (err, req, res, defaultHandler) {
        err = app.buildError(err);
        // send the error back to the original handler
        defaultHandler(err);
    },
    disableStackTrace: true
};
app.buildError = function (err) {
    err.message = 'Custom message: ' + err.message;
    err.status = 408; // override the status
    // remove the statusCode property
    delete err.statusCode;
    return err;
};
