const cloudinary = require('./cloudinaryConfig')
const datauri = require('./bufferToString')

module.exports = async (originalname, buffer, fileType) => {
    try {
        const savedImg = await cloudinary.uploader.upload(datauri(originalname, buffer), {
            resource_type: fileType
        })
        return savedImg
    } catch(err) {
        console.log(err, 'cloudinaryUpload err')
        throw new Error("UPLOAD ERROR")
        // return {
        //     errorName: err.name,
        //     errorMsg: err.message,
        //     error: err
        // }
    }
}