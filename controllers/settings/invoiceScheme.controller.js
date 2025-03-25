import invoiceSchemeModel from '../../models/settings/invoiceSchemes.model.js'

const routes = {}

routes.addInvoiceScheme = async(req,res)=>{
    try {
        const {dateFormat1,preview,name,prefix,startFrom,invoiceCount,numberOfDigits,setAsDefault} = req.body

        if (!dateFormat1 || !preview || !name) {
            return res.status(400).json({ error: "dateFormat1, preview, and name are required fields" });
        }

        const invoiceScheme = await invoiceSchemeModel.create({dateFormat1,preview,name,prefix,startFrom,
            invoiceCount,numberOfDigits,setAsDefault
        })
        return res.status(200).json({result:invoiceScheme,message:'Invoice Scheme Created successfully'})
    } catch (error) {
        console.log("error=",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.getAllInvoiceScheme = async(req,res)=>{
    try {
        const allInvoiceScheme = await invoiceSchemeModel.find()

        if(!allInvoiceScheme || allInvoiceScheme === 0){
            return res.status(400).json({error:'No Invoice Scheme is found'})
        }
        return res.status(200).json({result:allInvoiceScheme,message:"All invoice Scheme fetched"})
    } catch (error) {
        console.log("error=",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.getInvoiceSchemeById = async(req,res)=>{
    try {
        const invoiceSchemeId = req.params.id
        if(!invoiceSchemeId){
            return rea.status(404).json({error:'Invoice Scheme Id is required'})
        }

        const invoiceScheme = await invoiceSchemeModel.findById(invoiceSchemeId)
        if(!invoiceSchemeid){
            return res.status(400).json({error:`Invoice Scheme is not find ${invoiceSchemeId}`})
        }
        return res.status(200).json({result:invoiceScheme,message:`Invoice Scheme id not found with if`})
    } catch (error) {
        console.log("error=",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.updateInvoiceSchemeById = async(req,res)=>{
    try {
        const invoiceSchemeId = req.params.id

        if(!invoiceSchemeId){
            return rea.status(404).json({error:'Invoice Scheme Id is required'})
        }

        const invoiceScheme = await invoiceSchemeModel.findByIdAndUpdate(invoiceSchemeId,req.body,{new:true})

        if(!invoiceScheme){
            return res.status(404).json({error:`Invoice Scheme is not find ${invoiceSchemeId}`})
        }

        return res.status(200).json({result:invoiceScheme,message:"Invoice Scheme is Updated successfully"})
    } catch (error) {
        console.log("error=",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

routes.deleteInvoiceSchemeById = async(req,res)=>{
    try {
        const invoiceSchemeId = req.params.id

        if(!invoiceSchemeId){
            return rea.status(404).json({error:'Invoice Scheme Id is required'})
        }

        const invoiceScheme = await invoiceSchemeModel.findByIdAndDelete({invoiceSchemeId})

        if(!invoiceScheme){
            return res.status(404).json({error:`Invoice Scheme is not find ${invoiceSchemeId}`})
        }
        return res.status(200).json({result:invoiceScheme,message:'Invoice Scheme deleted successfully'})
    } catch (error) {
        console.log("error=",error)
        return res.status(500).json({error:"Something went wrong"})
    }
}

export default routes;