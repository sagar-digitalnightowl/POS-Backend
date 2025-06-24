import { manufacturerValidation } from "../../validations/joi.validations.js";
import manufacturerSchema from "../../models/contacts/manufacturer.model.js";
import { uploadFile, deleteFile } from "../../utils/s3.js";

const routes = {};

routes.addManufacturer = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    // ✅ Validate request body
    const {
      name,
      address,
      telephone,
      fax,
      phoneNumber,
      email,
      website,
      city,
      country,
    } = req.body;

    const { error } = manufacturerValidation.validate({
      name,
      email,
      address,
      phoneNumber,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details[0].message, details: error.details });
    }

    // ✅ Check for email existence
    const isEmailExists = await manufacturerSchema.findOne({ email });
    if (isEmailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    let profilePhotoUrl = "";
    let letterUrl = "";

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.fieldname === "profilePhoto") {
          console.log("Uploading profile photo...");
          const profilePhotoData = await uploadFile(
            file.buffer,
            `manufacturers/${Date.now()}_profile.jpg`,
            file.mimetype
          );
          profilePhotoUrl = profilePhotoData.Location;
        }

        if (file.fieldname === "letter") {
          console.log("Uploading letter...");
          const letterData = await uploadFile(
            file.buffer,
            `manufacturers/${Date.now()}_letter.pdf`,
            file.mimetype
          );
          letterUrl = letterData.Location;
        }
      }
    }

    // ✅ Create manufacturer entry
    const newDoc = await manufacturerSchema.create({
      name,
      address,
      telephone,
      fax,
      phoneNumber,
      email,
      website,
      city,
      country,
      profilePhotoUrl,
      letterUrl,
    });

    return res.status(201).json({
      result: newDoc,
      message: "Manufacturer created successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

routes.getAllManufacturer = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const totalData = await manufacturerSchema.countDocuments();
    const totalPage = Math.ceil(totalData / limit);
    const allDoc = await manufacturerSchema
      .find()
      .skip(limit * (page - 1))
      .limit(limit);
    return res.status(200).json({
      result: allDoc,
      message: "All Data fetched Successfully",
      totalPage,
    });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getManufacturers = async (req, res) => {
  try {
    const allDoc = await manufacturerSchema
      .find()
      .select("_id name phoneNumber email country")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      result: allDoc,
      message: "All Data fetched Successfully",
    });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await manufacturerSchema.findById(id);
    if (!doc) return res.status(404).json({ error: "Document not Found" });
    return res
      .status(200)
      .json({ result: doc, message: "Document fetched Successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      address,
      telephone,
      fax,
      phoneNumber,
      email,
      website,
      city,
      country,
    } = req.body;

    // ✅ Validate request body
    const { error } = manufacturerValidation.validate({
      name,
      email,
      address,
      phoneNumber,
    });
    if (error) {
      return res
        .status(400)
        .json({ error: error.details[0].message, details: error.details });
    }

    // ✅ Find existing manufacturer
    const existingManufacturer = await manufacturerSchema.findById(id);
    if (!existingManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    // ✅ Check for email existence (excluding current record)
    if (email !== existingManufacturer.email) {
      const isEmailExists = await manufacturerSchema.findOne({
        email,
        _id: { $ne: id },
      });
      if (isEmailExists) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    let profilePhotoUrl = existingManufacturer.profilePhotoUrl;
    let letterUrl = existingManufacturer.letterUrl;

    // ✅ Process profile photo update
    if (req.files?.profilePhoto) {
      console.log("Updating profile photo...");

      // Delete old profile photo if exists
      if (profilePhotoUrl) {
        const oldProfileKey = profilePhotoUrl.split("/").pop();
        await deleteFile(`manufacturers/${oldProfileKey}`);
      }

      // Upload new profile photo
      const profileBuffer = req.files.profilePhoto[0].buffer;
      const profileMimeType = req.files.profilePhoto[0].mimetype;
      const profilePhotoData = await uploadFile(
        profileBuffer,
        `manufacturers/${Date.now()}_profile.jpg`,
        profileMimeType
      );
      profilePhotoUrl = profilePhotoData.Location;
    }

    // ✅ Process letter update
    if (req.files?.letter) {
      console.log("Updating letter...");

      // Delete old letter if exists
      if (letterUrl) {
        const oldLetterKey = letterUrl.split("/").pop();
        await deleteFile(`manufacturers/${oldLetterKey}`);
      }

      // Upload new letter
      const letterBuffer = req.files.letter[0].buffer;
      const letterMimeType = req.files.letter[0].mimetype;
      const letterData = await uploadFile(
        letterBuffer,
        `manufacturers/${Date.now()}_letter.pdf`,
        letterMimeType
      );
      letterUrl = letterData.Location;
    }

    // ✅ Update manufacturer entry
    const updatedDoc = await manufacturerSchema.findByIdAndUpdate(
      id,
      {
        name,
        address,
        telephone,
        fax,
        phoneNumber,
        email,
        website,
        city,
        country,
        profilePhotoUrl,
        letterUrl,
      },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      result: updatedDoc,
      message: "Manufacturer updated successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

routes.deleteManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find the manufacturer to be deleted
    const manufacturer = await manufacturerSchema.findById(id);
    if (!manufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    // ✅ Delete associated files from S3 if they exist
    if (manufacturer.profilePhotoUrl) {
      const profilePhotoKey = manufacturer.profilePhotoUrl.split("/").pop();
      await deleteFile(`manufacturers/${profilePhotoKey}`);
      console.log("Deleted profile photo from S3");
    }

    if (manufacturer.letterUrl) {
      const letterKey = manufacturer.letterUrl.split("/").pop();
      await deleteFile(`manufacturers/${letterKey}`);
      console.log("Deleted letter from S3");
    }

    // ✅ Delete the manufacturer record
    await manufacturerSchema.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Manufacturer deleted successfully",
      deletedManufacturer: {
        id,
        name: manufacturer.name,
        email: manufacturer.email,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export default routes;
