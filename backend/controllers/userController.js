const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async(req,res)=>{

    const {name,email,password} = req.body;

    const hashPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        name,
        email,
        password:hashPassword
    });

    res.json(user);
};

exports.login = async(req,res)=>{

    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.json("User Not Found");
    }

    const match = await bcrypt.compare(password,user.password);

    if(!match){
        return res.json("Wrong Password");
    }

    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET
    );

    res.json({
        token,
        user
    });
};