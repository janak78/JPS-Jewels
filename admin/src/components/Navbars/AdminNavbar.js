import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import img from "../../assets/img/theme/img.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosInstance from "AxiosInstance";

const AdminNavbar = (props) => {
  const baseUrl = process.env.REACT_APP_BASE_API;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    toast.success("Logout successful !!", {
      position: "top-center",
      autoClose: 2000,
    });
    setTimeout(() => {
      navigate("/auth/login");
    }, 1200);
  };

  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await AxiosInstance.get(
        `${baseUrl}/superadmin/superadmindetails`
      );

      if (res.status === 200) {
        setData(res.data.data);
      } else {
        console.warn("Unexpected response:", res.message);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error.message || error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto"></Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img src={img}></img>
                  </span>
                  <Media
                    className="ml-2 d-none d-lg-block"
                    style={{ fontSize: "20px", fontWeight: "600" }}
                  >
                    {data[0]?.FirstName || "N/A"} {""}
                    {data[0]?.LastName}
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow">
                <DropdownItem onClick={handleLogout}>
                  <i className="ni ni-user-run" style={{ color: "black" }} />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
