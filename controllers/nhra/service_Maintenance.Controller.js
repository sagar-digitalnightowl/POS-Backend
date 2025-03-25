import service_MaintenanceModel from "../../models/nhra/service_Maintenance.model.js";
import healthFacilityModel from "../../models/nhra/healthFacility.model.js";
import productModel from "../../models/products/productList.model.js";

const routes = {}

routes.addServiceMaintenance = async(req,res)=>{
    try {
        const{
            deviceName,

            healthcarefacilityName,

            repairMaintenanceServiceRequested,
            dateOfRequestforMaintenance,
            dateOfMaintenance,
            descriptionOfMaintenanceActivities,
            detailsOfMaterialsUsed,
            jobCompleted,
            replacementOrRemovalOfEquipmentNeeded,
            isTheEquipmentLabelledWithTheLastAndNextDateOfCalibrationMaintenance,
            maintenanceActivitySupervisedBy,
            invoiceNumber,
            invoiceDate,
            partNumber,
            materialsUsed,
            quantity,
            cost,
            yesOrNo
        } = req.body

        const medicalDevice = await productModel.findById(deviceName);
        if (!medicalDevice) {return res.status(404).json({ error: "Device not found" });} 

        const healthCareFacility = await healthFacilityModel.findById(healthcarefacilityName)
        if (!healthCareFacility) {return res.status(404).json({ error: "Health Care Facility not found" });}

        const newServiceMaintenance = new service_MaintenanceModel({
            deviceName,
            modelNumber: medicalDevice.productModel,
            gmdnCode: medicalDevice.productGMDNCode,
            serialNumber: medicalDevice.productSerialNo,
            batchNumber: medicalDevice.batchNo,
            hsCode: medicalDevice.productHSCode,

            healthcarefacilityName,
            contactPersonMobile: healthCareFacility.person_mobile,
            contactPerson: healthCareFacility.person_name,
            email: healthCareFacility.person_email,
            contactPersonCPR:healthCareFacility.person_cpr,

            repairMaintenanceServiceRequested,
            dateOfRequestforMaintenance,
            dateOfMaintenance,
            descriptionOfMaintenanceActivities,
            detailsOfMaterialsUsed,
            jobCompleted,
            replacementOrRemovalOfEquipmentNeeded,
            isTheEquipmentLabelledWithTheLastAndNextDateOfCalibrationMaintenance,
            maintenanceActivitySupervisedBy,
            invoiceNumber,
            invoiceDate,
            partNumber,
            materialsUsed,
            quantity,
            cost,
            yesOrNo
        })
        await newServiceMaintenance.save()

        return res.status(200).json({result:newServiceMaintenance,message:"Service Maintenance added Successfully"})
    } catch (error) {
        console.log("error=", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.getAllServiceMaintenance = async(req,res)=>{
    try {
        const allServiceMaintenance = await service_MaintenanceModel.find()
        .populate('deviceName','productName')
        .populate('healthcarefacilityName','facility_name')

        if(!allServiceMaintenance || allServiceMaintenance.length === 0){
            return res.status(404).json({error:"No Service Maintenance found"})
        }
        return res.status(200).json({result:allServiceMaintenance,message:"Service Maintenance retrived successfully"})
    } catch (error) {
        console.log("error=", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.getServiceMaintenanceById = async(req,res)=>{
    try{
        const  serviceMaintenanceById= req.params.id;
    if (!serviceMaintenanceById)
      return res.status(400).json({ error: "Id is required" });

    const serviceMaintenance = await service_MaintenanceModel.findById(serviceMaintenanceById)
    if (!serviceMaintenance)
      return res.status(404).json({ error: `Alert Modification not found with Id ${serviceMaintenanceById}` });

    return res.status(200).json({ reuslt: serviceMaintenance, message: "Alert Modification fetched successfully" });
    }catch (error) {
        console.log("error=", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.updateServiceMaintenanceById = async(req,res)=>{
    try {
        const serviceMaintenanceById= req.params.id;
        const updateData = req.body;

    if (!serviceMaintenanceById)
      return res.status(400).json({ error: "Id is required" });

    if(updateData.deviceName){
        const medicalDevice = await productModel.findById(deviceName);
        if (!medicalDevice) {return res.status(404).json({ error: "Device not found" });}
        updateData.modelNumber= medicalDevice.productModel;
        updateData.gmdnCode= medicalDevice.productGMDNCode;
        updateData.serialNumber= medicalDevice.productSerialNo;
        updateData.batchNumber= medicalDevice.batchNo;
        updateData.hsCode= medicalDevice.productHSCode;
    }
    if(updateData.healthcarefacilityName){
        const healthCareFacility = await healthFacilityModel.findById(healthcarefacilityName)
        if (!healthCareFacility) {return res.status(404).json({ error: "Health Care Facility not found" });}
        updateData.contactPersonMobile= healthCareFacility.person_mobile;
        updateData.contactPerson= healthCareFacility.person_name;
        updateData.email= healthCareFacility.person_email;
        updateData.contactPersonCPR=healthCareFacility.person_cpr;
    }

    const serviceMaintenance = await service_MaintenanceModel.findByIdAndUpdate(serviceMaintenanceById,updateData,{new:true})
    if(!serviceMaintenance){
        return res.status(404).json({error:`Service & Maintenance is not found with Id ${alert_ModificationById}`})
    }
    return res.status(200).json({result:serviceMaintenance,message:"Service & Maintenance updated successfully"})
    } catch (error) {
        console.log("error=", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.deleteServiceMaintenanceById = async(req,res)=>{
    try {
        const serviceMaintenanceById= req.params.id;

    if (!serviceMaintenanceById)
      return res.status(400).json({ error: "Id is required" });

        const serviceMaintenance = await service_MaintenanceModel.findByIdAndDelete(serviceMaintenanceById)
        if(!serviceMaintenance){
            return res.status(404).json({error:`Service & Maintenance is not found with id ${serviceMaintenanceById}`})
        }
        res.status(200).json({result:serviceMaintenance,message:"Service & Maintenance deleted successfully"})
    } catch (error) {
        console.log("error=", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
}

export default routes;