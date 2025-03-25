import stockTransferModel from "../../models/stockTransfer/stockTransfer.model.js";

const routes = {}

routes.addStockTransfer = async(req,res)=>{
    try{
        const{
            date,
            referenceNo,
            status,
            locationFrom,
            locationTo,
            shippingCharges,
            additionalNotes
        } = req.body

        const newStockTransfer = new stockTransferModel({
            date,
            referenceNo,
            status,
            locationFrom,
            locationTo,
            shippingCharges,
            additionalNotes
        })
        await newStockTransfer.save()

    res.status(201).json({message: "Stock added successfully",result: newStockTransfer});

    }catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went wrong" });
      }
}

routes.getAllStockTransfer = async(req,res)=>{
    try{
        const allStock = await stockTransferModel.find()

        if(!allStock || allStock == 0){
            res.status(400).json({error:"No Stock Found"})
        }
        return res.status(200).json({result:allStock, message:"Stock data retrived successfully"})
    }catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went wrong" });
      }
}


routes.getStockTransferById = async(req,res)=>{
    try{
        const stockId = req.params.id

        if(!stockId){
            res.status(400).json({error:"Stock ID is required"})
        }
        const stock = await stockTransferModel.findById(stockId)
        
        if(!stock){
            res.status(400).json({error:`Stock is not found with Id ${stockId}`})
        }
        return res.status(200).json({result:stock, message:"Stock retrived successfully"})
    }catch(error){
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went wrong" });
    }
}

routes.updateStockTransferById = async(req,res)=>{
    try{
        const stockId = req.params.id

        if(!stockId){
            res.status(400).json({error:"Stock ID is required"})
        }

        const stock = await stockTransferModel.findByIdAndUpdate(stockId,req.body,{new:true})

        if (!stockId)
            return res
              .status(404)
              .json({ error: `Stock not found with id:${stockId}` });
          return res
            .status(200)
            .json({ result: stock, message: "Stock Updated Successfully" });
    }catch(error){
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went wrong" });
    }
}

routes.deleteStockTransferById = async(req,res)=>{
    try{
        const stockId = req.params.id
        
        if(!stockId){
            res.status(400).json({error:"Stock Id Required"})
        }
        const stock = await stockTransferModel.findByIdAndDelete(stockId) 

        if (!stock)
            return res
              .status(404)
              .json({ error: `Stock not found with id:${stockId}` });
        return res
              .status(200)
              .json({ result: stock, message: "Stock Updated Successfully" });
    }catch(error){
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went wrong" });
    }
}

export default routes;