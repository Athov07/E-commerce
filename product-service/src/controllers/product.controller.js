import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product, Category } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/product.service.js";

/*
Admin: Add a new product with images
*/
export const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, attributes } = req.body;

  // 1. Validation (Improved for numbers and strings)
  const requiredFields = { name, description, price, category };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      throw new ApiError(400, `${key} is a required primary field`);
    }
  }

  // 2. Handle Images
  const mainImageLocalPath = req.files?.main_image?.[0]?.path;
  if (!mainImageLocalPath) {
    throw new ApiError(400, "Main product image is required");
  }

  const mainImage = await uploadOnCloudinary(mainImageLocalPath);

  let galleryUrls = [];
  if (req.files?.gallery && req.files.gallery.length > 0) {
    // Map to promises for parallel upload
    const galleryResponses = await Promise.all(
      req.files.gallery.map((file) => uploadOnCloudinary(file.path)),
    );
    galleryUrls = galleryResponses.filter((res) => res).map((res) => res.url);
  }

  // 3. Parse Attributes Robustly
  let parsedAttributes = {};
  if (attributes) {
    try {
      parsedAttributes =
        typeof attributes === "string" ? JSON.parse(attributes) : attributes;
    } catch (error) {
      throw new ApiError(
        400,
        "Invalid format for attributes. Must be valid JSON.",
      );
    }
  }

  // 4. Create Product via Service
  const product = await createProductService({
    name,
    description,
    price: Number(price),
    category,
    stock: Number(stock) || 0,
    attributes: parsedAttributes,
    main_image: mainImage.url,
    gallery: galleryUrls,
  });

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

/*
Admin: Update product details or images
*/
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productId = id || req.params.productId;

  let updateData = { ...req.body };

  if (updateData.attributes && typeof updateData.attributes === "string") {
    try {
      updateData.attributes = JSON.parse(updateData.attributes);
    } catch (error) {
      throw new ApiError(400, "Invalid format for product attributes");
    }
  }

  if (req.files?.main_image) {
    const result = await uploadOnCloudinary(req.files.main_image[0].path);
    if (result) {
      updateData.main_image = result.url;
    }
  }

  if (req.files?.gallery) {
    const galleryUrls = [];
    for (const file of req.files.gallery) {
      const result = await uploadOnCloudinary(file.path);
      if (result) galleryUrls.push(result.url);
    }
    updateData.gallery = galleryUrls;
  }

  const updatedProduct = await updateProductService(productId, updateData);

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found or failed to update");
  }

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

/*
Admin: Remove a product
*/
export const removeProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await deleteProductService(productId);

  return res.status(200).json({
    success: true,
    message: "Product removed successfully",
  });
});

/*
User: Get all active products
*/
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ is_active: true }).populate(
    "category",
    "name",
  );

  return res.status(200).json({
    success: true,
    data: products,
  });
});

/*
User: Get single product details
*/
export const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate(
    "category",
    "name",
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
});

/*
Admin: Create a new category
*/
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const existedCategory = await Category.findOne({ name });
  if (existedCategory) {
    throw new ApiError(409, "Category already exists");
  }

  const category = await Category.create({ name });

  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

/* Get all categories
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });

  if (!categories) {
    throw new ApiError(404, "No categories found");
  }

  return res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});



export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
        success: true,
        message: "Category deleted successfully"
    });
});