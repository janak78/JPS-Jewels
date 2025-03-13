var express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const XLSX = require("xlsx");
const stockSchema = require("../stock/model");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";
const Cart = require("../cart/model");
const Contact = require("./model");
const nodemailer = require("nodemailer");
const { verifyLoginToken } = require("../authentication/authentication");

const router = express.Router();

let transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: false,
  auth: {
    user: "mail@jpsjewels.com",
    pass: "AApp@00.com@mail",
  },
});

const sendEmail = async (toEmail, subject, body) => {
  try {
    const mailOptions = {
      from: "mail@jpsjewels.com",
      to: [toEmail, "mail@jpsjewels.com"],
      subject: subject,
      html: body, // Sending HTML content
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

const addContact = async (data) => {
  try {
    const timestamp = moment().utcOffset(330).format("YYYY-MM-DD HH:mm:ss");
    data.createdAt = timestamp;
    data.updatedAt = timestamp;

    const requiredFields = ["Name", "Email", "Subject", "Message"];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        message: `Required fields missing: ${missingFields.join(", ")}`,
      };
    }

    // Save contact details
    const newContact = await Contact.create(data);

    // Ensure the contact email exists before sending an email
    if (!data.Email) {
      return { statusCode: 400, message: "Recipient email is required." };
    }

    // Prepare email content
    const emailBody = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0; }
    table { width: 100%; border-spacing: 0; }
    .email-container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
    .email-header { background: rgb(172, 130, 80); color: #fff; font-size: 24px; text-align: center; padding: 20px; border-bottom: 3px solid #0056b3; }
    .email-body { padding: 20px; }
    .email-body h2 { color: rgb(172, 130, 80); margin: 0 0 10px; }
    .email-body p { font-size: 16px; line-height: 1.6; margin: 0 0 10px; }
    .email-footer { background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #777; border-top: 1px solid #ddd; }
    .email-footer a { color: #007BFF; text-decoration: none; }
  </style>
</head>
<body>
  <table role="presentation" class="email-container">
    <tr>
      <td>
        <table role="presentation" width="100%">
          <tr>
            <td class="email-header">Contact Confirmation</td>
          </tr>
          <tr>
            <td class="email-body">
              <h2>Hello ${data.Name}</h2>
              <p>Thank you for reaching out to us! We have received your contact details and will get back to you shortly.</p>
              <p><strong>Email:</strong> ${data.Email}</p>
            </td>
          </tr>
          <tr>
            <td class="email-footer">
              <p>Need help? <a href="mailto:mitmangukiya192@gmail.com">Contact Support</a></p>
              <p>Thank you for choosing JPS Jewels!</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    
      `;

    // Send email
    await sendEmail(data.Email, "We Received Your Contact Request!", emailBody);

    return {
      statusCode: 200,
      data: newContact,
      message: "Contact details saved and email sent successfully.",
    };
  } catch (error) {
    console.error("Error in addContact:", error.message);
    return {
      statusCode: 500,
      message: "An error occurred while saving contact details.",
      error: error.message,
    };
  }
};

router.post("/addcontact", async (req, res) => {
  try {
    req.body.ContactId = Date.now(); // Generate a unique Contact ID
    const response = await addContact(req.body);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong, please try later!" });
  }
});

const contactDetails = async () => {
  const contact = await Contact.aggregate([
    {
      $match: { IsDelete: false },
    },
    {
      $project: {
        Email: 1,
        Name: 1,
        ContactId: 1,
        Message: 1,
        Subject: 1,
        createdAt: 1,
      },
    },
  ]);

  const contactCount = contact.length;

  return {
    statusCode: contactCount > 0 ? 200 : 204,
    message:
      contactCount > 0
        ? "Contact details retrieved successfully"
        : "No Contact found",
    data: contact,
    TotalCount: contactCount,
  };
};

router.get("/contactdetails", verifyLoginToken, async (req, res) => {
  try {
    const response = await contactDetails();
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong, please try later!" });
  }
});

const contactDetailsPopup = async (ContactId) => {
  if (!ContactId) {
    throw new Error("ContactId is required.");
  }

  const contactSearchQuery = {
    ContactId,
    IsDelete: false,
  };

  const rawCartData = await Contact.find(contactSearchQuery);

  if (rawCartData.length === 0) {
    return {
      statusCode: 204,
      message: "No Contactdetail found",
      data: [],
    };
  }

  const contact = await Contact.aggregate([
    { $match: contactSearchQuery },
    {
      $project: {
        Email: 1,
        Name: 1,
        ContactId: 1,
        Message: 1,
        Subject: 1,
        createdAt: 1,
      },
    },
  ]);

  const stockCount = contact.length;

  return {
    statusCode: stockCount > 0 ? 200 : 204,
    message:
      stockCount > 0
        ? "contactdetail retrieved successfully"
        : "No Contact found",
    data: contact,
    TotalCount: stockCount,
  };
};

router.get("/contactdetailspopup", verifyLoginToken, async (req, res) => {
  try {
    const { ContactId } = req.query;

    const response = await contactDetailsPopup(ContactId);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong, please try later!" });
  }
});

const deletecontact = async (ContactId) => {
  try {
    const deleteconta = await Contact.findOneAndUpdate(
      { ContactId, IsDelete: false },
      { $set: { IsDelete: true } },
      { new: true }
    );

    if (!deleteconta) {
      return {
        statusCode: 404,
        message: `No contactdetail found`,
      };
    }
    return {
      statusCode: 200,
      message: `contactdetails deleted successfully.`,
      data: deleteconta,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Failed to soft delete contactdetail.",
      error: error.message,
    };
  }
};

router.delete(
  "/updatecontact/:ContactId",
  verifyLoginToken,
  async (req, res) => {
    try {
      const { ContactId } = req.params;
      const response = await deletecontact(ContactId);
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
