import z from "zod";
import container from "../db.js";
import { Model } from "@lakshya004/cosmos-odm";

const user = z.object({
    Email: z.email().trim(),
    Company_Name: z.string(),
    Password: z.string().min(6),
    Status: z.string().default("pending"),
    Role: z.enum(["startup", "investor"])
})

// maor_sector:
// minor sector:
// series: seed
// user.id

const collection = await container.connectCollection("Groot-db", "startupinv_user");
const User = new Model(user, collection);

export default User;