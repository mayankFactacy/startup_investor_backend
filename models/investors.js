import { Model } from "@lakshya004/cosmos-odm";
import z from "zod";
import container from "../db.js";


const investors = z.object({
    Investor: z.string(), //
    id: z.uuid().optional(),//
    Investor_Bio: z.string(),
    ALT_Investors: z.array(
        z.tuple([
            z.string().nullable(),
            z.string()
        ])
    ),
    All_Sectors: z.array(z.string()),
    Output_CIN: z.string(),
    Legal_Name: z.string(),
    Entity_Type: z.string(),
    Investor_Type: z.string(),
    Website: z.url().optional(),
    Linkedin: z.url().optional(),
    Twitter: z.string().optional(),
    Person_Current_Designation: z.string(),
    Person_Current_Company: z.string(),
    Company_Phone_Number: z.string(),
    Email: z.string(),
    Address: z.string(),
    People: z.object({
        linkedin: z.array(z.url()),
        twitter: z.array(z.email()).optional(),
        email: z.array(z.email()).optional()
    }),
    Investor_Deal_Ids: z.array(z.uuid()),
    Latest_Investee: z.string(),
    Top_Sector: z.string(),
    Top_2_Occurring_Sectors: z.array(z.string()).length(2),
    Investee_Count_Dict: z.record(z.string()),
    Deal_Count_12: z.number().int().nonnegative(),
    Deal_Count_6: z.number().int().nonnegative(),
    Latest_Round: z.string(),
    Latest_Sector: z.string(),
    Latest_Date: z.string(),
    Investor_Theme: z.string()

}).loose();
const collection = await container.connectCollection("heimdall-db", "Investor-Id");
const Investors = new Model(investors, collection);

export default Investors