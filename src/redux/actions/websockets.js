import { CONNECT_TO_SERVER, REGISTER_USER } from 'actions/types';

export const connectToServer = () => (dispatch, getState) => {
  const { ws } = getState().websockets;
  ws.onopen = () => {
    console.log('Connected to websockets!');
  }
  dispatch({
    type: CONNECT_TO_SERVER,
    payload: ws,
  });
};

export const registerUser = user => (dispatch, getState) => {
  dispatch({
    type: REGISTER_USER,
    payload: user,
  });
}