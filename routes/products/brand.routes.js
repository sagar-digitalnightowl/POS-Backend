import express from "express"
import brandController from "../../controllers/products/brand.controller.js"
const router=express.Router()
router.post("/addBrand",brandController.addBrand)
      .get("/getAllBrand",brandController.getAllBrand)
      .get("/getBrand/:id",brandController.getBrandById)
      .patch("/updateBrand/:id",brandController.updateBrandById)
      .delete("/deleteBrand/:id",brandController.deleteBrandById)
      
      export default router
 
