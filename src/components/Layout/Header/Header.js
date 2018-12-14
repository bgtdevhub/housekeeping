import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Header.css';

class Header extends Component {
  static contextTypes = {
    logout: PropTypes.object
  }

  render() {
    const { logout } = this.context;
debugger;
    return (
      <div className='header'>
        <div className='app-logo'>
          Housekeeping
        </div>
        <div className='logout' onClick={logout}>Logout</div>
      </div>
    );
  }
}

export default Header;
