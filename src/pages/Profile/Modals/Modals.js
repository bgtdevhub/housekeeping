import React from 'react';
import Button from 'calcite-react/Button';
import './Modals.css';

export const FirstTryModal = props => {
  const { data, callbacks } = props;
  return (
    <div
      className='js-modal modal-overlay modifier-class'
      data-modal='firstDeleteConfirmation'
    >
      <div
        className='modal-content column-6'
        role='dialog'
        aria-labelledby='modal'
        role='dialog'
      >
        <a
          onClick={callbacks.close}
          className='js-modal-toggle right'
          href='#'
          aria-label='close-modal'
        >
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

        <h3 className='trailer-half'>Are you sure?</h3>
        <p>
          These changes cannot be un-done. You are about to permanently delete
          <b>
            {' '}
            {data.total} item{data.total > 1 ? 's' : ''}
          </b>{' '}
          from your account
        </p>

        <div className='text-right'>
          <Button onClick={callbacks.close} clear>
            Cancel
          </Button>
          <Button
            onClick={callbacks.remove}
            style={{ background: '#de2900', borderColor: '#de2900' }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export const SecondTryModal = props => {
  const { data, callbacks } = props;
  return (
    <div
      className='js-modal modal-overlay modifier-class'
      data-modal='secondDeleteConfirmation'
    >
      <div
        className='modal-content column-6'
        role='dialog'
        aria-labelledby='modal'
        role='dialog'
      >
        <a
          onClick={callbacks.close}
          className='js-modal-toggle right'
          href='#'
          aria-label='close-modal'
        >
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

        <h3 className='trailer-half'>Are you really sure?</h3>
        <p>
          <b>{data.total}</b> items
          <br />
          <b>{data.size}</b> MB
          <br />
          Using <b>{data.estimatedCredit}</b> Credits/Month
          <br />
        </p>

        <div className='text-right'>
          <Button onClick={callbacks.close} clear>
            Cancel
          </Button>
          <Button onClick={callbacks.remove} style={{ background: '#de2900' }}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export const NotificationModal = props => {
  const { data, callbacks } = props;
  return (
    <div
      className='js-modal modal-overlay modifier-class'
      data-modal='notification'
    >
      <div
        className='modal-content column-4'
        role='dialog'
        aria-labelledby='modal'
        role='dialog'
      >
        <div style={{ textAlign: 'center' }}>
          <div class='deleteLoader' />
          Cleaning up...
        </div>
      </div>
    </div>
  );
};
