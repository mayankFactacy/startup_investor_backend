import { success } from "zod";
import Orders from "../models/order.js";
import { qb } from "@lakshya004/cosmos-odm";
import Chats from "../models/chat.js";
import sendInvestorMail from "../utils/investorChatEmail.js";
import Investors from "../models/investors.js";
import { errorResponse, successResponse } from "../utils/response.js";


// export async function sendIntro (req, res){
//     try {



//     } catch (error) {
//         console.log(error.stack);
//         return res.status(500)
//         .json({
//             success:false,
//             error:"Internal Server Error"
//         })

//     }
// }

export async function getAllShortlistInvestor(req, res) {
    try {

        const UserId = req.user.id;

        const { resources: shortListedInvestors } = await Orders.find({
            fields: {
                Investors: Orders.fields.Investors
            },
            filter: qb().eq(Orders.fields.userId, UserId)

        })

        if (!shortListedInvestors || shortListedInvestors.length === 0) {
            return successResponse(res, {}, "No Investor shortlisted yet" );
        }

        const shortlisted = shortListedInvestors[0].Investors || [];
        const investorids = shortlisted.map(inv => inv.investorId)

        const { resources: investorData } = await Investors.find({
            fields: {
                investorId: Investors.fields.id,
                Investor: Investors.fields.Investor,
                Investor_Type: Investors.fields.Investor_Type,
                Email: Investors.fields.Email

            },
            filter: qb().inArray(Investors.fields.id, investorids)
        })

        if (!investorData || investorData.length === 0) {
            return errorResponse(res, "No investor found",404);
        }
        return successResponse(res, {investorData}, "All investors");
    } catch (error) {
        console.log(error.stack);
        return errorResponse(res)
    }
}

export async function sendIntro(req, res) {
    try {

        const UserId = req.user.id;
        const UserEmail = req.user.email;
        console.log(UserEmail);

        const { investorId } = req.params;
        if (!investorId) {
            return errorResponse(res, "Investor-Id required", 400);
        }
        const { subject, body, attachments } = req.body;

        if (!body) {
            return errorResponse(res, "Body is required", 400);
        }

        const intro = await Chats.insert({
            userId: UserId,
            investorId: investorId,
            subject: subject,
            messages: [
                {
                    sender: "Founder",
                    body,
                    attachments: attachments || []
                }
            ]
        })

        const { resources: order } = await Orders.find({
            fields: { Investors: Orders.fields.Investors },
            filter: qb().eq(Orders.fields.userId, UserId),
            limit: 1
        })

        if (!order || order.length == 0) {
            return errorResponse(res, "No Order found", 404);
        }

        const { resources: investorData } = await Investors.find({
            fields: {
                Email: Investors.fields.Email
            },
            filter: qb().eq(Investors.fields.id, investorId)

        })

        // console.log(investorData[0].Email);

        const investorEmail = investorData[0].Email;


        const orderData = order[0];
        console.log(orderData);


        const updatedInvestor = orderData.Investors.map(inv =>
            inv.investorId === investorId
                ? { ...inv, Status: "IntroSent" }
                : inv
        )

        await Orders.update({
            doc: { Investors: updatedInvestor },
            filter: qb().eq(Orders.fields.userId, UserId)
        })

        // Find investors details for the email chat



        // await sendInvestorMail(
        //     investorEmail,
        //     UserEmail,
        //     subject,
        //     body
        // )

      
        return successResponse(res,{intro},"Intro sent, Investor status updated and email delivered")
    } catch (error) {
        console.log(error.stack);
        return errorResponse(res);

    }
}


export async function addMessage(req, res) {
    try {
        const chatId = req.params.chatId; // this is investorId from route
        console.log(chatId, "chat id");

        const UserId = req.user.id;
        const { body, attachments, subject = "" } = req.body;
        const UserEmail = req.user.email;

        // prepare new message
        const newMessage = {
            sender: "Founder",
            body,
            subject,
            attachments: attachments || [],
            sentAt: new Date()
        };

        // 1. Find the chat by investorId
        const { resources: chats } = await Chats.find({
            filter: qb().eq(Chats.fields.investorId, chatId),
            limit: 1
        });

        if (!chats || chats.length === 0) {
            return errorResponse(res, " No chat found with this investor", 404);
        }

        const chat = chats[0];
        console.log(" Chat found:", chat);

        // 2. Find the order for this user
        const { resources: orders } = await Orders.find({
            fields: { Investors: Orders.fields.Investors },
            filter: qb().eq(Orders.fields.userId, UserId),
            limit: 1
        });

        if (!orders || orders.length === 0) {
            return errorResponse(res, "No order found", 404);
        }

        const orderData = orders[0];

        // 3. Get investor email
        const { resources: investorData } = await Investors.find({
            fields: { Email: Investors.fields.Email },
            filter: qb().eq(Investors.fields.id, chatId)
        });

        const investorEmail = investorData[0]?.Email;
        console.log(" Investor Email:", investorEmail);

        // 4. Update investor status inside order
        const updatedInvestors = orderData.Investors.map(inv =>
            inv.investorId === chatId ? { ...inv, Status: "FollowUp" } : inv
        );

        // 5. Add message to chat
        const updatedMessages = [...chat.messages, newMessage];

        console.log(" Updating chat with:", {
            updatedMessages
        });

        await Chats.update({
            doc: {
                messages: updatedMessages,

            },
            filter: qb().eq(Chats.fields.investorId, chatId),
        });

        console.log(" Chat updated successfully");

        // 6. Update order
        await Orders.update({
            doc: {
                Investors: updatedInvestors
            },
            filter: qb().eq(Orders.fields.userId, UserId)
        });

        console.log(" Order updated successfully");

        // 7. Send email (uncomment when ready)
        // await sendInvestorMail(investorEmail, UserEmail, subject, body);

        return successResponse(res,{newMessage},"Message added and status updated")

    } catch (error) {
        console.error("Error in addMessage:", error.stack);
        return errorResponse(res);
    }
}

export async function getChat ( req, res){
    try {

        const chatId = req.params.chatId;

        const {resources:chats}= await Chats.find({
            filter:qb().eq(Chats.fields.investorId,chatId),
            limit:1
        })

        if(!chats || chats.length === 0){
            return errorResponse(res, "No chat found", 404);
        }
        
        return successResponse(res,{
            chats
        })        
    } catch (error) {
        console.log(error.stack);
        return errorResponse(res);        
    }

}

