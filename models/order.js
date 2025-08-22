import { Model } from "@lakshya004/cosmos-odm";
import z from "zod";
import container from "../db.js";


const orders = z.object({

    userId:z.uuid(),
    Major_Sector:z.string(),
    Minor_Sector: z.string(),
    Series: z.string()


})

const collection = await container.connectCollection("Groot-db", "orders");
const Orders = new Model(orders, collection);

export default Orders;

