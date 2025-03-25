import sourceModel from "../../models/CRM/sources.model.js";

const routes = {}

routes.addSource = async(req,res)=>{
    try {
        const {source,description} = req.body
        if(!source || !description){
            return res.status(400).json({error:"Source and description are required"})
        }
        const data = await sourceModel.create({source,description})

        return res.status(200).json({result:data,message:"Contact added"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllSource = async(req,res)=>{
    try {
        const allSource = await sourceModel.find()
        if(!allSource || allSource.length === 0){
            return res.status(400).json({error:"Sources not found"})
        }
        return res.status(200).json({result:allSource,message:"All source fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getSourceById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const source = await sourceModel.findById(id)
        if(!source){
            return res.status(404).json({error:`Source is not found with Id ${id}`})
        }
        return res.status(200).json({result:source,message:'Source fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateSourceById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const source = await sourceModel.findByIdAndUpdate(id,req.body,{new:true})
        if(!source){
            return res.status(404).json({error:`Source is not found with Id ${id}`})
        }
        return res.status(200).json({result:source,message:'Source fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteSourceById = async(req,res)=>{
    try{
        const id = req.params.id;
        const source = await sourceModel.findByIdAndDelete(id);
        if(!source)
            return res.status(404).json({error:`Source is not found with Id ${id}`})
         return res.status(200).json({result:source,message:"Source deleted successfully"})  
       }catch(error){
           return res.status(500).json({error:"Something went wrong"});
       }
}

export default routes;