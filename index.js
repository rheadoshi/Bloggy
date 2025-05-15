const express = require('express')
const path = require('path')
const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { checkAuth } = require('./middlewares/auth')
require('dotenv').config();
const { Blog } = require('./models/blog')
const app = express()
const PORT = 8000

mongoose.connect('mongodb://127.0.0.1:27017/Bloggy')
.then(()=>console.log('MongoDB connected'))
.catch((err)=>console.log(`MongoDB connection error: ${err}`))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve('./public')))
app.use(cookieParser())
app.use(checkAuth('token'))
app.use(express.json())

app.get('/', async (req, res)=>{
    const allBlogs = await Blog.find({})
    // console.log(allBlogs)
    return res.render('home', {
        user: req.user,
        blogs: allBlogs
    })
})

app.get('/logout', (req, res)=>{
    res.clearCookie('token').redirect('/')
})

app.use('/user', userRouter)
app.use('/blog', blogRouter)

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`))