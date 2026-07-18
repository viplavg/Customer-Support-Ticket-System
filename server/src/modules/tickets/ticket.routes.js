import {Router} from 'express';
import { authenticateUser } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createTicket, getTickets } from './ticket.controller.js';
import { validateCreateTicket } from './ticket.validation.js';

const router = Router();

router
    .route("/")
    .post(
        authenticateUser,
        validateCreateTicket,
        validateRequest,
        createTicket
    )
    .get(
        authenticateUser,
        getTickets
    )

export default router;