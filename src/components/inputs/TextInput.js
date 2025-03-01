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
  customBg,
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
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        InputProps={{
          style: customBg ? { backgroundColor: "#fff" } : {},
        }}
      />
    </Grid>
  );
};

export default TextInput;
