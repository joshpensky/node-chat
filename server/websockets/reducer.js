const wsActions = require('./actions');

module.exports = (wss, ws, action) => {
  switch (action.type) {
    case 'SEND_MESSAGE':
      return wsActions.sendMessage(wss, ws, action.payload);
    case 'TOGGLE_TYPING':
      return wsActions.toggleTyping(wss, ws, action.payload);
    default:
      ws.send(JSON.stringify({
        type: 'ERR_ACTION_UNKOWN',
        payload: {
          message: 'The given action type "' + action.type + '" is unknown.',
        }
      }));
  }
}