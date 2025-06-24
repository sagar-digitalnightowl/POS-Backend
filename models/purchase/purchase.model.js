import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerAndSupplier",
      required: true,
    },
    referenceNo: {
      type: String,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    purchaseStatus: {
      type: String,
      enum: ["Received", "Pending", "Ordered"],
      required: true,
    },
    businessLocation: {
      type: String,
      required: true,
    },
    payTerm: {
      value: {
        type: Number,
        min: 1,
      },
      unit: {
        type: String,
        enum: ["Months", "Days"],
      },
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
    payments: {
      amount: { type: Number },
      paidOn: { type: Date, default: Date.now },
      paymentMethod: {
        type: String,
        enum: [
          "",
          "Advance",
          "Cash",
          "Card",
          "Cheque",
          "Bank Transfer",
          "Other",
          "Benefit Pay",
          "Custom Payment 1",
          "Custom Payment 2",
          "Custom Payment 3",
          "Custom Payment 4",
          "Custom Payment 5",
          "Custom Payment 6",
          "Custom Payment 7",
        ],
      },
      paymentNote: { type: String }
    },
    totalPurchaseAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
