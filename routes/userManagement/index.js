import express from "express";
import userRoutes from "./user.routes.js";
import roleRoutes from "./role.routes.js";
import selseAgentRoutes from "./selseCommissionAgent.routes.js";
const router = express.Router();

router
  .use("/user", userRoutes)
  .use("/role", roleRoutes)
  .use("/selseCommissionAgent", selseAgentRoutes);

export default router;
