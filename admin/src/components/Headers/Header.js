import React, { useEffect } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import AddCardIcon from "@mui/icons-material/AddCard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReceiptSharpIcon from "@mui/icons-material/ReceiptSharp";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AxiosInstance from "../../AxiosInstance";
import { setUserData, setLoading, fetchUsers } from "../userSlice"; // Import actions
import "./style.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // const Header = () => {
    // const dispatch = useDispatch();
    const { signupCount, billingCount, usersCount, addtoCarts, loading } =
      useSelector((state) => state.user);
  
    useEffect(() => {
      dispatch(fetchUsers()); // 🔹 Fetch user data when component mounts
    }, [dispatch]);

  const UserNavigate = () => {
    navigate("/admin/User");
  };

  const userBilling = () => {
    navigate("/admin/Order");
  };

  const UserStock = () => {
    navigate("/admin/Stock");
  };

  const UserCartsAll = () => {
    navigate("/admin/Addcard");
  };

  return (
    <div
      className="header pb-8 pt-5 pt-md-8"
      style={{ backgroundColor: "#C9A234" }}
    >
      <Container fluid>
        <div className="header-body">
          <Row>
            <Col lg="6" xl="3">
              <Card
                className="card-stats mb-4 mb-xl-0"
                style={{ height: "120px" }}
                onClick={UserNavigate}
              >
                <CardBody style={{ cursor: "pointer" }}>
                  <Row style={{ marginTop: "10px" }}>
                    <div className="col cardGap">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase mb-0 cardTitle"
                      >
                        Users
                      </CardTitle>
                      <span className="h1 font-weight-bold mb-0 totalColor">
                        {signupCount || 0}
                      </span>
                    </div>
                    <i className="fa-solid fa-right-to-bracket iconMui"></i>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="3">
              <Card
                className="card-stats mb-4 mb-xl-0"
                style={{ height: "120px" }}
                onClick={userBilling}
              >
                <CardBody style={{ cursor: "pointer" }}>
                  <Row>
                    <div className="col cardGap">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase mb-0 cardTitle"
                      >
                        Orders
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0 totalColor">
                        {billingCount || 0}
                      </span>
                    </div>
                    <ReceiptSharpIcon className="iconMui" />
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="3">
              <Card
                className="card-stats mb-4 mb-xl-0"
                style={{ height: "120px" }}
                onClick={UserStock}
              >
                <CardBody style={{ cursor: "pointer" }}>
                  <Row>
                    <div className="col cardGap">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase mb-0 cardTitle"
                      >
                        Stock
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0 totalColor">
                        {usersCount || 0}
                      </span>
                    </div>
                    <ShowChartIcon className="iconMui" />
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="3">
              <Card
                className="card-stats mb-4 mb-xl-0"
                style={{ height: "120px" }}
                onClick={UserCartsAll}
              >
                <CardBody style={{ cursor: "pointer" }}>
                  <Row>
                    <div className="col cardGap">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase mb-0 cardTitle"
                      >
                        Add to carts
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0 totalColor">
                        {addtoCarts || 0}
                      </span>
                    </div>
                    <AddCardIcon className="iconMui" />
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Header;
