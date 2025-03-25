import healthFacilityModel from '../../models/nhra/healthFacility.model.js'

const routes = {}

routes.addhealthFacility = async(req,res)=>{
    try{
        const{
            facility_name,
            facility_address,
            person_name,
            person_position,
            person_mobile,
            person_email,
            person_cpr
        } = req.body

        if (!facility_name && !facility_address && !person_name && !person_cpr){
            return res.status(400).json({ error: "All field is required " });
        }

        const existDoc = await healthFacilityModel.find({ $or: [{ person_mobile }, { person_email }] });
    if (existDoc)
      return res
        .status(400)
        .json({ error: "Mobile or Email is already exist" });

        const newDoc = await healthFacilityModel.create({ facility_name, facility_address, person_name, person_position, person_mobile, person_email, person_cpr });
        return res
          .status(201)
          .json({ result: newDoc, message: "New Health Facility is created" });

    }catch(error){
        console.log("error = ",error)
        return res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.getAllHealthFacility = async(req,res)=>{
    try{
        const allDoc = await healthFacilityModel.find()

        return res
      .status(200)
      .json({ result: allDoc, message: "Data fetched successfully" });
    }catch(error){
        console.log("error = ",error)
        return res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.getHealthFacilityById = async(req,res)=>{
    try{
        const healthFacilityId = req.params.id

        if(!healthFacilityId){
            return res.status(400).json({error:"Id is required"})
        }
        const newHealthFacility = await healthFacilityModel.findById(healthFacilityId)

        if(!newHealthFacility){
            return res.status(400).json({error:`Health Facility is not found with ID ${healthFacilityId}`})
        }
        res.status(200).json({result:newHealthFacility,message:"Data fetched successfully"})
    }catch(error){
        console.log("error = ",error)
        return res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.updateHealthFacilityById = async(req,res)=>{
    try{
        const healthFacilityId = req.params.id

        if(!healthFacilityId){
            return res.status(400).json({error:"Id is required"})
        }
        const newHealthFacility = await healthFacilityModel.findByIdAndUpdate(healthFacilityId,req.body,{new:true})

        if(!newHealthFacility){
            return res.status(400).json({error:`Health Facility is not found with ID ${healthFacilityId}`})
        }
        res.status(200).json({result:newHealthFacility,message:"Data Updated successfully"})
    }catch(error){
        console.log("error = ",error)
        return res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.deleteHealthFacilityById = async(req,res)=>{
    try{
        const healthFacilityId = req.params.id

        if(!healthFacilityId){
            return res.status(400).json({error:"Id is required"})
        }
        const newHealthFacility = await healthFacilityModel.findByIdAndDelete(healthFacilityId)

        if(!newHealthFacility){
            return res.status(400).json({error:`Health Facility is not found with ID ${healthFacilityId}`})
        }
        res.status(200).json({result:newHealthFacility,message:"Data Deleted successfully"})
    }catch(error){
        console.log("error = ",error)
        return res.status(500).json({error:"Something Went Wrong"})
    }
}

export default routes