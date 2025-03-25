import quotationModel from "../../models/sell/quotation.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";

const routes = {};

routes.addquotation = async(req,res)=>{
    try{
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
            const fileKey = `quotation/${uuidv4()}_${file.originalname}`;

            const uploadResult = await uploadFile(file, fileKey);
            attachDocument = uploadResult.Location; 
        }

        const newquotation = new quotationModel({
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

        await newquotation.save();

        res.status(201).json({
            message: "Quotation added successfully",
            sale: newquotation,
        });
    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Something went wrong"})
    }
}

routes.getAllQuotation = async(req,res)=>{
    try{
        const allQuotation = await quotationModel.find().populate("customer")

        if(!allQuotation || allQuotation.length == 0){
            return res.status(400).json({error:"No Quotation found"})
        }

        return res.status(200).json({result: allQuotation,message:"Quotation retrived successfully"})
    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Something went wrong"})
    }
}

routes.getQuotationById = async(req,res)=>{
    try{
        const quotationId = req.params.id

        if(!quotationId){
            res.status(400).json({error:"Quotation Id Required"})
        }
        const quotation = await quotationModel.findById(quotationId).populate("customer")

        if(!quotation){
            res.status(400).json({error:`Quotation not found qith id ${quotationId}`})
        }
        return res.status(200).json({result:quotation,message:"Quotation retrived Successfully"})
    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Something went wrong"})
    }
}

routes.updateQuotationById = async(req,res)=>{
    try{
        const quotationId = req.params.id
        
        if(!quotationId){
            res.status(400).json({error:"Quotation Id Required"})
        }
        const quotation = await quotationModel.findByIdAndUpdate(quotationId,req.body,{new:true})

        if (!quotation)
            return res
              .status(404)
              .json({ error: `Quotation not found with id:${quotationId}` });
          return res
            .status(200)
            .json({ result: quotation, message: "Quotation Updated Successfully" });
        
    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Something went wrong"})
    }
}

routes.deleteQuotationById = async(req,res)=>{
    try{
        const quotationId = req.params.id
        
        if(!quotationId){
            res.status(400).json({error:"Quotation Id Required"})
        }
        const quotation = await quotationModel.findByIdAndDelete(quotationId) 

        if (!quotation)
            return res
              .status(404)
              .json({ error: `Quotation not found with id:${quotationId}` });
        return res
              .status(200)
              .json({ result: quotation, message: "Quotation Updated Successfully" });
    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Something went wrong"})
    }
}
export default routes;
