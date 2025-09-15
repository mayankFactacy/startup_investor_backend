import { errorResponse } from "../utils/response.js";

export const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                return errorResponse(res, "Unauthorized. No role found", 401)
            }

            if (req.user.role !== requiredRole) {
                return errorResponse(res, "Access Denied: Only startup can access this resource", 403)
            }

            next(); 
        } catch (error) {
            console.log(error);
            return errorResponse(res, "Internal server error in authorization middleware")
        }
    };
};
