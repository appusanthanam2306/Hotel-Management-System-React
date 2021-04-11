import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

function Notifications ({notify, setNotify}) {

  function handleClose (event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setNotify({
      isOpen: false
    })
  }

  return (
    <Snackbar
      open={notify.isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert
        severity={notify.type}
        onClose={handleClose}
      >
        { notify.message }
      </Alert>
    </Snackbar>
  )
}

export default Notifications
