require('dotenv').config()
const express = require('express')
const sequelize = require('./db.js')
const router = require('./router/index')
const errorHandler = require(`./middleware/errorHandlingMiddleware`)
const path = require('path')
const cors = require(`cors`)
const fileUpload = require(`express-fileupload`)

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(errorHandler)
app.use(fileUpload({}))
app.use('/', router)

const start = async () =>{
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

    }catch (e){
        console.log(e)
    }
}

start()