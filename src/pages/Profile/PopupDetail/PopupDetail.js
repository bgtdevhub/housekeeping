import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import argisApi from '../../../services/argis';

const styles = theme => ({
  root: {
    flexGrow: 1,
    background: '#ffffff',
    width: 250,
    borderRadius: 4
  },
  image: {
    width: '100%'
  },
  imageContainer: {
    margin: 0
  },
  card: {},
  popper: {
    zIndex: 1
  }
});

class PopupDetail extends React.Component {
  state = {
    open: false,
    placement: 'bottom'
  };

  handleMoreDetailClick(data) {
    if (!data.url) return;

    window.open(
      `https://${data.owner}.maps.arcgis.com/home/item.html?id=${data.id}`,
      '_blank'
    );
  }

  render() {
    const { data, config, classes, callbacks } = this.props;
    const { placement } = this.state;

    return (
      <Popper
        id={data.id}
        open={config.open}
        anchorEl={config.anchorEl}
        placement={placement}
        className={classes.popper}
      >
        <div className={classes.root} onMouseLeave={callbacks.close}>
          <div className={'card card-wide' + classes.card}>
            <figure className={classes.imageContainer}>
              <img
                className={classes.image}
                src={argisApi.getItemThumbnail(data.id, data.thumbnail)}
                alt={data.id}
              />
            </figure>
            <div className='card-content'>
              <h4>{data.title}</h4>
              <p className='font-size--1 trailer-half'>{data.snippet}</p>
              <button
                onClick={event => this.handleMoreDetailClick(data, event)}
                className='btn modifier-class btn-fill'
              >
                More Details
              </button>
            </div>
          </div>
        </div>
      </Popper>
    );
  }
}

PopupDetail.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PopupDetail);
