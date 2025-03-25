import express from "express";
import customerAndSuppliersRoutes from "./customerAndSupplier.routes.js"
import cusotmerGroupRoutes from "./customerGroups.routes.js"
import manufacturerRoutes from "./manufacturer.routes.js"
import importContactsRoutes from "./importContacts.routes.js"
import multer from "multer"

const upload=multer();

const router = express.Router();

router.use("/customerAndSuppliers",customerAndSuppliersRoutes)
      .use("/cusotmerGroup",cusotmerGroupRoutes)
      .use("/manufacturer",manufacturerRoutes)
      .use("/importContacts",importContactsRoutes)
export default router;
