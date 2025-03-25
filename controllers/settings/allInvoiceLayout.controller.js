import allInvoiceLayoutModel from '../../models/settings/allInvoiceLayout.model.js';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from '../../utils/s3.js';

const routes = {};

routes.addAllInvoiceLayout = async (req, res) => {
  try {
    const {
      layoutName,
      design,
      showLetterHead,
      showInvoiceLogo,
      headerText,
      heading,
      invoiceNoLabel,
      quotationNoLabel,
      dateLabel,
      dueDateLabel,
      showDueDate,
      dateTimeFormat,
      salesPersonLabel,
      commissionAgentLabel,
      showLocationName,
      showSalesPerson,
      showCommissionAgent,
      customField1,
      customField2,
      customField3,
      customField4,
      customerDetails,
      locationAddressFields,
      communicationDetailsFields,
      taxDetailsFields,
      productLabel,
      quantityLabel,
      unitPriceLabel,
      subtotalLabel,
      categoryOrHSNcodeLabel,
      totalQuantityLabel,
      itemDiscountLabel,
      itemSKUlabel,
      discountedUnitPriceLabel,
      shownProductDetails,
      label,
      showPaymentInformation,
      showBarcode,
      showTotalBalanceDueAllSales,
      showTotalInWords,
      wordFormat,
      footerText,
      setAsDefault,
      qrCode,
      fieldsToBeShown,
      repairModuleSettings,
      creditNoteSellReturnDetails,
    } = req.body;

    if(!layoutName || !design){
        return res.status(400).json({error:"Layout Name or Design are missing"})
    }
    let invoiceLogo = null;
    if (req.file) {
      const file = req.file;
      const fileKey = `invoiceLogo/${uuidv4()}_${file.originalname}`;
      const uploadResult = await uploadFile(file, fileKey);
      invoiceLogo = uploadResult.Location; // URL of uploaded file
    }

    // Create a new instance of the invoice layout
    const newAllInvoiceLayout = new allInvoiceLayoutModel({
      layoutName,
      design,
      showLetterHead,
      showInvoiceLogo,
      invoiceLogo,
      headerText,
      heading,
      invoiceNoLabel,
      quotationNoLabel,
      dateLabel,
      dueDateLabel,
      showDueDate,
      dateTimeFormat,
      salesPersonLabel,
      commissionAgentLabel,
      showLocationName,
      showSalesPerson,
      showCommissionAgent,
      customField1,
      customField2,
      customField3,
      customField4,
      customerDetails,
      locationAddressFields,
      communicationDetailsFields,
      taxDetailsFields,
      productLabel,
      quantityLabel,
      unitPriceLabel,
      subtotalLabel,
      categoryOrHSNcodeLabel,
      totalQuantityLabel,
      itemDiscountLabel,
      itemSKUlabel,
      discountedUnitPriceLabel,
      shownProductDetails,
      label,
      showPaymentInformation,
      showBarcode,
      showTotalBalanceDueAllSales,
      showTotalInWords,
      wordFormat,
      footerText,
      setAsDefault,
      qrCode,
      fieldsToBeShown,
      repairModuleSettings,
      creditNoteSellReturnDetails,
    });

    // Save to the database
    await newAllInvoiceLayout.save();

    res.status(201).json({
      message: 'Invoice layout added successfully',
      data: newAllInvoiceLayout,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
};

routes.getAllInvoiceLayout = async(req,res)=>{
    try {
        const getInvoiceLayout = await allInvoiceLayoutModel.find()
        if(!getInvoiceLayout || !getInvoiceLayout === 0){
            return res.status(400).json({error:"No Invoice Layout found"})
        }
        return res.status(200).json({result:getInvoiceLayout,message:"Invoice Layout data fetched successfully"})
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Something went wrong. Please try again later'});
    }
}

routes.getInvoiceLayoutById = async(req,res)=>{
    try {
        const invoiceLayoutId = req.params.id
        if(!invoiceLayoutId){
            return res.status(400).json({error:"Id is required"})
        }
        const invoiceLayout = await allInvoiceLayoutModel.findById(invoiceLayoutId)
        if(!invoiceLayout){
            return res.status.json({error:`Invoice Layout is not found with Id ${invoiceLayoutId}`})
        }
        return res.status(200).json({result:invoiceLayout,message:"Data feched successfully"})
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Something went wrong. Please try again later'});
    }
}

routes.updateInvoiceLayoutById = async(req,res)=>{
    try {
        const invoiceLayoutId = req.params.id
        if(!invoiceLayoutId){
            return res.status(400).json({error:"Id is required"})
        }
        const invoiceLayout = await allInvoiceLayoutModel.findByIdAndUpdate(invoiceLayoutId,req.body,{new:true})

        if(!invoiceLayout){
            return res.status(400).json({error:`Invoice Layout is not found with Id ${invoiceLayoutId}`})
        }
        return res.status(200).json({result:invoiceLayout,message:"Invoice Layout updated successfully"})
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Something went wrong. Please try again later'});
    }
}

routes.deleteInvoiceLayoutById = async(req,res)=>{
    try {
        const invoiceLayoutId = req.params.id
        if(!invoiceLayoutId){
            return res.status(400).json({error:"Id is required"})
        } 
        const invoiceLayout = await allInvoiceLayoutModel.findByIdAndDelete(invoiceLayoutId)
        if(!invoiceLayout){
            return res.status(400).json({error:`Invoice Layout is not found with Id ${invoiceLayoutId}`})
        }
        return res.status(200).json({result:invoiceLayout,message:"Invoice Layout deleted successfully"})

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Something went wrong. Please try again later'});
    }
}

export default routes;
