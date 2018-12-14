import React, { Component } from 'react';
import Header from './Header/Header';

class DHLayout extends Component {
  render() {
    return (
      <div>
        <Header />
        <div>{this.props.children}</div>
      </div>
    );
  }
}

export default DHLayout;
