import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";


// login user
const loginUser = async(req,res) => {
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email});

        if(!user)
        {
            return res.json({success:false,message:"User Does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch)
        {
            return res.json({success:false,message:"Invalid Password"})
        }

        const token = createToken(user._id);
        res.json({success:true,token})
    }
    catch(error)
    {
        console.log(error);
        return res.json({success:false,message:"Error"})

    }
}

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}
//register user
const registerUser = async(req,res) => {
    const {name,password,email} = req.body;
    try{
        // Checking is user already exist
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"User Already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email))
        {
            return res.json({success:false,message:"Invalid Email"})
        }

        if(password.length<8)
        {
            return res.json({success:false,message:"Password must be at least 8 characters long"})
        }

        //hashing user password
        const hashing = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,hashing);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,message:"User created successfully",token})

    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,message:"Error"})

    }
}

export {loginUser,registerUser};