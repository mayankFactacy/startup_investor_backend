import express from "express";

const router = express.Router();
import { allSectors, filterInvestor, getDealsNews, getRecentDealsAndNews, myCompany, RecentDeals, removeShortListedInvestor, shortListInvestors, topInvestors } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRole } from "../middleware/authroizeRole.js";
import Investors from "../models/investors.js";
import { success } from "zod";
import Brands from "../models/brands.js";
import Deals from "../models/deals.js";
import Lei from "../models/lei.js";
import Orders from "../models/order.js";
import User from "../models/user.js";
import { qb } from "@lakshya004/cosmos-odm";
import { da, tr } from "zod/v4/locales";
import Chats from "../models/chat.js";
import container from "../db.js";


router.get("/startup-dashboard", authenticate, authorizeRole("startup"), getRecentDealsAndNews);

router.get("/investors", filterInvestor);

router.get("/deals-news", getDealsNews);

router.get("/recent-deals", RecentDeals)

router.get("/topInvestors", authenticate, authorizeRole("startup"), topInvestors)

router.get("/mycompany", authenticate, authorizeRole("startup"), myCompany);

router.get("/list-sectors", allSectors);

router.post("/shortlisting", authenticate, authorizeRole("startup"), shortListInvestors);

router.delete("/delete-list", authenticate, authorizeRole("startup"), removeShortListedInvestor);



// router.post("/add-investor", async (req, res) => {

//     try {
//         const investorData = req.body;
//         console.log(investorData);

//         const result = await Investors.insert(investorData);

//         if (!result) {
//             return res.status(400).json({
//                 error: "Missing fields"
//             })
//         }

//         return res.status(201).json({
//             success: true,
//             message: "Data inserted successfully"
//         })


//     } catch (error) {
//         console.log(error.stack);
//         return res.status(500)
//             .json({
//                 error: "Internal server error"
//             })

//     }

// })


router.get("/me", async (req, res) => {
    const { resources: user } = await User.find({})
    return res.status(200)
        .json({
            data: user
        })
})


// router.put("/update", async (req, res) => {
//     try {

//         const { updatedCompanyName, updatedName } = req.body;
//         const response = await User.update({
//             doc: { Name: updatedName, 
//                 Company_Name:updatedCompanyName
//              },

//             filter: qb().eq(User.fields.id, "a555d575-aa0f-4d13-8fc9-bc96fc2820e0"),
//         });

//         console.log(response);

//         if (!response) {
//             return res.status(500)
//                 .json({
//                     error: "Internal Server error"
//                 })
//         }

//         return res.status(200)
//             .json({
//                 message: "Updated Successfully"
//             })
//     } catch (error) {
//         console.log(error);

//     }
// })


// router.get("/deals", async (req, res) => {
//     try {
//         const { resources: deals } = await Deals.find({})
//         return res.status(200)
//             .json({
//                 data: deals
//             })

//     } catch (error) {
//         console.log(error);

//     }
// })

router.get("/inv", async (req, res) => {
    try {
        const { resources: investor } = await Investors.find({
            
        })
        return res.status(200)
            .json({
                data: investor
            })
    } catch (error) {
        console.log(error);

    }
})

// router.get("/lei", async (req, res) => {
//     try {

//         const { resources: lei } = await Lei.find({})

//         return res.status(200)
//             .json({
//                 data: lei
//             })

//     } catch (error) {
//         console.log(error);

//     }
// })

// router.get("/mca", async (req, res) => {
//     try {
//         const { resources: mca } = await Mca.find({});
//         return res.status(200)
//             .json({
//                 data: mca
//             })
//     } catch (error) {
//         console.log(error);

//     }
// })

//     router.get("/sectors", async (req, res) => {
//         try {
//             const { resources: sector } = await Sectors.find({})
//             return res.status(200)
//                 .json({
//                     data: sector
//                 })
//         } catch (error) {
//             console.log(error);

//         }
//     })

router.get("/getorder", async (req, res) => {
    try {

        //const q = qb().eq(Orders.fields.userId,"a555d575-aa0f-4d13-8fc9-bc96fc2820e0");
        const { resources: order } = await Orders.find({

        })

        //console.log(order);


        return res.status(200).json({
            data: order,
        })
    }
    catch (error) {
        console.log(error);

    }
})


// router.post("/add-deals", async (req, res) => {
//     try {
//         const dealsData = req.body;
//         const result = await Deals.insert(dealsData);


//         if (!result) {
//             return res.status(400).json({
//                 error: "Missing fields"
//             })
//         }

//         return res.status(201).json({
//             success: true,
//             message: "Data inserted successfully"
//         })



//     } catch (error) {
//         console.log(error.stack);
//         return res.status(500)
//             .json({
//                 error: "Internal server error"
//             })
//     }
// })

// router.get("/brands",async (req, res)=>{
//     try {

//         const {resources:b} = await Brands.find({})

//         return res.status(200)
//         .json({
//             success:true,
//             data:b
//         })

//     } catch (error) {
//         console.log(error);
//         return res.status(500)
//         .json({
//             success:false
//         })
//     }
// })

// router.get("/brands",async (req, res)=>{
//     try {

//         const {resources:b} = await Brands.find({})

//         return res.status(200)
//         .json({
//             success:true,
//             data:b
//         })

//     } catch (error) {
//         console.log(error);
//         return res.status(500)
//         .json({
//             success:false
//         })
//     }
// })

router.get("/intro", async (req, res) => {
    try {
        const q = qb()
        const { resources: inv } = await Chats.find({})
        const data = await Chats.findById("824a8943-b2dc-42f8-9462-ad3636462258")
        console.log("data: ",data);
        

        return res.status(200)
        .json({
            inv
        })

    } catch (error) {
        console.log(error);
        return res.status(500)
            .json({
                error: "Internal Server Error"
            })


    }
})

router.get("/invfrmd", async (req, res) => {
    try {

        const {investorId}= req.body;

        const { resources: order } = await Investors.find({
            filter: qb().eq(Investors.fields.id, investorId)
        })

        console.log(order[0].Investor_Type)

        return res.status(200)
        .json({
            success:true,
            data:order[0].Investor
        })

    } catch (error) {
        console.log(error);
        return res.status(500)
            .json({
                success: false,
                error: "Internal server error"
            })

    }
})

// const database = container.client.database("Groot-db");
// const chatsContainer = database.container("Investor-chats");

// router.delete("/delchat", authenticate, async (req, res) => {
//   try {
//     // In real use, get these from req.query or req.body
//     const id = "d661d026-8fde-4365-ba2a-9302ed05b334";
//     //const partitionKeyValue = "someUserIdOrOtherPartition"; // replace with actual PK value

//     const { resource } = await chatsContainer.item(id).delete();

//     return res.status(200).json({
//       success: true,
//       message: "Chat deleted successfully",
//       deleted: resource,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });
export default router;