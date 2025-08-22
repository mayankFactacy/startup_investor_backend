const { Model } = require("@lakshya004/cosmos-odm");
const { default: z } = require("zod");

const sectors = z.object({
     id: z.string().uuid(),
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
})

const collection = await container.connectCollection("Groot-db", "tieGlobalUser");
const Sectors = new Model(sectors,collection);

module.exports= Sectors;