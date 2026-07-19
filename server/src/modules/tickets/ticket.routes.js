import {Router} from 'express';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { assignTicket, createTicket, getTicketById, getTickets } from './ticket.controller.js';
import { validateAssignTicket, validateCreateTicket, validateTicketId } from './ticket.validation.js';

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

router
    .route("/:id/assign")
    .patch(
        authenticateUser,
        authorizeRoles("ADMIN"),
        validateTicketId,
        validateAssignTicket,
        validateRequest,
        assignTicket
    )

export default router;