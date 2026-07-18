import express from "express";
import { registerUser, loginUser, getProfile, changePassword } from "./auth.controller.js";
import { authenticateUser, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { changePasswordValidator, loginValidator, registerValidator } from "./auth.validation.js";
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

router.patch(
    "/change-password",
    authenticateUser,
    changePasswordValidator(),
    validateRequest,
    changePassword
)


export default router;