import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography, Tooltip } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';
import InfoIcon from '@material-ui/icons/Info';

import { useForm, Form } from '../UI/useForm';
import Controls from '../UI/Controls';
import Notifications from '../UI/Notifications';
import BookingService from '../../services/BookingService';

const useStyles = makeStyles((theme) => ({
  alertMessage: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  },
  checkAvailabilityBtn: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  }
}));

const labelMap = {
  arrivalDate: 'Arrival Date *',
  departureDate: 'Departure Date *',
  adults: 'Adults Count *',
  kids: 'Kids Count *',
  roomTypeId: 'Room Type *',
  guestId: 'Guest *'
}

const today = new Date();
const nextDate = new Date();
const nextYearDate = new Date().setDate(today.getDate() + 365);

const initialValues = {
  arrivalDate: today,
  departureDate: nextDate.setDate(nextDate.getDate() + 1),
  adults: '',
  kids: '',
  roomTypeId: '',
  guestId: ''
};

function BookingDetails ({ roomTypes, guests, setDisableNext, setAvailableRooms, setBookingDetails }) {
  const classes = useStyles();
  const [errorsDuringSave, setErrorsDuringSave ] = useState([]);
  const [loadingAvailableRooms, setLoadingAvailableRooms ] = useState(false);
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange
  } = useForm(initialValues, true, validateBookingDetailsEntered);
  const [ notify, setNotify ] = useState({
    isOpen: false,
    message: '',
    type: ''
  });

  function validateBookingDetailsEntered (fieldValues = values) {
    let tempErr = {...errors};
    if ('arrivalDate' in fieldValues) {
      tempErr.arrivalDate = _validateField('arrivalDate', true);
    }
    if ('departureDate' in fieldValues) {
      tempErr.departureDate = _validateField('departureDate', true);
    }
    if ('adults' in fieldValues) {
      tempErr.adults = _validateField('adults', true);
    }
    if ('kids' in fieldValues) {
      tempErr.kids = _validateField('kids', true);
    }
    if ('roomTypeId' in fieldValues) {
      tempErr.roomTypeId = _validateField('roomTypeId', true);
    }
    if ('guestId' in fieldValues) {
      tempErr.guestId = _validateField('guestId', true);
    }

    setErrors({...tempErr});

    if (fieldValues == values) {
      return Object.values(tempErr).every((field) => !field);
    }

    function _validateField (fieldName, isRequired) {
      let fieldNameLabel = labelMap[fieldName]
      if (fieldNameLabel.includes('*')) {
        fieldNameLabel = fieldNameLabel.slice(0, -2);
      }
      if (!fieldValues[fieldName] && isRequired) {
        return `${ fieldNameLabel } is required`;
      }
    }
  }

  function handleCheckAvailableRooms () {
    if (validateBookingDetailsEntered()) {
      let payload = {
        arrivalDate: moment(values.arrivalDate).format('YYYY-MM-DD'),
        departureDate: moment(values.departureDate).format('YYYY-MM-DD'),
        adults: parseInt(values.adults),
        kids: parseInt(values.kids),
        roomTypeId: values.roomTypeId
      };

      setLoadingAvailableRooms(true);
      setErrorsDuringSave([]);
      setDisableNext(true);

      BookingService.getAvailableRooms(payload)
        .then(({ data }) => {
          if (!data.length) {
            let errorObj = {
              message: 'No rooms are available for Booking in this room type'
            }
            throw errorObj;
          } else {
            setDisableNext(false);
            setAvailableRooms(data);
            setBookingDetails({ ...values, ...payload});
            setNotify({
              isOpen: true,
              message: 'Rooms available for booking.  Click Next to choose a Room.',
              type: 'success'
            })
          }
        }).catch((err) => {
          constructErrorData(err);
        }).finally(() => {
          setLoadingAvailableRooms(false);
        });
    }
  }

  function constructErrorData (error) {
    let errors = []
    if (error?.response?.data?.errors) {
      errors = [
        {
          ...error.response.data.errors.title
        }
      ]
      setErrorsDuringSave(errors);
    } else if (error.message) {
      errors.push({
        message: error.message
      });
      setErrorsDuringSave(errors);
    }
  }

  function handleClose (index) {
    let errors = [...errorsDuringSave];
    errors.splice(index, 1);
    setErrorsDuringSave(errors);
  }

  function handleValueChange (e) {
    setDisableNext(true);
    handleInputChange(e);
  }

  return (
    <Form>
      <Grid container spacing={1}>
      {
        errorsDuringSave.map((error, index) => (
          <Alert
            key={error.message}
            severity='error'
            className={classes.alertMessage}
            onClose={() => handleClose(index)}
          >{error.message}
          </Alert>
        ))
      }
      {/* Floor Basic Details START */}
        <Grid item xs={6}>
          <Controls.DatePicker
            name="arrivalDate"
            label={labelMap.arrivalDate}
            value={values.arrivalDate}
            onChange = { handleValueChange }
            error={errors.arrivalDate}
            minDate={today}
            maxDate={nextYearDate}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.DatePicker
            name="departureDate"
            label={labelMap.departureDate}
            value={values.departureDate}
            onChange = { handleValueChange }
            minDate={nextDate}
            maxDate={nextYearDate}
            error={errors.departureDate}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.Input
            name="adults"
            label={labelMap.adults}
            value={values.adults}
            onChange = { handleValueChange }
            error={errors.adults}
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.Input
            name="kids"
            label={labelMap.kids}
            value={values.kids}
            onChange = { handleValueChange }
            error={errors.kids}
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.Select
            name="roomTypeId"
            label={labelMap.roomTypeId}
            value={values.roomTypeId}
            onChange={handleValueChange}
            options={roomTypes}
            error={errors.roomTypeId}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.Select
            name="guestId"
            label={labelMap.guestId}
            value={values.guestId}
            onChange={handleValueChange}
            options={guests}
            error={errors.guestId}
          />
        </Grid>
        <Grid item xs={12} className={classes.checkAvailabilityBtn}>
          <Button
            onClick={handleCheckAvailableRooms}
            color="primary"
            variant="outlined"
            disabled={loadingAvailableRooms}
          >
            Check Room Availability
          </Button>
          <Tooltip title="Click on this button to check for available rooms with selected Room Type" aria-label="add">
            <InfoIcon />
          </Tooltip>
        </Grid>
      </Grid>

      <Notifications
        notify={notify}
        setNotify={setNotify}
      ></Notifications>
    </Form>
  )
}

export default BookingDetails;