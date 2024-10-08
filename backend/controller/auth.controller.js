import User from "../model/user.model.js";
import bcrypt from 'bcryptjs';
import {generateTokenAndSetcookie} from '../lib/utils/generateToken.js'


export const getMe = async (req,res) =>{
    try{
        const user = await User.findById(req.user._id).select("-password")
        return res.status(200).json(user)

    }catch(error){
        console.log("Error from getMe controller",error.message);
        return res.status(500).json({error:"Internal server error"})
        
    }
}


export const signUp = async (req,res) =>{
   try{
    const {username,fullName,email,password} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({error:"Invalid email format"})
    }

    const existingUser = await User.findOne({username})
    if(existingUser){
        return res.status(400).json({error:"Username is already taken"})
    }

    const existingEmail = await User.findOne({email})
    if(existingEmail){
        return res.status(400).json({error:"Email is already taken"})
    }

    if(password.length<6){
        return res.status(400).json({error:"Password must have 6 characters at least"})
    }
    

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password,salt)

    const user = new User({
        username,
        fullName,
        email,
        password:hashedPassword
    })

    if(user){
        generateTokenAndSetcookie(user._id,res)
        await user.save()
        return res.status(201).json({
            _id : user.id,
            username : user.username,
            fullName : user.fullName,
            email : user.email,
            coverImg : user.coverImg,
            profileImg : user.profileImg,
            followers : user.followers,
            following : user.following
        })
    }else{
        return res.status(400).json({error:"Invalid user data"})
    }

   }catch(error){
    console.log("Error from signup controller",error.message);
    return res.status(500).json({error:"Internal server error"})
    
   }

}


export const login = async (req,res) =>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "" )
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid email or password"})
        }

        generateTokenAndSetcookie(user._id,res)
        return res.status(201).json({
            _id : user._id,
            fullName : user.fullName,
            username : user.username,
            email : user.email,
            followers : user.followers,
            following : user.following,
            coverImg : user.coverImg,
            profileImg : user.profileImg
        })
    
    }catch(error){
        console.log("Error from login controller",error.message);
        return res.status(500).json({error:"Internal server error"})
    }
}


export const logout = async (req,res) =>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully..."})
    }catch(error){
        console.log("Error from logout controller",error.message);
        return res.status(500).json({error:"Internal server error"})
        
    }
}



