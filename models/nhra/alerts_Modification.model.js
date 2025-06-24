import mongoose, { Schema } from 'mongoose'
import { validate } from 'uuid';

const alert_ModificationSchema = new Schema({
    applicantName:{
        type:String,
        required:true
    },
    applicantEmail:{
        type:String,
        required:true
    },
    applicantMobNo:{
        type:Number,
        required:true
    },
    applicantCPRnumber:{
        type:String,
        required:true
    },
    eventDate:{
        type:Date,
        default:Date.now
    },
    device:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    },

    authorizedRepresentative:{
        type:Schema.Types.ObjectId,
        ref:'AuthorizedRepresentative'
    },
    
    manufacturer:{
        type:Schema.Types.ObjectId,
        ref:'Manufacturer'
    },


    alertRiskClassification:{
        type:String,
        enum:[
            "Class A (Low Individual Risk andLow Public Health Risk)",
            "Class B (Moderate Individual Risk and/or Low Public Health Risk)",
            "Class C (High Individual Risk and/or Moderate Public Health Risk)",
            "Class D (High Individual Risk and High Public Health Risk)",
            "Class I (Low Risk Medical Device)",
            "Class IIa (Low to Medium Risk Device)",
            "Class IIb (Medium to High Risk Device)",
            "Class III (High Risk Device)",
        ]
    },
    reason:{
        type:[String],
        enum:[
            "Poor Design",
            "Medical Device Expired",
            "Inappropriate Modification",
            "Poor User Instruction and Training",
            "Misuse of Medical Device",
            "Inadequate Maintenance",
            "Medical Device Failure",
            "Use Error",
            "Unsuitable Storage & Use Conditions"
        ]
    },
    change:{
        type:String,
        enum:[
            "Minor Variation",
            "Major Variation"
        ]
    },
    wasAnyoneInjured:{
        type:String,
        enum:[
            "Yes",
            "No"
        ]
    },
    ifYesWasTheInjury:{
        type:String,
        enum:[
            "Death",
            "Serious",
            "Minor"
        ],
        required: function () {
            return this.wasAnyoneInjured === "Yes"
        } 
    },
    nhraReportingStatus:{
        type:String,
        enum:[
            "Reported",
            "Not Reported",
            "N/A"
        ]
    },
    severity:{
        type:String
    },
    patternOfEvents:{
        type:String
    },
    categoryOfEvent:{
        type:String
    },
    whereIsTheDeviceNow:{
        type:String
    },
    descriptionOfEvent:{
        type:String
    },
    descriptionOfChange:{
        type:String
    },
    modification:{
        type:String,
        enum:[
            "Manufacturer Change",
            "Material Change",
            "Medical Device Design Change",
            "Software Upgrade",
            "Change in Sterlization Process",
            "New Model / Updated Version of Medical Device",
            "Storage Change",
            "Shelf Life Change",
            "Other Change"
        ]
    },
    otherModification:{
        type:String,
        required:function(){
            return this.modification === "Other Change";
        }
    },
    modificationDescription:{
        type:String
    },

    // file 
    modificationDocument:{
        type:String
    }
},{timestamps:true})

const Alert_Modification = mongoose.model('Alert_Modification',alert_ModificationSchema)
export default Alert_Modification;