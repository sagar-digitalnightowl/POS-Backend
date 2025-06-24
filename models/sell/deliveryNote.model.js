import mongoose, { Schema } from "mongoose";

const deliveryNoteSchema = new Schema(
  {
    saleOrder: {
      type: mongoose.Types.ObjectId,
      ref: "Sale",
      required: true,
    },
    saleOrderDate: {
      type: Date,
      required: true,
    },
    mode: {
      type: String,
    },
    invoiceScheme: {
      type: String,
    },
    deliveryNoteNumber: {
      type: String,
    },
    deliveryDate: {
      type: Date,
      default: Date.now,
    },
    termsOfPayment: {
      type: String,
    },
    lPONo: {
      type: String,
    },
    despatchDocumentNo: {
      type: String,
    },
    despatchedThrough: {
      type: String,
    },
    termsOfDelivery: {
      type: String,
    },
    commentNote: {
      type: String,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        totalAmount: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const SellDelivery = mongoose.model("Delivery", deliveryNoteSchema);
export default SellDelivery;
