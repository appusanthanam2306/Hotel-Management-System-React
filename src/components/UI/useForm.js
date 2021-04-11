import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({

}));

export function useForm (initialFormValues, validateOnChange = false, validate) {

  const [ values, setValues ] = useState(initialFormValues);
  const [ errors, setErrors ] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });

    if (validateOnChange) {
      validate({[name]: value})
    }
  }

  const resetForm = () => {
    setValues(initialFormValues);
    setErrors({});
  }

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  }
}

export function Form ({children, ...other}) {
  const classes = useStyles();

  return (
    <form autoComplete="off" {...other}>
      { children }
    </form>
  )
}

