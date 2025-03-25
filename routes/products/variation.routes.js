import express from "express"
import variationController from "../../controllers/products/variation.controller.js"
const router=express.Router();

router.post("/addVariation",variationController.addVariation)
      .get("/getAllVariation",variationController.getAllVariation)
      .get("/getVariation/:id",variationController.getVariationById)
      .patch("/updateVariation/:id",variationController.getVariationById)
      .delete("/deleteVariation/:id",variationController.deleteVariationById)

      export default router