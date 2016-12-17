import * as loopback from 'loopback';
import * as bodyParser from 'body-parser'
import * as boot from 'loopback-boot';
import * as path from 'path';
import {verifyRequestSignature} from './middleware/bot';

let app = module.exports = loopback();

app.use(bodyParser.json({ verify: verifyRequestSignature }));

app.start = () => {
  return app.listen(() => {
    app.emit('started');
    let baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
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

/*app.get('/', (req,res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname+'/client/index.html'));
})*/

app.get('remoting').errorHandler = {
  handler: function(err, req, res, defaultHandler) {
    err = app.buildError(err);

    // send the error back to the original handler
    defaultHandler(err);
  },
  disableStackTrace: true
};

app.buildError = function(err) {
  err.message = 'Custom message: ' + err.message;
  err.status = 408; // override the status

  // remove the statusCode property
  delete err.statusCode;

  return err;
};

