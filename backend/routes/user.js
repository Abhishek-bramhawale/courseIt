const {Router }= require("express");
const userRouter= Router();
const {userModel, courseModel, purchaseModel}=require("../db")
const bcrypt= require("bcrypt");
const {z} =require("zod")
const jwt=require("jsonwebtoken")
const JWT_SECRET_USER="dsjff"
const {userMiddleware}=require("../middlewares/user")

userRouter.post("/signUp", async function(req,res){
    const requiredBody=z.object({
        email: z.string().min(3).max(20).email(),
        password: z.string().min(3).max(20),
        firstName: z.string().min(3).max(20),
        lastName: z.string().min(3).max(20)
    })

    const parsedWithSuccess= requiredBody.safeParse(req.body);
    if(!parsedWithSuccess.success){
        res.json({"msg":"invalid format"})
    }

    try{const {email, password, firstName, lastName}= req.body;
    const hashedPassword= await bcrypt.hash(password,5);
    await userModel.create({
        email,
        password:hashedPassword,
        firstName,
        lastName
    })
    res.json({
        msg:"user sign up"
    })}catch(e){
        res.send("error occured")
    }
})

userRouter.post("/signIn",async function(req,res){
    const{ email,password} =req.body;
    const user=await userModel.findOne({
        email:email
    })
    if(!user){
        return res.status(403).json({
            msg:"user not exist"
        })
    }
    const passwordMatch= bcrypt.compare(password,user.password);
    if(!passwordMatch){
        return res.status(403).json({
            msg:"wrong password"
        })
    }
    const token=jwt.sign({
        id: user._id
    },JWT_SECRET_USER)

    res.send(token)

})

userRouter.get("/purchases",userMiddleware, async function(req,res){ //user purchased courses

    const userId=req.userId;

    const purchases=await purchaseModel.find({
        userId
    })

    const coursesData= await courseModel.find({
        _id: {$in: purchases.map(x=>x.courseId)}
    })
    res.json({
        purchases,
        coursesData
    })
})


module.exports=userRouter