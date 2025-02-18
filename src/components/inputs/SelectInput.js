import React from "react";
import { Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

const SelectInput = ({ label, name, value, onChange, onBlur, error, helperText, options }) => {
  return (
    <Grid item xs={12} sm={12}>
      <FormControl fullWidth variant="outlined" error={error}>
        <InputLabel>{label}</InputLabel>
        <Select
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Grid>
  );
};

export default SelectInput;
