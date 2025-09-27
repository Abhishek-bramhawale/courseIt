const jwt=require("jsonwebtoken")
const JWT_SECRET_USER=process.env.JWT_SECRET_USER

function userMiddleware(req,res,next){
    const token=req.headers.authorization;
    const decodedInfo=jwt.verify(token,JWT_SECRET_USER);
    if(decodedInfo){
        req.userId=decodedInfo.id
        next();
    }else{
        res.status(403).json({
            msg:"you arent logged in"
        })
    }
}

module.exports = { userMiddleware };