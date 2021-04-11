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
import AmenityService from '../../services/AmenityService';

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
  name: 'Name *',
  shortCode: 'Short Code *',
  description: 'Description',
  isActive: 'Active'
}

const initialValues = {
  name: '',
  shortCode: '',
  description: '',
  isActive: false
};

function AddEditAmenity ({ setOpenPopUp, getAmenities, amenity, setNotify, setCurrentlyEditedAmenity, getDashboardMetrics }) {
  const classes = useStyles();
  const [ savingAmenity, setSavingAmenity ] = useState(false);
  const [errorsDuringSave, setErrorsDuringSave ] = useState([]);
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialValues, true, validateAmenityDetailsEntered);

  useEffect(() => {
    if (amenity !== null) {
      setValues({
        ...initialValues,
        ...amenity
      });
    }
  }, []);

  function validateAmenityDetailsEntered (fieldValues = values) {
    let tempErr = {...errors};
    if ('name' in fieldValues) {
      tempErr.name = _validateField('name', true);
    }
    if ('shortCode' in fieldValues) {
      tempErr.shortCode = _validateField('shortCode', true);
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

      if (fieldName === 'shortCode') {
        if (fieldValues[fieldName].length < 2) {
          return `${ fieldNameLabel } should have minimum 2 chars`;
        }
        if (fieldValues[fieldName].length > 4) {
          return `${ fieldNameLabel } should have maximum 4 chars`;
        }
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAmenityDetailsEntered()) {
      let amenityDetails = _constructAmenityObject();
      if (values._id) {
        setSavingAmenity(true);
        AmenityService.updateAmenity(values._id, amenityDetails)
          .then(() => {
            retrieveAmenities('Updated');
            setCurrentlyEditedAmenity(null);
          }).catch((error) => {
            constructErrorData(error);
          }).finally(() => {
            setSavingAmenity(false);
          });
      } else {
        setSavingAmenity(true);
        AmenityService.addAmenity(amenityDetails)
          .then(() => {
            retrieveAmenities('Created');
          }).catch((error) => {
            constructErrorData(error);
          }).finally(() => {
            setSavingAmenity(false);
          });
      }
    }
  };

  function retrieveAmenities (type) {
    setOpenPopUp(false);
    getAmenities();
    getDashboardMetrics();
    setNotify({
      isOpen: true,
      type: 'success',
      message: `Amenity ${type} Successfully`
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

  function _constructAmenityObject () {
    return {
      name: values['name'],
      shortCode: values['shortCode'],
      isActive: values['isActive'],
      ...(values['description'] && {
        description: values['description']
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
      {/* Amenity Basic Details START */}
      <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.labelText}>
            Amenity Details:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            name="name"
            label={labelMap.name}
            value={values.name}
            onChange = { handleInputChange }
            error={errors.name}
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            name="shortCode"
            label={labelMap.shortCode}
            value={values.shortCode}
            onChange = { handleInputChange }
            error={errors.shortCode}
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            name="description"
            label={labelMap.description}
            value={values.description}
            onChange={handleInputChange}
            multiline
            rows={2}
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
        {/* Amenity Basic Details END */}
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
            disabled={savingAmenity}
          >
            Save
          </Button>
          {savingAmenity && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </Grid>
    </Form>
  )
}

export default AddEditAmenity;