import {Router} from 'express';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { getDashboard } from './dashboard.controller.js';
import { USER_ROLES } from '../tickets/ticket.constants.js';

const router = Router();

router
    .route("/")
    .get(
        authenticateUser,
        authorizeRoles(USER_ROLES.CUSTOMER, USER_ROLES.AGENT, USER_ROLES.ADMIN),
        getDashboard
    )

export default router;    