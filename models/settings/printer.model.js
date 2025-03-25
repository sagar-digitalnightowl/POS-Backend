import mongoose, { Schema } from 'mongoose'

const printerSchema = new Schema({
    printerName:{
        type:String,
        required:true
    },
    connectionType:{
        type:String,
        enum:[
            "Network",
            "Windows",
            "Linux"
        ],
        required:true
    },
    capabilityProfile:{
        type:String,
        enum:[
            "Default",
            "Simple",
            "Star Branded",
            "Espon Tep",
            "P822D"
        ],
        required:true
    },
    charactersPerLine:{
        type:String,
        default:42
    },
    ipAddress:{
        type:Number,
        required:true
    },
    port:{
        type:Number,
        default:9100
    }
    
},{timestamps:true})

const Printer = mongoose.model("Printer",printerSchema)
export default Printer