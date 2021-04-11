import React from 'react';
import { FormControl, FormControlLabel, Checkbox as MuiCheckbox } from '@material-ui/core';

function CheckBox({ name, label, value, onChange }) {

  const formatTargetValue = (name, value) => ({
    target: {
      name,
      value
    }
  });

  return (
    <FormControl>
      <FormControlLabel
        control={<MuiCheckbox 
          name={name}
          color="primary"
          checked={value}
          onChange={(e) => onChange(formatTargetValue(name, e.target.checked)) }
        />}
        label={label}
      />
    </FormControl>
  )
}

export default CheckBox;
