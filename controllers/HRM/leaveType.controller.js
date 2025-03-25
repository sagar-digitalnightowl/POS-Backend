import leaveTypeModel from "../../models/HRM/leaveType.model.js";

const routes = {}

routes.addLeaveType = async(req,res)=>{
    try {
        const {leaveType,maxLeaveCount,leaveCountInterval} = req.body
        if(!leaveType || !maxLeaveCount || !leaveCountInterval){
            return res.status(400).json({error:"Leave type, maxLeaveCount and leave count interval are required"})
        }
        const data = await leaveTypeModel.create({leaveType,maxLeaveCount,leaveCountInterval})

        return res.status(200).json({result:data,message:"Leave type added Successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllLeaveType = async(req,res)=>{
    try {
        const allLeaveType = await leaveTypeModel.find()
        if(!allLeaveType || allLeaveType.length === 0){
            return res.status(400).json({error:"Leave Type Category not found"})
        }
        return res.status(200).json({result:allLeaveType,message:"All Leave Type Category fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getLeaveTypeById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const leaveType = await leaveTypeModel.findById(id)
        if(!leaveType){
            return res.status(404).json({error:`Leave Type is not found with Id ${id}`})
        }
        return res.status(200).json({result:leaveType,message:'Leave Type fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateLeaveTypeById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const leaveType = await leaveTypeModel.findByIdAndUpdate(id,req.body,{new:true})
        if(!leaveType){
            return res.status(404).json({error:`Leave Type is not found with Id ${id}`})
        }
        return res.status(200).json({result:leaveType,message:'Leave Type fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteLeaveTypeById = async(req,res)=>{
    try{
        const id = req.params.id;
        const leaveType = await leaveTypeModel.findByIdAndDelete(id);
        if(!leaveType)
            return res.status(404).json({error:`Leave Type is not found with Id ${id}`})
         return res.status(200).json({result:leaveType,message:"Leave Type deleted successfully"})  
       }catch(error){
           return res.status(500).json({error:"Something went wrong"});
       }
}

export default routes;