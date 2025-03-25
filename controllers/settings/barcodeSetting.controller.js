import barcodeSettingModel from "../../models/settings/barcodeSetting.model.js";

const routes = {};

routes.addBarcodeSetting = async (req, res) => {
  try {
    const data = req.body;

    if (!data.stickerSheetName) {
      return res.status(400).json({error: "Sticker sheet setting name is required",});
    }

    const barcodeSetting = await barcodeSettingModel.create(data);

    return res.status(200).json({result: barcodeSetting,message: "Barcode sticker added successfully",});

  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

routes.getAllBarcodeSetting = async(req,res)=>{
    try {
        const allBarcodeSetting = await barcodeSettingModel.find()

        if(!allBarcodeSetting || allBarcodeSetting.length === 0){
            return res.status(400).json({error:"No barcode sticker found"})
        }
        return res.status(200).json({result:allBarcodeSetting,message:'Data fetched successfully'})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.getBarcodeSettingById = async(req,res)=>{
    try {
        const barcodeSettingById = req.params.id
        if(!barcodeSettingById){
            return res.status(400).json({error:"Id is required"})
        }
        const barcodeSetting = await barcodeSettingModel.findById()

        if(!barcodeSetting){
            return res.status(400).json({error:`No barcode sticker found with id ${barcodeSettingById}`})
        }
        return res.status(200).json({result:barcodeSetting,message:"Data retrived successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.updateBarcodeSettingById = async(req,res)=>{
    try {
        const barcodeSettingById = req.params.id
        if(!barcodeSettingById){
            return res.status(400).json({error:"Id is required"})
        }
        const barcodeSetting = await barcodeSettingModel.findByIdAndUpdate(barcodeSettingById,req.body,{new:true})

        if(!barcodeSetting){
            return res.status(400).json({error:`No barcode sticker found with id ${barcodeSettingById}`})
        }
        return res.status(200).json({result:barcodeSetting,message:"Barcode sticker updated successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

routes.deleteBarcodeSettingById = async(req,res)=>{
    try {
        const barcodeSettingById = req.params.id
        if(!barcodeSettingById){
            return res.status(400).json({error:"Id is required"})
        }
        const barcodeSetting = await barcodeSettingModel.findByIdAndDelete(barcodeSettingById)
        if(!barcodeSetting){
            return res.status(400).json({error:`No barcode sticker found with id ${barcodeSettingById}`})
        }
        return res.status(200).json({result:barcodeSetting,message:"Barcode sticker updated successfully"})
    } catch (error) {
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went Wrong" });
    }
}

export default routes;
