import printerModel from '../../models/settings/printer.model.js'

const routes = {}

routes.addPrinter = async(req,res)=>{
    try {
    const data = req.body;
        
    if (!data.printerName || !data.connectionType || !data.capabilityProfile || !data.ipAddress) {
        return res.status(400).json({error: "Printer name, Connection type, Capability profile, IP Address are required",});
      }
  
      const printer = await printerModel.create(data);
  
      return res.status(200).json({result: printer,message: "Printer added successfully",});
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllPrinter = async(req,res)=>{
    try {
        const allPrinter  = await printerModel.find()

        if(!allPrinter || allPrinter.length === 0){
            return res.status(400).json({error:"No printer found"})
        }
        return res.status(200).json({result:allPrinter,message:'Data fetched successfully'}) 
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getPrinterById = async(req,res)=>{
    try {
        const printerById = req.params.id
        if(!printerById){
            return res.status(400).json({error:"Id is required"})
        }
        const printer = await printerModel.findById()

        if(!printer){
            return res.status(400).json({error:`No printer found with id ${printerById}`})
        }
        return res.status(200).json({result:printer,message:"Data retrived successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updatePrinterById = async(req,res)=>{
    try {
        const printerById = req.params.id
        if(!printerById){
            return res.status(400).json({error:"Id is required"})
        }
        const printer = await printerModel.findByIdAndUpdate(printerById,req.body,{new:true})

        if(!printer){
            return res.status(400).json({error:`No Printer found with id ${printerById}`})
        }
        return res.status(200).json({result:printer,message:"Printer updated successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deletePrinterById = async(req,res)=>{
    try {
        const printerById = req.params.id
        if(!printerById){
            return res.status(400).json({error:"Id is required"})
        }
        const printer = await printerModel.findByIdAndDelete(printerById)
        if(!printer){
            return res.status(400).json({error:`No printer found with id ${printerById}`})
        }
        return res.status(200).json({result:printer,message:"Printer updated successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

export default routes