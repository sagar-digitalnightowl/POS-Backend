import mongoose, { Schema } from "mongoose";

const lifeStageSchema = new Schema({
    lifeStage:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const LifeStage = mongoose.model('LifeStage',lifeStageSchema)
export default LifeStage;