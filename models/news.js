import z from "zod";
import container from "../db.js";
import { Model } from "@lakshya004/cosmos-odm";

const news = z.object({
  id: z.uuid().optional(),
  Art_Id: z.string(),
  title: z.string(),
  date: z.string(), 
  url: z.string(),
  content_cl: z.string(),
  headline:z.string(),
  image:z.string(),
  published_date: z.string(),
  published_date_time: z.string()
}).strict().loose();


const collection = await container.connectCollection("cdb-L1", "AICITE-IC");
//const collection = await container.connectCollection("cdb-L1", "Person-all");
const News = new Model(news, collection);

export default News;