import { qb } from "@lakshya004/cosmos-odm";
import Deals from "../models/deals.js";
import Investors from "../models/investors.js";
import News from "../models/news.js";
import Orders from "../models/order.js";
import Mca from "../models/mca.js";
import User from "../models/user.js";
import Sectors from "../models/sectors.js";
import { errorResponse, successResponse } from "../utils/response.js";


// export async function getInvestorById(req, res) {
//     try {
//         const { id } = req.params;

//         const investor = await Investors.findById(id);

//         console.log(investor);


//         if (!investor) {
//             return res.status(404).json({
//                 error: "Investor not found"
//             })
//         }


//         if (!investor.Investor_Deal_Ids || investor.Investor_Deal_Ids.length === 0) {
//             return res.status(200).json([]);
//         }

//         const deals = qb().inArray(Deals.fields.id, investor.Investor_Deal_Ids);
//         const { resources } = await Deals.find({
//             filter: deals,
//             limit: 50
//         });

//         // deals.sort((deal_dateA, deal_dateB) => deal_dateB.Deal_Date - deal_dateA.Deal_Date);

//         const response = resources.map(deal => ({
//             Logo_Url: deal.Logo_Url,
//             Investee: deal.Investee,
//             ALT_Investee: deal.ALT_Investee,
//             Deal_Date: deal.Deal_Date,
//             Sector: deal.Sector
//         }));




//         res.status(200).json(response);

//     } catch (error) {
//         console.log(error.stack);
//         return res.status(500).json({
//             error: "Internal server error"
//         })
//     }
// }

export async function getRecentDealsAndNews(req, res) {
    try {
        const userId = req.user.id;

        const [ordersRes, dealsRes, newsRes, userRes] = await Promise.all([
            Orders.find({
                filter: qb().eq(Orders.fields.userId, userId),
                limit: 1,
                fields: {
                    Recommended_Investors: { name: "Recommended_Investors" },
                    Investors: { name: "Investors" }
                }

            }),
            Deals.find({
                fields: {
                    Investee: Deals.fields.Investee,
                    Raised: Deals.fields.Series_Amount,
                    Date: Deals.fields.Deal_Date,
                    Round: Deals.fields.Series_Detected,
                    Logo: Deals.fields.Logo_Url,
                    Sector: Deals.fields.Sector,
                    ALT_Investee: Deals.fields.ALT_Investee
                },
                orderBy: qb().order(qb().desc({ name: "__ts" })),
                limit: 4
            }),
            News.find({
                fields: {
                    id: News.fields.id,
                    art_Id: News.fields.Art_Id,
                    title: News.fields.title,
                    date: News.fields.date,
                    url: News.fields.url,
                    content: News.fields.content_cl,
                    headline: News.fields.headline,
                    image: News.fields.image,
                    published_date: News.fields.published_date,
                    published_date_time: News.fields.published_date_time
                },
                orderBy: qb().order(qb().desc({ name: "__ts" })),
                limit: 10
            }),
            User.find({
                fields: { Name: User.fields.Name },
                filter: qb().eq({ name: "id" }, userId)
            })
        ]);


        const { resources: orders } = ordersRes;
        const { resources: deals } = dealsRes;
        const { resources: news } = newsRes;
        const { resources: user } = userRes;


        if (!orders || orders.length === 0) {
            return errorResponse(res, "No order found", 404)
        }



        const order = orders[0];
        const investors = order.Recommended_Investors || [];
        const shortlistInvestor = order.Investors || [];

        //console.log(order.Investors, "INVESTOR ARRAY");

        const shortlistInvestorCount = shortlistInvestor.length;


        const counts = order.Investors.reduce((acc, i) => {
            if (["IntroSent", "FollowUp", "Committed"].includes(i.Status)) {
                acc[i.Status] = (acc[i.Status] || 0) + 1;
            }
            return acc;

        }, {
            IntroSent: 0,
            FollowUp: 0,
            Committed: 0,
        });


        const stageCount = {};
        investors.forEach(inv => {
            const stage = inv.Stage || "Unknown";
            stageCount[stage] = (stageCount[stage] || 0) + 1;
        });

        const stageSummary = Object.entries(stageCount).map(([stage, count]) => ({
            stage,
            count
        }));


        const investorsDetails = investors
            .map(inv => ({
                id: inv.id,
                name: inv.Investor,
                type: inv.Investor_Type,
                similarity: Math.round(inv.Average_Similarity),
                stage: inv.Stage || "Unknown"
            }))
            .slice(0, 5);


        if (!investorsDetails || investorsDetails.length === 0) {
            return errorResponse(res, " Investor Details Missing", 404);
        }


        if (!deals || deals.length === 0) {
            return errorResponse(res, "No Deals Data found", 404);
        }


        if (!news || news.length === 0) {
            return errorResponse(res, "No News Found", 404);
        }


        if (!user || user.length === 0) {
            return errorResponse(res, "User not found", 404);
        }

        return successResponse(res, {
            loggedInUser: user[0].Name,
            stages: stageSummary,
            shortlistedInvestors: shortlistInvestorCount,
            counts,
            data: investorsDetails,
            deals: {
                count: deals.length,
                data: deals
            },
            news: {
                count: news.length,
                data: news
            },
        },
            "Dashboard Data fetched"
        )
    } catch (error) {
        console.error("Error in getRecentDealsAndNews:", error.stack);
        return errorResponse(res);
    }
}


