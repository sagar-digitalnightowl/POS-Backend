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

    device:{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    numberOfDevicesInvolved:{
        type:Number,
        required:true
    },
    lotNo:{
        type:String
    },
    nhraRegistrationCertificateNo:{
        type:String
    },
    // file 
    supremeCouncilOfEnvironmentApproval:{
        type:String
    },

    manufacturer:{
        type:Schema.Types.ObjectId,
        ref:'Manufacturer',
        required:true
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
    // file
    airwayBill:{
        type:String
    },
    // file 
    destructionInvoice:{
        type:String
    },

    healthCareFacility:{
        type:Schema.Types.ObjectId,
         ref:'HealthFacility',
         required:true
    },
    healthCareFacilitycrNo:{
        type:Number
    },
    nhraLicenseNo:{
        type:Number
    },
    authorizedRepresentative:{
        type:Schema.Types.ObjectId,
        ref:'AuthorizedRepresentative'
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