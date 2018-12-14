import React from 'react';
import './Header.css';

const Header = props => {
  const { classes } = props;
  return (
    <div className='header'>
      <h1 className='app-logo' style={{ margin: 0 }}>
        Housekeeping
      </h1>
    </div>
  );
};

export default Header;
