const router = require("express").Router();
const {
    addProduct,
    getProducts,
    getSingleProduct
} = require("../controllers/productController");

const upload = require("../middleware/upload");

router.post(
    "/",
    upload.array("images", 5),
    addProduct
);
router.get("/:id", getSingleProduct);
router.get("/", getProducts);

module.exports = router;