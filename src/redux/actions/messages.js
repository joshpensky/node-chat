import {
  MESSAGE_DELIVERED,
  RECEIVE_MESSAGE,
  SEND_MESSAGE,
  TOGGLE_TYPING,
  UPDATE_TYPERS,
  UPDATE_SENDBAR_HEIGHT
} from 'actions/types';

export const updateSendBarHeight = height => (dispatch, getState) => {
  dispatch({
    type: UPDATE_SENDBAR_HEIGHT,
    payload: height,
  });
}

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
    ws.send(JSON.stringify([msgAction, typeAction]), { mask: true });
    dispatch(msgAction);
    dispatch(typeAction);
  }
};

export const receiveMessage = message => dispatch => {
  dispatch({
    type: RECEIVE_MESSAGE,
    payload: message
  });
};

export const toggleTyping = typing => (dispatch, getState) => {
  const { ws } = getState().websockets;
  const action = {
    type: TOGGLE_TYPING,
    payload: typing
  };
  ws.send(JSON.stringify(action), { mask: true });
  dispatch(action)
};

export const updateTypers = typeData => dispatch => {
  dispatch({
    type: UPDATE_TYPERS,
    payload: typeData,
  })
};

export const messageDelivered = message => dispatch => {
  dispatch({
    type: MESSAGE_DELIVERED,
    payload: message,
  });
}