import React from "react";
import {
  Badge,
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Container,
  Row,
  Button,
  Col,
  Dropdown,
  Input,
  CardBody,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import axios from "axios";
import SpinnerDotted from "../../components/Loader/loader";

import CustomTable from "../../components/Table/Table";
import JobberSearch from "../../components/Search/Search";
import JobberPagination from "../../components/Pagination/Pagination";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import showToast from "../../components/Toast/Toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import AxiosInstance from "../../AxiosInstance";
import Tooltip from "@mui/material/Tooltip";

import Detailloader from "../../components/DetailLOader/detailloader";
import { useLocation, useNavigate } from "react-router-dom";
import { handleAuth } from "../../auth";

const Contact = () => {

  const location = useLocation();
    const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_API;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [countData, setCountData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  useEffect(() => {
    fetchUsers(1);
  }, [rowsPerPage, page]);

  useEffect(() => {
      (async () => {
        const authResponse = await handleAuth(navigate, location);
        if (authResponse) {
          fetchUsers(); // Fetch data only if authentication succeeds
        }
      })();
    }, []);

  const fetchUsers = async () => {
    try {
      const res = await AxiosInstance.get(`/contact/contactdetails`);
      if (res.status === 200) {
        setData(res?.data?.data);
        setCountData(res?.data?.TotalCount || 0);
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
    const fullName = `${user.FirstName ?? ""} ${
      user.LastName ?? ""
    }`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      (user?.Name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (user?.Email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (user?.Message ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (user?.Subject ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });
  useEffect(() => {
    fetchUsers();
  }, []);

  const indexOfFirstItem = page * rowsPerPage;
  const indexOfLastItem = indexOfFirstItem + rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const [isLoading, setIsLoading] = useState(false);
  const handleDialogOpen = async (rowData) => {
    setOpenDialog(true);
    setIsLoading(true);

    try {
      const response = await AxiosInstance.get(
        `/contact/contactdetailspopup?ContactId=${rowData}`
      );
      if (response?.status === 200) {
        setDialogData(response?.data?.data);
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

  const handleClose = () => {
    setOpenDialog(false);
  };

  const deleteuser = async (ContactId) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "You want to delete this contact?",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      });

      if (willDelete) {
        const response = await AxiosInstance.delete(
          `/contact/updatecontact/${ContactId}`
        );

        if (response?.status === 200) {
          toast.success("contact deleted successfully", {
            position: "top-center",
            autoClose: 2000,
          });

          fetchUsers();
          if (data.length === 1) {
            setData([]);
          }
        } else {
          showToast.error("Failed to delete the contact. Please try again.");
        }
      } else {
      }
    } catch (error) {
      console.error("Error deleting contact:", error.message || error);
      showToast.error(
        "An error occurred while deleting the contact. Please try again."
      );
      setDialogData(null);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center heading-searchflex"
              // style={{
              //   borderBottom: "2px solid rgba(246, 192, 16)",
              //   zIndex: "1000",
              // }}
              >
                <h3 className="mb-0 heading-right">Contacts</h3>
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
                      "Subject",
                      "Message",
                      "Contact At",
                      "Delete",
                    ]}
                    isDialog={true}
                    cellData={currentData.map((user, index) => ({
                      key: user.ContactId,
                      value: [
                        indexOfFirstItem + index + 1,
                        `${user?.Name || "N/A"} `,
                        user?.Email || "N/A",
                        (user?.Subject && user?.Subject?.length > 20
                          ? user?.Subject.substring(0, 20) + "..."
                          : user?.Subject) || "N/A",
                        (user?.Message && user?.Message?.length > 20
                          ? user?.Message?.substring(0, 20) + "..."
                          : user?.Message) || "N/A",
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
                              deleteuser(user.ContactId); // Pass the UserId correctly
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
              maxWidth: "600px  ",
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
              Contact Details
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
                      {dialogData?.[0]?.Name || "N/A"}{" "}
                      {/* {dialogData?.[0]?.LastName || "N/A"} */}
                    </p>
                    <p>
                      <strong className="Heading">Email:</strong>{" "}
                      {dialogData?.[0]?.Email || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Subject:</strong>{" "}
                      {dialogData?.[0]?.Subject || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Message:</strong>{" "}
                      {dialogData?.[0]?.Message || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Contact Date:</strong>{" "}
                      {/* {dialogData?.[0]?.createdAt || "N/A"}
                       */}
                      {new Date(dialogData?.[0]?.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          time: "numeric",
                        }
                      )}
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

export default Contact;
