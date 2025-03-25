import mongoose, { Schema } from 'mongoose'

const complaintHandlingSchema = new Schema({
    complainantName:{
        type:String,
        required:true
    },
    complainantMobNo:{
        type:Number
    },
    complainantEmail:{
        type:String,
        required:true
    },
    complainantCPRnumber:{
        type:String,
        required:true
    },
    complaintDate:{
        type:Date,
        default:Date.now
    },
    authorizedRepresentativeName:{
        type:Schema.Types.ObjectId,
        ref:'AuthorizedRepresentative',
        required:true
    },
    mobileNumber:{
        type:Number
    },
    authorizedRepresentativeEmail:{
        type:String
    },
    CRCPRno:{
        type:String
    },

    medicalDeviceName:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    },
    model:{
        type:String
    },
    serialNo:{
        type:String
    },
    gmdnCode:{
        type:String
    },
    hsCode:{
        type:String
    },
    complaintDescription:{
        type:String
    },
    actionTakenByAR:{
        type:String
    },
    supportiveDocuments:{
        type:String
    }

},{timestamps:true})

const ComplaintHandling = mongoose.model('ComplainHandling',complaintHandlingSchema)
export default ComplaintHandling