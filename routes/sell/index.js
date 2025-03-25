import express from "express"
import saleRoutes from "./sale.routes.js"
import draftRoutes from "./draft.routes.js"
import quotationRoutes from "./quotation.routes.js"
import deliveryNoteRoutes from "./deliveryNote.routes.js"
import discountRoutes from "./discount.routes.js"

const router = express.Router()

router
     .use("/saleList",saleRoutes)
     .use("/draftList",draftRoutes)
     .use("/quotationList",quotationRoutes)
     .use("/deliveryList",deliveryNoteRoutes)
     .use("/discount",discountRoutes)

export default router;
