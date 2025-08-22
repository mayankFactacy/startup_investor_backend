import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    try {
        const cookies = req.cookies;

        if (!cookies || Object.keys(cookies).length === 0) {
            return res.status(401).json({ message: "Unauthorized. No cookies found" });
        }

        let token = null;
        let role = null;

        for (const [key, value] of Object.entries(cookies)) {

            if (typeof value === "string" && value.split(".").length === 3) {
                token = value;
                role = key;
                break;
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
        req.user.role=role;
        next();


    } catch (error) {

        console.log(error);
        return res.status(500).json({
            error: "Internal server error from middleware"
        })


    }
}


