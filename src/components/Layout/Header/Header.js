import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import logo from '../../../img/app-logo.png';

class Header extends Component {
  static contextTypes = {
    callbacks: PropTypes.object,
    config: PropTypes.object
  }

  render() {
    const { callbacks, config } = this.context;

    return (
      <div className='header'>
        <div className='app-logo'>
          <img className='app-logo-img' src={logo} alt='HOUSEKEEPING' />
          Housekeeping
        </div>
        <div className='logout' style={{display: (config.show) ? 'block' : 'none'}} onClick={callbacks.logout}>Logout</div>
      </div>
    );
  }
}


export default Header;
