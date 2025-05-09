const jwt = require('jsonwebtoken');
const secretKey = '123'

function generateToken(user) {
    const payload = {
        _id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role
    };
    return jwt.sign(payload, secretKey);
}

function verifyToken(token) {
    try {
        const user = jwt.verify(token, secretKey);
        // console.log('Decoded user:', user);
        return user;
    } catch (err) {
        throw new Error('Invalid token', err);
    }
}

module.exports = {
    generateToken,
    verifyToken,
};