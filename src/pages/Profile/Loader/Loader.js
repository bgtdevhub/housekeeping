import React from 'react';

const Loader = (props) => {
  // const { data, callbacks } = props;
  return (
    <div className="loader is-active padding-leader-3 padding-trailer-3">
      <div className="loader-bars"></div>
      <div className="loader-text">Loading...</div>
    </div>
  )
};

export default Loader;
