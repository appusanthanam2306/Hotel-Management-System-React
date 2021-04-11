import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { Grid } from '@material-ui/core';
import DashboardTile from './DashboardTile';
import ApartmentIcon from '@material-ui/icons/Apartment';
import KingBedIcon from '@material-ui/icons/KingBed';
import DeckIcon from '@material-ui/icons/Deck';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

const useStyles = makeStyles((theme) => ({
  root: {
    /* display: 'flex',
    gap: theme.spacing(2),
    '& > *': {
      flexGrow: 1
    } */
  },
  dashboardIcon: {
    fontSize: '26px',
    fontWeight: 400,
    lineHeight: 1
  },
  link: {
    textDecoration: 'none'
  }
}));

const backgroundColors = [
  'linear-gradient(45deg,#4099ff,#73b4ff)',
  'linear-gradient(45deg,#2ed8b6,#59e0c5)',
  'linear-gradient(45deg,#ffb64d,#ffcb80)',
  'linear-gradient(45deg,#ff5370,#ff869a)'
]

function Dashboard({ dashboardMetrics }) {
  const classes = useStyles();

  function fetchDashboardIcon (id) {
    if (id === 'floors') {
      return <ApartmentIcon />
    } else if (id === 'roomTypes') {
      return <KingBedIcon />
    } else if (id === 'rooms') {
      return <MeetingRoomIcon />
    } else if (id === 'amenities') {
      return <DeckIcon />
    }
  }

  return (
    <Grid container className={classes.root} spacing={2}>
      {
        dashboardMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id} to={metric.id}>
            <Link to={metric.id} className={classes.link}>
              <DashboardTile 
                count={metric.count}
                title={metric.label}
                meta={metric.meta}
                bgColor={backgroundColors[index]}
              >
                { fetchDashboardIcon(metric.id) }
              </DashboardTile>
            </Link>
          </Grid>
        ))
      }
    </Grid>
  )
}

export default Dashboard
