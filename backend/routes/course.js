const {Router}=require('express');
const courseRouter= Router();
const {userMiddleware}= require("../middlewares/user");
const { purchaseModel, courseModel } = require('../db');

courseRouter.post("/purchase",userMiddleware,async function(req,res){ //user purchasing course
    const userId= req.userId;
    const courseId= req.body.courseId

    const purchase= await purchaseModel.create({
        userId:userId,
        courseId:courseId

    })
    res.json({
        msg:"successfully bought course"
    })
})

courseRouter.get("/preview",async function(req,res){  //seeing all available courses

    const courses= await courseModel.find({});

    res.json({
        courses
    })
})   


module.exports=courseRouter;
