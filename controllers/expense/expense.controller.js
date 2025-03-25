import expenseModel from "../../models/expense/expense.model.js";
import productModel from "../../models/products/productList.model.js";
import expenseCategoryModel from "../../models/expense/expenseCategory.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../utils/s3.js";

const routes = {}

routes.addExpense = async(req,res)=>{
    try {
        const{
            businessLocation,
            expenseCategory,

            referenceNo,
            date,
            expenseFor,
            expenseForContact,
            applicableTax,
            totalAmount,
            expenseNote,
            isRefund,
            amount,
            paidOn,
            paymentMethod,
            paymentNote
        } = req.body

        let attachDocument = null;

        if (req.file) {
            const file = req.file;
            const fileKey = `expenseDocument/${uuidv4()}_${file.originalname}`;
            const uploadResult = await uploadFile(file, fileKey);
            attachDocument = uploadResult.Location;
          }
          
        console.log("Uploaded Files: ", req.file);

        const business = await productModel.findById(businessLocation);
        if (!business) {return res.status(404).json({ error: "Business Location not found" });}

        const categoryExpense = await expenseCategoryModel.findById(expenseCategory);
        if (!categoryExpense) {return res.status(404).json({ error: "Expense Category not found" });}

        const newExpense = new expenseModel({
            businessLocation,
            expenseCategory,
            subCategory: business.subCategory,
            referenceNo,
            date: date || Date.now,
            expenseFor,
            expenseForContact,
            attachDocument,
            applicableTax,
            totalAmount,
            expenseNote,
            isRefund,
            amount,
            paidOn,
            paymentMethod,
            paymentNote
        })

        await newExpense.save()

        return res.status(200).json({result:newExpense,message:"Expense Added Successfully"})
        
    } catch (error) {
        console.log("error:",error.message)
        return res.status(500).json({ error: "Somethig went wrong" });
    }
}

routes.getAllExpense = async(req,res)=>{
    try {
        const allExpense = await expenseModel.find()
        .populate('businessLocation','businessLocations')
        .populate('expenseCategory')

        if(!allExpense || !allExpense === 0){
            return res.status(404).json({error:'No Expense Found'})
        }
        return res.status(200).json({result:allExpense,message:"All Expense Fetched Successfully"})
    } catch (error) {
        console.log("error:",error.message)
        return res.status(500).json({ error: "Somethig went wrong" });
    }
}

routes.getExpenseById = async(req,res)=>{
    try {
        const expenseId = req.params.id
        if(!expenseId){
            return res.status(404).json({error:"Expense Id is required"})
        }
        const expense = await expenseModel.findById(expenseId)
        .populate('businessLocation','businessLocations')
        .populate('expenseCategory')

        if(!expense){
            return res.status(404).json({error:`Expense is not found with Id ${expenseId}`})
        }
        return res.status(200).json({result:expense,message:'Wxpense data is fetched'})
    } catch (error) {
        console.log("error:",error.message)
        return res.status(500).json({ error: "Somethig went wrong" });
    }
}

routes.updateExpenseId = async(req,res)=>{
    try {
        const expenseId = req.params.id;
        const updateData = req.body;
        if(!expenseId){
            return res.status(404).json({error:"Expense Id is required"})
        } 
        if(updateData.businessLocation){
            const business = await productModel.findById(updateData.businessLocation);
            if (!business) {return res.status(404).json({ error: "Business Location not found" });}
            updateData.subCategory = business.subCategory;
        }
        if(updateData.expenseCategory){
            const categoryExpense = await expenseCategoryModel.findById(expenseCategory);
            if (!categoryExpense) {return res.status(404).json({ error: "Expense Category not found" });}
        }

        const expense = await expenseModel.findByIdAndUpdate(expenseId,updateData,{new:true})
        if(!expense){
            return res.status(404).json({error:`Expense is not found with Id ${expenseId}`})
        }
        return res.status(200).json({result:expense,message:"Expense updated successfully"})
    } catch (error) {
        console.log("error:",error.message)
        return res.status(500).json({ error: "Somethig went wrong" });
    }
}

routes.deleteExpenseId = async(req,res)=>{
    try {
        const expenseId = req.params.id
        if(!expenseId){
            return res.status(404).json({error:"Expense Id is required"})
        }
        const expense = await expenseModel.findByIdAndDelete(expenseId)
        
        if(!expense){
            return res.status(404).json({error:`Expense is not found with Id ${expenseId}`})
        }
        return res.status(200).json({result:expense,message:"Expense is deleted successfully"})
    } catch (error) {
        console.log("error:",error.message)
        return res.status(500).json({ error: "Somethig went wrong" });
    }
}

export default routes;