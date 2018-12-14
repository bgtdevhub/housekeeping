import React from 'react';
import './Header.css';

const Header = props => {
  const { classes } = props;
  return (
    <div className='header'>
      <div className='app-logo'>
        Housekeeping
      </div>
      {/*<div className='logout'>Logout</div>*/}
    </div>
  );
};

export default Header;
