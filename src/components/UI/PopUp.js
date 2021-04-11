import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textUppercase: {
    textTransform: 'uppercase'
  }
}));

function PopUp ({ title, children, openPopUp, setOpenPopUp, dialogWidth }) {
  const classes = useStyles();

  return (
    <Dialog open={openPopUp} maxWidth={ dialogWidth || 'xs' } TransitionComponent={Slide}>
      <DialogTitle classes={{root: classes.root}}>
        <div className={classes.titleContainer}>
          <Typography variant="h6" className={classes.textUppercase}>
            { title }
          </Typography>
          <IconButton aria-label="delete" onClick={() => setOpenPopUp(false)}>
            <ClearIcon color="error"/>
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        { children }
      </DialogContent>
    </Dialog>
  )
}

export default PopUp
