import { RECEIVE_MESSAGE, SEND_MESSAGE, TOGGLE_TYPING, UPDATE_TYPERS } from 'actions/types';

const initialState = {
  log: [],
  typing: false,
  typers: new Set(),
  users: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_MESSAGE:
    case SEND_MESSAGE:
      return {
        ...state,
        log: [...state.log, action.payload],
      }
    case TOGGLE_TYPING:
      return {
        ...state,
        typing: action.payload
      }
    case UPDATE_TYPERS:
      const { typing, user } = action.payload;
      if (typing) {
        state.typers.add(user);
      } else {
        state.typers.delete(user);
      }
      return {
        ...state,
        typers: state.typers,
        users: Array.from(state.typers),
      };
    default:
      return state;
  }
}