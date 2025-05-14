const { default: mongoose } = require("mongoose");

const ShipTokenSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d', // Document will be deleted 7 days after creation
    }
})

module.exports = mongoose.model('ShipToken', ShipTokenSchema);