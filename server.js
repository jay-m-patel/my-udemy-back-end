const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/', (req, res) => {
    res.json({Ok: true})
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`server on ${port}`))