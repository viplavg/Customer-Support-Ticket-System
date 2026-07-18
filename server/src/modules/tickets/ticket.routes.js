import {Router} from 'express';
import { authenticateUser } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createTicket } from './ticket.controller.js';
import { validateCreateTicket } from './ticket.validation.js';

const router = Router();

router.post(
    "/",
    authenticateUser,
    validateCreateTicket,
    validateRequest,
    createTicket
)

export default router;