"use strict";
var bot = require("../middleware/bot");
var bodyParser = require("body-parser");
function root(server) {
    var router = server.loopback.Router();
    router.get('/', server.loopback.status());
    server.use(bodyParser.json({ verify: bot.verifyRequestSignature }));
    server.use(router);
}
exports.root = root;
;
module.exports = root;
