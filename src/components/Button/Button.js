import React, { Component } from 'react';
import cardStyles from './Button.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import NavigationIcon from '@material-ui/icons/Navigation';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

const DHButton = (props) => {
    const { classes, config } = props;
    const noop = ()=>{};
    return (
      <Button onClick={(config && config.onClick) ? config.onClick : noop} variant="extendedFab" aria-label="Delete" className={classes.button}>
        {config.label}
        <Icon>{config.icon}</Icon>
      </Button>
    )
};


DHButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DHButton);
