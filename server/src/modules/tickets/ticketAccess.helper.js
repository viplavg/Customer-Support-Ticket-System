import { ApiError } from "../../utils/ApiError.js";
import { USER_ROLES } from "./ticket.constants.js";

export const validateTicketAccess = ({
  ticket,
  userId,
  role,
}) => {
  if (role === USER_ROLES.ADMIN) {
    return;
  }

  if (role === USER_ROLES.CUSTOMER && !ticket.createdBy.equals(userId)) {
    throw new ApiError(
      403,
      "You are not authorized to access this ticket"
    );
  }

  if (role === USER_ROLES.AGENT && !ticket.assignedTo?.equals(userId)) {
    throw new ApiError(
      403,
      "You are not authorized to access this ticket"
    );
  }
};