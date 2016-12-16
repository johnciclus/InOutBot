"use strict";
var config_1 = require("config");
var node_1 = require("parse/node");
var PARSE_APP_ID = config_1.default.get('PARSE_APP_ID');
var PARSE_SERVER_URL = config_1.default.get('PARSE_SERVER_URL');
node_1.default.initialize(PARSE_APP_ID);
node_1.default.serverURL = PARSE_SERVER_URL;
module.exports = { Parse: node_1.default };
