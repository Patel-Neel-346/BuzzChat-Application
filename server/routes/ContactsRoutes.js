import { Router } from "express";
import { verifyToken } from "../middlewares/userAuth.js";
import { GetContactsForDmList, SearchController } from "../controller/ContactsController.js";

const ContactRoutes=Router();


ContactRoutes.post("/search",verifyToken,SearchController);

ContactRoutes.get("/getContactForDm",verifyToken,GetContactsForDmList);

export default ContactRoutes;
