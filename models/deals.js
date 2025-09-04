import z from "zod";
import container from "../db.js";
import { Model } from "@lakshya004/cosmos-odm";


const deals = z.object(
    {
        id: z.uuid(),
        Investee: z.string(),
        Output_CIN: z.string(),
        Legal_Name: z.string(),
        Entity_Type: z.string(),
        Series_Amount:z.string(),
        Series_Detected: z.string(),
        Art_Id: z.array(z.uuid()),
        Series_Investor:z.array(z.string()),
        Title: z.array(z.string()),
        Aka_Flag: z.string(),
        date: z.array(z.string()),
        published_date: z.string(),
        Deal_Investors: z.array(
            z.tuple(
                [z.string().nullable(),z.string()]
            )
        ),
        Vision: z.array(z.string()),
        Corrected_Investee: z.string(),
        Corrected_Amount: z.string(),
        Corrected_Series: z.string(),
        Corrected_Investors:z.array(
            z.tuple([
                    z.uuid(),
                    z.string()
            ])
        ),
        Status: z.string(),
        Sector: z.string(),
        Corrected_Vision: z.array(z.string()),
        Locater_Flag: z.string(),
        Unique_date_time: z.array(z.string().regex(/^\d+$/)),
        All_Sectors: z.string(),
        Logo_Url:z.url(),
        Deal_Date: z.number().int().nonnegative(),
        Sector_Classification:
        z.array(
            z.tuple([
                z.uuid(),
                z.string()
            ])
        ),
        ALT_Investee:z.array(
            z.tuple([
                z.uuid(),
                z.string()
            ])
        ),
        IC_Flag: z.string(),
        Brand_Id: z.uuid()
    }
)


const collection = await container.connectCollection("heimdall-db", "Deal-Id");
const Deals = new Model(deals,collection);

export default Deals