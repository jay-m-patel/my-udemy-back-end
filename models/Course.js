const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    uploadedBby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    keywords: [String],
    contentUrls: [String],
    details: String,
    price: Number
})

const Course = mongoose.model('courses', courseSchema)
module.exports = Course