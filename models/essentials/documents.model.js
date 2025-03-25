import mongoose, { Schema } from 'mongoose'

const documentSchema = new Schema({
    document:{
        type:String,
        required:true
    },
    description:{
        type:String
    }
},{timestamps: true})

const Document = mongoose.model("Document",documentSchema)
export default Document