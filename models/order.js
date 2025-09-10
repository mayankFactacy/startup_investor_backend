import { Model } from "@lakshya004/cosmos-odm";
import z from "zod";
import container from "../db.js";




const orders = z.object({
    id: z.uuid().optional(),
    userId: z.uuid(),
    Major_Sector: z.string(),
    Minor_Sector: z.string(),
    Series: z.string(),
    Recommended_Investors: z.array(z.object({
        id: z.uuid(),
        Investor: z.string(),
        Major_Sector: z.string(),
        Portfolio: z.string(),
        Top_Sectors_Invested: z.string(),
        Sub_Sector: z.string(),
        Stage: z.string(),
        Average_Similarity: z.number(),
    })).default([]),
    Investors:z.array(z.object({
        investorId:z.uuid(),
        Investor: z.string().optional(),
        TicketSize: z.number().optional(),
        Status: z.enum([
            "Shortlisted",
            "IntroSent",
            "FollowUp",
            "Committed",
            "NotHappening"
        ])

    }))
   


}).loose();

const collection = await container.connectCollection("Groot-db", "orders");
const Orders = new Model(orders, collection);

export default Orders;

