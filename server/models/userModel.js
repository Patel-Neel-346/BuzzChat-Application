import mongoose from "mongoose";
import {genSalt, hash} from "bcrypt"
const UserModel=mongoose.Schema({
    Email:{
        type:String,
        required:[true,"Email Is Required!"],
        
    },
    Password:{
        type:String,
        required:[true,"Password Is Required!"],
    },
    firstName:{
        type:String,
        required:false,
    },
    lastName:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        required:false,
    },
    color:{
        type:String,
        required:false,
        
    },
    profileSetup:{
        type:Boolean,
        default:false,
    },
});

UserModel.pre("save",async function save(next){
    const salt=await genSalt();
    console.log(salt);
    console.log(this.Password);
    this.Password = await hash(this.Password,salt);
    next();
});

   

const USER=mongoose.model("Users",UserModel);

export default USER;