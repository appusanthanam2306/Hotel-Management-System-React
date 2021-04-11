import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';

import PageTitle from '../components/PageTitle';
import Notifications from '../components/UI/Notifications';

import AddNewBooking from '../components/Booking/AddNewBooking';
import BookingsTable from '../components/Booking/BookingsTable';
import PopUp from '../components/UI/PopUp';
import BookingService from '../services/BookingService';
import GuestService from '../services/GuestService';
import RoomTypeService from '../services/RoomTypeService';
import RoomService from '../services/RoomService';
import Controls from '../components/UI/Controls';
import { useForm } from '../components/UI/useForm';

const useStyles = makeStyles((theme) => ({
  dateSearch: {
    margin: '0.75rem 0'
  }
}));


function Bookings ({ bookingsType }) {
  const classes = useStyles();
  const [ bookings, setBookings ] = useState([]);
  const [ loadingBookings, setLoadingBookings ] = useState(false);
  const [ openPopUp, setOpenPopUp ] = useState(false);
  const [ notify, setNotify ] = useState({
    isOpen: false,
    message: '',
    type: ''
  });
  const [ confirmDialog, setConfirmDialog ] = useState({
    isOpen: false,
    title: '',
    subtitle: ''
  });
  let today = new Date();
  let minDate;
  let maxDate;
  
  const initialDateValues = {
    startDate: bookingsType === 'past' ? moment().subtract(11, 'days').format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD'),
    endDate: bookingsType === 'past' ? moment().subtract(1, 'days').format('YYYY-MM-DD') : moment().add(11, 'days').format('YYYY-MM-DD')
  };

  const pageTitleMap = {
    current: 'Active Bookings',
    past: 'Past Bookings',
    future: 'Future Bookings'
  }

  const {
    values,
    setValues,
    handleInputChange
  } = useForm(initialDateValues, false);
  
  useEffect(() => {
    if (bookingsType === 'past') {
      minDate = new Date().setDate(today.getDate() - 365);
      maxDate = new Date().setDate(today.getDate() - 1);
    } else if (bookingsType === 'future') {
      minDate = new Date().setDate(today.getDate() + 1);
      maxDate = new Date().setDate(today.getDate() + 365);
    }
  }, []);

  const getBookings = () => {
    setLoadingBookings(true);

    let requiredData = [
      GuestService.getGuests(),
      RoomTypeService.getRoomTypes(),
      RoomService.getRooms()
    ];

    if (bookingsType === 'current') {
      requiredData.push(BookingService.getBookings())
    } else if (bookingsType === 'past') {
      requiredData.push(BookingService.getPastBookings({ startDate: moment(values.startDate).format('YYYY-MM-DD'), endDate: moment(values.endDate).format('YYYY-MM-DD') }))
    } else if (bookingsType === 'future') {
      requiredData.push(BookingService.getFutureBookings({ startDate: moment(values.startDate).format('YYYY-MM-DD'), endDate: moment(values.endDate).format('YYYY-MM-DD') }))
    }

    axios.all(requiredData)
      .then(([{ data: guests }, { data: allRoomTypes }, { data: allRooms }, { data: bookings }]) => {
        bookings.forEach((booking) => {
          //populate guest name details
          let guestDetails = guests.find((guest) => guest._id === booking.guestId);
          if (guestDetails) {
            booking.guestName = `${guestDetails.firstName} ${guestDetails.lastName}`;
          }

          //populate Room Type Details
          let roomTypeDetails = allRoomTypes.find((roomType) => roomType._id === booking.roomTypeId);
          if (roomTypeDetails) {
            booking.roomTypeName = `${roomTypeDetails.title} - ${roomTypeDetails.shortCode}`;
          }

          //populate Room Details
          let roomDetails = allRooms.find((room) => room._id === booking.roomId);
          if (roomDetails) {
            booking.roomNumber = `${roomDetails.roomNumber}`;
          }
        });

        setBookings(bookings);
      }).finally(() => {
        setLoadingBookings(false);
      });
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div>
      <PageTitle title={pageTitleMap[bookingsType]} />
        {
          bookingsType !== 'current' && (
            <Grid container spacing={2} className={classes.dateSearch}>
              <Grid item xs={6}>
                <Controls.DatePicker
                  name="startDate"
                  label="Start Date"
                  value={values.startDate}
                  onChange = { handleInputChange }
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </Grid>
              <Grid item xs={6}>
                <Controls.DatePicker
                  name="endDate"
                  label="End Date"
                  value={values.endDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  onChange = { handleInputChange }
                />
              </Grid>
            </Grid>
          )
        }
      <PopUp
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        title="New Booking"
        dialogWidth="md"
      >
        <AddNewBooking 
          setOpenPopUp={setOpenPopUp}
          getBookings={getBookings}
          setNotify={setNotify}
        />
      </PopUp>

      <BookingsTable 
        bookings={bookings}
        loadingBookings={loadingBookings}
        setOpenPopUp={setOpenPopUp}
        setConfirmDialog={setConfirmDialog}
        bookingsType={bookingsType}
        getBookings={getBookings}
      />

      <Notifications
        notify={notify}
        setNotify={setNotify}
      ></Notifications>
    </div>
  )
}

export default Bookings;
