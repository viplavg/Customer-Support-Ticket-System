import { body } from "express-validator";

export const registerValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

export const loginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    ,
  ];
};

export const changePasswordValidator = () => {
  return [
    body("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required"),

    body("newPassword")
    .notEmpty()
    .withMessage("New passaword is required")
    .isLength({min : 6})
    .withMessage("New password must be at least 6 characters long")
    .custom((value, {req})=>{
      if(value === req.body.currentPassword) {
        throw new Error(
          "New password must be different from current password"
        );
      }
      return true;
    }),
  ];
};