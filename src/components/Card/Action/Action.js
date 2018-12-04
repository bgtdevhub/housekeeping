import React from 'react';
import cardActionStyles from './Action.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';


const styles = {
};

const DHCardAction = (props) => {
    const { classes } = props;
    return (
      <CardActions>
        {props.children}
      </CardActions>
    )
};


DHCardAction.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DHCardAction);
