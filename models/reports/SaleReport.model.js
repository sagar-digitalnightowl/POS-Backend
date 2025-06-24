import mongoose from "mongoose";

const saleReport = new mongoose.Schema(
  {
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
    },
  },
  { timestamps: true }
);


const SaleReport = mongoose.model("SaleReport", saleReport)
export default SaleReport;
