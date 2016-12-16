import * as bot from '../middleware/bot';
import * as bodyParser from 'body-parser'

export function root(server) {
  let router = server.loopback.Router();

  router.get('/', server.loopback.status());

  server.use(bodyParser.json({ verify: bot.verifyRequestSignature }));
  server.use(router);
};

module.exports = root;
