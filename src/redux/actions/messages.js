import { RECEIVE_MESSAGE, SEND_MESSAGE, TOGGLE_TYPING, UPDATE_TYPERS } from 'actions/types';

export const sendMessage = message => (dispatch, getState) => {
  const { ws } = getState().websockets;
  if (message.data.trim().length > 0) {
    const msgAction = {
      type: SEND_MESSAGE,
      payload: message,
    };
    const typeAction = {
      type: TOGGLE_TYPING,
      payload: false,
    };
    ws.send(JSON.stringify([msgAction, typeAction]));
    dispatch(msgAction);
    dispatch(typeAction);
  }
};

export const receiveMessage = message => dispatch => {
  dispatch({
    type: RECEIVE_MESSAGE,
    payload: message
  })
};

export const toggleTyping = typing => (dispatch, getState) => {
  const { ws } = getState().websockets;
  const action = {
    type: TOGGLE_TYPING,
    payload: typing
  };
  ws.send(JSON.stringify(action));
  dispatch(action)
};

export const updateTypers = typeData => dispatch => {
  dispatch({
    type: UPDATE_TYPERS,
    payload: typeData,
  })
};