import z from "zod";
import container from "../db.js";
import { Model } from "@lakshya004/cosmos-odm";

const news = z.any();

const collection = await container.connectCollection("cdb-L1", "coinuse-1");
const News = new Model(news, collection);

export default News;