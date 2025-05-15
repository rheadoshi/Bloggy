const { Schema, model } = require('mongoose');
const crypto = require('crypto');

const { generateToken } = require('../services/auth');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
    email: {
    type: String,
    required: true,
    unique: true,
    },
    password: {
    type: String,
    required: true,
    },
    profilePicture: {
    type: String,
    default: '/images/default_image.png',
    },
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    },
    salt: {
    type: String,
    },
},
{
  timestamps: true,
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return;
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.createHmac('sha256', salt)
    .update(this.password)
    .digest('hex');

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static('authenticate_generateToken', async function (email, password) {
  const user = await this.findOne({ email })
  if (!user) {
      throw new Error('User not found');
    }
    const hashedPassword = user.password;
    const userProvidedPassword = crypto.createHmac('sha256', user.salt)
      .update(password)
      .digest('hex');
    
    if (hashedPassword !== userProvidedPassword) {
      throw new Error('Invalid password');
    }
      const token = generateToken(user);
      return token
    }
)

const User = model('User', userSchema);
module.exports = User;

