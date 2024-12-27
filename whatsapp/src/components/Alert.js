import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({username, message, onClose}) => {
  // const getAlertStyle = () => {
  //   switch (type) {
  //     case 'success':
  //       return 'bg-green-100 text-green-800 border-green-300';
  //     case 'error':
  //       return 'bg-red-100 text-red-800 border-red-300';
  //     case 'warning':
  //       return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  //     default:
  //       r
  // eturn 'bg-gray-100 text-gray-800 border-gray-300';
  //   }
  // };

  const gradientStyle = {
    background: `linear-gradient(
      90deg,
      oklch(0.293 0.071 250),
      color-mix(in oklch, oklch(0.293 0.071 250) 50%, oklch(0 0 0 / 0))
    )`,
  };
  return (
    <>
      <div className="toast-container p-4 position-fixed top-0 end-0" style={{ zIndex: 11, minWidth: '300px' }}>
        <div id="liveToast" className="toast show d-flex align-items-top justify-content-between" style={gradientStyle} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body">
            <strong className="me-auto">{username && username}</strong>
            <p>{message && message}</p>
          </div>
          <button type="button" className="btn-close p-3" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div >
    </>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default Alert;