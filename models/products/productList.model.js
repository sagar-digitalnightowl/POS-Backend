import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  SKU: {
    type: String,
    required: true,
  },
  barcodeType: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  businessLocations: {
    type: String,
    required: true,
  },
  isMedical: {
    type: String,
    enum:["Yes","No"]
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerAndSupplier",
    required: true,
  },
  manageStock: {
    type: Boolean,
    default: false,
  },
  alertQuantity: {
    type: Number,
    required: true,
  },
  deviceModel: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
  },
  productImage: {
    type: String,
  },
  productBrochure: {
    type: String,
  },
  enableProductDescriptionImeiOrSerialNumber: {
    type: Boolean,
    defualt: false,
  },
  notForSelling: {
    type: Boolean,
    defualt: false,
  }, 
  weight: {
    type: Number,
    required: true,
  },
  serviceStaffTimerPreparationTime: {
    type: Number,
  },
  batchNo: {
    type: String,
  },
  productModel: {
    type: String,
  },
  productSerialNo: {
    type: String,
  },
  productHSCode: {
    type: String,
  },
  productGMDNCode: {
    type: String,
  },
  productUseType: {
    type: String,
  },
  productType: {
    type: String,
  },
  productRiskClassification: {
    type: String,
  },
  shelfLife: {
    type: String,
  },
  productMarketEntryDate: {
    type: Date,
  },
  applicableTax: {
    type: String,
  },
  sellingPriceTaxType: {
    type: String,
    enum: ["exclusive", "inclusive"],
  },
  productType: {
    type: String,
    enum: ["single", "multiple", "combo"],
  },
  defaultPurchasePrice: {
    type: {
      excTax: {
        type: Number,
      },
      incTax: {
        type: Number,
      },
    },
  },
  margin: {
    type: Number,
  },
  defaultSellingPrice: {
    type: {
      excTax: {
        type: Number,
      },
    },
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
