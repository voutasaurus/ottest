const express = require('express');
const app = express();
const et = require('express-opentracing');
const middleware = et.default;
const { initTracer } = require("./tracing");
const tracer = initTracer("node-hello");
const port = 3000;
const http = require('axios');

app.use(middleware({tracer: tracer}));

app.get('/', async (req, res) => {
  var svc = process.env.SERVICES.split(',');
  var rr = [];
  for (const url of svc) {
    var response = await http.get(url);
    rr.push(response.data);
  };
  res.send("NestJS root, other services: " + rr.toString());
})

app.get('/hello', (req, res) => {
  res.send('Hello Node!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
