import React from "react";
import {
  Grid,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import "./Diamonddetail.css";
import shop2 from "../../assets/images/searching-rare-gem-valuable-diamond-business_1134986-17589.jpg";

const Diamonddetail = () => {
  return (
    <div className="diamond-product-container">
      <div className="diamond-product-wrapper">
        <Grid container spacing={3}>
          {/* Left Side - Diamond Image */}
          <Grid item xs={12} md={3} className="diamond-product-image-container">
            <img src={shop2} alt="Diamond" className="diamond-product-image" />
          </Grid>

          {/* Right Side - Product Details */}
          <Grid
            item
            xs={12}
            md={5}
            className="diamond-product-details-container"
          >
            <h2 className="diamond-product-title">
              1 CARAT RBC D/VS1 DIAMOND – GIA EX
            </h2>
            <p className="diamond-product-sku">
              SKU: GIA 1499844997 &nbsp; | &nbsp; Category:{" "}
              <span className="categorytext"> Diamond</span>
            </p>

            {/* Buttons */}
            <div className="diamond-product-buttons-container">
              <Button
                variant="contained"
                className="diamond-product-video-btn"
                startIcon={<PlayCircleOutlineIcon />}
              >
                Video
              </Button>
              <Button
                variant="contained"
                className="diamond-product-certificate-btn"
                startIcon={<DescriptionIcon />}
              >
                Certificate
              </Button>
            </div>

            {/* Price */}
            <p className="diamond-product-price">$4848.24</p>

            {/* Quantity Input */}
            <TextField
              type="number"
              variant="outlined"
              size="small"
              defaultValue={1}
              className="diamond-product-quantity-input"
            />

            {/* Cart and Buy Buttons */}
            <div className="diamond-product-cart-buttons">
              <Button
                variant="outlined"
                className="diamond-product-cart-btn"
                startIcon={<ShoppingCartIcon />}
              >
                Add to cart
              </Button>
              <Button variant="contained" className="diamond-product-buy-btn">
                Buy now
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="diamond-product-info-card">
              <h3 className="diamond-product-info-title">
                Product Information
              </h3>
              <Table className="diamond-product-info-table">
                <TableBody>
                  {[
                    ["Lab", "GIA"],
                    ["Certificate No", "1499844997"],
                    ["Diamond Type", "N/A"],
                    ["Shape", "RBC"],
                    ["Carat", "1"],
                    ["Color", "D"],
                    ["Clarity", "VS1"],
                    ["Cut", "EX"],
                    ["Polish", "EX"],
                    ["Symmetry", "EX"],
                    ["Fluorescence", "FNT"],
                    ["Rap $", "9600"],
                    ["Disc %", "-49.4975"],
                    ["Price $/ct", "4848.24"],
                    ["Amount $", "4848.24"],
                    ["Depth", "62.5"],
                    ["Table", "56"],
                    ["EyeClean", "E0"],
                    ["Milky", "M0"],
                    ["Tinge", "NO"],
                  ].map(([key, value], index) => (
                    <TableRow key={index}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Grid>
        </Grid>

        <hr className="diamond-description-divider" />

        {/* Description Title */}
        <h3 className="diamond-description-title">DESCRIPTION</h3>

        {/* Description Text */}
        <p className="diamond-description-text">
          Discover the brilliance of this exquisite diamond, showcasing a RBC
          cut that exudes timeless elegance. With a weight of 1 carats, this
          diamond boasts a D color grade and an exceptional VS1 clarity rating,
          ensuring unparalleled visual perfection. Crafted to perfection, the
          diamond features an EX cut, EX polish, and EX symmetry, resulting in
          maximum brilliance and fire.
        </p>

        <p className="diamond-description-text">
          It is certified by the prestigious GIA under certificate number
          1499844997, guaranteeing authenticity and quality. The diamond
          measures 62.5 depth and 56 table, optimized for stunning light
          performance. With no fluorescence and a commitment to being E0, this
          gem is a flawless addition to your collection. Whether for an
          engagement, anniversary, or any special occasion, this diamond is the
          epitome of beauty and luxury.
        </p>
      </div>
    </div>
  );
};

export default Diamonddetail;
