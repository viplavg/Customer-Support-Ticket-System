import { body } from "express-validator";

export const validateTicketMessage = [
    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ max: 2000 })
        .withMessage("Message cannot exceed 2000 characters"),
];