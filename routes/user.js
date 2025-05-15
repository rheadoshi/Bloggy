const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/signin', (req, res) => {
  res.render('signin');
});

router.post('/signin', async (req, res) => {
  try {
      const { email, password } = req.body;
      const token = await User.authenticate_generateToken(email, password);
      
      if (token) {
          res.cookie("token", token).redirect('/'); // Redirect to homepage
      } else {
          res.render('signin', { error: 'Token not created' });
      }
  } catch (err) {
      console.error('Error during sign-in:', err);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/signup', (req, res) => {
    res.render('signup');
  });

  router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        await User.create({ name, email, password });
        res.redirect('/');
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;