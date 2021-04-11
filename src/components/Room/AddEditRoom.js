import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';

import { useForm, Form } from '../UI/useForm';
import Controls from '../UI/Controls';
import RoomService from '../../services/RoomService';

const useStyles = makeStyles((theme) => ({
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
  marginTopSpacing: {
    marginTop: theme.spacing(1)
  }
}));

const labelMap = {
  roomNumber: 'Room Number *',
  floorId: 'Floor *',
  roomTypeId: 'Room Type *',
  isActive: 'Active'
}

const initialValues = {
  roomNumber: '',
  floorId: '',
  roomTypeId: '',
  isActive: false
};

function AddEditRoom ({ setOpenPopUp, getRooms, room, setNotify, setCurrentlyEditedRoom, roomTypes, floors, getDashboardMetrics }) {
  const classes = useStyles();
  const [ savingRoom, setSavingRoom ] = useState(false);
  const [errorsDuringSave, setErrorsDuringSave ] = useState([]);
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialValues, true, validateRoomDetailsEntered);

  useEffect(() => {
    if (room !== null) {
      setValues({
        ...initialValues,
        ...room
      });
    }
  }, []);

  function validateRoomDetailsEntered (fieldValues = values) {
    let tempErr = {...errors};
    if ('roomNumber' in fieldValues) {
      tempErr.roomNumber = _validateField('roomNumber', true);
    }
    if ('floorId' in fieldValues) {
      tempErr.floorId = _validateField('floorId', true);
    }
    if ('roomTypeId' in fieldValues) {
      tempErr.roomTypeId = _validateField('roomTypeId', true);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateRoomDetailsEntered()) {
      let roomDetails = _constructRoomObject();
      if (values._id) {
        setSavingRoom(true);
        RoomService.updateRoom(values._id, roomDetails)
          .then(() => {
            retrieveRooms('Updated');
            setCurrentlyEditedRoom(null);
          }).catch((error) => {
            constructErrorData(error);
          }).finally(() => {
            setSavingRoom(false);
          });
      } else {
        setSavingRoom(true);
        RoomService.addRoom(roomDetails)
          .then(() => {
            retrieveRooms('Created');
          }).catch((error) => {
            constructErrorData(error);
          }).finally(() => {
            setSavingRoom(false);
          });
      }
    }
  };

  function retrieveRooms (type) {
    setOpenPopUp(false);
    getRooms();
    getDashboardMetrics();
    setNotify({
      isOpen: true,
      type: 'success',
      message: `Room ${type} Successfully`
    });
  }

  function constructErrorData (error) {
    if (error.response.data.errors) {
      let errors = [
        {
          ...error.response.data.errors.title
        }
      ]
      setErrorsDuringSave(errors);
    }
  }

  function _constructRoomObject () {
    return {
      roomNumber: values['roomNumber'],
      floorId: values['floorId'],
      roomTypeId: values['roomTypeId'],
      isActive: values['isActive'],
      ...(values['_id'] && {
        '_id': values['_id']
      })
    };
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        {
          errorsDuringSave.map((error) => (
            <Alert
              key={error.message}
              severity='error'
            >{error.message}
            </Alert>
          ))
        }
        {/* Room Basic Details START */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.labelText}>
            Room Details:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            name="roomNumber"
            label={labelMap.roomNumber}
            value={values.roomNumber}
            onChange = { handleInputChange }
            error={errors.roomNumber}
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.Select
            name="floorId"
            label={labelMap.floorId}
            value={values.floorId}
            onChange={handleInputChange}
            options={floors}
          />
        </Grid>
        <Grid item xs={12} className={classes.marginTopSpacing}>
          <Controls.Select
            name="roomTypeId"
            label={labelMap.roomTypeId}
            value={values.roomTypeId}
            onChange={handleInputChange}
            options={roomTypes}
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.CheckBox
            name="isActive"
            label={labelMap.isActive}
            value={values.isActive}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Room Basic Details END */}
      </Grid>

      <Grid item xs={12} className={classes.actionContainer}>
        <Button 
          onClick={resetForm}
          color="primary"
          variant="outlined"
          startIcon={<RefreshIcon />}
          >Reset
        </Button>
        <div className={classes.buttonWrapper}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={savingRoom}
          >
            Save
          </Button>
          {savingRoom && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </Grid>
    </Form>
  )
}

export default AddEditRoom;

