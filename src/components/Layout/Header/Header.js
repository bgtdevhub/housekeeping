import React from 'react';
import './Header.css';
import logo from '../../../img/app-logo.png';

const Header = props => {
  const { classes } = props;
  return (
    <div className='header'>
      <div className='app-logo'>
        <img className='app-logo-img' src={logo} alt='HOUSEKEEPING' />
        Housekeeping
      </div>
      <div className='logout'>Logout</div>
    </div>
  );
};

export default Header;
