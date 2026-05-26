import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
    // ================= STATES =================
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [discount, setDiscount] = useState("");
    const [brand, setBrand] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // ================= CATEGORIES =================
    const categories = [
        "Electronics",
        "Clothing",
        "Books",
        "Home & Kitchen",
        "Beauty & Personal Care",
        "Sports & Outdoors",
        "Toys & Games",
        "Automotive",
        "Health & Wellness",
        "Other"
    ];

    // ================= IMAGE CHANGE =================
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate file sizes and types
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

            if (!isValidType) {
                setMessage("Only image files are allowed", "error");
            }
            if (!isValidSize) {
                setMessage("Image size should be less than 5MB", "error");
            }

            return isValidType && isValidSize;
        });

        setImages(validFiles);
    };

    // ================= REMOVE IMAGE =================
    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (images.length === 0) {
            setMessage("Please select at least one product image", "error");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("stock", stock);

            if (originalPrice) formData.append("originalPrice", originalPrice);
            if (discount) formData.append("discount", discount);
            if (brand) formData.append("brand", brand);

            images.forEach((image) => {
                formData.append("images", image);
            });

            const res = await axios.post(
                "https://ecommerce-product-yww7.onrender.com/api/products",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log(res.data);
            setMessage("Product added successfully!", "success");

            // Reset form
            setName("");
            setPrice("");
            setOriginalPrice("");
            setCategory("");
            setDescription("");
            setStock("");
            setDiscount("");
            setBrand("");
            setImages([]);

            // Reset file input
            const fileInput = document.getElementById('image-input');
            if (fileInput) fileInput.value = '';

            setLoading(false);

            // Scroll to top
            window.scrollTo(0, 0);
        }
        catch (err) {
            console.log(err);
            setMessage(err.response?.data?.message || "Error adding product. Please try again.", "error");
            setLoading(false);
        }
    };

    // ================= SET MESSAGE WITH TYPE =================
    const setMessageWithType = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 5000);
    };

    // ================= UI =================
    return (
        <div className="add-product-container">
            {/* Header */}
            <div className="add-product-header">
                <Link to="/" className="back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back to Home
                </Link>
                <h1>Add New Product</h1>
                <p>Fill in the details below to add a new product to your store</p>
            </div>

            {/* Message Alert */}
            {message && (
                <div className={`alert alert-${messageType}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {messageType === "success" ? (
                            <polyline points="20 6 9 17 4 12"></polyline>
                        ) : (
                            <circle cx="12" cy="12" r="10"></circle>
                        )}
                    </svg>
                    <span>{message}</span>
                    <button className="alert-close" onClick={() => setMessage("")}>×</button>
                </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                    {/* Left Column - Basic Info */}
                    <div className="form-section">
                        <h2>Basic Information</h2>

                        <div className="form-group">
                            <label htmlFor="name">
                                Product Name <span className="required">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="e.g., Apple iPhone 15 Pro Max"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">
                                    Selling Price (₹) <span className="required">*</span>
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    placeholder="49999"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="originalPrice">
                                    Original Price (₹)
                                </label>
                                <input
                                    id="originalPrice"
                                    type="number"
                                    placeholder="69999"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="category">
                                    Category <span className="required">*</span>
                                </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="brand">
                                    Brand
                                </label>
                                <input
                                    id="brand"
                                    type="text"
                                    placeholder="e.g., Apple, Nike, Sony"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="stock">
                                    Stock Quantity <span className="required">*</span>
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    placeholder="100"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="discount">
                                    Discount (%)
                                </label>
                                <input
                                    id="discount"
                                    type="number"
                                    placeholder="10"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                Description <span className="required">*</span>
                            </label>
                            <textarea
                                id="description"
                                placeholder="Detailed description of the product..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="6"
                                required
                                className="form-textarea"
                            />
                            <small className="form-hint">
                                {description.length} characters (recommended: 100-500)
                            </small>
                        </div>
                    </div>

                    {/* Right Column - Images */}
                    <div className="form-section">
                        <h2>Product Images</h2>

                        <div className="image-upload-area">
                            <label htmlFor="image-input" className="image-upload-label">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                <span>Click to upload images</span>
                                <small>PNG, JPG, JPEG up to 5MB each</small>
                            </label>
                            <input
                                id="image-input"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Image Preview Grid */}
                        {images.length > 0 && (
                            <div className="image-preview-section">
                                <h3>Image Preview ({images.length} files)</h3>
                                <div className="image-preview-grid">
                                    {images.map((img, index) => (
                                        <div key={index} className="image-preview-item">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`Preview ${index + 1}`}
                                            />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => removeImage(index)}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                            <span className="image-number">{index + 1}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="image-hint">
                                    First image will be used as the main product image
                                </p>
                            </div>
                        )}

                        {/* Tips Card */}
                        <div className="tips-card">
                            <h3>💡 Tips for better results</h3>
                            <ul>
                                <li>Use high-quality images (minimum 800x800 pixels)</li>
                                <li>Show product from different angles</li>
                                <li>Include lifestyle images if possible</li>
                                <li>Keep description detailed but concise</li>
                                <li>Set competitive pricing for better sales</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => {
                            setName("");
                            setPrice("");
                            setOriginalPrice("");
                            setCategory("");
                            setDescription("");
                            setStock("");
                            setDiscount("");
                            setBrand("");
                            setImages([]);
                            const fileInput = document.getElementById('image-input');
                            if (fileInput) fileInput.value = '';
                        }}
                        className="btn btn-secondary"
                    >
                        Clear Form
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner-small"></div>
                                Adding Product...
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                                Add Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProduct;