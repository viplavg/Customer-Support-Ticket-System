import {Router} from 'express';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { getDashboard } from './dashboard.controller.js';

const router = Router();

router
    .route("/")
    .get(
        authenticateUser,
        authorizeRoles("CUSTOMER", "AGENT", "ADMIN"),
        getDashboard
    )

export default router;    