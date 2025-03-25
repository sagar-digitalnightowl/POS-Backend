import deliveryNoteLayoutModel from "../../models/settings/deliveryNoteLayout.model.js";
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from '../../utils/s3.js';

const routes = {}

routes.addDeliveryNoteLayout = async(req,res)=>{
    try {
        const data = req.body
    let invoiceLogo = null

    if (req.file) {
        const file = req.file;
        const fileKey = `invoiceLogo/${uuidv4()}_${file.originalname}`;

        const uploadResult = await uploadFile(file, fileKey);
        invoiceLogo = uploadResult.Location; 
    }
    console.log('Uploaded Files: ', req.file);

    if(!data.layoutName){
        return res.status(400).json({error:"Layout Name is required"})
    }

    const newDeliveryNoteLayout = new deliveryNoteLayoutModel({
        ...data,
        invoiceLogo
    })
    await newDeliveryNoteLayout.save();
    return res.status(200).json({result:newDeliveryNoteLayout,message:'Delivery Note Layout added successfully'})   
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllDeliveryNoteLayout = async(req,res)=>{
    try {
        const allDeliveryNoteLayout = await deliveryNoteLayoutModel.find()

        if(!allDeliveryNoteLayout || allDeliveryNoteLayout.length === 0){
            return res.status(400).json({error:"No Delivery Note Layout found"})
        }
        return res.status(200).json({result:allDeliveryNoteLayout,message:"Data fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getDeliveryNoteLayoutById = async(req,res)=>{
    try {
        const deliveryNoteLayoutId = req.params.id
        if(!deliveryNoteLayoutId){
            return res.status(400).json({error:'Id is required'})
        }

        const deliveryNoteLayout = await deliveryNoteLayoutModel.findById(deliveryNoteLayoutId)

        if(!deliveryNoteLayout){
            return res.status(404).json({error:`Delivery Note Layout is not found with Id ${deliveryNoteLayoutId}`})
        }

        return res.status(200).json({result:deliveryNoteLayout,messsage:"Data fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateDeliveryNoteById = async(req,res)=>{
    try {
        const deliveryNoteLayoutId = req.params.id

        if(!deliveryNoteLayoutId){
            return res.status(400).json({error:'Id is required'})
        }
        let updatedData = { ...req.body };

        if (req.file) {
            const file = req.file;
            const fileKey = `invoiceLogo/${uuidv4()}_${file.originalname}`;
            const uploadResult = await uploadFile(file, fileKey);

            updatedData.invoiceLogo = uploadResult.Location; // Update the file URL
        }
        const deliveryNoteLayout = await deliveryNoteLayoutModel.findByIdAndUpdate(deliveryNoteLayoutId,updatedData,{new:true})

        if(!deliveryNoteLayout){
            return res.status(404).json({error:`Delivery Note Layout is not found with Id ${deliveryNoteLayoutId}`})
        }
        return res.status(200).json({result:deliveryNoteLayout,message:"Delivery Note Layout updated successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}
routes.deleteDeliveryNoteById = async(req,res)=>{
    try {
        const deliveryNoteLayoutId = req.params.id

        if(!deliveryNoteLayoutId){
            return res.status(400).json({error:'Id is required'})
        }
        const deliveryNoteLayout = await deliveryNoteLayoutModel.findByIdAndDelete(deliveryNoteLayoutId)
        if(!deliveryNoteLayout){
            return res.status(400).json({result:deliveryNoteLayout,message:`Delivery Note Layout is not found with Id ${deliveryNoteLayoutId}`})
        }
        return res.status(200).json({result:deliveryNoteLayout,message:"Delivery Note Layout updated successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}
export default routes;