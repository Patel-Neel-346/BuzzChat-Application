import { compare } from "bcrypt";
import USER from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {renameSync,unlinkSync} from "fs"
// verification for JWT Token Exprice Date 
const MaxDate=3 * 24 * 60 * 60 * 1000; // validate for 3 days;

// create a token for Registor user
const createToken=(Email,userId)=>{
return jwt.sign({Email,userId},process.env.JWT_KEY,{expiresIn:MaxDate});
// console.log({token});
// return token;
}

export const registor=async (req,res,next)=>{

    try{
        //get data from frontend body
        const {Email,Password}=req.body;
        console.log({Email,Password});
        // if user do not enter email or password
         if(!Email || !Password)
         {
             return res.status(400).send("Email & Password is required!");
         }

        const user=await USER.create({Email,Password});
        //create a cookie that store user data with json webtoken
        res.cookie("jwt",createToken(Email,user.id),{
            MaxDate,
            secure:true,
            sameSite:"None",
        });

        //return data as json format 
        return res.status(201).json({
            user:{
                id:user.id,
                Email:user.Email,
                profileSetup:user.profileSetup,
            },
        })
    }
    catch(err){
        console.log({err});
        return res.status(500).send("Internel Server Error");
    }
}

export const LoginController=async(req,res,next)=>{
    try{
        //get data from frontend body
        const {Email,Password}=req.body;
        console.log({Email,Password});
        // if user do not enter email or password
         if(!Email || !Password)
         {
             return res.status(400).send("Email & Password is required!");
         }

        //get data from user by Provide Email

        const user=await USER.findOne({Email});
        //check if user exist or not
        if(!user)
        {
             return res.status(404).send("User With Given Email Is not Exist!");
        }

        //campare password with given password by user
        const auth=await compare(Password,user.Password)
        
        //check if password is correct or not
        if(!auth)
        {
            return res.status(400).send("Password Is Incorrect!");
        }

   

        //create a cookie that store user data with json webtoken
        res.cookie("jwt",createToken(Email,user.id),{
            MaxDate,
            secure:true,
            sameSite:"None",
        });

        //return data as json format 
        return res.status(200).json({
            user:{
                id:user.id,
                Email:user.Email,
                profileSetup:user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color,
            },
        })
    }
    catch(err){
        console.log({err});
        return res.status(500).send("Internel Server Error");
    }
}

 export const GetUserInfo=async(req,res,next)=>{
    try{
       
        const user=await USER.findById(req.userId);
        if(!user)
        {
            return res.status(404).send("User With the given id not Found")
        }


        //return data as json format 
        return res.status(200).json({
            
                id:user.id,
                Email:user.Email,
                profileSetup:user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color,
            
        })
    }
    catch(err){
        console.log({err});
        return res.status(500).send("Internel Server Error");
    }
}

export const UpdateUserDataController = async(req,res,next)=>{
    try{
       const {userId} =req;
       const {firstName,lastName,color}=req.body;

       if(!firstName || !lastName || color === undefined)
        {
            return res.status(400).send("FirstName LastName And Color is Required!!")
        }

       const user=await USER.findByIdAndUpdate(userId,{
        firstName,
        lastName,
        color,
        profileSetup:true,
       },
       {
        new:true,
        runValidators:true
        }
    )

        // const user=await USER.findById(req.userId);
        if(!user)
        {
            return res.status(404).send("User With the given Data is  not Found!")
        }


        //return data as json format 
        return res.status(200).json({
            
                id:user.id,
                Email:user.Email,
                profileSetup:user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color,
            
        })
    }
    catch(err){
        console.log({err});
        return res.status(500).send("Internel Server Error");
    }
}

export const addProfileImageController =async (req,res,next)=>{
    try{
       
        if(!req.file)
        {
            return res.status(400).send("File is Required!");
        }

        console.log(req.file);

        const date=Date.now();
        let fileName="uploads/profiles/"+date+req.file.originalname;
        renameSync(req.file.path,fileName);

        const user=await USER.findByIdAndUpdate(
            req.userId,
            {image:fileName},
            {new:true,runValidators:true}
        );

         //return data as json format 
         return res.status(200).json({
             
                
                 image:user.image,
                
             
         })
     }
     catch(err){
         console.log({err});
         return res.status(500).send("Internel Server Error");
     }
}

export const removeProfileImageController =async (req,res,next)=>{
    try{
        const {userId} =req;
        const user= await USER.findById(userId);

        if(!user)
        {
            return res.status(404).send("user not found!");
        }

        if(user.image)
        {
            unlinkSync(user.image);
        }
        user.image=null;
        // await USER.save();

        return res.status(200).send("profile image removed succesfully");
    }
     catch(err){
         console.log({err});
         return res.status(500).send("Internel Server Error");
     }
}

export const UserLogOutController=async(req,res,next)=>{
    try{
     
        res.cookie('jwt',"",{maxAge:1,secure:true,sameSite:"None"});


        return res.status(200).send("Logout SuccessFully");
    }
     catch(err){
         console.log({err});
         return res.status(500).send("Internel Server Error");
     }
}