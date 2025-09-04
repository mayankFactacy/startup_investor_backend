import { Model } from "@lakshya004/cosmos-odm";
import z from "zod";
import container from "../db.js";



const lei = z.object({

    id: z.uuid(),
    Lei: z.string(),
    Lei_Data: z.object({
        Brand_Name: z.string().nullable(),
        Company_Name: z.string(),
        Cin: z.string(),
        Date_Of_Registration: z.string(),
        Status: z.string(),
        Registration_Authority_Id: z.string(),
        Registration_Status: z.string(),
        Category: z.string(),
        Sub_Category: z.string().optional(),
        Next_Renewal_Date: z.string(),
        Registered_Office_Address: z.string(),
        City: z.string(),
        Region_Code: z.string(),
        Country: z.string(),
        Postal_Code: z.string(),
        Legal_Form_Code: z.string(),
        Company_Type: z.string().nullable(),
        Managing_Lou_Number: z.string(),
        Successor_1: z.string().nullable(),
        Successor_Name_1: z.string().nullable(),
        Successor_2: z.string().nullable(),
        Successor_Name_2: z.string().nullable(),
        Successor_3: z.string().nullable(),
        Successor_Name_3: z.string().nullable(),
        Successor_4: z.string().nullable(),
        Successor_Name_4: z.string().nullable(),
        Successor_5: z.string().nullable(),
        Successor_Name_5: z.string().nullable(),
        Expiration_Date: z.string().nullable(),
        Relation: z.string().nullable(),
        Relationship_Date: z.string().nullable(),
        Related_Entity: z.string().nullable(),
        Alt_Company_Name: z.string().nullable(),
    })


})

const collection = await container.connectCollection("Groot-db", "lei");
const Lei = new Model(lei,collection);

export default Lei

