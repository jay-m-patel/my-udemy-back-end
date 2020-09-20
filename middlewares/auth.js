const jwt = require('jsonwebtoken')
const User = require('./../models/User')

module.exports = async (req, res, next) => {
    try {
        // console.log('auth headers', req.headers)
        // console.log('auth body', req.body)
        const authorization = req.headers.authorization
        if(authorization) {
            const token = authorization.split(" ")[1]    
            const { email } = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
            if(email) {
                const user = await User.findOne({email})
                if(user.isLoggedIn) {
                    req.user = user
                    return next()
                }  else {
                    console.log('not logged in')
                    throw new Error('UNAUTHENTICATED')
                }
            }
        } else {
            console.log('no authorization')
            throw new Error('UNAUTHENTICATED')
        }
    
    } catch(err) {
        console.log(err.name, err.message, err)
        res.json({
            errName: err.name,
            errMessage: err.message, 
            err
        })
    }
}

