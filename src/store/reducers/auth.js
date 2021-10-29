import { LOGIN, AUTHENTICATE } from "../actions/auth";

const initialState = {
  token: null,
  roles: null,
  userid: null,
  isUserLogged: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.token,
        roles: action.roles,
        userid: action.userid,
        isUserLogged: true,
      };
    case AUTHENTICATE:
      return {
        ...state,
        isUserLogged: true,
      };
    default:
      return state;
  }
};
