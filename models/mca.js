const { Model } = require("@lakshya004/cosmos-odm")
const { default: z } = require("zod")
const container = require("../db")

const mca = z.object(
    {
        id: z.string(),
        Cin: z.string("Cin number is required"),
        Mca_Data: z.object({
            Brand_Name: z.string(),
            Company_Name: z.string(),
            Date_Of_Registration: z.string(),
            Month_Name: z.string(),
            Roc: z.string().nullable(),
            status: z.string(),
            Category: z.string(),
            Class: z.string(),
            Company_Type: z.string(),
            Authorized_Capital: z.string(),
            Paidup_Capital: z.string(),
            Activity_Code: z.number(),
            Activity_Description: z.string(),
            Registered_Office_Address: z.string(),
            Email: z.string().trim().email(),
            Latest_Year_Annual_Return: z.string().nullable(),
            Latest_Year_Financial_Statement: z.string().nullable(),
            Obligation_Of_Contribution: z.string().nullable(),
            Number_Of_Partners: z.string().nullable(),
            Number_Of_Designated_Partners: z.string().nullable(),
            District: z.string().nullable(),
            Long_Description: z.string().nullable(),
            Code_Description: z.string(),
            Factacy_Industrial_Classification: z.array(
                z.tuple(
                    [
                        z.string().uuid(),
                        z.string()
                    ]
                )
            ),
            Summary: z.string(),
            Turnover_Above: z.string().nullable(),
            Gst_Number: z.string(),
            Series: z.string().nullable(),
            Amount: z.string().nullable(),
            Investors: z.string().nullable(),
            Lei: z.string().nullable(),
            Website: z.string(),
            Linkedin: z.string(),
            EMail: z.string().trim().email().optional(),
            Facebook: z.string(),
            Instagram: z.string().optional(),
            Youtube: z.string().optional(),
            Logo: z.string().url(),
            Keywords: z.string(),
            Badges: z.array(
                z.string()
            ),
            Twitter: z.string(),
            Brand_Id: z.object({
                Factacy: z.string().uuid(),
                Startupinvestors: z.string().uuid()
            })


        })
    })

const collection = await container.connectCollection("Groot-db", "tieGlobalUser");
const Mca = new Model(mca, collection);
module.exports = Mca;


 
 
// {
//     "id": "d6d95316-9d58-47d5-9bf6-c693fb71df98",
//     "Cin": "U93090DL2018PTC331081",
//     "Mca_Data": {
//         "Brand_Name": "Factacy",
//         "Company_Name": "Factacy Private Limited",
//         "Date_Of_Registration": "2018-03-16",
//         "Month_Name": "March",
//         "State": "Delhi",
//         "Roc": null,
//         "Status": "Active",
//         "Category": "Company Limited By Shares",
//         "Class": "Private Company",
//         "Company_Type": "Non Govt Company",
//         "Authorized_Capital": "500000",
//         "Paidup_Capital": "318870",
//         "Activity_Code": 93090,
//         "Activity_Description": "Community, Personal & Social Services",
//         "Registered_Office_Address": "279, Mukherjee Nagar, Delhi-110009",
//         "Email": "connect@factacy.ai",
//         "Latest_Year_Annual_Return": null,
//         "Latest_Year_Financial_Statement": null,
//         "Obligation_Of_Contribution": null,
//         "Number_Of_Partners": null,
//         "Number_Of_Designated_Partners": null,
//         "District": null,
//         "Long_Description": null,
//         "Code_Description": "Other Service Activities",
//         "Factacy_Industrial_Classification": [
//             [
//                 "990e6d76-ee06-4426-a97c-f0371af3a1c2",
//                 "DeepTech"
//             ]
//         ],
//         "Summary": "StartupInvestors.ai is a cutting-edge platform that specializes in providing the most accurate list of startup investors in India. Founded in 2018, this innovative service aims to jumpstart fundraising efforts by connecting startups with the most relevant investors from Factacy Insights. By offering tailored solutions, StartupInvestors.ai ensures that startups receive the best possible support for their growth and success.",
//         "Turnover_Above": null,
//         "Gst_Number": "07AAHCC4668A1ZT",
//         "Series": null,
//         "Amount": null,
//         "Investors": null,
//         "Lei": null,
//         "Website": "https://www.startupinvestors.ai/",
//         "Linkedin": "https://www.linkedin.com/company/factacy/",
//         "EMail": null,
//         "Facebook": "https://www.facebook.com/factacydotAI/",
//         "Instagram": null,
//         "Youtube": null,
//         "Logo": "https://factacymain.blob.core.windows.net/locator-logo/LOGOS/FACTACY_U93090DL2018PTC331081_logo.svg",
//         "Keywords": "Angel Investor Networks, Angel Investors, Early Stage Investors, Growth Stage Investors, Seed Round Investors, Angel Round Investors, Investors, Investors Database, List Of Accelerators, List Of Angel Investment Firms In India, List Of Investors In India, List Of Micro Vcs In India, List Of Private Equity Firms In India, List Of Startup Accelerators, List Of Venture Capital Firms In India, Startup Family Office, Startup Funding, Startup Funding Database, Startup Funding Information, Startup Funding Venture Capital, Startup Fundraising News, Venture Capital Database, Venture Funds In India, Venture Partners",
//         "Badges": [
//             "Inventor"
//         ],
//         "Twitter": "https://twitter.com/FactacyAI/",
//         "Brand_Id": {
//             "Factacy": "2079a1dc-fc57-4e0d-9164-c87f71f939ad",
//             "Startupinvestors.Ai": "7513ec3e-4d46-405f-9f1e-6b4a5addd6b8"
//         }
//     },
//     "_rid": "b-4sAIpp3qkBAAAAAAAAAA==",
//     "_self": "dbs/b-4sAA==/colls/b-4sAIpp3qk=/docs/b-4sAIpp3qkBAAAAAAAAAA==/",
//     "_etag": "\"6b008056-0000-2000-0000-68396df60000\"",
//     "_attachments": "attachments/",
//     "_ts": 1748594166
// }
// Startup Investors
// Most Accurate list of Startup Investors in india specific to your startup. Jumpstart your fund raise with the most relevant list of investors from Factacy Insights.
 
