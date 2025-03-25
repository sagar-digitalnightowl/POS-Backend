import disposeModel from "../../models/nhra/dispose.model.js";
import productModel from "../../models/products/productList.model.js";
import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";
import healthFacilityModel from "../../models/nhra/healthFacility.model.js";


const routes = {}

routes.addDispose = async(req,res)=>{
    try {
        const{
            name,
            cprNumber,
            mobileNumber,
            email,
            date,

            deviceName,
            numberOfDevicesInvolved,
            lotNo,
            nhraRegistrationCertificateNo,

            manufacturerName,
            reasonOfDisposal,
            otherReasonOfDisposal,
            action,

            healthCareFacilityName,
            healthCareFacilityEmail,
            healthCareFacilitycrNo,
            nhraLicenseNo,

            authorizedRepresentativeName,
            dateOfReportAwareness,
            companyName,
            telephoneNo,
            emailAddress,
            address,
            crNo,
            reportStatus,
            otherReportStatus

        }=req.body
        let documents ={
            supremeCouncilOfEnvironmentApproval: null,
            airwayBill: null,
            destructionInvoice: null,
            nhraLicenseNo: null
        }
        if (req.files && req.files.length > 0) {
              for (const file of req.files) {
                const fileKey = `importation/${uuidv4()}_${file.originalname}`;
                const uploadResult = await uploadFile(file, fileKey);
        
                // Match file field name with the corresponding document key
                if (file.fieldname in documents) {
                  documents[file.fieldname] = uploadResult.Location;
                }
              }
            }

            const product = await productModel.findById(deviceName);
            if (!product) {
              return res.status(404).json({ error: "Device not found" });
            }    
            const manufacturer = await manufacturerModel.findById(manufacturerName);
            if (!manufacturer) {
            return res.status(404).json({ error: "Manufacturer not found" });
            }
            const healthCareFacility = await healthFacilityModel.findById(healthCareFacilityName);
            if(!healthCareFacility){
            return res.status(404).json({ error: "Health Care Facility not found" });
            }
            const authorizedRepresentative = await authorizedRepresentativeModel.findById(authorizedRepresentativeName);
            if (!authorizedRepresentative) {return res.status(404).json({ error: "Authorized Representative not found" });
            }
        
        const newDispose = new disposeModel({
            name,
            cprNumber,
            mobileNumber,
            email,
            date: date || Date.now(),
            deviceName,
            modelNumber: product.productModel,
            numberOfDevicesInvolved,
            serialNumber: product.productSerialNo,
            lotNo,
            nhraRegistrationCertificateNo,
            ...documents,
            manufacturerName,
            manufacturerEmail: manufacturer.email,
            reasonOfDisposal,
            otherReasonOfDisposal,
            action,
            healthCareFacilityName,
            hfcContactPersonName: healthCareFacility.person_name,
            healthCareFacilityAddress: healthCareFacility.facility_address,
            hfcContactPersonPosition: healthCareFacility.person_position,
            hfcContactPersonNumber: healthCareFacility.person_mobile,
            hfcContactPersonCPR: healthCareFacility.person_cpr,
            healthCareFacilityEmail,
            healthCareFacilitycrNo,
            authorizedRepresentativeName,
            mobileNumber: authorizedRepresentative.phoneNumber,
            authorizedRepresentativeEmail: authorizedRepresentative.emailAddress,
            dateOfReportAwareness: date || Date.now(),
            companyName,
            telephoneNo,
            emailAddress,
            address,
            crNo,
            reportStatus,
            otherReportStatus
        })
        await newDispose.save()
        res.status(200).json({result:newDispose,message:"Dispose added successfully"})
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.getAllDispose = async(req,res)=>{
    try {
        const allDispose = await disposeModel.find()
        .populate('deviceName','productName')
        .populate('manufacturerName','name')
        .populate('healthCareFacilityName','facility_name')
        .populate('authorizedRepresentativeName','name')

    if(!allDispose || allDispose.length ===0){
      return res.status(404).json({ message: "Dispose Event found" });
    }

    return res.status(200).json({result: allDispose,message:"Dispose Retrived Successfully"})
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.getDisposeById = async(req,res)=>{
    try {
        const disposeById = req.params.id

        if(!disposeById){
            res.status(400).json({error:"Dispose Id is required"})
        }
        const dispose = await disposeModel.findById(disposeById)
        .populate('deviceName','productName')
        .populate('manufacturerName','name')
        .populate('healthCareFacilityName','facility_name')
        .populate('authorizedRepresentativeName','name')

        if(!dispose){
            res.status(400).json({error:`Dispose is not found with ID ${disposeById}`})
        }
        res.status(200).json({result:dispose,message:"Dispose retrived Successfully"})
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.updateDisposeById = async(req,res)=>{
    try {
        const disposeById = req.params.id;
        const updateData = req.body;

        if(!disposeById){
            res.status(400).json({error:"Dispose Id is required"})
        }

        if(updateData.deviceName){
            const product = await productModel.findById(deviceName);
            if (!product) {
              return res.status(404).json({ error: "Device not found" });
            }
            updateData.modelNumber = product.productModel;
            updateData.serialNumber = product.productSerialNo;
        }
        if(updateData.manufacturer){
            const manufacturer = await manufacturerModel.findById(manufacturerName);
            if (!manufacturer) {
            return res.status(404).json({ error: "Manufacturer not found" });
            }
            updateData.manufacturerEmail = manufacturer.email;
        }
        if(updateData.healthCareFacilityName){
            const healthCareFacility = await healthFacilityModel.findById(healthCareFacilityName);
            if(!healthCareFacility){
            return res.status(404).json({ error: "Health Care Facility not found" });
            }
            updateData.hfcContactPersonName = healthCareFacility.person_name;
            updateData.healthCareFacilityAddress = healthCareFacility.facility_address;
            updateData.hfcContactPersonPosition = healthCareFacility.person_position;
            updateData.hfcContactPersonNumber = healthCareFacility.person_mobile;
            updateData.hfcContactPersonCPR = healthCareFacility.person_cpr;
        }
        if(updateData.authorizedRepresentativeName){
            const authorizedRepresentative = await authorizedRepresentativeModel.findById(authorizedRepresentativeName);
            if (!authorizedRepresentative) {return res.status(404).json({ error: "Authorized Representative not found" });
            }
            updateData.mobileNumber = authorizedRepresentative.phoneNumber;
            updateData.authorizedRepresentativeEmail = authorizedRepresentative.emailAddress;
        }

        const dispose = await disposeModel.findByIdAndUpdate(disposeById,updateData,{new:true})
        if(!dispose){
            res.status(400).json({error:`Dispose is not found with Id ${disposeById}`})
        }
        res.status(200).json({result:dispose,message:"Dispose updated successfully"})
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.deleteDisposeById = async(req,res)=>{
    try {
        const disposeById = req.params.id;

        if(!disposeById){
            res.status(400).json({error:"Dispose Id is required"})
        }
        const dispose = await disposeModel.findByIdAndDelete(disposeById)
    if(!dispose){
      return res.status(400).json({error:`Dispose is not found with Id ${disposeById}`})
    }
    res.status(200).json({result:dispose,message:"Dispose Deleted Successfully"})
    } catch (error) {
        console.log("error = ",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

export default routes