var http = require('http');
var data = JSON.stringify({
  number: '553195398002',
  text: '📋 *NOVO CONTEUDO PRA REVISAO*\n\nQuer publicar este post agora?',
  instanceId: 'IcaroDev'
});
var req = http.request({
  hostname: 'evolution_go',
  port: 8080,
  path: '/send/text',
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
    console.log('Body:', JSON.stringify(JSON.parse(body), null, 2).substring(0, 500));
  });
});
req.write(data);
req.end();
