const logger = store => next => action => {
  console.log('Logger Middleware => Action called:', action.type);
  return next(action);
};

export default logger;
