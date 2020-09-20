const dotenv = require('dotenv')
dotenv.config()

require('./db')
const express = require('express')
const cors = require('cors')

const userRoutes = require('./userRoutes')
const appRoutes = require('./appRoutes')

const app = express()

const whitelist = [
    'https://my-udemy.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
]

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions))

app.use(express.json())

app.use(userRoutes)
app.use(appRoutes)

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`server on ${port}`))