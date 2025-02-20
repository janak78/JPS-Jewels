import React from "react";
import { TextField, Grid } from "@mui/material";

const TextInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required,
  multiline,
  rows,
}) => {
  return (
    <Grid item xs={12} sm={12}>
      <TextField
        label={label}
        variant="outlined"
        fullWidth
        required={required}
        name={name}
        value={value}
        onChange={onChange} // ✅ Handles input change
        onBlur={onBlur} // ✅ Triggers validation on blur
        error={error} // ✅ Displays error if validation fails
        helperText={helperText} // ✅ Shows validation message
        multiline={multiline} // ✅ Enables textarea mode
        rows={multiline ? rows : undefined}
      />
    </Grid>
  );
};

export default TextInput;
