import campaignModel from "../../models/CRM/campaigns.model.js";

const routes = {}

routes.addCampaign = async(req,res)=>{
    try {
        const data = req.body

        if(!data.campaignName || !data.campaignType || !data.to){
            return res.status(400).json({error:"All fields are required"})
        }

        const validCampaignTypes = ["Sms", "Email"];
        if (!validCampaignTypes.includes(data.campaignType)) {
            return res.status(400).json({ error: "Invalid campaignType. Choose a valid option (Sms or Email)" });
        }

        const validToOptions = ["Customers", "Leads", "Transaction activity", "Contact"];
        if (!validToOptions.includes(data.to)) {
            return res.status(400).json({ error: "Invalid 'to' value. Choose a valid option (Customers, Leads, Transaction activity, Contact)" });
        }

        const campaign = await campaignModel.create(data)

        return res.status(200).json({result:campaign,message:"Campaign added successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllCampaign = async(req,res)=>{
    try {
        const allCampaign = await campaignModel.find()
        if(!allCampaign || allCampaign.length === 0){
            return res.status(400).json({error:"Campaign not found"})
        }
        return res.status(200).json({result:allCampaign,message:"All campaign fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getCampaignById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const campaign = await campaignModel.findById(id)
        if(!campaign){
            return res.status(404).json({error:`Campaign is not found with Id ${id}`})
        }
        return res.status(200).json({result:campaign,message:'Campaign fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateCampaignById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const campaign = await campaignModel.findByIdAndUpdate(id,req.body,{new:true})
        if(!campaign){
            return res.status(404).json({error:`Campaign is not found with Id ${id}`})
        }
        return res.status(200).json({result:campaign,message:'Campaign fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteCampaignById=async(req,res)=>{
    try{
     const campaignId=req.params.id;
     const campaign=await campaignModel.findByIdAndDelete(campaignId);
     if(!campaign)
         return res.status(404).json({error:`Campaign is not found with Id ${id}`})
      return res.status(200).json({result:campaign,message:"Campaign deleted successfully"})  
    }catch(error){
        return res.status(500).json({error:"Something went wrong"});
    }
}

export default routes;