// lei:
 
// {
//     "id": "0b590380-d296-41a2-aab9-703c2c47c3d8",
//     "Lei": "21380011ALLBLLE1GV72",
//     "Lei_Data": {
//         "Brand_Name": null,
//         "Company_Name": "La Fantana Srl",
//         "Cin": "J40/1198/2016",
//         "Date_Of_Registration": "2016-04-10",
//         "Status": "Active",
//         "Registration_Authority_Id": "RA000497",
//         "Registration_Status": "Issued",
//         "Category": "General",
//         "Sub_Category": null,
//         "Next_Renewal_Date": "2024-02-23",
//         "Registered_Office_Address": "Bd Garii Obor Nr 8C Sect 2 Bucuresti",
//         "City": "Bucharest",
//         "Region_Code": "RO-B",
//         "Country": "RO",
//         "Postal_Code": "021784",
//         "Legal_Form_Code": "XHN1",
//         "Company_Type": null,
//         "Managing_Lou_Number": "213800WAVVOPS85N2205",
//         "Successor_1": null,
//         "Successor_Name_1": null,
//         "Successor_2": null,
//         "Successor_Name_2": null,
//         "Successor_3": null,
//         "Successor_Name_3": null,
//         "Successor_4": null,
//         "Successor_Name_4": null,
//         "Successor_5": null,
//         "Successor_Name_5": null,
//         "Expiration_Date": null,
//         "Relation": null,
//         "Relationship_Date": null,
//         "Related_Entity": null,
//         "Alt_Company_Name": null
//     },
//     "_rid": "b-4sANsBEccBAAAAAAAAAA==",
//     "_self": "dbs/b-4sAA==/colls/b-4sANsBEcc=/docs/b-4sANsBEccBAAAAAAAAAA==/",
//     "_etag": "\"12010578-0000-2000-0000-67da95260000\"",
//     "_attachments": "attachments/",
//     "_ts": 1742378278
// }
 
