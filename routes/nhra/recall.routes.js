import express from "express";
import recallController from "../../controllers/nhra/recall.controller.js";

const router = express.Router();

router
  .post("/addRecall", recallController.addRecall)
  .get("/getAllRecall", recallController.getAllRecalls)
  .get("/getRecallById/:id", recallController.getRecallById)
  .patch("/updateRecall/:id", recallController.updateRecall)
  .delete("/deleteRecall/:id", recallController.deleteRecall);

export default router;
