const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./../models/User')
const Course = require('./../models/Course')


module.exports.register = async (req, res) => {
    try {

        const { name, email, password, isUploader } = req.body

        const hashedPassword = await bcryptjs.hash(password, 10)
        const token = jwt.sign({email: email}, process.env.JWT_PRIVATE_KEY)

        const user = new User({
            name: name,
            email: email,
            hashedPassword: hashedPassword,
            isUploader: isUploader,
            isLoggedIn: true,
            paidPremium: false
        })

        const savedUser = await user.save()
        console.log(savedUser)
        
        res.json({...savedUser._doc, token})
    } catch(err) {
        console.log(err.name, err.message, err)
        res.json({
            errName: err.name,
            errMessage: err.message, 
            err
        })
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({email: email})

        if(user) {
            if(! await bcryptjs.compare(password, user.hashedPassword)) throw new Error('INVALID DATA')
            else {
                user.isLoggedIn = true
                const token = jwt.sign({email: email}, process.env.JWT_PRIVATE_KEY)
                const savedUser = await user.save()
                console.log(savedUser)

                res.json({...savedUser._doc, token})
            }
        } else {
            throw new Error('INVALID DATA')
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

module.exports.logout = async (req, res) => {
    try {
        req.user.isLoggedIn = false
        const savedUser = await req.user.save()

        if(savedUser)
        res.json({isLoggedIn: false})
    } catch(err) {
        console.log(err.name, err.message, err)
        res.json({
            errName: err.name,
            errMessage: err.message, 
            err
        })
    }
}

module.exports.checkLoggedIn = async (req, res) => {
    try {
        const allCourses = await Course.find()
        const authorization = req.headers.authorization
        if(authorization) {
            console.log(authorization)
            const token = authorization.split(" ")[1]   
            console.log(token) 
            const { email } = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
            if(email) {
                const user = await User.findOne({email})
                if(user && user.isLoggedIn) {
                    return res.json({
                        ...user._doc,
                        allCourses
                    })
                } else {
                    res.json({isLoggedIn: false, allCourses})
                }
            } else {
                res.json({isLoggedIn: false, allCourses})
            }
        } else {
            res.json({isLoggedIn: false, allCourses})
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