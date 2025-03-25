import purchaseReturnModel from "../../models/purchase/purchaseReturn.model.js";
// import { v4 as uuidv4 } from 'uuid';
// import { uploadFile } from "../../utils/s3.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from 'fs'

const routes = {}

routes.addPurchaseReturn = async (req,res) =>{
    try{
      const { supplier, businessLocation, referenceNo, date } = req.body;
      let attachDocuments = null;
  
      if (req.file) {
        const file = req.file;
        const localFilePath = `./public/temp/${file.filename}`;

        const moduleName = "purchaseReturn";

        const uploadResult = await uploadOnCloudinary(localFilePath, moduleName);
  
        if (uploadResult) {
          attachDocuments = uploadResult.secure_url; 
          fs.unlinkSync(localFilePath);
        } else {
          throw new Error("File upload to Cloudinary failed");
        }
      }
  
      console.log("Uploaded File URL: ", attachDocuments);
  
      // Create the PurchaseReturn object
      const newPurchaseReturn = new purchaseReturnModel({
        supplier,
        businessLocation,
        referenceNo,
        date,
        attachDocuments,
        // purchaseTax
      });
  
      // Save the new purchase return to the database
      await newPurchaseReturn.save();
  
      // Send success response
      res.status(201).json({
        message: "Purchase return added successfully",
        purchaseReturn: newPurchaseReturn
      });
    } catch (error) {
        console.log("error=",error)
        res.status(500).json({ error: "Something went wrong" });
      }
}

routes.getAllPurchaseReturn = async (req,res) =>{
  try{
    const purchaseReturn = await purchaseReturnModel.find().populate("supplier").populate("businessLocation")

    if(!purchaseReturn || purchaseReturn.length === 0){
      return res.status(404).json({ message: "No purchases found" });
    }

    return res.status(200).json({result: purchaseReturn, message: "Purchase return retrieved successfully" })

  } catch(error){
    console.log("error=",error)
    res.status(500).json({ error: "Something went wrong" });
  }

}

routes.getAllPurchaseReturnById = async (req,res)=>{
  try{
    const purchaseId = req.params.id

    if(!purchaseId){
      return res.status(400).json({error:"Purchase Id is required"})
    }

    const purchaseReturn = await purchaseReturnModel.findById(purchaseId).populate("supplier").populate("businessLocation")

    if(!purchaseReturn){
      return res
      .status(400)
      .json({error: `Purchase return is not found with Id ${purchaseId}`})
    }
    return res
    .status(200)
    .json({result: purchaseReturn,message: "Purchase Return Retrieved Successfully"})
  } catch(error){
    console.log("error=",error)
    res.status(500).json({error: "Something Went Wrong"})
  }
}

routes.updatePurchaseReturnById = async (req,res)=>{
  try{
    const purchaseReturnId = req.params.id;
    
    if (!purchaseReturnId) return res.status(400).json({ error: "Purchase return Id is required" });
    const purchaseReturn = await purchaseReturnModel.findByIdAndUpdate(purchaseReturnId, req.body,{new:true});

    if (!purchaseReturn)
        return res
          .status(404)
          .json({ error: `Purchase return not found with id:${purchaseReturnId}` });
      return res
        .status(200)
        .json({ result: purchaseReturn, message: "Purchase return Updated Successfully" });
  } catch(error){
    console.log("error = ",error)
    res.status(500).json({error: "Something went wrong"})
  }
}

routes.deletePurchaseById = async(req,res)=>{
  try{
    const purchaseReturnID = req.params.id
    if(!purchaseReturnID) return res.status(400).json({ error: "Purchase return Id is required" });
    const deleteReturn = await purchaseReturnModel.findByIdAndDelete(purchaseReturnID)

    if(!deleteReturn) {
      return res
        .status(404)
        .json({ error: `Purchase not found with ID: ${purchaseReturnID}` });
    }
    return res
    .status(200)
    .json({ result: deleteReturn, message: "Purchase Deleted Successfully" });
  } catch(error){
    console.log("error =",error)
    res.status(500).json({error:"Something Went Wrong"})
  }
}


export default routes;