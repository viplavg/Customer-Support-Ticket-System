import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }
};


export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.length) {
            return next();
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: 'Access denied: You do not have permission to perform this action',
            });
        }
        next();
    };
}