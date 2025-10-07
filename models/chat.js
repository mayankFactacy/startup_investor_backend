import { Model } from "@lakshya004/cosmos-odm";
import z from "zod";
import container from "../db.js";

const mailChat = z.object({
    sender: z.enum([
        "Founder",
        "Investor"
    ]),
    body: z.string(),
    attachments: z.array(z.string()).optional(),
    sentAt: z.date().optional()

}).loose();

const chat = z.object({
    id: z.uuid().optional(),
    userId: z.uuid(),
    investorId: z.uuid(),
    subject: z.string().optional(),
    messages: z.array(mailChat),
    status: z.enum(["Open", "Closed", "Committed"]).default("Open"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()

}).loose();

const collection = await container.connectCollection("Groot-db", "Investor-chats");
const Chats = new Model(chat, collection);

export default Chats;