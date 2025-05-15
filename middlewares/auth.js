const { verifyToken }  = require("../services/auth");

function checkAuth(cookieName){
  return (req,res,next) => {
    const token = req.cookies[cookieName];
    // console.log('Token:', token); -> verified
    if(!token){
        res.locals.user = null;
        req.user = null;
        return next();
    }

    try{
        // console.log('Decoding token...');
        const user = verifyToken(token);
        res.locals.user = user;
        req.user = user;
        // console.log('User1:', user);
    }catch(err){
        res.locals.user = null;
        req.user = null;
    }
    // console.log('User:', res.locals.user);
    return next();
}
}

module.exports = {
    checkAuth,
}