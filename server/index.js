// const express=require("express");
// const dotenv=require("dotenv");
// const cors=require("cors");
// const cookieParser=require("cookie-parser");
// const mongoose=require("mongoose");


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import AuthRoute from "./routes/AuthRoutes.js";
import ContactRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import getMessageAll from "./routes/getMessageAll.js";


//transfer all .env variable to Procces So user can use it
dotenv.config();

const app=express();
const port=process.env.PORT || 3001;
const MongoDB=process.env.MONGODB_URL;

//connect database
mongoose.connect(MongoDB).then(()=>console.log("DataBase Conneted Succesfully")).catch((err)=>console.log(err.message));

//Use Cors
app.use(
    cors({
        origin:[process.env.ORIGIN],
        methods:["GET","POST","PUT","PATCH","DELETE"],
        allowedHeaders: ['Content-Type'],
        credentials:true,
    })
);

//static routes for stroing image
app.use('/uploads/profiles',express.static('uploads/profiles'));
app.use('/uploads/files',express.static('uploads/files'));

//cookie-parser for using cookies 
app.use(cookieParser());
app.use(express.json());

// setup Routes For Auth
app.use('/api/auth',AuthRoute);
app.use('/api/contacts',ContactRoutes)
app.use('/api/getMessages',getMessageAll)

const server=app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})
setupSocket(server);