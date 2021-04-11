import React from 'react';

import TextField from '@material-ui/core/TextField';

function Input({ name, value, label, onChange, error = null, ...other }) {
  return (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      fullWidth
      margin="dense"
      { ...(error && { error: true, helperText: error}) }
      { ...other }
    />
  )
}

export default Input;
