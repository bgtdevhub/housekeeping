import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import argisApi from '../../../../services/argis';

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
        <div className={classes.root}>
          <div className={'card card-wide' + classes.card}>
            <a style={{textAlign: 'right', cursor: 'pointer'}} onClick={callbacks.close}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='21'
                height='21'
                viewBox='0 0 32 32'
                className='svg-icon'
              >
                <path d='M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z' />
              </svg>
            </a>
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
              {!!data.url ? (
                <button
                  onClick={event => this.handleMoreDetailClick(data, event)}
                  className='btn modifier-class btn-fill'
                >
                  More Details
                </button>
              ) : null}
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
