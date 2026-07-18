import {Router} from 'express';
import { authenticateUser } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createTicket, getTicketById, getTickets } from './ticket.controller.js';
import { validateCreateTicket, validateTicketId } from './ticket.validation.js';

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

router
    .route("/:id")
    .get(
        authenticateUser,
        validateTicketId,
        validateRequest,
        getTicketById
    )



export default router;