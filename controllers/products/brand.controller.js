import brandSchema from "../../models/products/brand.model.js"
const routes = {};

routes.addBrand = async (req, res) => {
  try {
    const { name, shortDescription,useForRepair } = req.body;
    if (!name && !shortDescription)
      return res.status(400).json({ error: "All field is required " });

    const existDoc = await brandSchema.findOne({name});
    if (existDoc)
      return res
        .status(400)
        .json({ error: "Name or shortDescription is already exist" });
    const newDoc = await brandSchema.create({ name, shortDescription, useForRepair });
    return res
      .status(201)
      .json({ result: newDoc, message: "New Document is created" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllBrand = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const allDoc = await brandSchema
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

routes.getBrandById = async (req, res) => {
  try {
    const brandId = req.params.id;
    const doc = await brandSchema.findById(brandId);
    if (!doc)
      return res.status(404).json({ error: `Document not found with id ${brandId}` });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateBrandById = async (req, res) => {
  try {
    const brandId = req.params.id;
    const { name,shortDescription} = req.body;
    const existDoc = await brandSchema.findOne({ name });
    if (existDoc)
      return res.status(400).json({ error: "Name or categoryCode already exist" });

    const doc = await brandSchema.findByIdAndUpdate(
        brandId,
      { name, shortDescription },
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

routes.deleteBrandById=async(req,res)=>{
    try{
     const brandId=req.params.id;
     const doc=await brandSchema.findByIdAndDelete(brandId);
     if(!doc)
         return res.status(404).json({error:"Document not found with this id"})
      return res.status(200).json({result:doc,message:"Document deleted successfully"})  
    }catch(error){
        return res.status(500).json({error:"Something went wrong"});
    }
}


export default routes;
