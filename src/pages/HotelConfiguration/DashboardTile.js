import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#fff',
    height: '100%',
    background: ({bgColor}) => {
      return bgColor
    },
    border: 0,
    boxShadow: `0 1px 2.94px 0.06px rgba(4,26,55,.16)`,
    borderRadius: '5px',
    '&:hover': {
      boxShadow: `0 0 25px -5px #9e9c9e`,
    },
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
    marginBottom: '0.5rem'
  },
  cardContent: {
    padding: `20px 25px`
  },
  countContainer: {
    fontSize: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '38px',
    marginBottom: '8px'
  },
  count: {
    lineHeight: 0.8,
    fontWeight: 700,
    textShadow: '2px 2px rgba(0, 0, 0, 0.1)',
    fontSize: '42px'
  },
  activeCount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
  }
}));

function DashboardTile ({ count, title, children, bgColor, meta }) {
  const classes = useStyles({bgColor});

  return (
    <Card variant="outlined" className={classes.root}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h6" className={classes.title}>{title}</Typography>
        <Typography variant="h2" className={classes.countContainer}>
          { children }
          <span className={classes.count}>{ count > 9 ? count : `0${count}` }</span>
        </Typography>
        <Typography className={classes.activeCount}>
          <span>{meta.label}</span>
          <span>{meta.count > 9 ? meta.count : `0${meta.count}`}</span>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardTile;
