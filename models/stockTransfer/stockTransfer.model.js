import mongoose, { Schema } from "mongoose";

const stockTransferSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  referenceNo: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "In Transit", "Completed"],
    required: true,
  },
  locationFrom: {
    type: String,
    required: true,
  },
  locationTo: {
    type: String,
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
  shippingCharges: {
    type: Number,
  },
  additionalNotes: {
    type: String,
  },
  totalStockTransferAmount: {
    type: Number,
    default: 0
  }
});

const StockTransfer = mongoose.model("StockTransfer", stockTransferSchema);
export default StockTransfer;
