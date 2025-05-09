const express = require('express')
const path = require('path')
const userRouter = require('./routes/user')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { checkAuth } = require('./middlewares/auth')
require('dotenv').config();

const app = express()
const PORT = 8000

mongoose.connect('mongodb://127.0.0.1:27017/Bloggy')
.then(()=>console.log('MongoDB connected'))
.catch((err)=>console.log(`MongoDB connection error: ${err}`))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(checkAuth('token'))
app.use(express.json())

app.get('/', (req, res)=>{
    return res.render('home', {
        user: req.user,
    })
})

app.get('/logout', (req, res)=>{
    res.clearCookie('token').redirect('/')
})

app.use('/user', userRouter)

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`))