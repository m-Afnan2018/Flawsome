const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    details: [{
        heading: {
            type: String,
            required: [true, 'Detail heading is required'],
            trim: true
        },
        detail: {
            type: String,
            required: [true, 'Detail is required'],
            trim: true
        }
    }
    ],
    images: [{
        type: String,
        required: [true, 'Product image is required'],
        trim: true
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    isCOD: {
        type: Boolean,
        required: [true, 'COD status is required'],
        default: false
    },
    viewed: {
        type: Number,
        default: 0,
        min: [0, 'Viewed count cannot be negative']
    },
    purchased: {
        type: Number,
        default: 0,
        min: [0, 'Purchased count cannot be negative']
    },
    previewImage: {
        type: String, 
        default: null, 
        trim: true,
    },
    sizeOptions: {
        type: Boolean,
        default: false,
    },
    buyingOption: [{
        size: {
            type: String,
            required: [true, 'Size is required'],
            trim: true
        }, 
        originalPrice: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative']
        },
        discountedPrice: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
        },
        stock: {
            type: Number,
            required: [true, 'Product stock is required'],
            min: [0, 'Stock cannot be negative']
        }
    }]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
