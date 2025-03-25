import { manufacturerValidation } from "../../validations/joi.validations.js";
import manufacturerSchema from "../../models/contacts/manufacturer.model.js";

const routes = {};

routes.addManufacturer = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    const { error } = manufacturerValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const isEmailExists = await manufacturerSchema.findOne({ email });
    if (isEmailExists)
      return res.status(400).json({ error: "Email Already Exist" });

    const newDoc = await manufacturerSchema.create(req.body);
    return res
      .status(201)
      .json({ result: newDoc, message: "Document created successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllManufacturer = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const allDoc = await manufacturerSchema
      .find()
      .skip(limit * (page - 1))
      .limit(limit);
    return res
      .status(200)
      .json({ result: allDoc, message: "All Data fetched Successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await manufacturerSchema.findById(id);
    if (!doc) return res.status(404).json({ error: "Document not Found" });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched Successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedDoc = await manufacturerSchema.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedDoc)
      return res.status(404).json({ error: "Document not Found with this id" });
    return res
      .status(200)
      .json({ result: updatedDoc, message: "Document updated Successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
routes.deleteManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoc = await manufacturerSchema.findByIdAndDelete(id);
    if (!deletedDoc)
      return res.status(404).json({ error: "Document not found with this id" });
    return res.status(200).json({ message: "Document Delete Successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export default routes