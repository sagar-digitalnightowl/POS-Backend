import SaleReportModel from "../../models/reports/SaleReport.model.js";

const routes = {};

routes.getAllSaleReports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await SaleReportModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const allSaleReports = await SaleReportModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "sale",
        populate: {
          path: "customer",
          select: "firstName middleName lastName",
        }
      });

    return res.status(200).json({
      result: allSaleReports,
      totalPage,
      message: "All Sale Report retrieved successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getSaleReportById = async (req, res) => {
  try {
    const saleReportId = req.params.id;

    if (!saleReportId) {
      return res.status(400).json({
        error: "Sale Report Id is required",
      });
    }

    const saleReport = await SaleReportModel.findById(saleReportId).populate({
      path: "sale",
      populate: {
        path: "customer",
        select: "firstName middleName lastName",
      }
    });

    if (!saleReport) {
      return res.status(404).json({
        error: `Sale report not found with id : ${saleReportId}`,
      });
    }

    return res.status(200).json({
      result: saleReport,
      message: "Sale Report retrieved successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};


export default routes;