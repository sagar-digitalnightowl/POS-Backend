import express from "express"
import productMappingRoutes from "../../controllers/products/productMapping.controller.js"
const router=express.Router()
router.post("/addProductMapping",productMappingRoutes.addProductMapping)
      .get("/getAllProductMapping",productMappingRoutes.getAllProductMapping)
      .get("/getProductMapping/:id",productMappingRoutes.getProductMappingById)
      .patch("/updateProductMapping/:id",productMappingRoutes.updateProductMappingById)
      .delete("/deleteProductMapping/:id",productMappingRoutes.deleteProductMappingById)
      
      export default router
 
