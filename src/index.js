import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.scss';
import App from './pages/App/App';
import Profile from './pages/Profile/Profile.jsx';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './store/index';

import config from 'react-global-configuration';

// Calcite React
import { ThemeProvider } from 'styled-components';
import CalciteTheme from 'calcite-react/theme/CalciteTheme';

window.configPromise.then(configData => {
  config.set(JSON.parse(configData));

  console.log('config', config, config.get('id'));

  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={CalciteTheme}>
        <Router>
          <div>
            <Route exact path='/' component={App} />
            <Route path='/profile' component={Profile} />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
});

serviceWorker.unregister();
