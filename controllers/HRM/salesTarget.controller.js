import salesTargetModel from "../../models/HRM/salesTarget.model.js";

const routes = {}

routes.addSalesTarget = async(req,res)=>{
    try {
        const {targets} = req.body

        if(!Array.isArray(targets) || targets.length === 0){
            return res.status(400).json({error:"Targets data is required."})
        }
        for(const target of targets){
            const{totalSalesAmountFrom, totalSalesAmountTo, commissionPercentage} = target

            if(totalSalesAmountFrom === undefined ||
                totalSalesAmountTo === undefined ||
                commissionPercentage === undefined
              ){
                return res.status(400).json({ error: "All fields are required for each target." });
              }
        }
        const newSalesTarget = new salesTargetModel({targets})
        await newSalesTarget.save();

        res.status(201).json({result:newSalesTarget,message:"Sales target added successfully"})

    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllSalesTarget = async(req,res)=>{
    try {
        const allTarget = await salesTargetModel.find()

        if(!allTarget || allTarget === 0){
            return res.status(400).json({error:"No Sales Target is found"})
        }
        return res.status(200).json({result:allTarget,message:"Sales Target fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getSalesTargetById = async(req,res)=>{
    try {
        const id = req.params.id

        // if(!id){
        //     return res.status(400).json({error:"Id is require"})
        // }
        const target = await salesTargetModel.findById(id)
        if(!target){
            return res.status(404).json({error:`Target is not found with Id ${id}`})
        }
        return res.status(200).json({result:target,message:'Target fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateSalesTargetById = async(req,res)=>{
    try {
        const targetId = req.params.id

        if(!targetId){
            return res.status(400).json({error:"Id is require"})
        }
        const target = await salesTargetModel.findByIdAndUpdate(targetId,req.body,{new:true})
        if(!target){
            return res.status(404).json({error:`Target is not found with Id ${targetId}`})
        }
        return res.status(200).json({result:target,message:'Target fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteSalesTargetById = async(req,res)=>{
    try {
        const id = req.params.id;
        const target = await salesTargetModel.findByIdAndDelete(id);
        if(!target)
            return res.status(404).json({error:`Target is not found with Id ${id}`})
         return res.status(200).json({result:target,message:"Target deleted successfully"})  
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}
export default routes;