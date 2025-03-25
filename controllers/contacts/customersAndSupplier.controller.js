
import customerAndSupplierSchema from "../../models/contacts/customersAndSupplier.model.js";
import { customerAndSupplierValidation } from "../../validations/joi.validations.js";
const routes = {};

routes.addCustomer = async (req, res) => {
  try {
    const { contactId, contactType, firstName, lastName, mobileNo,email } = req.body;
    const {error}=customerAndSupplierValidation.validate(req.body)
    if(error)
        return res.status(400).json({error:error.details[0].message})
    const existContactId=await customerAndSupplierSchema.findOne({$or:[{contactId},{email}]})

    if(existContactId)
           return res.status(400).json({error:"ContactId or Email is already Exist"})

    const newCustomer = await customerAndSupplierSchema.create(req.body);
    return res
      .status(201)
      .json({ result: newCustomer, message: "Document create successfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
routes.getAllCustomer = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      sellDue,
      contactType,
      sellReturn,
      advanceBalance,
      openingBalance,
      hasNoSellFrom,
      customerGroup,
      assignedTo,
      status,
    } = req.query;

    const filter = {};
    if(contactType) filter.contactType
    if (sellDue) filter.sellDue;
    if (sellReturn) filter.sellReturn;
    if (advanceBalance) filter.advanceBalance;
    if (openingBalance) filter.openingBalance;
    if (openingBalance) filter.openingBalance;
    if (hasNoSellFrom) filter.hasNoSellFrom;
    if (customerGroup) filter.customerGroup;
    if (assignedTo) filter.assignedTo;
    if (status) filter.status;

    const allCustomer = await customerAndSupplierSchema
      .find(filter)
      .skip(limit * (page - 1))
      .limit(limit);
    if (!allCustomer)
      return res.status(404).json({ error: "Document not found" });
    res
      .status(200)
      .json({ result: allCustomer, message: "Documents fetched successfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
routes.getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    if (!customerId) return res.status(400).json({ error: "Id is required" });
    const customer = await customerAndSupplierSchema.findById(customerId);
    if (!customer)
      return res.status(404).json({ error: "Document not found with this id" });
    res
      .status(200)
      .json({ result: customer, message: "Document fetched successfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status().json("Something went wrong");
  }
};
routes.updateCustomer = async (req, res) => {
  try {
    const customerId  = req.params.id;
    if (!customerId) return res.status(400).json({ error: "Id is required" });
    const newCustomer = await customerAndSupplierSchema.findByIdAndUpdate(
      customerId,
      req.body,
      { new: true }
    );
    if (!newCustomer)
      return res.status(404).json({ error: "Document not found with this id" });
    res
      .status(200)
      .json({ result: newCustomer, message: "Document updated successfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status().json({ error: "Something went wrong" });
  }
};
routes.deleteCustomer = async (req, res) => {
  try {
    const customerId  = req.params.id;
    if (!customerId) return res.status(400).json({ error: "Id is required" });
    const deleteDoc = await customerAndSupplierSchema.findByIdAndDelete(customerId);
    if (!deleteDoc)
      return res.status(404).json({ error: "document not found with this id" });
     return res.status(200).json({message:"document deleted succesfully"});
  } catch (error) {
    console.log("error=", error.message);
    res.status().json({ error: "Something went wrong" });
  }
};

export default routes;
