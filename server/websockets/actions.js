const WebSocket = require('ws');

module.exports = {
  sendMessage: (wss, ws, msg) => {
    msg.received_at = Date.now().toString();
    msg.from = ws.id;
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
};