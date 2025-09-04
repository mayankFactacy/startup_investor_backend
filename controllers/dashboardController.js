import { qb } from "@lakshya004/cosmos-odm";
import Deals from "../models/deals.js";
import Investors from "../models/investors.js";
import News from "../models/news.js";
import Orders from "../models/order.js";
import Mca from "../models/mca.js";
import User from "../models/user.js";
import { success } from "zod";
import { tr } from "zod/v4/locales";


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

        if (!userId) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Bad request, Missing userId"
                })
        }
        const investorfilter = qb().eq(Orders.fields.userId, userId);

        const { resources: orders } = await Orders.find({
            filter: investorfilter,
            limit: 1,
            fields: {
                Recommended_Investors: {
                    name: "Recommended_Investors"
                }
            }
        })

        if (!orders || orders.length === 0) {
            return res.status(404)
                .json({
                    success: false,
                    message: "No order found"
                })
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

        const investorsDetails = investors
            .map(inv => ({
                name: inv.Investor,
                type: inv.Investor_Type,
                similarity: Math.round(inv.Average_Similarity),
                stage: inv.Stage || "Unknown"
            }))
            .slice(0, 5)

        if (!investorsDetails || investorsDetails.length === 0) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Investor Details Missing"
                })
        }


        const { resources: deals } = await Deals.find({
            fields: {
                Investee: Deals.fields.Investee,
                Raised: Deals.fields.Series_Amount,
                Date: Deals.fields.Deal_Date,
                Round: Deals.fields.Series_Detected,
                Logo: Deals.fields.Logo_Url,
                Sector: Deals.fields.Sector,
                ALT_Investee: Deals.fields.ALT_Investee

            },
            // filter:qb().eq(Deals.fields.Sector,)
            orderBy: qb().order(qb().desc({ name: "__ts" })),
            limit: 4
        })

        if (!deals || deals.length === 0) {
            return res.status(404)
                .json({
                    success: false,
                    message: "NO. Deals data found"
                })
        }


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
            limit: 10
        });

        if (!news || !news.length === 0) {
            return res.status(404)
                .json({
                    success: false,
                    message: "No News Data found"
                })
        }

        const { resources: user } = await User.find({
            fields: {
                Name: User.fields.Name
            },

            filter: qb().eq(User.fields.id, userId)
        })

        if (!user || user.length === 0) {
            return res.status(404)
                .json({
                    success: false,
                    message: "User Not Found"
                })
        }

        return res.status(200).json({
            loggedInUser: user[0].Name,
            stages: stageSummary,
            data: investorsDetails,
            deals: {
                count: deals.length,
                data: deals,
            },
            news: {
                count: news.length,
                data: news
            },
            success: true
        });

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
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
                .json({
                    success: false,
                    message: "Deals not found"
                })
        }


        return res.status(200).json({
            success: true,
            data: deals,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Internal server error"
        })

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
                InvestorBio: Investors.fields.Investor_Bio
            },
            filter: query,
            limit: parseInt(limit),
            offset

        })

        if (!investor || investor.length === 0) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Investor data not found"
                })

        }

        return res.status(200).json({
            success: true,
            investor,
            page: parseInt(page),
            limit: parseInt(limit)
        })
    } catch (error) {

        console.log(error.stack);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })

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
            return res.status(404)
                .json({
                    success: false,
                    message: "News not found"
                })
        }

        return res.status(200).json({
            success: true,
            page,
            limit,
            count: news.length,
            data: news
        });

    } catch (error) {
        console.log(error);
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error"
            })

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

        if (!userId) {
            return res.status(404)
                .json({
                    success: false,
                    message: "No user found"
                })
        }


        const q = qb().eq(Orders.fields.userId, userId);


        const { resources: orders } = await Orders.find({
            filter: q,
            limit: 1,
            fields: { Recommended_Investors: { name: "Recommended_Investors" } }
        });

        if (!orders || orders.length === 0) {
            return res.status(404)
            .json({
                    success: false,
                    message: "No orders found"
                });
               
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

        if(!investorsDetails || investorsDetails.length === 0){
            return res.status(404)
            .json({
                success:false,
                message:"Investor not found"
            })
        }

        return res.status(200)
            .json({
                success:true,
                stages: stageSummary,
                data: investorsDetails
            });

    } catch (error) {
        console.error(error.stack);
        return res.status(500)
        .json({ 
            success:false,
            message: "Internal server error" });
    }
}

export async function myCompany(req, res) {
    try {

        const userId = req.user.id;

        if(!userId){
            return res.status(404)
            .json({
                success:false,
                message:"User not found"
            })
        }

        //console.log("User id is", userId);

        const q = qb().eq(User.fields.id, userId);

        const { resources: users } = await User.find({
            fields: {
                Company_Name: User.fields.Company_Name
            },
            filter: q,
            limit: 1
        })

        if (!users || users.length === 0) {
            return res.status(404)
                .json({
                    message: "User Not Found"
                })


        }

        const companyName = users[0].Company_Name;

        console.log(companyName);

        const { resources: myCompanyData } = await Mca.find({
            filter: qb().eq({ name: "Mca_Data.Company_Name" }, companyName),
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

        if(!myCompanyData || myCompanyData.length === 0){
            return res.status(404)
            .json({
                success:false,
                message:"MCA data not found"
            })
        }


       
        return res.status(200).json({
            success:true,
            mca: myCompanyData[0]
        });

    } catch (error) {
        console.log(error);
        return res.status(500)
            .json({
                success:false,
                error: "Internal Server Error"
            })

    }
}

