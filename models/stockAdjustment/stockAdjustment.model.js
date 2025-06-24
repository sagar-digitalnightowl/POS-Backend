import mongoose, { Schema } from "mongoose";

const stockAdjustmentSchema = new Schema({
  businessLocation: {
    type: String,
    required: true,
  },
  referenceNo: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  adjustmentType: {
    type: String,
    enum: ["Normal", "Abnormal"],
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: { type: Number, default: 1 },
      totalAmount: { type: Number, default: 0 },
    },
  ],
  totalAmount: {
    type: Number,
    default: 0
  },
  totalAmountRecovered: {
    type: Number,
    default: 0
  },
  reason: {
    type: String,
  },
});

const StockAdjustment = mongoose.model(
  "StockAdjustment",
  stockAdjustmentSchema
);
export default StockAdjustment;
