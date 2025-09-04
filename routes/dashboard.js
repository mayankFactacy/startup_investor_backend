import express from "express";

const router = express.Router();
import { filterInvestor, getDealsNews, getRecentDealsAndNews, myCompany, RecentDeals, topInvestors } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRole } from "../middleware/authroizeRole.js";


router.get("/startup-dashboard", authenticate, authorizeRole("startup"), getRecentDealsAndNews);

router.get("/investors", filterInvestor);

router.get("/deals-news", getDealsNews);

router.get("/recent-deals", RecentDeals)

router.get("/topInvestors", authenticate, authorizeRole("startup"), topInvestors)

router.get("/mycompany", authenticate, authorizeRole("startup"), myCompany);

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


// router.get("/me", async (req, res) => {
//     const { resources: user } = await User.find({})
//     return res.status(200)
//         .json({
//             data: user
//         })
// })


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

// router.get("/brands", async (req, res) => {
//     try {

//         const { resources: brands } = await Brands.find({

//         })
//         return res.status(200)
//             .json({
//                 data: brands
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

// router.get("/inv", async (req, res) => {
//     try {
//         const { resources: investor } = await Investors.find({})
//         return res.status(200)
//             .json({
//                 data: investor
//             })
//     } catch (error) {
//         console.log(error);

//     }
// })

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

// router.get("/sectors", async (req, res) => {
//     try {
//         const { resources: sector } = await Sectors.find({})
//         return res.status(200)
//             .json({
//                 data: sector
//             })
//     } catch (error) {
//         console.log(error);

//     }
// })

// router.get("/getorder", async (req, res) => {
//     try {

//         //const q = qb().eq(Orders.fields.userId,"a555d575-aa0f-4d13-8fc9-bc96fc2820e0");
//         const { resources: order } = await Orders.find({

//         })

//         console.log(order);


//         return res.status(200).json({
//             data: order,
//         })
//     }
//     catch (error) {
//         console.log(error);

//     }
// })

//     } catch (error) {
//         console.log(error)
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