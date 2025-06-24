import { productValidation } from "../../validations/joi.validations.js";
import productSchema from "../../models/products/productList.model.js";
import { uploadFile, deleteFile } from "../../utils/s3.js";
import { handleFilesUpload, updateFilesUpload } from "../../cloudService/fileService.js";

const routes = {};

routes.addProducts = async (req, res) => {
  try {
    // console.log("Received product data:", req.body);

    // ✅ Extract and parse JSON fields for nested objects
    const { defaultPurchasePrice, defaultSellingPrice, ...restBody } = req.body;

    const productData = {
      ...restBody,
      defaultPurchasePrice: defaultPurchasePrice
        ? JSON.parse(defaultPurchasePrice)
        : undefined,
      defaultSellingPrice: defaultSellingPrice
        ? JSON.parse(defaultSellingPrice)
        : undefined,
    };

    // ✅ Validate data using Joi
    const { error } = productValidation.validate(productData);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        details: error.details,
      });
    }

    // ✅ Upload files if present
    let productImage = "";
    let productBrochure = "";

    // if (req.files) {
    //   const imageFile = req.files.find(file => file.fieldname === "productImage");
    //   const brochureFile = req.files.find(file => file.fieldname === "productBrochure");

    //   if (imageFile) {
    //     const imageUpload = await uploadFile(imageFile.buffer, `products/${Date.now()}_productImage.jpg`, imageFile.mimetype);
    //     productImage = imageUpload.Location;
    //   }

    //   if (brochureFile) {
    //     const brochureUpload = await uploadFile(brochureFile.buffer, `products/${Date.now()}_brochure.pdf`, brochureFile.mimetype);
    //     productBrochure = brochureUpload.Location;
    //   }
    // }

    const uploadedFiles = await handleFilesUpload(req.files, "Products");

    // ✅ Create product entry
    const newProduct = await productSchema.create({
      ...productData,
      productImage: uploadedFiles.productImage,
      productBrochure: uploadedFiles.productBrochure,
    });

    return res.status(201).json({
      result: newProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("addProducts error:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
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
    console.log(category);
    const filter = {};

    if (productType) filter.productType = productType;
    if (category) filter.category = category;
    if (unit) filter.unit = unit;
    if (tax) filter.tax = tax;
    if (brand) filter.brand = brand;
    if (businessLocation) filter.businessLocation = businessLocation;
    if (status) filter.status = status;
    if (manufacturer) filter.manufacturer = manufacturer;
    if (supplier) filter.supplier = supplier;
    if (deviceModel) filter.deviceModel = deviceModel;

    const totalProduct = await productSchema.countDocuments(filter);
    const totalPage = Math.ceil(totalProduct / limit);

    const allDoc = await productSchema
      .find(filter)
      .populate("unit", "name shortName")
      .populate("brand", "name")
      .populate("category", "name")
      .populate("manufacturer", "name email")
      .skip(limit * (page - 1))
      .limit(limit);
    return res.status(200).json({
      result: allDoc,
      message: "All doc fetched successfully",
      totalPage,
    });
  } catch (error) {
    return res.status(500).json({ error: "Somethig went wrong" });
  }
};

routes.getProducts = async (req, res) => {
  try {
    const { isMedical } = req.query;

    const filter = {};
    if (isMedical === "Yes") {
      filter["isMedical"] = isMedical;
    }

    const doc = await productSchema
      .find(filter)
      .select(
        "_id productName businessLocations deviceName deviceModel unit brand category defaultSellingPrice productDescription productModel productSerialNo productGMDNCode productHSCode batchNo"
      )
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ result: doc, message: " document fetched successfully" });
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
    if (!productId)
      return res.status(400).json({ error: "Product ID is required" });

    const existingProduct = await productSchema.findById(productId);
    if (!existingProduct)
      return res.status(404).json({ error: "Product not found" });

    const files = req.files || [];

    const updateData = { ...req.body };

    if (
      updateData.defaultPurchasePrice &&
      typeof updateData.defaultPurchasePrice === "string"
    )
      updateData.defaultPurchasePrice = JSON.parse(
        updateData.defaultPurchasePrice
      );
    if (
      updateData.defaultSellingPrice &&
      typeof updateData.defaultSellingPrice === "string"
    )
      updateData.defaultSellingPrice = JSON.parse(
        updateData.defaultSellingPrice
      );

    // const fileMap = {
    //   productImage: null,
    //   productBrochure: null,
    // };

    // // Handle files (if any)
    // for (const file of files) {
    //   const fieldname = file.fieldname;

    //   // Delete old file if new one is uploaded
    //   if (fieldname === "productImage" && existingProduct.productImage) {
    //     const oldKey = existingProduct.productImage.split(".com/")[1];
    //     await deleteFile(oldKey);
    //   }

    //   if (fieldname === "productBrochure" && existingProduct.productBrochure) {
    //     const oldKey = existingProduct.productBrochure.split(".com/")[1];
    //     await deleteFile(oldKey);
    //   }

    //   // Upload new file
    //   const timestamp = Date.now();
    //   const fileName = `products/${timestamp}_${file.originalname}`;
    //   const result = await uploadFile(file.buffer, fileName, file.mimetype);

    //   fileMap[fieldname] = result.Location;
    // }

    // // Add uploaded file URLs to update data
    // if (fileMap.productImage) {
    //   updateData.productImage = fileMap.productImage;
    // }

    // if (fileMap.productBrochure) {
    //   updateData.productBrochure = fileMap.productBrochure;
    // }

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existingProduct,
          "Products"
        );
        Object.assign(updateData, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const updatedProduct = await productSchema.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    return res
      .status(200)
      .json({
        result: updatedProduct,
        message: "Product updated successfully",
      });
  } catch (error) {
    console.error("updateProductById error:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId)
      return res.status(400).json({ error: "Product ID is required" });

    const doc = await productSchema.findByIdAndDelete(productId);
    if (!doc)
      return res.status(404).json({ error: "Product not found with this ID" });

    // Delete image file from S3 if exists
    if (doc.productImage) {
      const imageKey = doc.productImage.split(".com/")[1];
      await deleteFile(imageKey);
    }

    // Delete brochure file from S3 if exists
    if (doc.productBrochure) {
      const brochureKey = doc.productBrochure.split(".com/")[1];
      await deleteFile(brochureKey);
    }

    return res
      .status(200)
      .json({ result: doc, message: "Product deleted successfully" });
  } catch (error) {
    console.error("deleteProductById error:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.importProducts = async (req, res) => {
  try {
    if (req.file) return res.status(400).json({ error: "File not uploaded" });
    const productsData = await csv().fromString(req.file.buffer.toString());
    console.log(productsData);
    for (let product of productsData) {
      const { error } = productValidation.validate(product);
      if (error)
        return res.status(400).json({ error: error.details[0].message });
    }
    const newProducts = await customerAndSupplierSchema.insertMany(
      productsData
    );
    res
      .status(201)
      .json({ result: newProducts, message: "document created successfully" });
  } catch (error) {
    console.log({ error: error });
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
