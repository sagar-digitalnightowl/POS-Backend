import roleModel from "../../models/userManagement/role.model.js"
const routes={}

routes.createRole=async(req,res)=>{
    try{
        const {roleName}=req.body
        if(!roleName)
            return res.status(400).json({message:"Role name is required"})
        
       const newRole=await roleModel.create(req.body)
       res.status(201).json({result:newRole,message:"Role created successfully"})
    }catch(err){
        console.log("error=",err)
        res.status(500).json({error:"Something went wrong"})
    }
}
routes.getAllRole=async(req,res)=>{
    try{
        const {limit=25,page=1}=req.query;
        
        const roles=await roleModel.find({},{roleName:1}).skip(limit*(page-1)).limit(limit);
        const totalRole=await roleModel.find();

        res.status(200).json({result:{roles,totalRole:totalRole.length},meassage:"Role fetched successfully"})        
    }catch(err){
        console.log("error=",err)
        res.status(500).json({error:"Something went wrong"})
    }
}
routes.getRoleById=async(req,res)=>{
    try{
        const roleId=req.params.id
        const role=await roleModel.findById(roleId)
        if(!role)
            return res.status(404).json({message:"Role not found"})
        res.status(200).json({result:role,message:"Role fetched"})
    }catch(err){
        console.log("error=",err)
        res.status(500).json({error:"Something went wrong"})
    }
}
routes.updateRoleById=async(req,res)=>{
    try{
        const roleId=req.params.id
        const {roleName}=req.body
        const role=await roleModel.findByIdAndUpdate(roleId,req.body,{new:true})
        if(!role)
            return res.status(404).json({message:"Role not found"})
        res.status(200).json({result:role,message:"Role updated successfully"})
    }catch(err){
        console.log("error=",err)
        res.status(500).json({error:"Something went wrong"})
    }
}

routes.deleteRoleById=async(req,res)=>{
    try{
        const roleId=req.params.id
        const role=await roleModel.findByIdAndDelete(roleId)
        if(!role)
            return res.status(404).json({message:"Role not found"})
        res.status(200).json({message:"Role deleted successfully"})
    }catch(err){
        console.log("error=",err.message)
        res.status(500).json({error:"Something went wrong"})
        }

}

export default routes