// all sector:
 
 
// {
//     "id": "2b5db282-ff78-46c6-810e-1cd58f6fbbea",
//     "Sectors": "Electronic Manufacturing",
//     "Sector_Id": "28",
//     "Main": [
//         "2b5db282-ff78-46c6-810e-1cd58f6fbbea",
//         "Electronic Manufacturing"
//     ],
//     "Sec1": null,
//     "Sec2": null,
//     "Sec3": null,
//     "Sectors_Url": "https://factacymain.blob.core.windows.net/ic-logo/electricalmanufacturing-1.svg",
//     "Patent_SOS": [
//         "Climbing Tree and Pole Device: This invention is a device for climbing trees and poles, providing a safer and more efficient way for personnel to ascend. The device is made from mild steel, with semi-circular portions connected by screws, nuts, and bolts. It also features pedals for stability while climbing.",
//         "Lubricating System: This patent describes a progressive distributor for dispensing lubricants to a consumer, with sensors to detect lubricant pressure within the system. A control device receives measurements from the sensors and uses them to determine lubricant cycles, comparing the average pressure of a cycle to a normal system pressure to assess the state of the system.",
//         "Encapsulated LED Engine: This patent presents an encapsulated LED engine with a circuit board, LED arrays, a pre-molded encapsulation layer, and a frame. The encapsulation layer includes lenses over the LEDs, and the metal sheet has apertures for the lenses to extend through. This design provides a more efficient and protected LED lighting solution.",
//         "Health Monitoring Device: This patent features a health monitoring device with a housing containing various health monitoring apparatuses, a processor to collect and transmit health parameter data, and a memory to store the data. The device includes resistive heaters, a pulse oximeter, an electric respiration sensor, a single lead ECG, a thermistor, a battery, a gel pad, and an LED strip for indication. It can detect, measure, and analyze a user's physical health condition.",
//         "Defreezing Device: This patent presents a defreezing device with at least one piezoelectric element connected to a controlled power supply and a non-conducting layer contacting the piezoelectric element. The non-conducting layer separates the piezoelectric element from a solidified liquid, allowing any deformations in the element to translate to movement of the non-conducting layer. This device can be used for defreezing fuel in vehicle fuel lines, radiator liquid, and liquid in electricity generators, as well as water in pipelines."
//     ],
//     "Application_No_List": {
//         "202231026587 A": "5ec19f90-bfe4-472d-a630-4ce151e836e4",
//         "202347068426 A": "7e520830-d9c8-45a5-895b-0ab424e8f062",
//         "202224032101 A": "22cb6e5f-bb0f-4452-92ea-086fe14e61e0",
//         "202221026944 A": "27dbc823-d241-4f7a-be15-3733a68c0b12",
//         "202111051701 A": "e56dddb6-f048-407f-9a38-a2b33a3fd1b2"
//     },
//     "Deal_Id": [
//         "12103287-5484-42b4-8dff-39ce5f50274d",
//         "ef21695b-cc32-492a-b7b3-7cced0d2f507",
//         "9eb44eb2-2e5b-4aaf-91d1-285b31023cc8",
//         "1798aeea-c628-4f52-af39-699cd8d106d0",
//         "c064e645-37d2-457c-a3f2-3e9aee11ca7a",
//         "63e5b933-8460-4d91-a216-ffbf721d1722",
//         "f6d7bc1b-5fb7-491b-8da5-ec0b5313ca6f",
//         "ddd417b4-67ef-44fe-af66-8a7ec75ca01f",
//         "61fe08f7-0bac-4df5-b65c-5033c54d4ac5",
//         "bd39d4e8-7eb1-4e50-95fe-84c06ecd1fdf",
//         "cf88023c-4109-43fd-9e97-728d8a32cad0",
//         "f66e42b1-86bf-4e6c-a9d5-a729239ea9ce",
//         "a8c573f7-920e-4891-bcfd-f55dae714df4",
//         "564ad3fc-660e-4ecf-b25d-2c62896679d7",
//         "05f22546-caed-465e-8c9f-5871aa3865f3",
//         "18321a3f-f489-423f-99bb-1ac0c1f56aea"
//     ],
//     "_rid": "XD1qAPNCHOEBAAAAAAAAAA==",
//     "_self": "dbs/XD1qAA==/colls/XD1qAPNCHOE=/docs/XD1qAPNCHOEBAAAAAAAAAA==/",
//     "_etag": "\"42000eec-0000-2000-0000-67cd701c0000\"",
//     "_attachments": "attachments/",
//     "_ts": 1741516828
// }
 
// investor id :
 
 
 
