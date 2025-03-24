import { Card, CardHeader, Container, Row, Col, CardBody } from "reactstrap";
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import Detailloader from "../../components/DetailLOader/detailloader";
import AxiosInstance from "../../AxiosInstance";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { fetchUsers } from "components/userSlice";

const Tables = () => {
  const baseUrl = process.env.REACT_APP_BASE_API;

  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [pageItem, setPageItem] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [search, setSearch] = useState("");
  const [countData, setCountData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getData(1);
  }, [searchTerm, rowsPerPage, page]);

  const getData = async () => {
    try {
      const res = await AxiosInstance.get(`${baseUrl}/user/all-users`);
      if (res.status === 200) {
        setData(res.data.data);
        setCountData(res.data.TotalCount || 0);
      } else {
        console.warn("Unexpected response:", res.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((user) => {
    const fullName = `${user.FirstName} ${user.LastName}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      user.PrimaryEmail.toLowerCase().includes(search.toLowerCase()) ||
      user.City.toLowerCase().includes(search.toLowerCase()) ||
      user.CompanyName.toLowerCase().includes(search.toLowerCase()) ||
      user.Designation.toLowerCase().includes(search.toLowerCase())
    );
  });
  useEffect(() => {
    getData();
  }, []);
  const totalPages = Math.ceil(filteredData.length / pageItem);

  const indexOfFirstItem = page * rowsPerPage;
  const indexOfLastItem = indexOfFirstItem + rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleDialogOpen = async (rowData) => {
    setOpenDialog(true);
    setIsLoading(true); // Start loading
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/user/userpopup?UserId=${rowData}`
      );
      if (response.status === 200) {
        setDialogData(response.data.data);
      } else {
        setDialogData(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const deleteuser = async (userId) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "You want to delete this user?",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      });

      if (willDelete) {
        const response = await AxiosInstance.delete(
          `${baseUrl}/user/updateuser/${userId}`
        );

        if (response.status === 200) {
          toast.success("User deleted successfully", {
            position: "top-center",
            autoClose: 2000,
          });

          getData();

          if (data.length === 1) {
            setData([]);
          }
          dispatch(fetchUsers());
        } else {
          toast.error("Failed to delete the user. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error.message || error);
      toast.error(
        "An error occurred while deleting the user. Please try again."
      );
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center heading-searchflex">
                <h3 className="mb-0 heading-right">All Users</h3>
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
                      "Company Name",
                      "City",
                      "Designation",
                      "Create At",
                      "Delete",
                    ]}
                    isDialog={true}
                    cellData={currentData.map((user, index) => ({
                      key: user.UserId,
                      value: [
                        indexOfFirstItem + index + 1,
                        `${user.FirstName} ${user.LastName} ` || "N/A",
                        user.PrimaryEmail || "N/A",
                        user.CompanyName || "N/A",
                        user.City || "N/A",
                        user.Designation || "N/A",
                        // user.createdAt,
                        new Date(user.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          } || "N/A"
                        ),
                        <Tooltip title="Delete" arrow>
                          <i
                            className="fa-solid fa-trash"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteuser(user.UserId); // Pass the UserId correctly
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
          </Col>
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
              // padding: "20px",
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
              User Details
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
              <Detailloader /> // Show loader while data is fetching
            ) : (
              <>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  className="detailsModel"
                >
                  <div>
                    <p>
                      <strong className="Heading">Name:</strong>{" "}
                      {dialogData?.[0]?.FirstName || "N/A"}{" "}
                      {dialogData?.[0]?.LastName || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Email:</strong>{" "}
                      {dialogData?.[0]?.PrimaryEmail || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Company Name:</strong>{" "}
                      {dialogData?.[0]?.CompanyName || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Designation:</strong>{" "}
                      {dialogData?.[0]?.Designation || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Created At:</strong>{" "}
                      {dialogData?.[0]?.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }).format(new Date(dialogData?.[0]?.createdAt))
                        : "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Address:</strong>{" "}
                      {dialogData?.[0]?.City || "N/A"},{" "}
                      {dialogData?.[0]?.State || "N/A"},{" "}
                      {dialogData?.[0]?.Country || "N/A"} -{" "}
                      {dialogData?.[0]?.Pincode || "N/A"}
                    </p>
                    {/* <p>
                    <strong className="Heading">User Password:</strong>{" "}
                    {dialogData?.[0]?.UserPassword || "N/A"}
                  </p> */}
                  </div>

                  <div>
                    <p>
                      <strong className="Heading">Phone No:</strong>{" "}
                      {dialogData?.[0]?.PhoneNo || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Line Of Business:</strong>{" "}
                      {dialogData?.[0]?.LineofBusiness || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Preferred Contact:</strong>{" "}
                      {dialogData?.[0]?.PreferredContactMethod || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Register Type:</strong>{" "}
                      {dialogData?.[0]?.RegisterType || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Email:</strong>{" "}
                      {dialogData?.[0]?.SecondaryEmail || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Website:</strong>{" "}
                      <a
                        href={dialogData?.[0]?.Website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#4e54c8",
                          textDecoration: "underline",
                        }}
                      >
                        {dialogData?.[0]?.Website || "N/A"}
                      </a>
                    </p>
                  </div>
                </div>
              </>
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
    </>
  );
};

export default Tables;
