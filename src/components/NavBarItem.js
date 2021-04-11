import React from 'react';
import { makeStyles, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  iconColor: {
    color: 'rgba(255, 255, 255)'
  },
  listItemTextColor: {
    color: 'rgba(255, 255, 255)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }
}));

function NavBarItem ({ menu, open }) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <ListItem
      button
      key={menu.text}
      onClick={ () => menu.path && history.push(menu.path) }
    >
      { menu.icon ? <ListItemIcon>{ menu.icon }</ListItemIcon> : null}
      {
        menu.shortName && menu.children && !open ?
          <ListItemText className={classes.iconColor}>{ menu.shortName }</ListItemText> :
          <ListItemText className={classes.listItemTextColor}>{ menu.text }</ListItemText>
      }
    </ListItem>
  )
}

export default NavBarItem;
