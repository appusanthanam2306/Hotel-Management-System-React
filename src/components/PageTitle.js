import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    margin: `${theme.spacing(1)}px 0`,
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
    fontWeight: 600,
    marginTop: theme.spacing(2),
    textAlign: 'center',
    fontStyle: "italic",
    textDecoration: "underline",
    textShadow: `2px 2px rgba(0, 0, 0, 0.1)`
  }
}));

function PageTitle ({ title }) {
  const classes = useStyles();

  return (
    <h2 className={ classes.title }>{ title }</h2>
  )
}

export default PageTitle
