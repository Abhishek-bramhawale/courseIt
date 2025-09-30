const {Router}=require("express");
const adminRouter= Router();
const bcrypt= require("bcrypt");
const JWT_ADMINSECRET="admin213"
const jwt= require("jsonwebtoken");
const {z}=require("zod")
const {adminMiddleware}=require("../middlewares/admin");

const {adminModel, userModel, courseModel}=require("../db")

adminRouter.post("/signUp",async function(req,res){
    const requiredBody=z.object({
        email: z.string().min(3).max(20).email(),
        password: z.string().min(3).max(20),
        firstName: z.string().min(3).max(20),
        lastName: z.string().min(3).max(20)
    })

    const parsedWithSuccess= requiredBody.safeParse(req.body);
    if(!parsedWithSuccess.success){
        return res.json({"msg":"invalid format"})
    }

    try{const {email, password, firstName, lastName}= req.body;
    const hashedPassword= await bcrypt.hash(password,5);
    await adminModel.create({
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

adminRouter.post("/signIn", async function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    const responce=await adminModel.findOne({
        email:email 
    })
    if(!responce){
        res.send("user doesnt exist")
    }

    const passwordMatch= await bcrypt.compare(password,responce.password);

     if (!passwordMatch) {
            return res.status(401).json({ msg: "Incorrect password" });
        }
        const token=jwt.sign({
            id:responce._id
        },JWT_ADMINSECRET)
        
    res.send(token)
    

    

})

adminRouter.post("/course",adminMiddleware,async function(req,res){  //adding a course
    const adminId=req.userId;

    const {title, description, imageURL, price}= req.body;
    const course= await courseModel.create({
        title, description, imageURL,price, creatorId:adminId
    })

    res.json({
        msg:"course created",
        courseId:course._id
    })

})

adminRouter.put("/course",adminMiddleware,async function(req,res){  //course edit
    const adminId=req.userId;
    const {courseId, title, description, imageURL, price}= req.body;
    
    const course= await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title, description, imageURL,price
    })

    res.json({
        msg:"course updated",
        courseId:courseId
    })
})

adminRouter.get("/courses/bulk",adminMiddleware,async function(req,res){ //see all courses
    const adminId= req.userId;
    const courses=await courseModel.find({
        creatorId:adminId
    })

    res.json(courses)
})

module.exports=adminRouter


