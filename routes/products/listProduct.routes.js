import express from "express";
import listProductController from "../../controllers/products/listProducts.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";


const router = express.Router();

router
  .post("/addProduct",upload.any(), listProductController.addProducts)
  .get("/getAllProduct",listProductController.getAllProduct)
  .get("/getProducts",listProductController.getProducts)
  .get("/getProduct/:id",listProductController.getProductById)
  .patch("/updateProduct/:id",upload.any(),listProductController.updateProductById)
  .post("/importProducts",upload.single("file"),listProductController.importProducts)
  .delete("/deleteProduct/:id",listProductController.deleteProductById);
                                                                                                
  export default router 
