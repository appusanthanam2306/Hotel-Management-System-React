import React from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import DateFnUtils from '@date-io/date-fns';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  }
}));

function DatePicker({ name, label, value, onChange, ...others }) {
  const classes = useStyles();
  const formatTargetValue = (name, value) => ({
    target: {
      name,
      value
    }
  });

  return (
    <MuiPickersUtilsProvider
      utils={DateFnUtils}
    >
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        inputVariant="outlined"
        label={label}
        format="MMM dd, yyyy"
        name={name}
        value={value}
        onChange={(date) => onChange(formatTargetValue(name, date)) }
        { ...others }
        className={classes.root}
      />
    </MuiPickersUtilsProvider>
  )
}

export default DatePicker;
