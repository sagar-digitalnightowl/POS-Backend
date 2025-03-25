import jobSheetSchema from "../../models/repair/jobSheet.model.js"
import { jobSheetValidation } from "../../validations/joi.validations.js";
// import { v4 as uuidv4 } from 'uuid';
// import { uploadFile } from "../../utils/s3.js";

const routes = {};

routes.addJobSheet = async (req, res) => {
  try {
    const {error}=jobSheetValidation.validate(req.body)
   if(error)
        return res.status(400).json({error:error.details[0].message})

   
    const newDoc = await jobSheetSchema.create(req.body);
    return res
      .status(201)
      .json({ result: newDoc, message: "New Document is created" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllJobSheet = async (req, res) => {
  try {
    const { limit = 10, page = 1,businessLocation,customer,status } = req.query;
    const allDoc = await jobSheetSchema
      .find({businessLocation,customer,status})
      .skip(limit * (page - 1))
      .limit(limit);
    return res
      .status(200)
      .json({ result: allDoc, message: "Document fetched successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getJobSheetById = async (req, res) => {
  try {
    const jobSheetId = req.params.id;
    const doc = await jobSheetSchema.find(jobSheetId);
    if (!doc)
      return res.status(404).json({ error: "Document not found with this id" });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateJobSheetById = async (req, res) => {
  try {
    const jobSheetId = req.params.id;
   
    const doc = await jobSheetSchema.findByIdAndUpdate(
        brandId,
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

routes.deleteJobSheetById=async(req,res)=>{
    try{
     const jobSheetId=req.params.id;
     const doc=await jobSheetSchema.findByIdAndDelete(jobSheetId);
     if(!doc)
         return res.status(404).json({error:"Document not found with this id"})
      return res.status(200).json({result:doc,message:"Document deleted successfully"})  
    }catch(error){
        return res.status(500).json({error:"Something went wrong"});
    }
}

export default routes;
