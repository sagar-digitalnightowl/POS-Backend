import healthFacilityModel from "../../models/nhra/healthFacility.model.js";

const routes = {};

routes.addhealthFacility = async (req, res) => {
  try {
    const {
      facilityName,
      facilityAddress,
      personName,
      personPosition,
      personMobile,
      personEmail,
      personCPR,
    } = req.body;

    if (!facilityName && !facilityAddress && !personName && !personCPR) {
      return res.status(400).json({ error: "All field is required " });
    }

    const existDoc = await healthFacilityModel.find({
      $or: [{ personMobile }, { personEmail }],
    });

    if (existDoc.length)
      return res
        .status(400)
        .json({ error: "Mobile or Email is already exist" });

    const newDoc = await healthFacilityModel.create({
      facilityName,
      facilityAddress,
      personName,
      personPosition,
      personMobile,
      personEmail,
      personCPR,
    });
    return res
      .status(201)
      .json({ result: newDoc, message: "New Health Facility is created" });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getAllHealthFacility = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const totalDoc = await healthFacilityModel.countDocuments();
    const totalPage = Math.ceil(totalDoc / limit);

    const allDoc = await healthFacilityModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      result: allDoc,
      totalPage,
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getHealthFacilities = async (req, res) => {
  try {
    const allDoc = await healthFacilityModel.find();

    return res.status(200).json({
      result: allDoc,
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getHealthFacilityById = async (req, res) => {
  try {
    const healthFacilityId = req.params.id;

    if (!healthFacilityId) {
      return res.status(400).json({ error: "Id is required" });
    }
    const newHealthFacility = await healthFacilityModel.findById(
      healthFacilityId
    );

    if (!newHealthFacility) {
      return res.status(400).json({
        error: `Health Facility is not found with ID ${healthFacilityId}`,
      });
    }
    res.status(200).json({
      result: newHealthFacility,
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.updateHealthFacilityById = async (req, res) => {
  try {
    const healthFacilityId = req.params.id;

    if (!healthFacilityId) {
      return res.status(400).json({ error: "Id is required" });
    }
    const newHealthFacility = await healthFacilityModel.findByIdAndUpdate(
      healthFacilityId,
      req.body,
      { new: true }
    );

    if (!newHealthFacility) {
      return res.status(400).json({
        error: `Health Facility is not found with ID ${healthFacilityId}`,
      });
    }
    res.status(200).json({
      result: newHealthFacility,
      message: "Data Updated successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.deleteHealthFacilityById = async (req, res) => {
  try {
    const healthFacilityId = req.params.id;

    if (!healthFacilityId) {
      return res.status(400).json({ error: "Id is required" });
    }
    const newHealthFacility = await healthFacilityModel.findByIdAndDelete(
      healthFacilityId
    );

    if (!newHealthFacility) {
      return res.status(400).json({
        error: `Health Facility is not found with ID ${healthFacilityId}`,
      });
    }
    res.status(200).json({
      result: newHealthFacility,
      message: "Data Deleted successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

export default routes;
