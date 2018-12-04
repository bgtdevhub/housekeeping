import React, { Component } from 'react';
import styles from './App.css';
import { connect } from 'react-redux';
import { authStart } from '../../actions/auth';
import DHLayout from '../../components/Layout/Layout';

class App extends Component {
    state = {
      items: []
    }

    handleOnlineBtnClick = () => {
      this.props.authStart();
    };

    render() {
        return (
            <div className={styles.app}>
              <DHLayout>
                <div className="grid-container">
                  <div className="column-12">
                    <div className="column-6 pre-3 post-3 tablet-column-12 phone-column-12 leader-2">
                      <div className="card card-bar-blue block trailer-1">
                        <div className="card-content">

                          <h4>Housekeeping</h4>
                          <p className="font-size--1 card-last">A simple tool to help tidy up your Web GIS</p>
                          <br/>
                          <button onClick={this.handleOnlineBtnClick} className="btn btn-large" style={{marginBottom: '10px'}}>ArcGIS Online</button>
                          <button className="btn btn-large">ArcGIS Enterprise</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DHLayout>
            </div>
        );
    }
}

const actions = { authStart };

const appStateToProps = (state) => {
    return {
      authenticated: state.authReducer.authenticated
    }
}

export default connect(
  appStateToProps,
  actions
)(App);
