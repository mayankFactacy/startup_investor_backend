import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";


export const authenticate = (req, res, next) => {
    try {
        let token = null;
        let role = null;

        // const cookies = req.cookies;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
            console.log("Checked and verified from headers");

        }

        if (!token && req.cookies) {
            for (const [key, value] of Object.entries(req.cookies)) {
                if (typeof value === "string" && value.split(".").length === 3) {
                    token = value;
                    role = key;
                    break;
                }
            }
        }



        if (!token) {
            return errorResponse(res, "Unauthorized, No token found", 401);
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
           return errorResponse(res, "Unauthorized", 401)
        }

        req.user = decoded;
        if (!req.user.role && role) {
            req.user.role = role;
        }
        next();


    } catch (error) {

        console.log(error);
       return errorResponse(res)


    }
}


