import React, { Component } from 'react';
import styles from './App.css';
import { connect } from 'react-redux';
import { authStart } from '../../actions/auth';
import DHLayout from '../../components/Layout/Layout';

class App extends Component {
  state = {
    items: []
  };

  handleOnlineBtnClick = () => {
    this.props.authStart();
  };

  render() {
    return (
      <div className={styles.app}>
        <DHLayout>
          <div className='login'>
            <div className='card card-bar-blue block trailer-1'>
              <div className='card-content'>
                <p className='app-logo'>Housekeeping</p>
                <p className='font-size--1 card-last'>
                  A simple tool to help tidy up your Web GIS
                </p>
                <br />
                <button
                  onClick={this.handleOnlineBtnClick}
                  className='btn btn-large login-btn'
                >
                  ArcGIS Online
                </button>
                <button className='btn btn-large login-btn btn-disabled'>
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
