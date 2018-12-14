import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './App.css';
import logo from '../../img/app-logo.png';
import enterpriseIcon from '../../img/icons/ui/enterprise64.png';
import onlineIcon from '../../img/icons/ui/online64.png';
import { connect } from 'react-redux';
import { authStart } from '../../actions/auth';
import DHLayout from '../../components/Layout/Layout';

class App extends Component {
  state = {
    items: []
  };

  static childContextTypes = {
    callbacks: PropTypes.object,
    config: PropTypes.object
  };

  getChildContext() {
    return {
      callbacks: {},
      config: { show: false }
    };
  }

  handleOnlineBtnClick = () => {
    this.props.authStart();
  };

  render() {
    return (
      <div className={styles.app}>
        <DHLayout>
          <div className='login'>
            <div className='card card-bar-blue block'>
              <div className='card-content'>
                <p className='app-logo'>
                  <img className='app-logo-img' src={logo} alt='HOUSEKEEPING' />
                  Housekeeping
                </p>
                <p className='font-size--1 card-last'>
                  A simple tool to help tidy up your Web GIS
                </p>
                <br />
                <button
                  onClick={this.handleOnlineBtnClick}
                  className='btn btn-large login-btn'
                >
                  <img src={onlineIcon} />
                  ArcGIS Online
                </button>
                <button className='btn btn-large login-btn btn-disabled'>
                  <img src={enterpriseIcon} />
                  ArcGIS Enterprise
                </button>
              </div>
            </div>
          </div>
        </DHLayout>
      </div>
    );
  }
}

const actions = { authStart };

const appStateToProps = state => {
  return {
    authenticated: state.authReducer.authenticated
  };
};

export default connect(
  appStateToProps,
  actions
)(App);
