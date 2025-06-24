import express from "express";
import adverseEventController from "../../controllers/nhra/adverseEvent.controller.js";
import multer from "multer";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .post(
    "/addAdverseEvent",
    upload.fields([
      { name: "supportiveDocuments", maxCount: 1 },
      { name: "signature", maxCount: 1 },
    ]),
    adverseEventController.addAdverseEvent,
  )
  .get("/getAllAdverseEvent", adverseEventController.getAllAdverseEvent)
  .get("/getAdverseEvent/:id", adverseEventController.getAdverseEventById)
  .patch(
    "/updateAdverseEvent/:id",
    upload.fields([
      { name: "supportiveDocuments", maxCount: 1 },
      { name: "signature", maxCount: 1 },
    ]),
    adverseEventController.updateAdverseEventById
  )
  .delete(
    "/deleteAdverseEvent/:id",
    adverseEventController.deleteAdverseEventById
  );

export default router;
