import unitSchema from "../../models/products/unit.model.js";

const routes = {};

routes.addUnit = async (req, res) => {
  try {
    const { name, shortName, allowDecimal } = req.body;
    if (!name && !shortName)
      return res.status(400).json({ error: "All field is required " });
    const existDoc = await unitSchema.find({ $or: [{ name }, { shortName }] });
    if (!existDoc)
      return res
        .status(400)
        .json({ error: "Name or ShortName is already exist" });
    const newDoc = await unitSchema.create({ name, shortName, allowDecimal });
    return res
      .status(201)
      .json({ result: newDoc, message: "New Document is created" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllUnit = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const allCategory = await unitSchema.countDocuments();
    const totalPage = Math.ceil(allCategory / limit);
    const allDoc = await unitSchema
      .find()
      .skip(limit * (page - 1))
      .limit(limit);
    return res
      .status(200)
      .json({
        result: allDoc,
        totalPage,
        message: "Document fetched successfully",
      });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};


routes.getUnits = async (req, res) => {
  try {
    const allDoc = await unitSchema
      .find()
      .sort({ createdAt: -1 })
    return res
      .status(200)
      .json({
        result: allDoc,
        message: "Document fetched successfully",
      });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getUnitById = async (req, res) => {
  try {
    const unitId = req.params.id;
    const doc = await unitSchema.findById(unitId);
    if (!doc)
      return res.status(404).json({ error: "Document not found with this id" });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateUnitById = async (req, res) => {
  try {
    const unitId = req.params.id;
    const { name, shortName } = req.body;

    // Fetch existing document first
    const existingDoc = await unitSchema.findById(unitId);
    if (!existingDoc)
      return res.status(404).json({ error: "Document not found with this id" });

    // Check if name is being changed and already exists elsewhere
    if (name && name !== existingDoc.name) {
      const nameExists = await unitSchema.findOne({ name });
      if (nameExists)
        return res.status(400).json({ error: "Name already exists" });
    }

    // Check if shortName is being changed and already exists elsewhere
    if (shortName && shortName !== existingDoc.shortName) {
      const shortNameExists = await unitSchema.findOne({ shortName });
      if (shortNameExists)
        return res.status(400).json({ error: "Short Name already exists" });
    }

    // Perform the update
    const updatedDoc = await unitSchema.findByIdAndUpdate(
      unitId,
      { name: name || existingDoc.name, shortName: shortName || existingDoc.shortName },
      { new: true }
    );

    return res
      .status(200)
      .json({ result: updatedDoc, message: "Document updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


routes.deleteUnitById = async (req, res) => {
  try {
    const unitId = req.params.id;
    const doc = await unitSchema.findByIdAndDelete(unitId);
    if (!doc)
      return res.status(404).json({ error: "Document not found with this id" })
    return res.status(200).json({ result: doc, message: "Document deleted successfully" })
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}


export default routes;