export async function RecentDeals(req, res) {
    try {
        const { resources: deals } = await Deals.find({
            fields: {
                Investee: Deals.fields.Investee,
                Raised: Deals.fields.Series_Amount,
                Date: Deals.fields.Deal_Date,
                Round: Deals.fields.Series_Detected,
                Logo: Deals.fields.Logo_Url,
                Sector: Deals.fields.Sector,
                ALT_Investee: Deals.fields.ALT_Investee

            }
        })

        if (!deals || deals.length === 0) {
            return res.status(404)
            return errorResponse(res, "Deals not found", 404);
        }

        return successResponse(res, { deals }, "Recent Deals Fetched")


    } catch (error) {
        console.log(error);
        return errorResponse(res);
    }
}


// export async function searchInvestor (req, res){
//     try {

//         const {name} = req.query;



//     } catch (error) {
//         console.log(error);
//         return res.status(500)
//         .json({
//             error:"Internal Server Error"
//         })


//     }
// }

export async function filterInvestor(req, res) {
    try {
        const { name, sector, type, focus, stage, country, city, page = 1, limit = 20 } = req.query;


        let query = qb();

        if (name) query = query.ilike(Investors.fields.Investor, name);
        if (sector) query = query.ilike(Investors.fields.Top_Sector, sector);
        if (type) query = query.inArray(Investors.fields.Investor_Type, type);
        if (focus) query = query.inArray(Investors.fields.Top_Sector, focus);


        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { resources: investor } = await Investors.find({
            fields: {
                Investor: Investors.fields.Investor,
                InvestorType: Investors.fields.Investor_Type,
                InvestorBio: Investors.fields.Investor_Bio,
                All_Sectors: Investors.fields.All_Sectors,
                Latest_Round: Investors.fields.Latest_Round
            },
            filter: query,
            limit: parseInt(limit),
            offset

        })

        if (!investor || investor.length === 0) {
            return errorResponse(res, "Investor data not found", 404);
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;

        return successResponse(res, {
            investor
        },

            "List of Investors after filter",
            200,
            {
                pageNum, limitNum
            }

        )
    } catch (error) {

        console.log(error.stack);
        return errorResponse(res);
    }
}


export async function getDealsNews(req, res) {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { resources: news } = await News.find({
            fields: {
                id: News.fields.id,
                art_Id: News.fields.Art_Id,
                title: News.fields.title,
                date: News.fields.date,
                url: News.fields.url,
                content: News.fields.content_cl,
                headline: News.fields.headline,
                image: News.fields.image,
                published_date: News.fields.published_date,
                published_date_time: News.fields.published_date_time
            },
            orderBy: qb().order(qb().desc({ name: "__ts" })),
            limit: limit,
            offset: offset

        })

        if (!news || news.length === 0) {
            return errorResponse(res, "News not found", 404);
        }

        return successResponse(res, {
            count: news.length,
            news
        },
            "Latest Deals News",
            200,
            { page, limit }
        )

    } catch (error) {
        console.log(error);
        return errorResponse(res);
    }
}

