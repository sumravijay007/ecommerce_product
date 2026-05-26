const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: String,
    images: [String],
    description: String,
    stock: Number
});

module.exports = mongoose.model("Ecommerce_product", productSchema);