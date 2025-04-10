import invoiceSchema from "../../models/repair/invoice.model.js"
import { invoiceValidation } from "../../validations/joi.validations.js";

const routes = {};

routes.addInvoice = async (req, res) => {
  try {
    const {error}=invoiceValidation.validate(req.body)
   if(error){
    console.log("Validation Error:", error.details[0].message);
        return res.status(400).josn({error:error.details[0].message})
   }
    const newDoc = await invoiceSchema.create(req.body);
    return res
      .status(201)
      .json({ result: newDoc, message: "New Document is created" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllInvoice = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const allDoc = await invoiceSchema
      .find()
      .skip(limit * (page - 1))
      .limit(limit);
    return res
      .status(200)
      .json({ result: allDoc, message: "Document fetched successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getInvoiceById = async (req, res) => {
  try {
    const jobSheetId = req.params.id;
    const doc = await invoiceSchema.find(jobSheetId);
    if (!doc)
      return res.status(404).json({ error: "Document not found with this id" });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateInvoiceById = async (req, res) => {
  try {
    const jobSheetId = req.params.id;
   
    const doc = await invoiceSchema.findByIdAndUpdate(
      jobSheetId,
        req.body,
      { new: true }
    );
    if (!doc)
      return res.status(400).json({ error: "Document not found with this id" });

    return res
      .status(200)
      .json({ result: doc, message: "Document update successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteInvoiceById=async(req,res)=>{
    try{
     const jobSheetId=req.params.id;
     const doc=await invoiceSchema.findByIdAndDelete(jobSheetId);
     if(!doc)
         return res.status(404).json({error:"Document not found with this id"})
      return res.status(200).json({result:doc,message:"Document deleted successfully"})  
    }catch(error){
        return res.status(500).json({error:"Something went wrong"});
    }
}

export default routes;
