import { GET_USER } from "./actions";

const initialState = {
  user: {},
  latest: [],
};

function cmgReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export default cmgReducer;
