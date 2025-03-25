import memoModel from '../../models/essentials/memos.model.js'

const routes = {}

routes.addMemo = async(req,res)=>{
    try {
        const data = req.body
        if(!data.heading || !data.description){
            return res.status(400).json({error:"Heading and Description are required"})
        }
        const memo = await memoModel.create(data)

        return res.status(200).json({result:memo,message:"Memo added Successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getAllMemo = async(req,res)=>{
    try {
        const allMemo = await memoModel.find()

        if(!allMemo || allMemo === 0){
            return res.status(400).json({error:"No Memo is found"})
        }
        return res.status(200).json({result:allMemo,message:"Memo fetched successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getMemoById = async(req,res)=>{
    try {
        const {id} = req.params

        // if(!id){
        //     return res.status(400).json({error:"Id is require"})
        // }
        const memo = await memoModel.findById(id)
        if(!memo){
            return res.status(404).json({error:`Memo is not found with Id ${id}`})
        }
        return res.status(200).json({result:memo,message:'Memo fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateMemoById = async(req,res)=>{
    try {
        const {memoId} = req.params

        if(!memoId){
            return res.status(400).json({error:"Id is require"})
        }
        const memo = await memoModel.findByIdAndUpdate(memoId,req.body,{new:true})
        if(!memo){
            return res.status(404).json({error:`Memo is not found with Id ${memoId}`})
        }
        return res.status(200).json({result:memo,message:'Memo fetch Successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteMemoById = async(req,res)=>{
    try {
        const {id} = req.params;
        const memo = await memoModel.findByIdAndDelete(id);
        if(!memo)
            return res.status(404).json({error:`Memo is not found with Id ${id}`})
         return res.status(200).json({result:memo,message:"Memo deleted successfully"})  
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

export default routes;