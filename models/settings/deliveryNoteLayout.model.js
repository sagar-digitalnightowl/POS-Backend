import mongoose, { Schema } from 'mongoose'

const deliveryNoteLayoutSchema = new Schema({
    layoutName:{
        type:String,
        required:true
    },
    design:{
        type:String,
        default:'Delivery Note',
    },
    showLetterHead:{
        type:Boolean,
        default:false
    },
    invoiceLogo:{
        type:String,
    },
    showInvoiceLogo:{
        type:Boolean,
        default:false
    },
    headerText:{
        type:String,
    },
    subHeadingLine1:{
        type:String
    },
    subHeadingLine2:{
        type:String
    },
    subHeadingLine3:{
        type:String
    },
    subHeadingLine4:{
        type:String
    },
    subHeadingLine5:{
        type:String
    }
},{timestamps:true})

const DeliveryNoteLayout = mongoose.model('DeliveryNoteLayout',deliveryNoteLayoutSchema)
export default DeliveryNoteLayout