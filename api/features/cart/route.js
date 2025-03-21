var express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const Cart = require("./model");
const Stock = require("../stock/model");

const router = express.Router();
const { verifyLoginToken } = require("../authentication/authentication");

const fetchCartDetails = async (UserId, SKU) => {
  if (!UserId) {
    throw new Error("UserId is required to fetch cart details.");
  }

  const cartSearchQuery = { UserId, IsDelete: false, IsCheckout: false }; // Start with UserId
  if (SKU) cartSearchQuery.SKU = SKU; // Add SKU if it's provided

  const cartDetails = await Cart.aggregate([
    { $match: cartSearchQuery },
    {
      $lookup: {
        from: "stocks",
        let: { sku: "$SKU" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$SKU", "$$sku"] },
                  { $eq: ["$IsDelete", false] },
                ],
              },
            },
          },
        ],
        as: "diamondDetails",
      },
    },
    {
      $unwind: { path: "$diamondDetails", preserveNullAndEmptyArrays: false },
    },
    {
      $project: {
        SKU: 1,
        AddToCartId: 1,
        UserId: 1,
        // diamondDetails: 1,
        "diamondDetails.Image": 1,
        "diamondDetails.Amount": 1,
        "diamondDetails.Price": 1,
        "diamondDetails.Cut": 1,
        "diamondDetails.Clarity": 1,
        "diamondDetails.Color": 1,
        "diamondDetails.Carats": 1,
        "diamondDetails.Shape": 1,
        "diamondDetails.Lab": 1,
        Quantity: 1,
      },
    },
  ]);

  const cartCount = cartDetails.length;

  return {
    statusCode: cartDetails.length > 0 ? 200 : 204,
    message:
      cartDetails.length > 0
        ? "CartDetails retrieved successfully"
        : "No cartDetails found",
    data: cartDetails,
    TotalCount: cartCount,
  };
};

router.get("/cart", verifyLoginToken, async function (req, res) {
  try {
    const { userId, SKU } = req.query;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        message: "UserId is required to fetch cart details.",
      });
    }

    const result = await fetchCartDetails(userId, SKU);

    res.status(result.statusCode).json({
      statusCode: result.statusCode,
      message: result.message,
      data: result.data,
      TotalCount: result.TotalCount,
    });
  } catch (error) {
    console.error("Error fetching cart details:", error.message);
    res.status(500).json({
      statusCode: 500,
      message: "An error occurred while fetching cart details.",
      error: error.message,
    });
  }
});

const fetchCartWithoutCheckout = async () => {
  const cartwcSearchQuery = { IsDelete: false, IsCheckout: false }; // Start with UserId// Add SKU if it's provided

  const cartItems = await Cart.aggregate([
    { $match: cartwcSearchQuery },
    {
      $lookup: {
        from: "stocks",
        let: { sku: "$SKU" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$SKU", "$$sku"] },
                  { $eq: ["$IsDelete", false] },
                ],
              },
            },
          },
        ],
        as: "diamondDetails",
      },
    },
    {
      $lookup: {
        from: "signups",
        localField: "UserId",
        foreignField: "UserId",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "addtocarts",
        localField: "AddToCartId",
        foreignField: "AddToCartId",
        as: "addCartDetails",
      },
    },
    {
      $unwind: { path: "$diamondDetails", preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: "$addCartDetails", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        SKU: 1,
        UserId: 1,
        AddToCartId: 1,
        diamondDetails: 1,
        userDetails: 1,
        Quantity: 1,
        addCartDetails: 1,
      },
    },
  ]);

  const cartCount = await Cart.countDocuments({
    IsDelete: false,
    IsCheckout: false,
  });

  return {
    statusCode: cartItems.length > 0 ? 200 : 204,
    message:
      cartItems.length > 0
        ? "Cart items retrieved successfully"
        : "No cartItems found",
    data: cartItems,
    TotalConut: cartCount,
  };
};

router.get("/cartwithoutcheckout", verifyLoginToken, async function (req, res) {
  try {
    const result = await fetchCartWithoutCheckout();

    res.status(result.statusCode).json({
      statusCode: result.statusCode,
      message: result.message,
      data: result.data,
      TotalConut: result.TotalConut,
    });
  } catch (error) {
    console.error("Error fetching cart details:", error.message);
    res.status(500).json({
      statusCode: 500,
      message: "An error occurred while fetching cart details.",
      error: error.message,
    });
  }
});

