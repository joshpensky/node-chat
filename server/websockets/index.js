const WebSocket = require('ws');
const uuid = require('node-uuid');
const { REGISTER_USER } = require('./actions/types');
require('./channels');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });
  wss.createChannel('all');
  wss.createChannel('not-all');
  wss.counter = 0;
  
  WebSocket.prototype.join = function(channelName) {
    var joined = wss.joinChannel(this, channelName);
  }

  WebSocket.prototype.create = function(channelName) {
    var created = wss.createChannel(channelName);
    if (created) {
      channel.clients.add(this);
    }
  }

  const wsReducer = require('./reducer');
  wss.on('connection', ws => {
    const initChannel = wss.counter % 2 ? 'all' : 'not-all';
    wss.counter += 1;
    Object.assign(ws, {
      id: uuid.v4(),
      history: [],
      typing: false,
      isAlive: true,
      channels: new Set(),
    });
    ws.join(initChannel);
    ws.on('ping', () => {
      this.isAlive = true;
    });
    ws.on('message', msg => {
      wsReducer(wss, ws, msg);
    });
    ws.send(JSON.stringify({
      type: REGISTER_USER,
      payload: {
        id: ws.id,
        channel: initChannel,
      },
    }));
  })

  /*
  const noop = () => {};
  const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30000);*/
}