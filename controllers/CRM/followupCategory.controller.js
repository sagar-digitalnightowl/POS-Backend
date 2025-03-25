import followupModel from "../../models/CRM/followupCategory.model.js";

const routes = {}

routes.addFollowup = async(req,res)=>{
    try {
        const {followupCategory,description} = req.body
        if(!followupCategory || !description){
            return res.status(400).json({error:"Followup category and description are required"})
        }
        const data = await followupModel.create({followupCategory,description})

        return res.status(200).json({result:data,message:"Followup added Successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllFollowup = async(req,res)=>{
    try {
        const allFollowup = await followupModel.find()
        if(!allFollowup || allFollowup.length === 0){
            return res.status(400).json({error:"Followup Category not found"})
        }
        return res.status(200).json({result:allFollowup,message:"All Followup Category fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getFollowupById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const followup = await followupModel.findById(id)
        if(!followup){
            return res.status(404).json({error:`Followup is not found with Id ${id}`})
        }
        return res.status(200).json({result:followup,message:'Followup fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateFollowupById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const followup = await followupModel.findByIdAndUpdate(id,req.body,{new:true})
        if(!followup){
            return res.status(404).json({error:`Followup is not found with Id ${id}`})
        }
        return res.status(200).json({result:followup,message:'Followup fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteFollowupById = async(req,res)=>{
    try{
        const id = req.params.id;
        const followup = await followupModel.findByIdAndDelete(id);
        if(!followup)
            return res.status(404).json({error:`Followup is not found with Id ${id}`})
         return res.status(200).json({result:followup,message:"Followup deleted successfully"})  
       }catch(error){
           return res.status(500).json({error:"Something went wrong"});
       }
}

export default routes;