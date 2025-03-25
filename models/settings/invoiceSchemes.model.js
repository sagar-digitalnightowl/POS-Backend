import mongoose, { Schema } from 'mongoose'

const settingsInvoiceScheme = new Schema({
    dateFormat1:{
        type:String,
        required:true
    },
    preview:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    prefix:{
        type:String
    },
    startFrom:{
        type:String
    },
    invoiceCount:{
        type:String
    },
    numberOfDigits:{
        type: Number,
        min: 1
    },
    setAsDefault:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const InvoiceScheme = mongoose.model('InvoiceScheme',settingsInvoiceScheme)
export default InvoiceScheme;