import mongoose, { Schema } from "mongoose";

const importationSchema = new Schema({
    invoiceNo: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: Date,
    },
    deliveryMethod: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    cRNumber: {
      type: Number,
    },
    ofoqLicenseNumber: {
      type: String,
    },
    grn: {
      type: String,
    },
    lpo: {
      type: String,
    },
    portOfDelivery: {
      type: String,
    },
    dateOfDelivery: {
      type: Date,
    },
    totalPayment: {
      type: Number,
    },
    totalTax: {
      type: Number,
    },
    invoice: {
      type: String,
    },
    purchaseOrder: {
      type: String,
    },
    catalogue: {
      type: String,
    },
    freeSaleCertificate: {
      type: String,
    },
    qualityAssuranceCertificate: {
      type: String,
    },
    authorizedRepresentative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthorizedRepresentative",
    },
    manufacturer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manufacturer"
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number },
        expiry: { type: Date },
        lotNo: { type: String },
      },
    ], 
  },
  { timestamps: true }
);

const Importation = mongoose.model("Importation", importationSchema);
export default Importation;
