const express = require('express')
const router = express.Router()

const multer = require('./middlewares/multer')


const { createPaymentIntent, updatePaidStatus, upload } = require('./controllers/appControllers')
const auth = require('./middlewares/auth')

router.post("/create-payment-intent", auth, createPaymentIntent);

router.post("/updatePaidStatus", auth, updatePaidStatus)

router.post("/upload", multer.array('upload'), auth, upload)

module.exports = router