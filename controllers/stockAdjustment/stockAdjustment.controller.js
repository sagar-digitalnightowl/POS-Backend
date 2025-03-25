import stockAdjustmentModel from "../../models/stockAdjustment/stockAdjustment.model.js";

const routes = {}

routes.addStockAdjustment = async(req,res)=>{
    try{
        const{
            businessLocation,
            referenceNo,
            dateRange,
            adjustmentType,
            totalAmountRecovered,
            reason
        }=req.body

        const [startDate, endDate] = dateRange.split(" - ").map(date => new Date(date));
        
        const newStockAdjustment = new stockAdjustmentModel({
            businessLocation,
            referenceNo,
            startDate,
            endDate,
            adjustmentType,
            totalAmountRecovered,
            reason
        })
        await newStockAdjustment.save()

        res.status(200).json({result:newStockAdjustment,message:"Stock Adjusted Successfully"})
    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.getAllStockAdjustment = async(req,res)=>{
    try{
        const allStock = await stockAdjustmentModel.find()

        if(!allStock || allStock == 0){
            res.status(400).json({error:"No Stock Found"})
        }
        return res.status(200).json({result:allStock, message:"Stock data retrived successfully"})
    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.getStockAdjustmentById = async(req,res)=>{
    try{
        const stockAdjustmentId = req.params.id

        if(!stockAdjustmentId){
            res.status(400).json({error:"Stock Adjustment ID is required"})
        }
        const stockAdjustment = await stockAdjustmentModel.findById(stockAdjustmentId)
        
        if(!stockAdjustment){
            res.status(400).json({error:`Stock Adjustment is not found with Id ${stockAdjustmentId}`})
        }
        return res.status(200).json({result:stockAdjustment, message:"Stock Adjustment retrived successfully"})
    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.updateStockAdjustmentById = async(req,res)=>{
    try{
        const stockAdjustmentId = req.params.id

        if(!stockAdjustmentId){
            res.status(400).json({error:"Stock Adjustment ID is required"})
        }

        const stockAdjustment = await stockAdjustmentModel.findByIdAndUpdate(stockAdjustmentId,req.body,{new:true})

        if (!stockAdjustmentId)
            return res
              .status(404)
              .json({ error: `Stock Adjustment not found with id:${stockAdjustmentId}` });
          return res
            .status(200)
            .json({ result: stockAdjustment, message: "Stock Adjustment Updated Successfully" });
    }catch(error){
        console.log("error = ",error)
        res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.deleteStockAdjustmentById = async(req,res)=>{
    try{
        const stockAdjustmentId = req.params.id
        
        if(!stockAdjustmentId){
            res.status(400).json({error:"Stock Adjustment Id Required"})
        }
        const stockAdjustment = await stockAdjustmentModel.findByIdAndDelete(stockAdjustmentId) 

        if (!stockAdjustment)
            return res
              .status(404)
              .json({ error: `Stock Adjustment not found with id:${stockAdjustmentId}` });
        return res
              .status(200)
              .json({ result: stockAdjustment, message: "Stock Adjustment Updated Successfully" });
    }catch(error){
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went wrong" });
    }
}

export default routes;