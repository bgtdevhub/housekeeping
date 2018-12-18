import { combineReducers } from 'redux';
import authReducer from './auth-reducer';
import profileReducer from './profile-reducer';
import chartReducer from './chart-reducer';

const rootReducer = combineReducers({
  authReducer,
  profileReducer,
  chartReducer
});

export default rootReducer;
