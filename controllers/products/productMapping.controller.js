
import productMappingSchema from "../../models/products/productMapping.model.js"
import { productMappingValidation } from "../../validations/joi.validations.js";

const routes = {};

routes.addProductMapping = async (req, res) => {
  try {
    const {error}=productMappingValidation.validate(req.body)
     if(error)
          return res.status(400).json({error:error.details[0].message})
    
    const newDoc = await productMappingSchema.create(req.body);
    return res
      .status(201)
      .json({ result: newDoc, message: "New Document is created" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllProductMapping = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const allDoc = await productMappingSchema
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

routes.getProductMappingById = async (req, res) => {
  try {
    const productMappingId = req.params.id;
    const doc = await productMappingSchema.findById(productMappingId);

    if (!doc)
      return res.status(404).json({ error: "Document not found with this id" });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateProductMappingById = async (req, res) => {
  try {
    const productMappingById = req.params.id;


    const doc = await productMappingSchema.findByIdAndUpdate(
        productMappingById,
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

routes.deleteProductMappingById=async(req,res)=>{
    try{
     const productMappingId=req.params.id;
     const doc=await productMappingSchema.findByIdAndDelete(productMappingId);
     if(!doc)
         return res.status(404).json({error:"Document not found with this id"})
      return res.status(200).json({result:doc,message:"Document deleted successfully"})  
    }catch(error){
        return res.status(500).json({error:"Something went wrong"});
    }
}

export default routes;
