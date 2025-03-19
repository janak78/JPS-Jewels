import { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Grid, Typography } from "@mui/material";

const JobberPagination = ({
  totalData,
  dataPerPage,
  pageItems,
  page,
  setPage,
  setRowsPerPage,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if ((page + 1) * dataPerPage < totalData) {
      setPage(page + 1);
    }
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setPage(0);
  };

  const startItem = page * dataPerPage + 1;
  const endItem = Math.min((page + 1) * dataPerPage, totalData);

  return (
    <Grid className="d-flex justify-content-end align-items-center mt-4 paginationResponsiev">
      <Dropdown
        toggle={toggle}
        isOpen={dropdownOpen}
        style={{ zIndex: 9 }}
        className="pageofTotal"
      >
        <DropdownToggle
          className="text-white-color text-lg p-2 rounded-lg  paginationFont"
          caret
          style={{
            background: "none",
            border: "none",
            backgroundColor: "rgb(201, 162, 52)",
            color: "white",
            fontWeight: "100",
          }}
        >
          {dataPerPage || "N/A"}
        </DropdownToggle>
        <DropdownMenu>
          {pageItems &&
            pageItems.map((item, index) => (
              <DropdownItem
                className="text-black transition-all"
                style={{ fontSize: "19px" }}
                onClick={() => handleRowsPerPageChange(item)}
                key={index}
              >
                {item || "N/A"}
              </DropdownItem>
            ))}
        </DropdownMenu>
      </Dropdown>

      <Grid
        className="d-flex justify-content-between align-items-center text-white p-2 rounded-lg  pageofTotal"
        style={{ backgroundColor: "rgb(201, 162, 52)" }}
      >
        <KeyboardArrowLeftIcon
          sx={{
            color: page === 0 ? "transparent" : "white",

            cursor: page === 0 ? "default" : "pointer",
            fontSize: "24px",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
          onClick={handlePrevPage}
        />
        <Typography className="mx-4 font-semibold text-lg paginationFont">
          {totalData > 0
            ? `${startItem} - ${endItem} of ${totalData}`
            : "0 - 0 of 0"}
        </Typography>
        <ChevronRightIcon
          sx={{
            color:
              (page + 1) * dataPerPage >= totalData ? "transparent" : "white",
            cursor:
              (page + 1) * dataPerPage >= totalData ? "default" : "pointer",
            fontSize: "24px",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
          onClick={handleNextPage}
        />
      </Grid>
    </Grid>
  );
};

export default JobberPagination;
