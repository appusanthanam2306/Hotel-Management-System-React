import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import useTable from '../UI/useTable';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey['500'],
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '0.75rem',
    gap: '1rem'
  },
  emptyPlaceholderCell: {
    padding: theme.spacing(3),
    fontSize: '1.1rem',
    textAlign: 'center'
  }
}));

const headCells = [
  { id: 'name', label: 'Guest Name' },
  { id: 'emailId', label: 'Email ID' },
  { id: 'phoneNumber', label: 'Phone Number' },
  { id: 'isVIP', label: 'VIP', align: 'center' },
  { id: 'actions', label: 'Actions', disableSort: true, align: 'center' }
]

function GuestsTable ({setOpenPopUp, guests, loadingGuests, handleVipStatusChange, handleDeleteGuest, setCurrentlyEditedGuest, setConfirmDialog}) {
  const classes = useStyles();
  const [ filterFn, setFilterFn ] = useState({ fn: (guests) => guests});

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPaginationAndSorting
  } = useTable(guests, headCells, filterFn);

  const deleteGuest = (guest) => {
    setCurrentlyEditedGuest(guest);
    setConfirmDialog({
      isOpen: true,
      title: 'Are you sure to delete this Guest',
      subtitle: 'You cannot undo this once the Guest is deleted.',
      onConfirm: () => handleDeleteGuest(guest._id)
    });
  }

  const handleAddNewGuest = ()  => {
    setCurrentlyEditedGuest(null);
    setOpenPopUp(true);
  }

  const handleEditGuest = (guest) => {
    setCurrentlyEditedGuest(guest);
    setOpenPopUp(true);
  }

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (guests) => {
        if (target.value === '') {
          return guests;
        } else {
          return guests.filter((guest) => `${guest.firstName} ${guest.lastName}${guest.emailId}${guest.phoneNumber}`.toLowerCase().includes(target.value.toLowerCase()));
        }
      }
    })
  };

  return (
    <div>
      <div className={classes.searchContainer}>
      <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          size="small"
          onChange={handleSearch}
        />
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={ handleAddNewGuest }
        >
          Add
        </Button>
      </div>
      <Paper>
        <TblContainer>
          <TblHead></TblHead>
          {
            !guests.length && !loadingGuests &&(
              <TableBody>
                <TableRow>
                  <StyledTableCell colSpan="12" className={classes.emptyPlaceholderCell}>No Guests Found.</StyledTableCell>
                </TableRow>
              </TableBody>
            )
          }
          <TableBody>
            {
              loadingGuests ?
              (
                [1, 2, 3, 4, 5].map((el) => (
                  <TableRow key={el}>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                  </TableRow>
                ))
              ) :
              (
                recordsAfterPaginationAndSorting().map((guest) => (
                  <StyledTableRow key={ guest._id }>
                    <StyledTableCell>
                      {guest.firstName} {guest.lastName} 
                    </StyledTableCell>

                    <StyledTableCell>
                      {guest.emailId}
                    </StyledTableCell>

                    <StyledTableCell>
                      {guest.phoneNumber}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Switch
                        checked={guest.isVIP}
                        onChange={(e) => handleVipStatusChange(e, guest)  }
                        color="primary"
                      />
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <IconButton onClick={() => handleEditGuest(guest) }>
                        <EditIcon color="primary" />
                      </IconButton>
                      {/* <IconButton onClick={() => deleteGuest(guest) }>
                        <DeleteIcon color="error" />
                      </IconButton> */}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )
            }
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
    </div>
  )
}

export default GuestsTable;