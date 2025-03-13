var express = require("express");
var router = express.Router();
var {
  createResetToken,
  verifyResetToken,
} = require("../authentication/authpassword");
const Signup = require("../users/model");
const { encryptData } = require("../../authentication");
const { decryptData } = require("../../authentication");
const nodemailer = require("nodemailer");

//-------------------------------POST DATA----------------------------------------

let transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: false,
  auth: {
    user: "mail@jpsjewels.com",
    pass: "AApp@00.com@mail",
  },
});

const sendEmail = async (toEmail, subject, body, data) => {
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

router.post("/resetpasswordmail", async (req, res) => {
  try {
    const { PrimaryEmail } = req.body;

    if (!PrimaryEmail) {
      return res.status(400).json({ message: "Email address is required" });
    }

    let user = await Signup.findOne({
      PrimaryEmail,
      IsDelete: false,
    });

    if (!user) {
      return res.status(404).json({
        message: "No user found with the provided email address",
      });
    }

    const token = await createResetToken({ PrimaryEmail });
    const url = `https://jpsjewels.com/resetpassword?token=${token}`;

    const defaultBody = `
    <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 20px auto; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid rgb(23, 22, 22);">
        <tr>
  <td style="
    padding: 20px 0; 
    text-align: center; 
    background-color: #c9a236; 
    border-bottom: 1px solid #c9a236;
    border-top-left-radius: 12px; 
    border-top-right-radius: 12px; 
    border: none;">
    <a href="https://jpsjewels.com" style="color: #ffffff; font-size: 20px; font-weight: bold; text-decoration: none;">
      JPS Jewels
    </a>
  </td>
</tr>

        <tr>
          <td style="padding: 20px; text-align: center; color: #333333; background-color: #ffffff;">
            <h2 style="font-size: 25px; font-weight: 700; color: #c9a236; margin-bottom: 20px; letter-spacing: 1px;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #666666; line-height: 1.6; margin-bottom: 20px;">
              Dear Sir/Ma'am,<br>
              We received a request to reset the password for your JPS Jewels account. Please click the button below to proceed. If you did not request this, please disregard this email. The link will expire in 4 hours.
            </p>
            <a href="${url}" style="display: inline-block; padding: 12px 25px; background-color: #c9a236; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 50px; text-transform: uppercase; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: all 0.3s ease;">
              Reset Your Password
            </a>
            <p style="font-size: 14px; color: #888888; margin-top: 30px;">If you have any questions or concerns,or Need help? <a href="mailto:mitmangukiya192@gmail.com" style="color: #c9a236; text-decoration: none;">Contact Support</a></p>
          </td>
        </tr>
        <tr>
  <td style="padding: 15px 20px; text-align: center; font-size: 12px; color: #888888; background-color: #f4f4f7; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
    <p>Thank you for choosing our services!<br><strong>JPS Jewels</strong>, Inc. | All rights reserved.</p>
  </td>
</tr>

      </table>
    </div>`;

    const data = [
      {
        EmailAddress: PrimaryEmail || "",
        Url: url || "",
      },
    ];

    const emailsend = await sendEmail(
      PrimaryEmail,
      "Reset Your Password",
      defaultBody,
      data
    );

    return res.json({
      statusCode: 200,
      message: "Password reset email sent successfully",
      emailsend: emailsend,
    });
  } catch (error) {
    console.error("Error in resetpasswordmail API:", error.message);
    return res.status(500).json({
      statusCode: 500,
      message: "An error occurred while sending the email",
      error: error.message,
    });
  }
});

router.get("/check_token_status/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    // const expirationTimestamp = tokenExpirationMap.get(token);
    const verify = await verifyResetToken(token);

    if (verify.status) {
      return res.json({ expired: false });
    } else {
      return res.json({ expired: true });
    }
  } catch (error) {
    console.error("Error checking token status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/reset_passwords/:mail", async (req, res) => {
  try {
    const encryptmail = req.params.mail;
    const verify = await verifyResetToken(encryptmail);
    const email = verify.data.PrimaryEmail;

    if (!verify.status) {
      return res.status(401).json({
        message: "Token expired. Please request a new password reset email.",
      });
    }

    const newPassword = req.body.UserPassword;

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required.",
      });
    }

    let user = await Signup.findOne({
      PrimaryEmail: email,
      IsDelete: false,
    });

    if (!user) {
      return res.status(404).json({
        message: "No email found",
      });
    }
    const decryptedPassword = decryptData(user.UserPassword);
    if (newPassword === decryptedPassword) {
      return res.status(401).json({
        message: "New password cannot be the same as the old password.",
      });
    }

    const hashConvert = encryptData(newPassword);

    const updateData = { UserPassword: hashConvert };

    await user.updateOne({ $set: updateData });

    return res.status(200).json({
      data: user,
      url: "/auth/login",
      message: "Password Updated Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
