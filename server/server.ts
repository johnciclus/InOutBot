import * as loopback from 'loopback';
import * as boot from 'loopback-boot';
import * as path from 'path'
import * as bodyParser from 'body-parser'
import {verifyRequestSignature} from './middleware/bot';

let app = module.exports = loopback();

app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(loopback.static(path.resolve(__dirname, '../client')));

app.start = () => {
  return app.listen(() => {
    app.emit('started');
    let baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s\n', baseUrl);
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      //console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

export default app;
