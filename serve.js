var DEFAULT_HOST = '0.0.0.0';
var DEFAULT_PORT = 12345;
var DEFAULT_BASEDIR = '/var/lib/collectd/rrd'; // collectd default

var config = require('./config.js');
var basedir = config.basedir || DEFAULT_BASEDIR;
var app = require('./index.js')(basedir);
var morgan = require('morgan');

app = app.use(morgan('combined'));

var host = config.host || DEFAULT_HOST;
var port = config.port || DEFAULT_PORT;

var server = app.listen(port, host, function () {
  // TODO logging
  console.log('rrd-server listening at http://%s:%s', host, port);
});
