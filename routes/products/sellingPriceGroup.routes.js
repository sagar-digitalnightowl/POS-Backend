import express from "express"
import sellingPriceGroupController from "../../controllers/products/sellingPriceGroup.controller.js"
const router=express.Router();

router.post("/addSellingPriceGroup",sellingPriceGroupController.addSellingPriceGroup)
      .get("/getsellingPriceGroup",sellingPriceGroupController.getAllSellingPriceGroup)
      .get("/getsellingPriceGroup/:id",sellingPriceGroupController.deleteSellingPriceGroupById)
      .patch("/updatesellingPriceGroup/:id",sellingPriceGroupController.updateSellingPriceGroupById)
      .delete("/deleteSellingPriceGroup/:id",sellingPriceGroupController.deleteSellingPriceGroupById)

      export default router
      