import express from "express";

const router = express.Router();
import { filterInvestor, getDealsNews,  getRecentDealsAndNews, RecentDeals } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/authenticate.js";
import Deals from "../models/deals.js";
import { authorizeRole } from "../middleware/authroizeRole.js";


router.get("/startup-dashboard", authenticate, authorizeRole("startup"), getRecentDealsAndNews);

router.get("/investors", filterInvestor);

router.get("/deals-news",getDealsNews);

router.get("/recent-deals",RecentDeals)

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

//router.post("/add-deals", async (req, res) => {
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

export default router;