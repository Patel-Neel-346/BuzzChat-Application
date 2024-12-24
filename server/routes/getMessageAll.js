import express from "express";
import { getAllUserContactChats,uploadFileController} from "../controller/getMessageController.js";
import { verifyToken } from "../middlewares/userAuth.js";
import multer from "multer";
const getMessageAll=express.Router()
const upload=multer({dest:"uploads/files"});

getMessageAll.post('/ContactChat',verifyToken,getAllUserContactChats)
getMessageAll.post('/upload-file',verifyToken,upload.single("file"),uploadFileController)

export default getMessageAll;