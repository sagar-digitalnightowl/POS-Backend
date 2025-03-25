import mongoose, { Schema } from "mongoose";

const adverseEventSchema = new Schema({
  applicationType: {
    type: String,
    enum: ["Initial", "Follow Up", "Final"],
  },
  riskClassification: {
    type: String,
    enum: [
      "Select Risk Classification",
      "Class A (Low Individual Risk andLow Public Health Risk)",
      "Class B (Moderate Individual Risk and/or Low Public Health Risk)",
      "Class C (High Individual Risk and/or Moderate Public Health Risk)",
      "Class D (High Individual Risk and High Public Health Risk)",
      "Class I (Low Risk Medical Device)",
      "Class IIa (Low to Medium Risk Device)",
      "Class IIb (Medium to High Risk Device)",
      "Class III (High Risk Device)",
    ],
  },
  typeOfReporter:{
    type:String,
    enum:['Individual','AR/Supplier','Healthcare Facility']
  },
  reporterName:{
    type:String,
    required:true
  },
  reporterCPRnumber:{
    type:Number,
    required:true
  },
  reporterMobileNumber:{
    type:Number,
    required:true
  },
  reporterPositionJobTitle:{
    type:String,
    required:true
  },
  reporterEmail:{
    type:String,
    required:true
  },
  reportDate:{
    type:Date,
    default:Date.now
  },
  
  deviceName:{
    type:Schema.Types.ObjectId,
    ref:"Product",
    required:true
  },
  modelNumber:{
    type:String,
  },
  numberofDevicesInvolved:{
    type:Number,
    required:true
  },
  serialNumber:{
    type:String
  },
  gmdnCODE:{
    type:String
  },
  hsCode:{
    type:String
  },
  dateOfInstallation:{
    type:Date,
    required:true
  },
  lastPPM:{
    type:Date,
    required:true
  },
  deviceLocationDept: {
    type: [String],
    enum: [
      'Surgery', 'Pharmacy', 'O&G', 'Dialysis', 'Endoscopy', 'Cardiology',
      'Anesthesia', 'Orthopedic', 'OPD', 'ICU', 'Ophthalmology', 'Respiratory',
      'Oncology', 'Dermatology', 'Pediatric', 'Rehabilitation', 'CCU',
      'Audiology', 'Laboratory', 'Radiology', 'Emergency', 'Andrology', 'Dental', 'Other'
    ],
    required: [true],
  },
  otherLocations:{
    type:String,
    required:function(){
        return this.deviceLocationDept.includes('Other');
    }
  },
  adverseEventClassification:{
    type:String,
    enum:['Death','Need for hospitalization, surgical ormedical intervention','Serious Injury','Uncertainty of Results','Other Reportable Event']
  },
  otherAdverseEvent:{
    type:String,
    required:function(){
        return this.adverseEventClassification === 'Other Reportable Event';
    }
  },
  description:{
    type:String
  },
  immediateActionTaken:{
    type:String
  },
  supportiveDocuments:{
    type:String
  },

  healthCareFacilityName:{
    type:Schema.Types.ObjectId,
    ref:'HealthFacility'
  },
  hfcContactPersonName:{
    type:String
  },
  healthCareFacilityAddress:{
    type:String
  },
  hfcContactPersonPosition:{
    type:String
  },
  hfcContactPersonEmail:{
    type:String
  },

  authorizedRepresentativeName:{
    type:Schema.Types.ObjectId,
    ref:"AuthorizedRepresentative"
  },
  authorizedRepresentativeMobile:{
    type:Number
  },
  authorizedRepresentativeEmail:{
    type:String,
  },
  dateofReportAwareness:{
    type:Date,
  },
  correctiveActionTaken:{
    type:String
  },

  manufacturerName:{
    type:Schema.Types.ObjectId,
    ref:"Manufacturer"
  },
  contactPersonNumber:{
    type:Number,
  },
  manufacturerEmail:{
    type:String
  },
  manufacturerDateofAwareness:{
    type:Date,
    required:true
  },
  countryOfOrigin:{
    type:String
  },
  actionRecomended:{
    type:String
  },

  staffName:{
    type:String,
    required:true
  },
  staffNumber:{
    type:Number
  },
  staffPosition:{
    type:String,
    required:true
  },
  staffEmail:{
    type:String
  },
  staffCPRNumber:{
    type:Number,
    required:true
  },

  nhraRefNo:{
    type:String,
    required:true
  },
  positionJobTitle:{
    type:String,
    required:true
  },
  responsiblePerson:{
    type:String
  },
  dateOfReceiving:{
    type:Date
  },

  signature:{
    type:String
  },
  reportStatus:{
    type:String,
    enum:['Open','Closed','Other']
  },
  otherReportStatus:{
    type:String,
    required:function(){
        return this.reportStatus === 'Other';
    }
  }

},{timestamps:true});

const AdverseEvent = mongoose.model("AdverseEvent", adverseEventSchema);
export default AdverseEvent;
