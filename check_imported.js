var wf = require('/tmp/export_fluxo1.json');
wf.nodes.filter(function(n) {
  return n.name.indexOf('Topic') >= 0;
}).forEach(function(n) {
  console.log('Node:', n.name);
  console.log('jsCode:', n.parameters.jsCode.substring(0, 300));
});
