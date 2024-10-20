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



export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email})
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "" )
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid email or password"})
        }

        generateTokenAndSetcookie(user._id,res)
        return res.status(201).json({
            _id : user._id,
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            picturePath : user.picturePath,
            friends : user.friends,
            location : user.location,
            occupation : user.occupation
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



