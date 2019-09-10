const express = require('express');
const app = express();
const et = require('express-opentracing');
const middleware = et.default;
const { FORMAT_HTTP_HEADERS } = require('opentracing');
const { initTracer } = require("./tracing");
const tracer = initTracer("node-hello");
const port = 3000;
const http = require('axios');

app.use(middleware({tracer: tracer}));

app.get('/', async (req, res) => {
  var sp = req.span;
  if (sp == null) {
    sp = tracer.StartSpan('nodejs get /');
  }

  var svc = process.env.SERVICES.split(',');
  var rr = [];
  for (const url of svc) {
    var headers = {};
    tracer.inject(sp, FORMAT_HTTP_HEADERS, headers);
    req = {
      method: 'GET',
      url: url,
      headers: headers,
    };
    var response = await http.request(req);
    rr.push(response.data);
  };
  res.send("NodeJS root, other services: " + rr.toString());
})

app.get('/hello', (req, res) => {
  res.send('Hello Node!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));