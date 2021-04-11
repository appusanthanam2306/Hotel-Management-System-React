import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Select, Typography, FormControl, FormHelperText, MenuItem, InputLabel } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import { useForm, Form } from '../UI/useForm';
import Controls from '../UI/Controls';
import BookingService from '../../services/BookingService';
import RoomTypeService from '../../services/RoomTypeService';
import BookingDetails from './BookingDetails';
import DailyRates from './DailyRates';
import PreviewBooking from './PreviewBooking';
import GuestService from '../../services/GuestService';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '700px',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column'
  },
  fieldContainer: {
    display: 'flex',
    gap: theme.spacing(2)
  },
  extraBedsContainer: {
    marginTop: theme.spacing(1)
  },
  dialogActionsContainer: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`
  },
  labelText: {
    marginTop: theme.spacing(1),
    paddingBottom: 0
  },
  paddingBottom0: {
    paddingBottom: `0 !important`
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(2)
  },
  buttonWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  backButton: {
    backgroundColor: theme.palette.grey['400'],
    '&:hover': {
      backgroundColor: theme.palette.grey['300'],
    }
  },
  formControl: {
    width: '100%'
  }
}));

function AddNewBooking ({ setOpenPopUp, getBookings,setNotify }) {
  const classes = useStyles();
  const [ roomTypes, setRoomTypes ] = useState([]);
  const [ guests, setGuests ] = useState([]);
  const [ disableNext, setDisableNext ] = useState(true);
  const [ availableRooms, setAvailableRooms ] = useState([]);
  const [ bookingDetails, setBookingDetails ] = useState({});
  const [ roomIdSelected, setRoomIdSelected ] = useState('');
  const [ totalDueAtCheckout, setTotalDueAtCheckout ] = useState(0);
  const [ extraPersonPrice, setExtraPersonPrice ] = useState(0);
  const [ savingBooking, setSavingBooking ] = useState(false);

  function getSteps() {
    return ['Booking Details', 'Select Room', 'Confirm Rates', 'Preview Booking'];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <BookingDetails 
            roomTypes={roomTypes}
            guests={guests}
            setDisableNext={setDisableNext}
            setAvailableRooms={setAvailableRooms}
            setBookingDetails={setBookingDetails}
            bookingDetails={bookingDetails}
          />
        );
      case 1:
        return (
          <Grid item xs={12}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Select Room for Booking</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={roomIdSelected}
                onChange={handleRoomChange}
                label="Select Room for Booking"
              >
                {
                  availableRooms.map((room) => (
                    <MenuItem
                      key={room._id}
                      value={room._id}
                    >{room.roomNumber}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
        </Grid>
        );
      case 2:
        return (
          <DailyRates 
            bookingDetails={bookingDetails}
            roomTypes={roomTypes}
            setTotalDueAtCheckout={setTotalDueAtCheckout}
            setExtraPersonPrice={setExtraPersonPrice}
          />
        );
      case 3:
        return (
          <PreviewBooking 
            guests={guests}
            availableRooms={availableRooms}
            bookingDetails={bookingDetails}
            roomIdSelected={roomIdSelected}
            roomTypes={roomTypes}
            totalDueAtCheckout={totalDueAtCheckout}
            extraPersonPrice={extraPersonPrice}
          />
        );
      default:
        return 'Unknown step';
    }
  }

  const handleRoomChange = (event) => {
    setRoomIdSelected(event.target.value);
    setDisableNext(false);
  };

  const getRoomTypesAndGuests = () => {
    // setLoadingRooms(true);
    RoomTypeService.getRoomTypes()
      .then(({ data }) => {
        setRoomTypes(data);
        return GuestService.getGuests()
      }).then(({ data }) => {
        setGuests(data);
      }).finally(() => {
        // setLoadingRooms(false);
      });
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    if (activeStep === 0) {
      setDisableNext(true);
    }
    if (activeStep === steps.length - 1) {
      const payload = {
        ...bookingDetails,
        roomId: roomIdSelected
      }
      setSavingBooking(true);
      BookingService.addBooking(payload)
        .then((newBooking) => {
          getBookings();
          setNotify({
            isOpen: true,
            message: 'Booking Created successfully.',
            type: 'success'
          });
          setOpenPopUp(false);
          console.log(newBooking);
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          setSavingBooking(false);
        })
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setRoomIdSelected('');
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    getRoomTypesAndGuests();
  }, []);

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div style={{display: 'flex', 'flexGrow': 1}}>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div style={{display: 'flex', 'flexDirection': 'column', width: '100%'}}>
            <div className={classes.instructions} style={{'flexGrow': 1}} >
              {getStepContent(activeStep)}
            </div>
            <div className={classes.actionButtons}>
              <Button 
                disabled={activeStep === 0} 
                onClick={handleBack} 
                className={classes.button, classes.backButton}
              >
                Back
              </Button>

              <div className={classes.buttonWrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                  disabled={disableNext || savingBooking}
                >
                  {activeStep === steps.length - 1 ? 'Book Room' : 'Next'}
                </Button>
                {savingBooking && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>

              
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddNewBooking;