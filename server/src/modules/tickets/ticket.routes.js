import {Router} from 'express';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { assignTicket, createTicket, deleteTicket, getTicketById, getTickets, updateTicketStatus } from './ticket.controller.js';
import { validateAssignTicket, validateCreateTicket, validateTicketId, validateUpdateTicketStatus } from './ticket.validation.js';
import { validateTicketMessage } from './ticketMessage.validation.js';
import { addTicketMessage } from './ticketMessage.controller.js';
import { getTicketHistory } from './ticketHistory.controller.js';

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
    .delete(
        authenticateUser,
        validateTicketId,
        validateRequest,
        deleteTicket
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

 router
    .route("/:id/status")
    .patch(
        authenticateUser,
        authorizeRoles("ADMIN", "AGENT"),
        validateTicketId,
        validateUpdateTicketStatus,
        validateRequest,
        updateTicketStatus
    )   
router  
    .route("/:id/messages")
    .post(
        authenticateUser,
        authorizeRoles("CUSTOMER", "AGENT", "ADMIN"),
        validateTicketId,
        validateTicketMessage,
        validateRequest,
        addTicketMessage
    )

router
    .route("/:id/history")
    .get(
        authenticateUser,
        authorizeRoles("CUSTOMER", "AGENT", "ADMIN"),
        validateTicketId,
        validateRequest,
        getTicketHistory
    )

export default router;