import express from "express";
import { registerUser, loginUser, getProfile } from "./auth.controller.js";
import { authenticateUser, authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser
);

router.get(
    "/me",
    authenticateUser,
    getProfile
)

router.get(
    "/admin-test",
    authenticateUser,
    authorizeRoles("ADMIN"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin"
        })
    }
)


export default router;