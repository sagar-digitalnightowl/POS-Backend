import departmentModel from "../../models/HRM/department.model.js";

const routes = {};

routes.addDepartment = async (req, res) => {
  try {
    const data = req.body;
    if (!data.department || !data.departmentId) {
      return res
        .status(400)
        .json({ error: "Department and Department Id are required" });
    }
    const department = await departmentModel.create(data);

    return res
      .status(201)
      .json({ result: department, message: "Department added Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getAllDepartment = async (req, res) => {
  try {
    const allDepartment = await departmentModel.find();
    if (!allDepartment || allDepartment.length === 0) {
      return res.status(400).json({ error: "Department not found" });
    }
    return res
      .status(200)
      .json({
        result: allDepartment,
        message: "All Department fetched successfully",
      });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getDepartmentById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is require" });
    }
    const department = await departmentModel.findById(id);
    if (!department) {
      return res
        .status(404)
        .json({ error: `Department is not found with Id ${id}` });
    }
    return res
      .status(200)
      .json({ result: department, message: "Department fetch Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.updateDepartmentById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is require" });
    }
    const department = await departmentModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!department) {
      return res
        .status(404)
        .json({ error: `Department is not found with Id ${id}` });
    }
    return res
      .status(200)
      .json({ result: department, message: "Department fetch Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.deleteDepartmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const department = await departmentModel.findByIdAndDelete(id);
    if (!department)
      return res
        .status(404)
        .json({ error: `Department is not found with Id ${id}` });
    return res
      .status(200)
      .json({ result: department, message: "Department deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
