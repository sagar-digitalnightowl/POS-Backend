import designationModel from '../../models/HRM/designation.model.js'

const routes = {}

routes.addDesignation = async(req,res)=>{
    try {
        const data = req.body
        if(!data.designation || !data.description){
            return res.status(400).json({error:"Designation and Description Id are required"})
        }
        const designation = await designationModel.create(data)

        return res.status(200).json({result:designation,message:"Designation added Successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllDesignation = async(req,res)=>{
    try {
        const allDesignation = await designationModel.find()
        if(!allDesignation || allDesignation.length === 0){
            return res.status(400).json({error:"Designation not found"})
        }
        return res.status(200).json({result:allDesignation,message:"All Designation fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getDesignationById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const designation = await designationModel.findById(id)
        if(!designation){
            return res.status(404).json({error:`Designation is not found with Id ${id}`})
        }
        return res.status(200).json({result:designation,message:'Designation fetch Successfully'}) 
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateDesignationById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const designation = await designationModel.findByIdAndUpdate(id,req.body,{new:true})
        if(!designation){
            return res.status(404).json({error:`Designation is not found with Id ${id}`})
        }
        return res.status(200).json({result:designation,message:'Designation fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteDesignationById = async(req,res)=>{
    try{
        const id = req.params.id;
        const designation = await designationModel.findByIdAndDelete(id);
        if(!designation)
            return res.status(404).json({error:`Designation is not found with Id ${id}`})
         return res.status(200).json({result:designation,message:"Designation deleted successfully"})  
       }catch(error){
           return res.status(500).json({error:"Something went wrong"});
       }
}

export default routes