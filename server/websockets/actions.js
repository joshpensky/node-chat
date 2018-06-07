const WebSocket = require('ws');

const CHAIN_EXPIRE = 1000 * 60;

const broadcastTyping = (wss, ws, typing) => {
  ws.typing = typing;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify({
        type: 'USER_TYPING',
        payload: {
          typing,
          user: ws.id,
        },
      }));
    }
  });
};

module.exports = {
  sendMessage: (wss, ws, msg) => {
    msg.received_at = Date.now().toString();
    msg.from = ws.id;
    msg.chained = ws.history.length > 0 && (msg.created_at - ws.history.slice(-1)[0].created_at <= CHAIN_EXPIRE);
    ws.history.push(msg);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: client === ws ? 'MESSAGE_DELIVERED' : 'RECEIVE_MESSAGE',
          payload: msg,
        }));
      }
    });
  },
  toggleTyping: (wss, ws, typing) => {
    if (ws.typeTimeout) {
      clearTimeout(ws.typeTimeout);
      ws.typeTimeout = undefined;
    }
    broadcastTyping(wss, ws, typing);
    ws.typeTimeout = setTimeout(() => {
      if (ws.typing) {
        broadcastTyping(wss, ws, false);
      }
    }, CHAIN_EXPIRE);
  }
};