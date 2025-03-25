import deliveryNoteModel from "../../models/sell/deliveryNote.model.js";
import saleModel from "../../models/sell/sale.model.js"

const routes = {}

routes.addDeliveryNote = async (req, res) => {
  try {
    const {
      saleOrder,
      mode,
      invoiceScheme,
      deliveryNoteNumber,
      deliveryDate,
      termsOfPayment,
      lPONo,
      despatchDocumentNo,
      despatchedThrough,
      termsOfDelivery,
      commentNote
    } = req.body;

    const sale = await saleModel.findById(saleOrder);
    if (!sale) {
      return res.status(404).json({ error: "Sale order not found" });
    }

    const newDelivery = new deliveryNoteModel({
      saleOrder,
      saleOrderDate: sale.saleDate,
      mode,
      invoiceScheme,
      deliveryNoteNumber,
      deliveryDate,
      termsOfPayment,
      lPONo,
      despatchDocumentNo,
      despatchedThrough,
      termsOfDelivery,
      commentNote
    });
    await newDelivery.save()

    res.status(201).json({message: "Delivery added successfully",result: newDelivery});
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

routes.getAllDeliveryNote = async (req,res)=>{
    try{
        const allDelivery = await deliveryNoteModel.find().populate("saleOrder", "saleDate")

        if(!allDelivery || allDelivery == 0){
            res.status(400).json({error:"No Delivery Found"})
        }
        return res.status(200).json({result:allDelivery, message:"Delivery data retrived successfully"})
    }catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
}

routes.getDeliveryNoteById = async(req,res)=>{
    try{
        const deliveryId = req.params.id

        if(!deliveryId){
            res.status(400).json({error:"Delivery ID is required"})
        }
        const delivery = await deliveryNoteModel.findById(deliveryId).populate("saleOrder", "saleDate")
        
        if(!delivery){
            res.status(400).json({error:`Delivery is not found with Id ${deliveryId}`})
        }
        return res.status(200).json({result:delivery, message:"Delivery retrived successfully"})
    }catch(error){
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went wrong" });
    }
}

routes.updateDeliveryNoteById = async(req,res)=>{
    try{
        const deliveryId = req.params.id
        const updateData = req.body;

        if(!deliveryId){
            res.status(400).json({error:"Delivery ID is required"})
        }
        if (updateData.saleOrder) {
            const sale = await saleModel.findById(updateData.saleOrder);
            if (!sale) return res.status(404).json({ error: "Sale order not found" });
            updateData.saleOrderDate = sale.saleDate;
        }
        const delivery = await deliveryNoteModel.findByIdAndUpdate(deliveryId,req.body,{new:true})

        if (!delivery)
            return res
              .status(404)
              .json({ error: `Delivery not found with id:${deliveryId}` });
          return res
            .status(200)
            .json({ result: delivery, message: "Delivery Updated Successfully" });
    }catch(error){
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went wrong" });
    }
}

routes.deleteDeliveryNoteById = async(req,res)=>{
    try{
        const deliveryNoteId = req.params.id
        
        if(!deliveryNoteId){
            res.status(400).json({error:"Delivery Id Required"})
        }
        const delivery = await deliveryNoteModel.findByIdAndDelete(deliveryNoteId) 

        if (!delivery)
            return res
              .status(404)
              .json({ error: `Delivery not found with id:${deliveryNoteId}` });
        return res
              .status(200)
              .json({ result: delivery, message: "Delivery Updated Successfully" });
    }catch(error){
        console.log("error = ", error);
        res.status(500).json({ error: "Something Went wrong" });
    }
}


export default routes;