module.exports = function(basedir) {

  basedir = basedir || '/var/lib/collectd/rrd'; // collectd default

  var rrdjs = require('rrdjs');
  var express = require('express');

  var app = express();

  app.get('/metric', function(req, res, next) {
    var metric = req.query['metric'];
    if(metric.indexOf('..') != -1) { 
      res.status(403).end('request not allowed to contain ..');
    } else {
      // TODO this will be a problem if there are additional dots, for
      // example if we're using FQDNs
      var filename = basedir + '/' + metric.split('.').join('/') + '.rrd';
      var stop = req.query['stop'] || (Date.now() / 1000) - 20; // default: now - 20s
      var start = req.query['start'] || stop - 300; // default: stop - 300s (5 minutes)
      var step = req.query['step'] || 10; // default: 10s
      var cf = req.query['cf'] || 'AVERAGE'; // default: AVERAGE
      
      rrdjs.fetch(filename, cf, start, stop, step, function(err, data) {
        // TODO better error handling
        if(err) throw err;
        console.log(data);
        res.end(JSON.stringify(data));
      });
    }
  });

  return app;
}
