import { qb } from "@lakshya004/cosmos-odm";
import Deals from "../models/deals.js";
import Investors from "../models/investors.js";
import News from "../models/news.js";
import Orders from "../models/order.js";

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


        const { resources: news } = await News.find({
            fields: {
                id: News.fields.id,
                art_Id: News.fields.Art_Id,
                title: News.fields.title,
                date: News.fields.date,
                url: News.fields.url,
                content: News.fields.content

            },
            orderBy: qb().order(qb().desc({ name: "__ts" })),
            limit: 10
        });

        return res.status(200).json({
            deals: {
                count: deals.length,
                data: deals,
            },
            news: {
                count: news.length,
                data: news
            }
        });

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({
            error: "Internal server error"
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


        return res.status(200).json({
            data: deals,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal server error"
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
        const { resources } = await Investors.find({
            fields: {
                Investor: Investors.fields.Investor,
                InvestorType: Investors.fields.Investor_Type,
                InvestorBio: Investors.fields.Investor_Bio
            },
            filter: query,
            limit: parseInt(limit),
            offset

        })



        return res.status(200).json({
            resources,
            page: parseInt(page),
            limit: parseInt(limit)
        })
    } catch (error) {

        console.log(error.stack);
        return res.status(500).json({
            error: "Internal server error"
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
                content: News.fields.content
            },
            orderBy: qb().order(qb().desc({ name: "__ts" })),
            limit: limit,
            offset: offset

        })



        return res.status(200).json({
            page,
            limit,
            count: news.length,
            data: news
        });

    } catch (error) {
        console.log(error);
        return res.status(500)
            .json({
                error: "Internal server error"
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
        const q = qb().eq(Orders.fields.userId, userId);


        const { resources: orders } = await Orders.find({
            filter: q,
            limit: 1, 
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ data: [], message: "No orders found" });
        }

        const order = orders[0];


       const recommended = (order.Recommended_Investors || [])
            .slice(0, 5)  
            .map(inv => ({
                name: inv.Investor,
                type: inv.Investor_Type,
                similarity: Math.round(inv.Average_Similarity) + "%"
            }));

        return res.status(200).json({ data: recommended });

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: "Internal server error" });
    }
}
