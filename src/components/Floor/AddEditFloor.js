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
import FloorService from '../../services/FloorService';

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
  floorNumber: 'Floor Number',
  description: 'Description',
  isActive: 'Active'
}

const initialValues = {
  name: '',
  floorNumber: '',
  description: '',
  isActive: false
};

function AddEditFloor ({ setOpenPopUp, getFloors, floor, setNotify, setCurrentlyEditedFloor, getDashboardMetrics }) {
  const classes = useStyles();
  const [ savingFloor, setSavingFloor ] = useState(false);
  const [errorsDuringSave, setErrorsDuringSave ] = useState([]);
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialValues, true, validateFloorDetailsEntered);

  useEffect(() => {
    if (floor !== null) {
      setValues({
        ...initialValues,
        ...floor
      });
    }
  }, []);

  function validateFloorDetailsEntered (fieldValues = values) {
    let tempErr = {...errors};
    if ('name' in fieldValues) {
      tempErr.name = _validateField('name', true);
    }
    if ('floorNumber' in fieldValues) {
      tempErr.floorNumber = _validateField('floorNumber', true);
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
  
      if (fieldName === 'floorNumber') {
        if (fieldValues[fieldName] < 1) {
          return `${ fieldNameLabel } should be greater than 0`;
        }
        if (fieldValues[fieldName] > 100) {
          return `${ fieldNameLabel } should not be greater than 100`;
        }
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFloorDetailsEntered()) {
      let floorDetails = _constructFloorObject();
      if (values._id) {
        setSavingFloor(true);
        FloorService.updateFloor(values._id, floorDetails)
          .then(() => {
            retrieveFloors('Updated');
            setCurrentlyEditedFloor(null);
          }).catch((error) => {
            constructErrorData(error);
          }).finally(() => {
            setSavingFloor(false);
          });
      } else {
        setSavingFloor(true);
        FloorService.addFloor(floorDetails)
          .then(() => {
            retrieveFloors('Created');
          }).catch((error) => {
            constructErrorData(error);
          }).finally(() => {
            setSavingFloor(false);
          });
      }
    }
  };

  function retrieveFloors (type) {
    setOpenPopUp(false);
    getFloors();
    getDashboardMetrics();
    setNotify({
      isOpen: true,
      type: 'success',
      message: `Floor ${type} Successfully`
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

  function _constructFloorObject () {
    return {
      name: values['name'],
      floorNumber: parseInt(values['floorNumber']),
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
      {/* Floor Basic Details START */}
      <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.labelText}>
            Floor Details:
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
            name="floorNumber"
            label={labelMap.floorNumber}
            value={values.floorNumber}
            onChange = { handleInputChange }
            error={errors.floorNumber}
            type="number"
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
        {/* Floor Basic Details END */}
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
            disabled={savingFloor}
          >
            Save
          </Button>
          {savingFloor && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </Grid>
    </Form>
  )
}

export default AddEditFloor;