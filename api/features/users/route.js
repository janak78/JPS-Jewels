var express = require("express");
const userSchema = require("../stock/model");
const Signup = require("./model");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const Billing = require("../billing/model");
const addtocart = require("../cart/model");
const signup = require("./model");
const { verifyLoginToken } = require("../authentication/authentication");
const { decryptData, encryptData } = require("../../authentication");

const router = express.Router();

const createUser = async (data) => {
  try {
    // Define required fields
    const requiredFields = [
      "Salulation",
      "FirstName",
      "LastName",
      "CompanyName",
      "Designation",
      "RegisterType",
      "City",
      "State",
      "Country",
      "Pincode",
      "CityPhoneCode",
      "PhoneNo",
      "PrimaryEmail",
      "Username",
      "UserPassword",
      "ConfirmPassword",
      "PreferredContactMethod",
      "PreferredContactDetails",
    ];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        message: `Required fields missing: ${missingFields.join(", ")}`,
      };
    }

    // Password validation
    if (data.UserPassword !== data.ConfirmPassword) {
      return { statusCode: 400, message: "Passwords do not match." };
    }

    // Check for unique fields in a single query
    const existingUser = await Signup.findOne({
      $or: [
        { CompanyName: data.CompanyName },
        { PhoneNo: data.PhoneNo },
        { PrimaryEmail: data.PrimaryEmail },
        { SecondaryEmail: data.SecondaryEmail },
        { PreferredContactDetails: data.PreferredContactDetails },
        { Username: data.Username },
      ],
    });

    if (existingUser) {
      const duplicateField = Object.keys(data).find(
        (key) => existingUser[key] === data[key]
      );
      return { statusCode: 400, message: `${duplicateField} already exists.` };
    }

    // Generate unique UserId and timestamps
    data.UserId = Date.now().toString();
    data.createdAt = moment().utcOffset(330).format("YYYY-MM-DD HH:mm:ss");
    data.updatedAt = data.createdAt;

    // Hash the password using the separate function
    data.UserPassword = await encryptData(data.UserPassword);

    // Save user to the database
    const userToSave = await Signup.create(data);

    return {
      statusCode: 200,
      message: "User Created Successfully",
      data: userToSave,
    };
  } catch (error) {
    console.error("Error creating user:", error.message);
    return {
      statusCode: 500,
      message: "Failed to create user.",
      error: error.message,
    };
  }
};

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const response = await createUser(req.body);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
});

const getUser = async (UserId, req) => {
  try {
    const UsernameExists = {
      UserId: UserId,
      IsDelete: false,
    };

    if (!UsernameExists) {
      return {
        statusCode: 400,
        message: "User not exists.",
      };
    }

    const Userdata = await Signup.aggregate([
      { $match: UsernameExists },
      {
        $project: {
          Username: 1,
          PrimaryEmail: 1,
          FirstName: 1,
          LastName: 1,
          UserPassword: 1,
          City: 1,
          State: 1,
          Country: 1,
          Pincode: 1,
          PhoneNo: 1,
        },
      },
    ]);

    if (Userdata[0]?.UserPassword) {
      Userdata[0].UserPassword = decryptData(Userdata[0]?.UserPassword);
    }

    return {
      statusCode: 200,
      message: "User geted Successfully",
      data: Userdata[0],
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: "Failed to get User.",
      error: error.message,
    };
  }
};

router.get("/userdata", async (req, res) => {
  try {
    const { UserId } = req.query;
    const response = await getUser(UserId);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
});

const updateUserProfile = async (UserId, data) => {
  try {
    const userExists = await Signup.findOne({ UserId, IsDelete: false });

    if (!userExists) {
      return {
        statusCode: 400,
        message: "User does not exist.",
      };
    }
    // Decrypt the password before sending response
    if (data?.UserPassword) {
      data.UserPassword = encryptData(data.UserPassword);
    }

    const updatedUserdata = await Signup.findOneAndUpdate(
      { UserId },
      { $set: data },
      { new: true }
    );

    return {
      statusCode: 200,
      message: "User Profile Updated Successfully",
      data: updatedUserdata,
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: "Failed to update the user.",
      error: error.message,
    };
  }
};

router.put("/updateuserprofile", async (req, res) => {
  try {
    const { UserId } = req.query;
    const data = req.body;

    if (!UserId || !data || Object.keys(data).length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "UserId and update data are required.",
      });
    }

    const response = await updateUserProfile(UserId, data);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
});

const getAllUsers = async () => {
  try {
    const Users = await Signup.aggregate([
      {
        $match: {
          IsDelete: false,
        },
      },
      {
        $project: {
          UserId: 1,
          Image: 1,
          Salutation: 1,
          FirstName: 1,
          LastName: 1,
          CompanyName: 1,
          Designation: 1,
          RegisterType: 1,
          City: 1,
          State: 1,
          Country: 1,
          Pincode: 1,
          CityPhoneCode: 1,
          PhoneNo: 1,
          PrimaryEmail: 1,
          SecondaryEmail: 1,
          Website: 1,
          Username: 1,
          UserPassword: 1,
          ConfirmPassword: 1,
          LineofBusiness: 1,
          PreferredContactMethod: 1,
          PreferredContactDetails: 1,
          IsDelete: 1,
          createdAt: 1,
        },
      },
    ]);

    if (Users.length === 0) {
      return {
        statusCode: 404,
        message: "No users found.",
      };
    }

    const usersCount = Users.length;
    return {
      statusCode: 200,
      message: "Users retrieved successfully.",
      data: Users,
      TotalCount: usersCount, // Returning the length of filtered users
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: "Failed to retrieve users.",
      error: error.message,
    };
  }
};

