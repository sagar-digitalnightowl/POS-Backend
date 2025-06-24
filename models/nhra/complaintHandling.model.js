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
    authorizedRepresentative:{
        type:Schema.Types.ObjectId,
        ref:'AuthorizedRepresentative',
        required:true
    },

    medicalDevice:{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required: true
    },
   
    complaintDescription:{
        type:String
    },
    actionTakenByAR:{
        type:String
    },
    //file
    supportiveDocuments:{
        type:String
    }

},{timestamps:true})

const ComplaintHandling = mongoose.model('ComplainHandling',complaintHandlingSchema)
export default ComplaintHandling