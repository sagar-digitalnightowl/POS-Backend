import mongoose from 'mongoose'

const recallSchema = new Schema({
    recalls:{
        type:String,
        enum:[
            "By Manufacturer",
            "By Batch No"
        ],
        required:true
    },
    manufacturerName:{
        type:Schema.Types.ObjectId,
        ref:'Manufacturer',
        required:function(){
            return this.recalls === "By Manufacturer"
        }
    },
    manufacturerEmail:{
        type:String,
        required:function(){
            return this.recalls === "By Manufacturer"
        }
    },
    contactPersonNumber:{
        type:Number,
        required:function(){
            return this.recalls === "By Manufacturer"
        }
    },
    countryOfOrigin:{
        type:String,
        required:function(){
            return this.recalls === "By Manufacturer"
        }
    },

    batchNo:{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required:function(){
            return this.recalls === "By Batch No"
        }
    }
},{timestamps:true})

const Recall = mongoose.model("Recall",recallSchema)
export default Recall