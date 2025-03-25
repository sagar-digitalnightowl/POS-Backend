import recallModel from '../../models/nhra/recall.model.js'
import manufacturerModel from "../../models/contacts/manufacturer.model.js";
import productModel from "../../models/products/productList.model.js";

const routes = {}

routes.addRecall = async(req,res)=>{
    try {
        const{
            recalls,
            manufacturerName,
            batchNo
        } = req.body

        const manufacturer = await manufacturerModel.findById(manufacturerName)
        if (!manufacturer) {return res.status(404).json({ error: "Manufacturer not found" });}

        const batch = await productModel.findById(batchNo);
        if (!batch) {return res.status(404).json({ error: "Batch not found" });}

        // const newAddRecall
    } catch (error) {
        
    }
}

export default routes