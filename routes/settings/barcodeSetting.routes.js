import barcodeSettingController from '../../controllers/settings/barcodeSetting.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addBarcodeSetting',barcodeSettingController.addBarcodeSetting)
      .get('/getAllBarcodeSetting',barcodeSettingController.getAllBarcodeSetting)
      .get('/getBarcodeSetting/:id',barcodeSettingController.getBarcodeSettingById)
      .patch('/updateBarcodeSetting/:id',barcodeSettingController.updateBarcodeSettingById)
      .delete('/deleteBarcodeSetting/:id',barcodeSettingController.deleteBarcodeSettingById)

export default router      