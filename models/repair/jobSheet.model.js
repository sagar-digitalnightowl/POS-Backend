import mongoose, { Schema } from "mongoose";

const jobsheetSchema = new Schema({
  businessLocation: {
    type: String,
    required: true,
  },
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "CustomerAndSupplier",
    required: true,
  },
  serviceType: {
   type:String,
   enum: ['Carryin', 'Pickup', 'Onsite'],
   required:true
  },
  pickUpOrOnSiteAddress: {
    type: String,
    required: true,
  },
  brand:{
    type:mongoose.Types.ObjectId,
     ref:"Brand",
    required:true
  },
  device:{
     type:String,
     required:true,  
    },
    deviceModel:{
      type:String,
      required:true   
    },
    serialNumber:{
        type:String,
        required:true   
  },
  passwordOrPatternLock:{
     type:String,
     required:true
  },
  conditionOfTheProduct:{
      type:String,
      required:true
  },
  commentByTechnician:{
     type:String,
  },
  estimatedCost:{
      type:Number,
      required:true,
      min:[1,"Estimated cost less then 1"]
  },
  status:{
    type:String,
  },
  expectedDeliveryDate:{
      type:Date,
      required:true
  },
  document:{
      type:String,
      required:true
  },
  sendNotification:{
        type:[String],
        enum:["Sms","Email"],
        required:true  
  },
  customField1:{
      type:String,
  },
  customField2:{
      type:String,
  },
  customField3:{
      type:String,
  },
  customField4:{
      type:String,
  },
  customField5:{
      type:String,
  },
},{timestamps:true});
const JobSheet = mongoose.model("JobSheet", jobsheetSchema);
export default JobSheet;
