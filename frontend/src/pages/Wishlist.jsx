import { useContext, useState } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Wishlist.css";

function Wishlist() {
    const { wishlist, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const [movingToCart, setMovingToCart] = useState(null);

    const handleMoveToCart = (item) => {
        setMovingToCart(item._id);
        addToCart(item);
        // Optional: Remove from wishlist after adding to cart
        // removeFromWishlist(item._id);
        setTimeout(() => setMovingToCart(null), 500);
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <div className="wishlist-container">
            {/* Header */}
            <div className="wishlist-header">
                <Link to="/" className="back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Continue Shopping
                </Link>
                <h1>My Wishlist</h1>
                <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist</p>
            </div>

            {wishlist.length === 0 ? (
                <div className="empty-wishlist">
                    <div className="empty-wishlist-icon">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </div>
                    <h2>Your wishlist is empty</h2>
                    <p>Save your favorite items here and never lose them</p>
                    <Link to="/" className="shop-now-btn">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <>
                    {/* Wishlist Items Grid */}
                    <div className="wishlist-grid">
                        {wishlist.map((item) => (
                            <div className="wishlist-card" key={item._id}>
                                <Link to={`/product/${item._id}`} className="product-link">
                                    <div className="product-image-wrapper">
                                        <img
                                            src={`https://ecommerce-product-yww7.onrender.com/${item.images[0]}`}
                                            alt={item.name}
                                            className="product-image"
                                        />
                                        {item.discount && (
                                            <span className="discount-badge">{item.discount}% OFF</span>
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
                                                    <span className="discount-percent">
                                                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <div className="stock-status">
                                            {item.stock > 0 ? (
                                                <span className="in-stock">In Stock</span>
                                            ) : (
                                                <span className="out-of-stock">Out of Stock</span>
                                            )}
                                        </div>

                                        <p className="product-description">
                                            {truncateText(item.description, 70)}
                                        </p>
                                    </div>
                                </Link>

                                <div className="product-actions">
                                    <button
                                        className="move-to-cart-btn"
                                        onClick={() => handleMoveToCart(item)}
                                        disabled={item.stock === 0 || movingToCart === item._id}
                                    >
                                        {movingToCart === item._id ? (
                                            <>
                                                <div className="spinner-small"></div>
                                                Moving...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="9" cy="21" r="1"></circle>
                                                    <circle cx="20" cy="21" r="1"></circle>
                                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                                </svg>
                                                Move to Cart
                                            </>
                                        )}
                                    </button>

                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromWishlist(item._id)}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recommended Products Section */}
                    <div className="recommended-section">
                        <h2>Recommended for You</h2>
                        <div className="recommended-grid">
                            <p className="coming-soon">More recommendations coming soon...</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Wishlist;