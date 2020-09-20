
const stripe = require("stripe")(`${process.env.STRIPE_SECRETE_KEY}`);
const User = require('./../models/User')
const Course = require('./../models/Course')
const cloudinaryUpload = require('./../utilities/cloudinaryUpload')


module.exports.createPaymentIntent = async (req, res) => {
    try {
        const { payable } = req.body
        console.log('payable', payable)
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
          amount: payable,
          currency: "inr"
        });
        
        const respone = {
            clientSecret: paymentIntent.client_secret,
        }
        res.send(respone);

    } catch(err) {
        console.log('error!', err.name, err.message, err)
        res.json({
            errName: err.name,
            errMessage: err.message, 
            err
        })
    }
}

module.exports.updatePaidStatus = async (req, res) => {
    try {
        console.log(req.body)
        const { paidAmount, paymentType, uploaderId, purchaserId, courseId } = req.body
        console.log('courseId', courseId)
        const user = req.user

        if(paymentType === "premium") {
            // const user = await User.findById(uploaderId)
            user.paidPremium = true
            console.log('paid user', user)
        } else {
            const purchasedCourses = [...user.purchasedCourses]
            purchasedCourses.unshift(courseId)
            user.purchasedCourses = purchasedCourses
        }
        const savedUser = await user.save()

        res.json({...savedUser._doc})
    } catch(err) {
        console.log('error!', err.name, err.message, err)
        res.json({
            errName: err.name,
            errMessage: err.message, 
            err
        })   
    }
}


module.exports.upload = async (req, res) => {
    try {
        console.log('upload req.body',req.body)
        console.log('upload req.files', req.files)
        console.log('upload req.user', req.user)

        const uploadedFunc = async files => {
            let uploadedUrl = []
            for(let i = 0; i < files.length; i++) {
                if(files[i].size > 52428800) throw new Error("HUGE FILE") 
                const fileType = files[i].mimetype.split('/')[0]
                const uploadedFile = await cloudinaryUpload(files[i].originalname, files[i].buffer, fileType)
                const len = uploadedUrl.push({url: uploadedFile.secure_url})
                if(len === files.length) return uploadedUrl
            }
        }
        const uploadedUrl = await uploadedFunc(req.files)

        const newCourse = new Course({
            courseName: req.body.title,
            uploadedBby: req.user._id,
            keywords: req.body.keywords.split(' '),
            contentUrls: uploadedUrl.map(urlObj => urlObj.url),
            details: req.body.details,
            price: Number(req.body.price)
        })

        const savedCourse = await newCourse.save()

        req.user.uploadedCourses.unshift(savedCourse._id)

        const savedUser = await req.user.save()

        const allCourses = await Course.find()

        res.json({...savedUser._doc , allCourses})
    } catch(err) {
        console.log('error!', err.name, err.message, err)
        res.json({
            errName: err.name,
            errMessage: err.message, 
            err
        })   
    }
}