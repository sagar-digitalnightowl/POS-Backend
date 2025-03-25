import csv from "csvtojson";
// import { customerValidation } from "../../validations/joi.validations.js";
import { customerAndSupplierValidation } from "../../validations/joi.validations.js";

import customerAndSupplierSchema from "../../models/contacts/customersAndSupplier.model.js";

const routes = {};
routes.importContacts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File not uploaded" });
    const contactsData = await csv().fromString(req.file.buffer.toString());
    console.log(contactsData);
    for (let contact of contactsData) {
      const { error } = customerAndSupplierValidation.validate(contact);
      if (error)
        return res.status(400).json({ error: error.details[0].message });
    }

    const newContacts = await customerAndSupplierSchema.insertMany(contactsData);
    res
      .status(201)
      .json({ result: newContacts, message: "document created successfully" });
  } catch (error) {
    console.log({ error: error });
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
