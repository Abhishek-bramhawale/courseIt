const JWT_ADMINSECRET=process.env.JWT_ADMINSECRET
const jwt= require("jsonwebtoken");

function adminMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    const decodedInfo= jwt.verify(token,JWT_ADMINSECRET);
    if(decodedInfo){
        req.userId=decodedInfo.userId;
        next();


}else{
    res.status(403).json({
        msg:"you are not logged in"
    })
}
}

module.exports={adminMiddleware:adminMiddleware }