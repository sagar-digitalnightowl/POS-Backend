import customerGroupSchema from "../../models/contacts/customerGroups.model.js";
const routes = {};

routes.addCustomerGroup = async (req, res) => {
  try {
    const { customerGroupName, priceCalculationType, calculationPercentage } =
      req.body;
    if (!customerGroupName || !priceCalculationType || !calculationPercentage)
      return res.status(400).json({ error: "All fields are required" });
    const newDocument = await customerGroupSchema.create(req.body);
    res
      .status(201)
      .json({ result: newDocument, message: "document created succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllCustomerGroup = async (req, res) => {
  try {
    const { limit = 5, page = 1 } = req.query;
    const allDocument = await customerGroupSchema
      .find()
      .skip(limit * (page - 1))
      .limit(limit);
    if (!allDocument)
      return res.status(404).json({ error: "Documents not found" });
    return res
      .status(200)
      .json({ reuslt: allDocument, message: "Document fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


routes.getCustomerGroupById = async (req, res) => {
  try {
    const  customerGroupById= req.params.id;
    if (!customerGroupById)
      return res.status(400).json({ error: "Id is required" });

    const document = await customerGroupSchema.findById(customerGroupById)
    if (!document)
      return res.status(404).json({ error: "Document not found with this id" });
    return res
      .status(200)
      .json({ reuslt: document, message: "Document fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateCustomerGroupById = async (req, res) => {
  try {
    const  customerGroupById= req.params.id;

    if (!customerGroupById)
        return res.status(400).json({ error: "Id is required" });

    const document = await customerGroupSchema.findByIdAndUpdate(customerGroupById,req.body,{new:true})
    if (!document)
      return res.status(404).json({ error: "Document not found with this id" });
    return res
      .status(200)
      .json({ reuslt: document, message: "Document fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteCustomerGroupById=async(req,res)=>{
    try {
        const  customerGroupById= req.params.id;
    
        if (!customerGroupById)
            return res.status(400).json({ error: "Id is required" });
    
        const document = await customerGroupSchema.findByIdAndDelete(customerGroupById)
        if (!document)
          return res.status(404).json({ error: "Document not found with this id" });
        return res
          .status(200)
          .json({message: "Document deleted successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
      }
}



export default routes;
