import z from "zod";
import container from "../db.js";
import { Model } from "@lakshya004/cosmos-odm";


const sectors = z.object({
     id:z.uuid().optional(),
    Sectors: z.string(),
    Sector_Id: z.string(),
    Main: z.tuple(
        [z.string().uuid(),
            z.string()
        ]
    ),
    Sec1: z.string().nullable(),
    Sec2: z.string().nullable(),
    Sec3: z.string().nullable(),
    Sectors_Url: z.string().url(),
    Patent_SOS: z.array(
        z.string()
    ),
    Application_No_List:z.record(z.string(),z.string().uuid()),
    Deal_Id: z.array(
        z.string().uuid()
    )
}).loose();

const collection = await container.connectCollection("cdb-L1", "All-Sectors");
const Sectors = new Model(sectors,collection);

export default Sectors