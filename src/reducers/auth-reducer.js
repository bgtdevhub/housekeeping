import {
  AUTH_SUCCESS,
  AUTH_START
} from '../constants/actions';

const authReducer = (state = {}, action) => {

  switch (action.type) {
    case AUTH_START:
      return {
        authenticated: false
      };

    case AUTH_SUCCESS:
      return {
        authenticated: true
      };

    default:
      return state;
  }
};

export default authReducer;
