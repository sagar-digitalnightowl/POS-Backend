import userModel from "../../models/userManagement/user.model.js";
import userProfileModel from "../../models/userManagement/userProfile.model.js";
// import bcrypt from "bcrypt";
const routes = {};

routes.addUser = async (req, res) => {
  try {

    const {
      prefix,
      email,
      lastName,
      firstName,
      // password,
      // userName,
      role,
      active,
      enableServiceStaffPin,
      accessAllLocations,
      posApplicationTradingCompanyWLL,
      salesCommissionPercentage,
      maxSalesDiscountPercent,
      allowSelectedContacts,
      dateOfBirth,
      gender,
      maritalStatus,
      bloodGroup,
      mobileNumber,
      alternateContactNumber,
      familyContactNumber,
      facebookLink,
      twitterLink,
      socialMedia1,
      socialMedia2,
      customField1,
      customField2,
      customField3,
      customField4,
      guardianName,
      IDproofName,
      IDproofNumber,
      permanentAddress,
      currentAddress,
      accountHolderName,
      accountNumber,
      bankName,
      bankIdentifierCode,
      bankBranch,
      taxPayerID,
      department,
      designation,
      primaryWorkLocation,
      basicSalary,
      payComponents,
    } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!firstName)
      return res.status(400).json({ error: "firstName is required" });
    if (!lastName)
      return res.status(400).json({ error: "lastName is required" });
    // if (!password)
    //   return res.status(400).json({ error: "password is required" });

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist)
      return res.status(400).json({ error: "Email already exist" });

    // const encryptPassword = await bcrypt.hash(password, 10);

    const newUserProfile = await userProfileModel.create({
      // userName: userName,
      // password: encryptPassword,
      role,
      accessAllLocations,
      posApplicationTradingCompanyWLL,
      salesCommissionPercentage,
      maxSalesDiscountPercent,
      allowSelectedContacts,
      dateOfBirth: dateOfBirth && new Date(dateOfBirth),
      gender,
      maritalStatus,
      bloodGroup,
      mobileNumber,
      alternateContactNumber,
      familyContactNumber,
      facebookLink,
      twitterLink,
      socialMedia1,
      socialMedia2,
      customField1,
      customField2,
      customField3,
      customField4,
      guardianName,
      IDproofName,
      IDproofNumber,
      permanentAddress,
      currentAddress,
      accountHolderName,
      accountNumber,
      bankName,
      bankIdentifierCode,
      bankBranch,
      taxPayerID,
      department,
      designation,
      primaryWorkLocation,
      basicSalary,
      payComponents,
    });

    const newUser = await userModel.create({
      prefix,
      firstName,
      lastName,
      email,
      active,
      enableServiceStaffPin,
      userProfile: newUserProfile,
    });
    return res
      .status(201)
      .json({ result: newUser, message: "User Created Successfully" });
  } catch (error) {
    console.log("error=",error)
    res.status(500).json({ error: "Something went wrong" });
  }
};



routes.getAllUser = async (req, res) => {
  try {
    const users = await userModel.find().populate("userProfile", { role: 1 });
    if (!users) return res.status(404).json({ error: "Users not found" });
    return res
      .status(200)
      .json({ result: users, message: "Users Retrieved Successfully" });
  } catch (error) {
    console.log("error=",error.message)
        res.status(500).json({ error: "Something went wrong" });
  }
};
routes.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ error: "User Id is required" });
    const user = await userModel.findById(userId).populate("userProfile");
    if (!user)
      return res
        .status(404)
        .json({ error: `User not found with id:${userId}` });
    return res
      .status(200)
      .json({ result: user, message: "User Retrieved Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ error: "User Id is required" });
    const user = await userModel.findByIdAndUpdate(userId, req.body,{new:true});
    if (!user)
      return res
        .status(404)
        .json({ error: `User not found with id:${userId}` });
    return res
      .status(200)
      .json({ result: user, message: "User Updated Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
routes.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ error: "User Id is required" });
    const user = await userModel.findByIdAndDelete(userId);
    if (!user)
      return res
        .status(404)
        .json({ error: `User not found with id:${userId}` });
    return res
      .status(200)
      .json({ result: user, message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
