import React from 'react';
// import headerStyles from './Header.css';

const Header = props => {
  const { classes } = props;
  return (
    <div className='panel panel-dark-blue'>
      <h4 className='' style={{ margin: 0 }}>
        Housekeeping
      </h4>
    </div>
  );
};

export default Header;
