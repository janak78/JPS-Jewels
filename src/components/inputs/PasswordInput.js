import React, { useState } from "react";
import { Grid, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordInput = ({ label, name, value, onChange, onBlur, error, helperText, required }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Grid item xs={12} sm={12}>
      <TextField 
        label={label} 
        name={name}
        type={showPassword ? "text" : "password"} 
        variant="outlined" 
        fullWidth 
        required={required}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
};

export default PasswordInput;
