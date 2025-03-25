import express from "express";
import listProductController from "../../controllers/products/listProducts.controller.js";
import multer from "multer"

const upload=multer()

const router = express.Router();

router
  .post("/addProduct",upload.any(), listProductController.addProducts)
  .get("/getAllProduct",listProductController.getAllProduct)
  .get("/getProduct/:id",listProductController.getProductById)
  .patch("/updateProduct/:id",listProductController.updateProductById)
  .post("/importProducts",upload.single("file"),listProductController.importProducts)
  .delete("/deleteProduct/:id",listProductController.deleteProductById);
                                                                                                
  export default router 
