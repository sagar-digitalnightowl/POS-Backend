import express from "express"
import adminController from "../../controllers/admin/admin.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js"

const router=express.Router();

router.post("/signUp",adminController.signUp)
      .post("/verifyOTP",adminController.verifyOTP)
      .post("/login",adminController.login)
      .post("/changePassword", authMiddleware, adminController.changePassword)
      .post("/forgetPassword", adminController.forgetPassword)
      .post("/resetPassword", adminController.resetPassword)

export default router