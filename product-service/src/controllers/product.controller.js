import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product, Category } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { 
    createProductService, 
    updateProductService, 
    deleteProductService 
} from "../services/product.service.js";

/*
Admin: Add a new product with images
*/
export const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, stock, attributes } = req.body;

    // 1. Validation
    if ([name, description, price, category].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All primary fields are required");
    }

    // 2. Handle Images
    const mainImageLocalPath = req.files?.main_image?.[0]?.path;
    if (!mainImageLocalPath) {
        throw new ApiError(400, "Main product image is required");
    }

    const mainImage = await uploadOnCloudinary(mainImageLocalPath);
    
    let galleryUrls = [];
    if (req.files?.gallery && req.files.gallery.length > 0) {
        const galleryUploadPromises = req.files.gallery.map(file => uploadOnCloudinary(file.path));
        const galleryResponses = await Promise.all(galleryUploadPromises);
        galleryUrls = galleryResponses.map(res => res.url);
    }

    // 3. Create Product via Service
    const product = await createProductService({
        name,
        description,
        price,
        category,
        stock,
        attributes: attributes ? JSON.parse(attributes) : {}, // Parse if sent as stringified JSON
        main_image: mainImage.url,
        gallery: galleryUrls
    });

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });
});

/*
Admin: Update product details or images
*/
export const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const updateData = { ...req.body };

    // 1. If a new main image is being uploaded
    if (req.files?.main_image) {
        const result = await uploadOnCloudinary(req.files.main_image[0].path);
        updateData.main_image = result.url;
    }

    // 2. Update via Service
    const updatedProduct = await updateProductService(productId, updateData);

    if (!updatedProduct) {
        throw new ApiError(404, "Product not found or failed to update");
    }

    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct
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
        message: "Product removed successfully"
    });
});

/*
User: Get all active products
*/
export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ is_active: true }).populate("category", "name");
    
    return res.status(200).json({
        success: true,
        data: products
    });
});

/*
User: Get single product details
*/
export const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate("category", "name");
    
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json({
        success: true,
        data: product
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
        data: category
    });
});