// {
//     "Investor": "HARBOURVEST PARTNERS",
//     "id": "f58f2688-d0c5-48c5-82e1-f108c048e1d0",
//     "Art_Id": [
//         "efcf6d37-7c01-4b59-9e47-143dcc8666c1"
//     ],
//     "published_date": [
//         "2024-02-28"
//     ],
//     "Investor_Bio": "Harbourvest Partners is a prominent investment firm that focuses on a variety of sectors, including DeepTech, which involves companies specializing in advanced technology and innovative solutions. Among their recent investments, Harbourvest Partners has made significant Later Stage investments in cutting-edge firms such as Concentric AI and Waabi. These companies are making strides in their respective fields, with Concentric AI developing advanced artificial intelligence technology and Waabi concentrating on autonomous vehicle development. As a result, Harbourvest Partners continues to identify and support promising DeepTech companies to foster innovation and drive industry growth.",
//     "Investor_Deal_Ids": [
//         "b38d490f-5764-416c-b108-4ca524b8ee71",
//         "dd03a0e0-e23f-4aa7-a967-a6bd4e9b8cc1",
//         "ea5c4922-f3ca-452b-bd60-12aee10bd0ba",
//         "d0bd6efe-1659-4920-b7ea-7455fae19fd4"
//     ],
//     "Latest_Investee": "CONCENTRIC AI",
//     "Top_Sector": "Deeptech",
//     "Deal_Count_12": 1,
//     "Deal_Count_6": 0,
//     "Top_2_Occurring_Sectors": [
//         "Deeptech",
//         "Banking And Finance"
//     ],
//     "Investee_Count_Dict": {},
//     "Latest_Round": "B",
//     "Latest_Sector": "Deeptech",
//     "Latest_Date": "2024-10-25",
//     "Investor_Type": "Company",
//     "Website": "https://www.harbourvest.com/",
//     "Output_CIN": "NO",
//     "Legal_Name": "HARBOURVEST PARTNERS (CANADA) LIMITED",
//     "Entity_Type": "Foreign Company",
//     "Linkedin": "https://www.linkedin.com/company/harbourvest-partners/",
//     "Twitter": "No",
//     "Person_Current_Designation": "No",
//     "Person_Current_Company": "No",
//     "Company_Phone_Number": "+1 647 484 3022",
//     "Email": "No",
//     "Checked_By": "Satarupa",
//     "_rid": "Y95dAKF5b8ABAAAAAAAAAA==",
//     "_self": "dbs/Y95dAA==/colls/Y95dAKF5b8A=/docs/Y95dAKF5b8ABAAAAAAAAAA==/",
//     "_etag": "\"9301ff6a-0000-2000-0000-689d898b0000\"",
//     "_attachments": "attachments/",
//     "Investor_Theme": "Harbourvest Partners, a prominent investment firm, typically participates in Series B investments with prize pools ranging from $45M to $200M, strategically focusing on DeepTech companies that drive industry growth through advanced technology and innovative solutions.",
//     "_ts": 1755154827
// }

 
// deal-id ::
 
 
 
