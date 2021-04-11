import React from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: '300px'
  },
  table: {
    minWidth: 650,
    maxHeight: '300px'
  },
  totalRatesCard: {
    padding: theme.spacing(1.25),
    marginBottom: theme.spacing(1.5),
    backgroundColor: theme.palette.grey['300'],
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerRow: {
    backgroundColor: theme.palette.grey['300']
  },
  totalDue: {
    fontSize: '1rem',
    fontWeight: '700',
    color: theme.palette.grey['700']
  }
}));

const dateFormat = 'YYYY-MM-DD';


function DailyRates({ bookingDetails, roomTypes, setTotalDueAtCheckout, setExtraPersonPrice }) {
  const classes = useStyles();
  const dailyDates = fetchDates(bookingDetails.arrivalDate, bookingDetails.departureDate);
  const RoomTypeSelected = roomTypes.find((roomType) => roomType._id === bookingDetails.roomTypeId);
  let extraPersonPrice = 0;
  if (bookingDetails.adults > RoomTypeSelected.baseOccupancy) {
    extraPersonPrice = (bookingDetails.adults - RoomTypeSelected.baseOccupancy) * RoomTypeSelected.extraPersonPrice;
  }
  let totalDueAtCheckout = 0;

  const dailyRates = dailyDates.map((date) => {
    totalDueAtCheckout += RoomTypeSelected.basePrice + extraPersonPrice;
    return {
      date: date,
      basePrice: RoomTypeSelected.basePrice,
      extraPersonPrice: extraPersonPrice,
      totalPrice: RoomTypeSelected.basePrice + extraPersonPrice
    }
  });
  setTotalDueAtCheckout(totalDueAtCheckout);
  setExtraPersonPrice(extraPersonPrice);

  function fetchDates (startDate, endDate) {
    let dates = [];
    while(startDate !== endDate) {
      dates.push(startDate);
      startDate = moment(startDate).add(1, 'Days').format(dateFormat);
    }
    return dates;
  }

  return (
    <>
     <Paper className={classes.totalRatesCard}>
        <span>Estimated Due at Checkout:</span>
        <span className={classes.totalDue}>₹ {totalDueAtCheckout}</span>
      </Paper>
      <TableContainer component={Paper} className={classes.root}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.headerRow}>
              <TableCell>Date</TableCell>
              <TableCell align="right">Base Price (₹)</TableCell>
              <TableCell align="right">Extra Person Price (₹)</TableCell>
              <TableCell align="right">Total Price (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dailyRates.map((row) => (
              <TableRow key={row.date}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">{row.basePrice}</TableCell>
                <TableCell align="right">{row.extraPersonPrice}</TableCell>
                <TableCell align="right">{row.totalPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default DailyRates;
