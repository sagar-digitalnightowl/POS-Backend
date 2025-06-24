import discountController from '../../controllers/sell/discount.controller.js'
import express from 'express'

const router=express.Router();

router.post("/addDiscount", discountController.addDiscount)
      .get("/getAllDiscount", discountController.getAllDiscount)
      .get("/getDiscount/:id", discountController.getDiscountById)
      .patch("/updateDiscount/:id", discountController.updateDiscountById)
      .delete("/deleteDiscount/:id", discountController.deleteDiscount)


export default router