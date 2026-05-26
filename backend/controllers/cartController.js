const Cart = require("../models/Cart");

exports.addToCart = async(req,res)=>{

    const {userId,productId,quantity} = req.body;

    let cart = await Cart.findOne({userId});

    if(!cart){

        cart = await Cart.create({
            userId,
            products:[{productId,quantity}]
        });

    }else{

        const item = cart.products.find(
            p=>p.productId === productId
        );

        if(item){
            item.quantity += quantity;
        }else{
            cart.products.push({productId,quantity});
        }

        await cart.save();
    }

    res.json(cart);
};