const fetchCartWithoutCheckoutPopup = async (AddToCartId) => {
  try {
    if (!AddToCartId) {
      throw new Error("AddToCartId is required.");
    }

    const cartPopupSearchQuery = {
      AddToCartId,
      IsDelete: false,
      IsCheckout: false,
    };

    // Fetch raw cart data before aggregation for debugging
    const rawCartData = await Cart.find(cartPopupSearchQuery);

    if (rawCartData.length === 0) {
      return {
        statusCode: 204,
        message: "No items found",
        data: [],
      };
    }

    // Aggregation pipeline
    const carts = await Cart.aggregate([
      { $match: cartPopupSearchQuery },
      {
        $lookup: {
          from: "stocks",
          localField: "SKU",
          foreignField: "SKU",
          as: "diamondDetails",
        },
      },
      {
        $lookup: {
          from: "signups",
          localField: "UserId",
          foreignField: "UserId",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "addtocarts",
          localField: "AddToCartId",
          foreignField: "AddToCartId",
          as: "addCartDetails",
        },
      },
      {
        $unwind: { path: "$diamondDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$addCartDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          SKU: 1,
          UserId: 1,
          AddToCartId: 1, // Explicitly included to ensure it's in the output
          Quantity: 1,
          diamondDetails: 1,
          userDetails: 1,
          addCartDetails: 1,
        },
      },
    ]);

    return {
      statusCode: carts.length > 0 ? 200 : 204,
      message:
        carts.length > 0 ? "cart item retrieved successfully" : "No item found",
      data: carts,
    };
  } catch (error) {
    console.error("Error in fetchCartWithoutCheckoutPopup:", error.message);
    return {
      statusCode: 500,
      message: "An error occurred while fetching cart details.",
      error: error.message,
    };
  }
};

// API Route
router.get("/cartpopup", verifyLoginToken, async function (req, res) {
  try {
    const { AddToCartId } = req.query;

    if (!AddToCartId) {
      return res.status(400).json({
        statusCode: 400,
        message: "AddToCartId is required",
      });
    }

    const result = await fetchCartWithoutCheckoutPopup(AddToCartId);

    res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Error fetching cart details:", error.message);
    res.status(500).json({
      statusCode: 500,
      message: "An error occurred while fetching cart details.",
      error: error.message,
    });
  }
});

const addToCart = async (data) => {
  try {
    data["createdAt"] = moment().utcOffset(330).format("YYYY-MM-DD HH:mm:ss");
    data["updatedAt"] = moment().utcOffset(330).format("YYYY-MM-DD HH:mm:ss");

    if (!data.AddToCartId) {
      data.AddToCartId = Date.now().toString(); // You can also prepend a prefix or make this more complex if needed
    }

    if (!data.SKU) {
      return {
        statusCode: 400,
        message: "SKU is required",
      };
    }

    const existingItem = await Cart.findOne({
      UserId: data.UserId,
      SKU: data.SKU, // Match SKU along with UserId
      IsCheckout: false,
      IsDelete: false,
    });

    const checkStock = await Stock.findOne({
      SKU: data.SKU,
      IsDelete: true,
    })

    if (existingItem) {
      return {
        statusCode: 202,
        message: "Item already in the cart",
      };
    } else if (checkStock) {
      return {
        statusCode: 203,
        message: "Diamond Is Deleted or already ordered.",
      };
    } else {
      // If the item does not exist, create a new cart entry
      const newCartItem = await Cart.create(data); // Use data instead of req.body

      return {
        statusCode: 200,
        data: newCartItem,
        message: "Diamond added to the cart",
      };
    }
  } catch (error) {
    console.error("Error:", error.message);
    return {
      statusCode: 500,
      message: "An error occurred while adding the item to the cart",
      error: error.message,
    };
  }
};

router.post("/addtocart", verifyLoginToken, async (req, res) => {
  // const token = req.headers["authorization"]?.split(" ")[1];
  // if (!token) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  try {
    const { UserId } = req.query;
    // const decoded = jwt.verify(token, "your_secret_key");
    // req.body.UserId = decoded.Userid;
    const response = await addToCart(req.body);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
});

const orderDetails = async () => {
  const orders = await Cart.aggregate([
    {
      $match: {
        IsDelete: false,
      },
    },
    {
      $lookup: {
        from: "signups",
        localField: "UserId",
        foreignField: "UserId",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "stocks",
        localField: "SKU",
        foreignField: "SKU",
        as: "diamondDetails",
      },
    },
    {
      $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: "$diamondDetails", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        SKU: 1,
        UserId: 1,
        userDetails: "$userDetails",
        diamondDetails: "$diamondDetails",
        Quantity: 1,
      },
    },
  ]);

  if (orders.length === 0) {
    return {
      statusCode: 404,
      message: "No users found.",
    };
  }

  const cartCount = orders.length;

  return {
    TotalCount: cartCount,
    statusCode: orders.length > 0 ? 200 : 204,
    message:
      orders.length > 0 ? "orders retrieved successfully" : "No orders found",
    data: orders,
  };
};

router.get("/orderdetail", verifyLoginToken, async function (req, res) {
  try {
    const result = await orderDetails();

    res.status(result.statusCode).json({ result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

const deletecarddata = async (AddToCartId) => {
  try {
    const updatecart = await Cart.findOneAndUpdate(
      { AddToCartId, IsDelete: false },
      { $set: { IsDelete: true } },
      { new: true }
    );

    if (!updatecart) {
      return {
        statusCode: 404,
        message: `Item Not found`,
      };
    }
    return {
      statusCode: 200,
      message: `Item Removed successfully.`,
      data: updatecart,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Failed To Remove Item.",
      error: error.message,
    };
  }
};

router.delete(
  "/updatecart/:AddToCartId",
  verifyLoginToken,
  async (req, res) => {
    try {
      const { AddToCartId } = req.params;
      const response = await deletecarddata(AddToCartId);
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        statusCode: 500,
        message: "Something went wrong, please try later!",
      });
    }
  }
);

module.exports = router;
