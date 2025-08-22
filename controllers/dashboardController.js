import { qb } from "@lakshya004/cosmos-odm";
import Deals from "../models/deals.js";
import Investors from "../models/investors.js";
import News from "../models/news.js";

export async function getInvestorById(req, res) {
    try {
        const { id } = req.params;

        const investor = await Investors.findById(id);

        console.log(investor);


        if (!investor) {
            return res.status(404).json({
                error: "Investor not found"
            })
        }


        if (!investor.Investor_Deal_Ids || investor.Investor_Deal_Ids.length === 0) {
            return res.status(200).json([]);
        }

        const deals = qb().inArray("id", investor.Investor_Deal_Ids);
        const { resources } = await Deals.find({
            filter: deals,
            limit: 50
        });

        // deals.sort((deal_dateA, deal_dateB) => deal_dateB.Deal_Date - deal_dateA.Deal_Date);

        const response = resources.map(deal => ({
            Logo_Url: deal.Logo_Url,
            Investee: deal.Investee,
            ALT_Investee: deal.ALT_Investee,
            Deal_Date: deal.Deal_Date,
            Sector: deal.Sector
        }));




        res.status(200).json(response);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

export async function searchInvestor(req, res) {
    try {
        const { name, sector, type, focus, stage, country, city, page = 1, limit = 20 } = req.query;

        let query = qb();

        if (name) query = query.ilike("Investor", name);
        if (sector) query = query.ilike("Top_Sector", sector);
        if (type) query = query.inArray("InvestorType", type);
        if (focus) query = query.inArray("Top_Sector", focus);


        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { resources } = await Investors.find({
            filter: query,
            limit: parseInt(limit),
            offset

        })

        const response = resources.map(investor => ({
            Investor: investor.Investor,
            InvestorType: investor.Investor_Type,
            InvestorBio: investor.Investor_Bio

        }))

        return res.status(200).json({
            response,
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
        const { resources } = await News.find({})
        const sorted = resources.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });


        const paginated = sorted.slice(offset, offset + limit);

        const newsData = paginated.map(news=>({
            id:news.id,
            art_Id: news.Art_Id,
            title: news.title,
            date:news.date,
            url:news.url,
            content:news.content
        }))

        return res.status(200).json({
            page,
            limit,
            count: paginated.length,
            data: newsData
        });

    } catch (error) {
        console.log(error);
        return res.status(500)
            .json({
                error: "Internal server error"
            })

    }

}