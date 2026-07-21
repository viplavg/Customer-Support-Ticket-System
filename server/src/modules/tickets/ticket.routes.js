import {Router} from 'express';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { assignTicket, closeTicket, createTicket, deleteTicket, getTicketById, getTickets, reopenTicket, updateTicketStatus } from './ticket.controller.js';
import { validateAssignTicket, validateCreateTicket, validateTicketId, validateUpdateTicketStatus } from './ticket.validation.js';
import { validateTicketMessage } from './ticketMessage.validation.js';
import { addTicketMessage } from './ticketMessage.controller.js';
import { getTicketHistory } from './ticketHistory.controller.js';
import { USER_ROLES } from './ticket.constants.js';

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
        authorizeRoles(USER_ROLES.ADMIN),
        validateTicketId,
        validateAssignTicket,
        validateRequest,
        assignTicket
    )

 router
    .route("/:id/status")
    .patch(
        authenticateUser,
        authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.AGENT),
        validateTicketId,
        validateUpdateTicketStatus,
        validateRequest,
        updateTicketStatus
    )   
router  
    .route("/:id/messages")
    .post(
        authenticateUser,
        authorizeRoles(USER_ROLES.CUSTOMER, USER_ROLES.AGENT, USER_ROLES.ADMIN),
        validateTicketId,
        validateTicketMessage,
        validateRequest,
        addTicketMessage
    )

router
    .route("/:id/history")
    .get(
        authenticateUser,
        authorizeRoles(USER_ROLES.CUSTOMER, USER_ROLES.AGENT, USER_ROLES.ADMIN),
        validateTicketId,
        validateRequest,
        getTicketHistory
    )


router
    .route("/:id/reopen")
    .patch(
        authenticateUser,
        authorizeRoles(USER_ROLES.CUSTOMER, USER_ROLES.AGENT, USER_ROLES.ADMIN),
        validateTicketId,
        validateRequest,
        reopenTicket
    )

router
    .route("/:id/close")
    .patch(
        authenticateUser,
        authorizeRoles(USER_ROLES.AGENT, USER_ROLES.ADMIN),
        validateTicketId,
        validateRequest,
        closeTicket
    )

export default router;