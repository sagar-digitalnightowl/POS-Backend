import adminModel from "../../models/admin/admin.model.js";
import transport from "../../utils/nodemailer.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const routes = {};

// Generate OTP function
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

routes.signUp = async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;
    if (!email || !username || !mobile || !password) {
      return res.status(400).json({ error: "All the fields are required" });
    }
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "This email is already in use" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const otp = generateOTP();

    const newAdmin = new adminModel({
      username,
      email,
      mobile,
      password: hashedPassword,
      otp,
      verified: false,
      remember: false,
      agreement: false,
    });

    await newAdmin.save();

    await transport.sendMail({
      from: `"Yash Baranwal" <stranger2copy@gmail.com>`,
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP is ${otp}`,
    });

    res
      .status(200)
      .json({ message: "OTP sent to email. Verify to complete registration." });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await adminModel.findOne({ email });

    if (!admin) return res.status(404).json({ error: "Admin not found" });
    if (admin.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    admin.verified = true;
    admin.otp = null;
    await admin.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.login = async (req, res) => {
  try {
    const { username, password, remember, agreement } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "username and password are required" });
    }

    const admin = await adminModel.findOne({ username });

    if (!agreement) {
      return res
        .status(404)
        .json({ error: "You have to accept the agreement" });
    }
    if (remember) {
      admin.remember = true;
    }

    if (!admin) return res.status(404).json({ error: "Admin not found" });
    if (!admin.verified)
      return res.status(400).json({ error: "Email not verified" });

    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, username: admin.username },
      process.env.JWT_SECRET,
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const otp = generateOTP();
    admin.otp = otp;
    await admin.save();

    await transport.sendMail({
      from: `"Yash Baranwal" <stranger2copy@gmail.com>`,
      to: email,
      subject: "Reset Your Password",
      text: `Your OTP for password reset is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;

    const admin = await adminModel.findOne({ email });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    if (!admin.verified) {
      return res
        .status(400)
        .json({ error: "OTP not verified. Please verify OTP first." });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    admin.password = await bcryptjs.hash(newPassword, 10);
    await admin.save();

    res.status(200).json({
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: "New password do not match" });
    }

    const admin = await adminModel.findById(userId);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isMatch = await bcryptjs.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ error: "Current password is incorrect" });

    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
    admin.password = hashedNewPassword;
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      path: "/",
      sameSite: "Lax",
      secure: true,
    });

    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
