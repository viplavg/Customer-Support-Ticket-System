import { body, param } from "express-validator";
import { PRIORITIES, CATEGORIES, TICKET_STATUS } from "./ticket.constants.js";

export const validateCreateTicket = [
    body("title")
    .trim()
    .notEmpty()
    .withMessage("Ticket title is required"),
    body("description")
    .trim()
    .notEmpty()
    .withMessage("Ticket description is required"),
    body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(PRIORITIES)
    .withMessage("Invalid priority"),
    body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(CATEGORIES)
    .withMessage("Invalid category")
];


export const validateTicketId = [
    param("id")
    .isMongoId()
    .withMessage("Invalid Ticket Id")
];

export const validateAssignTicket = [
    body("agentId")
    .notEmpty()
    .withMessage("Agent ID is required")
    .isMongoId()
    .withMessage("Invalid agent ID"),
];

export const validateUpdateTicketStatus = [
    body("status")
    .trim()
    .notEmpty()
    .withMessage("Ticket status is required")
    .isIn(TICKET_STATUS)
    .withMessage("Invalid Status")

];