router.get("/all-users", verifyLoginToken, async (req, res) => {
  try {
    const response = await getAllUsers();
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
});

const fetchUserPopup = async (UserId) => {
  const matchBillingId = {
    UserId: UserId,
  };

  const billingdetail = await signup.aggregate([
    { $match: matchBillingId },
    {
      $project: {
        UserId: 1,
        Image: 1,
        Salutation: 1,
        FirstName: 1,
        LastName: 1,
        CompanyName: 1,
        Designation: 1,
        RegisterType: 1,
        City: 1,
        State: 1,
        Country: 1,
        Pincode: 1,
        CityPhoneCode: 1,
        PhoneNo: 1,
        PrimaryEmail: 1,
        SecondaryEmail: 1,
        Website: 1,
        Username: 1,
        UserPassword: 1,
        ConfirmPassword: 1,
        LineofBusiness: 1,
        PreferredContactMethod: 1,
        PreferredContactDetails: 1,
        IsDelete: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 }, // Sort by `createdAt` in descending order
    },
  ]);

  return {
    statusCode: billingdetail.length > 0 ? 200 : 204,
    message:
      billingdetail.length > 0
        ? "Billing details retrieved successfully"
        : "No billing details found",
    data: billingdetail,
  };
};

router.get("/userpopup", verifyLoginToken, async function (req, res) {
  try {
    const { UserId } = req.query;
    const result = await fetchUserPopup(UserId);

    // res.setHeader(
    //   "Cache-Control",
    //   "no-store, no-cache, must-revalidate, proxy-revalidate"
    // );
    // res.setHeader("Pragma", "no-cache");
    // res.setHeader("Expires", "0");
    // res.setHeader("Surrogate-Control", "no-store");

    res.status(result.statusCode).json({
      statusCode: 200,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try again later.",
    });
  }
});

const loginUser = async (data) => {
  const { Username, UserPassword } = data;

  try {
    // Check if the user exists
    const user = await Signup.findOne({ Username, IsDelete: false });
    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }

    console.log(user, UserPassword);

    // Validate the password
    const isPasswordValid = await decryptData(user.UserPassword);

    console.log(isPasswordValid, "isPasswordValid");

    if (UserPassword !== isPasswordValid) {
      return {
        statusCode: 401,
        message: "Invalid credentials",
      };
    }

    // Generate a JWT token
    const token = jwt.sign(
      { UserId: user.UserId, Username: user.Username, Mail: user.PrimaryEmail },
      SECRET_KEY,
      { expiresIn: "5h" }
    );

    return {
      statusCode: 200,
      message: "Login successful",
      token,
      user: {
        UserId: user.UserId,
        Username: user.Username,
        FirstName: user.FirstName,
        LastName: user.LastName,
        PrimaryEmail: user.PrimaryEmail,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "An error occurred during login",
      error: error.message,
    };
  }
};

router.post("/login", async (req, res) => {
  try {
    const response = await loginUser(req.body);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
});

const countDetails = async () => {
  try {
    const signupCount = await Signup.countDocuments({ IsDelete: false });

    const billingCount = await Billing.countDocuments({ IsDelete: false });

    const usersCount = await userSchema.countDocuments({ IsDelete: false });

    const addtoCarts = await addtocart.countDocuments({
      IsDelete: false,
      IsCheckout: false,
    });

    return {
      statusCode: 200,
      message: "Counts retrieved successfully",
      data: {
        signupCount,
        billingCount,
        usersCount,
        addtoCarts,
      },
    };
  } catch (error) {
    console.error("Error fetching counts:", error.message);
    return {
      statusCode: 500,
      message: "An error occurred while fetching counts",
      error: error.message,
    };
  }
};

router.get("/countdata", verifyLoginToken, async function (req, res) {
  try {
    const result = await countDetails();
    res.status(result.statusCode).json({
      statusCode: 200,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try again later.",
    });
  }
});

const deleteuserdata = async (UserId) => {
  try {
    const updateuser = await signup.findOneAndUpdate(
      { UserId },
      { $set: { IsDelete: true } },
      { new: true }
    );

    if (!updateuser) {
      return {
        statusCode: 404,
        message: `No user found`,
      };
    }
    return {
      statusCode: 200,
      message: `User deleted successfully.`,
      data: updateuser,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Failed to soft delete user data.",
      error: error.message,
    };
  }
};

router.delete("/updateuser/:UserId", verifyLoginToken, async (req, res) => {
  try {
    const { UserId } = req.params;
    const response = await deleteuserdata(UserId);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
});

module.exports = router;
