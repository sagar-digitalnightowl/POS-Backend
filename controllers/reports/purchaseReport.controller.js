import PurchaseReportModel from "../../models/reports/PurchaseReport.model.js";

const routes = {};

routes.getAllPurchaseReport = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await PurchaseReportModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const allPurchaseReports = await PurchaseReportModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "purchase",
        populate: {
          path: "supplier",
          select: "firstName middleName lastName",
        },
      });

    return res.status(200).json({
      result: allPurchaseReports,
      totalPage,
      message: "Purchase Report retrieved successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getPurchaseReportById = async (req, res) => {
  try {
    const purchaseReturnId = req.params.id;

    if (!purchaseReturnId) {
      return res.status(400).json({
        error: "Purchase Return Id is required",
      });
    }

    const purchaseReturn = await PurchaseReportModel.findById(
      purchaseReturnId
    ).populate({
      path: "purchase",
      populate: {
        path: "supplier",
        select: "firstName middleName lastName",
      },
    });

    if (!purchaseReturn) {
      return res.status(404).json({
        error: `No purchase return found with id : ${purchaseReturn}`,
      });
    }

    return res.status(200).json({
      result: purchaseReturn,
      message: "Purchase report retrieved successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

export default routes;
