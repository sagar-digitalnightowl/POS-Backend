import mongoose, { Schema } from 'mongoose'

const authorizedRepresentativeSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    emailAddress:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    licenseNumber:{
        type:String
    },
    CRCPRNo:{
        type:String
    },
    authorizedCertificate:{
        type:String
    }
},{timestamps:true})

const AuthorizedRepresentative = mongoose.model("AuthorizedRepresentative",authorizedRepresentativeSchema)
export default AuthorizedRepresentative 