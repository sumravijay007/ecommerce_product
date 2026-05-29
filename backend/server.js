const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();


app.use(express.json());
app.use(
    cors({
        origin: "https://ecommerce-product-sigma.vercel.app", // frontend URL
        credentials: true,
    })
);
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
    res.send("API is running...");
}
);
app.listen(5000, () => {
    console.log("Server Running");
});