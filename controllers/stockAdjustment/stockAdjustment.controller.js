import stockAdjustmentModel from "../../models/stockAdjustment/stockAdjustment.model.js";

const routes = {};

routes.addStockAdjustment = async (req, res) => {
  try {
    const {
      businessLocation,
      referenceNo,
      startDate,
      endDate,
      adjustmentType,
      products,
      totalAmountRecovered,
      reason,
    } = req.body;

    if (products.length === 0)
      return res.status(400).json({ error: "Add atleast one product" });

    let totalAmount = 0;
    products.forEach((product) => {
      totalAmount += Number(product.totalAmount) || 0;
    });

    const newStockAdjustment = new stockAdjustmentModel({
      businessLocation,
      referenceNo,
      startDate,
      endDate,
      products,
      adjustmentType,
      totalAmount,
      totalAmountRecovered,
      reason,
    });
    await newStockAdjustment.save();

    res.status(201).json({
      result: newStockAdjustment,
      message: "Stock Adjusted Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};




routes.getAllStockAdjustment = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalStockAdjustment = await stockAdjustmentModel.countDocuments();
    const totalPage = Math.ceil(totalStockAdjustment / limit);

    const allStock = await stockAdjustmentModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    return res
      .status(200)
      .json({
        result: allStock,
        totalPage,
        message: "Stock data retrived successfully",
      });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};




routes.getStockAdjustmentById = async (req, res) => {
  try {
    const stockAdjustmentId = req.params.id;

    if (!stockAdjustmentId) {
      res.status(400).json({ error: "Stock Adjustment ID is required" });
    }
    const stockAdjustment = await stockAdjustmentModel.findById(
      stockAdjustmentId
    );

    if (!stockAdjustment) {
      res.status(400).json({
        error: `Stock Adjustment is not found with Id ${stockAdjustmentId}`,
      });
    }
    return res.status(200).json({
      result: stockAdjustment,
      message: "Stock Adjustment retrived successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};




routes.updateStockAdjustmentById = async (req, res) => {
  try {
    const stockAdjustmentId = req.params.id;
    const { products } = req.body;

    if (!stockAdjustmentId) {
      res.status(400).json({ error: "Stock Adjustment ID is required" });
    }

    let totalAmount = 0;
    products.forEach((product) => {
      totalAmount += Number(product.totalAmount) || 0;
    });

    const stockAdjustment = await stockAdjustmentModel.findByIdAndUpdate(
      stockAdjustmentId,
      {
        ...req.body,
        totalAmount,
      },
      { new: true }
    );

    if (!stockAdjustmentId)
      return res.status(404).json({
        error: `Stock Adjustment not found with id:${stockAdjustmentId}`,
      });
    return res.status(200).json({
      result: stockAdjustment,
      message: "Stock Adjustment Updated Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};




routes.deleteStockAdjustmentById = async (req, res) => {
  try {
    const stockAdjustmentId = req.params.id;

    if (!stockAdjustmentId) {
      res.status(400).json({ error: "Stock Adjustment Id Required" });
    }
    const stockAdjustment = await stockAdjustmentModel.findByIdAndDelete(
      stockAdjustmentId
    );

    if (!stockAdjustment)
      return res.status(404).json({
        error: `Stock Adjustment not found with id:${stockAdjustmentId}`,
      });
    return res.status(200).json({
      result: stockAdjustment,
      message: "Stock Adjustment Updated Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

export default routes;
