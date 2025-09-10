import { DBConnection } from "@lakshya004/cosmos-odm";
import dotenv from "dotenv";

dotenv.config();

const container = new DBConnection(process.env.COSMOS_ENDPOINT, process.env.COSMOS_KEY)

export default container;


