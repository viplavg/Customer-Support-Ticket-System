import { body } from "express-validator";
import { PRIORITIES, CATEGORIES } from "./ticket.constants.js";

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