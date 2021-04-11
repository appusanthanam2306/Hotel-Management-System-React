import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

import Grid from '@material-ui/core/Grid/Grid';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  fieldContainer: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey['100']
  },
  fieldLabel: {
    fontSize: theme.spacing(1.25),
    marginBottom: theme.spacing(0.25)
  },
  fieldValue: {
    fontSize: theme.spacing(2)
  },
  fieldHeader: {
    paddingBottom: theme.spacing(0.5)
  },
  fieldHeaderText: {
    textDecoration: 'underline',
    textAlign: 'center',
    fontStyle: 'italic'
  }
}));

function PreviewBooking ({ guests, availableRooms, bookingDetails, roomIdSelected, roomTypes, totalDueAtCheckout, extraPersonPrice }) {
  const classes = useStyles();
  const noOfNights = moment(bookingDetails.departureDate).diff(moment(bookingDetails.arrivalDate), 'days');
  const roomTypeDetails = roomTypes.find(roomType => roomType._id === bookingDetails.roomTypeId);
  const roomDetails = availableRooms.find(room => room._id === roomIdSelected);
  const guestDetails = guests.find(guest => guest._id === bookingDetails.guestId);
  
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.fieldHeader}>
          <Typography className={classes.fieldHeaderText}>Booking Details</Typography>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Arrival Date</div>
            <div className={classes.fieldValue}>{bookingDetails.arrivalDate}</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Departure Date</div>
            <div className={classes.fieldValue}>{bookingDetails.departureDate}</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Number of Nights</div>
            <div className={classes.fieldValue}>{noOfNights}</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Adults Count</div>
            <div className={classes.fieldValue}>{bookingDetails.adults}</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Kids Count</div>
            <div className={classes.fieldValue}>{bookingDetails.kids}</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
        <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Room Details</div>
            <div className={classes.fieldValue}>{ roomTypeDetails.shortCode } - { roomDetails.roomNumber }</div>
          </Paper>
        </Grid>
        <Grid item xs={12} className={classes.fieldHeader}>
          <Typography className={classes.fieldHeaderText}>Guest Details</Typography>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Guest Name</div>
            <div className={classes.fieldValue}>{guestDetails?.firstName} {guestDetails?.lastName}</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Email</div>
            <div className={classes.fieldValue}>{guestDetails?.emailId}</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Mobile Number</div>
            <div className={classes.fieldValue}>{guestDetails?.phoneNumber}</div>
          </Paper>
        </Grid>
        <Grid item xs={12} className={classes.fieldHeader}>
          <Typography className={classes.fieldHeaderText}>Rate Details</Typography>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Daily Room Rate</div>
            <div className={classes.fieldValue}>₹ {roomTypeDetails.basePrice}</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Extra Person Price</div>
            <div className={classes.fieldValue}>₹ {extraPersonPrice * noOfNights}</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Total Due</div>
            <div className={classes.fieldValue}>₹ {totalDueAtCheckout}</div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default PreviewBooking;