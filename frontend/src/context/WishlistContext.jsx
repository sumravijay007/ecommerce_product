import { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

function WishlistProvider({ children }) {

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem("wishlist");
        return saved ? JSON.parse(saved) : [];
    });

    // Save in localStorage
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    // Add to Wishlist
    const addToWishlist = (product) => {
        const exists = wishlist.find(item => item._id === product._id);

        if (!exists) {
            setWishlist([...wishlist, product]);
        }
    };

    // Remove from Wishlist
    const removeFromWishlist = (_id) => {
        setWishlist(wishlist.filter(item => item._id !== _id));
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export default WishlistProvider;