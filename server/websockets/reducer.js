const wsActions = require('./actions');
const types = require('./types');

module.exports = (wss, ws, action) => {
  switch (action.type) {
    case types.SEND_MESSAGE:
      return wsActions.sendMessage(wss, ws, action.payload);
    case types.TOGGLE_TYPING:
      return wsActions.toggleTyping(wss, ws, action.payload);
    default:
      ws.send(JSON.stringify({
        type: types.ERR_ACTION_UNKOWN,
        payload: {
          message: 'The given action type "' + action.type + '" is unknown.',
        },
      }));
  }
}