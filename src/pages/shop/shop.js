import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { fetchCartCount } from "../../redux/cartSlice";
import { useFetchDiamondsQuery } from "../../redux/shopSlice";
import DiamondLoader from "../../components/Loader/loader";
import "./shop.css";
import {
  Button,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
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
import { useNavigate, useSearchParams } from "react-router-dom";
import showToast from "../../components/Toast/Toaster";
import TextInput from "../../components/inputs/TextInput";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { jwtDecode } from "jwt-decode";
import noitem from "../../assets/images/not found.png";

const createUnsignedJWT = (payload) => {
  const header = { alg: "none", typ: "JWT" };

  // Convert to Base64 URL format
  const base64Header = btoa(JSON.stringify(header))
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const base64Payload = btoa(JSON.stringify(payload))
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  // No signature (empty third part)
  return `${base64Header}.${base64Payload}.`;
};

const DiamondsGrid = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get specific query param
  const query = searchParams.get("q");
  const userId = useSelector((state) => state.auth?.user?.UserId);
  const { totalPages, currentPage, itemsPerPage } = useSelector(
    (state) => state.shop
  );

  const [filterData, setFilterData] = useState(undefined);
  const [showfilterData, setShowFilterData] = useState(undefined);

  const filteredData = Object.entries(showfilterData || {}).filter(
    ([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return false; 
      return value !== "" && value !== null; 
    }
  );

  // Split data into two columns
  const midIndex = Math.ceil(filteredData.length / 2);
  const leftColumn = Array.from({ length: midIndex }).map((_, index) =>
    filteredData.slice(index * 2, index * 2 + 2)
  );

  const { data, error, isLoading } = useFetchDiamondsQuery({
    pageNumber: currentPage,
    pageSize: itemsPerPage,
    filterData: filterData,
  });

  // const diamonds = data?.result?.data || [];
  const diamonds = data?.result?.data || [];

  useEffect(() => {
    if (query !== "filter") {
      const decodedToken = jwtDecode(localStorage.getItem("filterToken"));
      setShowFilterData(decodedToken);
      setFilterData(decodedToken);
      setShape(decodedToken.Shape);
      setSelectedClarity(decodedToken.Clarity);
      setSelectedColor(decodedToken.Color);
      setSelectedCut(decodedToken.Cut);
      setSelectedPolish(decodedToken.Polish);
      setSelectedSymmetry(decodedToken.Symm);
      setSelectedFluroescene(decodedToken.FluoInt);
      setSelectedLab(decodedToken.Lab);
      setSelectedMilky(decodedToken.Milky);
      setSelectedTinge(decodedToken.Tinge);
      setCaratRange({
        min: decodedToken.minCt,
        max: decodedToken.maxCt,
      });
      setTotalPriceRange({
        min: decodedToken.minAmount,
        max: decodedToken.maxAmount,
      });
      setDepthRange({ min: decodedToken.minDepth, max: decodedToken.maxDepth });
      setTableRange({ min: decodedToken.minTable, max: decodedToken.maxTable });
      setRadioRange({ min: decodedToken.minRatio, max: decodedToken.maxRatio });
      setLengthRange({
        min: decodedToken.minLength,
        max: decodedToken.maxLength,
      });
      setWidthRange({ min: decodedToken.minWidth, max: decodedToken.maxWidth });
      setDepthMMRange({
        min: decodedToken.minDepthmm,
        max: decodedToken.maxDepthmm,
      });
      setIsNatural(decodedToken.IsNatural);
      setIsLabGrown(decodedToken.IsLabgrown);
    }
  }, [query]);

  useEffect(() => {
    dispatch(setTotalPages(data?.result?.totalPages || 0));
  }, [data?.result?.totalPages, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartCount(userId));
    }
  }, [userId]);

  const handleAddToCart = (diamond, shouldShowToast) => {
    if (!userId) {
      showToast.warning("Please log in to add items to the cart.");
      return;
    }

    const cartItem = {
      SKU: diamond.SKU,
      Quantity: 1,
    };

    dispatch(addToCart(cartItem, userId, shouldShowToast));
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (perPage) => {
    if (typeof perPage === "number") {
      dispatch(setItemsPerPage(perPage));
    }
    setAnchorEl(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };
  // Filter api fetch

  // Total price and p/ct section
  const [tabValue, setTabValue] = useState(0);
  const [isAmount, setIsAmount] = useState(true);
  const [isPrice, setIsPrice] = useState(false);
  const [isNatural, setIsNatural] = useState(false);
  const [islabGrown, setIsLabGrown] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);

    // Toggle boolean values based on selected tab
    if (newValue === 0) {
      setIsAmount(true);
      setIsPrice(false);
    } else {
      setIsAmount(false);
      setIsPrice(true);
    }
  };
  const [diamondType, setDiamondType] = useState("0");

  const handleTypeChange = (event, newValue) => {
    setDiamondType(`${newValue}`);
    // Toggle boolean values based on selected tab
    if (newValue === 0) {
      setIsNatural(true);
      setIsLabGrown(false);
    } else {
      setIsNatural(false);
      setIsLabGrown(true);
    }
    resetAll(true);
  };

  const icon = [
    { icon: "", name: "Round", value: "RBC" },
    { icon: "", name: "Oval", value: "Oval" },
    { icon: "", name: "Pear", value: "Pear" },
    // { icon: "", name: "Cush Mod", value: "" },
    // { icon: "", name: "Cush Brill", value: "" },
    { icon: "", name: "Emerald", value: "Emerald" },
    { icon: "", name: "Radiant", value: "Radiant" },
    { icon: "", name: "Princess", value: "Princess" },
    // { icon: "", name: "Asscher", value: "" },
    // { icon: "", name: "Square", value: "" },
    { icon: "", name: "Marquise", value: "Marquise" },
    { icon: "", name: "Heart", value: "Heart" },
    // { icon: "", name: "Trilliant", value: "" },
    // { icon: "", name: "Euro Cut", value: "" },
    // { icon: "", name: "Old Miner", value: "" },
    // { icon: "", name: "Briolette", value: "" },
    // { icon: "", name: "Rose Cut", value: "" },
    // { icon: "", name: "Lozenge", value: "" },
    { icon: "", name: "Baguette", value: "BUG" },
    // { icon: "", name: "Tap Bag", value: "" },
    // { icon: "", name: "Half Moon", value: "" },
    // { icon: "", name: "Flanders", value: "" },
    // { icon: "", name: "Trapezoid", value: "" },
    // { icon: "", name: "Bullets", value: "" },
    { icon: "", name: "Kite", value: "KITE" },
    // { icon: "", name: "Shield", value: "" },
    // { icon: "", name: "Star", value: "" },
    // { icon: "", name: "Pentagonal", value: "" },
    // { icon: "", name: "Hexagonal", value: "" },
    // { icon: "", name: "Octagonal", value: "" },
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

  const color = [
    { name: "D" },
    { name: "E" },
    { name: "E+" },
    { name: "F" },
    { name: "F+" },
    { name: "G" },
    { name: "G+" },
    { name: "H" },
    { name: "H+" },
    { name: "I" },
    { name: "I+" },
    { name: "J" },
    { name: "J+" },
    { name: "K" },
    { name: "K+" },
    { name: "L" },
    { name: "M" },
    { name: "N" },
    { name: "O" },
    { name: "P" },
    { name: "Q" },
    { name: "R" },
    { name: "S" },
    { name: "T" },
    { name: "U" },
    { name: "V" },
    { name: "W" },
    { name: "X" },
    { name: "Y" },
    { name: "Z" },
  ];

  const milky = [
    { name: "M0" },
    { name: "M1" },
    { name: "M2" },
    { name: "NON" },
  ];

  const tinge = [
    { name: "LBR" },
    { name: "MIX" },
    { name: "NO" },
    { name: "NON" },
    { name: "NV" },
    { name: "OT" },
    { name: "VLB" },
    { name: "VLBY" },
    { name: "VLYB" },
    { name: "VVLB" },
  ];

  const heart = [{ name: "3X" }, { name: "3VG+" }];

  const cut = [
    { name: "Ideal", value: "ID" },
    { name: "Excellent", value: "EX" },
    { name: "Very Good", value: "VG" },
    { name: "Very Good+", value: "VG+" },
    { name: "Good", value: "GD" },
    // { name: "Fair", value:""},
    // { name: "Poor", value:""},
  ];

  const polish = [
    // { name: "Excellent" },
    // { name: "Very Good" },
    // { name: "Good" },
    // { name: "Fair" },
    // { name: "Poor" },
    { name: "Ideal", value: "ID" },
    { name: "Excellent", value: "EX" },
    { name: "Very Good", value: "VG" },
    { name: "Very Good+", value: "VG+" },
    { name: "Good", value: "GD" },
  ];
  const symmetry = [
    // { name: "Ideal" },
    // { name: "Excellent" },
    // { name: "Very Good" },
    // { name: "Good" },
    // { name: "Fair" },
    // { name: "Poor" },
    // { name: "Ideal",value:"ID" },
    { name: "Excellent", value: "EX" },
    { name: "Very Good", value: "VG" },
    // { name: "Very Good+", value:"VG+"},
    { name: "Good", value: "GD" },
  ];

  const labheart = [{ name: "8X" }, { name: "3X+" }, { name: "3VG+" }];
  const labcut = [
    { name: "8X" },
    { name: "EX/Ideal" },
    { name: "Very Good" },
    { name: "Good" },
    { name: "Fair" },
    { name: "Poor" },
  ];
  const labpolish = [
    { name: "8X" },
    { name: "EX/Ideal" },
    { name: "Very Good" },
    { name: "Good" },
    { name: "Fair" },
    { name: "Poor" },
  ];
  const labsymmetry = [
    { name: "8X" },
    { name: "EX/Ideal" },
    { name: "Very Good" },
    { name: "Good" },
    { name: "Fair" },
    { name: "Poor" },
  ];
  const fluorescence = [
    { name: "None", value: "NON" },
    { name: "Faint", value: "FNT" },
    { name: "Medium", value: "MED" },
    { name: "Strong", value: "STG" },
    { name: "V Strong", value: "VST" },
  ];
  const lab = [
    { name: "GIA" },
    { name: "IGI" },
    { name: "HRD" },
    { name: "Other" },
    { name: "None" },
  ];
  const labgrownlab = [
    { name: "IGI" },
    { name: "GIA" },
    { name: "GCAL" },
    { name: "Other" },
    { name: "None" },
  ];

  // icons selection array

  const [shape, setShape] = useState([]);

  const toggleShape = (name) => {
    setShape((prevShapes) =>
      prevShapes.includes(name)
        ? prevShapes.filter((s) => s !== name)
        : [...prevShapes, name]
    );
  };

  // clarity selection array
  const [selectedClarity, setSelectedClarity] = useState([]);

  const toggleClarity = (name) => {
    setSelectedClarity((prevClarity) =>
      prevClarity.includes(name)
        ? prevClarity.filter((c) => c !== name)
        : [...prevClarity, name]
    );
  };
  // Color selection array
  const [selectedColor, setSelectedColor] = useState([]);

  const toggleColor = (name) => {
    setSelectedColor((prevColor) =>
      prevColor.includes(name)
        ? prevColor.filter((c) => c !== name)
        : [...prevColor, name]
    );
  };

  //Milky selection array
  const [selectedMilky, setSelectedMilky] = useState([]);

  const toggleMilky = (name) => {
    setSelectedMilky((prevMilky) =>
      prevMilky.includes(name)
        ? prevMilky.filter((c) => c !== name)
        : [...prevMilky, name]
    );
  };

  //Tinge selection array
  const [selectedTinge, setSelectedTinge] = useState([]);

  const toggleTinge = (name) => {
    setSelectedTinge((prevTinge) =>
      prevTinge.includes(name)
        ? prevTinge.filter((c) => c !== name)
        : [...prevTinge, name]
    );
  };

  // Hearts and Arrows selection array
  const [selectedHeart, setSelectedHeart] = useState([]);

  const toggleSelection = (name) => {
    setSelectedHeart((prevHeart) =>
      prevHeart.includes(name)
        ? prevHeart.filter((c) => c !== name)
        : [...prevHeart, name]
    );
  };

  // cut, polish and symmetry selection array
  const [selectedCut, setSelectedCut] = useState([]);
  const [selectedPolish, setSelectedPolish] = useState([]);
  const [selectedSymmetry, setSelectedSymmetry] = useState([]);

  const toggleCut = (name) => {
    setSelectedCut((prevCut) =>
      prevCut.includes(name)
        ? prevCut.filter((item) => item !== name)
        : [...prevCut, name]
    );
  };
  const togglePolish = (name) => {
    setSelectedPolish((prevPolish) =>
      prevPolish.includes(name)
        ? prevPolish.filter((item) => item !== name)
        : [...prevPolish, name]
    );
  };
  const toggleSymmetry = (name) => {
    setSelectedSymmetry((prevSymmetry) =>
      prevSymmetry.includes(name)
        ? prevSymmetry.filter((item) => item !== name)
        : [...prevSymmetry, name]
    );
  };

  // fluroescene lab selection array
  const [selectedFluroescene, setSelectedFluroescene] = useState([]);
  const [selectedLab, setSelectedLab] = useState([]);

  const toggleFluroescene = (name) => {
    setSelectedFluroescene((prevFluroescene) =>
      prevFluroescene.includes(name)
        ? prevFluroescene.filter((item) => item !== name)
        : [...prevFluroescene, name]
    );
  };
  const toggleLab = (name) => {
    setSelectedLab((prevLab) =>
      prevLab.includes(name)
        ? prevLab.filter((item) => item !== name)
        : [...prevLab, name]
    );
  };

  // Show only checkboxes
  const [filters, setFilters] = useState({
    media: false,
    available: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const [clarityCheckbox, setClarityCheckbox] = useState({
    eyeClean: false,
    clarityEnhanced: false,
    drill: false,
  });

  const handleClarityCheckbox = (event) => {
    const { name, checked } = event.target;
    setClarityCheckbox((prevClarityCheckbox) => ({
      ...prevClarityCheckbox,
      [name]: checked,
    }));
  };
  const [heartandarrowCheckbox, setHeartAndArrowCheckbox] = useState({
    heartandarrow: false,
  });

  const handleHeartCheckbox = (event) => {
    const { name, checked } = event.target;
    setHeartAndArrowCheckbox((prevHeartCheckbox) => ({
      ...prevHeartCheckbox,
      [name]: checked,
    }));
  };
  // Growth type checkbox
  const [growthtypeCheckbox, setGrowthTypeCheckbox] = useState({
    cvd: false,
    hpht: false,
    others: false,
  });

  const handleGrowthTypeCheckbox = (event) => {
    const { name, checked } = event.target;
    setGrowthTypeCheckbox((prevGrowthTypeCheckbox) => ({
      ...prevGrowthTypeCheckbox,
      [name]: checked,
    }));
  };
  // Treatment checkbox
  const [treatmentCheckbox, setTreatmentCheckbox] = useState({
    asGrown: false,
    treated: false,
    unknown: false,
  });

  const handleTreatmentCheckbox = (event) => {
    const { name, checked } = event.target;
    setTreatmentCheckbox((prevTreamentCheckbox) => ({
      ...prevTreamentCheckbox,
      [name]: checked,
    }));
  };

  // carat textinput
  const [caratRange, setCaratRange] = useState({
    min: "",
    max: "",
  });

  const handleCaratChange = (event) => {
    const { name, value } = event.target;

    // Allow only numbers with up to 3 decimal places
    if (/^\d*\.?\d{0,3}$/.test(value) || value === "") {
      setCaratRange((prevRange) => ({
        ...prevRange,
        [name]: value,
      }));
    }
  };

  // Total price textinput
  const [totalPriceRange, setTotalPriceRange] = useState({
    min: "",
    max: "",
  });

  const handlePriceChange = (event) => {
    let { name, value } = event.target;

    value = value.replace(/[^0-9.]/g, "");

    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setTotalPriceRange((prevRange) => ({
        ...prevRange,
        [name]: value,
      }));
    }
  };

  const handlePriceBlur = (event) => {
    let { name, value } = event.target;

    if (value !== "" && !isNaN(value)) {
      setTotalPriceRange((prevRange) => ({
        ...prevRange,
        [name]: parseFloat(value).toFixed(2),
      }));
    }
  };

  // Depth textinput
  const [depthRange, setDepthRange] = useState({
    min: "",
    max: "",
  });

  const handleDepthChange = (event) => {
    const { name, value } = event.target;

    // Allow only numbers with up to 3 decimal places
    if (/^\d*\.?\d{0,3}$/.test(value) || value === "") {
      setDepthRange((prevRange) => ({
        ...prevRange,
        [name]: value,
      }));
    }
  };

  // Table textinput
  const [tableRange, setTableRange] = useState({
    min: "",
    max: "",
  });

  const handleTableChange = (event) => {
    const { name, value } = event.target;

    // Allow only numbers with up to 3 decimal places
    if (/^\d*\.?\d{0,3}$/.test(value) || value === "") {
      setTableRange((prevRange) => ({
        ...prevRange,
        [name]: value,
      }));
    }
  };

  // Radio Textinput
  const [radioRange, setRadioRange] = useState({
    min: "",
    max: "",
  });

  const handleRadioChange = (event) => {
    const { name, value } = event.target;

    // Allow only numbers with up to 3 decimal places
    if (/^\d*\.?\d{0,3}$/.test(value) || value === "") {
      setRadioRange((prevRange) => ({
        ...prevRange,
        [name]: value,
      }));
    }
  };

  //length textinput
  const [lengthrange, setLengthRange] = useState({
    min: "",
    max: "",
  });

  const handleLengthChange = (event) => {
    const { name, value } = event.target;

    // Allow only numbers with up to 3 decimal places
    if (/^\d*\.?\d{0,3}$/.test(value) || value === "") {
      setLengthRange((prevRange) => ({
        ...prevRange,
        [name]: value,
      }));
    }
  };
  // width textinput
  const [widthrange, setWidthRange] = useState({
    min: "",
    max: "",
  });

  const handleWidthChange = (event) => {
    const { name, value } = event.target;

    // Allow only numbers with up to 3 decimal places
    if (/^\d*\.?\d{0,3}$/.test(value) || value === "") {
      setWidthRange((prevRange) => ({
        ...prevRange,
        [name]: value,
      }));
    }
  };

  // depth MM textinput
  const [depthmmrange, setDepthMMRange] = useState({
    min: "",
    max: "",
  });

  const handleDepthMMChange = (event) => {
    const { name, value } = event.target;

    // Allow only numbers with up to 3 decimal places
    if (/^\d*\.?\d{0,3}$/.test(value) || value === "") {
      setDepthMMRange((prevRange) => ({
        ...prevRange,
        [name]: value,
      }));
    }
  };

  const resetAll = (isTabChange = false) => {
    setShape([]);
    setSelectedClarity([]);
    setSelectedColor([]);
    setSelectedHeart([]);
    setSelectedCut([]);
    setSelectedPolish([]);
    setSelectedSymmetry([]);
    setSelectedFluroescene([]);
    setSelectedLab([]);
    setSelectedMilky([]);
    setSelectedTinge([]);
    setFilters({
      media: false,
      available: false,
    });
    setClarityCheckbox({
      eyeClean: false,
      clarityEnhanced: false,
      drill: false,
    });
    setHeartAndArrowCheckbox({
      heartandarrow: false,
    });
    setGrowthTypeCheckbox({
      cvd: false,
      hpht: false,
      others: false,
    });
    setTreatmentCheckbox({
      asGrown: false,
      treated: false,
      unknown: false,
    });
    setCaratRange({
      min: "",
      max: "",
    });
    setTotalPriceRange({
      min: "",
      max: "",
    });
    setDepthRange({
      min: "",
      max: "",
    });
    setTableRange({
      min: "",
      max: "",
    });
    setRadioRange({
      min: "",
      max: "",
    });
    setLengthRange({
      min: "",
      max: "",
    });
    setWidthRange({
      min: "",
      max: "",
    });
    setDepthMMRange({
      min: "",
      max: "",
    });

    if (!isTabChange) {
      localStorage.removeItem("filterToken");
      setSearchParams({ q: "filter" });
      setFilterData(undefined);
    }
  };

  const [showfilter, setShowfilter] = useState(false);
  const applyFilter = () => {
    const payload = {
      Shape: shape,
      minCt: caratRange.min,
      maxCt: caratRange.max,
      Color: selectedColor,
      Clarity: selectedClarity,
      Milky: selectedMilky,
      Tinge: selectedTinge,
      Cut: selectedCut,
      Polish: selectedPolish,
      Symm: selectedSymmetry,
      FluoInt: selectedFluroescene,
      Lab: selectedLab,
      minDepth: depthRange.min,
      maxDepth: depthRange.max,
      minTable: tableRange.min,
      maxTable: tableRange.max,
      minRatio: radioRange.min,
      maxRatio: radioRange.max,
      minLength: lengthrange.min,
      maxLength: lengthrange.max,
      minWidth: widthrange.min,
      maxWidth: widthrange.max,
      minDepthmm: depthmmrange.min,
      maxDepthmm: depthmmrange.max,
      isAmount: isAmount,
      isPrice: isPrice,
      minAmount: isAmount ? totalPriceRange.min : null,
      maxAmount: isAmount ? totalPriceRange.max : null,
      minPrice: isPrice ? totalPriceRange.min : null,
      maxPrice: isPrice ? totalPriceRange.max : null,
      IsNatural: diamondType == 0,
      IsLabgrown: diamondType == 1,
    };

    setFilterData(payload);

    const filterToken = createUnsignedJWT(payload);
    localStorage.setItem("filterToken", JSON.stringify(filterToken));
    setSearchParams({ q: filterToken });
  };

  if (isLoading) return <DiamondLoader />;
  if (error) return <p className="error">{error.message}</p>;

  return (
    <>
      {query === "filter" ? (
        // <div className="container my-lg-5 my-4">
        <div className="" style={{ padding: "30px" }}>
          <div className="bg-box mb-3">
            <div className="jps-measurements row">
              <div className="col-md-6 col-12">
                <div item>
                  <Tabs
                    value={diamondType}
                    onChange={handleTypeChange}
                    aria-label="price tabs"
                    sx={{
                      minHeight: "40px",
                      "& .MuiTab-root": {
                        minWidth: "auto",
                        textTransform: "none",
                      },
                    }}
                  >
                    <Tab
                      label={
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          className="natural-diamond"
                        >
                          Natural Diamonds
                        </Typography>
                      }
                      value={"0"}
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
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          className="lab-grown-diamond"
                        >
                          Lab-Grown Diamonds
                        </Typography>
                      }
                      value={"1"}
                      sx={{
                        px: 2,
                        outline: "none !important",
                        "&:focus": { outline: "none" },
                        "&.Mui-selected:focus": { outline: "none" },
                        "&.Mui-focusVisible": { outline: "none" },
                      }}
                    />
                  </Tabs>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="jps-measur-box">
                  <div
                    item
                    className="reset-buttons"
                    style={{ marginLeft: "auto" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => resetAll(false)}
                      className="reset-btn"
                    >
                      Reset All
                    </Button>
                    <Button
                      variant="contained"
                      className="ml-2 apply-filter apply-btn"
                      onClick={applyFilter}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-box mb-3 pb-0">
            <div className="jps-measurements row">
              <div className="col-md-12 col-12 mb-3">
                <div item>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ textAlign: "left" }}
                  >
                    Shape
                  </Typography>
                </div>

                <Grid item xs={12}>
                  <Grid
                    container
                    spacing={1}
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(80px, 1fr))",
                      gap: "8px",
                      mt: 1,
                    }}
                    className="jps-icons"
                  >
                    {icon.map((value) => (
                      <Grid
                        key={value.name}
                        item
                        onClick={() => toggleShape(value.value)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          border: shape.includes(value.value)
                            ? "1px solid #1976D2"
                            : "1px solid #ccc",
                          borderRadius: "5px",
                          height: "115px",
                          width: "100%",
                          fontSize: "12px",
                          fontWeight: "500",
                          padding: 0,
                          cursor: "pointer",
                          backgroundColor: shape.includes(value.value)
                            ? "#1976D250"
                            : "#fff",
                          color: "#000",
                          transition: "background-color 0.3s",
                        }}
                      >
                        <div className="jps-icon">{value.icon}</div>
                        {value.name}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>

          <div className="bg-box mb-3 pb-0">
            <div className="jps-measurements row">
              <div className="col-md-6 col-12 mb-3">
                <div item>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ textAlign: "left" }}
                  >
                    Clarity
                  </Typography>
                </div>
                <div item>
                  <div className="jps-lab-box">
                    {clarity.map((value) => (
                      <Grid
                        key={value.name}
                        item
                        onClick={() => toggleClarity(value.name)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          border: selectedClarity.includes(value.name)
                            ? "1px solid #1976D2"
                            : "1px solid #ccc",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          padding: 0,
                          cursor: "pointer",
                          backgroundColor: selectedClarity.includes(value.name)
                            ? "#1976D250"
                            : "#fff",
                          color: "#000",
                          transition: "background-color 0.3s",
                        }}
                      >
                        {value.name}
                      </Grid>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div item>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ textAlign: "left" }}
                  >
                    Colors
                  </Typography>
                </div>

                <div item>
                  <div className="jps-lab-box">
                    {color.map((value) => (
                      <Grid
                        key={value.name}
                        item
                        onClick={() => toggleColor(value.name)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          border: selectedColor.includes(value.name)
                            ? "1px solid #1976D2"
                            : "1px solid #ccc",
                          borderRadius: "4px",
                          // height: "50px",
                          // width: "100%",
                          fontSize: "12px",
                          fontWeight: "500",
                          padding: 0,
                          cursor: "pointer",
                          backgroundColor: selectedColor.includes(value.name)
                            ? "#1976D250"
                            : "#fff",
                          color: "#000",
                          transition: "background-color 0.3s",
                        }}
                      >
                        {value.name}
                      </Grid>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-box mb-3 pb-0">
            <div className="jps-measurements row">
              <div className="col-md-6 col-12 mb-3">
                <div item>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ textAlign: "left" }}
                  >
                    Milky
                  </Typography>
                </div>

                <div item>
                  <div className="jps-lab-box">
                    {milky.map((value) => (
                      <Grid
                        key={value.name}
                        item
                        onClick={() => toggleMilky(value.name)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          border: selectedMilky.includes(value.name)
                            ? "1px solid #1976D2"
                            : "1px solid #ccc",
                          borderRadius: "4px",
                          // height: "50px",
                          // width: "100%",
                          fontSize: "12px",
                          fontWeight: "500",
                          padding: 0,
                          cursor: "pointer",
                          backgroundColor: selectedMilky.includes(value.name)
                            ? "#1976D250"
                            : "#fff",
                          color: "#000",
                          transition: "background-color 0.3s",
                        }}
                      >
                        {value.name}
                      </Grid>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div item>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ textAlign: "left" }}
                  >
                    Tinge
                  </Typography>
                </div>

                <div item>
                  <div className="jps-lab-box">
                    {tinge.map((value) => (
                      <Grid
                        key={value.name}
                        item
                        onClick={() => toggleTinge(value.name)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          border: selectedTinge.includes(value.name)
                            ? "1px solid #1976D2"
                            : "1px solid #ccc",
                          borderRadius: "4px",
                          // height: "50px",
                          // width: "100%",
                          fontSize: "12px",
                          fontWeight: "500",
                          padding: 0,
                          cursor: "pointer",
                          backgroundColor: selectedTinge.includes(value.name)
                            ? "#1976D250"
                            : "#fff",
                          color: "#000",
                          transition: "background-color 0.3s",
                        }}
                      >
                        {value.name}
                      </Grid>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-12">
              <div className="bg-box mb-3 pb-0">
                <div className="jps-measurements row">
                  <div className="col-md-12 col-12 ">
                    <div item>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ textAlign: "left" }}
                      >
                        Cut, Polish, Symmetry
                      </Typography>
                    </div>
                  </div>
                  <div className="col-md-12 col-12 mb-3">
                    <div item>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ textAlign: "left" }}
                      >
                        Cut
                      </Typography>
                    </div>
                    <div item>
                      <div className="jps-lab-box">
                        {(diamondType === "0" ? cut : labcut).map((value) => (
                          <Grid
                            key={value.name}
                            item
                            onClick={() => toggleCut(value.value)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              border: selectedCut.includes(value.value)
                                ? "1px solid #1976D2"
                                : "1px solid #ccc",
                              borderRadius: "4px",
                              // height: "50px",
                              // width: "100%",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                              backgroundColor: selectedCut.includes(value.value)
                                ? "#1976D250"
                                : "#fff",
                              color: "#000",
                              transition: "background-color 0.3s",
                            }}
                          >
                            {value?.name || ""}
                          </Grid>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-12 mb-3">
                    <div item>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ textAlign: "left" }}
                      >
                        Polish
                      </Typography>
                    </div>
                    <div item>
                      <div className="jps-lab-box">
                        {(diamondType === "0" ? polish : labpolish).map(
                          (value) => (
                            <Grid
                              key={value.name}
                              item
                              onClick={() => togglePolish(value.value)}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                border: selectedPolish.includes(value.value)
                                  ? "1px solid #1976D2"
                                  : "1px solid #ccc",
                                borderRadius: "4px",
                                // height: "50px",
                                // width: "100%",
                                fontSize: "12px",
                                fontWeight: "500",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: selectedPolish.includes(
                                  value.value
                                )
                                  ? "#1976D250"
                                  : "#fff",
                                color: "#000",
                                transition: "background-color 0.3s",
                              }}
                            >
                              {value?.name || ""}
                            </Grid>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-12 mb-3">
                    <div item>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ textAlign: "left" }}
                      >
                        Symmetry
                      </Typography>
                    </div>
                    <div item>
                      <div className="jps-lab-box">
                        {(diamondType === "0" ? symmetry : labsymmetry).map(
                          (value) => (
                            <Grid
                              key={value.name}
                              item
                              onClick={() => toggleSymmetry(value.value)}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                border: selectedSymmetry.includes(value.value)
                                  ? "1px solid #1976D2"
                                  : "1px solid #ccc",
                                borderRadius: "4px",
                                // height: "50px",
                                // width: "100%",
                                fontSize: "12px",
                                fontWeight: "500",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: selectedSymmetry.includes(
                                  value.value
                                )
                                  ? "#1976D250"
                                  : "#fff",
                                color: "#000",
                                transition: "background-color 0.3s",
                              }}
                            >
                              {value?.name || ""}
                            </Grid>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 mb-3">
              <div className="bg-box mb-2 pb-0">
                <div className="jps-measurements row">
                  <div className="col-md-6 col-12 mb-3">
                    <div item>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ textAlign: "left" }}
                      >
                        Fluorescence
                      </Typography>
                    </div>
                    <div item>
                      <div className="jps-lab-box">
                        {fluorescence.map((value) => (
                          <Grid
                            key={value.name}
                            item
                            onClick={() => toggleFluroescene(value.value)}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              border: selectedFluroescene.includes(value.value)
                                ? "1px solid #1976D2"
                                : "1px solid #ccc",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "500",
                              padding: 0,
                              cursor: "pointer",
                              backgroundColor: selectedFluroescene.includes(
                                value.value
                              )
                                ? "#1976D250"
                                : "#fff",
                              color: "#000",
                              transition: "background-color 0.3s",
                            }}
                          >
                            {value?.name || ""}
                          </Grid>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-3">
                    <div item>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ textAlign: "left" }}
                      >
                        Lab
                      </Typography>
                    </div>
                    <div item>
                      <div className="jps-lab-box">
                        {(diamondType === "0" ? lab : labgrownlab).map(
                          (value) => (
                            <Grid
                              key={value.name}
                              item
                              onClick={() => toggleLab(value.name)}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                border: selectedLab.includes(value.name)
                                  ? "1px solid #1976D2"
                                  : "1px solid #ccc",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "500",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: selectedLab.includes(
                                  value.name
                                )
                                  ? "#1976D250"
                                  : "#fff",
                                color: "#000",
                                transition: "background-color 0.3s",
                              }}
                            >
                              {value?.name || ""}
                            </Grid>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-box">
                <div className="row">
                  <div className="col-lg-6 col-md-12 col-12 mb-2">
                    <div item>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ textAlign: "left" }}
                      >
                        Carat
                      </Typography>
                    </div>

                    <div
                      className="jps-measur-box"
                      style={{ marginTop: "39px" }}
                    >
                      <div item>
                        <TextInput
                          label={"Min, ct"}
                          name="min"
                          type="number"
                          value={caratRange?.min}
                          onChange={handleCaratChange}
                          customBg={true}
                        />
                      </div>

                      <div item>
                        <i class="fa-solid fa-chevron-right"></i>
                      </div>

                      <div item>
                        <TextInput
                          label={"Max, ct"}
                          name="max"
                          type="number"
                          value={caratRange?.max}
                          onChange={handleCaratChange}
                          customBg={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-12 mb-2">
                    <div item>
                      <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        aria-label="price tabs"
                        sx={{
                          minHeight: "40px",
                          "& .MuiTab-root": {
                            minWidth: "auto",
                            textTransform: "none",
                          },
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
                              Price per carat
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
                    </div>

                    <div className="jps-measurements row">
                      <div className=" col-md-12 col-12">
                        <div className="jps-measur-box">
                          <div item>
                            <TextInput
                              label={"Min, $"}
                              name="min"
                              type="text"
                              value={
                                totalPriceRange?.min !== ""
                                  ? `$${totalPriceRange?.min}`
                                  : ""
                              }
                              onChange={handlePriceChange}
                              onBlur={handlePriceBlur}
                              customBg={true}
                            />
                          </div>

                          <div item>
                            <i class="fa-solid fa-chevron-right"></i>
                          </div>

                          <div item>
                            <TextInput
                              label={"Max, $"}
                              name="max"
                              type="text"
                              value={
                                totalPriceRange.max
                                  ? `$${totalPriceRange.max}`
                                  : ""
                              }
                              onChange={handlePriceChange}
                              onBlur={handlePriceBlur}
                              customBg={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {diamondType !== "0" && (
            <div className="bg-box mb-3 pb-0">
              <div className="jps-measurements row">
                <div className="col-md-6 col-12 mb-3">
                  <div item>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ textAlign: "left" }}
                    >
                      Growth Type
                    </Typography>
                  </div>
                  <div className="row ml-2">
                    <div item style={{ textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={growthtypeCheckbox.cvd}
                            onChange={handleGrowthTypeCheckbox}
                            name="cvd"
                          />
                        }
                        label="CVD"
                      />
                    </div>
                    <div item style={{ textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={growthtypeCheckbox.hpht}
                            onChange={handleGrowthTypeCheckbox}
                            name="hpht"
                          />
                        }
                        label="HPHT"
                      />
                    </div>
                    <div item style={{ textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={growthtypeCheckbox.others}
                            onChange={handleGrowthTypeCheckbox}
                            name="others"
                          />
                        }
                        label="Others"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="bg-box">
            <div item xs={12}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "left" }}
              >
                Measurements
              </Typography>
            </div>
            <div className="jps-measurements row">
              <div className="col-md-4 col-12">
                <div className="jps-measur-box">
                  <div item>
                    <TextInput
                      label={"Depth, Min, %"}
                      name="min"
                      type="number"
                      value={depthRange?.min}
                      onChange={handleDepthChange}
                      customBg={true}
                    />
                  </div>

                  <div item>
                    <i class="fa-solid fa-chevron-right"></i>
                  </div>

                  <div item>
                    <TextInput
                      label={"Depth, Max, %"}
                      name="max"
                      type="number"
                      value={depthRange.max}
                      onChange={handleDepthChange}
                      customBg={true}
                    />
                  </div>
                </div>
                <div className="jps-measur-box">
                  <div item>
                    <TextInput
                      label={"Length, Min, mm"}
                      name="min"
                      type="number"
                      value={lengthrange?.min}
                      onChange={handleLengthChange}
                      customBg={true}
                    />
                  </div>

                  <div item>
                    <i class="fa-solid fa-chevron-right"></i>
                  </div>

                  <div item>
                    <TextInput
                      label={"Length, Max, mm"}
                      name="max"
                      type="number"
                      value={lengthrange?.max}
                      onChange={handleLengthChange}
                      customBg={true}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-12">
                <div className="jps-measur-box">
                  <div item>
                    <TextInput
                      label={"Table, Min, %"}
                      name="min"
                      type="number"
                      value={tableRange?.min}
                      onChange={handleTableChange}
                      customBg={true}
                    />
                  </div>

                  <div item>
                    <i class="fa-solid fa-chevron-right"></i>
                  </div>

                  <div item>
                    <TextInput
                      label={"Table, Max, %"}
                      name="max"
                      type="number"
                      value={tableRange?.max}
                      onChange={handleTableChange}
                      customBg={true}
                    />
                  </div>
                </div>

                <div className="jps-measur-box">
                  <div item>
                    <TextInput
                      label={"Width, Min, mm"}
                      name="min"
                      type="number"
                      value={widthrange?.min}
                      onChange={handleWidthChange}
                      customBg={true}
                    />
                  </div>

                  <div item>
                    <i class="fa-solid fa-chevron-right"></i>
                  </div>

                  <div item>
                    <TextInput
                      label={"Width, Max, mm"}
                      name="max"
                      type="number"
                      value={widthrange?.max}
                      onChange={handleWidthChange}
                      customBg={true}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="jps-measur-box">
                  <div item>
                    <TextInput
                      label={"Radio, Min"}
                      name="min"
                      type="number"
                      value={radioRange?.min}
                      onChange={handleRadioChange}
                      customBg={true}
                    />
                  </div>

                  <div item>
                    <i class="fa-solid fa-chevron-right"></i>
                  </div>

                  <div item>
                    <TextInput
                      label={"Radio, Max"}
                      name="max"
                      type="number"
                      value={radioRange?.max}
                      onChange={handleRadioChange}
                      customBg={true}
                    />
                  </div>
                </div>

                <div className="jps-measur-box">
                  <div item>
                    <TextInput
                      label={"Depth, Min, mm"}
                      name="min"
                      type="number"
                      value={depthmmrange?.min}
                      onChange={handleDepthMMChange}
                      customBg={true}
                    />
                  </div>

                  <div item>
                    <i class="fa-solid fa-chevron-right"></i>
                  </div>

                  <div item>
                    <TextInput
                      label={"Depth, Max, mm"}
                      name="max"
                      type="number"
                      value={depthmmrange?.max}
                      onChange={handleDepthMMChange}
                      customBg={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="" style={{ padding: "50px" }}>
          <div className="bg-box mb-3">
            <div className="jps-measurements row">
              <div className="col-md-12 col-12">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Modify Filter Button */}
                  {!showfilter ? (
                    <Button
                      variant="contained"
                      onClick={() => setShowfilter(true)}
                      className="reset-btn"
                    >
                      <i
                        className="fa-solid fa-sliders"
                        style={{ color: "black", marginRight: "8px" }}
                      ></i>{" "}
                      Modify filter
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setShowfilter(false)}
                      className="reset-btn"
                    >
                      <i
                        className="fa-solid fa-sliders"
                        style={{ color: "black", marginRight: "8px" }}
                      ></i>{" "}
                      Hide filter
                    </Button>
                  )}

                  {/* Show Filter Data Beside Button */}
                  {filteredData.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        padding: "10px",
                        textAlign: "left",
                        gap: "20px", // Space between columns
                        marginLeft: "10px", // Space from button
                      }}
                    >
                      {/* Left Column */}
                      {leftColumn.map((item) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                          }}
                        >
                          {item.map(([key, value]) => (
                            <div
                              key={key}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <strong
                                style={{
                                  //   minWidth: "80px",
                                  //   textAlign: "right",
                                  marginRight: "10px",
                                }}
                              >
                                {key}:
                              </strong>
                              <span>
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : value.toString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {showfilter && (
              // <div className="col-md-12 col-12">
              //   <div className="bg-box mb-3">
              //     <div className="jps-measurements row">
              //       <div className="col-md-6 col-12">
              //         <div item>
              //           <Tabs
              //             value={diamondType}
              //             onChange={handleTypeChange}
              //             aria-label="price tabs"
              //             sx={{
              //               minHeight: "40px",
              //               "& .MuiTab-root": {
              //                 minWidth: "auto",
              //                 textTransform: "none",
              //               },
              //             }}
              //           >
              //             <Tab
              //               label={
              //                 <Typography
              //                   variant="body1"
              //                   fontWeight="bold"
              //                   className="natural-diamond"
              //                 >
              //                   Natural Diamonds
              //                 </Typography>
              //               }
              //               value={"0"}
              //               sx={{
              //                 px: 2,
              //                 outline: "none !important",
              //                 "&:focus": { outline: "none" },
              //                 "&.Mui-selected:focus": { outline: "none" },
              //                 "&.Mui-focusVisible": { outline: "none" },
              //               }}
              //             />
              //             <Tab
              //               label={
              //                 <Typography
              //                   variant="body1"
              //                   fontWeight="bold"
              //                   className="lab-grown-diamond"
              //                 >
              //                   Lab-Grown Diamonds
              //                 </Typography>
              //               }
              //               value={"1"}
              //               sx={{
              //                 px: 2,
              //                 outline: "none !important",
              //                 "&:focus": { outline: "none" },
              //                 "&.Mui-selected:focus": { outline: "none" },
              //                 "&.Mui-focusVisible": { outline: "none" },
              //               }}
              //             />
              //           </Tabs>
              //         </div>
              //       </div>
              //       <div className="col-md-6 col-12">
              //         <div className="jps-measur-box">
              //           <div
              //             item
              //             className="reset-buttons"
              //             style={{ marginLeft: "auto" }}
              //           >
              //             <Button
              //               variant="contained"
              //               onClick={() => resetAll(false)}
              //               className="reset-btn"
              //             >
              //               Reset All
              //             </Button>
              //             <Button
              //               variant="contained"
              //               className="ml-2 apply-filter apply-btn"
              //               onClick={applyFilter}
              //             >
              //               Apply Filter
              //             </Button>
              //           </div>
              //         </div>
              //       </div>
              //     </div>
              //   </div>

              //   <div className="bg-box mb-3 pb-0">
              //     <div className="jps-measurements row">
              //       <div className="col-md-12 col-12 mb-3">
              //         <div item>
              //           <Typography
              //             variant="body1"
              //             fontWeight="bold"
              //             sx={{ textAlign: "left" }}
              //           >
              //             Shape
              //           </Typography>
              //         </div>

              //         <Grid item xs={12}>
              //           <Grid
              //             container
              //             spacing={1}
              //             sx={{
              //               display: "grid",
              //               gridTemplateColumns:
              //                 "repeat(auto-fill, minmax(80px, 1fr))",
              //               gap: "8px",
              //               mt: 1,
              //             }}
              //             className="jps-icons"
              //           >
              //             {icon.map((value) => (
              //               <Grid
              //                 key={value.name}
              //                 item
              //                 onClick={() => toggleShape(value.value)}
              //                 sx={{
              //                   display: "flex",
              //                   flexDirection: "column",
              //                   alignItems: "center",
              //                   justifyContent: "center",
              //                   textAlign: "center",
              //                   border: shape.includes(value.value)
              //                     ? "1px solid #1976D2"
              //                     : "1px solid #ccc",
              //                   borderRadius: "5px",
              //                   height: "115px",
              //                   width: "100%",
              //                   fontSize: "12px",
              //                   fontWeight: "500",
              //                   padding: 0,
              //                   cursor: "pointer",
              //                   backgroundColor: shape.includes(value.value)
              //                     ? "#1976D250"
              //                     : "#fff",
              //                   color: "#000",
              //                   transition: "background-color 0.3s",
              //                 }}
              //               >
              //                 <div className="jps-icon">{value.icon}</div>
              //                 {value.name}
              //               </Grid>
              //             ))}
              //           </Grid>
              //         </Grid>
              //       </div>
              //     </div>
              //   </div>

              //   <div className="bg-box mb-3 pb-0">
              //     <div className="jps-measurements row">
              //       <div className="col-md-6 col-12 mb-3">
              //         <div item>
              //           <Typography
              //             variant="body1"
              //             fontWeight="bold"
              //             sx={{ textAlign: "left" }}
              //           >
              //             Clarity
              //           </Typography>
              //         </div>

              //         <div item>
              //           <div className="jps-lab-box">
              //             {clarity.map((value) => (
              //               <Grid
              //                 key={value.name}
              //                 item
              //                 onClick={() => toggleClarity(value.name)}
              //                 sx={{
              //                   display: "flex",
              //                   flexDirection: "column",
              //                   alignItems: "center",
              //                   justifyContent: "center",
              //                   textAlign: "center",
              //                   border: selectedClarity.includes(value.name)
              //                     ? "1px solid #1976D2"
              //                     : "1px solid #ccc",
              //                   borderRadius: "4px",
              //                   // height: "50px",
              //                   // width: "100%",
              //                   fontSize: "12px",
              //                   fontWeight: "500",
              //                   padding: 0,
              //                   cursor: "pointer",
              //                   backgroundColor: selectedClarity.includes(
              //                     value.name
              //                   )
              //                     ? "#1976D250"
              //                     : "#fff",
              //                   color: "#000",
              //                   transition: "background-color 0.3s",
              //                 }}
              //               >
              //                 {value.name}
              //               </Grid>
              //             ))}
              //           </div>
              //         </div>
              //       </div>
              //       <div className="col-md-6 col-12 mb-3">
              //         <div item>
              //           <Typography
              //             variant="body1"
              //             fontWeight="bold"
              //             sx={{ textAlign: "left" }}
              //           >
              //             Colors
              //           </Typography>
              //         </div>

              //         <div item>
              //           <div className="jps-lab-box">
              //             {color.map((value) => (
              //               <Grid
              //                 key={value.name}
              //                 item
              //                 onClick={() => toggleColor(value.name)}
              //                 sx={{
              //                   display: "flex",
              //                   flexDirection: "column",
              //                   alignItems: "center",
              //                   justifyContent: "center",
              //                   textAlign: "center",
              //                   border: selectedColor.includes(value.name)
              //                     ? "1px solid #1976D2"
              //                     : "1px solid #ccc",
              //                   borderRadius: "4px",
              //                   // height: "50px",
              //                   // width: "100%",
              //                   fontSize: "12px",
              //                   fontWeight: "500",
              //                   padding: 0,
              //                   cursor: "pointer",
              //                   backgroundColor: selectedColor.includes(
              //                     value.name
              //                   )
              //                     ? "#1976D250"
              //                     : "#fff",
              //                   color: "#000",
              //                   transition: "background-color 0.3s",
              //                 }}
              //               >
              //                 {value.name}
              //               </Grid>
              //             ))}
              //           </div>
              //         </div>
              //       </div>
              //     </div>
              //   </div>

              //   <div className="bg-box mb-3 pb-0">
              //     <div className="jps-measurements row">
              //       <div className="col-md-6 col-12 mb-3">
              //         <div item>
              //           <Typography
              //             variant="body1"
              //             fontWeight="bold"
              //             sx={{ textAlign: "left" }}
              //           >
              //             Milky
              //           </Typography>
              //         </div>

              //         <div item>
              //           <div className="jps-lab-box">
              //             {milky.map((value) => (
              //               <Grid
              //                 key={value.name}
              //                 item
              //                 onClick={() => toggleMilky(value.name)}
              //                 sx={{
              //                   display: "flex",
              //                   flexDirection: "column",
              //                   alignItems: "center",
              //                   justifyContent: "center",
              //                   textAlign: "center",
              //                   border: selectedMilky.includes(value.name)
              //                     ? "1px solid #1976D2"
              //                     : "1px solid #ccc",
              //                   borderRadius: "4px",
              //                   // height: "50px",
              //                   // width: "100%",
              //                   fontSize: "12px",
              //                   fontWeight: "500",
              //                   padding: 0,
              //                   cursor: "pointer",
              //                   backgroundColor: selectedMilky.includes(
              //                     value.name
              //                   )
              //                     ? "#1976D250"
              //                     : "#fff",
              //                   color: "#000",
              //                   transition: "background-color 0.3s",
              //                 }}
              //               >
              //                 {value.name}
              //               </Grid>
              //             ))}
              //           </div>
              //         </div>
              //       </div>
              //       <div className="col-md-6 col-12 mb-3">
              //         <div item>
              //           <Typography
              //             variant="body1"
              //             fontWeight="bold"
              //             sx={{ textAlign: "left" }}
              //           >
              //             Tinge
              //           </Typography>
              //         </div>

              //         <div item>
              //           <div className="jps-lab-box">
              //             {tinge.map((value) => (
              //               <Grid
              //                 key={value.name}
              //                 item
              //                 onClick={() => toggleTinge(value.name)}
              //                 sx={{
              //                   display: "flex",
              //                   flexDirection: "column",
              //                   alignItems: "center",
              //                   justifyContent: "center",
              //                   textAlign: "center",
              //                   border: selectedTinge.includes(value.name)
              //                     ? "1px solid #1976D2"
              //                     : "1px solid #ccc",
              //                   borderRadius: "4px",
              //                   // height: "50px",
              //                   // width: "100%",
              //                   fontSize: "12px",
              //                   fontWeight: "500",
              //                   padding: 0,
              //                   cursor: "pointer",
              //                   backgroundColor: selectedTinge.includes(
              //                     value.name
              //                   )
              //                     ? "#1976D250"
              //                     : "#fff",
              //                   color: "#000",
              //                   transition: "background-color 0.3s",
              //                 }}
              //               >
              //                 {value.name}
              //               </Grid>
              //             ))}
              //           </div>
              //         </div>
              //       </div>
              //     </div>
              //   </div>

              //   <div className="row">
              //     <div className="col-md-6 col-12 mb-3">
              //       <div className="bg-box mb-3 pb-0">
              //         <div className="jps-measurements row">
              //           <div className="col-md-12 col-12 ">
              //             <div item>
              //               <Typography
              //                 variant="body1"
              //                 fontWeight="bold"
              //                 sx={{ textAlign: "left" }}
              //               >
              //                 Cut, Polish, Symmetry
              //               </Typography>
              //             </div>
              //           </div>
              //           <div className="col-md-12 col-12 mb-3">
              //             <div item>
              //               <Typography
              //                 variant="body1"
              //                 fontWeight="bold"
              //                 sx={{ textAlign: "left" }}
              //               >
              //                 Cut
              //               </Typography>
              //             </div>
              //             <div item>
              //               <div className="jps-lab-box">
              //                 {(diamondType === "0" ? cut : labcut).map(
              //                   (value) => (
              //                     <Grid
              //                       key={value.name}
              //                       item
              //                       onClick={() => toggleCut(value.value)}
              //                       sx={{
              //                         display: "flex",
              //                         alignItems: "center",
              //                         justifyContent: "center",
              //                         textAlign: "center",
              //                         border: selectedCut.includes(value.value)
              //                           ? "1px solid #1976D2"
              //                           : "1px solid #ccc",
              //                         borderRadius: "4px",
              //                         // height: "50px",
              //                         // width: "100%",
              //                         fontSize: "12px",
              //                         fontWeight: "500",
              //                         cursor: "pointer",
              //                         backgroundColor: selectedCut.includes(
              //                           value.value
              //                         )
              //                           ? "#1976D250"
              //                           : "#fff",
              //                         color: "#000",
              //                         transition: "background-color 0.3s",
              //                       }}
              //                     >
              //                       {value?.name || ""}
              //                     </Grid>
              //                   )
              //                 )}
              //               </div>
              //             </div>
              //           </div>
              //           <div className="col-md-12 col-12 mb-3">
              //             <div item>
              //               <Typography
              //                 variant="body1"
              //                 fontWeight="bold"
              //                 sx={{ textAlign: "left" }}
              //               >
              //                 Polish
              //               </Typography>
              //             </div>
              //             <div item>
              //               <div className="jps-lab-box">
              //                 {(diamondType === "0" ? polish : labpolish).map(
              //                   (value) => (
              //                     <Grid
              //                       key={value.name}
              //                       item
              //                       onClick={() => togglePolish(value.value)}
              //                       sx={{
              //                         display: "flex",
              //                         flexDirection: "column",
              //                         alignItems: "center",
              //                         justifyContent: "center",
              //                         textAlign: "center",
              //                         border: selectedPolish.includes(
              //                           value.value
              //                         )
              //                           ? "1px solid #1976D2"
              //                           : "1px solid #ccc",
              //                         borderRadius: "4px",
              //                         // height: "50px",
              //                         // width: "100%",
              //                         fontSize: "12px",
              //                         fontWeight: "500",
              //                         padding: 0,
              //                         cursor: "pointer",
              //                         backgroundColor: selectedPolish.includes(
              //                           value.value
              //                         )
              //                           ? "#1976D250"
              //                           : "#fff",
              //                         color: "#000",
              //                         transition: "background-color 0.3s",
              //                       }}
              //                     >
              //                       {value?.name || ""}
              //                     </Grid>
              //                   )
              //                 )}
              //               </div>
              //             </div>
              //           </div>
              //           <div className="col-md-12 col-12 mb-3">
              //             <div item>
              //               <Typography
              //                 variant="body1"
              //                 fontWeight="bold"
              //                 sx={{ textAlign: "left" }}
              //               >
              //                 Symmetry
              //               </Typography>
              //             </div>
              //             <div item>
              //               <div className="jps-lab-box">
              //                 {(diamondType === "0"
              //                   ? symmetry
              //                   : labsymmetry
              //                 ).map((value) => (
              //                   <Grid
              //                     key={value.name}
              //                     item
              //                     onClick={() => toggleSymmetry(value.value)}
              //                     sx={{
              //                       display: "flex",
              //                       flexDirection: "column",
              //                       alignItems: "center",
              //                       justifyContent: "center",
              //                       textAlign: "center",
              //                       border: selectedSymmetry.includes(
              //                         value.value
              //                       )
              //                         ? "1px solid #1976D2"
              //                         : "1px solid #ccc",
              //                       borderRadius: "4px",
              //                       // height: "50px",
              //                       // width: "100%",
              //                       fontSize: "12px",
              //                       fontWeight: "500",
              //                       padding: 0,
              //                       cursor: "pointer",
              //                       backgroundColor: selectedSymmetry.includes(
              //                         value.value
              //                       )
              //                         ? "#1976D250"
              //                         : "#fff",
              //                       color: "#000",
              //                       transition: "background-color 0.3s",
              //                     }}
              //                   >
              //                     {value?.name || ""}
              //                   </Grid>
              //                 ))}
              //               </div>
              //             </div>
              //           </div>
              //         </div>
              //       </div>
              //     </div>
              //     <div className="col-md-6 col-12 mb-3">
              //       <div className="bg-box mb-2 pb-0">
              //         <div className="jps-measurements row">
              //           <div className="col-md-6 col-12 mb-3">
              //             <div item>
              //               <Typography
              //                 variant="body1"
              //                 fontWeight="bold"
              //                 sx={{ textAlign: "left" }}
              //               >
              //                 Fluorescence
              //               </Typography>
              //             </div>
              //             <div item>
              //               <div className="jps-lab-box">
              //                 {fluorescence.map((value) => (
              //                   <Grid
              //                     key={value.name}
              //                     item
              //                     onClick={() => toggleFluroescene(value.value)}
              //                     sx={{
              //                       display: "flex",
              //                       flexDirection: "column",
              //                       alignItems: "center",
              //                       justifyContent: "center",
              //                       textAlign: "center",
              //                       border: selectedFluroescene.includes(
              //                         value.value
              //                       )
              //                         ? "1px solid #1976D2"
              //                         : "1px solid #ccc",
              //                       borderRadius: "4px",
              //                       fontSize: "12px",
              //                       fontWeight: "500",
              //                       padding: 0,
              //                       cursor: "pointer",
              //                       backgroundColor:
              //                         selectedFluroescene.includes(value.value)
              //                           ? "#1976D250"
              //                           : "#fff",
              //                       color: "#000",
              //                       transition: "background-color 0.3s",
              //                     }}
              //                   >
              //                     {value?.name || ""}
              //                   </Grid>
              //                 ))}
              //               </div>
              //             </div>
              //           </div>

              //           <div className="col-md-6 col-12 mb-3">
              //             <div item>
              //               <Typography
              //                 variant="body1"
              //                 fontWeight="bold"
              //                 sx={{ textAlign: "left" }}
              //               >
              //                 Lab
              //               </Typography>
              //             </div>
              //             <div item>
              //               <div className="jps-lab-box">
              //                 {(diamondType === "0" ? lab : labgrownlab).map(
              //                   (value) => (
              //                     <Grid
              //                       key={value.name}
              //                       item
              //                       onClick={() => toggleLab(value.name)}
              //                       sx={{
              //                         display: "flex",
              //                         flexDirection: "column",
              //                         alignItems: "center",
              //                         justifyContent: "center",
              //                         textAlign: "center",
              //                         border: selectedLab.includes(value.name)
              //                           ? "1px solid #1976D2"
              //                           : "1px solid #ccc",
              //                         borderRadius: "4px",
              //                         fontSize: "12px",
              //                         fontWeight: "500",
              //                         padding: 0,
              //                         cursor: "pointer",
              //                         backgroundColor: selectedLab.includes(
              //                           value.name
              //                         )
              //                           ? "#1976D250"
              //                           : "#fff",
              //                         color: "#000",
              //                         transition: "background-color 0.3s",
              //                       }}
              //                     >
              //                       {value?.name || ""}
              //                     </Grid>
              //                   )
              //                 )}
              //               </div>
              //             </div>
              //           </div>
              //         </div>
              //       </div>
              //       <div className="bg-box mb-2">
              //         <div className="row">
              //           <div className=" col-md-12 col-12">
              //             <div item>
              //               <Typography
              //                 variant="body1"
              //                 fontWeight="bold"
              //                 sx={{ textAlign: "left" }}
              //               >
              //                 Caret
              //               </Typography>
              //             </div>

              //             <div
              //               className="jps-measur-box"
              //               // style={{ marginTop: "39px" }}
              //             >
              //               <div item>
              //                 <TextInput
              //                   label={"Min, ct"}
              //                   name="min"
              //                   type="number"
              //                   value={caratRange?.min}
              //                   onChange={handleCaratChange}
              //                   customBg={true}
              //                 />
              //               </div>

              //               <div item>
              //                 <i class="fa-solid fa-chevron-right"></i>
              //               </div>

              //               <div item>
              //                 <TextInput
              //                   label={"Max, ct"}
              //                   name="max"
              //                   type="number"
              //                   value={caratRange?.max}
              //                   onChange={handleCaratChange}
              //                   customBg={true}
              //                 />
              //               </div>
              //             </div>
              //           </div>
              //         </div>
              //       </div>
              //       <div className="bg-box mb-2">
              //         <div className="row">
              //           <div className="col-md-12 col-12">
              //             <div item>
              //               <Tabs
              //                 value={tabValue}
              //                 onChange={handleChange}
              //                 aria-label="price tabs"
              //                 sx={{
              //                   minHeight: "40px",
              //                   "& .MuiTab-root": {
              //                     minWidth: "auto",
              //                     textTransform: "none",
              //                   },
              //                 }}
              //               >
              //                 <Tab
              //                   label={
              //                     <Typography variant="body1" fontWeight="bold">
              //                       Total Price
              //                     </Typography>
              //                   }
              //                   sx={{
              //                     px: 2,
              //                     outline: "none !important",
              //                     "&:focus": { outline: "none" },
              //                     "&.Mui-selected:focus": { outline: "none" },
              //                     "&.Mui-focusVisible": { outline: "none" },
              //                   }}
              //                 />
              //                 <Tab
              //                   label={
              //                     <Typography variant="body1" fontWeight="bold">
              //                       P/ct
              //                     </Typography>
              //                   }
              //                   sx={{
              //                     px: 2,
              //                     outline: "none !important",
              //                     "&:focus": { outline: "none" },
              //                     "&.Mui-selected:focus": { outline: "none" },
              //                     "&.Mui-focusVisible": { outline: "none" },
              //                   }}
              //                 />
              //               </Tabs>
              //             </div>

              //             <div className="jps-measurements row">
              //               <div className=" col-md-12 col-12">
              //                 <div className="jps-measur-box">
              //                   <div item>
              //                     <TextInput
              //                       label={"Min, $"}
              //                       name="min"
              //                       type="text"
              //                       value={
              //                         totalPriceRange?.min !== ""
              //                           ? `$${totalPriceRange?.min}`
              //                           : ""
              //                       }
              //                       onChange={handlePriceChange}
              //                       onBlur={handlePriceBlur}
              //                       customBg={true}
              //                     />
              //                   </div>

              //                   <div item>
              //                     <i class="fa-solid fa-chevron-right"></i>
              //                   </div>

              //                   <div item>
              //                     <TextInput
              //                       label={"Max, $"}
              //                       name="max"
              //                       type="text"
              //                       value={
              //                         totalPriceRange.max
              //                           ? `$${totalPriceRange.max}`
              //                           : ""
              //                       }
              //                       onChange={handlePriceChange}
              //                       onBlur={handlePriceBlur}
              //                       customBg={true}
              //                     />
              //                   </div>
              //                 </div>
              //               </div>
              //             </div>
              //           </div>
              //         </div>
              //       </div>
              //     </div>
              //   </div>

              //   {diamondType !== "0" && (
              //     <div className="bg-box mb-3 pb-0">
              //       <div className="jps-measurements row">
              //         <div className="col-md-6 col-12 mb-3">
              //           <div item>
              //             <Typography
              //               variant="body1"
              //               fontWeight="bold"
              //               sx={{ textAlign: "left" }}
              //             >
              //               Growth Type
              //             </Typography>
              //           </div>
              //           <div className="row ml-2">
              //             <div item style={{ textAlign: "left" }}>
              //               <FormControlLabel
              //                 control={
              //                   <Checkbox
              //                     checked={growthtypeCheckbox.cvd}
              //                     onChange={handleGrowthTypeCheckbox}
              //                     name="cvd"
              //                   />
              //                 }
              //                 label="CVD"
              //               />
              //             </div>
              //             <div item style={{ textAlign: "left" }}>
              //               <FormControlLabel
              //                 control={
              //                   <Checkbox
              //                     checked={growthtypeCheckbox.hpht}
              //                     onChange={handleGrowthTypeCheckbox}
              //                     name="hpht"
              //                   />
              //                 }
              //                 label="HPHT"
              //               />
              //             </div>
              //             <div item style={{ textAlign: "left" }}>
              //               <FormControlLabel
              //                 control={
              //                   <Checkbox
              //                     checked={growthtypeCheckbox.others}
              //                     onChange={handleGrowthTypeCheckbox}
              //                     name="others"
              //                   />
              //                 }
              //                 label="Others"
              //               />
              //             </div>
              //           </div>
              //         </div>
              //       </div>
              //     </div>
              //   )}
              //   <div className="bg-box">
              //     <div item xs={12}>
              //       <Typography
              //         variant="body1"
              //         fontWeight="bold"
              //         sx={{ textAlign: "left" }}
              //       >
              //         Measurements
              //       </Typography>
              //     </div>
              //     <div className="jps-measurements row">
              //       <div className="col-md-6 col-12">
              //         <div className="jps-measur-box">
              //           <div item>
              //             <TextInput
              //               label={"Depth, Min, %"}
              //               name="min"
              //               type="number"
              //               value={depthRange?.min}
              //               onChange={handleDepthChange}
              //               customBg={true}
              //             />
              //           </div>

              //           <div item>
              //             <i class="fa-solid fa-chevron-right"></i>
              //           </div>

              //           <div item>
              //             <TextInput
              //               label={"Depth, Max, %"}
              //               name="max"
              //               type="number"
              //               value={depthRange?.max}
              //               onChange={handleDepthChange}
              //               customBg={true}
              //             />
              //           </div>
              //         </div>
              //         <div className="jps-measur-box">
              //           <div item>
              //             <TextInput
              //               label={"Length, Min, mm"}
              //               name="min"
              //               type="number"
              //               value={lengthrange?.min}
              //               onChange={handleLengthChange}
              //               customBg={true}
              //             />
              //           </div>

              //           <div item>
              //             <i class="fa-solid fa-chevron-right"></i>
              //           </div>

              //           <div item>
              //             <TextInput
              //               label={"Length, Max, mm"}
              //               name="max"
              //               type="number"
              //               value={lengthrange?.max}
              //               onChange={handleLengthChange}
              //               customBg={true}
              //             />
              //           </div>
              //         </div>
              //         <div className="jps-measur-box">
              //           <div item>
              //             <TextInput
              //               label={"Table, Min, %"}
              //               name="min"
              //               type="number"
              //               value={tableRange?.min}
              //               onChange={handleTableChange}
              //               customBg={true}
              //             />
              //           </div>

              //           <div item>
              //             <i class="fa-solid fa-chevron-right"></i>
              //           </div>

              //           <div item>
              //             <TextInput
              //               label={"Table, Max, %"}
              //               name="max"
              //               type="number"
              //               value={tableRange?.max}
              //               onChange={handleTableChange}
              //               customBg={true}
              //             />
              //           </div>
              //         </div>
              //       </div>

              //       <div className="col-md-6 col-12">
              //         <div className="jps-measur-box">
              //           <div item>
              //             <TextInput
              //               label={"Width, Min, mm"}
              //               name="min"
              //               type="number"
              //               value={widthrange?.min}
              //               onChange={handleWidthChange}
              //               customBg={true}
              //             />
              //           </div>

              //           <div item>
              //             <i class="fa-solid fa-chevron-right"></i>
              //           </div>

              //           <div item>
              //             <TextInput
              //               label={"Width, Max, mm"}
              //               name="max"
              //               type="number"
              //               value={widthrange?.max}
              //               onChange={handleWidthChange}
              //               customBg={true}
              //             />
              //           </div>
              //         </div>
              //         <div className="jps-measur-box">
              //           <div item>
              //             <TextInput
              //               label={"Radio, Min"}
              //               name="min"
              //               type="number"
              //               value={radioRange?.min}
              //               onChange={handleRadioChange}
              //               customBg={true}
              //             />
              //           </div>

              //           <div item>
              //             <i class="fa-solid fa-chevron-right"></i>
              //           </div>

              //           <div item>
              //             <TextInput
              //               label={"Radio, Max"}
              //               name="max"
              //               type="number"
              //               value={radioRange?.max}
              //               onChange={handleRadioChange}
              //               customBg={true}
              //             />
              //           </div>
              //         </div>

              //         <div className="jps-measur-box">
              //           <div item>
              //             <TextInput
              //               label={"Depth, Min, mm"}
              //               name="min"
              //               type="number"
              //               value={depthmmrange?.min}
              //               onChange={handleDepthMMChange}
              //               customBg={true}
              //             />
              //           </div>

              //           <div item>
              //             <i class="fa-solid fa-chevron-right"></i>
              //           </div>

              //           <div item>
              //             <TextInput
              //               label={"Depth, Max, mm"}
              //               name="max"
              //               type="number"
              //               value={depthmmrange?.max}
              //               onChange={handleDepthMMChange}
              //               customBg={true}
              //             />
              //           </div>
              //         </div>
              //       </div>
              //     </div>
              //   </div>
              // </div>
              <div className="col-md-12 col-12">
                <div className="bg-box mb-3">
                  <div className="jps-measurements row">
                    <div className="col-md-6 col-12">
                      <div item>
                        <Tabs
                          value={diamondType}
                          onChange={handleTypeChange}
                          aria-label="price tabs"
                          sx={{
                            minHeight: "40px",
                            "& .MuiTab-root": {
                              minWidth: "auto",
                              textTransform: "none",
                            },
                          }}
                        >
                          <Tab
                            label={
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                className="natural-diamond"
                              >
                                Natural Diamonds
                              </Typography>
                            }
                            value={"0"}
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
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                className="lab-grown-diamond"
                              >
                                Lab-Grown Diamonds
                              </Typography>
                            }
                            value={"1"}
                            sx={{
                              px: 2,
                              outline: "none !important",
                              "&:focus": { outline: "none" },
                              "&.Mui-selected:focus": { outline: "none" },
                              "&.Mui-focusVisible": { outline: "none" },
                            }}
                          />
                        </Tabs>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="jps-measur-box">
                        <div
                          item
                          className="reset-buttons"
                          style={{ marginLeft: "auto" }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => resetAll(false)}
                            className="reset-btn"
                          >
                            Reset All
                          </Button>
                          <Button
                            variant="contained"
                            className="ml-2 apply-filter apply-btn"
                            onClick={() => {
                              applyFilter();
                              setShowfilter(false);
                            }}
                          >
                            Apply Filter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-box mb-3 pb-0">
                  <div className="jps-measurements row">
                    <div className="col-md-12 col-12 mb-3">
                      <div item>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ textAlign: "left" }}
                        >
                          Shape
                        </Typography>
                      </div>

                      <Grid item xs={12}>
                        <Grid
                          container
                          spacing={1}
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(80px, 1fr))",
                            gap: "8px",
                            mt: 1,
                          }}
                          className="jps-icons"
                        >
                          {icon.map((value) => (
                            <Grid
                              key={value.name}
                              item
                              onClick={() => toggleShape(value.value)}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                border: shape.includes(value.value)
                                  ? "1px solid #1976D2"
                                  : "1px solid #ccc",
                                borderRadius: "5px",
                                height: "115px",
                                width: "100%",
                                fontSize: "12px",
                                fontWeight: "500",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: shape.includes(value.value)
                                  ? "#1976D250"
                                  : "#fff",
                                color: "#000",
                                transition: "background-color 0.3s",
                              }}
                            >
                              <div className="jps-icon">{value.icon}</div>
                              {value.name}
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </div>

                <div className="bg-box mb-3 pb-0">
                  <div className="jps-measurements row">
                    <div className="col-md-6 col-12 mb-3">
                      <div item>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ textAlign: "left" }}
                        >
                          Clarity
                        </Typography>
                      </div>
                      <div item>
                        <div className="jps-lab-box">
                          {clarity.map((value) => (
                            <Grid
                              key={value.name}
                              item
                              onClick={() => toggleClarity(value.name)}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                border: selectedClarity.includes(value.name)
                                  ? "1px solid #1976D2"
                                  : "1px solid #ccc",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "500",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: selectedClarity.includes(
                                  value.name
                                )
                                  ? "#1976D250"
                                  : "#fff",
                                color: "#000",
                                transition: "background-color 0.3s",
                              }}
                            >
                              {value.name}
                            </Grid>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                      <div item>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ textAlign: "left" }}
                        >
                          Colors
                        </Typography>
                      </div>

                      <div item>
                        <div className="jps-lab-box">
                          {color.map((value) => (
                            <Grid
                              key={value.name}
                              item
                              onClick={() => toggleColor(value.name)}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                border: selectedColor.includes(value.name)
                                  ? "1px solid #1976D2"
                                  : "1px solid #ccc",
                                borderRadius: "4px",
                                // height: "50px",
                                // width: "100%",
                                fontSize: "12px",
                                fontWeight: "500",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: selectedColor.includes(
                                  value.name
                                )
                                  ? "#1976D250"
                                  : "#fff",
                                color: "#000",
                                transition: "background-color 0.3s",
                              }}
                            >
                              {value.name}
                            </Grid>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-box mb-3 pb-0">
                  <div className="jps-measurements row">
                    <div className="col-md-6 col-12 mb-3">
                      <div item>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ textAlign: "left" }}
                        >
                          Milky
                        </Typography>
                      </div>

                      <div item>
                        <div className="jps-lab-box">
                          {milky.map((value) => (
                            <Grid
                              key={value.name}
                              item
                              onClick={() => toggleMilky(value.name)}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                border: selectedMilky.includes(value.name)
                                  ? "1px solid #1976D2"
                                  : "1px solid #ccc",
                                borderRadius: "4px",
                                // height: "50px",
                                // width: "100%",
                                fontSize: "12px",
                                fontWeight: "500",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: selectedMilky.includes(
                                  value.name
                                )
                                  ? "#1976D250"
                                  : "#fff",
                                color: "#000",
                                transition: "background-color 0.3s",
                              }}
                            >
                              {value.name}
                            </Grid>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                      <div item>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ textAlign: "left" }}
                        >
                          Tinge
                        </Typography>
                      </div>

                      <div item>
                        <div className="jps-lab-box">
                          {tinge.map((value) => (
                            <Grid
                              key={value.name}
                              item
                              onClick={() => toggleTinge(value.name)}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                border: selectedTinge.includes(value.name)
                                  ? "1px solid #1976D2"
                                  : "1px solid #ccc",
                                borderRadius: "4px",
                                // height: "50px",
                                // width: "100%",
                                fontSize: "12px",
                                fontWeight: "500",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: selectedTinge.includes(
                                  value.name
                                )
                                  ? "#1976D250"
                                  : "#fff",
                                color: "#000",
                                transition: "background-color 0.3s",
                              }}
                            >
                              {value.name}
                            </Grid>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-12 mb-3">
                    <div className="bg-box mb-3 pb-0">
                      <div className="jps-measurements row">
                        <div className="col-md-12 col-12 ">
                          <div item>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ textAlign: "left" }}
                            >
                              Cut, Polish, Symmetry
                            </Typography>
                          </div>
                        </div>
                        <div className="col-md-12 col-12 mb-3">
                          <div item>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ textAlign: "left" }}
                            >
                              Cut
                            </Typography>
                          </div>
                          <div item>
                            <div className="jps-lab-box">
                              {(diamondType === "0" ? cut : labcut).map(
                                (value) => (
                                  <Grid
                                    key={value.name}
                                    item
                                    onClick={() => toggleCut(value.value)}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      textAlign: "center",
                                      border: selectedCut.includes(value.value)
                                        ? "1px solid #1976D2"
                                        : "1px solid #ccc",
                                      borderRadius: "4px",
                                      // height: "50px",
                                      // width: "100%",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                      cursor: "pointer",
                                      backgroundColor: selectedCut.includes(
                                        value.value
                                      )
                                        ? "#1976D250"
                                        : "#fff",
                                      color: "#000",
                                      transition: "background-color 0.3s",
                                    }}
                                  >
                                    {value?.name || ""}
                                  </Grid>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-12 mb-3">
                          <div item>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ textAlign: "left" }}
                            >
                              Polish
                            </Typography>
                          </div>
                          <div item>
                            <div className="jps-lab-box">
                              {(diamondType === "0" ? polish : labpolish).map(
                                (value) => (
                                  <Grid
                                    key={value.name}
                                    item
                                    onClick={() => togglePolish(value.value)}
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      textAlign: "center",
                                      border: selectedPolish.includes(
                                        value.value
                                      )
                                        ? "1px solid #1976D2"
                                        : "1px solid #ccc",
                                      borderRadius: "4px",
                                      // height: "50px",
                                      // width: "100%",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                      padding: 0,
                                      cursor: "pointer",
                                      backgroundColor: selectedPolish.includes(
                                        value.value
                                      )
                                        ? "#1976D250"
                                        : "#fff",
                                      color: "#000",
                                      transition: "background-color 0.3s",
                                    }}
                                  >
                                    {value?.name || ""}
                                  </Grid>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-12 mb-3">
                          <div item>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ textAlign: "left" }}
                            >
                              Symmetry
                            </Typography>
                          </div>
                          <div item>
                            <div className="jps-lab-box">
                              {(diamondType === "0"
                                ? symmetry
                                : labsymmetry
                              ).map((value) => (
                                <Grid
                                  key={value.name}
                                  item
                                  onClick={() => toggleSymmetry(value.value)}
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    border: selectedSymmetry.includes(
                                      value.value
                                    )
                                      ? "1px solid #1976D2"
                                      : "1px solid #ccc",
                                    borderRadius: "4px",
                                    // height: "50px",
                                    // width: "100%",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    padding: 0,
                                    cursor: "pointer",
                                    backgroundColor: selectedSymmetry.includes(
                                      value.value
                                    )
                                      ? "#1976D250"
                                      : "#fff",
                                    color: "#000",
                                    transition: "background-color 0.3s",
                                  }}
                                >
                                  {value?.name || ""}
                                </Grid>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 mb-3">
                    <div className="bg-box mb-2 pb-0">
                      <div className="jps-measurements row">
                        <div className="col-md-6 col-12 mb-3">
                          <div item>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ textAlign: "left" }}
                            >
                              Fluorescence
                            </Typography>
                          </div>
                          <div item>
                            <div className="jps-lab-box">
                              {fluorescence.map((value) => (
                                <Grid
                                  key={value.name}
                                  item
                                  onClick={() => toggleFluroescene(value.value)}
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    border: selectedFluroescene.includes(
                                      value.value
                                    )
                                      ? "1px solid #1976D2"
                                      : "1px solid #ccc",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    padding: 0,
                                    cursor: "pointer",
                                    backgroundColor:
                                      selectedFluroescene.includes(value.value)
                                        ? "#1976D250"
                                        : "#fff",
                                    color: "#000",
                                    transition: "background-color 0.3s",
                                  }}
                                >
                                  {value?.name || ""}
                                </Grid>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 col-12 mb-3">
                          <div item>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ textAlign: "left" }}
                            >
                              Lab
                            </Typography>
                          </div>
                          <div item>
                            <div className="jps-lab-box">
                              {(diamondType === "0" ? lab : labgrownlab).map(
                                (value) => (
                                  <Grid
                                    key={value.name}
                                    item
                                    onClick={() => toggleLab(value.name)}
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      textAlign: "center",
                                      border: selectedLab.includes(value.name)
                                        ? "1px solid #1976D2"
                                        : "1px solid #ccc",
                                      borderRadius: "4px",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                      padding: 0,
                                      cursor: "pointer",
                                      backgroundColor: selectedLab.includes(
                                        value.name
                                      )
                                        ? "#1976D250"
                                        : "#fff",
                                      color: "#000",
                                      transition: "background-color 0.3s",
                                    }}
                                  >
                                    {value?.name || ""}
                                  </Grid>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-box mb-2">
                      <div className="row">
                        <div className="col-lg-6 col-md-12 col-12 mb-3">
                          <div item>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ textAlign: "left" }}
                            >
                              Carat
                            </Typography>
                          </div>

                          <div
                            className="jps-measur-box"
                            style={{ marginTop: "39px" }}
                          >
                            <div item>
                              <TextInput
                                label={"Min, ct"}
                                name="min"
                                type="number"
                                value={caratRange?.min}
                                onChange={handleCaratChange}
                                customBg={true}
                              />
                            </div>

                            <div item>
                              <i class="fa-solid fa-chevron-right"></i>
                            </div>

                            <div item>
                              <TextInput
                                label={"Max, ct"}
                                name="max"
                                type="number"
                                value={caratRange?.max}
                                onChange={handleCaratChange}
                                customBg={true}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-12 mb-3">
                          <div item>
                            <Tabs
                              value={tabValue}
                              onChange={handleChange}
                              aria-label="price tabs"
                              sx={{
                                minHeight: "40px",
                                "& .MuiTab-root": {
                                  minWidth: "auto",
                                  textTransform: "none",
                                },
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
                          </div>

                          <div className="jps-measurements row">
                            <div className=" col-md-12 col-12">
                              <div className="jps-measur-box">
                                <div item>
                                  <TextInput
                                    label={"Min, $"}
                                    name="min"
                                    type="text"
                                    value={
                                      totalPriceRange?.min !== ""
                                        ? `$${totalPriceRange?.min}`
                                        : ""
                                    }
                                    onChange={handlePriceChange}
                                    onBlur={handlePriceBlur}
                                    customBg={true}
                                  />
                                </div>

                                <div item>
                                  <i class="fa-solid fa-chevron-right"></i>
                                </div>

                                <div item>
                                  <TextInput
                                    label={"Max, $"}
                                    name="max"
                                    type="text"
                                    value={
                                      totalPriceRange.max
                                        ? `$${totalPriceRange.max}`
                                        : ""
                                    }
                                    onChange={handlePriceChange}
                                    onBlur={handlePriceBlur}
                                    customBg={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {diamondType !== "0" && (
                  <div className="bg-box mb-3 pb-0">
                    <div className="jps-measurements row">
                      <div className="col-md-6 col-12 mb-3">
                        <div item>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ textAlign: "left" }}
                          >
                            Growth Type
                          </Typography>
                        </div>
                        <div className="row ml-2">
                          <div item style={{ textAlign: "left" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={growthtypeCheckbox.cvd}
                                  onChange={handleGrowthTypeCheckbox}
                                  name="cvd"
                                />
                              }
                              label="CVD"
                            />
                          </div>
                          <div item style={{ textAlign: "left" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={growthtypeCheckbox.hpht}
                                  onChange={handleGrowthTypeCheckbox}
                                  name="hpht"
                                />
                              }
                              label="HPHT"
                            />
                          </div>
                          <div item style={{ textAlign: "left" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={growthtypeCheckbox.others}
                                  onChange={handleGrowthTypeCheckbox}
                                  name="others"
                                />
                              }
                              label="Others"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-box">
                  <div item xs={12}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ textAlign: "left" }}
                    >
                      Measurements
                    </Typography>
                  </div>
                  <div className="jps-measurements row">
                    <div className="col-md-4 col-12">
                      <div className="jps-measur-box">
                        <div item>
                          <TextInput
                            label={"Depth, Min, %"}
                            name="min"
                            type="number"
                            value={depthRange?.min}
                            onChange={handleDepthChange}
                            customBg={true}
                          />
                        </div>

                        <div item>
                          <i class="fa-solid fa-chevron-right"></i>
                        </div>

                        <div item>
                          <TextInput
                            label={"Depth, Max, %"}
                            name="max"
                            type="number"
                            value={depthRange.max}
                            onChange={handleDepthChange}
                            customBg={true}
                          />
                        </div>
                      </div>
                      <div className="jps-measur-box">
                        <div item>
                          <TextInput
                            label={"Length, Min, mm"}
                            name="min"
                            type="number"
                            value={lengthrange?.min}
                            onChange={handleLengthChange}
                            customBg={true}
                          />
                        </div>

                        <div item>
                          <i class="fa-solid fa-chevron-right"></i>
                        </div>

                        <div item>
                          <TextInput
                            label={"Length, Max, mm"}
                            name="max"
                            type="number"
                            value={lengthrange?.max}
                            onChange={handleLengthChange}
                            customBg={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <div className="jps-measur-box">
                        <div item>
                          <TextInput
                            label={"Table, Min, %"}
                            name="min"
                            type="number"
                            value={tableRange?.min}
                            onChange={handleTableChange}
                            customBg={true}
                          />
                        </div>

                        <div item>
                          <i class="fa-solid fa-chevron-right"></i>
                        </div>

                        <div item>
                          <TextInput
                            label={"Table, Max, %"}
                            name="max"
                            type="number"
                            value={tableRange?.max}
                            onChange={handleTableChange}
                            customBg={true}
                          />
                        </div>
                      </div>

                      <div className="jps-measur-box">
                        <div item>
                          <TextInput
                            label={"Width, Min, mm"}
                            name="min"
                            type="number"
                            value={widthrange?.min}
                            onChange={handleWidthChange}
                            customBg={true}
                          />
                        </div>

                        <div item>
                          <i class="fa-solid fa-chevron-right"></i>
                        </div>

                        <div item>
                          <TextInput
                            label={"Width, Max, mm"}
                            name="max"
                            type="number"
                            value={widthrange?.max}
                            onChange={handleWidthChange}
                            customBg={true}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      <div className="jps-measur-box">
                        <div item>
                          <TextInput
                            label={"Radio, Min"}
                            name="min"
                            type="number"
                            value={radioRange?.min}
                            onChange={handleRadioChange}
                            customBg={true}
                          />
                        </div>

                        <div item>
                          <i class="fa-solid fa-chevron-right"></i>
                        </div>

                        <div item>
                          <TextInput
                            label={"Radio, Max"}
                            name="max"
                            type="number"
                            value={radioRange?.max}
                            onChange={handleRadioChange}
                            customBg={true}
                          />
                        </div>
                      </div>

                      <div className="jps-measur-box">
                        <div item>
                          <TextInput
                            label={"Depth, Min, mm"}
                            name="min"
                            type="number"
                            value={depthmmrange?.min}
                            onChange={handleDepthMMChange}
                            customBg={true}
                          />
                        </div>

                        <div item>
                          <i class="fa-solid fa-chevron-right"></i>
                        </div>

                        <div item>
                          <TextInput
                            label={"Depth, Max, mm"}
                            name="max"
                            type="number"
                            value={depthmmrange?.max}
                            onChange={handleDepthMMChange}
                            customBg={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className={showfilter ? "col shop-diamonds-list" : "col"}>
              <div className="row">
                {diamonds.map((diamond, index) => (
                  <div
                    key={index}
                    className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-20"
                  >
                    <div
                      className="diamond-card"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/diamonddetail", { state: { diamond } });
                      }}
                    >
                      <div className="shopimg">
                        <img
                          src={diamond.Image}
                          alt={diamond.Shape}
                          className="diamond-img"
                        />
                      </div>
                      <div class="dimond-content">
                        <h6 className="diamond-name">
                          {diamond.Carats} CARAT {diamond.Shape} - {diamond.Lab}
                        </h6>
                        <p className="price">
                          <span>Amount:</span> ${diamond.Amount.toFixed(2)}
                        </p>
                        <p className="price">
                          <span>Price per carat:</span> $
                          {diamond.Price.toFixed(2)}
                        </p>
                        <span
                          className="add-to-cart"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(diamond, true);
                          }}
                        >
                          Add to cart <i class="fa-solid fa-arrow-right"></i>
                          {/* <span className="">→</span> */}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {diamonds?.length > 0 ? (
                <div
                  className="mb-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleClick}
                    style={{
                      textTransform: "none",
                      backgroundColor: "#C9A236",
                      color: "#fff",
                    }}
                    className="pagination-dropdown"
                  >
                    {itemsPerPage}
                    <ArrowDropDownIcon />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {[12, 24, 54, 108].map((perPage) => (
                      <MenuItem
                        key={perPage}
                        onClick={() => handleClose(perPage)}
                      >
                        {perPage}
                      </MenuItem>
                    ))}
                  </Menu>

                  <IconButton
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    style={{
                      backgroundColor: "#C9A236",
                      color: "#fff",
                    }}
                  >
                    <ArrowLeftIcon />
                  </IconButton>

                  <Typography variant="body1">
                    Page {currentPage} of {totalPages}
                  </Typography>

                  <IconButton
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    style={{
                      backgroundColor: "#C9A236",
                      color: "#fff",
                    }}
                  >
                    <ArrowRightIcon />
                  </IconButton>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      height: "50vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#444",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <img
                      src={noitem}
                      alt="No Data"
                      style={{
                        width: "80px",
                        marginBottom: "15px",
                        opacity: "0.7",
                      }}
                    />
                    <p>No diamonds found. Please try adjusting the filters.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiamondsGrid;
