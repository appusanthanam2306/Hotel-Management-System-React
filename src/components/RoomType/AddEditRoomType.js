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
import RoomTypeService from '../../services/RoomTypeService';

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
  title: 'Title *',
  slug: 'Slug Name',
  shortCode: 'Short Code *',
  description: 'Description',
  baseOccupancy: 'Base Occupancy *',
  higherOccupancy: 'Higher Occupancy *',
  kidsOccupancy: 'Kids Occupancy *',
  allowExtraBeds: 'Allow Extra Beds',
  noOfExtraBeds: 'Extra Beds Count *',
  basePrice: 'Base Price *',
  extraPersonPrice: 'Additional Person Price  *',
  extraBedPrice: 'Extra Bed Price *',
  amenities: 'Amenities'
}

const initialValues = {
  title: '',
  slug: '',
  shortCode: '',
  description: '',
  amenities: [],
  baseOccupancy: '',
  higherOccupancy: '',
  kidsOccupancy: '',
  basePrice: '',
  extraPersonPrice: '',
  allowExtraBeds: false,
  noOfExtraBeds: '',
  extraBedPrice: ''
};

function AddEditRoomType ({ setOpenPopUp, getRoomTypes, roomType, setNotify, setCurrentlyEditedRoomType, getDashboardMetrics }) {

  const classes = useStyles();
  const [ allAmenities, setAllAmenities ] = useState([]);
  const [ savingRoomType, setSavingRoomType ] = useState(false);
  const [errorsDuringSave, setErrorsDuringSave ] = useState([]);
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialValues, true, validateRoomTypeDetailsEntered);

  useEffect(() => {
    AmenityService.getAmenities()
      .then(({ data }) => {
        setAllAmenities(data)
      });
  }, []);

  useEffect(() => {
    if (roomType !== null) {
      setValues({
        ...initialValues,
        ...roomType
      });
    }
  }, []);

  function validateRoomTypeDetailsEntered (fieldValues = values) {
    let tempErr = {...errors};
    if ('title' in fieldValues) {
      tempErr.title = _validateField('title', true);
    }
    if ('shortCode' in fieldValues) {
      tempErr.shortCode = _validateField('shortCode', true);
    }
    if ('baseOccupancy' in fieldValues) {
      tempErr.baseOccupancy = _validateField('baseOccupancy', true);
    }
    if ('higherOccupancy' in fieldValues) {
      tempErr.higherOccupancy = _validateField('higherOccupancy', true);
    }
    if ('kidsOccupancy' in fieldValues) {
      tempErr.kidsOccupancy = _validateField('kidsOccupancy', true);
    }
    if ('basePrice' in fieldValues) {
      tempErr.basePrice = _validateField('basePrice', true);
    }
    if ('extraPersonPrice' in fieldValues) {
      tempErr.extraPersonPrice = _validateField('extraPersonPrice', true);
    }
    if (values.allowExtraBeds) {
      tempErr.noOfExtraBeds = _validateField('noOfExtraBeds', false);
      tempErr.extraBedPrice = _validateField('extraBedPrice', false);
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
  
      if (fieldName === 'baseOccupancy' || fieldName === 'higherOccupancy' || fieldName === 'kidsOccupancy') {
        if (fieldValues[fieldName] < 1) {
          return `${ fieldNameLabel } should have atleast 1 occupancy`;
        }
        if (fieldValues[fieldName] > 20) {
          return `${ fieldNameLabel } should not be greater than 20`;
        }
      }
  
      if (fieldName === 'basePrice' || fieldName === 'extraPersonPrice') {
        if (fieldValues[fieldName] < 1) {
          return `${ fieldNameLabel } should be greater than 0`;
        }
      }
  
      if (fieldName === 'noOfExtraBeds' && fieldValues.allowExtraBeds) {
        if (!fieldValues[fieldName]) {
          return `${ fieldNameLabel } is required`;
        }
        if (fieldValues[fieldName] < 1) {
          return `${ fieldNameLabel } should be greater than 0`;
        }
      }
  
      if (fieldName === 'extraBedPrice' && fieldValues.allowExtraBeds) {
        if (!fieldValues[fieldName]) {
          return `${ fieldNameLabel } is required`;
        }
        if (fieldValues[fieldName] < 1) {
          return `${ fieldNameLabel } should be greater than 0`;
        }
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateRoomTypeDetailsEntered()) {
      let roomTypeDetails = _constructRoomTypeObject();
      if (values._id) {
        setSavingRoomType(true);
        RoomTypeService.updateRoomType(values._id, roomTypeDetails)
          .then(() => {
            retrieveRoomTypes('Updated');
            setCurrentlyEditedRoomType(null);
          }).catch((error) => {
            constructErrorData(error);
          }).finally(() => {
            setSavingRoomType(false);
          });
      } else {
        setSavingRoomType(true);
        RoomTypeService.addRoomType(roomTypeDetails)
          .then(() => {
            retrieveRoomTypes('Created');
          }).catch((error) => {
            constructErrorData(error);
          }).finally(() => {
            setSavingRoomType(false);
          });
      }
    }
  };

  function retrieveRoomTypes (type) {
    setOpenPopUp(false);
    getRoomTypes();
    getDashboardMetrics();
    setNotify({
      isOpen: true,
      type: 'success',
      message: `Room Type ${type} Successfully`
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

  function _constructRoomTypeObject () {
    return {
      title: values['title'],
      slug: values['slug'],
      shortCode: values['shortCode'],
      baseOccupancy: parseInt(values['baseOccupancy']),
      higherOccupancy: parseInt(values['higherOccupancy']),
      kidsOccupancy: parseInt(values['kidsOccupancy']),
      basePrice: parseInt(values['basePrice']),
      extraPersonPrice: parseInt(values['extraPersonPrice']),
      allowExtraBeds: values['allowExtraBeds'],
      ...(values['allowExtraBeds'] && {
        noOfExtraBeds: parseInt(values['noOfExtraBeds']),
        extraPersonPrice: parseInt(values['extraBedPrice'])
      }),
      amenities: values['amenities'],
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
        {/* Room Type Basic Details START */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.labelText}>
            Room Type Details:
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Controls.Input
            name="title"
            label={labelMap.title}
            value={values.title}
            onChange = { handleInputChange }
            error={errors.title}
            autoFocus
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Controls.Input
            name="slug"
            label={labelMap.slug}
            value={values.slug}
            onChange = { handleInputChange }
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Controls.Input
            name="shortCode"
            label={labelMap.shortCode}
            value={values.shortCode}
            onChange = { handleInputChange }
            error={errors.shortCode}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Controls.Select
            name="amenities"
            label={labelMap.amenities}
            value={values.amenities}
            onChange={handleInputChange}
            options={allAmenities}
            multiple={true}
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            name="description"
            label="Description"
            value={values.description}
            onChange={handleInputChange}
            multiline
            rows={2}
          />
        </Grid>
        {/* Room Type Basic Details END */}

        {/* Occupancy Details START */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.labelText}>
            Occupancy Details:
          </Typography>
        </Grid>
        
        <Grid item md={4} xs={12}>
          <Controls.Input
            name="baseOccupancy"
            label={labelMap.baseOccupancy}
            value={values.baseOccupancy}
            onChange = { handleInputChange }
            error={errors.baseOccupancy}
            type="number"
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Controls.Input
            name="higherOccupancy"
            label={labelMap.higherOccupancy}
            value={values.higherOccupancy}
            onChange = { handleInputChange }
            error={errors.higherOccupancy}
            type="number"
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Controls.Input
            name="kidsOccupancy"
            label={labelMap.kidsOccupancy}
            value={values.kidsOccupancy}
            onChange = { handleInputChange }
            error={errors.kidsOccupancy}
            type="number"
          />
        </Grid>
        {/* Occupancy Details END */}

        {/* Rate Details START */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.labelText}>
            Rate Details:
          </Typography>
        </Grid>
        
        <Grid item md={6} xs={12}>
          <Controls.Input
            name="basePrice"
            label={labelMap.basePrice}
            value={values.basePrice}
            onChange = { handleInputChange }
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            error={errors.basePrice}
            type="number"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Controls.Input
            name="extraPersonPrice"
            label={labelMap.extraPersonPrice}
            value={values.extraPersonPrice}
            onChange = { handleInputChange }
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            error={errors.extraPersonPrice}
            type="number"
          />
        </Grid>
        {/* Rate Details END */}

        {/* Extra bed Details START */}
        <Grid item xs={12} className={classes.paddingBottom0}>
          <Typography variant="subtitle2" className={classes.labelText}>
            Extra Bed Details:
          </Typography>
        </Grid>
        
        <Grid item md={4} xs={12}>
          <Controls.CheckBox
            name="allowExtraBeds"
            label={labelMap.allowExtraBeds}
            value={values.allowExtraBeds}
            onChange={handleInputChange}
          />
        </Grid>
        {
          values.allowExtraBeds &&
          <>
            <Grid item md={4} xs={12}>
              <Controls.Input
                name="noOfExtraBeds"
                label={labelMap.noOfExtraBeds}
                value={values.noOfExtraBeds}
                onChange = { handleInputChange }
                error={errors.noOfExtraBeds}
                type="number"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Controls.Input
                name="extraBedPrice"
                label={labelMap.extraBedPrice}
                value={values.extraBedPrice}
                onChange = { handleInputChange }
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                error={errors.extraBedPrice}
                type="number"
              />
            </Grid>
          </>
        }
        {/* Extra bed Details END */}
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
            disabled={savingRoomType}
          >
            Save
          </Button>
          {savingRoomType && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </Grid>
    </Form>
  )
}

export default AddEditRoomType;
