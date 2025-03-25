import authorizedRepresentativeModel from "../../models/nhra/authorizedRepresentative.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";

const routes = {}

routes.addAuthorizedRepresentative = async(req,res)=>{
    try{
        const{
            name,
            emailAddress,
            phoneNumber,
            licenseNumber,
            CRCPRNo,
        } = req.body

        let authorizedCertificate = null

        
        if (req.files && req.files.authorizedCertificate) {
            const file = req.files.authorizedCertificate[0];
            const fileKey = `authorizedCertificate/${uuidv4()}_${file.originalname}`;
        
            const uploadResult = await uploadFile(file, fileKey);
            authorizedCertificate = uploadResult.Location; 
        }
        

        const newAuthorizedRepresentative = new authorizedRepresentativeModel({
            name,
            emailAddress,
            phoneNumber,
            licenseNumber,
            CRCPRNo,
            authorizedCertificate
        })
        await newAuthorizedRepresentative.save()

        res.status(200).json({result:newAuthorizedRepresentative,message:"Authorized Representative added successfully"})

    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Somehing Went Wrong"})
    }
}

routes.getAllAuthorizedRepresentative = async(req,res)=>{
    try{
        const allAuthorizedRepresentative = await authorizedRepresentativeModel.find()

        if(!allAuthorizedRepresentative || allAuthorizedRepresentative.length === 0){
            return res.status(404).json({ message: "No Authorized Representative found" });
        }

        return res.status(200).json({result: allAuthorizedRepresentative,message:"Authorized Representative Retrived Successfully"})

    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Somehing Went Wrong"})
    }
}

routes.getAuthorizedRepresentativeById = async(req,res)=>{
    try{
        const authorizedRepresentativeId = req.params.id

        if(!authorizedRepresentativeId){
            res.status(400).json({error:"Authorized Representative Id is required"})
        }
        const authorizedRepresentative = await authorizedRepresentativeModel.findById(authorizedRepresentativeId)

        if(!authorizedRepresentative){
            res.status(400).json({error:`Authorized Representative is not found with ID ${authorizedRepresentativeId}`})
        }
        res.status(200).json({result:authorizedRepresentative,message:"Authorized Representative retrived Successfully"})
    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Somehing Went Wrong"})
    }
}

routes.updateAuthorizedRepresentativeById = async(req,res)=>{
    try{
        const authorizedRepresentativeId = req.params.id

        if(!authorizedRepresentativeId){
            res.status(400).json({error:"Authorized Representative Id is required"})
        } 
        const authorizedRepresentative = await authorizedRepresentativeModel.findByIdAndUpdate(authorizedRepresentativeId,req.body,{new:true})

        if(!authorizedRepresentative){
            res.status(400).json({error:`Authorized Representative is not found with ID ${authorizedRepresentativeId}`})
        }
        res.status(200).json({result:authorizedRepresentative,message:"Authorized RepresentativeId retrived Successfully"})

    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Somehing Went Wrong"})
    }
}

routes.deleteAuthorizedRepresentativeById = async(req,res)=>{
    try{
        const authorizedRepresentativeId = req.params.id

        if(!authorizedRepresentativeId){
            res.status(400).json({error:"Authorized Representative Id is required"})
        }
        const authorizedRepresentative = await authorizedRepresentativeModel.findByIdAndDelete(authorizedRepresentativeId)

        if (!authorizedRepresentative)
            return res
              .status(404)
              .json({ error: `Authorized Representative not found with id:${authorizedRepresentativeId}` });
        return res
              .status(200)
              .json({ result: authorizedRepresentative, message: "Authorized Representative Updated Successfully" });
    }catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

export default routes;