import service_MaintenanceModel from "../../models/nhra/service_Maintenance.model.js";
import healthFacilityModel from "../../models/nhra/healthFacility.model.js";
import productModel from "../../models/products/productList.model.js";

const routes = {};

routes.addServiceMaintenance = async (req, res) => {
  try {
    const { device, healthcarefacility } = req.body;

    const medicalDevice = await productModel.findById(device);
    if (!medicalDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    const existHealthCareFacility = await healthFacilityModel.findById(
      healthcarefacility
    );
    if (!existHealthCareFacility) {
      return res.status(404).json({ error: "Health Care Facility not found" });
    }

    const newServiceMaintenance = new service_MaintenanceModel({
      ...req.body,
    });
    await newServiceMaintenance.save();

    return res.status(201).json({
      result: newServiceMaintenance,
      message: "Service Maintenance added Successfully",
    });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllServiceMaintenance = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allDoc = await service_MaintenanceModel.countDocuments();
    const totalPage = Math.ceil(allDoc / limit);

    const allServiceMaintenance = await service_MaintenanceModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("device", "productName productModel productSerialNo")
      .populate("healthcarefacility", "facilityName facilityAddress");

    if (!allServiceMaintenance || allServiceMaintenance.length === 0) {
      return res.status(404).json({ error: "No Service Maintenance found" });
    }
    return res.status(200).json({
      result: allServiceMaintenance,
      totalPage,
      message: "Service Maintenance retrived successfully",
    });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getServiceMaintenanceById = async (req, res) => {
  try {
    const serviceMaintenanceById = req.params.id;
    if (!serviceMaintenanceById)
      return res.status(400).json({ error: "Id is required" });

    const serviceMaintenance = await service_MaintenanceModel.findById(
      serviceMaintenanceById
    );
    if (!serviceMaintenance)
      return res.status(404).json({
        error: `Alert Modification not found with Id ${serviceMaintenanceById}`,
      });

    return res.status(200).json({
      result: serviceMaintenance,
      message: "Alert Modification fetched successfully",
    });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateServiceMaintenanceById = async (req, res) => {
  try {
    const serviceMaintenanceById = req.params.id;
    const updateData = req.body;

    if (!serviceMaintenanceById)
      return res.status(400).json({ error: "Id is required" });

    const existServiceAndMaintenance = await service_MaintenanceModel.findById(
      serviceMaintenanceById
    );

    if (!existServiceAndMaintenance) {
      return res.status(404).json({
        error: `Service & Maintenance is not found with Id ${alert_ModificationById}`,
      });
    }

    const { device, healthcarefacility } = updateData;

    const medicalDevice = await productModel.findById(device);
    if (!medicalDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    const existHealthCareFacility = await healthFacilityModel.findById(
      healthcarefacility
    );
    if (!existHealthCareFacility) {
      return res.status(404).json({ error: "Health Care Facility not found" });
    }

    const serviceMaintenance = await service_MaintenanceModel.findByIdAndUpdate(
      serviceMaintenanceById,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      result: serviceMaintenance,
      message: "Service & Maintenance updated successfully",
    });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteServiceMaintenanceById = async (req, res) => {
  try {
    const serviceMaintenanceById = req.params.id;

    if (!serviceMaintenanceById)
      return res.status(400).json({ error: "Id is required" });

    const serviceMaintenance = await service_MaintenanceModel.findByIdAndDelete(
      serviceMaintenanceById
    );
    if (!serviceMaintenance) {
      return res.status(404).json({
        error: `Service & Maintenance is not found with id ${serviceMaintenanceById}`,
      });
    }
    res.status(200).json({
      result: serviceMaintenance,
      message: "Service & Maintenance deleted successfully",
    });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
