import express from "express";
import employeeLeaveBalanceController from "../../controllers/HRM/employeeLeaveBalance.controller.js";

const router = express.Router();

router
  .get(
    "/getAllEmployeeLeaveBalance",
    employeeLeaveBalanceController.getAllEmployeeLeaveBalance
  )
  .get(
    "/getEmployeeLeaveBalanceById/:id",
    employeeLeaveBalanceController.getEmployeeLeaveBalanceById
  )
  .get(
    "/getAllEmployeeLeaveBalanceOfAnEmployee/:id",
    employeeLeaveBalanceController.getAllEmployeeLeaveBalanceOfAnEmployee
  );

export default router;
