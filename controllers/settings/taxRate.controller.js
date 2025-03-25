import taxRateModel from '../../models/settings/taxRate.model.js'

const routes = {}

routes.addTaxRate = async(req,res)=>{
    try {
        const data = req.body;
        
    if (!data.name || !data.taxRatePercentage) {
        return res.status(400).json({error: "Name and Tax Rate% are required",});
      }
  
      const taxRate = await taxRateModel.create(data);
  
      return res.status(200).json({result: taxRate,message: "Tax Rate added successfully",});
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllTaxRate = async(req,res)=>{
    try {
        const taxRate = await taxRateModel.find()
        if(!taxRate || taxRate.length === 0){
            return res.status(400).json({error:"No Tax rate found"})
        }
        return res.status(200).json({result:taxRate,message:'Data fetched successfully'}) 
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getTaxRateById = async(req,res)=>{
    try {
        const taxRateById = req.params.id
        if(!taxRateById){
            return res.status(400).json({error:"Id is required"})
        }
        const taxRate = await taxRateModel.findById(taxRateById)

        if(!taxRate){
            return res.status(400).json({error:`No Tax Rate found with id ${taxRateById}`})
        }
        return res.status(200).json({result:taxRate,message:"Data retrived successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateTaxRateById = async(req,res)=>{
    try {
        const taxRateById = req.params.id
        if(!taxRateById){
            return res.status(400).json({error:"Id is required"})
        }
        const taxRate = await taxRateModel.findByIdAndUpdate(taxRateById,req.body,{new:true})

        if(!taxRate){
            return res.status(400).json({error:`No Tax Rate found with id ${taxRateById}`})
        }
        return res.status(200).json({result:taxRate,message:"Tax Rate updated successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteTaxRateById = async(req,res)=>{
    try {
        const taxRateById = req.params.id
        if(!taxRateById){
            return res.status(400).json({error:"Id is required"})
        }
        const taxRate = await taxRateModel.findByIdAndDelete(taxRateById)
        if(!taxRate){
            return res.status(400).json({error:`No Tax Rate found with id ${taxRateById}`})
        }
        return res.status(200).json({result:taxRate,message:"Tax Rate updated successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

export default routes;