import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "./ProductDetails.css";

function ProductDetails() {
    // ================= PARAMS =================
    const { id } = useParams();

    // ================= STATES =================
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // ================= CONTEXT =================
    const { addToCart, cart } = useContext(CartContext);
    const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

    // ================= FETCH PRODUCT =================
    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:5000/api/products/${id}`)
            .then((res) => {
                setProduct(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    setMainImage(res.data.images[0]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);

    // ================= HELPER FUNCTIONS =================
    const handleAddToCart = () => {
        const productToAdd = {
            ...product,
            quantity: quantity
        };
        addToCart(productToAdd);
    };

    const isInWishlist = wishlist.find((w) => w._id === product?._id);

    const getStockStatus = () => {
        if (product.stock > 10) return { text: "In Stock", color: "#388e3c" };
        if (product.stock > 0) return { text: `Only ${product.stock} left`, color: "#ff9800" };
        return { text: "Out of Stock", color: "#f44336" };
    };

    const getDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="product-details-loading">
                <div className="spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    // ================= NO PRODUCT =================
    if (!product) {
        return (
            <div className="product-details-error">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="back-home-btn">Back to Home</Link>
            </div>
        );
    }

    const stockStatus = getStockStatus();

    // ================= UI =================
    return (
        <div className="product-details-container">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to={`/category/${product.category}`}>{product.category}</Link>
                <span>/</span>
                <span className="current">{product.name}</span>
            </div>

            <div className="product-details-wrapper">
                {/* ================= LEFT SIDE - IMAGES ================= */}
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img
                            src={`http://localhost:5000/${mainImage}`}
                            alt={product.name}
                            className="main-product-image"
                        />
                        {product.discount && (
                            <span className="discount-badge-large">{product.discount}% OFF</span>
                        )}
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="thumbnail-list">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail-item ${mainImage === img ? 'active' : ''}`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img
                                        src={`http://localhost:5000/${img}`}
                                        alt={`${product.name} view ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ================= RIGHT SIDE - PRODUCT INFO ================= */}
                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>

                    {/* Rating Section */}
                    <div className="rating-section">
                        <span className="rating-badge">
                            4.5 ★
                        </span>
                        <span className="rating-count">1,234 Ratings & 89 Reviews</span>
                    </div>

                    {/* Price Section */}
                    <div className="price-section">
                        <div className="current-price-large">₹{product.price.toLocaleString()}</div>
                        {product.originalPrice && (
                            <>
                                <div className="original-price-large">₹{product.originalPrice.toLocaleString()}</div>
                                <div className="discount-percent-large">
                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                                </div>
                            </>
                        )}
                    </div>

                    {/* Tax Info */}
                    <div className="tax-info">
                        Inclusive of all taxes
                        <span className="info-icon">ⓘ</span>
                    </div>

                    {/* Stock Status */}
                    <div className="stock-status">
                        <span style={{ color: stockStatus.color, fontWeight: "600" }}>
                            {stockStatus.text}
                        </span>
                    </div>

                    {/* Delivery Info */}
                    <div className="delivery-info">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                            <strong>Get it by {getDeliveryDate()}</strong>
                            <p>Free delivery on orders above ₹500</p>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    {product.stock > 0 && (
                        <div className="quantity-section">
                            <label>Quantity:</label>
                            <div className="quantity-selector">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                >
                                    +
                                </button>
                            </div>
                            <span className="stock-info">{product.stock} items available</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Add to Cart
                        </button>

                        <button
                            className="buy-now-btn"
                            onClick={() => {
                                handleAddToCart();
                                // Navigate to checkout
                            }}
                            disabled={product.stock === 0}
                        >
                            Buy Now
                        </button>

                        <button
                            className={`wishlist-btn-large ${isInWishlist ? 'active' : ''}`}
                            onClick={() => {
                                if (isInWishlist) {
                                    removeFromWishlist(product._id);
                                } else {
                                    addToWishlist(product);
                                }
                            }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>

                    {/* Offer Section */}
                    {/* <div className="offers-section">
                        <h4>Available Offers</h4>
                        <ul>
                            <li>
                                <span className="offer-icon">🏷️</span>
                                <span>Bank Offer: 10% off on HDFC Bank Credit Cards</span>
                            </li>
                            <li>
                                <span className="offer-icon">🚚</span>
                                <span>Free delivery on orders above ₹500</span>
                            </li>
                            <li>
                                <span className="offer-icon">🔄</span>
                                <span>7 days replacement policy with easy returns</span>
                            </li>
                        </ul>
                    </div> */}
                </div>

                {/* ================= SIDEBAR - SELLER INFO ================= */}
                {/* <div className="seller-info">
                    <div className="seller-card">
                        <h3>Selling Partner</h3>
                        <div className="seller-details">
                            <p><strong>ShopHub Retail</strong></p>
                            <p className="seller-rating">⭐ 4.8 (1,234 ratings)</p>
                        </div>
                        <div className="seller-policies">
                            <div className="policy">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <span>7 days replacement</span>
                            </div>
                            <div className="policy">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 12V8H4v4"></path>
                                    <path d="M12 4v4"></path>
                                    <path d="M3 12h18l-3 9H6z"></path>
                                </svg>
                                <span>GST invoice available</span>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* ================= PRODUCT DESCRIPTION SECTION ================= */}
            <div className="product-description-section">
                <h2>Product Description</h2>
                <div className="description-content">
                    <p>{product.description}</p>

                    {product.specifications && (
                        <div className="specifications">
                            <h3>Specifications</h3>
                            <table className="specs-table">
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className="spec-label">{key}</td>
                                        <td className="spec-value">{value}</td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ================= RELATED PRODUCTS (Optional) ================= */}
          
        </div>
    );
}

export default ProductDetails;