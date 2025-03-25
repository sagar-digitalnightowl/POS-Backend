import attendanceModel from '../../models/HRM/attendance.model.js'

const routes = {}

routes.addAttendance = async(req,res)=>{
    try {
        const data = req.body
        if(!data.name || !data.shiftType || !data.startTime || !data.endTime){
            return res.status(400).json({error:"Name, Shift Type, Start Time and End Time all are required"})
        }
        const attendance = await attendanceModel.create(data)

        return res.status(200).json({result:attendance,message:"Attendance added Successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllAttendance = async(req,res)=>{
    try {
        const allAttendance = await attendanceModel.find()
        if(!allAttendance || allAttendance.length === 0){
            return res.status(400).json({error:"Attendance not found"})
        }
        return res.status(200).json({result:allAttendance,message:"All Attendance fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAttendanceById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const attendance = await attendanceModel.findById(id)
        if(!attendance){
            return res.status(404).json({error:`Attendance is not found with Id ${id}`})
        }
        return res.status(200).json({result:attendance,message:'Attendance fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateAttendanceById = async(req,res)=>{
    try {
        const id = req.params.id

        if(!id){
            return res.status(400).json({error:"Id is require"})
        }
        const attendance = await attendanceModel.findByIdAndUpdate(id,req.body,{new:true})
        if(!attendance){
            return res.status(404).json({error:`Attendance is not found with Id ${id}`})
        }
        return res.status(200).json({result:attendance,message:'Attendance fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteAttendanceById = async(req,res)=>{
    try{
        const id = req.params.id;
        const attendance = await attendanceModel.findByIdAndDelete(id);
        if(!attendance)
            return res.status(404).json({error:`Attendance is not found with Id ${id}`})
         return res.status(200).json({result:attendance,message:"Attendance deleted successfully"})  
       }catch(error){
           return res.status(500).json({error:"Something went wrong"});
       }
}

export default routes;