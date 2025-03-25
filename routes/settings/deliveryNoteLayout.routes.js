import deliveryNoteLayoutController from "../../controllers/settings/deliveryNoteLayout.controller.js";
import express from 'express'
import multer from 'multer'

const upload = multer()

const router = express.Router();

router.post('/addDeliveryNoteLayout',upload.single('invoiceLogo'),deliveryNoteLayoutController.addDeliveryNoteLayout)
      .get("/getAllDeliveryNoteLayout",deliveryNoteLayoutController.getAllDeliveryNoteLayout)
      .get("/getDeliveryNoteLayout/:id",deliveryNoteLayoutController.getDeliveryNoteLayoutById)
      .patch("/updateDeliveryNote/:id",upload.single('invoiceLogo'),deliveryNoteLayoutController.updateDeliveryNoteById)
      .delete("/deleteDeliveryNote/:id",deliveryNoteLayoutController.deleteDeliveryNoteById)

export default router;