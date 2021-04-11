import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
import GuestService from '../../services/GuestService';

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
  }
}));

const labelMap = {
  firstName: 'First Name *',
  lastName: 'Last Name',
  emailId: 'Email *',
  phoneNumber: 'Phone Number *',
  isVIP: 'VIP Guest'
};

const initialValues = {
  firstName: '',
  lastName: '',
  emailId: '',
  phoneNumber: '',
  isVIP: false
};

function AddEditGuest ({ setOpenPopUp, getGuests, guest, setNotify, setCurrentlyEditedGuest }) {
  const classes = useStyles();
  const [ savingGuest, setSavingGuest ] = useState(false);
  const [errorsDuringSave, setErrorsDuringSave ] = useState([]);
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialValues, true, validateGuestDetailsEntered);

  useEffect(() => {
    if (guest !== null) {
      setValues({
        ...initialValues,
        ...guest
      });
    }
  }, []);

  function validateGuestDetailsEntered (fieldValues = values) {
    let tempErr = {...errors};
    if ('firstName' in fieldValues) {
      tempErr.firstName = _validateField('firstName', true);
    }
    if ('emailId' in fieldValues) {
      tempErr.emailId = _validateField('emailId', true);
    }
    if ('phoneNumber' in fieldValues) {
      tempErr.phoneNumber = _validateField('phoneNumber', true);
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
  
      if (fieldName === 'emailId') {
        if (!validateEmail(fieldValues[fieldName])) {
          return `Email is not valid`;
        }

        function validateEmail(email) {
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(email).toLowerCase());
        }
      }
      if (fieldName === 'phoneNumber') {
        if (fieldValues[fieldName].length < 10) {
          return `Minimum 10 numbers required`;
        }
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateGuestDetailsEntered()) {
      let guestDetails = _constructGuestObject();
      if (values._id) {
        setSavingGuest(true);
        GuestService.updateGuest(values._id, guestDetails)
          .then(() => {
            retrieveGuests('Updated');
            setCurrentlyEditedGuest(null);
          }).catch((error) => {
            constructErrorData(error);
          }).finally(() => {
            setSavingGuest(false);
          });
      } else {
        setSavingGuest(true);
        GuestService.addGuest(guestDetails)
          .then(() => {
            retrieveGuests('Created');
          }).catch((error) => {
            constructErrorData(error);
          }).finally(() => {
            setSavingGuest(false);
          });
      }
    }
  };

  function retrieveGuests (type) {
    setOpenPopUp(false);
    getGuests();
    setNotify({
      isOpen: true,
      type: 'success',
      message: `Guest ${type} Successfully`
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

  function _constructGuestObject () {
    return {
      firstName: values['firstName'],
      emailId: values['emailId'],
      phoneNumber: values['phoneNumber'],
      isVIP: values['isVIP'],
      ...(values['lastName'] && {
        lastName: values['lastName']
      }),
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
      {/* Guest Basic Details START */}
      <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.labelText}>
            Guest Details:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            name="firstName"
            label={labelMap.firstName}
            value={values.firstName}
            onChange = { handleInputChange }
            error={errors.firstName}
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            name="lastName"
            label={labelMap.lastName}
            value={values.lastName}
            onChange = { handleInputChange }
            error={errors.lastName}
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            name="emailId"
            label={labelMap.emailId}
            value={values.emailId}
            onChange = { handleInputChange }
            error={errors.emailId}
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            name="phoneNumber"
            label={labelMap.phoneNumber}
            value={values.phoneNumber}
            onChange = { handleInputChange }
            error={errors.phoneNumber}
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.CheckBox
            name="isVIP"
            label={labelMap.isVIP}
            value={values.isVIP}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Guest Basic Details END */}
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
            disabled={savingGuest}
          >
            Save
          </Button>
          {savingGuest && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </Grid>
    </Form>
  )
}

export default AddEditGuest;