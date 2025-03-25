import safetyNoticeModel from "../../models/nhra/safetyNotice.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import healthFacilityModel from "../../models/nhra/healthFacility.model.js";
import productModel from "../../models/products/productList.model.js";
import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";

const routes = {}

routes.addSafetyNotice = async(req,res)=>{
    try{
        const{
            reportType,
            riskClassification,
            reporterIssuer,
            regulatoryAuthority,
            reportReferenceLink,
            copyOfReport,

            manufacturerName,

            deviceName,

            descriptionOfFSN,
            advisedActionByTheManufacturer,

            authorizedRepresentativeName,

            correctiveAction,
            recall,

            healthCareFacilityName,

            contactPerson,

        }=req.body

        let documents = {
            copyOfReport: null,
            lpo: null,
            importationHistory: null,
            nhraMedicalDeviceRegistrationLicense: null,
            returnInvoice: null,
            destructionInvoice: null,
            acknowledgment: null,
            signature: null,
            signatureDeclarationLetter: null
        };



          const manufacturer = await manufacturerModel.findById(manufacturerName)
          if (!manufacturer) {return res.status(404).json({ error: "Manufacturer not found" });}  

          const medicalDevice = await productModel.findById(deviceName);
          if (!medicalDevice) {return res.status(404).json({ error: "Device not found" });}

          const authorizedRepresentative = await authorizedRepresentativeModel.findById(authorizedRepresentativeName)
          if (!authorizedRepresentative) {return res.status(404).json({ error: "Authorized Representative not found" });}

          const healthCareFacility = await healthFacilityModel.findById(healthCareFacilityName)
          if (!healthCareFacility) {return res.status(404).json({ error: "Health Care Facility not found" });}

          const newSafetyNotice = new safetyNoticeModel({
            reportType,
            riskClassification,
            reporterIssuer,
            regulatoryAuthority,
            reportReferenceLink,
            copyOfReport,
            manufacturerName,
            countryOfOrigin: manufacturer.country,
            manufacturerEmail: manufacturer.email,
            deviceName,
            modelNumber: medicalDevice.productModel,
            gmdnCODE: medicalDevice.productGMDNCode,
            serialNumber: medicalDevice.productSerialNo,
            hsCode: medicalDevice.productHSCode,
            descriptionOfFSN,
            advisedActionByTheManufacturer,
            authorizedRepresentativeName,
            mobileNumber: authorizedRepresentative.phoneNumber,
            authorizedRepresentativeEmail: authorizedRepresentative.emailAddress,
            nhraLicenseNumber: authorizedRepresentative.licenseNumber,
            cprNumber: authorizedRepresentative.CRCPRNo,
            ...documents,
            correctiveAction,
            recall,
            healthCareFacilityName,
            contactPersonMobile: healthCareFacility.person_mobile,
            contactPerson: healthCareFacility.person_name,
            email: healthCareFacility.person_email,
            contactPersonCPR: healthCareFacility.person_cpr,
            contactPerson
          })
          await newSafetyNotice.save()
         res.status(200).json({result:newSafetyNotice,message:"Safety Notice added successfully"})
    }catch(error){
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.getAllSafetyNotice = async(req,res)=>{
    try{
        const allSafetyNotice = await safetyNoticeModel.find()
        .populate('manufacturerName','name')
        .populate('deviceName','productName')
        .populate('authorizedRepresentativeName','name')
        .populate('healthCareFacilityName','facility_name')

        if(!allSafetyNotice || allSafetyNotice === 0){
            return res.status(400).json({error:"No Safety Notice found"})
        }
        res.status(200).json({result:allSafetyNotice,message:"Safety Notice retrived successfully"})
    }catch(error){
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.getSafetyNoticeById = async(req,res)=>{
    try {
        const safetyNoticeId = req.params.id

        if(!safetyNoticeId){
            res.status(400).json({error:"Safety Notice Id is required"})
        }
        const safetyNotice = await safetyNoticeModel.findById(safetyNoticeId)
        .populate('manufacturerName','name')
        .populate('deviceName','productName')
        .populate('authorizedRepresentativeName','name')
        .populate('healthCareFacilityName','facility_name')

        if(!safetyNotice){
            res.status(400).json({error:`Safety Notice is not found with ID ${safetyNoticeId}`})
        }
        res.status(200).json({result:safetyNotice,message:"Safety Notice retrived Successfully"}) 
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.updateSafetyNoticeById = async(req,res)=>{
    try{
        const safetyNoticeId = req.params.id
        const updateData = req.body;

        if(!safetyNoticeId){
            res.status(400).json({error:"Safety Notice Id is required"})
        }

        if(updateData.manufacturerName){
            const manufacturer = await manufacturerModel.findById(updateData.manufacturerName)
          if (!manufacturer) {return res.status(404).json({ error: "Manufacturer not found" });}
            updateData.countryOfOrigin = manufacturer.country;
            updateData.manufacturerEmail = manufacturer.email;
        }
        if(updateData.deviceName){
          const medicalDevice = await productModel.findById(deviceName);
          if (!medicalDevice) {return res.status(404).json({ error: "Device not found" });}
          updateData.modelNumber = medicalDevice.productModel;
          updateData.gmdnCODE = medicalDevice.productGMDNCode;
          updateData.serialNumber = medicalDevice.productSerialNo;
          updateData.hsCode = medicalDevice.productHSCode;
        }
        if(updateData.authorizedRepresentativeName){
          const authorizedRepresentative = await authorizedRepresentativeModel.findById(authorizedRepresentativeName)
          if (!authorizedRepresentative) {return res.status(404).json({ error: "Authorized Representative not found" });}
          updateData.mobileNumber = authorizedRepresentative.phoneNumber;
          updateData.authorizedRepresentativeEmail = authorizedRepresentative.emailAddress;
          updateData.nhraLicenseNumber = authorizedRepresentative.licenseNumber;
          updateData.cprNumber =  authorizedRepresentative.CRCPRNo;
        }
        if(updateData.healthCareFacilityName){
            const healthCareFacility = await healthFacilityModel.findById(healthCareFacilityName)
          if (!healthCareFacility) {return res.status(404).json({ error: "Health Care Facility not found" });}
            updateData.contactPersonMobile = healthCareFacility.person_mobile;
            updateData.contactPerson = healthCareFacility.person_name;
            updateData.email = healthCareFacility.person_email;
            updateData.contactPersonCPR = healthCareFacility.person_cpr;
        }
        const safetyNotice = await safetyNoticeModel.findByIdAndUpdate(safetyNoticeId,updateData,{new:true})

        if(!safetyNotice){
            res.status(400).json({error:`Safety Notice is not found with Id ${safetyNoticeId}`})
        }
        res.status(200).json({result:safetyNotice,message:"Safety Notice updated successfully"})
    }catch(error){
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}
routes.deleteSafetyNoticeById = async(req,res)=>{
    try {
        const safetyNoticeId = req.params.id

        if(!safetyNoticeId){
            res.status(400).json({error:"Safety Notice Id is required"})
        }
        const safetyNotice = await safetyNoticeModel.findByIdAndDelete(safetyNoticeId)
    if(!safetyNotice){
      return res.status(400).json({error:`Safety Notice is not found with Id ${safetyNoticeId}`})
    }
    res.status(200).json({result:safetyNotice,message:"Safety Notice Deleted Successfully"})

    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

export default routes