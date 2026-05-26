import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";

function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/cart" element={<Cart />} />
                <Route
                    path="/add-product"
                    element={<AddProduct />}
                />
                <Route
                    path="/product/:id"
                    element={<ProductDetails />}
                />
                   <Route
                    path="/wishlist"
                    element={<Wishlist />}
                />
            </Routes>

        </BrowserRouter>

    );
}

export default App;