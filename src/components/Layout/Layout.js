import React, { Component } from 'react';
import Header from './Header/Header';
// import Footer from './Footer/Footer';
// import styles from './Layout.css';

const DHLayout = ({ children }) => (
  <div>
    <Header />
    <div>{children}</div>
  </div>
);

export default DHLayout;
