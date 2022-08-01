const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc     Register new user
// @route    POST /api/user
// @access   Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please fill all fields!');
    }
    //check if user already exists
    const userExists = await User.findOne( {email} );
    if(userExists) {
        res.status(400)
        throw new Error('User already exists!');
    }

    //hash pw
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) { //if user created
        console.log(req.body);
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }

   // res.json({ message: 'Register user' });
})

// @desc     Authenticate a user
// @route    POST /api/user/login
// @access   Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(user && (await bcrypt.compare(password, user.password))){
        console.log("successfull login");
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error('Credentials are not valid');
    }
    //res.json({ message: 'Login user' });
})

// @desc     Get user data
// @route    GET /api/users/me
// @access   Private
const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email } = await User.findById(req.user.id);
    //req.user is whatever user has authenticated!

    res.status(200).json({
        id: _id,
        name,
        email
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}