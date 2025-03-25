import express from "express"
import warrantyController from "../../controllers/products/warranty.controller.js"
const router=express.Router()
router.post("/addWarranty",warrantyController.addWarranty)
      .get("/getAllWarranty",warrantyController.getAllWarranty)
      .get("/getWarranty/:id",warrantyController.getAllWarranty)
      .patch("/updateWarranty/:id",warrantyController.updateWarrantyById)
      .delete("/deleteWarranty/:id",warrantyController.deleteWarrantyById)
      
      export default router
 
