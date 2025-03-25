import purchaseModel from "../../models/purchase/purchase.model.js";
import { purchaseValidation } from "../../validations/joi.validations.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from "fs";
// import { v4 as uuidv4 } from 'uuid';
// import { uploadFile } from "../../utils/s3.js";

const routes = {};

routes.addPurchase = async (req, res) => {
  try {
    const { error } = purchaseValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let attachDocument = null;

    if (req.file) {
      const file = req.file;
      const localFilePath = `./public/temp/${file.filename}`;
      const moduleName = "Purchase";

      const uploadResult = await uploadOnCloudinary(localFilePath, moduleName);
      if (uploadResult) {
        attachDocument = uploadResult.secure_url;
        fs.unlinkSync(localFilePath);
      } else {
        throw new Error("File upload to cloudinary falied");
      }
    }

    const newPurchase = new purchaseModel({
      ...req.body,
      attachDocument,
    });

    const savedPurchase = await newPurchase.save();

    return res.status(201).json({
      result: savedPurchase,
      message: "Purchase document created successfully",
    });
  } catch (error) {
    console.error("Error creating purchase:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllPurchase = async (req, res) => {
  try {
    const purchases = await purchaseModel
      .find()
      .populate("supplier")
      .populate("businessLocation");

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: "No purchases found" });
    }

    return res
      .status(200)
      .json({ result: purchases, message: "Purchases retrieved successfully" });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getPurchaseById = async (req, res) => {
  try {
    const purchaseId = req.params.id;

    if (!purchaseId) {
      return res.status(400).json({ error: "Purchase ID is required" });
    }

    const purchase = await purchaseModel
      .findById(purchaseId)
      .find()
      .populate("supplier")
      .populate("businessLocation");

    if (!purchase) {
      return res
        .status(404)
        .json({ error: `Purchase not found with ID: ${purchaseId}` });
    }

    return res
      .status(200)
      .json({ result: purchase, message: "Purchase Retrieved Successfully" });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updatePurchaseById = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    if (!purchaseId)
      return res.status(400).json({ error: "Purchase Id is required" });
    const purchase = await purchaseModel.findByIdAndUpdate(
      purchaseId,
      req.body,
      { new: true }
    );

    if (!purchase)
      return res
        .status(404)
        .json({ error: `Purchase not found with id:${purchaseId}` });
    return res
      .status(200)
      .json({ result: purchase, message: "Purchase Updated Successfully" });
  } catch (error) {
    console.log("error=", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deletePurchaseById = async (req, res) => {
  try {
    const purchaseId = req.params.id;

    if (!purchaseId) {
      res.status(200).json({ error: "Purchase Id is required" });
    }

    const deletePurchase = await purchaseModel.findByIdAndDelete(purchaseId);

    if (!deletePurchase) {
      return res
        .status(404)
        .json({ error: `Purchase not found with ID: ${purchaseId}` });
    }
    return res
      .status(200)
      .json({
        result: deletePurchase,
        message: "Purchase Deleted Successfully",
      });
  } catch (error) {
    console.log("error = ", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
