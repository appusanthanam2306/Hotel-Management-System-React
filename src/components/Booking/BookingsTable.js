import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';

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


function BookingsTable ({setOpenPopUp, bookings, getBookings, loadingBookings, setConfirmDialog, width, bookingsType}) {
  const classes = useStyles();
  const [ filterFn, setFilterFn ] = useState({ fn: (floors) => floors});
  
  const headCells = [
    { id: 'confirmationId', label: 'Conf #' },
    { id: 'guestName', label: 'Guest Name' },
    { id: 'roomTypeName', label: 'Room Type' },
    { id: 'roomNumber', label: 'Room Number' },
    { id: 'arrivalDate', label: 'Arrival Date' },
    { id: 'departureDate', label: 'Departure Date' },
    // { id: 'bookingStatus', label: 'Booking Status' },
    // { id: 'paymentStatus', label: 'Payment Status' },
    { id: 'actions', label: 'Actions', disableSort: true, align: 'center' }
  ];

  if (isWidthUp('lg', width)) {
    headCells.splice(6, 0, { id: 'bookingDate', label: 'Booking Date' })
  }

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPaginationAndSorting
  } = useTable(bookings, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (floors) => {
        if (target.value === '') {
          return floors;
        } else {
          return floors.filter((floor) => floor.name.toLowerCase().includes(target.value.toLowerCase()));
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
        {
          bookingsType === 'current'
          ? (
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<AddIcon />}
                onClick={ () => setOpenPopUp(true) }
              >Add</Button>
            ) : (
              <Button
                onClick={getBookings}
                variant="contained"
                startIcon={<DoneIcon />}
                color="secondary"
              >Apply Dates</Button>
            )
        }
      </div>
      <Paper>
        <TblContainer>
          <TblHead></TblHead>
          {
            !bookings.length && !loadingBookings &&(
              <TableBody>
                <TableRow>
                  <StyledTableCell colSpan="12" className={classes.emptyPlaceholderCell}>No Bookings Found.</StyledTableCell>
                </TableRow>
              </TableBody>
            )
          }
          <TableBody>
            {
              loadingBookings ?
              (
                [1, 2, 3, 4, 5].map((el) => (
                  <TableRow key={el}>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    {
                      isWidthUp('lg', width) && <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell>
                    }
                    {/* <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell> */}
                    {/* <StyledTableCell><Skeleton animation="wave" height={35} /></StyledTableCell> */}
                  </TableRow>
                ))
              ) :
              (
                recordsAfterPaginationAndSorting().map((booking) => (
                  <StyledTableRow key={ booking._id }>
                    <StyledTableCell>
                      {booking.confirmationId}
                    </StyledTableCell>

                    <StyledTableCell>
                      {booking.guestName}
                    </StyledTableCell>

                    <StyledTableCell>
                      {booking.roomTypeName}
                    </StyledTableCell>

                    <StyledTableCell>
                      {booking.roomNumber}
                    </StyledTableCell>

                    <StyledTableCell>
                      {booking.arrivalDate}
                    </StyledTableCell>

                    <StyledTableCell>
                      {booking.departureDate}
                    </StyledTableCell>

                    {
                      isWidthUp('lg', width) && (
                        <StyledTableCell>
                          {booking.bookingDate}
                        </StyledTableCell>
                      )
                    }

                    {/* <StyledTableCell>
                      {booking.bookingStatus}
                    </StyledTableCell>

                    <StyledTableCell>
                      {booking.paymentStatus}
                    </StyledTableCell> */}

                    <StyledTableCell align="center">
                      <IconButton>
                        <VisibilityIcon color="primary" />
                      </IconButton>
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

export default withWidth()(BookingsTable);