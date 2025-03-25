import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import adverseEventModel from "../../models/nhra/adverseEvent.model.js";
import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import healthFacilityModel from "../../models/nhra/healthFacility.model.js";
import productModel from "../../models/products/productList.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";

const routes = {}

routes.addAdverseEvent = async(req,res)=>{
    try{
        const{
            applicationType,
            riskClassification,
            typeOfReporter,
            reporterName,
            reporterCPRnumber,
            reporterMobileNumber,
            reporterPositionJobTitle,
            reporterEmail,
            reportDate,

            deviceName,
            numberofDevicesInvolved,

            dateOfInstallation,
            lastPPM,

            deviceLocationDept,
            otherLocations,

            adverseEventClassification,
            otherAdverseEvent,
            description,
            immediateActionTaken,
            // supportiveDocuments,

            healthCareFacilityName,

            authorizedRepresentativeName,
            dateofReportAwareness,
            correctiveActionTaken,

            manufacturerName,
            manufacturerDateofAwareness,
            countryOfOrigin,
            actionRecomended,


            staffName,
            staffNumber,
            staffPosition,
            staffEmail,
            staffCPRNumber,

            nhraRefNo,
            positionJobTitle,
            responsiblePerson,
            dateOfReceiving,
            // signature,
            reportStatus,
            otherReportStatus

        } = req.body

        let documents = {
            supportiveDocuments: null,
            signature: null
          };

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileKey = `adverseEvent/${uuidv4()}_${file.originalname}`;
        const uploadResult = await uploadFile(file, fileKey);

        // Match file field name with the corresponding document key
        if (file.fieldname in documents) {
          documents[file.fieldname] = uploadResult.Location;
        }
      }
    }
    const medicalDevice = await productModel.findById(deviceName);
    if (!medicalDevice) {return res.status(404).json({ error: "Device not found" });}

    const healthCareFacility = await healthFacilityModel.findById(healthCareFacilityName)
    if (!healthCareFacility) {return res.status(404).json({ error: "Health Care Facility not found" });}

    const authorizedRepresentative = await authorizedRepresentativeModel.findById(authorizedRepresentativeName)
    if (!authorizedRepresentative) {return res.status(404).json({ error: "Authorized Representative not found" });}

    const manufacturer = await manufacturerModel.findById(manufacturerName)
    if (!manufacturer) {return res.status(404).json({ error: "Manufacturer not found" });}

    const newAdverseEvent = new adverseEventModel({
        applicationType,
            riskClassification,
            typeOfReporter,
            reporterName,
            reporterCPRnumber,
            reporterMobileNumber,
            reporterPositionJobTitle,
            reporterEmail,
            reportDate,

            deviceName,
            modelNumber: medicalDevice.productModel,
            numberofDevicesInvolved,
            serialNumber: medicalDevice.productSerialNo,
            gmdnCODE: medicalDevice.productGMDNCode,
            hsCode: medicalDevice.productHSCode,
            dateOfInstallation,
            lastPPM,

            deviceLocationDept,
            otherLocations,
            adverseEventClassification,
            otherAdverseEvent,
            description,
            immediateActionTaken,
            ...documents,

            healthCareFacilityName,
            hfcContactPersonName: healthCareFacility.person_name,
            healthCareFacilityAddress: healthCareFacility.facility_address,
            hfcContactPersonPosition: healthCareFacility.person_position,
            hfcContactPersonEmail: healthCareFacility.person_email,

            authorizedRepresentativeName,
            authorizedRepresentativeMobile: authorizedRepresentative.phoneNumber,
            authorizedRepresentativeEmail: authorizedRepresentative.emailAddress,
            dateofReportAwareness,
            correctiveActionTaken,

            manufacturerName,
            contactPersonNumber: manufacturer.phoneNumber,
            manufacturerEmail: manufacturer.email,
            manufacturerDateofAwareness,
            countryOfOrigin,
            actionRecomended,

            staffName,
            staffNumber,
            staffPosition,
            staffEmail,
            staffCPRNumber,
            nhraRefNo,
            positionJobTitle,
            responsiblePerson,
            dateOfReceiving,

            reportStatus,
            otherReportStatus
    }) 
    await newAdverseEvent.save()

    res.status(200).json({result:newAdverseEvent,message:"Adverse Event added successfully"})
    }catch(error){
        console.log("error = ",error)
        return res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.getAllAdverseEvent = async(req,res)=>{
  try{
    const allAdverseEvent = await adverseEventModel.find()

    if(!allAdverseEvent || allAdverseEvent.length ===0){
      return res.status(404).json({ error: "No Adverse Event found" });
    }

    return res.status(200).json({result: allAdverseEvent,message:"Adverse Event Retrived Successfully"})
  }catch(error){
    console.log("error=",error)
    return res.status(500).json({error:"Something went wrong"})
  }
}

routes.getAdverseEventById = async(req,res)=>{
  try{
    const adverseEventId = req.params.id

        if(!adverseEventId){
            res.status(400).json({error:"Adverse Event Id is required"})
        }
        const adverseEvent = await adverseEventModel.findById(adverseEventId)

        if(!adverseEvent){
            res.status(400).json({error:`Adverse Event is not found with ID ${adverseEventId}`})
        }
        res.status(200).json({result:adverseEvent,message:"Adverse Event retrived Successfully"})
  }catch(error){
    console.log("error=",error)
    return res.status(500).json({error:"Something went wrong"})
  }
}

routes.updateAdverseEventById = async(req,res)=>{
  try{
    const adverseEventId = req.params.id
    const updateData = req.body;

    if(!adverseEventId){
          res.status(400).json({error:"Adverse Event Id is required"})
    }

    if(updateData.deviceName){
      const medicalDevice = await productModel.findById(updateData.deviceName);
    if (!medicalDevice) {return res.status(404).json({ error: "Device not found" });}
    updateData.modelNumber = medicalDevice.productModel;
    updateData.serialNumber = medicalDevice.productSerialNo;
    updateData.gmdnCODE = medicalDevice.productGMDNCode;
    updateData.hsCode = medicalDevice.productHSCode;
    }
    if(updateData.healthCareFacilityName){
      const healthCareFacility = await healthFacilityModel.findById(updateData.healthCareFacilityName)
    if (!healthCareFacility) {return res.status(404).json({ error: "Health Care Facility not found" });}
    updateData.hfcContactPersonName= healthCareFacility.person_name;
    updateData.healthCareFacilityAddress= healthCareFacility.facility_address;
    updateData.hfcContactPersonPosition= healthCareFacility.person_position;
    updateData.hfcContactPersonEmail= healthCareFacility.person_email;
    }

    if(updateData.authorizedRepresentativeName){
      const authorizedRepresentative = await authorizedRepresentativeModel.findById(updateData.authorizedRepresentativeName)
    if (!authorizedRepresentative) {return res.status(404).json({ error: "Authorized Representative not found" });}
    updateData.authorizedRepresentativeMobile= authorizedRepresentative.phoneNumber;
    updateData.authorizedRepresentativeEmail= authorizedRepresentative.emailAddress;
    }

    if(updateData.manufacturerName){
      const manufacturer = await manufacturerModel.findById(updateData.manufacturerName)
    if (!manufacturer) {return res.status(404).json({ error: "Manufacturer not found" });}
    updateData.contactPersonNumber= manufacturer.phoneNumber;
    updateData.manufacturerEmail= manufacturer.email;
    }
      
    const adverseEvent = await adverseEventModel.findByIdAndUpdate(adverseEventId,updateData,{new:true})

    if (!adverseEvent) {
      res
        .status(400)
        .json({ error: `Adverse Event is not found with ID ${adverseEventId}` });
    }
    res
      .status(200)
      .json({
        result: adverseEvent,
        message: "Adverse Event updated Successfully",
      });
  }catch(error){
    console.log("error=",error)
    return res.status(500).json({error:"Something went wrong"})
  }
}

routes.deleteAdverseEventById = async(req,res)=>{
  try{
    const adverseEventId = req.params.id;

    if (!adverseEventId) {
      res.status(400).json({ error: "Adverse Event Id is required" });
    }

    const adverseEvent = await adverseEventModel.findByIdAndDelete(adverseEventId)
    if(!adverseEvent){
      return res.status(400).json({error:`Adverse Event is not found with Id ${adverseEventId}`})
    }
    res.status(200).json({result:adverseEvent,message:"Adverse Event Deleted Successfully"})

  }catch(error){
    console.log("error=",error)
    return res.status(500).json({error:"Something went wrong"})
  }
}

export default routes