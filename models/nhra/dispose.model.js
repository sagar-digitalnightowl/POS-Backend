import mongoose, { Schema } from 'mongoose'

const disposeSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    cprNumber:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },

    deviceName:{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    modelNumber:{
        type:String
    },
    numberOfDevicesInvolved:{
        type:Number,
        required:true
    },
    serialNumber:{
        type:String,
    },
    lotNo:{
        type:String
    },
    nhraRegistrationCertificateNo:{
        type:String
    },
    supremeCouncilOfEnvironmentApproval:{
        type:String
    },

    manufacturerName:{
        type:Schema.Types.ObjectId,
        ref:'Manufacturer',
        required:true
    },
    manufacturerEmail:{
        type:String
    },
    reasonOfDisposal:{
        type:[String],
        enum:[
            "Defected / (Recalled)",
            "Closure of manufacturer facility",
            "Clinically / technically obsolete",
            "Unavailable spare parts",
            "Damaged/inaccurate / expired",
            "Absence of manufacturer/supplier support",
            "Other"
        ]
    },
    otherReasonOfDisposal:{
        type:String,
        required:function(){
            return this.reasonOfDisposal.includes('Other');
        }
    },
    action:{
        type:String,
        enum:[
            "No Action",
            "Return to Manufacturer",
            "Destruction"
        ]
    },
    airwayBill:{
        type:String
    },
    destructionInvoice:{
        type:String
    },

    healthCareFacilityName:{
        type:Schema.Types.ObjectId,
         ref:'HealthFacility',
         required:true
    },
    hfcContactPersonName:{
        type:String,
        required:true
    },
    healthCareFacilityAddress:{
        type:String
    },
    hfcContactPersonPosition:{
        type:String
    },
    hfcContactPersonNumber:{
        type:Number
    },
    hfcContactPersonCPR:{
        type:String
    },
    healthCareFacilityEmail:{
        type:String
    },
    healthCareFacilitycrNo:{
        type:Number
    },
    nhraLicenseNo:{
        type:Number
    },

    authorizedRepresentativeName:{
        type:Schema.Types.ObjectId,
        ref:'AuthorizedRepresentative'
    },
    mobileNumber:{
        type:Number
    },
    authorizedRepresentativeEmail:{
        type:String
    },
    dateOfReportAwareness:{
        type:Date,
        default:Date.now
    },

    companyName:{
        type:String
    },
    telephoneNo:{
        type:Number
    },
    emailAddress:{
        type:String
    },
    address:{
        type:String
    },
    crNo:{
        type:String
    },

    reportStatus:{
        type:String,
        enum:[
            "Open",
            "Closed",
            "Other"
        ]
    },
    otherReportStatus:{
        type:String,
        required:function(){
            return this.reportStatus === "Other"
        }
    }

},{timestamps:true})
const Dispose = mongoose.model('Dispose',disposeSchema)
export default Dispose;