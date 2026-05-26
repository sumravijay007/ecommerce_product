import { createContext, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {

    const [cart, setCart] = useState([]);

    // ADD TO CART

    const addToCart = (product) => {

        const exist = cart.find(
            (item) => item._id === product._id
        );

        if (exist) {

            const updatedCart = cart.map((item) =>
                item._id === product._id
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            );

            setCart(updatedCart);

        } else {

            setCart([
                ...cart,
                {
                    ...product,
                    quantity: 1
                }
            ]);

        }
    };

    // REMOVE PRODUCT

    const removeProduct = (id) => {

        const updatedCart = cart.filter(
            (item) => item._id !== id
        );

        setCart(updatedCart);
    };

    // INCREASE QUANTITY

    const increaseQty = (id) => {

        const updatedCart = cart.map((item) =>
            item._id === id
                ? {
                    ...item,
                    quantity: item.quantity + 1
                }
                : item
        );

        setCart(updatedCart);
    };

    // DECREASE QUANTITY

    const decreaseQty = (id) => {

        const updatedCart = cart.map((item) =>
            item._id === id
                ? {
                    ...item,
                    quantity:
                        item.quantity > 1
                            ? item.quantity - 1
                            : 1
                }
                : item
        );

        setCart(updatedCart);
    };

    return (

        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeProduct,
                increaseQty,
                decreaseQty
            }}
        >
            {children}
        </CartContext.Provider>

    );
}

export default CartProvider;