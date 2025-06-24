import selseCommissionAgent from "../../models/userManagement/salseCommissionAgents.model.js";

const routes = {};

routes.addSelseAgent = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    if (!firstName)
      return res.status(400).json({ error: "First Name is required" });
    if (!lastName)
      return res.status(400).json({ error: "Last Name is required" });

    const existEmail = await selseCommissionAgent.findOne({ email });

    if (existEmail)
      return res.status(400).json({ error: "Email is already exist" });

    const newAgent = await selseCommissionAgent.create(req.body);
    return res
      .status(201)
      .json({ result: newAgent, message: "Document created succesfully " });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


routes.getAllSelseAgent = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const agentsCount = await selseCommissionAgent.countDocuments();
    const totalPage = Math.ceil(agentsCount/limit);

    const allAgents = await selseCommissionAgent
      .find()
      .skip(limit * (page - 1))
      .limit(limit);

    if (!allAgents) return res.status(404).json({ error: "Agents Not found" });

    return res.status(200).json({
      result: allAgents,
      totalPage,
      meaasage: "Document fetched successfully",
    });
  } catch (error) { 
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getSelseAgentById = async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await selseCommissionAgent.findById(agentId);
    if (!agent)
      return res.status(404).json({ error: "Agent not found with that id" });
    res
      .status(200)
      .json({ result: agent, message: "document fetched succesfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateSelseAgent = async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await selseCommissionAgent.findByIdAndUpdate(
      agentId,
      req.body,
      { new: true }
    );
    if (!agent)
      return res.status(404).json({ error: "Agent not found with that id" });
    res
      .status(200)
      .json({ result: agent, message: "document update successfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteSelseAgent = async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await selseCommissionAgent.findByIdAndDelete(agentId);
    if (!agent)
      return res.status(404).json({ error: "Agent not found with that id" });
    res.status(200).json({ message: "document is delete successfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
