const WebSocket = require('ws');

const CHAIN_EXPIRE = 1000 * 60;

module.exports = {
  sendMessage: (wss, ws, msg) => {
    msg.received_at = Date.now().toString();
    msg.from = ws.id;
    msg.chained = ws.history.length > 0 && (msg.created_at - ws.history.slice(-1)[0].created_at <= CHAIN_EXPIRE);
    ws.history.push(msg);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          client === ws
          ? JSON.stringify({
            type: 'MESSAGE_DELIVERED',
            payload: msg,
          })
          : JSON.stringify({
            type: 'RECEIVE_MESSAGE',
            payload: msg,
          }));
      }
    });
  },
  toggleTyping: (wss, ws, typing) => {
    const broadcastData = typing => {
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
    if (ws.typeTimeout) {
      clearTimeout(ws.typeTimeout);
      ws.typeTimeout = undefined;
    }
    ws.typing = typing;
    broadcastData(ws.typing);
    ws.typeTimeout = setTimeout(() => {
      console.log(ws.typing);
      if (ws.typing) {
        ws.typing = false;
        broadcastData(ws.typing);
      }
    }, CHAIN_EXPIRE);
  }
};