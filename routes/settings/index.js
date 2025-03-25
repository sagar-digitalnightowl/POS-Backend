import express from 'express'
import invoiceSchemeRoutes from './invoiceScheme.routes.js'
import allInvoiceLayoutRoutes from './allInvoiceLayout.routes.js'
import deliveryNoteLayoutRoutes from './deliveryNoteLayout.routes.js'
import barcodeSettingRoutes from './barcodeSetting.routes.js'
import printerRoutes from './printer.routes.js'
import taxRateRoutes from './taxRate.routes.js'
import taxGroupRoutes from './taxGroup.routes.js'

const router = express.Router()

router
     .use("/invoiceScheme",invoiceSchemeRoutes)
     .use("/allInvoiceLayout",allInvoiceLayoutRoutes)
     .use("/deliveryNoteLayout",deliveryNoteLayoutRoutes)
     .use("/barcodeSetting",barcodeSettingRoutes)
     .use("/printer",printerRoutes)
     .use("/taxRate",taxRateRoutes)
     .use("/taxGroup",taxGroupRoutes)


export default router;