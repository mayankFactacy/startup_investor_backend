import z from "zod";
import container from "../db.js";
import { Model } from "@lakshya004/cosmos-odm";

const brands = z.object({

    Reference_Id: z.string().uuid(),
    Container_Name: z.string(),
    Registration_Number: z.string().uuid(),
    Website: z.string().url(),
    Facebook: z.string().nullable(),
    Instagram: z.string().nullable(),
    Linkedin: z.string().url(),
    Twitter: z.string().optional(),
    Medium: z.string().nullable(),
    Youtube: z.string().nullable(),
    Reddit: z.string().nullable(),
    Summary: z.string().nullable(),
    Logo: z.string().nullable(),
    Keywords: z.string().nullable(),
    id: z.string().uuid(),
    Brand: z.string(),
    Patent_Description: z.string(),
    Comp_Description: z.string(),
    KP_Description: z.string(),
    ESG_Description: z.string(),
    Inv_Description: z.string(),
    keywords: z.string().default("None"),


})

const collection = await container.connectCollection("Groot-db", "brands");
const Brands = new Model(brands, collection);

export default Brands
