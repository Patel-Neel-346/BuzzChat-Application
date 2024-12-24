import Message from "../models/messagesModel.js";
import {mkdirSync,renameSync} from "fs"
export const getAllUserContactChats=async(req,res,next)=>{
   try {
    const User1=req.userId;//your user id
    const User2=req.body.id;//other user id that pass through frontend api call

    if(!User1 || !User2)
    {
        return res.status(400).send("Both User Id Is Required");
    }
    
    const respones=await Message.find({
        $or:[
            {sender:User1,recipient:User2},
            {sender:User2,recipient:User1},
        ],
    }).sort({timestamp:1});

    return res.status(200).json({respones});
   } catch (error) {
    return res.status(500).send("Internal Server Error",error);
   }
   
}



export const uploadFileController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required!");
    }

    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;
    console.log(fileName);

    mkdirSync(fileDir, { recursive: true });

    renameSync(req.file.path, fileName);

    return res.status(200).json({ content: fileName });
  } catch (error) {
    console.error(error);
    // Include the error message in the response
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
