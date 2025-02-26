import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { fetchCartCount } from "../../redux/cartSlice";
import { useFetchDiamondsQuery } from "../../redux/shopSlice";
import DiamondLoader from "../../components/Loader/loader"; // Import Loader
import "./shop.css"; // External CSS
import {
  Button,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  setCurrentPage,
  setItemsPerPage,
  setTotalPages,
} from "../../redux/shopSlice";
import { useNavigate } from "react-router-dom";
import showToast from "../../components/Toast/Toaster";
import TextInput from "../../components/inputs/TextInput";

const DiamondsGrid = ({ diamond }) => {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const userId = useSelector((state) => state.auth?.user?.UserId);
  // const { totalPages, currentPage, itemsPerPage } = useSelector(
  //   (state) => state.shop
  // );

  // const { data, error, isLoading } = useFetchDiamondsQuery({
  //   pageNumber: currentPage,
  //   pageSize: itemsPerPage,
  // });
  // const diamonds = data?.result?.data || [];

  // useEffect(() => {
  //   if (data?.result?.totalPages) {
  //     dispatch(setTotalPages(data.result.totalPages));
  //   }
  // }, [data, dispatch]);

  // useEffect(() => {
  //   if (userId) {
  //     dispatch(fetchCartCount(userId));
  //   }
  // }, [userId]);

  // const handleAddToCart = (diamond, shouldShowToast) => {
  //   if (!userId) {
  //     showToast.warning("Please log in to add items to the cart.");
  //     return;
  //   }

  //   const cartItem = {
  //     SKU: diamond.SKU,
  //     Quantity: 1,
  //   };

  //   dispatch(addToCart(cartItem, userId, shouldShowToast));
  // };

  // const [anchorEl, setAnchorEl] = useState(null);

  // if (isLoading) return <DiamondLoader />;
  // if (error) return <p className="error">{error.message}</p>;

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = (perPage) => {
  //   if (typeof perPage === "number") {
  //     dispatch(setItemsPerPage(perPage));
  //   }
  //   setAnchorEl(null);
  // };

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     dispatch(setCurrentPage(currentPage + 1));
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     dispatch(setCurrentPage(currentPage - 1));
  //   }
  // };

  // Total price and p/ct section
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const icon = [
    { icon: "", name: "Round" },
    { icon: "", name: "Oval" },
    { icon: "", name: "pear" },
    { icon: "", name: "Cush Mod" },
    { icon: "", name: "Cush Brill" },
    { icon: "", name: "Emerald" },
    { icon: "", name: "Radiant" },
    { icon: "", name: "Princess" },
    { icon: "", name: "Asscher" },
    { icon: "", name: "Square" },
    { icon: "", name: "Marquise" },
    { icon: "", name: "Heart" },
    { icon: "", name: "Trilliant" },
    { icon: "", name: "Euro Cut" },
    { icon: "", name: "Old Miner" },
    { icon: "", name: "Briolette" },
    { icon: "", name: "Rose Cut" },
    { icon: "", name: "Lozenge" },
    { icon: "", name: "Baguette" },
    { icon: "", name: "Tap Bag" },
    { icon: "", name: "Half Moon" },
    { icon: "", name: "Flanders" },
    { icon: "", name: "Trapezoid" },
    { icon: "", name: "Bullets" },
    { icon: "", name: "Kite" },
    { icon: "", name: "Shield" },
    { icon: "", name: "Star" },
    { icon: "", name: "Pentagonal" },
    { icon: "", name: "Hexagonal" },
    { icon: "", name: "Octagonal" },
  ];

  const clarity = [
    { name: "FL" },
    { name: "IF" },
    { name: "VVS1" },
    { name: "VVS2" },
    { name: "VS1" },
    { name: "VS2" },
    { name: "SI1" },
    { name: "SI2" },
    { name: "SI3" },
    { name: "I1" },
    { name: "I2" },
    { name: "I3" },
  ];
  const heart = [{ name: "3X" }, { name: "3VG+" }];

  const cut = [
    { name: "Ideal" },
    { name: "Excellent" },
    { name: "Very Good" },
    { name: "Good" },
    { name: "Fair" },
    { name: "Poor" },
  ];
  const polish = [
    { name: "Ideal" },
    { name: "Excellent" },
    { name: "Very Good" },
    { name: "Good" },
    { name: "Fair" },
    { name: "Poor" },
  ];
  const symmetry = [
    { name: "Ideal" },
    { name: "Excellent" },
    { name: "Very Good" },
    { name: "Good" },
    { name: "Fair" },
    { name: "Poor" },
  ];
  const fluorescence = [
    { name: "None" },
    { name: "Faint" },
    { name: "Medium" },
    { name: "Strong" },
    { name: "V Strong" },
  ];
  const lab = [
    { name: "GIA" },
    { name: "IGI" },
    { name: "HRD" },
    { name: "Other" },
    { name: "None" },
  ];

  return (
    <>
      <Container sx={{ p: 0 }}>
        <Grid
          container
          spacing={2}
          alignItems="start"
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "#F8F9FA",
            mt: 3,
          }}
        >
          <Grid item xs={12}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ textAlign: "left" }}
            >
              Show Only
            </Typography>
          </Grid>
          <Grid item>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Items with Media"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Available Items"
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          alignItems="start"
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "#F8F9FA",
            mt: 3,
          }}
        >
          <Grid item xs={12}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ textAlign: "left" }}
            >
              Shape
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              spacing={1}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                gap: "8px",
                mt: 1,
              }}
              className="jps-icons"
            >
              {icon.map((value) => (
                <Grid
                  key={value.name}
                  item
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    border: "1px solid  #ccc",
                    borderRadius: "5px",
                    height: "100px",
                    width: "100%",
                    fontSize: "12px",
                    fontWeight: "500",
                    padding: 0,
                  }}
                >
                  {value?.icon && (
                    <div className="jps-icon">{value?.icon || ""}</div>
                  )}

                  {value?.name || ""}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "#F8F9FA",
            mt: 3,
          }}
        >
          <Grid container item xs={12} style={{ display: "flex" }} spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "left" }}
              >
                Caret
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "left" }}
              >
                Clarity
              </Typography>
            </Grid>

            <Grid item xs={6} container style={{ display: "flex" }} spacing={2}>
              <Grid item alignItems={"center"} style={{ display: "flex" }}>
                <TextInput label={"Min, ct"} />
              </Grid>

              <Grid item alignItems={"center"} style={{ display: "flex" }}>
                <i class="fa-solid fa-greater-than"></i>
              </Grid>

              <Grid item alignItems={"center"} style={{ display: "flex" }}>
                <TextInput label={"Max, ct"} />
              </Grid>
            </Grid>

            <Grid container item xs={6}>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Eye Clean"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Clarity Enhanced"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Drill"
                />
              </Grid>
              <Grid
                container
                spacing={1}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: "8px",
                  mt: 1,
                }}
                className="jps-icons"
              >
                {clarity.map((value) => (
                  <Grid
                    key={value.name}
                    item
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      border: "1px solid  #ccc",
                      borderRadius: "5px",
                      height: "50px",
                      width: "100%",
                      fontSize: "12px",
                      fontWeight: "500",
                      padding: 0,
                      borderRadius: "8px",
                      // textTransform: "uppercase",
                    }}
                  >
                    {value?.name || ""}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "#F8F9FA",
            mt: 3,
          }}
        >
          <Grid container item xs={12} style={{ display: "flex" }} spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "left" }}
              >
                Cut, Polish, Symmetry
              </Typography>
            </Grid>
            <Grid container item xs={6}>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Hearts and Arrows"
                />
              </Grid>
              <Grid
                container
                spacing={1}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: "8px",
                  mt: 1,
                }}
                className="jps-icons"
              >
                {heart.map((value) => (
                  <Grid
                    key={value.name}
                    item
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      border: "1px solid  #ccc",
                      borderRadius: "5px",
                      height: "50px",
                      width: "100%",
                      fontSize: "12px",
                      fontWeight: "500",
                      padding: 0,
                      borderRadius: "8px",
                      // textTransform: "uppercase",
                    }}
                  >
                    {value?.name || ""}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={12} style={{ display: "flex" }} spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "left" }}
              >
                Cut
              </Typography>
            </Grid>
            <Grid container item xs={12}>
              <Grid
                container
                spacing={1}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: "8px",
                  mt: 1,
                }}
                className="jps-icons"
              >
                {cut.map((value) => (
                  <Grid
                    key={value.name}
                    item
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      border: "1px solid  #ccc",
                      borderRadius: "5px",
                      height: "50px",
                      width: "100%",
                      fontSize: "12px",
                      fontWeight: "500",
                      padding: 0,
                      borderRadius: "8px",
                      // textTransform: "uppercase",
                    }}
                  >
                    {value?.name || ""}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={12} style={{ display: "flex" }} spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "left" }}
              >
                Polish
              </Typography>
            </Grid>
            <Grid container item xs={12}>
              <Grid
                container
                spacing={1}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: "8px",
                  mt: 1,
                }}
                className="jps-icons"
              >
                {polish.map((value) => (
                  <Grid
                    key={value.name}
                    item
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      border: "1px solid  #ccc",
                      borderRadius: "5px",
                      height: "50px",
                      width: "100%",
                      fontSize: "12px",
                      fontWeight: "500",
                      padding: 0,
                      borderRadius: "8px",
                      // textTransform: "uppercase",
                    }}
                  >
                    {value?.name || ""}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={12} style={{ display: "flex" }} spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "left" }}
              >
                Symmetry
              </Typography>
            </Grid>
            <Grid container item xs={12}>
              <Grid
                container
                spacing={1}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: "8px",
                  mt: 1,
                }}
                className="jps-icons"
              >
                {symmetry.map((value) => (
                  <Grid
                    key={value.name}
                    item
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      border: "1px solid  #ccc",
                      borderRadius: "5px",
                      height: "50px",
                      width: "100%",
                      fontSize: "12px",
                      fontWeight: "500",
                      padding: 0,
                      borderRadius: "8px",
                      // textTransform: "uppercase",
                    }}
                  >
                    {value?.name || ""}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "#F8F9FA",
            mt: 3,
          }}
        >
          <Grid container item xs={6} style={{ display: "flex" }} spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "left" }}
              >
                Fluorescence
              </Typography>
            </Grid>
            <Grid container item xs={12}>
              <Grid
                container
                spacing={1}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: "8px",
                  mt: 1,
                }}
                className="jps-icons"
              >
                {fluorescence.map((value) => (
                  <Grid
                    key={value.name}
                    item
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      border: "1px solid  #ccc",
                      borderRadius: "5px",
                      height: "50px",
                      width: "100%",
                      fontSize: "12px",
                      fontWeight: "500",
                      padding: 0,
                      borderRadius: "8px",
                      // textTransform: "uppercase",
                    }}
                  >
                    {value?.name || ""}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={6} style={{ display: "flex" }} spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "left" }}
              >
                Lab
              </Typography>
            </Grid>
            <Grid container item xs={12}>
              <Grid
                container
                spacing={1}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: "8px",
                  mt: 1,
                }}
                className="jps-icons"
              >
                {lab.map((value) => (
                  <Grid
                    key={value.name}
                    item
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      border: "1px solid  #ccc",
                      borderRadius: "5px",
                      height: "50px",
                      width: "100%",
                      fontSize: "12px",
                      fontWeight: "500",
                      padding: 0,
                      borderRadius: "8px",
                      // textTransform: "uppercase",
                    }}
                  >
                    {value?.name || ""}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "#F8F9FA",
            mt: 3,
          }}
        >
          <Grid container item xs={12} style={{ display: "flex" }} spacing={2}>
            <Grid item xs={12}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="price tabs"
                sx={{
                  minHeight: "40px",
                  "& .MuiTab-root": { minWidth: "auto", textTransform: "none" },
                }}
              >
                <Tab
                  label={
                    <Typography variant="body1" fontWeight="bold">
                      Total Price
                    </Typography>
                  }
                  sx={{
                    px: 2,
                    outline: "none !important",
                    "&:focus": { outline: "none" },
                    "&.Mui-selected:focus": { outline: "none" },
                    "&.Mui-focusVisible": { outline: "none" },
                  }}
                />
                <Tab
                  label={
                    <Typography variant="body1" fontWeight="bold">
                      P/ct
                    </Typography>
                  }
                  sx={{
                    px: 2,
                    outline: "none !important",
                    "&:focus": { outline: "none" },
                    "&.Mui-selected:focus": { outline: "none" },
                    "&.Mui-focusVisible": { outline: "none" },
                  }}
                />
              </Tabs>
            </Grid>

            <Grid
              item
              xs={12}
              container
              style={{ display: "flex" }}
              spacing={2}
            >
              <Grid item alignItems={"center"} style={{ display: "flex" }}>
                <TextInput label={"Min, $"} />
              </Grid>

              <Grid item alignItems={"center"} style={{ display: "flex" }}>
                <i class="fa-solid fa-greater-than"></i>
              </Grid>

              <Grid item alignItems={"center"} style={{ display: "flex" }}>
                <TextInput label={"Max, $"} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "#F8F9FA",
            mt: 3,
          }}
        >
          <Grid container item xs={12} style={{ display: "flex" }} spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "left" }}
              >
                Measurements
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              style={{ display: "flex" }}
              spacing={2}
            >
              <Grid
                item
                xs={6}
                container
                style={{ display: "flex" }}
                spacing={2}
              >
                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Depth, Min, %"} />
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <i class="fa-solid fa-greater-than"></i>
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Depth, Max, %"} />
                </Grid>
              </Grid>
              <Grid
                item
                xs={6}
                container
                style={{ display: "flex" }}
                spacing={2}
              >
                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Table, Min, %"} />
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <i class="fa-solid fa-greater-than"></i>
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Table, Max, %"} />
                </Grid>
              </Grid>
              <Grid
                item
                xs={6}
                container
                style={{ display: "flex" }}
                spacing={2}
              >
                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Radio, Min"} />
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <i class="fa-solid fa-greater-than"></i>
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Radio, Max"} />
                </Grid>
              </Grid>
              <Grid
                item
                xs={6}
                container
                style={{ display: "flex" }}
                spacing={2}
              >
                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Length, Min, mm"} />
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <i class="fa-solid fa-greater-than"></i>
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Length, Max, mm"} />
                </Grid>
              </Grid>
              <Grid
                item
                xs={6}
                container
                style={{ display: "flex" }}
                spacing={2}
              >
                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Width, Min, mm"} />
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <i class="fa-solid fa-greater-than"></i>
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Width, Max, mm"} />
                </Grid>
              </Grid>
              <Grid
                item
                xs={6}
                container
                style={{ display: "flex" }}
                spacing={2}
              >
                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Depth, Min, mm"} />
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <i class="fa-solid fa-greater-than"></i>
                </Grid>

                <Grid item alignItems={"center"} style={{ display: "flex" }}>
                  <TextInput label={"Depth, Max, mm"} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default DiamondsGrid;
