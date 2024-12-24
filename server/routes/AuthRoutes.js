import { Router } from "express";
import { GetUserInfo, LoginController, registor,UserLogOutController, UpdateUserDataController ,addProfileImageController , removeProfileImageController } from "../controller/userAuthController.js";
import { verifyToken } from "../middlewares/userAuth.js";
import multer from "multer";
const AuthRoute=Router();


const upload =multer({dest:"uploads/profiles/"})

AuthRoute.post('/signup',registor)
AuthRoute.post('/login',LoginController)
AuthRoute.get('/user-Info',verifyToken,GetUserInfo)
AuthRoute.post('/Logout',verifyToken,UserLogOutController)
AuthRoute.post('/user-Update',verifyToken,UpdateUserDataController)
AuthRoute.post('/add-Profile-Image',verifyToken,upload.single("profile-image"),addProfileImageController)
AuthRoute.delete('/remove-profile-image',
    verifyToken,
    removeProfileImageController
)

export default AuthRoute;
