import express from "express"
import categoryController from "../../controllers/products/category.controller.js"

const router=express.Router()
router.post("/addCategory",categoryController.addCategory)
      .get("/getAllCategory",categoryController.getAllCategory)
      .get("/getCategory/:id",categoryController.getCategoryById)
      .patch("/updateCategory/:id",categoryController.updateCategoryById)
      .delete("/deleteCategory/:id",categoryController.deleteCategoryById)

      export default router
 
