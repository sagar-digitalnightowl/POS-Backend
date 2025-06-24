import mongoose from "mongoose";

const purchaseReport = new mongoose.Schema(
  {
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
    },
  },
  { timestamps: true }
);

const PurchaseReport = mongoose.model("PurchaseReport", purchaseReport);
export default PurchaseReport;
