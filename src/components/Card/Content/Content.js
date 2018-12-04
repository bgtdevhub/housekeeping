import React, { Component } from 'react';
import cardContentStyles from './Content.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';


const styles = {
};

const DHCardContent = (props) => {
    const { classes } = props;
    return (
      <CardContent>
        {props.children}
      </CardContent>
    )
};


DHCardContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DHCardContent);
