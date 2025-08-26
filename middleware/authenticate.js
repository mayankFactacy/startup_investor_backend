import jwt from "jsonwebtoken";

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
            return res.status(401).json({ message: "Unauthorized. No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                error: "Unauthorized"
            })
        }

        req.user = decoded;
        if (!req.user.role && role) {
            req.user.role = role;
        }
        next();


    } catch (error) {

        console.log(error);
        return res.status(500).json({
            error: "Internal server error from middleware"
        })


    }
}


