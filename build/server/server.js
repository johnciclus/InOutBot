"use strict";
var loopback = require("loopback");
var boot = require("loopback-boot");
var path = require("path");
var bodyParser = require("body-parser");
var bot_1 = require("./middleware/bot");
var app = module.exports = loopback();
app.use(bodyParser.json({ verify: bot_1.verifyRequestSignature }));
app.use(loopback.static(path.resolve(__dirname, '../client')));
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = app;
