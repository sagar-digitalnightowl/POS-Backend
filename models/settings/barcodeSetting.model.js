import mongoose, { Schema } from 'mongoose'

const barcodeSettingSchema = new Schema({
    stickerSheetName:{
        type:String,
        required:true
    },
    stickerSheetDescription:{
        type:String
    },
    continousfeedOrRolls:{
        type:Boolean,
        default:false
    },
    additionalTopMargin:{
        type:Number,
        default:0,
    },
    additionalLeftMargin:{
        type:Number,
        default:0,
    },
    widthOfSticker:{
        type:Number,
        default:0,
    },
    heightOfSticker:{
        type:Number,
        default:0,
    },
    paperWidth:{
        type:Number,
        default:0,
    },
    paperHeight:{
        type:Number,
        default:0,
    },
    stickersInOneRow:{
        type:Number,
        default:0,
    },
    distanceBetweenTwoRows:{
        type:Number,
        default:0,
    },
    distanceBetweenTwoColumns:{
        type:Number,
        default:0,
    },
    stickersPerSheet:{
        type:Number,
        default:0,
    },
    setAsDefault:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

const BarcodeSetting = mongoose.model('BarcodeSetting',barcodeSettingSchema)
export default BarcodeSetting