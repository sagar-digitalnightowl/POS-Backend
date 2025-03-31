import mongoose, { Schema } from "mongoose";

const customerAndSupplierSchema = new Schema({
  contactId: {
    type: String,
    // unique: true,
    // required:true
  },
  businessName: {
    type: String,
  },
  contactType: {
    type: String,
    enum:["supplier","customer"],
    required:true
  },
  individual: {
    type: Boolean,
    default: false,
  },
  business: {
    type: Boolean,
    default: false,
  },
  prefix: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
  alternateContactNo: {
    type: Number,
  },
  email: {
    type: String,
    unique:true,
    required:true
  },
  taxNumber: {
    type: Number,
  },
  openingBalance: {
    type: Number,
    default:0
  },
  advanceBalance: {
    type: Number,
    default:0
  },
  totalPurchaseDue: {
    type: Number,
  },
  totalPurchaseReturnDue: {
    type: String,
  },
  payTerm: {
    type: String,
  },
  creditLimit:{
    type:String
  },
  addressLine1: {
    type: String,
  },
  addressLine2: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  customField1: {
    type: String,
  },
  customField2: {
    type: String,
  },
  customField3: {
    type: String,
  },
  customField4: {
    type: String,
  },
  status: {
    type: String,
    default: "inactive",
  },
  assignedTo: {
    type: String,
  },
  contactPerson1: {
    type: {
      prefix: {
        type: String,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      mobileNo: {
        type: Number,
        required: true,
      },
      alternateContactNo: {
        type: String,
      },
      familyContactNo: {
        type: String,
      },
      department: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        required: true,
      },
      salesCommission: {
        type: String,
      },
      allowLogin: {
        type: Boolean,
        default: false,
      },
    },
  },
},{timestamps:true});
const CustomerAndSupplier = mongoose.model("CustomerAndSupplier", customerAndSupplierSchema);
export default CustomerAndSupplier;
