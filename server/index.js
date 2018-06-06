const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');
const WebSocket = require('ws');

/* LOAD ENVIRONMENT VARIABLES */
require('dotenv').config();

const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.disable('x-powered-by');

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  ws.on('message', msg => {
    console.log(`received ${msg}`);
    console.log(except);
    wss.clients.forEach(client => {
      if (client !== ws) client.send(msg)
    });
  });
  ws.send('Thank you for connecting to Websockets!');
})

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server started on port ${server.address().port}`);
})