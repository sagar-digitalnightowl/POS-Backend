import { variationValidation } from "../../validations/joi.validations.js";
import variationSchema from "../../models/products/variation.model.js";
const routes = {};

routes.addVariation = async (req, res) => {
  try {
    const { variationName, addVariationValue } = req.body;
    const { error } = variationValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const existVariation = await variationSchema.findOne({
      $or: [{ variationName }, { addVariationValue }],
    });
    if (existVariation)
      return res
        .status(400)
        .json({ error: "variationName or addVariationValue already exist " });
    const newDoc = await variationName.create({
      variationName,
      addVariationValue,
    });
    return res
      .status(201)
      .json({ result: newDoc, message: "New Doc created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

routes.getAllVariation = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const allDoc = await variationSchema
      .find()
      .skip(limit * (page - 1))
      .limit(limit);
    return res
      .status(200)
      .json({ result: allDoc, message: "All Doc fetched suceesFully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getVariationById = async (req, res) => {
  try {
    const variationId = req.params.id;
    if (!variationId)
      return res.status(400).json({ error: "Variation id is required" });
    const doc = await variationSchema.findById(variationId);
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

routes.updateVariationById = async (req, res) => {
  try {
    const variationId = req.params.id;

    if (!variationId)
      return res.status(400).json({ error: "Variation id is required" });
    const doc = await variationSchema.findByIdAndUpdate(variationId, req.body, {
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

routes.deleteVariationById = async (req, res) => {
  try {
    const variationId = req.params.id;
    if (!variationId)
      return res.status(400).json({ error: "Variation id is required" });
    const doc = await variationSchema.findByIdAndDelete(variationId);
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
