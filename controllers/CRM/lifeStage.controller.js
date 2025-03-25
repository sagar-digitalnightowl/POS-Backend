import lifeStageModel from "../../models/CRM/lifeStage.model.js";
const routes = {}

routes.addLifeStage = async(req,res)=>{
    try {
        const {lifeStage,description} = req.body
        if(!lifeStage || !description){
            return res.status(400).json({error:"Life Stage and description are required"})
        }
        const data = await lifeStageModel.create({lifeStage,description})

        return res.status(200).json({result:data,message:"Life stage added successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllLifeStage = async(req,res)=>{
    try {
        const allLifeStage = await lifeStageModel.find()
        if(!allLifeStage || allLifeStage.length === 0){
            return res.status(400).json({error:"Life Stage not found"})
        }
        return res.status(200).json({result:allLifeStage,message:"All Life Stage fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getLifeStageById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const lifeStage = await lifeStageModel.findById(id)
        if(!lifeStage){
            return res.status(404).json({error:`Life Stage is not found with Id ${id}`})
        }
        return res.status(200).json({result:lifeStage,message:'Life Stage fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateLifeStageById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const lifeStage = await lifeStageModel.findByIdAndUpdate(id,req.body,{new:true})
        if(!lifeStage){
            return res.status(404).json({error:`Life Stage is not found with Id ${id}`})
        }
        return res.status(200).json({result:lifeStage,message:'Life Stage fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteLifeStageById = async(req,res)=>{
    try{
        const id = req.params.id;
        const lifeStage = await lifeStageModel.findByIdAndDelete(id);
        if(!lifeStage)
            return res.status(404).json({error:`Life Stage is not found with Id ${id}`})
         return res.status(200).json({result:lifeStage,message:"Life Stage deleted successfully"})  
       }catch(error){
           return res.status(500).json({error:"Something went wrong"});
       }
}

export default routes;