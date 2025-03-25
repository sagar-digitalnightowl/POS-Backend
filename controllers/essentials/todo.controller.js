import todoModel from "../../models/essentials/todo.model.js";
import fs from "fs";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";

const routes = {};

routes.addTodo = async (req, res) => {
  try {
    // Destructure fields from req.body
    const {
      task,
      assignedTo = "POS ADMIN",
      priority,
      status,
      startDate,
      endDate,
      estimatedHours,
      description,
    } = req.body;

    // Validate required fields
    if (!task || !priority || !status) {
      return res
        .status(400)
        .json({ error: "Task, Priority, and Status are required" });
    }

    // Check for file upload
    let uploadDocument = null;
    if (!req.file) {
      return res.status(400).json({ error: "Document is required" });
    }

    // Handle file upload
    const file = req.file;
    const localFilePath = `./public/temp/${file.filename}`;
    const moduleName = "Todo";

    const uploadResult = await uploadOnCloudinary(localFilePath, moduleName);
    if (uploadResult) {
      uploadDocument = uploadResult.secure_url;
      fs.unlinkSync(localFilePath);
    } else {
      throw new Error("File upload to Cloudinary failed");
    }

    // Create new to-do entry
    const newTodo = await todoModel.create({
      task,
      assignedTo,
      priority,
      status,
      startDate,
      endDate,
      estimatedHours,
      description,
      uploadDocument,
    });

    return res
      .status(200)
      .json({ result: newTodo, message: "Document created successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllToDo = async (req, res) => {
  try {
    const allTodo = await todoModel.find();

    if (!allTodo || allTodo.length === 0) {
      return res.status(400).json({ error: "No To DO found" });
    }
    return res
      .status(200)
      .json({ result: allTodo, message: "All to do fetched successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getToDoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const todo = await todoModel.findById(id);
    if (!todo) {
      return res
        .status(404)
        .json({ error: `To Do is not found with id: ${id}` });
    }
    return res
      .status(200)
      .json({ result: todo, message: "To DO List fetced successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateToDoById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    if (!updateData.task || !updateData.priority || !updateData.status) {
        return res.status(400).json({ error: "Task, Priority, and Status are required" });
      }

    const existToDo = await todoModel.findById(id);
    if (!existToDo)
      return res
        .status(404)
        .json({ error: `To Do is not found with Id: ${id}` });

    if (req.file) {
      const file = req.file;
      const localFilePath = `./public/temp/${file.filename}`;
      const moduleName = "Todo";

      if (existToDo && existToDo.uploadDocument) {
        const decodedUrl = decodeURIComponent(existToDo.uploadDocument);
        const publicId = decodedUrl
          .replace(/^.*\/(POS_Project\/Todo\/)/, "$1")
          .split(".")[0];


        const deleteResult = await deleteFromCloudinary(publicId);

        if (!deleteResult) {
          return res
            .status(500)
            .json({ error: "Failed to delete the old file from Cloudinary" });
        }
        const uploadResult = await uploadOnCloudinary(
          localFilePath,
          moduleName
        );

        if (uploadResult) {
          updateData.uploadDocument = uploadResult.secure_url; // Store Cloudinary URL
          fs.unlinkSync(localFilePath); // Clean up temporary file after upload
        } else {
          return res.status(500).json({ error: "File upload failed" });
        }
      }
    }

    const newTodo = await todoModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json({ result: newTodo, message: "To Do updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteToDoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const data = await todoModel.findById(id);

    if (!data) {
      return res
        .status(400)
        .json({ error: `To Do is not found with id: ${id}` });
    }

    const decodedUrl = decodeURIComponent(data.uploadDocument);

    const publicId = decodedUrl
      .replace(/^.*\/(POS_Project\/Todo\/)/, "$1")
      .split(".")[0];


    const deleteResult = await deleteFromCloudinary(publicId);

    if (!deleteResult) {
      return res
        .status(500)
        .json({ error: "Failed to delete the file from Cloudinary" });
    }

    await todoModel.findByIdAndDelete(id);

    res.status(200).json({
      result: data,
      message: "To do deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
