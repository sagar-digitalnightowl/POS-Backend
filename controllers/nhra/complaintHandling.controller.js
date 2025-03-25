import complaintHandlingModel from "../../models/nhra/complaintHandling.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import productModel from "../../models/products/productList.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";

const routes = {}

routes.addComplaintHandling = async(req,res)=>{
    try {
        const{
            complainantName,
            complainantMobNo,
            complainantEmail,
            complainantCPRnumber,
            complaintDate,

            authorizedRepresentativeName,

            medicalDeviceName,

            complaintDescription,
            actionTakenByAR
        } = req.body

        let supportiveDocuments = null;

        if (req.file) {
            const file = req.file;
            const fileKey = `complaintHandeling/${uuidv4()}_${file.originalname}`;

            const uploadResult = await uploadFile(file, fileKey);
            supportiveDocuments = uploadResult.Location; 
        }
        console.log('Uploaded Files: ', req.file);


        const authorizedRepresentative = await authorizedRepresentativeModel.findById(authorizedRepresentativeName)
        if (!authorizedRepresentative) {return res.status(404).json({ error: "Authorized Representative not found" });}

        const medicalDevice = await productModel.findById(medicalDeviceName);
        if (!medicalDevice) {return res.status(404).json({ error: "Device not found" });}

        const newComplaintHandling = new complaintHandlingModel({
            complainantName,
            complainantMobNo,
            complainantEmail,
            complainantCPRnumber,
            complaintDate,

            authorizedRepresentativeName,
            mobileNumber: authorizedRepresentative.phoneNumber,
            authorizedRepresentativeEmail: authorizedRepresentative.emailAddress,
            CRCPRno: authorizedRepresentative.CRCPRNo,

            medicalDeviceName,
            serialNo: medicalDevice.productSerialNo,
            gmdnCode: medicalDevice.productGMDNCode,
            hsCode: medicalDevice.productHSCode,

            complaintDescription,
            actionTakenByAR,
            supportiveDocuments

        })
        await newComplaintHandling.save()
        res.status(200).json({result:newComplaintHandling,message:"Complaint Handling added successfully"})
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.getAllComplaintHandling = async(req,res)=>{
    try {
        const allComplainHandling = await complaintHandlingModel.find()
        .populate('authorizedRepresentativeName','name')
        .populate('medicalDeviceName','productName')

        if(!allComplainHandling){
            return res.status(400).json({error:"No Complain found"})
        }

        res.status(200).json({result:allComplainHandling,message:"Complain Data retrived successfully"})
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.getComplaintHandlingById = async(req,res)=>{
    try {
        const complaintHandlingId = req.params.id

        if(!complaintHandlingId){
            res.status(400).json({error:"Complaint Handling Id is required"})
        }
        const complaintHandling = await complaintHandlingModel.findById(complaintHandlingId)
        .populate('authorizedRepresentativeName','name')
        .populate('medicalDeviceName','productName')

        if(!complaintHandling){
            res.status(400).json({error:`Complaint Handling is not found with ID ${complaintHandlingId}`})
        }
        res.status(200).json({result:complaintHandling,message:"Complaint Handling retrived Successfully"}) 
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.updateHandlingById = async(req,res)=>{
    try {
        const complaintHandlingId = req.params.id
        const updateData = req.body;

        if(!complaintHandlingId){
            res.status(400).json({error:"Complaint Handling Id is required"})
        }

        if(updateData.authorizedRepresentativeName){
            const authorizedRepresentative = await authorizedRepresentativeModel.findById(updateData.authorizedRepresentativeName)
        if (!authorizedRepresentative) {return res.status(404).json({ error: "Authorized Representative not found" });}
        updateData.mobileNumber = authorizedRepresentative.phoneNumber;
        updateData.authorizedRepresentativeEmail = authorizedRepresentative.emailAddress;
        updateData.CRCPRno = authorizedRepresentative.CRCPRNo;
        }
        if(updateData.medicalDeviceName){
            const medicalDevice = await productModel.findById(deviceName);
        if (!medicalDevice) {return res.status(404).json({ error: "Device not found" });}
        updateData.serialNo = medicalDevice.productSerialNo;
        updateData.gmdnCode = medicalDevice.productGMDNCode;
        updateData.hsCode = medicalDevice.productHSCode;
        }

        const complaintHandling = await complaintHandlingModel.findByIdAndUpdate(complaintHandlingId,updateData,{new:true})

        if(!complaintHandling){
            res.status(400).json({error:`Complain is not found with Id ${complaintHandlingId}`})
        }
        res.status(200).json({result:complaintHandling,message:"Complain updated successfully"})
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.deleteHandlingById = async(req,res)=>{
    try {
        const complaintHandlingId = req.params.id

        if(!complaintHandlingId){
            res.status(400).json({error:"Complaint Handling Id is required"})
        } 
        const complaintHandling = await complaintHandlingModel.findByIdAndDelete(complaintHandlingId)
    if(!complaintHandling){
      return res.status(400).json({error:`Complaint Handling is not found with Id ${complaintHandlingId}`})
    }
    res.status(200).json({result:complaintHandling,message:"Complaint Handling Deleted Successfully"})
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

export default routes;