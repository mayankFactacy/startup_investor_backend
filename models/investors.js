import { Model } from "@lakshya004/cosmos-odm";
import z from "zod";
import container from "../db.js";


const investors = z.object({
    Investor: z.string(), //
    id: z.uuid().optional(),//
    Art_Id: z.array(z.uuid()),//
    published_date: z.array(z.string()),
    Investor_Bio: z.string(),
    Investor_Deal_Ids: z.array(z.uuid()),
    Latest_Investee: z.string(),
    Top_Sector: z.string(),
    Deal_Count_12: z.number().int().nonnegative(),
    Deal_Count_6: z.number().int().nonnegative(),
    Top_2_Occurring_Sectors: z.array(z.string()).length(2),
    Investee_Count_Dict: z.record(z.string()),
    Latest_Round: z.string(),
    Latest_Sector: z.string(),
    Latest_Date: z.string(),
    Investor_Type: z.string(),
    Website: z.url().optional(),
    Output_CIN: z.string(),
    Legal_Name: z.string(),
    Entity_Type: z.string(),
    Linkedin: z.url().optional(),
    Twitter: z.string().optional(),
    Person_Current_Designation: z.string(),
    Person_Current_Company: z.string(),
    Company_Phone_Number: z.string(),
    Email: z.string()
})

const collection = await container.connectCollection("heimdall-db", "Investor-Id");
const Investors = new Model(investors, collection);

export default Investors