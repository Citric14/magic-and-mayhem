const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { User } = require('../models/user')

const protect = asyncHandler(async (req, res, next) => {

    let token
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            //Get token from header by removing the bearer
            token = req.headers.authorization.split(' ')[1]
            //Verify the token against secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //Get user from the token payload
            req.user = await User.findById(decoded.user_uid).select('-password')
            //calls next piece of middleware
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Authorization needed.')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token.')
    }
})


module.exports = { protect }