require("dotenv").config();
const mongoose= require("mongoose")

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error(" MongoDB connection error:", err));
const Schema=mongoose.Schema;
const objectId=mongoose.ObjectId;

const userSchema= new Schema({
    email: {type:String,unique:true},
    password: String,
    firstName:String,
    lastName:String
}) 

const courseSchema= new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:objectId
})

const adminSchema=new Schema({
    email: {type:String,unique:true},
    password: String,
    firstName:String,
    lastName:String
})

const purchaseSchema=new Schema({
    userId:objectId,
    courseId:objectId
})

const userModel= mongoose.model("user", userSchema);
const adminModel= mongoose.model("admin", adminSchema);
const courseModel= mongoose.model("course", courseSchema);
const purchaseModel= mongoose.model("purchase", purchaseSchema);

module.exports={
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}