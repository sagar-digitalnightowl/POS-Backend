import contactsLoginModel from "../../models/CRM/contactsLogin.model.js";

const routes = {}

routes.addContactsLogin = async(req,res)=>{
    try {
        const data = req.body
        if(!data.title || !data.contact || !data.firstName || !data.email || !data.mobileNumber){
            return res.status(400).json({error:"Title, Contact, First Name, Email, Mobile Number are required"})
        }
        const contacts = await contactsLoginModel.create(data)

        return res.status(200).json({result:contacts,message:"Contact added"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllContactsLogin = async(req,res)=>{
    try {
        const allContact = await contactsLoginModel.find()
        if(!allContact || allContact.length === 0){
            return res.status(400).json({error:"Contact not found"})
        }
        return res.status(200).json({result:allContact,message:"All contact fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getContactsLoginById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const contact = await contactsLoginModel.findById(id)
        if(!contact){
            return res.status(404).json({error:`Contact is not found with Id ${id}`})
        }
        return res.status(200).json({result:contact,message:'Contact fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateContactsLoginById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const contact = await contactsLoginModel.findByIdAndUpdate(id,req.body,{new:true})
        if(!contact){
            return res.status(404).json({error:`Contact is not found with Id ${id}`})
        }
        return res.status(200).json({result:contact,message:'Contact fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteContactsLoginById = async(req,res)=>{
    try{
        const contactId = req.params.id;
        const contact = await contactsLoginModel.findByIdAndDelete(contactId);
        if(!contact)
            return res.status(404).json({error:`Contact is not found with Id ${contactId}`})
         return res.status(200).json({result:contact,message:"Contact deleted successfully"})  
       }catch(error){
           return res.status(500).json({error:"Something went wrong"});
       }
}

export default routes;