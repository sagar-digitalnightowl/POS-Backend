import draftModel from "../../models/sell/draft.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";

const routes = {};

routes.addDraft = async (req, res) => {
    try {
        const {
            customer,
            payTerm,
            saleDate,
            status,
            invoiceSchema,
            invoiceNo,
            discountType,
            discountAmount,
            orderTax,
            sellNote,
            shippingDetails,
            shippingAddress,
            shippingCharges,
            shippingStatus,
            deliveredTo,
            deliveryPerson,
            additionalExpenses,
        } = req.body;

        let attachDocument = null;
        let shippingDocuments = null;

        if (req.files && req.files.length > 0) {
            const file = req.files[0];
            const fileKey = `draft/${uuidv4()}_${file.originalname}`;

            const uploadResult = await uploadFile(file, fileKey);
            attachDocument = uploadResult.Location; 
        }

        const newDraft = new draftModel({
            customer,
            payTerm: payTerm ? {
                value: payTerm.value || null,
                unit: payTerm.unit || null,
            }: null,
            saleDate,
            status,
            invoiceSchema,
            invoiceNo,
            attachDocument,
            discountType,
            discountAmount,
            orderTax,
            sellNote,
            shippingDetails,
            shippingAddress,
            shippingCharges,
            shippingStatus,
            deliveredTo,
            deliveryPerson,
            shippingDocuments,
            additionalExpenses,
        });

        await newDraft.save();

        res.status(201).json({
            message: "Draft added successfully",
            result: newDraft,
        });
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
};

routes.getAllDraft = async(req,res)=>{
    try{
        const allDraft = await draftModel.find().populate("customer")

        if(!allDraft || allDraft.length === 0){
            return res.status(404).json({ message: "No Sales found" });
        }

        return res.status(200).json({result: allDraft,message:"Draft Retrived Successfully"})
    }catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getDraftById = async(req,res)=>{
    try{
        const draftId = req.params.id

        if(!draftId){
            res.status(400).json({error:"Draft Id is required"})
        }
        const draft = await draftModel.findById(draftId).populate('customer')

        if(!draft){
            res.status(400).json({error:`Draft is not found with id=${draftId}`})
        }

        return res.status(200).json({result: draft,message:"Draft Retrived Successfully"})

    }catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateDraftById = async(req,res)=>{
    try{
        const draftId = req.params.id;
    if (!draftId) return res.status(400).json({ error: "Draft Id is required" });
    const draftReturn = await draftModel.findByIdAndUpdate(draftId, req.body,{new:true});

    if (!draftReturn)
        return res
          .status(404)
          .json({ error: `Drat not found with id:${draftId}` });
      return res
        .status(200)
        .json({ result: draftReturn, message: "Drat Updated Successfully" });
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.deleteDraftById = async(req,res)=>{
    try{
        const draftId = req.params.id
    if(!draftId) return res.status(400).json({ error: "Draft Id is required" });
    const deleteDraft = await draftModel.findByIdAndDelete(draftId)

    if(!deleteDraft) {
      return res
        .status(404)
        .json({ error: `Draft not found with ID: ${draftId}` });
    }
    return res
    .status(200)
    .json({ result: deleteDraft, message: "Draft Deleted Successfully" });
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Something Went Wrong"})
    }
}


export default routes;