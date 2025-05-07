const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const { failed, customError } = require("../utils/errorHandler");
const uploadMedia = require("../utils/fileUploader");
const { convertToArray } = require("../utils/helper");
const Category = require("../models/Category");
const Order = require("../models/Order");
const User = require("../models/User");


exports.createProduct = async (req, res) => {
    try {
        //  Fetching
        let { name, description, category, cashOnDelivery = 'Off', sizeOptions, originalPrice, discountedPrice, stocks } = req.body;
        let images = req.files['images[]'] || [];
        images = convertToArray(images)
        let details = JSON.parse(req.body.details) || [];
        buyingOption = JSON.parse(req.body.buyingOptions) || [];
        // details = convertToArray(details);

        //  Validation
        if (!name || !description) {
            throw customError("All fields are required", 404);
        }
        if (details.length === 0) {
            throw customError("At least one Detail is required", 404);
        }
        if (!buyingOption || buyingOption.length === 0) {
            throw customError("At least one buying option is required", 404);
        }
        if (category) {
            const categoryObj = await Category.findById(category);
            if (!categoryObj) {
                throw customError("Invalid category", 404);
            }
        }

        const imagesPromises = images.map(async (image) => {
            const getUrl = await uploadMedia(image, `Products/${name}`);
            return getUrl.secure_url;
        });

        const imagesUrl = await Promise.all(imagesPromises);

        //  Perform Task
        const productObj = new Product({
            name, description, details, category, isCOD: cashOnDelivery,
            images: imagesUrl,
            originalPrice: Number(originalPrice),
            discountedPrice: Number(discountedPrice),
            stock: Number(stocks),
            buyingOption: buyingOption,
            sizeOptions: sizeOptions
        })
        await productObj.save();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Product Created Successfully'
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.updateProduct = async (req, res) => {
    try {

        // Fetching
        let { id, name, description, category, cashOnDelivery, stocks, sizeOptions, originalPrice, discountedPrice, buyingOption } = req.body;
        let images = req.body['images[]'] || [];
        let newImages = req.files ? req.files['images[]'] : [];
        newImages = convertToArray(newImages);
        images = convertToArray(images);
        buyingOption = JSON.parse(req.body.buyingOptions) || [];
        let details = JSON.parse(req.body.details) || [];

        //  Validation
        if (!id) {
            throw customError("Unknown Product selected");
        }
        const product = await Product.findById(id);
        if (!product) {
            throw customError("Unable to find the product");
        }
        if (!name || !description) {
            throw customError("All fields are required", 404);
        }
        if (details.length === 0) {
            throw customError("At least one Detail is required", 404);
        }
        if (!buyingOption || buyingOption.length === 0) {
            throw customError("At least one buying option is required", 404);
        }
        if (category) {
            const categoryObj = await Category.findById(category);
            if (!categoryObj) {
                throw customError("Invalid category", 404);
            }
        }

        const newImagesUrls = await Promise.all(
            newImages.map(async (image) => {
                const temp = await uploadMedia(image, product.name);
                return temp.secure_url;
            })
        );
        const updatedImages = [...images, ...newImagesUrls];

        if (!updatedImages || updatedImages.length === 0) {
            throw customError("At least one image is required", 404)
        }

        // Perform Task
        await Product.findByIdAndUpdate(id, {
            name, description, details, category, isCOD: cashOnDelivery, images: updatedImages,
            originalPrice: Number(originalPrice),
            discountedPrice: Number(discountedPrice),
            stock: Number(stocks),
            buyingOption: buyingOption,
            sizeOptions: sizeOptions
        })

        // Send response
        res.status(200).json({ success: true, message: 'Product Updated Successfully' });
    } catch (err) {
        failed(res, err);
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        // Fetching
        const { id } = req.body;

        // Validation
        if (!id) {
            throw customError('Unknown product selected', 404);
        }
        const product = await Product.findOneById(id);
        if (!product) {
            throw customError('Unable to find the product', 404);
        }

        // Perform Task
        await Product.findByIdAndUpdate(id, { deleted: true });

        // Send response
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        failed(res, err);
    }
};

exports.getAllProduct = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category = null,
            search = null,
            priceMin = null,
            priceMax = null,
            availability = null,
            payment = 'Off',
            sortBy = 'purchased',
            sortOrder = 'desc',
            all = null,
        } = req.query;

        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        let query = {};

        if (category && mongoose.Types.ObjectId.isValid(category)) {
            query.category = new mongoose.Types.ObjectId(category);
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { 'details.heading': { $regex: searchRegex } },
                { 'details.detail': { $regex: searchRegex } },
            ];
        }

        if (availability === 'true' || availability === true) {
            query['buyingOption.stock'] = { $gt: 0 };
        }

        if (payment !== 'Off') {
            query.isCOD = true;
        }

        if (priceMin && priceMax) {
            query['buyingOption.discountedPrice'] = {
                $gte: Number(priceMin),
                $lte: Number(priceMax),
            };
        }

        let products;

        products = await Product.aggregate([
            { $match: { ...query, deleted: { $ne: true } } },
            { $unwind: '$buyingOption' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: {
                    path: '$categoryDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    description: { $first: '$description' },
                    category: { $first: '$categoryDetails.name' },
                    isCOD: { $first: '$isCOD' },
                    viewed: { $first: '$viewed' },
                    purchased: { $first: '$purchased' },
                    images: { $first: '$images' },
                    createdAt: { $first: '$createdAt' },
                    details: { $first: '$details' },
                    minPrice: { $min: '$buyingOption.discountedPrice' },
                    maxPrice: { $max: '$buyingOption.discountedPrice' },
                    minStock: { $min: '$buyingOption.stock' },
                    maxStock: { $max: '$buyingOption.stock' },
                    maxDiscount: { 
                        $max: { 
                            $cond: [
                                { $gt: ['$buyingOption.originalPrice', 0] },
                                {
                                    $divide: [
                                        { $subtract: ['$buyingOption.originalPrice', '$buyingOption.discountedPrice'] },
                                        '$buyingOption.originalPrice'
                                    ]
                                },
                                0
                            ]
                        }
                    }
                }
            },
            { $sort: sortOptions },
            { $skip: parseInt(skip) },
            { $limit: parseInt(limit) },
        ]);

        const totalCount = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            success: true,
            message: "Successfully fetched the Products",
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCount
            }
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.getProduct = async (req, res) => {
    try {
        // Fetching
        const { id } = req.body;

        // Validation
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw customError("Unknown Product selected", 404);
        }

        const product = await Product.findById(id).populate('category');
        if (!product) {
            throw customError('Unable to find the product', 404);
        }
        await Product.findByIdAndUpdate(id, { viewed: product.viewed + 1 });

        const query = { _id: { $ne: id } };
        query.category = product.category;
        query.stock = { $gt: 0 };

        const suggestions = await Product.find(query)
            .limit(10)
            .sort('price')
            .lean()
            .exec();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            product: {
                ...product.toObject(),
                suggestions
            }
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.createCategory = async (req, res) => {
    try {
        //  Fetching
        const { name } = req.body;
        const image = req.files ? req.files['image'] : null;

        //  Validation
        if (!name) {
            throw customError("Enter category correctly");
        }
        if (name.length === 0) {
            throw customError("Category can't be empty");
        }
        const alreadyExist = await Category.findOne({ name: name });
        if (alreadyExist) {
            throw customError("This category already exist");
        }
        if (!image) {
            throw customError("Image is required");
        }
        let getUrl;
        if (image) {
            getUrl = await uploadMedia(image, `Category/${name}`)
        }

        //  Perform Task
        await Category.create({ name: name, image: getUrl.secure_url });
        const category = await Category.find().sort({ name: 1 });

        //  Send response
        res.status(200).json({
            success: true,
            message: "Successfully created the category",
            categories: category
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.getCategory = async (req, res) => {
    try {
        //  Perform task
        const allCategories = await Category.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            message: "Successfully fetched the category",
            categories: allCategories,
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.updateCategory = async (req, res) => {
    try {
        //  Fetching
        let { id, name } = req.body;
        const image = req.files ? req.files['image'] : null;


        //  Validation
        if (!name) {
            throw customError("Enter category correctly");
        }
        let check = await Category.findById(id);
        if (!check) {
            throw customError("This category does not exist");
        }
        check = await Category.findOne({ name: name });
        if (!image && check) {
            throw customError("This name category already exist");
        }

        if (image) {
            const getUrl = await uploadMedia(image, `Category/${name}`)
            await Category.findByIdAndUpdate(id, { image: getUrl.secure_url })
        }

        //  Perform task
        await Category.findByIdAndUpdate(id, { name: name });
        const allCategories = await Category.find().sort({ name: 1 });


        //  Send response
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            categories: allCategories
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        //  Fetching
        const { id } = req.body;

        //  Validation
        let check = await Category.findById(id);
        if (!check) {
            throw customError("This category does not exist");
        }
        if (check.category === "any") {
            throw customError("You can't delete 'Any' category");
        }

        //  Perform task
        await Category.findByIdAndDelete(id);
        const category = await Category.find().sort({ name: 1 });
        await Product.updateMany({ category: id }, { $set: { category: null } })

        //  Send response
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            categories: category,
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.getGraphData = async (req, res) => {
    try {
        // Fetch products
        const products = await Product.find({}, { name: 1, 'stock': 1, category: 1 });

        // Fetch orders
        const orders = await Order.find({}, { totalPrice: 1, orderDetails: 1, createdAt: 1 }).lean();

        // Fetch users
        const users = await User.find({}, { email: 1 }).lean();

        res.status(200).json({
            success: true,
            products,
            orders,
            users,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};