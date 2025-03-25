import taxGroupModel from "../../models/settings/taxGroup.model.js";
import taxRateModel from "../../models/settings/taxRate.model.js"

const routes = {}

routes.addTaxGroup = async(req,res)=>{
    try {
        const {name,subTaxes} = req.body;
        
    if (!name || !Array.isArray(subTaxes) || subTaxes.length === 0) {
        return res.status(400).json({error: "Name & Sub Taxes required",});
      }
  
      const validSubTaxes = await taxRateModel.find({ _id: { $in: subTaxes } });

      if (validSubTaxes.length !== subTaxes.length) {
      return res.status(400).json({ error: "One or more Sub Tax IDs are invalid." });
      }

      const taxGroup = await taxGroupModel.create({name,subTaxes})
  
      return res.status(200).json({result: taxGroup,message: "Tax Group added successfully",});
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllTaxGroup = async(req,res)=>{
    try {
        const allTaxGroup  = await taxGroupModel.find().populate('subTaxes')

        if(!allTaxGroup || allTaxGroup.length === 0){
            return res.status(404).json({error:"No Tax Group found"})
        }
        return res.status(200).json({result:allTaxGroup,message:'Data fetched successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getTaxGroupById = async(req,res)=>{
    try {
        const taxGroupById = req.params.id
        if(!taxGroupById){
            return res.status(400).json({error:"Id is required"})
        }
        const taxGroup = await taxGroupModel.findById(taxGroupById).populate('subTaxes')

        if(!taxGroup){
            return res.status(404).json({error:`No Tax Group found with id ${taxGroupById}`})
        }
        return res.status(200).json({result:taxGroup,message:"Data retrived successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateTaxGroupById = async(req,res)=>{
    try {
        const taxGroupById = req.params.id
        const updateData = req.body

        if(!taxGroupById){
            return res.status(400).json({error:"Id is required"})
        }

        if(updateData.subTaxes){

            if (!Array.isArray(updateData.subTaxes) || updateData.subTaxes.length === 0) {
                return res.status(400).json({error: "Sub Taxes required",});
              }

            const validSubTaxes = await taxRateModel.find({_id:{ $in: updateData.subTaxes}});

            if (validSubTaxes.length !== updateData.subTaxes.length) {
                return res.status(400).json({ error: "One or more Sub Tax IDs are invalid." });
                }
        }

        const taxGroup = await taxGroupModel.findByIdAndUpdate(taxGroupById,updateData,{new:true})

        if(!taxGroup){
            return res.status(404).json({error:`No Tax Group found with id ${taxGroupById}`})
        }

        return res.status(200).json({result:taxGroup,message:"Tax Group updated successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteTaxGroupById = async(req,res)=>{
    try {
        const taxGroupById = req.params.id
        if(!taxGroupById){
            return res.status(400).json({error:"Id is required"})
        }
        const taxGroup = await taxGroupModel.findByIdAndDelete(taxGroupById).populate('subTaxes')
        if(!taxGroup){
            return res.status(400).json({error:`No Tax Group found with id ${taxGroupById}`})
        }
        return res.status(200).json({result:taxGroup,message:"Tax Group updated successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

export default routes;