import discountModel from "../../models/sell/discount.model.js";
import brandModel from "../../models/products/brand.model.js";

const routes = {};

routes.addDiscount = async (req, res) => {
  try {
    const {
      name,
      product,
      brand,
      category,
      location,
      priority,
      discountType,
      discountAmount,
      startDate,
      endDate,
      sellingPriceGroup,
      applyInCustomerGroups,
      isActive,
    } = req.body;

    const brandName = await brandModel.findById(brand);
    if (!brandName) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const newDiscount = new discountModel({
      name,
      product,
      brand,
      category,
      location,
      priority,
      discountType,
      discountAmount,
      startDate,
      endDate,
      sellingPriceGroup,
      applyInCustomerGroups,
      isActive,
    });
    await newDiscount.save();

    res
      .status(201)
      .json({ message: "Delivery added successfully", result: newDiscount });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

routes.getAllDiscount = async (req, res) => {
  try {
    const {page= 1, limit= 10} = req.query;

    const allDis = await discountModel.countDocuments();
    const totalPage = Math.ceil(allDis/limit);

    const allDiscount = await discountModel.find()
                                            .populate("brand", "name")
                                            .populate("category", "name")
                                            .populate("product", "productName")
                                            .skip((page -1 )* limit).limit(limit);

    if (!allDiscount || allDiscount == 0) {
      res.status(400).json({ error: "No Discount Found" });
    }
    return res
      .status(200)
      .json({
        result: allDiscount,
        totalPage,
        message: "Discount data retrived successfully",
      });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

routes.getDiscountById = async (req, res) => {
  try {
    const discountId = req.params.id;

    if (!discountId) {
      res.status(400).json({ error: "Discount ID is required" });
    }
    const discount = await discountModel
      .findById(discountId)
      .populate("brand", "name");

    if (!discount) {
      res
        .status(400)
        .json({ error: `Discount is not found with Id ${discountId}` });
    }
    return res
      .status(200)
      .json({ result: discount, message: "Discount retrived successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

routes.updateDiscountById = async (req, res) => {
  try {
    const discountId = req.params.id;
    // const updateData = req.body;

    if (!discountId) {
      res.status(400).json({ error: "Discount ID is required" });
    }
    // if (updateData.brand) {
    //     const brandName = await brandModel.findById(updateData.brand);
    //     if (!brandName) return res.status(404).json({ error: "BrandName not found" });
    // }
    const discount = await discountModel.findByIdAndUpdate(
      discountId,
      req.body,
      { new: true }
    );

    if (!discount)
      return res
        .status(404)
        .json({ error: `Discount not found with id:${discountId}` });
    return res
      .status(200)
      .json({ result: discount, message: "Discount Updated Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

routes.deleteDiscount = async (req, res) => {
  try {
    const discountId = req.params.id;

    if (!discountId) {
      res.status(400).json({ error: "Discount Id Required" });
    }
    const discount = await discountModel.findByIdAndDelete(discountId);

    if (!discount)
      return res
        .status(404)
        .json({ error: `Discount not found with id:${discountId}` });
    return res
      .status(200)
      .json({ result: discount, message: "Discount Updated Successfully" });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ error: "Something Went wrong" });
  }
};

export default routes;
