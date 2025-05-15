const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Blog } = require('../models/blog');
const  Comment  = require('../models/comment');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(req.user._id)
    const dir = `./public/uploads/${req.user._id}/blog/`;
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, path.resolve(dir))
  },
  filename: function (req, file, cb) {
    const uniquePreffix = Date.now()
    cb(null, uniquePreffix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })


router.post('/', upload.single('coverImage'), async (req, res) => {
    const blog = await Blog.create({
        title: req.body.title,
        content: req.body.content,
        coverImage: `/uploads/${req.user._id}/blog/${req.file.filename}`,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${blog._id}`);
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({ blog: req.params.id }).populate('createdBy');
  return res.render('blog', { 
    user: req.user,
    blog,
    comments,
  });
})

router.post('/comment/:id', async(req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    createdBy: req.user._id,
    blog: req.params.id
  })
  return res.redirect(`/blog/${req.params.id}`);
})

router.get('/add-new', (req, res) => {
    return res.render('addBlog', { user: req.user });
})
module.exports = router