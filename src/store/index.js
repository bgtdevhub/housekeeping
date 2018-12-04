import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/index';

import thunk from 'redux-thunk';
import logger from '../middlewares/logger';
import auth from '../middlewares/auth';
import { profileFilter, profileUser, profileItemsRemoval, profileChart } from '../middlewares/profile';

const initialStore = {};

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const middlewares = applyMiddleware(thunk, logger, auth, profileFilter, profileUser, profileItemsRemoval, profileChart);

const enhancer = composeEnhancers(
  middlewares
  // other store enhancers if any
);

const store = createStore(rootReducer, initialStore, enhancer);
window.store = store;
export default store;
