const { verifyToken } = require("./utils/pasetoService");
const { Users } = require("../models/usersModel");

/**
 * Middleware to validate Paseto Bearer token and Role
 * @param {string} requiredRole - Role required to access the route
 */
const validateToken = (requiredRole) => async (req, reply) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reply.code(401).send({
                success: false,
                message: "Unauthorized: Missing or invalid token format",
            });
        }

        const token = authHeader.split(" ")[1];

        try {
            const payload = await verifyToken(token);

            // Check if user exists and has role
            const user = await Users.findOne({ _id: payload.id }).lean();

            if (!user) {
                return reply.code(401).send({
                    success: false,
                    message: "Unauthorized: User not found",
                });
            }

            if (requiredRole && user.role !== requiredRole) {
                return reply.code(403).send({
                    success: false,
                    message: "Forbidden: Insufficient permissions",
                });
            }

            req.user = user; // Attach user payload to request
        } catch (err) {
            console.error("Token Verification Error:", err.message);
            return reply.code(401).send({
                success: false,
                message: "Unauthorized: Invalid or expired token",
            });
        }
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return reply.code(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { validateToken };
