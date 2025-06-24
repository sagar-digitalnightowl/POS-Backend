import stockTransferModel from "../../models/stockTransfer/stockTransfer.model.js";

const routes = {};

routes.addStockTransfer = async (req, res) => {
  try {
    const {
      date,
      referenceNo,
      status,
      locationFrom,
      locationTo,
      products,
      shippingCharges,
      additionalNotes,
    } = req.body;

    if (products.length === 0) {
      return res.status(400).json({ error: "Add atleast one product" });
    }

    let totalProductAmount = 0;
    products.forEach((product) => {
      totalProductAmount += Number(product?.totalAmount) || 0;
    });

    const totalStockTransferAmount =
      totalProductAmount + (Number(shippingCharges) || 0);

    const newStockTransfer = new stockTransferModel({
      date,
      referenceNo,
      status,
      locationFrom,
      locationTo,
      products,
      shippingCharges,
      additionalNotes,
      totalStockTransferAmount,
    });
    await newStockTransfer.save();

    res
      .status(201)
      .json({ message: "Stock added successfully", result: newStockTransfer });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

routes.getAllStockTransfer = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await stockTransferModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const allStock = await stockTransferModel.find();

    return res.status(200).json({
      result: allStock,
      totalPage,
      message: "Stock data retrived successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

routes.getStockTransferById = async (req, res) => {
  try {
    const stockId = req.params.id;

    if (!stockId) {
      res.status(400).json({ error: "Stock ID is required" });
    }
    const stock = await stockTransferModel.findById(stockId);

    if (!stock) {
      res.status(400).json({ error: `Stock is not found with Id ${stockId}` });
    }
    return res
      .status(200)
      .json({ result: stock, message: "Stock retrived successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

routes.updateStockTransferById = async (req, res) => {
  try {
    const stockId = req.params.id;
    const { products, shippingCharges } = req.body;

    if (!stockId) {
      res.status(400).json({ error: "Stock ID is required" });
    }

    if (products.length === 0) {
      return res.status(400).json({ error: "Add atlest one product" });
    }

    let totalProductAmount = 0;
    products.forEach((product) => {
      totalProductAmount += Number(product?.totalAmount) || 0;
    });

    const totalStockTransferAmount =
      totalProductAmount + (Number(shippingCharges) || 0);

    const stock = await stockTransferModel.findByIdAndUpdate(
      stockId,
      {
        ...req.body,
        totalStockTransferAmount,
      },
      { new: true }
    );

    if(!stock){
        return res.status(404).json({
            error: `Stock not found with id:${stockId}`
        })
    }

    return res
      .status(200)
      .json({ result: stock, message: "Stock Updated Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

routes.deleteStockTransferById = async (req, res) => {
  try {
    const stockId = req.params.id;

    if (!stockId) {
      res.status(400).json({ error: "Stock Id Required" });
    }
    const stock = await stockTransferModel.findByIdAndDelete(stockId);

    if (!stock)
      return res
        .status(404)
        .json({ error: `Stock not found with id:${stockId}` });

    return res
      .status(200)
      .json({ result: stock, message: "Stock Updated Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

export default routes;
