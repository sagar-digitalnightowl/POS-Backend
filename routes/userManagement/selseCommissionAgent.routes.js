import express from "express";
import selseAgentController from "../../controllers/userManagement/selseCommissionAgent.controlller.js"
const router=express.Router();

   router.post("/addSelseAgent",selseAgentController.addSelseAgent)
         .get("/getAllSelseAgents",selseAgentController.getAllSelseAgent)
         .get("/getSelseAgent/:id",selseAgentController.getSelseAgentById)
         .patch("/updateSelseAgent/:id",selseAgentController.updateSelseAgent)
         .delete("/deleteSelseAgent/:id",selseAgentController.deleteSelseAgent)

export default router