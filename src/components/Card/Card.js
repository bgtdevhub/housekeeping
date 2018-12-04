import React, { Component } from 'react';
import cardStyles from './Card.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

const DHCard = (props) => {
    const { classes } = props;
    return (
      <Card className={classes.card}>
          {props.children}
      </Card>
    )
};


DHCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DHCard);
