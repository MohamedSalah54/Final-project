import bcrypt from "bcryptjs/dist/bcrypt.js";
import User from "../model/user.model.js";
import {v2 as cloudinary} from 'cloudinary'

export const getUserProfile = async (req,res) =>{
    try{
        const {username} = req.params;
        const user = await User.findOne({username}).select("-password")
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        return res.status(200).json(user)
    }catch(error){
        console.log("Error from getUserProfile controller",error.message);
        return res.status(500).json({error:"Internal server error"})
        
    }
}

export const getSuggestedUser = async (req,res) =>{
    try{
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("following")
        const users = await User.aggregate([
            {$match :{
                _id:{$ne:userId}
            }},
            {$sample:{
                size:10
            }}
        ])

        const filterdUsers = users.filter(user=>!usersFollowedByMe.following.includes(user._id))
        const suggestedUsers = filterdUsers.slice(0,4)
        suggestedUsers.forEach(user=>user.password=null)
        return res.status(200).json(suggestedUsers)
    }catch(error){
        console.log("Error from getSuggestedUser controller",error.message);
        return res.status(500).json({error:"Internal server error"})
        
    }
}

export const updateUser = async (req,res) =>{
    try{
        const {username , email , fullName , newPassword , oldPassword , link , bio } = req.body;
        let {coverImg , profileImg} = req.body;
        const userId = req.user._id;
        
        let  user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"User not found"})
        }

        if((oldPassword && !newPassword) || (!oldPassword && newPassword)){
            return res.status(400).json({error:"You must provid both old password and new password"})
        }

        if(oldPassword && newPassword){
            const isMatch = await bcrypt.compare(oldPassword,user.password)
            if(!isMatch){
                return res.status(400).json({error:"The old password is not correct"})
            }
            if(newPassword.length < 6){
                return res.status(400).json({error:"Password must have 6 characters at least"})
            }
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword,salt)
        }

        if(coverImg){
            if(user.coverImg){
                 await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }
            const uploeadedResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploeadedResponse.secure_url
        }

        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploeadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploeadedResponse.secure_url
        }

        user.username = username || user.username,
        user.fullName = fullName || user.fullName,
        user.email = email || user.email,
        user.coverImg = coverImg || user.coverImg,
        user.profileImg = profileImg || user.profileImg,
        user.bio = bio || user.bio,
        user.link = link || user.link,

        user = await user.save()
        user.password = null
        return res.status(200).json(user)
    }catch(error){
        console.log("Error from updateUser controller",error.message);
        return res.status(500).json({error:"Internal server error"})
        
    }
}