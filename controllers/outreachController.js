import { success } from "zod";
import Orders from "../models/order.js";
import { qb } from "@lakshya004/cosmos-odm";
import Chats from "../models/chat.js";
import sendInvestorMail from "../utils/investorChatEmail.js";
import Investors from "../models/investors.js";


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
            return res.status(404)
                .json({
                    success: false,
                    message: "No investor is shortlisted"
                })
        }



        const investorid = shortListedInvestors[0].Investors[0].investorId

        const { resources: investorData } = await Investors.find({
            fields: {
                investorId: Investors.fields.id,
                Investor: Investors.fields.Investor,
                Investor_Type: Investors.fields.Investor_Type,
                Email: Investors.fields.Email

            },
            filter: qb().eq(Investors.fields.id, investorid)
        })

        if (!investorData || investorData.length === 0) {
            return res.Status(404)
                .json({
                    success: false,
                    message: " Investor data not found"
                })
        }



        if (!shortListedInvestors || shortListedInvestors.length === 0) {
            return res.status(404)
                .json({
                    success: false,
                    message: "No investor is shortlisted"

                })
        }

        return res.status(200)
            .json({
                success: true,
                message: investorData
            })
    } catch (error) {
        console.log(error.stack);
        return res.status(500)
            .json({
                success: false,
                error: "Internal Server Error"
            })
    }
}

export async function sendIntro(req, res) {
    try {

        const UserId = req.user.id;
        const UserEmail = req.user.email;
        console.log(UserEmail);

        const { investorId } = req.params;
        if (!investorId) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Investor id required"
                })
        }
        const { subject, body, attachments } = req.body;

        if (!body) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Body is required"
                })
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
            return res.status(404)
                .json({
                    success: false,
                    message: "No order found"
                })
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

        return res.status(201).json({
            success: true,
            intro,
            message: "Intro sent, investor status updated, and email delivered"
        });



    } catch (error) {
        console.log(error.stack);
        return res.status(500)
            .json({
                success: false,
                error: "Internal Server Error"


            })

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
            return res.status(404).json({
                success: false,
                message: "No chat found with this investor"
            });
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
            return res.status(404).json({
                success: false,
                message: "No order found"
            });
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

        return res.status(200).json({
            success: true,
            message: "Message added and status updated",
            newMessage
        });

    } catch (error) {
        console.error("Error in addMessage:", error.stack);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
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
            return res.status(404)
            .json({
                success:false,
                message:"No chat found"
            })
        }

        return res.status(200)
        .json({
            success:true,
            chat:chats
        })
        
    } catch (error) {
        console.log(error.stack);
        return res.status(500)
        .json({
            success:false,
            error:"Internal server error"
        })
        
    }
}
