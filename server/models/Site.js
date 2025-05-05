const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    smallImage: {
        type: String,
        required: [true, 'Small image is required'],
        trim: true
    },
    largeImage: {
        type: String,
        required: [true, 'Large image is required'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    position: {
        type: Number,
        required: [true, 'Position is required'],
    },
})

module.exports = mongoose.model('Site', siteSchema);