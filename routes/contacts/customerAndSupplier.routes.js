import express from "express";
import customersAndSupplierController from "../../controllers/contacts/customersAndSupplier.controller.js"
const router=express.Router();

router.post("/addCustomerAndSupplier",customersAndSupplierController.addCustomer)
      .get("/getAllCustomerAndSupplier",customersAndSupplierController.getAllCustomer)
      .get("/getCustomersAndSuppliers",customersAndSupplierController.getCustomers)
      .get("/getCustomerAndSupplier/:id",customersAndSupplierController.getCustomerById)
      .patch("/updateCustomerAndSupplier/:id",customersAndSupplierController.updateCustomer)
      .delete("/deleteCustomerAndSupplier/:id",customersAndSupplierController.deleteCustomer)

export default router;       