import express from "express";
import { registerUser, loginUser, getProfile } from "./auth.controller.js";
import { authenticateUser, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { loginValidator, registerValidator } from "./auth.validation.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

const router = express.Router();

router.post(
    "/register",
    registerValidator(),
    validateRequest,
    registerUser
);

router.post(
    "/login",
    loginValidator(),
    validateRequest,
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