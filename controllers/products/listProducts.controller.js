import { productValidation } from "../../validations/joi.validations.js";
import productSchema from "../../models/products/productList.model.js";
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from "../../utils/s3.js";

const routes = {};

routes.addProducts = async (req, res) => {
  try {
    const { productMarketEntryDate } = req.body;
    console.log(req.files)
    const { error } = productValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    if (productMarketEntryDate) {
      req.body.productMarketEntryDate = new Date(productMarketEntryDate);
    }

    let urls;
    if (req.files) {
      urls = await Promise.all(
        req.files?.map(async (file) => {
          const data = await uploadFile(
            file,
            `ProductList/${uuidv4()}/-${file.originalname}`
          );
          return data.Key;
        })
      );
    }
   

    const newDoc = await productSchema.create({...req.body,productImage:urls[0],productBrochure:urls[1]});
    return res
      .status(201)
      .json({ result: newDoc, message: "New Document created successfully" });
  } catch (error) {
      console.log("error:",error.message)
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getAllProduct = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      productType,
      category,
      unit,
      tax,
      brand,
      businessLocation,
      status,
      manufacturer,
      supplier,
      deviceModel,
      NotForSelling,
    } = req.query;
     console.log(category)
    const filter={}

     if(productType)
          filter.productType=productType
     if(category)
          filter.category=category
     if(unit)
          filter.unit=unit
     if(tax)
          filter.tax=tax
     if(brand)
          filter.brand=brand
     if(businessLocation)
          filter.businessLocation=businessLocation
     if(status)
          filter.status=status
     if(manufacturer)
          filter.manufacturer=manufacturer
     if(supplier)
          filter.supplier=supplier
     if(deviceModel)
          filter.deviceModel=deviceModel
    const allDoc = await productSchema
      .find(filter)
      .skip(limit * (page - 1))
      .limit(limit);
    return res
      .status(200)
      .json({ result: allDoc, message: "All doc fetched successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};


routes.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId)
      return res.status(400).json({ error: "product id is required" });

    const doc = await productSchema.findById(productId);
    if (!doc)
      return res.status(400).json({ error: "product not found with this id" });

    return res
      .status(200)
      .json({ result: doc, message: " document fetched successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(req.body)       
    if (!productId)
      return res.status(400).json({ error: "product id is required" });

    const doc = await productSchema.findByIdAndUpdate(productId,req.body,{new:true});
    if (!doc)
      return res.status(400).json({ error: "product not found with this id" });

    return res
      .status(200)
      .json({ result: doc, message: " document updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId)
      return res.status(400).json({ error: "product id is required" });

    const doc = await productSchema.findByIdAndDelete(productId);
    if (!doc)
      return res.status(400).json({ error: "product not found with this id" });

    return res
      .status(200)
      .json({ result: doc, message: " document deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};


routes.importProducts=async(req,res)=>{
  try {
    if (req.file) return res.status(400).json({ error: "File not uploaded" });
    const productsData = await csv().fromString(req.file.buffer.toString());
    console.log(productsData);
    for (let product of productsData) {
      const { error } = productValidation.validate(product);
      if (error)
        return res.status(400).json({ error: error.details[0].message });
    }
    const newProducts = await customerAndSupplierSchema.insertMany(productsData);
    res
      .status(201)
      .json({ result: newProducts, message: "document created successfully" });
  } catch (error) {
    console.log({ error: error });
    res.status(500).json({ error: "Something went wrong" });
  }

} 


export default routes;
