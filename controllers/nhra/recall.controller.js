import recallModel from "../../models/nhra/recall.model.js";
import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import productModel from "../../models/products/productList.model.js";
import { result } from "ttr";

const routes = {};

routes.addRecall = async (req, res) => {
  try {
    const { recalls, manufacturer, batchNo } = req.body;

    if (recalls === "By Manufacturer") {
      const existManufacturer = await manufacturerModel.findById(manufacturer);
      if (!existManufacturer) {
        return res.status(404).json({ error: "Manufacturer not found" });
      }
    }

    if (recalls === "By Batch No") {
      const batch = await productModel.findById(batchNo);
      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }
    }


    const recallData = { recalls };

    if (recalls === "By Manufacturer") {
      recallData.manufacturer = manufacturer;
    }

    if (recalls === "By Batch No") {
      recallData.batchNo = batchNo;
    }

    const newRecall = new recallModel(recallData);

    await newRecall.save();

    return res.status(201).json({
      result: newRecall,
      message: "Recall add successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllRecalls = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await recallModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const recalls = await recallModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("manufacturer", "name")
      .populate("batchNo", "batchNo");

    return res.status(200).json({
      result: recalls,
      totalPage,
      message: "Data retrived successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getRecallById = async (req, res) => {
  try {
    const recallId = req?.params?.id;

    if (!recallId) {
      return res.status(400).json({
        error: "Recall Id is required",
      });
    }

    const recall = await recallModel.findById(recallId);

    if (!recall) {
      return res.status(404).json({
        error: `Recall not found with id : ${recallId}`,
      });
    }

    return res.status(200).json({
      result: recall,
      message: "Recall fetched successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateRecall = async (req, res) => {
  try {
    const recallId = req?.params?.id;

    if (!recallId) {
      return res.status(400).json({
        error: "Id is required",
      });
    }
    const existRecall = await recallModel.findById(recallId);

    if (!existRecall) {
      return res.status(404).json({
        error: `Recall not found with id : ${recallId}`,
      });
    }

    const { recalls, manufacturer, batchNo } = req.body;

    if (recalls === "By Manufacturer") {
      const existManufacturer = await manufacturerModel.findById(manufacturer);
      if (!existManufacturer) {
        return res.status(404).json({ error: "Manufacturer not found" });
      }
    }

    if (recalls === "By Batch No") {
      const batch = await productModel.findById(batchNo);
      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }
    }

    const recallData = { recalls };

    if (recalls === "By Manufacturer") {
      recallData.manufacturer = manufacturer;
    }

    if (recalls === "By Batch No") {
      recallData.batchNo = batchNo;
    }

    const updatedRecall = await recallModel.findByIdAndUpdate(
      recallId,
      recallData,
      { new: true }
    );

    return res.status(200).json({
      result: updatedRecall,
      message: "Recall updated successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteRecall = async (req, res) => {
  try {
    const recallId = req.params.id;

    if (!recallId) {
      return res.status(400).json({
        error: "Id is required",
      });
    }
    const deletedRecall = await recallModel.findByIdAndDelete(recallId);

    if (!deletedRecall) {
      return res.status(404).json({
        error: `Recall not found with id : ${recallId}`,
      });
    }

    return res.status(200).json({
      result: deletedRecall,
      message: "Recall deleted successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
