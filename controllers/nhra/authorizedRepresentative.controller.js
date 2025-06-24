import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";
import {
  deleteFileFromCloudinary,
  handleFilesUpload,
  updateFilesUpload,
} from "../../cloudService/fileService.js";

const routes = {};

routes.addAuthorizedRepresentative = async (req, res) => {
  try {
    const { name, emailAddress, phoneNumber, licenseNumber, CRCPRNo } =
      req.body;

    let uploadFiles = null;
    if (req.files && req.files.authorizedCertificate) {
      uploadFiles = await handleFilesUpload(
        req.files,
        "AuthorizedRepresentative"
      );
    }

    const newAuthorizedRepresentative = new authorizedRepresentativeModel({
      name,
      emailAddress,
      phoneNumber,
      licenseNumber,
      CRCPRNo,
      authorizedCertificate: uploadFiles?.authorizedCertificate,
    });
    await newAuthorizedRepresentative.save();

    res.status(201).json({
      result: newAuthorizedRepresentative,
      message: "Authorized Representative added successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Somehing Went Wrong" });
  }
};

routes.getAllAuthorizedRepresentative = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalDoc = await authorizedRepresentativeModel.countDocuments();
    const totalPage = Math.ceil(totalDoc / limit);

    const allAuthorizedRepresentative = await authorizedRepresentativeModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({createdAt: -1});

    if (
      !allAuthorizedRepresentative ||
      allAuthorizedRepresentative.length === 0
    ) {
      return res
        .status(404)
        .json({ message: "No Authorized Representative found" });
    }

    return res.status(200).json({
      result: allAuthorizedRepresentative,
      totalPage,
      message: "Authorized Representative Retrived Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Somehing Went Wrong" });
  }
};


routes.getAuthorizedRepresentatives = async (req, res) => {
  try {

    const allAuthorizedRepresentative = await authorizedRepresentativeModel
      .find()
      .sort({createdAt: -1});

    if (
      !allAuthorizedRepresentative ||
      allAuthorizedRepresentative.length === 0
    ) {
      return res
        .status(404)
        .json({ message: "No Authorized Representative found" });
    }

    return res.status(200).json({
      result: allAuthorizedRepresentative,
      message: "Authorized Representative Retrived Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Somehing Went Wrong" });
  }
};

routes.getAuthorizedRepresentativeById = async (req, res) => {
  try {
    const authorizedRepresentativeId = req.params.id;

    if (!authorizedRepresentativeId) {
      res
        .status(400)
        .json({ error: "Authorized Representative Id is required" });
    }
    const authorizedRepresentative =
      await authorizedRepresentativeModel.findById(authorizedRepresentativeId);

    if (!authorizedRepresentative) {
      res.status(400).json({
        error: `Authorized Representative is not found with ID ${authorizedRepresentativeId}`,
      });
    }
    res.status(200).json({
      result: authorizedRepresentative,
      message: "Authorized Representative retrived Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Somehing Went Wrong" });
  }
};

routes.updateAuthorizedRepresentativeById = async (req, res) => {
  try {
    const authorizedRepresentativeId = req.params.id;
    const data = req.body;

    if (!authorizedRepresentativeId) {
      res
        .status(400)
        .json({ error: "Authorized Representative Id is required" });
    }

    const existAuthorizedRepresentative =
      await authorizedRepresentativeModel.findById(authorizedRepresentativeId);

    if (!existAuthorizedRepresentative) {
      res.status(400).json({
        error: `Authorized Representative is not found with ID ${authorizedRepresentativeId}`,
      });
    }

    if (req.files) {
      try {
        const uploadedFiles = await updateFilesUpload(
          req.files,
          existAuthorizedRepresentative,
          "AuthorizedRepresentative"
        );
        Object.assign(data, uploadedFiles); // Merge new file URLs into updateData
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    const authorizedRepresentative =
      await authorizedRepresentativeModel.findByIdAndUpdate(
        authorizedRepresentativeId,
        { ...data },
        { new: true }
      );

    res.status(200).json({
      result: authorizedRepresentative,
      message: "Authorized RepresentativeId retrived Successfully",
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Somehing Went Wrong" });
  }
};

routes.deleteAuthorizedRepresentativeById = async (req, res) => {
  try {
    const authorizedRepresentativeId = req.params.id;

    if (!authorizedRepresentativeId) {
      res
        .status(400)
        .json({ error: "Authorized Representative Id is required" });
    }
    const authorizedRepresentative =
      await authorizedRepresentativeModel.findByIdAndDelete(
        authorizedRepresentativeId
      );

    await deleteFileFromCloudinary(
      authorizedRepresentative?.authorizedCertificate
    );

    if (!authorizedRepresentative)
      return res.status(404).json({
        error: `Authorized Representative not found with id:${authorizedRepresentativeId}`,
      });

    return res.status(200).json({
      result: authorizedRepresentative,
      message: "Authorized Representative Updated Successfully",
    });

  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
