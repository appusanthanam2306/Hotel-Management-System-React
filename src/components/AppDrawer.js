import React, { useState } from 'react';
import clsx from 'clsx';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import { makeStyles, Drawer, Typography, List, Divider, Avatar, IconButton } from '@material-ui/core';
import { Dashboard, Event, Person, MeetingRoom, Domain, Deck, KingBed, MenuOpen, Delete, KeyboardArrowLeft, KeyboardArrowRight, History, Update } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import NavBarItem from './NavBarItem';

const drawerWidth = 256;
const useStyles = makeStyles((theme) => ({
  root: {
    color: '#fff',
  },
  dividerBgColor: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconColor: {
    color: 'rgba(255, 255, 255)'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawerPaper: {
    backgroundColor: theme.palette.primary.main,
    backgroundImage: 'url("//www.gstatic.com/mobilesdk/190424_mobilesdk/nav_nachos@2x.png")',
    backgroundPosition: 'left 0 bottom 0',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '256px 556px',
  },
  active: {
    background: '#f4f4f4'
  },
  title: {
    padding: theme.spacing(1),
    color: theme.palette.primary.contrastText,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    height: '62.5px',
    backgroundColor: theme.palette.secondary.main
  },
  titleText: {
    color: 'white',
  },
  handleDrawer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: (open) => {
      return open ? 'flex-end' : 'flex-start'
    },
    alignItems: (open) => {
      return open ? 'flex-end' : 'flex-start'
    },
    marginLeft: (open) => {
      return open ? 0 : theme.spacing(1)
    }
  }
}));

function AppDrawer(props) {
  const [ open, setOpen ] = useState(isWidthUp('lg', props.width) ? true : false);
  const classes = useStyles(open);
  const history = useHistory();
  const menuItems = [
    /* {
      text: 'Dashboard',
      icon: <Dashboard color="disabled" className={classes.iconColor} />,
      path: '/',
      children: []
    }, */
    {
      text: 'Bookings',
      shortName: 'BK',
      children: [
        {
          text: 'Bookings',
          icon: <Event color="disabled" className={classes.iconColor} />,
          path: '/bookings',
          children: []
        },
        {
          text: 'Past Bookings',
          icon: <History color="disabled" className={classes.iconColor} />,
          path: '/bookings/pastBookings',
          children: []
        },
        {
          text: 'Future Bookings',
          icon: <Update color="disabled" className={classes.iconColor} />,
          path: '/bookings/futureBookings',
          children: []
        },
      ]
    },
    {
      text: 'Guests',
      icon: <Person color="disabled" className={classes.iconColor} />,
      path: '/guests',
      children: []
    },
    /* {
      text: 'Booked Rooms',
      icon: <MeetingRoom color="disabled" className={classes.iconColor} />,
      path: '/bookedRooms',
      children: []
    }, */
    {
      text: 'Hotel Configuration',
      shortName: 'HC',
      children: [
        {
          text: 'Room Types',
          icon: <KingBed color="disabled" className={classes.iconColor} />,
          path: '/hotelConfiguration/roomTypes'
        },
        {
          text: 'Rooms',
          icon: <MeetingRoom color="disabled" className={classes.iconColor} />,
          path: '/hotelConfiguration/rooms'
        },
        {
          text: 'Floors',
          icon: <Domain color="disabled" className={classes.iconColor} />,
          path: '/hotelConfiguration/floors'
        },
        {
          text: 'Amenities',
          icon: <Deck color="disabled" className={classes.iconColor} />,
          path: '/hotelConfiguration/amenities'
        }
      ]
    }
  ];
  
  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <Drawer
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        anchor="left"
      >
        <div className={classes.title} onClick={() => history.push('/')}>
          <Avatar alt="Remy Sharp" src="/images/hotel.png"/>
          {
            open ?
              (<Typography 
                variant="h6"
                noWrap
                className={classes.titleText}
              >
                SSMY Hotel
              </Typography>) :
              null
          }
        </div>
        <Divider className={classes.dividerBgColor} />
        <List>
          { menuItems.map((menu) => (
            <React.Fragment key={menu.text}>
              <NavBarItem 
                menu={menu}
                open={open}
              />
              {
                menu.children.map((childMenu) => (
                  <NavBarItem 
                    menu={childMenu}
                    open={open}
                    key={childMenu.text}
                  />
                ))
              }
              <Divider className={classes.dividerBgColor}/>
            </React.Fragment>
          ))}
        </List>
        <div className={classes.handleDrawer}>
          {
            open ?
              (<IconButton aria-label="Close Drawer" onClick={handleDrawerOpen}>
                <KeyboardArrowLeft className={classes.iconColor} />
              </IconButton> ) :
              (<IconButton aria-label="Close Drawer" onClick={handleDrawerOpen}>
                <KeyboardArrowRight className={classes.iconColor} />
              </IconButton>)
          }
        </div>
      </Drawer>
    </div>
  )
}

export default withWidth()(AppDrawer);