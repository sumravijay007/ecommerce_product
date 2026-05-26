import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "./Cart.css";

function Cart() {
    const {
        cart,
        removeProduct,
        increaseQty,
        decreaseQty
    } = useContext(CartContext);
    
    const { addToWishlist } = useContext(WishlistContext);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // Calculate totals
    const subtotal = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    
    const shipping = subtotal > 500 ? 0 : 40;
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shipping + tax;

    const handleCheckout = () => {
        setCheckoutLoading(true);
        // Simulate checkout process
        setTimeout(() => {
            alert("Checkout functionality coming soon!");
            setCheckoutLoading(false);
        }, 1500);
    };

    const moveToWishlist = (item) => {
        addToWishlist(item);
        removeProduct(item._id);
    };

    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <div className="empty-cart-container">
                    <div className="empty-cart-icon">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </div>
                    <h2>Your cart is empty!</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <Link to="/" className="continue-shopping-btn">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            {/* Header */}
            <div className="cart-header">
                <Link to="/" className="back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Continue Shopping
                </Link>
                <h1>Shopping Cart</h1>
                <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
            </div>

            <div className="cart-layout">
                {/* Cart Items Section */}
                <div className="cart-items-section">
                    {cart.map((item) => (
                        <div className="cart-item" key={item._id}>
                            <div className="cart-item-image">
                                <img
                                    src={item.images?.[0] ? `http://localhost:5000/${item.images[0]}` : '/placeholder.png'}
                                    alt={item.name}
                                />
                            </div>
                            
                            <div className="cart-item-details">
                                <Link to={`/product/${item._id}`} className="cart-item-title">
                                    {item.name}
                                </Link>
                                
                                <div className="cart-item-meta">
                                    {item.brand && (
                                        <span className="cart-item-brand">Brand: {item.brand}</span>
                                    )}
                                    <div className="cart-item-stock">
                                        {item.stock > 0 ? (
                                            <span className="in-stock">In Stock</span>
                                        ) : (
                                            <span className="out-of-stock">Out of Stock</span>
                                        )}
                                    </div>
                                </div>

                                <div className="cart-item-price-section">
                                    <div className="cart-item-price">
                                        ₹{item.price.toLocaleString()}
                                    </div>
                                    {item.originalPrice && (
                                        <>
                                            <div className="cart-item-original-price">
                                                ₹{item.originalPrice.toLocaleString()}
                                            </div>
                                            <div className="cart-item-discount">
                                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="cart-item-actions">
                                    <div className="quantity-selector">
                                        <button
                                            onClick={() => decreaseQty(item._id)}
                                            disabled={item.quantity <= 1}
                                            className="qty-btn"
                                        >
                                            -
                                        </button>
                                        <span className="qty-number">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQty(item._id)}
                                            disabled={item.quantity >= item.stock}
                                            className="qty-btn"
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    <div className="action-buttons">
                                        <button
                                            className="move-to-wishlist-btn"
                                            onClick={() => moveToWishlist(item)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                            </svg>
                                            Move to Wishlist
                                        </button>
                                        
                                        <button
                                            className="remove-item-btn"
                                            onClick={() => removeProduct(item._id)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="cart-item-total">
                                <div className="item-total-label">Total</div>
                                <div className="item-total-price">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Coupon Section */}
                    <div className="coupon-section">
                        <h3>Apply Coupon</h3>
                        <div className="coupon-input-group">
                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                className="coupon-input"
                            />
                            <button className="apply-coupon-btn">
                                Apply
                            </button>
                        </div>
                        <div className="available-coupons">
                            <span>Available: </span>
                            <span className="coupon-tag">SAVE10</span>
                            <span className="coupon-tag">FREESHIP</span>
                        </div>
                    </div>
                </div>

                {/* Order Summary Section */}
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (5% GST)</span>
                            <span>₹{tax.toLocaleString()}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Total Amount</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="delivery-info">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                            <strong>Delivery in 3-5 days</strong>
                            <p>Free delivery on orders above ₹500</p>
                        </div>
                    </div>

                    <button 
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                    >
                        {checkoutLoading ? (
                            <>
                                <div className="spinner-small"></div>
                                Processing...
                            </>
                        ) : (
                            'Proceed to Checkout'
                        )}
                    </button>

                    <div className="secure-payment">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span>Secure Payment</span>
                    </div>
                </div>
            </div>

            {/* Recommended Products */}
            <div className="recommended-products">
                <h2>You May Also Like</h2>
                <div className="recommended-grid">
                    <p className="coming-soon">More recommendations coming soon...</p>
                </div>
            </div>
        </div>
    );
}

export default Cart;