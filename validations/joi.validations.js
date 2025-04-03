import joi from "joi";
import mongoose from "mongoose";

export const customerAndSupplierValidation = joi.object({
  contactId: joi.string(),
  businessName:joi.string(),
  contactType: joi.string().valid("supplier","customer").required(),
  individual: joi.boolean(),
  business: joi.boolean(),
  prefix: joi.string(),
  firstName: joi.string().required(),
  middleName:joi.string(),
  lastName: joi.string().required(),
  mobileNo: joi.number().required(),
  alternateContactNo: joi.number(),
  email:joi.string().email().required(),
  taxNumber:joi.number(),
  openingBalance:joi.number(),
  advanceBalance:joi.number(),
  totalPurchaseDue:joi.number(),
  totalPurchaseReturnDue:joi.string(),
  payTerm:joi.string(),
  creditLimit:joi.string(),
  addressLine1:joi.string(),
  addressLine2:joi.string(),
  city:joi.string(),
  state:joi.string(),
  country:joi.string(),
  zipCode:joi.string(),
  customField1:joi.string(),
  customField2:joi.string(),
  customField3:joi.string(),
  customField4:joi.string(),
  status:joi.string(),
  assignedTo:joi.string(),
  contactPerson1: joi.object({
    prefix: joi.string(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    mobileNo: joi.number().required(),
    alternateContactNo: joi.string(),
    familyContactNo: joi.string(),
    department: joi.string().required(),
    designation: joi.string().required(),
    salesCommission: joi.string(),
    allowLogin:joi.boolean()
  }),
});

export const manufacturerValidation = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
  telephone: joi.number(),
  fax: joi.string(),
  phoneNumber: joi.number().required(),
  email: joi.string().email().required(),
  website: joi.string(),
  city: joi.string(),
  country: joi.string(),
  // profilePhotoUrl: joi.string(),
  // letterUrl: joi.string(),
});

export const productValidation = joi.object({
  productName: joi.string().required(),
  SKU: joi.string().required(),
  barcodeType: joi.string().required(),
  unit: joi.string().required(),
  brand: joi.string().required(),
  category: joi.string().custom(objectIdValidation,"ObjectId validation").required(),
  subCategory: joi.string().required(),
  businessLocations: joi.string().required(),
  isMedical: joi.string().required(),
  manufacturer: joi.string().required(),
  supplier: joi.string().required(),
  manageStock: joi.boolean(),
  alertQuantity: joi.number().required(),
  deviceModel: joi.string().required(),
  productDescription: joi.string(),
  productImage: joi.string(),
  productBrochure: joi.string(),
  enableProductDescriptionImeiOrSerialNumber: joi.boolean(),
  notForSelling: joi.boolean(),
  weight: joi.number().required(),
  serviceStaffTimerPreparationTime: joi.number().required(),
  productModel: joi.string(),
  productSerialNo: joi.string(),
  productHSCode: joi.string(),
  productGMDNCode: joi.string(),
  productUseType: joi.string(),
  productType: joi.string(),
  productRiskClassification: joi.string(),
  shelfLife: joi.string(),
  productMarketEntryDate: joi.date(),
  applicableTax: joi.string(),
  sellingPriceTaxType: joi.string().valid("exclusive", "inclusive"),
  productType: joi.string().valid("single", "multiple", "combo"),
  defaultPurchasePrice: joi.object({
    excTax: joi.number(),
    incTex: joi.number(),
  }),
  margin: joi.number(),
  defaultSellingPrice: joi.object({
    excTax: joi.number(),
  }),
});

export const variationValidation = joi.object({
  variationName: joi.string().required(),
  addVariationValue: joi.string().required(),
});

export const productMappingValidation = joi.object({
  accountName: joi
    .string()
    .custom(objectIdValidation, "ObjectId validation")
    .required(),
    representativeName:joi.string().required(),
    itemDescription:joi.string().required(),
    mappedPercentage:joi.number().min(0).max(100).required(),

});

export const jobSheetValidation=joi.object({
  businessLocation:joi.string().required(),
  customer:joi.string().custom(objectIdValidation,"ObjectId validation").required(),
  serviceType:joi.string().valid("Carryin","Pickup","Onsite").required(),
  pickUpOrOnSiteAddress:joi.string().required(),
  brand:joi.string().custom(objectIdValidation,"ObjectId validation").required(),
  device:joi.string().required(),
  deviceModel:joi.string().required(),
  serialNumber:joi.string().required(),
  passwordOrPatternLock:joi.string().required(),
  conditionOfTheProduct:joi.string().required(),
  commentByTechnician:joi.string(),
  estimatedCost:joi.number().min(1).required(),
  status:joi.string(),
  expectedDeliveryDate:joi.date().required(),
  document:joi.string().required(),
  sendNotification:joi.array().items(joi.string().valid("Sms","Email")).min(1).required(),
  customField1:joi.string(),
  customField2:joi.string(),
  customField3:joi.string(),
  customField4:joi.string(),
  customField5:joi.string(),
})

export const invoiceValidation=joi.object({
  customer:joi.string().custom(objectIdValidation,"ObjectId validation").required(),
  productName:joi.string().required(),
  deliveryDate:joi.date().required(),
  repairCompletedOn:joi.date().required(),
  status:joi.string().required(),
  brand:joi.custom(objectIdValidation,"ObjectId validation").required(),
  device:joi.string().required(),
  deviceModel:joi.string().required(),
  serialNumber:joi.string().required(),
  problemReportedByTheCustomer:joi.string()
})

export const purchaseValidation=joi.object({
  supplier:joi.string().custom(objectIdValidation,"ObjectId validation").required(),
  referenceNo:joi.string().optional(),
  purchaseDate:joi.date().required(),
  purchaseStatus: joi.string().valid("Received", "Pending", "Ordered").required(),
  businessLocation:joi.string().custom(objectIdValidation,"ObjectId validation").required(),
  payTerm: joi.object({
    duration: joi.number().min(1).optional(),
    termType: joi.string().valid("Days", "Months").optional(),
  }).optional(),
  attachDocument:joi.string().optional(),
  discountType: joi.string().valid("None", "Fixed", "Percentage").optional(),
  discountAmount:joi.number().optional(),
  purchaseTax:joi.string().optional(),
  additionalNotes:joi.string().optional(),
  shippingDetails:joi.string().optional(),
  additionalShippingcharges:joi.number().optional(),
  amount: joi.number().min(0).required(),
  paidOn: joi.date().required(),
  paymentMethod:joi.string().required(),
  paymentNote:joi.string().optional()
})


function objectIdValidation(value, helpers){
  console.log("value=",value)
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("Object Id invalid");
  }
  return value; // Return the valid value
};
