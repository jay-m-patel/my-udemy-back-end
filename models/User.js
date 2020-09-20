const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    isLoggedIn: {
        type: Boolean,
        required: true
    },
    isUploader: Boolean,
    paidPremium: Boolean,
    purchasedCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'courses'
        }
    ],
    uploadedCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'courses'
        }
    ]
})

const User = mongoose.model('users', userSchema)
module.exports = User