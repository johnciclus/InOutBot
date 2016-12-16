import config from 'config';
import Parse from 'parse/node'

const PARSE_APP_ID = config.get('PARSE_APP_ID');
const PARSE_SERVER_URL = config.get('PARSE_SERVER_URL');

Parse.initialize(PARSE_APP_ID);
Parse.serverURL = PARSE_SERVER_URL;

module.exports = {Parse};
