import sellingPriceGroupSchema from "../../models/products/sellingPriceGroup.model.js";

const routes = {};
routes.addSellingPriceGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name && !description)
      return res.status(400).json({ error: "all fields are required " });
    const existDoc = await sellingPriceGroupSchema.findOne({ name });
    if (existDoc) return res.status(400).json({ error: "name already exist" });
    const newDoc = await sellingPriceGroupSchema.create({ name, description });
    return res
      .status(201)
      .json({ result: newDoc, message: "Document created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllSellingPriceGroup = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const allDoc = await sellingPriceGroupSchema
      .find()
      .skip(limit * (page - 1))
      .limit(limit);
    return res
      .status(200)
      .json({ result: allDoc, message: "Document fetch Successfully " });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getSellingPriceGroupById = async (req, res) => {
  try {
    const doc = await sellingPriceGroupSchema.findById(req.params.id);
    if (!doc)
      return res.status(404).json({ error: "Document fetch successfully" });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateSellingPriceGroupById = async (req, res) => {
  try {
    const sellingId = req.params.id
    const { name, description } = req.body;
    const isExistDoc = await sellingPriceGroupSchema.findOne({ name });
    if (isExistDoc)
      return res.status(400).json({ error: "Name is Already exist" });
    const updatedDoc = await sellingPriceGroupSchema.findByIdAndUpdate(
      sellingId,
      { name, description },
      { new: true }
    );
    if (!updatedDoc)
      return res.status(404).json({ error: "Document not found with this id" });
    return res
      .status(200)
      .json({ result: updatedDoc, message: "Document update Sucessfully" });
  } catch (error) {
    console.log("Error = ",error)
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteSellingPriceGroupById = async (req, res) => {
  try {
    const doc = await sellingPriceGroupSchema.findByIdAndDelete(req.params.id);
    if (!doc)
      return res.status(400).json({ error: "Document not found with this id" });
    return res
      .status(200)
      .json({ result: doc, message: "document deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
