import Brand from '../../models/products/brand.model.js'; 
import RepairBrand from '../../models/repair/brand.model.js';

const routes = {}

routes.addBrand = async (req,res) =>{
    try{
        const {brandName, shortDescription} = req.body;

        if(!brandName || !shortDescription){
          return res.status(400).json({error: "Brand name and Short Description are required"})
        }

        // console.log("Received data:", { brandName, shortDescription });

        const brand = await Brand.findOne({name: brandName});
        if (!brand) {
          return res.status(404).json({ error: "Brand not found in the Brand collection" });
      }

      const newRepairBrand = new RepairBrand({
        brandName: brand._id,
        shortDescription
    });

    await newRepairBrand.save();
    return res.status(201).json({ message: "Repair Brand added successfully", data: newRepairBrand });

    } catch(error){
        console.log(error);
        return res.status(500).json({error : "Something Went Wrong"})
    }
}

routes.getAllBrand = async (req,res)=>{
    try{
        const brands = await RepairBrand.find().populate('brandName', 'name');

    if (!brands || brands.length === 0) {
      return res.status(404).json({ message: "No Brand found" });
    }

    return res.status(200).json({ result: brands, message: "Brand retrieved successfully" });
    } catch(error){
        console.log(error)
        return res.status(500).json({error:"Something Went Wrong"})
    }
}

routes.getBrandById = async (req,res)=>{
    try{
        const brandId = req.params.id;

        if (!brandId) {
          return res.status(400).json({ error: "Brand ID is required" });
        }
    
        const brand = await RepairBrand.findById(brandId).populate('brandName', 'name');
    
        if (!brand) {
          return res
            .status(404)
            .json({ error: `Brand not found with ID: ${brandId}` });
        }
    
        return res
          .status(200)
          .json({ result: brand, message: "Brand Retrieved Successfully" });

    } catch (error) {
        console.log("error=",error)
        res.status(500).json({ error: "Something went wrong" });
      }
}

routes.updateBrandById = async(req,res)=>{
    try{
        const brandId = req.params.id;
    if (!brandId) return res.status(400).json({ error: "Brand Id is required" });
    const brand = await RepairBrand.findByIdAndUpdate(brandId, req.body,{new:true}).populate('brandName','name').populate('shortDescription','shortDescription');;

    if (!brand)
        return res
          .status(404)
          .json({ error: `Brand not found with id:${brandId}` });

      return res
        .status(200)
        .json({ result: brand, message: "Brand Updated Successfully" });
    } catch (error) {
        console.log("error=",error)
        res.status(500).json({ error: "Something went wrong" });
      }
}

routes.deleteBrandById = async (req,res) =>{
    try{
        const brandId = req.params.id;

    if (!brandId) {
      return res.status(400).json({ error: "Brand ID is required" });
    }

    const deletedBrand = await RepairBrand.findByIdAndDelete(brandId)

    if (!deletedBrand) {
      return res
        .status(404)
        .json({ error: `Brand not found with ID: ${brandId}` });
    }

    return res
      .status(200)
      .json({ result: deletedBrand, message: "Brand Deleted Successfully" });
    } catch(error){
        console.log("error=",error)
        res.status(500).json({error: "Something Went wrong"})
    }
}

export default routes;