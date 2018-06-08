import { REGISTER_USER } from 'actions/types';

const ws = new WebSocket('ws://localhost:3001');

const initialState ={
  ws,
  id: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        id: action.payload.id
      }
    default:
      return state;
  }
}