// export async function topInvestors(req, res) {
//     try {

//         const userId = req.user.id;
//         const q = qb().eq(Orders.fields.userId, userId);
//         const { resources: investors } = await Orders.find({
//             filter: q,
//             fields: {
//                 Investor: Orders.fields.Investor,
//                 Investor_Type: Orders.fields.Investor_Type,
//                 Average_Similarity: Math.round(Orders.fields.Average_Similarity) + "%"

//             },
//             limit: 5

//         })
//         const processedInvestors = investors.map(inv => ({
//             name: inv.Investor,
//             type: inv.Investor_Type,
//             similarity: Math.round(inv.Average_Similarity) + "%"
//         }));

//         console.log(processedInvestors);

//         return res.status(200).json({
//             data: processedInvestors,
//         })


//     } catch (error) {
//         console.log(error.stack);
//         return res.status(500)
//             .json({
//                 error: "Internal server error"
//             })

//     }


// }

export async function topInvestors(req, res) {
    try {
        const userId = req.user.id;

        const q = qb().eq(Orders.fields.userId, userId);

        const { resources: orders } = await Orders.find({
            filter: q,
            limit: 1,
            fields: { Recommended_Investors: { name: "Recommended_Investors" } }
        });

        if (!orders || orders.length === 0) {
            return errorResponse(res, "Order not found", 404);
        }

        const order = orders[0];

        const investors = order.Recommended_Investors || [];


        const stageCount = {};
        investors.forEach(inv => {
            const stage = inv.Stage || "Unknown";
            stageCount[stage] = (stageCount[stage] || 0) + 1;
        });

        const stageSummary = Object.entries(stageCount).map(([stage, count]) => ({
            stage,
            count
        }));

        const investorsDetails = investors.map(inv => ({
            name: inv.Investor,
            type: inv.Investor_Type,
            similarity: Math.round(inv.Average_Similarity),
            stage: inv.Stage || "Unknown"
        }))

        if (!investorsDetails || investorsDetails.length === 0) {
            return errorResponse(res, "Investor not found", 404);
        }

        return successResponse(res, {
            stages: stageSummary,
            investorsDetails
        },
            "Top Investors"

        )

    } catch (error) {
        console.error(error.stack);
        return errorResponse(res);
    }
}

export async function myCompany(req, res) {
    try {

        const userId = req.user.id;


        // console.log("User id is", userId);

        const q = qb().eq(User.fields.id, userId);

        const { resources: users } = await User.find({
            fields: {
                Company_Name: User.fields.Company_Name
            },
            filter: q,
            limit: 1
        })

        if (!users || users.length === 0) {
            return errorResponse(res, "User not found", 404);
        }

        const companyName = users[0].Company_Name;

        console.log(companyName);

        const { resources: myCompanyData } = await Mca.find({
            filter: qb().eq(Mca.fields.Mca_Data.Company_Name, companyName),
            fields: {
                Cin: Mca.fields.Cin,
                Company_Name: { name: "Mca_Data.Company_Name" },
                Logo_Url: { name: "Mca_Data.Logo" },
                Headquarter: { name: "Mca_Data.State" },
                Brand_Name: { name: "Mca_Data.Brand_Name" },
                Industry_Tags: { name: "Mca_Data.Factacy_Industrial_Classification" },
                Raised: { name: "Mca_Data.Amount" },
                Target: { name: "Mca_Data.Turnover_Above" }

            },
            limit: 1
        });

        console.log(myCompanyData);

        if (!myCompanyData || myCompanyData.length === 0) {
            return errorResponse(res, "Mca data not found", 404);
        }

        return successResponse(res, {
            mca: myCompanyData[0]
        },
            "My Company Data"
        )

    } catch (error) {
        console.log(error);
        return errorResponse(res);

    }
}

