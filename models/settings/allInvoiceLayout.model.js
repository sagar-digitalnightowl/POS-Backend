import mongoose, { Schema } from "mongoose";

const allInvoiceLayoutSchema = new Schema({
  layoutName: {
    type: String,
    required: true,
  },
  design: {
    type: String,
    enum: [
      "Classic (For normal printer)",
      "Elegant (For normal printer)",
      "Detailed (For normal printer)",
      "Columnize Taxes (For normal printer)",
      "Slim (Recommended for thermal line receipt printer, 80mmpaper size)",
      "Slim 2 (Recommended for thermal line receipt printer,80mm and 58mm paper size)",
      "Slim 3 (Recommended for thermal line receipt printer,58mm paper size)",
      "Full Custom (For normal printer)",
      "Basic (For normal printer)",
      "Basic New (For normal printer)",
    ],
    required: true,
  },
  showLetterHead: {
    type: Boolean,
    default: false,
  },
  invoiceLogo: {
    type: String,
  },
  showInvoiceLogo: {
    type: Boolean,
    default: false,
  },
  headerText: {
    type: String,
  },
  heading:{
    subHeadingLine1:{type:String},
    subHeadingLine2:{type:String},
    subHeadingLine3:{type:String},
    subHeadingLine4:{type:String},
    subHeadingLine5:{type:String},
    invoiceHeading:{type:String, default:'Invoice'},
    headingSuffixForNotPaid:{type:String},
    headingSuffixForPaid:{type:String},
    proformaInvoiceHeading:{type:String, default:'Proforma invoice'},
    quotationHeading:{type:String, default:'Quotation'},
    salesOrderHeading:{type:String,default:'Sales Order'}
  },

  invoiceNoLabel: { type: String, default:'Invoice No.'},
  quotationNoLabel: { type: String,},
  dateLabel: { type: Date, require: true,},
  dueDateLabel: { type: Date,},
  showDueDate: { type: Boolean, default: false,},
  dateTimeFormat: { type: Date,},
  salesPersonLabel: { type: String,},
  commissionAgentLabel: { type: String,},
  showBusinessName: { type: Boolean, default: false,},
  showLocationName: { type: Boolean, default: true,},
  showSalesPerson: { type: Boolean, default: false,},
  showCommissionAgent: { type: Boolean, default: false,},
  customField1: { type: Boolean, default: false,},
  customField2: { type: Boolean, default: false,},
  customField3: { type: Boolean, default: false,},
  customField4: { type: Boolean, default: false,},

  customerDetails: {
    showCustomerInfo: { type: Boolean, default: false },
    customerLabel: { type: String, default: "Customer" },
    showClientId: { type: Boolean, default: false },
    clientIdLabel: { type: String, default: "" },
    clientTaxNumberLabel: { type: String, default: "" },
    showRewardPoint: { type: Boolean, default: false },
    customFields: {
      field1: { type: Boolean, default: false },
      field2: { type: Boolean, default: false },
      field3: { type: Boolean, default: false },
      field4: { type: Boolean, default: false },
    },
  },
  locationAddressFields: {
    landmark: { type: Boolean, default: true },
    city: { type: Boolean, default: true },
    state: { type: Boolean, default: true },
    country: { type: Boolean, default: true },
    zipCode: { type: Boolean, default: true },
    crNumber: { type: Boolean, default: true },
    customFields: {
      field1: { type: Boolean, default: false },
      field2: { type: Boolean, default: false },
      field3: { type: Boolean, default: false },
      field4: { type: Boolean, default: false },
    },
  },
  communicationDetailsFields: {
    mobileNumber: { type: Boolean, default: true },
    alternateNumber: { type: Boolean, default: false },
    tel: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
  },
  taxDetailsFields: {
    tax1Details: { type: Boolean, default: true },
    tax2Details: { type: Boolean, default: false },
  },

  productLabel: { type: String, default: "Product" },
  quantityLabel: { type: String, default: "Quantity" },
  unitPriceLabel: { type: String, default: "Unit Price" },
  subtotalLabel: { type: String, default: "Subtotal" },
  categoryOrHSNcodeLabel: { type: String, default: "HSN" },
  totalQuantityLabel: { type: String, default: "Total Quantity" },
  itemDiscountLabel: { type: String, default: "Discount" },
  itemSKUlabel: { type: String },
  discountedUnitPriceLabel: { type: String, default: "Price after discount" },

  shownProductDetails: {
    showBrand: { type: String, default: false },
    showSKU: { type: String, default: true },
    showCategoryCodeOrHSNcode: { type: String, default: false },
    showSaleDescription: { type: String, default: false },
    showProductDescription: { type: String, default: false },
    customFields: {
      field1: { type: Boolean, default: false },
      field2: { type: Boolean, default: false },
      field3: { type: Boolean, default: false },
      field4: { type: Boolean, default: false },
    },
    customFieldsShow: {
      type: String,
      enum: [
        "Up From Product Name",
        "Below Product Name",
        "Before Product Column",
        "After Product Column",
      ],
    },
    show: {
      productImage: { type: "String", default: false },
      warrantyName: { type: "String", default: false },
      warrantyExpiryDate: { type: "String", default: false },
      warrantyDescription: { type: "String", default: false },
      baseUnitDetails: { type: "String", default: false },
    },
  },
  label: {
    subtotal: { type: String, default: "Subtotal" },
    discount: { type: String, default: "Discount" },
    tax: { type: String, default: "Tax" },
    total: { type: String, default: "Total" },
    totalitems: { type: String, default: "Total items" },
    roundOff: { type: String, default: "Round Off" },
    totalDueCurrentSale: { type: String, default: "Due" },
    amountPaid: { type: String, default: "Amount Paid" },
    totalDueAllsales: { type: String },
    changeReturn: { type: String, default: "Change return" },
    taxSummary: { type: String },
  },
  showPaymentInformation: {
    type: Boolean,
    default: true,
  },
  showBarcode: {
    type: Boolean,
    default: false,
  },
  showTotalBalanceDueAllSales: {
    type: Boolean,
    default: false,
  },
  showTotalInWords: {
    type: Boolean,
    default: false,
  },
  wordFormat: {
    type: String,
    enum: ["International","Indian"],
  },
  footerText:{
    type:String
  },
  setAsDefault:{
    type:Boolean,
    default:false
  },
  qrCode:{
    showQRcode:{type:Boolean,default:false},
    showLabels:{type:Boolean,default:false},
    zatca:{type:Boolean,default:false},
  },
  fieldsToBeShown:{
    businessName:{type:Boolean,default:false},
    businessLocationAddress:{type:Boolean,default:false},
    businessTax1:{type:Boolean,default:false},
    businessTax2:{type:Boolean,default:false},
    invoiceNo:{type:Boolean,default:false},
    invoiceDatetime:{type:Boolean,default:false},
    subtotal:{type:Boolean,default:false},
    totalAmountWithTax:{type:Boolean,default:false},
    totalTax:{type:Boolean,default:false},
    customerName:{type:Boolean,default:false},
    invoiceURL:{type:Boolean,default:false}
  },
  repairModuleSettings:{
    showRepairStatus:{type:Boolean,default:true},
    repairStatusLabel:{type:String,default:'Repair Status'},
    showRepairWarranty:{type:Boolean,default:true},
    repairWarrantyLabel:{type:String,default:'Repair Warranty'},
    showBrand:{type:Boolean,default:true},
    brandLabel:{type:String,default:'Brand'},
    showDevice:{type:Boolean,default:true},
    deviceLabel:{type:String,default:'Device'},
    showModel:{type:Boolean,default:true},
    modelNumberLabel:{type:String,default:'Model No.'},
    showSerialNumber:{type:Boolean,default:true},
    serialNumberLabel:{type:String,default:'Serial No.'},
    showDefects:{type:Boolean,default:true},
    defectLabel:{type:String,default:'Defects'},
    showRepairChecklist:{type:Boolean,default:true},
    repairChecklistLabel:{type:String,default:'Repair Checklist'}
  },
  creditNoteSellReturnDetails:{
    heading:{type:String,default:'Credit Note'},
    referenceNumber:{type:String,default:'Reference No'},
    totalAmount:{type:String,default:'Credit Amount'}
  }
},{timestamps:true});

const AllInvoiceLayout = mongoose.model("AllInvoiceLayout",allInvoiceLayoutSchema);
export default AllInvoiceLayout;
