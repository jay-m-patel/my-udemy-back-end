const multer = require("multer")

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    console.log('multer filefiter file', file)
    if(
        (file.mimetype == 'image/jpg' || 
        file.mimetype == 'image/jpeg' || 
        file.mimetype == 'image/png' || 
        file.mimetype == 'image/gif' || 
        file.mimetype == 'video/mp4' || 
        file.mimetype == 'video/m4a' || 
        file.mimetype == 'video/avi' || 
        file.mimetype == 'video/mkv' || 
        file.mimetype == 'video/mov' || 
        file.mimetype == 'video/wmv' || 
        file.mimetype == 'video/flv' || 
        file.mimetype == 'video/webm') 
        // && file.size < 10485760 
    ) cb(null, true)
    else {
        console.log(file.mimetype, "mimetype error")
        cb({name: "mimetype error"})
    }
    
}


module.exports =  multer({
    storage: storage,
    fileFilter: fileFilter
})