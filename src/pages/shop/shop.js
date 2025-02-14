import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { fetchCartCount } from "../../redux/cartSlice";
import axios from "axios";
import { Star, StarBorder } from "@mui/icons-material";
import DiamondLoader from "../../components/Loader/loader"; // Import Loader
import "./shop.css"; // External CSS

const DiamondsGrid = ({ diamond }) => {
  console.log(diamond, "diamond");
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?.UserId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartCount(userId)); // Fetch cart count when page loads
    }
  }, [userId]); // Run when userId is available

  const handleAddToCart = (diamond) => {
    if (!userId) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const cartItem = {
      SKU: diamond.SKU,
      Quantity: 1, // You can change this to allow quantity selection
    };

    dispatch(addToCart(cartItem, userId)); // Dispatch action
  };

  const [diamonds, setDiamonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDiamonds();
  }, []);

  const fetchDiamonds = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/stock/data/page",
        { params: { pageSize: 1600, pageNumber: 1 } }
      );
      console.log(response, "resress");

      if (response.data.result.statusCode === 200) {
        setDiamonds(response.data.result.data);
      } else {
        setError("No diamonds found.");
      }
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DiamondLoader />; // Show loader while fetching data
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container">
      <div className="row">
        {diamonds.map((diamond, index) => (
          <div key={index} className="col-md-3 col-sm-6">
            <div className="diamond-card">
              <div className="shopimg">
                <img
                  src={diamond.Image}
                  alt={diamond.Shape}
                  className="diamond-img"
                />
              </div>
              <h6>
                {diamond.Carats} CARAT {diamond.Shape} - {diamond.Lab}
              </h6>
              <div className="star-rating">
                {[...Array(5)].map((_, i) =>
                  i < diamond.Rating ? (
                    <Star key={i} className="filled-star" />
                  ) : (
                    <StarBorder key={i} className="empty-star" />
                  )
                )}
              </div>
              <p className="price">${diamond.Price.toFixed(2)}</p>
              <span
                className="add-to-cart"
                onClick={() => handleAddToCart(diamond)}
              >
                Add to cart <span className="arrowbtn">→</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiamondsGrid;
