const router = require("express").Router();

const {
    addToCart
} = require("../controllers/cartController");

router.post("/", addToCart);

module.exports = router;