import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required :true,
        unique:true
    },
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            default:[],
            ref:"User"
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            default:[],
            ref:"User"
        }
    ],
    coverImg:{
        type:String,
        default:""
    },
    profileImg:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    link:{
        type:String,
        default:""
    },
    likedPosts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            default:[]
        }
    ]


},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User;