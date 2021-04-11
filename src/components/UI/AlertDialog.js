import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function AlertDialog ({ open, handleClose, title, content, handleConfirm }) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
      >
        <DialogTitle id="alert-dialog-title">{ title }</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { content }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleClose } color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={ handleConfirm } color="primary" variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AlertDialog;