export async function allSectors(req, res) {
    try {

        const { resources: sectors } = await Sectors.find({
            fields: {
                Sectors: Sectors.fields.Sectors
            }

        })


        if (!sectors || sectors.length === 0) {
            return errorResponse(res, "Sectors not found", 404);
        }
        const sectorList = sectors.map(s => s.Sectors);

        return successResponse(res, {
            sectorList
        },
            "All Sectors"
        )

    } catch (error) {
        console.log(error);
        return errorResponse(res);

    }
}

export async function shortListInvestors(req, res) {
    try {
        const UserId = req.user.id;
        const { investorId } = req.body;

        if (!investorId) {
            return errorResponse(res, "Investor-Id required", 400);
        }


        const { resources: orders } = await Orders.find({
            fields: { Recommended_Investors: { name: "Recommended_Investors" }, Investors: { name: "Investors" } },
            filter: qb().eq(Orders.fields.userId, UserId),
            limit: 1
        });

        if (!orders || orders.length === 0) {
            return errorResponse(res, "Order not found", 404);
        }

        // Ensure we got a document
        const order = orders[0];
        if (!order) {
            return errorResponse(res, "User not found", 404);
        }

        // Ensure Recommended_Investors exists
        const investors = order.Recommended_Investors || [];
        // console.log("INVESTOR DATA _+++++++++++++++++++++++++++++++++++++++++++++", investors[0]);

        // console.log("Looking for:", investorId);
        // console.log("Investors in order:", investors);

        // Check if investor exists in recommendations
        const investor = investors.find(i => i.id === investorId);
        if (!investor) {
            return errorResponse(res, "Investor not in recommendations", 404);
        }

        // Initialize Shortlists if not present
        const shortlists = order.Investors || [];
        console.log("shortlisetd", shortlists);

        const shortlisted = shortlists.find(i => i.investorId === investorId);


        if (shortlisted) {
            return errorResponse(res, "Investor shortlisted already", 409);
        }

        // console.log(shortlisted, "Invstor shorltistd");


        // Add to shortlist
        order.Investors.push({
            investorId,
            Investor: investor.Investor,
            Status: "Shortlisted"
        });

        // console.log(investors[0].Investor, "--------SUIDUIYQWUIDYQUWDQUIDHQIWOD+++++++++++++++++++++++");
        // console.log("shortlited ", order);
        // Update document in Cosmos DB
        // await Orders.updateById({ doc: { Shortlists: order.Shortlists },
        // id: order.userId, });

        const q = qb();
        console.log("Id: ", UserId);

        await Orders.update({
            doc: { Investors: order.Investors },
            filter: q.eq(Orders.fields.userId, UserId)
        })

        console.log(order.Investors);



        return successResponse(res, {}, "Investor shortlisted successfully")
    } catch (error) {
        console.error(error.stack);
        return errorResponse(res);
    }
}


export async function removeShortListedInvestor(req, res) {
    try {
        const UserId = req.user.id;

        const { investorId } = req.body;

        if (!investorId) {
            return errorResponse(res, "Investor-Id missing", 400);
        }

        const { resources: order } = await Orders.find({
            fields: { Investors: { name: "Investors" } },
            filter: qb().eq(Orders.fields.userId, UserId),
            limit: 1
        })

        if (!order || order.length === 0) {
            return errorResponse(res, "Order not found", 404);
        }

        // console.log(order[0].Shortlists,"++++++++++++++++++++++");

        // console.log(investorId);


        const newShortlists = (order[0].Investors || []).filter((s) => s.investorId !== investorId);

        //console.log("new list: ",newShortlists);

        await Orders.update({
            doc: { Investors: newShortlists },
            filter: qb().eq(Orders.fields.userId, UserId)

        });

        return successResponse(res, {}, "Investor removed from shortlist successfully");



    } catch (error) {

        console.log(error.stack);
        return errorResponse(res);

    }
}

