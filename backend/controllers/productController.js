const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
    try {

        const imagePaths = req.files.map(file => file.path);

        const product = await Product.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            stock: req.body.stock,

            images: imagePaths
        });

        res.json(product);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.getProducts = async (req, res) => {
    try {

        const keyword = req.query.search
            ? {
                name: {
                    $regex: req.query.search,
                    $options: "i"
                }
            }
            : {};

        const products = await Product.find(keyword);

        res.json(products);
    }
    catch (err) {
        res.status(500).json(err);
    }
}; 
exports.getSingleProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product Not Found"
            });

        }

        res.json(product);

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};