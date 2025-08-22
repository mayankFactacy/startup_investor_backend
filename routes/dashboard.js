import express from "express";

const router = express.Router();
import { getDealsNews, getInvestorById, searchInvestor } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/authenticate.js";


router.get("/investors/:id/recent-deal", authenticate, getInvestorById);

router.get("/investors", searchInvestor);

router.get("/deals-news",getDealsNews);

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

export default router;