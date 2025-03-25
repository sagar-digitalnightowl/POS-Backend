import mongoose, { Schema } from 'mongoose'

const discountSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    product:{
        type:String,
    },
    brand:{
        type:mongoose.Types.ObjectId,
        ref:"Brand"
    },
    category:{
        type:String
    },
    location:{
        type:String
    },
    priority:{
        type:String
    },
    discountType:{
        type:String
    },
    discountAmount:{
        type:String
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date
    },
    sellingPriceGroup:{
        type:String
    },
    applyInCustomerGroups:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:false
    }
},
{ timestamps: true })

const Discount = mongoose.model("Discount",discountSchema)
export default Discount;