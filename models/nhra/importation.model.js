import mongoose, { Schema } from 'mongoose'

const importationSchema = new Schema({
    invoiceNo:{
        type:String,
        required:true
    },
    invoiceDate:{
        type:Date
    },
    deliveryMethod:{
        type:String
    },
    paymentMethod:{
        type:String
    },
    cRNumber:{
        type:Number
    },
    ofoqLicenseNumber:{
        type:String
    },
    grn:{
        type:String
    },
    lpo:{
        type:String
    },
    portOfDelivery:{
        type:String
    },
    dateOfDelivery:{
        type:Date
    },
    totalPayment:{
        type:Number
    },
    totalTax:{
        type:String
    },

    invoice:{
        type:String
    },
    purchaseOrder:{
        type:String
    },
    catalogue:{
        type:String
    },
    freeSaleCertificate:{
        type:String
    },
    qualityAssuranceCertificate:{
        type:String
    },

    authorizedRepresentativeName:{
        type:Schema.Types.ObjectId,
        ref:"AuthorizedRepresentative"
    },
    mobileNumber:{
        type:String
    },
    authorizedRepresentativeEmail:{
        type:String
    },

    manufacturerName:{
        type:Schema.Types.ObjectId,
        ref:"Manufacturer"
    },
    contactPersonNumber:{
        type:String
    },
    manufacturerEmail:{
        type:String
    },
    manufacturerCountryOfOrigin:{
        type:String
    },

    productName:{
        type:Schema.Types.ObjectId,
        ref:"Product"
    },
    qty:{
        type:String
    },
    expiry:{
        type:Date
    },
    lotNo:{
        type:String
    }

},{timestamps:true})

const Importation = mongoose.model("Importation",importationSchema)
export default Importation