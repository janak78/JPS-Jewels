import React from "react";
import { FormGroup, InputBase } from "@mui/material";

const JobberSearch = ({ search, setSearch }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <FormGroup>
      <div>
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            color: "black",
            "& .MuiInputBase-input": {
              color: "black",
              padding: "8px 9px",
              borderRadius: "10px",
              border: "2px solid rgb(201, 162, 52)",
            },
            "& .MuiInputBase-input:focus": {
              borderColor: "rgb(201, 162, 52)",
            },
          }}
          className="input-search serachReponsive"
          placeholder="Search..."
          inputProps={{ "aria-label": "search google maps" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ width: "fit-content" }}
        />
      </div>
    </FormGroup>
  );
};

export default JobberSearch;
