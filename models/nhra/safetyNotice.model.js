import mongoose, { Schema } from "mongoose";

const safetyNoticeSchema = new Schema({
  reportType: {
    type: String,
    enum: ["Recall", "Corrective Action", "Alert"],
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
  reporterIssuer:{
    type:String,
    enum:["Regulatory Authority","Manufacturer"]
  },
  regulatoryAuthority:{
    type:String,
    enum:["FDA","SFDA","MHRA","GHC","Swissmedic","TGA","N/A"]
  },
  reportReferenceLink:{
    type:String
  },
  //pdf file
  copyOfReport:{
    type:String
  },

  manufacturer:{
    type:Schema.Types.ObjectId,
    ref:'Manufacturer'
  },

  device:{
    type:Schema.Types.ObjectId,
    ref:"Product",    
  },

  //pdf file
  lpo:{
    type:String
  },
  //Pdf file
  importationHistory:{
    type:String
  },
  //Pdf file
  nhraMedicalDeviceRegistrationLicense:{
    type:String
  },

  descriptionOfFSN:{
    type:String,
    required:true
  },
  advisedActionByTheManufacturer:{
    type:String,
    required:true
  },

  authorizedRepresentative:{
    type:Schema.Types.ObjectId,
    ref:'AuthorizedRepresentative',
    required:true
  },

  correctiveAction:{
    type:String,
    enum:[
        "Software update",
        "New IFU",
        "Spare part replacement",
        "No Action (Alert Report)"
    ]
  },
  recall:{
    type:String,
    enum:[
        "No Action",
        "Return to manufacturer",
        "Destruction in Bahrain"
    ]
  },
  //Pdf File
  returnInvoice:{
    type:String,
    required:function(){
        return this.recall === "Return to manufacturer";
    }
  },
  //Pdf File
  destructionInvoice:{
    type:String,
    required:function(){
        return this.recall === "Destruction in Bahrain";
    }
  },

  healthCareFacility:{
    type:Schema.Types.ObjectId,
    ref:'HealthFacility'
  },
 
  //PDF File
  acknowledgment:{
    type:String
  },

  contactPerson:{
    type:String
  },
  //PDF File
  signature:{
    type:String
  },
  //File
  signatureDeclarationLetter:{
    type:String
  }
},{timestamps:true});

const SafetyNotice = mongoose.model("SafetyNotice", safetyNoticeSchema);
export default SafetyNotice;
