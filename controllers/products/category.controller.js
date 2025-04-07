import categorySchema from "../../models/products/category.model.js"

const routes = {};

routes.addCategory = async (req, res) => {
  try {
    const { name, categoryCode, description } = req.body;
    if (!name && !categoryCode&&!description)
      return res.status(400).json({ error: "All field is required " });

    const existDoc = await categorySchema.find({ $or: [{ name }, { categoryCode }] });
    if (!existDoc)
      return res
        .status(400)
        .json({ error: "Name or CategoryCode is already exist" });
    const newDoc = await categorySchema.create({ name, categoryCode, description });
    return res
      .status(201)
      .json({ result: newDoc, message: "New Document is created" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllCategory = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const allDoc = await categorySchema
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

routes.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const doc = await categorySchema.findById(categoryId);
    if (!doc)
      return res.status(404).json({ error: "Document not found with this id" });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, categoryCode } = req.body;

    // Fetch existing document
    const existingDoc = await categorySchema.findById(categoryId);
    if (!existingDoc)
      return res.status(404).json({ error: "Document not found with this id" });

    // Check if name is being changed and already exists
    if (name && name !== existingDoc.name) {
      const nameExists = await categorySchema.findOne({ name });
      if (nameExists)
        return res.status(400).json({ error: "Name already exists" });
    }

    // Check if categoryCode is being changed and already exists
    if (categoryCode && categoryCode !== existingDoc.categoryCode) {
      const codeExists = await categorySchema.findOne({ categoryCode });
      if (codeExists)
        return res.status(400).json({ error: "Category code already exists" });
    }

    // Perform update
    const updatedDoc = await categorySchema.findByIdAndUpdate(
      categoryId,
      {
        name: name || existingDoc.name,
        categoryCode: categoryCode || existingDoc.categoryCode,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ result: updatedDoc, message: "Document updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


routes.deleteCategoryById=async(req,res)=>{
    try{
     const categoryId=req.params.id;
     const doc=await categorySchema.findByIdAndDelete(categoryId);
     if(!doc)
         return res.status(404).json({error:"Document not found with this id"})
      return res.status(200).json({result:doc,message:"Document deleted successfully"})  
    }catch(error){
        return res.status(500).json({error:"Something went wrong"});
    }
}


export default routes;
