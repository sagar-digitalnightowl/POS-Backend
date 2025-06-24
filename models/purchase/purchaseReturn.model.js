import mongoose, { Schema } from "mongoose";

const purchaseReturnSchema = new Schema({
  supplier: {
    type: mongoose.Types.ObjectId,
    ref: "CustomerAndSupplier",
    required: true,
  },
  referenceNo: {
    type: String,
  },
  purchaseReturnDate: {
    type: Date,
    required: true,
  },
  purchaseReturnStatus: {
    type: String,
    enum: ["Received", "Pending", "Ordered"],
    required: true,
  },
  attachDocument: {
    type: String,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: { type: Number, min: 1 },
      discountPercent: { type: Number },
      taxPercent: { type: Number },
      unitSellingPrice: { type: Number },
      totalAmount: { type: Number },
    },
  ],
  discountType: {
    type: String,
    enum: ["None", "Fixed", "Percentage"],
  },
  discountAmount: {
    type: Number,
  },
  purchaseTax: {
    type: String,
  },
  additionalNotes: {
    type: String,
  },
  shippingDetails: {
    type: String,
  },
  additionalShippingcharges: {
    type: Number,
  },
  additionalExpenses: [
    {
      name: { type: String },
      amount: { type: Number, default: 0 },
    },
  ],
  totalPurchaseReturnAmount: {
    type: Number,
    default: 0,
  },
});

const PurchaseReturn = mongoose.model("PurchaseReturn", purchaseReturnSchema);
export default PurchaseReturn;
