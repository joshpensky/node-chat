const WebSocket = require('ws');
const uuid = require('node-uuid');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.broadcast = data => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  const websocketReducer = require('./reducer');

  wss.on('connection', ws => {
    ws.id = uuid.v4();
    ws.history = [];
    ws.typing = false;
    ws.isAlive = true;
    ws.on('ping', () => {
      this.isAlive = true;
    });
    ws.on('message', msg => {
      var actions =  JSON.parse(msg);
      if (!Array.isArray(actions)) {
        actions = [actions];
      }
      actions.forEach(action => {
        websocketReducer(wss, ws, action);
      });
    });
    ws.send(JSON.stringify({
      type: 'REGISTER_USER',
      payload: {
        id: ws.id,
      },
    }));
  })

  const noop = () => {};

  /*const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30000);*/
}