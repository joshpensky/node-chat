const WebSocket = require('ws');
const uuid = require('node-uuid');
const types = require('./types');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });
  const wsReducer = require('./reducer');
  wss.on('connection', ws => {
    ws.id = uuid.v4();
    ws.history = [];
    ws.typing = false;
    ws.isAlive = true;
    ws.on('ping', () => {
      this.isAlive = true;
    });
    ws.on('message', msg => {
      var actions = JSON.parse(msg);
      if (!Array.isArray(actions)) {
        actions = [actions];
      }
      actions.forEach(action => {
        wsReducer(wss, ws, action);
      });
    });
    ws.send(JSON.stringify({
      type: types.REGISTER_USER,
      payload: {
        id: ws.id,
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

  wss.broadcast = data => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };
}