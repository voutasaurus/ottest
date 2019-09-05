const express = require('express');
const app = express();
const et = require('express-opentracing');
const middleware = et.default;
const { initTracer } = require("./tracing");
const tracer = initTracer("node-hello");
const port = 3000;

app.use(middleware({tracer: tracer}));

app.get('/', (req, res) => {
    // TODO: hit other services
  res.send('Hello Node!')
})

app.get('/hello', (req, res) => {
  res.send('Hello Node!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
