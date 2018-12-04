import { combineReducers } from 'redux';
import authReducer from './auth-reducer';
import profileReducer from './profile-reducer';

const rootReducer = combineReducers({
  authReducer,
  profileReducer
});

export default rootReducer;
