import { useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import { Card, CardHeader, Container, Row, CardBody } from "reactstrap";
import React from "react";
import SpinnerDotted from "../../components/Loader/loader";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTable from "../../components/Table/Table";
import JobberSearch from "../../components/Search/Search";
import JobberPagination from "../../components/Pagination/Pagination";
import showToast from "../../components/Toast/Toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import Tooltip from "@mui/material/Tooltip";

import Detailloader from "../../components/DetailLOader/detailloader";
import AxiosInstance from "../../AxiosInstance";
import { useDispatch } from "react-redux";
import { fetchUsers } from "components/userSlice";
const Tableuser = () => {
  const baseUrl = process.env.REACT_APP_BASE_API;

  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [countData, setCountData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getData(1);
  }, [searchTerm, rowsPerPage, page]);

  const getData = async () => {
    try {
      const res = await AxiosInstance.get(`${baseUrl}/billing/billingdata`);
      if (res?.status === 200) {
        setData(res?.data?.data);
        setCountData(res?.data?.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredData = data.filter((user) => {
    const fullName = `${user?.FirstName || ""} ${
      user?.LastName || ""
    }`.toLowerCase();
    return (
      fullName.includes(search?.toLowerCase() || "") ||
      (user?.ContactEmail || "")
        .toLowerCase()
        .includes(search?.toLowerCase() || "") ||
      (user?.Quantity || "")
        .toLowerCase()
        .includes(search?.toLowerCase() || "") ||
      (user?.Price || "").toLowerCase().includes(search?.toLowerCase() || "") ||
      (user?.SKU || "").toLowerCase().includes(search?.toLowerCase() || "")
    );
  });

  const indexOfFirstItem = page * rowsPerPage;
  const indexOfLastItem = indexOfFirstItem + rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / pageItem);

  let [propertyData, setPropertyData] = useState([]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (propertyData) {
    paginatedData = propertyData?.slice(startIndex, endIndex);
  }

  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleClose = () => {
    setOpen(false);
    setOpenDialog(false);
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleDialogOpen = async (rowData) => {
    setOpenDialog(true);
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/billing/billingpopup?BillingId=${rowData}`
      );
      if (response?.status === 200) {
        setDialogData(response.data.data);
      } else {
        setDialogData(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message || error);
      setDialogData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (imgUrl) => {
    setImageUrl(imgUrl);
    setOpen(true);
  };

  const deleteuser = async (BillingId) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "You want to delete this order?",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      });

      if (willDelete) {
        const response = await AxiosInstance.delete(
          `${baseUrl}/billing/deletebilingdata/${BillingId}`
        );
        if (response?.status === 200) {
          toast.success("Order deleted successfully", {
            position: "top-center",
            autoClose: 2000,
          });

          getData();
          if (data?.length === 1) {
            setData([]);
          }
          dispatch(fetchUsers());
        } else {
          showToast.error("Failed to delete the Order. Please try again.");
        }
      } else {
      }
    } catch (error) {
      console.error("Error deleting Order:", error.message || error);
      showToast.error(
        "An error occurred while deleting the Order. Please try again."
      );
      setDialogData(null);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between heading-searchflex">
                <h3 className="mb-0 heading-right">Total Orders</h3>
                <div className="search-left">
                  <JobberSearch search={search} setSearch={setSearch} />
                </div>
              </CardHeader>

              {loading ? (
                <SpinnerDotted />
              ) : (
                <CardBody>
                  <CustomTable
                    headerData={[
                      "Sr No.",
                      "Name",
                      "Email",
                      "Quantity",
                      "Price",
                      "Sku",
                      "Order Date",
                      "Image",
                      "Delete",
                    ]}
                    isDialog={true}
                    cellData={currentData.map((user, index) => ({
                      key: user.BillingId,
                      value: [
                        indexOfFirstItem + index + 1,
                        `${user?.FirstName} ${user?.LastName}` || "N/A",
                        user?.ContactEmail || "N/A",
                        user?.Quantity || "N/A",
                        user?.Price || "N/A",
                        user?.SKU || "N/A",
                        new Date(user?.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          } || "N/A"
                        ),
                        <img
                          src={user.Image}
                          alt="Image"
                          style={{ width: 50, height: 50, cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(user?.Image);
                          }}
                        />,
                        <Tooltip title="Delete" arrow>
                          <i
                            className="fa-solid fa-trash"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteuser(user?.BillingId); // Pass the UserId correctly
                            }}
                          ></i>
                        </Tooltip>,
                      ],
                    }))}
                    onDialogOpen={handleDialogOpen}
                  />
                  {/* Pagination inside the table body */}
                  <JobberPagination
                    loading={loading}
                    totalData={countData}
                    currentData={rowsPerPage}
                    dataPerPage={rowsPerPage}
                    pageItems={[10, 25, 50]}
                    page={page}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                  />
                </CardBody>
              )}
            </Card>
          </div>
        </Row>
      </Container>
      <ToastContainer />

      <div style={{ width: "100%" }}>
        <Dialog
          open={openDialog}
          onClose={handleClose}
          PaperProps={{
            style: {
              borderRadius: "20px",
              maxWidth: "1000px",
              width: "100%",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
            },
          }}
        >
          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              background: "rgb(201, 162, 52)",
              borderRadius: "20px 20px 0 0",
              color: "white",
            }}
          >
            <DialogTitle
              className="cardHead-detail"
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "white",
              }}
            >
              Order Details
            </DialogTitle>
            <IconButton
              edge="end"
              onClick={handleClose}
              aria-label="close"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>

          <DialogContent
            style={{
              padding: "30px",
              background: "#f8f9fa",
              fontSize: "1rem",
              color: "#333",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {isLoading ? (
              <Detailloader />
            ) : (
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="detailsModel"
              >
                <div>
                  <h2>User Details</h2>
                  <p>
                    <strong className="Heading">Name:</strong>{" "}
                    {dialogData?.[0]?.FirstName || "N/A"}{" "}
                    {dialogData?.[0]?.LastName || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Email:</strong>{" "}
                    {dialogData?.[0]?.ContactEmail || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Phone Number:</strong>{" "}
                    {dialogData?.[0]?.Phone || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Address:</strong>{" "}
                    {dialogData?.[0]?.City || "N/A"} {dialogData?.[0]?.State}{" "}
                    {dialogData?.[0]?.Country} {dialogData?.[0]?.PinCode}
                  </p>
                  <p>
                    <strong className="Heading">Order Date:</strong>{" "}
                    {dialogData?.[0]?.createdAt
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }).format(new Date(dialogData[0]?.createdAt))
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h2>Product Details</h2>
                  <p>
                    <strong className="Heading">Quantity:</strong>{" "}
                    {dialogData?.[0]?.Quantity || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Price:</strong>{" "}
                    {dialogData?.[0]?.Price || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Carats:</strong>{" "}
                    {dialogData?.[0]?.Carats || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Color:</strong>{" "}
                    {dialogData?.[0]?.Color || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Shape:</strong>{" "}
                    {dialogData?.[0]?.Shape || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Cut:</strong>{" "}
                    {dialogData?.[0]?.Cut || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Clarity:</strong>{" "}
                    {dialogData?.[0]?.Clarity || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Lab:</strong>{" "}
                    {dialogData?.[0]?.Lab || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Sku Id:</strong>{" "}
                    {dialogData?.[0]?.SKU || "N/A"}
                  </p>

                  <p>
                    <strong className="Heading">Video:</strong>{" "}
                    <span>
                      <a
                        href={
                          dialogData?.[0]?.stockDetails?.[0]?.Video || "N/A"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#4e54c8",
                          textDecoration: "underline",
                        }}
                      >
                        {dialogData?.[0]?.stockDetails?.[0]?.Video &&
                        dialogData?.[0]?.stockDetails?.[0]?.Video.length > 10
                          ? dialogData?.[0]?.stockDetails?.[0]?.Video.substring(
                              0,
                              10
                            ) + "..."
                          : dialogData?.[0]?.stockDetails?.[0]?.Video || "N/A"}
                      </a>
                    </span>
                  </p>
                  <p>
                    <strong className="Heading">Tinge:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.Tinge || "N/A"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong className="Heading">Certificate No:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.CertificateNo || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Depth:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.Depth || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Disc:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.Disc || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">EyeC:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.EyeC || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Fluo Int:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.FluoInt || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Lab:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.Lab || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Milky:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.Milky || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Polish:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.Polish || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Rap:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.Rap || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Ratio:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.Ratio || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">SrNo:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.SrNo || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Symm:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.Symm || "N/A"}
                  </p>
                  <p>
                    <strong className="Heading">Table:</strong>{" "}
                    {dialogData?.[0]?.stockDetails?.[0]?.Table || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>

          <DialogActions
            style={{
              background: "#f8f9fa",
              padding: "20px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={handleClose}
              className="hover:opacity-90"
              style={{
                background: "rgb(201, 162, 52)",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontWeight: "600",
                fontSize: "1rem",
                padding: "10px 30px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(78, 84, 200, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Close
            </button>
          </DialogActions>
        </Dialog>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Image</DialogTitle>
        <DialogContent>
          <img
            src={imageUrl}
            alt="Image"
            style={{ width: "100%", height: "auto" }} // Adjust to fit the modal
          />
        </DialogContent>
        <DialogActions
          style={{
            background: "#f8f9fa",
            padding: "20px",
            justifyContent: "center",
          }}
        >
          {/* <Button onClick={handleClose}>Close</Button> */}
          <button
            onClick={handleClose}
            className="hover:opacity-90"
            style={{
              background: "rgb(201, 162, 52)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontWeight: "600",
              fontSize: "1rem",
              padding: "10px 30px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(78, 84, 200, 0.3)",
              transition: "all 0.3s ease",
            }}
          >
            Close
          </button>
          {/* </DialogActions> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Tableuser;
