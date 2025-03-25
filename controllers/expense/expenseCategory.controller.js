import expenseCategoryModel from "../../models/expense/expenseCategory.model.js";

const routes = {}

routes.addExpenseCategory = async(req,res)=>{
    try {
        const{
            categoryName,
            categoryCode,
            addAsSubcategory
        }=req.body

        const expenseCategory = await expenseCategoryModel.create({categoryName,categoryCode,addAsSubcategory})

        return res.status(200).json({result:expenseCategory,message:'Expense Category added succesfully'})
    } catch (error) {
        console.log("error:",error.message)
        return res.status(500).json({ error: "Somethig went wrong" });
    }
}

routes.getAllExpenseCategory = async(req,res)=>{
    try {
        const allExpenseCategory = await expenseCategoryModel.find()

        if(!allExpenseCategory || allExpenseCategory.length === 0){
            return req.status(404).json({error:"Expense Category is not found"})
        }

        return res.status(200).json({result:allExpenseCategory,message:"All Expense Category retrived Successfully"})
    } catch (error) {
        console.log("error:",error.message)
        return res.status(500).json({ error: "Somethig went wrong" });
    }
}

routes.getExpenseCategoryById = async(req,res)=>{
    try {
        const expenseCategoryId = req.params.id

        if(!expenseCategoryId){
            return res.status(404).json({error:"Id is required"})
        }
        const expenseCategory = await expenseCategoryModel.findById(expenseCategoryId)

        if(!expenseCategory){
            return res.status(404).json({error:`Expense Category is not found with Id ${expenseCategoryId}`})
        }
        return res.status(200).json({result:expenseCategory,message:"Data Retrived Successfully"})
    } catch (error) {
        console.log("error:",error.message)
        return res.status(500).json({ error: "Somethig went wrong" });
    }
}

routes.updateExpenseCategoryById = async(req,res)=>{
    try {
        const expenseCategoryId = req.params.id

        if(!expenseCategoryId){
            return res.status(404).json({error:"Id is required"})
        }

        const expenseCategory =await expenseCategoryModel.findByIdAndUpdate(expenseCategoryId,req.body,{new:true})
        if(!expenseCategory){
            return res.status(404).json({error:`Expense Category is not found with Id ${expenseCategoryId}`})
        }
        return res.status(200).json({result:expenseCategory,message:"Expense Category Updated Successfully"})
    } catch (error) {
        console.log("error:",error.message)
        return res.status(500).json({ error: "Somethig went wrong" });
    }
}

routes.deleteExpenseCategoryById = async(req,res)=>{
    try {
        const expenseCategoryId = req.params.id

        if(!expenseCategoryId){
            return res.status(404).json({error:"Id is required"})
        } 

        const expenseCategory =await expenseCategoryModel.findByIdAndDelete(expenseCategoryId)
        if(!expenseCategory){
            return res.status(404).json({error:`Expense Category is not found with Id ${expenseCategoryId}`})
        }
        return res.status(200).json({result:expenseCategory,message:"Expense Category Deleted Successfully"})

    } catch (error) {
        console.log("error:",error.message)
        return res.status(500).json({ error: "Somethig went wrong" });
    }
}

export default routes;