import warrantySchema from "../../models/products/warranty.model.js"

const routes = {};

routes.addWarranty = async (req, res) => {
  try {
    const { name, description,duration } = req.body;
    if(!name&&!description&&!duration)
           return res.status(400).json({error:"All fields are required"})

    const existDoc = await warrantySchema.findOne({name});

    if (existDoc)
      return res
        .status(400)
        .json({ error: "Name is already exist " });
    const newDoc = await warrantySchema.create({
      name,
      description,
      duration
    });

    return res
      .status(201)
      .json({ result: newDoc, message: "New Doc created successfully" });
  } catch (error) {
    console.log("Error =", error)
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

routes.getAllWarranty = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const allDoc = await warrantySchema
      .find()
      .skip(limit * (page - 1))
      .limit(limit);
    return res
      .status(200)
      .json({ result: allDoc, message: "All Document fetched suceesFully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getWarrantyById = async (req, res) => {
  try {
    const warrantyId = req.params.id;
    if (!warrantyId)
      return res.status(400).json({ error: "Warranty id is required" });
    const doc = await warrantySchema.findById(warrantyId);

    if (!doc)
      return res
        .status(404)
        .json({ error: "Document Not found with that id " });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateWarrantyById = async (req, res) => {
  try {
    const warrantyId = req.params.id;

    if (!warrantyId)
      return res.status(400).json({ error: "Warranty id is required" });
    const doc = await warrantySchema.findByIdAndUpdate(warrantyId, req.body, {
      new: true,
    });
    if (!doc)
      return res.status(404).json({ error: "Document Not found with that id" });
    return res
      .status(200)
      .json({ result: doc, message: "Document update succesfully " });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteWarrantyById = async (req, res) => {
  try {
    const warrantyId = req.params.id;
    if (!warrantyId)
      return res.status(400).json({ error: "Warranty id is required" });
    const doc = await warrantySchema.findByIdAndDelete(warrantyId);
    if (!doc)
      return res.status(404).json({ error: "Document Not found with that id" });
    return res
      .status(200)
      .json({ result: doc, message: "Document delete succesfully " });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes 
