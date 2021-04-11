import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';
import IconButton from '@material-ui/core/IconButton';
import red from '@material-ui/core/colors/red';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  confirmTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(1)
  },
  confirmSubtitle: {
    textAlign: 'center'
  },
  confirmActions: {
    justifyContent: 'center',
    marginBottom: theme.spacing(1)
  },
  dialogTitle: {
    textAlign: 'center',
    marginTop: theme.spacing(1)
  },
  titleIcon: {
    backgroundColor: red[200],
    color: red[700],
    '&:hover': {
      backgroundColor: red[200],
      cursor: 'default'
    },
    '& .MuiSvgIcon-root': {
      fontSize: '8rem'
    }
  },
  buttonWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  confirmButton: {
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[500]
    }
  },
  alertMessage: {
    textAlign: 'center',
    margin: `0.5rem 1rem`
  }
}));

function ConfirmDialog({confirmDialog, setConfirmDialog, performingConfirmAction, errorsDuringDelete, setErrorsDuringDelete = []}) {
  const classes = useStyles();

  function handleCloseDialog () {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    setErrorsDuringDelete([]);
  }

  return (
    <Dialog open={confirmDialog.isOpen}>
      {
        errorsDuringDelete.map((error) => (
          <Alert
            key={error.message}
            severity='error'
            className={classes.alertMessage}
          >{error.message}
          </Alert>
        ))
      }
      <DialogTitle className={classes.dialogTitle}>
        <IconButton disableRipple className={classes.titleIcon}>
          <NotListedLocationIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" className={classes.confirmTitle}>
          {confirmDialog.title}
        </Typography>
        <Typography variant="subtitle2" className={classes.confirmSubtitle}>
          {confirmDialog.subtitle}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.confirmActions}>
        <Button
          variant="outlined"
          disabled={performingConfirmAction}
          onClick={handleCloseDialog}
        >No</Button>
        <div className={classes.buttonWrapper}>
          <Button
            color="primary"
            variant="contained"
            className={classes.confirmButton}
            onClick={() => confirmDialog.onConfirm()}
            disabled={performingConfirmAction}
          >
            YES
          </Button>
          {performingConfirmAction && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog;
