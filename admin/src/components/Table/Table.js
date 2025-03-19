import React, { useState } from "react";
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Collapse,
} from "@mui/material";
import nodata from "../../assets/img/theme/no-data.png";

const CustomTable = ({
  headerData,
  cellData,
  isDialog = false,
  onDialogOpen,
}) => {
  const [collapseIndex, setCollapseIndex] = useState(null);

  const handleRowClick = (index, rowData) => {
    setCollapseIndex(collapseIndex === index ? null : index);
    if (isDialog && onDialogOpen) {
      onDialogOpen(rowData);
    }
  };

  return (
    <Grid style={{ overflow: "auto", fontFamily: "'Poppins', sans-serif" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              className="bg-orange-color text-white-color"
              style={{
                width: "10px",
                textAlign: "end",
              }}
            />
            {headerData &&
              headerData.map((item, index) => (
                <TableCell
                  key={index}
                  className="bg-orange-color text-white-color"
                  style={{
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    fontFamily: "'Poppins', sans-serif", // Apply Poppins here
                  }}
                >
                  {item || "N/A"}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {cellData?.length > 0 ? (
            cellData.map((item, index) => (
              <React.Fragment key={index}>
                <TableRow
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(index, item.key, item)}
                >
                  <TableCell></TableCell>

                  {item?.value?.map((value, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className="text-blue-color"
                      style={{
                        color: "#063164",
                        fontFamily: "'Poppins', sans-serif", // Apply Poppins here
                      }}
                    >
                      {value}
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={headerData?.length + 1}
                  >
                    <Collapse
                      in={collapseIndex === index}
                      timeout="auto"
                      unmountOnExit
                    ></Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                align="center"
                className="text-blue-color"
                colSpan={headerData?.length}
              >
                <div style={{ flexDirection: "column", display: "flex" }}>
                  <div>
                    <img
                      src={nodata}
                      style={{
                        height: "40px",
                        width: "40px",
                        margin: "auto",
                        justifyContent: "content",
                        display: "flex",
                      }}
                    />
                  </div>
                  Data Not Available
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Grid>
  );
};

export default CustomTable;
