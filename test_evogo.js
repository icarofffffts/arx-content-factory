var http = require('http');
var data = JSON.stringify({number: '553195398002', text: 'teste'});
var req = http.request({
  hostname: 'evolution_go',
  port: 8080,
  path: '/message/sendText/IcaroDev',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apiKey': 'arx_evolution_2026',
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
