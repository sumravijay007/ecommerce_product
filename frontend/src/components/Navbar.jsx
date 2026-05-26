import { Link } from "react-router-dom";
import { useContext } from "react";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "./Navbar.css";
function Navbar() {

    const { cart } = useContext(CartContext);

    // ================= WISHLIST CONTEXT =================

    const { wishlist } = useContext(WishlistContext);

    return (

        <div className="navbar">

            {/* ================= LOGO ================= */}

            <div className="logo">
                MyStore
            </div>

            {/* ================= NAV LINKS ================= */}

            <div className="nav-links">

                {/* HOME */}

                <Link to="/">
                    Home
                </Link>

                {/* ADD PRODUCT */}

                <Link to="/add-product">
                    Add Product
                </Link>

                {/* WISHLIST */}

                <Link to="/wishlist">
                    ❤️ Wishlist <span>{wishlist.length}</span>
                </Link>

                <Link to="/cart">
                    🛒 Cart <span>{cart.length}</span>
                </Link>

            </div>

        </div>

    );
}

export default Navbar;