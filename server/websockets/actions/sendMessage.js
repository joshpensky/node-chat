const { OPEN } = require('ws');
const { MESSAGE_DELIVERED, RECEIVE_MESSAGE } = require('./types');
const { CHAIN_EXPIRE } = require('../constants');
const { clientInChannel } = require('./utils');

module.exports = (wss, ws, msg) => {
  clientInChannel(wss, ws, msg.channel, channel => {
    msg.received_at = Date.now().toString();
    msg.from = ws.id;
    msg.chained = ws.history.length > 0 && (msg.created_at - ws.history.slice(-1)[0].created_at <= CHAIN_EXPIRE);
    ws.history.push(msg);
    channel.history.push(msg);
    channel.history = channel.history.slice(-128);
    channel.clients.forEach(client => {
      if (client.readyState === OPEN && client !== ws) {
        client.send(JSON.stringify({
          type: RECEIVE_MESSAGE,
          payload: msg,
        }));
      }
    });
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: MESSAGE_DELIVERED,
        payload: msg,
      }));
    }, 500);
  });
};