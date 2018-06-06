const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');
const WebSocket = require('ws');
const uuid = require('node-uuid');

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

const noop = () => {};

const heartbeat = () => {
  this.isAlive = true;
}

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const sendMessage = (ws, message) => {
  message.received_at = Date.now().toString();
  message.from = ws.id;
  const broadcastData = {
    type: 'RECEIVE_MESSAGE',
    payload: message,
  };
  const senderData = {
    type: 'MESSAGE_DELIVERED',
    payload: message,
  };
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        client === ws
        ? JSON.stringify(senderData)
        : JSON.stringify(broadcastData));
    }
  });
};

const toggleTyping = (ws, typing) => {
  const broadcastData = {
    type: 'USER_TYPING',
    payload: {
      typing,
      user: ws.id,
    },
  };
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify(broadcastData));
    }
  });
}

wss.on('connection', ws => {
  ws.id = uuid.v4();
  ws.isAlive = true;
  //ws.on('ping', heartbeat);
  ws.on('message', msg => {
    var actions =  JSON.parse(msg);
    if (!Array.isArray(actions)) {
      actions = [actions];
    }
    actions.forEach(a => {
      switch (a.type) {
        case 'SEND_MESSAGE':
          return sendMessage(ws, a.payload);
        case 'TOGGLE_TYPING':
          return toggleTyping(ws, a.payload);
        default:
          ws.send(JSON.stringify({
            type: 'ERR_ACTION_UNKOWN',
            payload: {
              message: 'The given action type "' + a.type + '" is unknown.',
            }
          }));
      }
    })
  });
  ws.send(JSON.stringify({
    type: 'REGISTER_USER',
    payload: {
      id: ws.id,
    },
  }));
})

const interval = setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server started on port ${server.address().port}`);
})