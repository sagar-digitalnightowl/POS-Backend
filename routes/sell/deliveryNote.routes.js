import deliveryNoteController from '../../controllers/sell/deliveryNote.Controller.js'
import express from 'express'

const router=express.Router();

router.post("/addDeliveryNote",deliveryNoteController.addDeliveryNote)
      .get("/getAllDeliveryNote",deliveryNoteController.getAllDeliveryNote)
      .get("/getDeliveryNote/:id",deliveryNoteController.getDeliveryNoteById)
      .patch("/updateDeliveryNote/:id",deliveryNoteController.updateDeliveryNoteById)
      .delete("/deleteDeliveryNote/:id",deliveryNoteController.deleteDeliveryNoteById)


export default router;