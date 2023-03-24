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
            console.log('token split')
            //Verify the token against secret
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decoded)
            //Get user from the token payload
            req.user = await User.findById(decoded.id).select('-password')
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