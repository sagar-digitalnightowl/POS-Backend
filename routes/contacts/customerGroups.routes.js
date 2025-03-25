import express from "express";
import cusotmerGroupController from "../../controllers/contacts/customerGroups.controller.js"
const router=express.Router();

router.post("/addCusotmerGroup",cusotmerGroupController.addCustomerGroup)
      .get("/getAllCusotmerGroup",cusotmerGroupController.getAllCustomerGroup)
      .get("/getCusotmerGroup/:id",cusotmerGroupController.getCustomerGroupById)
      .patch("/updateCusotmerGroup/:id",cusotmerGroupController.updateCustomerGroupById)
      .delete("/deleteCusotmerGroup/:id",cusotmerGroupController.deleteCustomerGroupById)

export default router;       