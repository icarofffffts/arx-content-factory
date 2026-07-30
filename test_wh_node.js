var http = require('http');
var data = JSON.stringify({topic: 'test'});
var req = http.request({
  hostname: 'localhost',
  port: 5678,
  path: '/webhook/content-factory-trigger',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, function(res) {
  var body = '';
  res.on('data', function(c) { body += c; });
  res.on('end', function() {
    console.log('Status:', res.statusCode);
    console.log('Body:', body.substring(0, 500));
  });
});
req.write(data);
req.end();
