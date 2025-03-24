import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Headers/Header";
// import "./style.css";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Button,
  Dropdown,
  Col,
  Input,
  CardBody,
} from "reactstrap";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SpinnerDotted from "../../components/Loader/loader";
import CustomTable from "../../components/Table/Table";
import JobberSearch from "../../components/Search/Search";
import JobberPagination from "../../components/Pagination/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import showToast from "../../components/Toast/Toast";
import ToolTip from "../../components/Tooltip/Tooltio";
import Detailloader from "../../components/DetailLOader/detailloader";
import AxiosInstance from "../../AxiosInstance";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { fetchUsers } from "components/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { handleAuth } from "../../auth";

const Addcard = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_API;

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countData, setCountData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const authResponse = await handleAuth(navigate, location);
      if (authResponse) {
        getData(); // Fetch data only if authentication succeeds
      }
    })();
  }, []);


  const getData = async () => {
    try {
      const res = await AxiosInstance.get(`/cart/cartwithoutcheckout`);
      if (res.status === 200) {
        setData(res?.data?.data);
        setCountData(res?.data?.TotalConut || 0);
      } else {
        console.warn("Unexpected response:", res.message);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(1);
  }, [rowsPerPage, page]);

  const searchQuery = search?.toLowerCase() ?? ""; // Ensure search is a valid string

  const filteredData = data.filter((item) => {
    const fullName = `${item?.userDetails?.FirstName ?? ""} ${
      item?.userDetails?.LastName ?? ""
    }`.toLowerCase();

    return (
      fullName.includes(searchQuery) ||
      (item?.userDetails?.PrimaryEmail ?? "")
        .toLowerCase()
        .includes(searchQuery) ||
      (item?.SKU ?? "").toLowerCase().includes(searchQuery) ||
      (item?.Color ?? "").toLowerCase().includes(searchQuery)
    );
  });

  const indexOfFirstItem = page * rowsPerPage;
  const indexOfLastItem = indexOfFirstItem + rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const [open, setOpen] = useState(false);

  const [popupData, setPopupData] = useState(null);
  const [popupLoading, setPopupLoading] = useState(false);
  const [openRow, setOpenRow] = useState(false);
  const [imageUrl, setImageUrl] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setOpenRow(false);
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleDialogOpen = async (rowData) => {
    setIsLoading(true);
    setOpenRow(true);

    try {
      const response = await AxiosInstance.get(
        `/cart/cartpopup?AddToCartId=${rowData}`
      );
      if (response.status === 200) {
        setPopupData(response?.data?.data[0]);
      } else {
        console.error("Unexpected response:", response.message);
        setPopupData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message || error);
      setPopupData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (imgUrl) => {
    setImageUrl(imgUrl);
    setOpen(true);
  };

  const deleteuser = async (AddToCartId) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "You want to delete this cart?",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      });

      if (willDelete) {
        const response = await AxiosInstance.delete(
          `/cart/updatecart/${AddToCartId}`
        );

        if (response?.status === 200) {
          toast.success("Cart deleted successfully", {
            position: "top-center",
            autoClose: 2000,
          });

          getData();
          if (data?.length === 1) {
            setData([]);
          }
          dispatch(fetchUsers());
        } else {
          showToast.error("Failed to delete the cart. Please try again.");
        }
      } else {
      }
    } catch (error) {
      console.error("Error deleting cart:", error.message || error);
      showToast.error(
        "An error occurred while deleting the cart. Please try again."
      );
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
                <h3 className="mb-0 heading-right">Available Carts</h3>
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
                      "SKU id",
                      "Quantity",
                      "Price",
                      "Carats",
                      "Color",
                      "Image",
                      "Added At",
                      "Delete",
                    ]}
                    isDialog={true}
                    cellData={currentData.map((user, index) => ({
                      key: user.AddToCartId,
                      value: [
                        indexOfFirstItem + index + 1,
                        `${user?.userDetails?.FirstName} ${user?.userDetails?.LastName}` ||
                          "N/A",
                        user?.userDetails?.PrimaryEmail || "N/A",
                        user?.SKU || "N/A",
                        user?.Quantity || "N/A",
                        user?.diamondDetails?.Price || "N/A",
                        user?.diamondDetails?.Carats || "N/A",
                        user?.diamondDetails?.Color || "N/A",

                        <img
                          src={user?.diamondDetails?.Image} // Display image
                          alt="Image"
                          style={{ width: 50, height: 50, cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(user?.diamondDetails?.Image);
                          }}
                        />,
                        new Date(
                          user.addCartDetails?.createdAt
                        ).toLocaleDateString(
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
                              deleteuser(user?.AddToCartId); // Pass the UserId correctly
                            }}
                          >
                            {/* <ToolTip /> */}
                          </i>
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
          open={openRow}
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
              Cart Details
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
                    <h2>User Details</h2>
                    <p>
                      <strong className="Heading">Name:</strong>{" "}
                      {popupData?.userDetails?.FirstName || "N/A"}{" "}
                      {popupData?.userDetails?.LastName}
                    </p>
                    <p>
                      <strong className="Heading">Company Name:</strong>{" "}
                      {popupData?.userDetails?.CompanyName || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Designation:</strong>{" "}
                      {popupData?.userDetails?.Designation || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Phone No :</strong>{" "}
                      {popupData?.userDetails?.PhoneNo || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Email:</strong>{" "}
                      {popupData?.userDetails?.PrimaryEmail || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">User Name:</strong>{" "}
                      {popupData?.userDetails?.Username || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Line Of Business:</strong>{" "}
                      {popupData?.userDetails?.LineofBusiness || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Register Type:</strong>{" "}
                      {popupData?.userDetails?.RegisterType || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">
                        Preferred Contact Details:
                      </strong>{" "}
                      {popupData?.userDetails?.PreferredContactDetails || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">City Phone Code:</strong>{" "}
                      {popupData?.userDetails?.CityPhoneCode || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Website:</strong>{" "}
                      <span>
                        {/* {popupData?.certificateUrl || "N/A"} */}
                        <a
                          href={popupData?.userDetails?.Website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#4e54c8",
                            textDecoration: "underline",
                          }}
                        >
                          {popupData?.userDetails?.Website || "N/A"}
                        </a>
                      </span>
                    </p>
                    <p>
                      <strong className="Heading">Address:</strong>{" "}
                      {popupData?.userDetails?.City || "N/A"}{" "}
                      {popupData?.userDetails?.State}{" "}
                      {popupData?.userDetails?.Country}{" "}
                      {popupData?.userDetails?.Pincode}
                    </p>
                  </div>
                  <div>
                    <h2>Product Details</h2>

                    <p>
                      <strong className="Heading">SKU Id:</strong>{" "}
                      {popupData?.SKU || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Price:</strong>{" "}
                      {popupData?.diamondDetails?.Price || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Amount:</strong>{" "}
                      {popupData?.diamondDetails?.Amount || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Carats:</strong>{" "}
                      {popupData?.diamondDetails?.Carats || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Shape:</strong>{" "}
                      {popupData?.diamondDetails?.Shape || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Certificate No:</strong>{" "}
                      {popupData?.diamondDetails?.CertificateNo || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Measurements:</strong>{" "}
                      {popupData?.diamondDetails?.measurements || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Depth:</strong>{" "}
                      {popupData?.diamondDetails?.Depth || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Polish:</strong>{" "}
                      {popupData?.diamondDetails?.Polish || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Clarity:</strong>{" "}
                      {popupData?.diamondDetails?.Clarity || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Cut:</strong>{" "}
                      {popupData?.diamondDetails?.Cut || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Disc:</strong>{" "}
                      {popupData?.diamondDetails?.Disc || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong className="Heading">Video:</strong>{" "}
                      <a
                        href={popupData?.diamondDetails?.Video}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#4e54c8",
                          textDecoration: "underline",
                        }}
                      >
                        {popupData?.diamondDetails?.Video &&
                        popupData?.diamondDetails?.Video?.length > 10
                          ? popupData?.diamondDetails?.Video.substring(0, 10) +
                            "..."
                          : popupData?.diamondDetails?.Video || "N/A"}
                      </a>
                    </p>
                    <p>
                      <strong className="Heading">Sr No:</strong>{" "}
                      {popupData?.diamondDetails?.SrNo || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Tinge:</strong>{" "}
                      {popupData?.diamondDetails?.Tinge || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Table:</strong>{" "}
                      {popupData?.diamondDetails?.Table || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Ratio:</strong>{" "}
                      {popupData?.diamondDetails?.Ratio || "N/A"}
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
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Addcard;
