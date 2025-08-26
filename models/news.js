import z from "zod";
import container from "../db.js";
import { Model } from "@lakshya004/cosmos-odm";

const news = z.object({
  id: z.string(),
  Art_Id: z.string(),
  title: z.string(),
  date: z.string(), 
  url: z.string(),
  content: z.string()
}).strict();


const collection = await container.connectCollection("cdb-L1", "coinuse-1");
const News = new Model(news, collection);

export default News;