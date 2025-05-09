function checkAuth(cookieName){
  return (req,res,next) => {
    const token = req.cookies[cookieName];
    if(!token){
        return next();
    }

    try{
        const user = verifyToken(token);
        req.user = user;
    }catch(err){}
    return next();
}
}

module.exports = {
    checkAuth,
}