// {
//     "id": "b38d490f-5764-416c-b108-4ca524b8ee71",
//     "Investee": "ALCION",
//     "Output_CIN": "No",
//     "Legal_Name": "ALCION, INC",
//     "Entity_Type": "Foreign Company",
//     "Series_Amount": "$8M",
//     "Series_Detected": "SEED",
//     "Art_Id": [
//         "2fcacd0c-7e65-464b-9cba-5f6a2156d07c",
//         "931b68e9-c4d2-4a91-bc87-c466f8858cd8"
//     ],
//     "Series_Investor": [
//         "prominent angel investors,",
//         "backed by a cluster of esteemed angel investors,"
//     ],
//     "Title": [
//         "Alcion: Modern Data Management Company Receives $8 Million In Funding",
//         "Alcion's AI-driven backup-as-a-service platform secures $8m seed funding"
//     ],
//     "Aka_Flag": "DONE",
//     "date": [
//         "2023-06-19",
//         "2023-06-02"
//     ],
//     "published_date": "2023-06-02",
//     "Deal_Investors": [
//         [
//             "NULL",
//             "PROMINENT ANGEL INVESTORS"
//         ],
//         [
//             "NULL",
//             "BACKED BY A CLUSTER OF ESTEEMED ANGEL INVESTORS"
//         ]
//     ],
//     "Vision": [
//         "seed funding, expand our community",
//         "several strategic endeavours, community"
//     ],
//     "Corrected_Investee": "ALCION",
//     "Corrected_Amount": "$8M",
//     "Corrected_Series": "SEED",
//     "Corrected_Investors": [
//         [
//             "00ac7894-8830-4441-b020-47e2e9844561",
//             "UNDISCLOSED"
//         ]
//     ],
//     "Status": "Confirmed",
//     "Sector": "Information Technology",
//     "Corrected_Vision": [
//         "several strategic endeavours, community",
//         "seed funding, expand our community"
//     ],
//     "Locater_Flag": "DONE",
//     "Unique_date_time": [
//         "1687177575",
//         "1685705580"
//     ],
//     "All_Sectors": "Information Technology# Tech Solutions# Security Services# nan",
//     "Logo_Url": "https://factacymain.blob.core.windows.net/locator-logo/LOGOS/ALCION_No_logo.svg",
//     "Deal_Date": 1685705580,
//     "Sector_Classification": [
//         [
//             "a0b4a96a-2ec8-4953-9f3d-17849c4cf524",
//             "Information Technology"
//         ],
//         [
//             "6e9e4a42-9701-4a3e-916d-0a0ed2dc4b9b",
//             "Tech Solutions"
//         ],
//         [
//             "b7843533-829b-4a49-b516-56d1d33deeb4",
//             "Security Services"
//         ]
//     ],
//     "ALT_Investee": [
//         [
//             "7e39ce18-6fa9-465a-b655-80d390d34679",
//             "HUNTRESS"
//         ],
//         [
//             "cd5d3169-449b-4991-8fe6-7eddbc57be69",
//             "HUNTRESS"
//         ]
//     ],
//     "IC_Flag": "Processed",
//     "Brand_Id": "96f8ecbd-b6f9-422d-b701-067642ab6cc8",
//     "_rid": "Y95dALnTc6wBAAAAAAAAAA==",
//     "_self": "dbs/Y95dAA==/colls/Y95dALnTc6w=/docs/Y95dALnTc6wBAAAAAAAAAA==/",
//     "_etag": "\"930199b8-0000-2000-0000-689d8a4e0000\"",
//     "_attachments": "attachments/",
//     "_ts": 1755155022
// }
 
// brands:::
 
// {
//     "Reference_Id": "751d60f6-7121-4d2a-b98e-79f7b0ccf98e",
//     "Container_Name": "mca",
//     "Registration_Number": "U74140MH2010PTC198983",
//     "Website": "NO",
//     "Facebook": null,
//     "Instagram": null,
//     "Linkedin": "https://www.linkedin.com/company/faering-capital-private-limited/?originalSubdomain=in",
//     "Twitter": "NO",
//     "Medium": null,
//     "Youtube": null,
//     "Reddit": null,
//     "Summary": null,
//     "Logo": null,
//     "Keywords": null,
//     "id": "b107cefc-d7ed-4f6f-9676-7f440cb534fa",
//     "Brand": "Faering Capital",
//     "Patent_Description": "Log in to find out more about Faering Capital's inventor and their patent innovations.",
//     "Comp_Description": "To know more about the rival companies of Faering Capital, please log in.",
//     "KP_Description": "For more information on the key people, their roles, and LinkedIn profiles at Faering Capital, please sign in.",
//     "ESG_Description": "To learn more about Faering Capital's Environment, Social, and Governance (ESG) score, please log in.",
//     "Inv_Description": "FAERING CAPITAL can consider investors like JAD HALAOUI, STORM VENTURES, NEON FUND for the next round of funding. A complete list of proposed Investors for FAERING CAPITAL can be downloaded from www.startupinvestors.ai",
//     "keywords": "None",
//     "_rid": "b-4sAJzT6DsBAAAAAAAAAA==",
//     "_self": "dbs/b-4sAA==/colls/b-4sAJzT6Ds=/docs/b-4sAJzT6DsBAAAAAAAAAA==/",
//     "_etag": "\"0a0064c3-0000-2000-0000-67cc9b500000\"",
//     "_attachments": "attachments/",
//     "_ts": 1741462352
// }