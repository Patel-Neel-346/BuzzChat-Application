import mongoose from "mongoose";
import USER from "../models/userModel.js";
import Message from "../models/messagesModel.js"

export const SearchController=async(req,res,next)=>{
    try{
     const {Search} = req.body;
     console.log(Search);

     if(Search===undefined || Search===null)
     {
        return res.status(400).send("Search Item IS Required!");
     }

     //regular Express And Sanitizied User Data
     const sanitiziedSearch=Search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
     );

     const regex=new RegExp(sanitiziedSearch,"i");

     const Contacts=await USER.find({
        $and:[
            {_id:{$ne:req.userId}},
            {
                $or:[{firstName:regex},
                    {lastName:regex},
                    {Email:regex}
                    ],
            },
        ],
     });

     return res.status(200).json({Contacts});

     


    }
     catch(err){
         console.log({err});
         return res.status(500).send("Internel Server Error");
     }
}
export const GetContactsForDmList=async(req,res,next)=>{
    try{
        let {userId}=req;
        userId=new mongoose.Types.ObjectId(userId);

        const Contacts=await Message.aggregate([
            {
                $match:{
                    $or:[{sender:userId},{recipient:userId}],
                },
            },
            
            {
                $sort:{
                    timestamp:-1
                },
            },

            {
                $group:{
                    _id:{
                        $cond:{
                            if:{$eq:["$sender",userId]},
                            then:"$recipient",
                            else:"$sender",
                        },
                    },
                    lastMessageTime:{$first:"$timestamp"},
                },
            },
            
            {
                $lookup:{
                    from:"users",
                    localField:"_id",
                    foreignField:"_id",
                    as:"contactInfo",
                },
            },

            {
                $unwind:"$contactInfo",
            },

            {
                $project:{
                    _id:1,
                    lastMessageTime:1,
                    Email:"$contactInfo.Email",
                    firstName:"$contactInfo.firstName",
                    lastName:"$contactInfo.lastName",
                    image:"$contactInfo.image",
                    color:"$contactInfo.color",
                }
            },

            {
                $sort:{lastMessageTime:-1},
            },

        ]);
        

     return res.status(200).json({Contacts});

     


    }
     catch(err){
         console.log({err});
         return res.status(500).send("Internel Server Error");
     }
}