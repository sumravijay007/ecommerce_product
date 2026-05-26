import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    // ================= CONTEXTS =================
    const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart, cart } = useContext(CartContext);

    // ================= STATES =================
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // ================= FETCH PRODUCTS =================
    useEffect(() => {
        setLoading(true);
        axios
            .get(`https://ecommerce-product-yww7.onrender.com/api/products?search=${search}`)
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [search]);

    // ================= HELPER FUNCTIONS =================
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    // ================= RETURN UI =================
    return (
        <div className="home-container">


            {/* Main Content */}
            <main className="main-content">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <>
                        {products.length === 0 ? (
                            <div className="no-products">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <circle cx="10" cy="10" r="7"></circle>
                                    <line x1="21" y1="21" x2="15" y2="15"></line>
                                </svg>
                                <h2>No products found</h2>
                                <p>Try searching for something else</p>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {products.map((item) => (
                                    <div className="product-card" key={item._id}>
                                        <Link to={`/product/${item._id}`} className="product-link">
                                            <div className="product-image-wrapper">
                                                <img
                                                    src={`https://ecommerce-product-yww7.onrender.com/${item.images[0]}`}
                                                    alt={item.name}
                                                    className="product-image"
                                                />
                                                {item.discount && (
                                                    <span className="discount-badge">{item.discount}% off</span>
                                                )}
                                            </div>
                                            <div className="product-details">
                                                <h3 className="product-title">{truncateText(item.name, 50)}</h3>

                                                <div className="product-rating">
                                                    <span className="rating-badge">
                                                        4.5 ★
                                                    </span>
                                                    <span className="rating-count">(1,234)</span>
                                                </div>

                                                <div className="product-price-section">
                                                    <span className="current-price">₹{item.price.toLocaleString()}</span>
                                                    {item.originalPrice && (
                                                        <>
                                                            <span className="original-price">₹{item.originalPrice.toLocaleString()}</span>
                                                            <span className="discount-percent">{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off</span>
                                                        </>
                                                    )}
                                                </div>

                                                <p className="product-description">
                                                    {truncateText(item.description, 60)}
                                                </p>
                                            </div>
                                        </Link>

                                        <div className="product-actions">
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="cart-btn"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="9" cy="21" r="1"></circle>
                                                    <circle cx="20" cy="21" r="1"></circle>
                                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                                </svg>
                                                Add to Cart
                                            </button>

                                            <button
                                                onClick={() => {
                                                    wishlist.find((w) => w._id === item._id)
                                                        ? removeFromWishlist(item._id)
                                                        : addToWishlist(item);
                                                }}
                                                className={`wishlist-btn ${wishlist.find((w) => w._id === item._id) ? 'active' : ''}`}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.find((w) => w._id === item._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default Home;