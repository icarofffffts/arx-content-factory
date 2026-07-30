var http = require('http');
var req = http.request({
  hostname: 'evolution_api',
  port: 8080,
  path: '/instance/fetchInstances',
  method: 'GET',
  headers: { 'apiKey': 'arx_evolution_2026' }
}, function(res) {
  var body = '';
  res.on('data', function(c) { body += c; });
  res.on('end', function() {
    console.log('Status:', res.statusCode);
    console.log('Body:', body.substring(0, 500));
  });
});
req.end();
