export const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                return res.status(401).json({ error: "Unauthorized. No role found" });
            }

            if (req.user.role !== requiredRole) {
                return res.status(403).json({ error: "Access denied: Only startup can access this resource" });
            }

            next(); 
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error in authorization middleware" });
        }
    };
};
