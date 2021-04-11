import React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function Select ({ name, label, value, error = null, onChange, options, ...others }) {
  return (
    <FormControl
      variant="outlined"
      fullWidth
      { ...(error && { error: true })}
    >
      <InputLabel>{ label }</InputLabel>
      <MuiSelect
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        IconComponent={ExpandMoreIcon}
        {...others}
      >
        {
          options.map((option) => (<MenuItem  key={option._id} value={option._id}>{option.name || option.title || `${option.firstName} ${option.lastName}`}</MenuItem>))
        }
      </MuiSelect>
      {
        error && (<FormHelperText>{error}</FormHelperText>)
      }
    </FormControl>
  )
}

export default Select;
