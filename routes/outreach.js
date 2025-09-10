import express from "express"
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRole } from "../middleware/authroizeRole.js";
import { addMessage, getAllShortlistInvestor, sendIntro } from "../controllers/outreachController.js";
import Chats from "../models/chat.js";
import { qb } from "@lakshya004/cosmos-odm";

const router = express.Router();



router.get("/shortlisted", authenticate, authorizeRole("startup"),getAllShortlistInvestor);

router.post("/investor/:investorId/send-intro",authenticate,authorizeRole("startup"),sendIntro)

router.post("/chats/:chatId/messages",authenticate,authorizeRole("startup"),addMessage)

router.get('/chats/:chatId',async(req,res)=>{

    try {
        const chatId = req.params.chatId;

        const {resources: chat} = await Chats.find({
        filter: qb().eq(Chats.fields.investorId, chatId)
        })
        

        return res.status(200)
        .json({
            chat
        })
    } catch (error) {
        console.log(error);
        
    }

})

export default router;