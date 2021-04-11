import React from 'react';
import { makeStyles, AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import AppDrawer from './AppDrawer';
import AppToolbar from './AppToolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  page: {
    background: '#f9f9f9',
    width: '100%',
    minHeight: '100vh'
  },
  components: {
    padding: theme.spacing(2)
  }
}));

function Layout({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      
      <AppDrawer />
      <div className={classes.page}>
        <AppToolbar />
        <div className={classes.components}>
          { children }
        </div>
      </div>
    </div>
  )
}

export default Layout
