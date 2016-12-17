import * as config from 'config';
import * as Parse from 'parse/node'

const PARSE_APP_ID = config.get('PARSE_APP_ID');
const PARSE_SERVER_URL = config.get('PARSE_SERVER_URL');

console.log('***Initialize Parse***');
console.log(PARSE_SERVER_URL)
console.log(PARSE_APP_ID)

Parse.initialize(PARSE_APP_ID);
Parse.serverURL = PARSE_SERVER_URL;

export default Parse;
